from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from db import models, schemas
from db.database import get_db

router = APIRouter()

from agents.graph import graph_app
from agents.discovery_graph import discovery_app
from db.database import SessionLocal

# Langfuse is optional in local/dev environments; provide simple fallbacks
try:
    from langfuse.callback import CallbackHandler
    from langfuse import Langfuse
    HAS_LANGFUSE = True
except Exception:
    HAS_LANGFUSE = False
import uuid

# Dummy state for last refresh
last_refresh_time = None
is_refreshing = False

def trigger_refresh_pipeline():
    global is_refreshing, last_refresh_time
    is_refreshing = True
    print("Starting manual refresh pipeline...", flush=True)
    # Try to open a DB session; if it fails, continue but skip DB writes
    db = None
    try:
        db = SessionLocal()
    except Exception as e:
        print(f"Warning: could not open DB session, continuing without DB writes: {e}", flush=True)
    try:
        import glob
        import csv
        import os

        # Look for CSVs in container path or local repo public/data
        csv_files = glob.glob("/app/data/*.csv")
        if not csv_files:
            repo_csv_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data')
            repo_csv_dir = os.path.normpath(repo_csv_dir)
            csv_files = glob.glob(os.path.join(repo_csv_dir, "*.csv"))
            if not csv_files:
                print(f"No CSV files found in /app/data or {repo_csv_dir}", flush=True)
            
        for csv_path in csv_files:
            filename = os.path.basename(csv_path)
            with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
                reader = csv.reader(f)
                headers = next(reader, None)
                first_row = next(reader, None)
                if not headers or not first_row:
                    continue
                
                tool_id = first_row[0] if len(first_row) > 0 else f"unknown_{uuid.uuid4()}"
                tool_name = first_row[1] if len(first_row) > 1 else "Unknown Tool"
                
                print(f"Processing {tool_name} from {filename}...", flush=True)
                
                langfuse_handler = None
                if HAS_LANGFUSE:
                    try:
                        langfuse_handler = CallbackHandler(
                            session_id="refresh_session",
                            trace_name=f"Tool Extraction Refresh: {tool_name}"
                        )
                    except Exception as e:
                        print(f"Warning: failed to instantiate CallbackHandler: {e}", flush=True)
                
                initial_state = {
                    "tool_id": tool_id,
                    "tool_name": tool_name,
                    "category": filename,
                    "schema_fields": headers,
                    "raw_search_context": "",
                    "source_urls": [],
                    "extracted_data": {},
                    "original_data": {headers[i]: (first_row[i] if i < len(first_row) else None) for i in range(len(headers))},
                    "diff_summary": "",
                    "lifecycle_status": "",
                    "validation_passed": False,
                    "recall_count": 0,
                    "final_status": ""
                }
                
                if langfuse_handler is not None:
                    final_state = graph_app.invoke(initial_state, config={"callbacks": [langfuse_handler]})
                else:
                    final_state = graph_app.invoke(initial_state)
                print(f"Graph completed for {tool_name} with status: {final_state.get('final_status')}", flush=True)
                run_id = None
                if langfuse_handler is not None:
                    try:
                        run_id = langfuse_handler.get_trace_id()
                        print(f"DEBUG: Extracted trace_id={run_id} for {tool_name}", flush=True)
                        langfuse_handler.flush()
                        print(f"DEBUG: Handler flushed for trace {run_id}", flush=True)
                    except Exception as e:
                        print(f"WARNING: handling langfuse handler post-run: {type(e).__name__}: {e}", flush=True)
                        import traceback
                        traceback.print_exc()

                if HAS_LANGFUSE and run_id is not None:
                    try:
                        lf = Langfuse()
                        accuracy_score = 1.0 if final_state.get('validation_passed') else 0.0
                        print(f"DEBUG: Pushing Langfuse score for trace {run_id}: validation={final_state.get('validation_passed')}", flush=True)
                        lf.score(
                            trace_id=run_id,
                            name="accuracy",
                            value=accuracy_score,
                            comment="Automatic Validation/Ragas proxy score"
                        )
                        lf.flush()
                        print(f"DEBUG: Score pushed and flushed for trace {run_id}", flush=True)
                    except Exception as e:
                        print(f"ERROR: Failed to push Langfuse score: {type(e).__name__}: {e}", flush=True)
                        import traceback
                        traceback.print_exc()
                
                # Include diff summary in agent_reasoning for visibility in UI
                reasoning = f"Validation passed: {final_state.get('validation_passed')}. Diff: {final_state.get('diff_summary', '')}"
                new_record = models.StagingRecord(
                    category=final_state["category"],
                    original_id=final_state["tool_id"],
                    proposed_data=final_state["extracted_data"],
                    status="pending",
                    agent_reasoning=reasoning,
                    trace_id=run_id,
                    source_urls=final_state.get("source_urls", [])
                )
                if db is not None:
                    try:
                        db.add(new_record)
                        db.commit()
                    except Exception as e:
                        print(f"Failed to write staging record to DB: {e}", flush=True)
                else:
                    print(f"StagingRecord (db disabled): category={new_record.category} original_id={new_record.original_id} status={new_record.status} diff={reasoning}", flush=True)

        # After processing CSV rows, run discovery to find brand-new tools
        try:
            print("Starting Discovery pipeline...", flush=True)
            discovery_initial = {}
            discovery_results = discovery_app.invoke(discovery_initial)
            print(f"Discovery completed. Results summary: {discovery_results.get('trigger_results')}", flush=True)
            # Persist discovery trigger results as staging records so they appear in the UI
            try:
                trigger_results = discovery_results.get('trigger_results') or []
                for item in trigger_results:
                    name = item.get('name') or f"discovered_{uuid.uuid4()}"
                    status = item.get('status') or ''
                    trace = item.get('trace')
                    new_rec = models.StagingRecord(
                        category='discovered',
                        original_id=name.lower().replace(' ', '-'),
                        proposed_data={},
                        status='pending',
                        agent_reasoning=f"Discovery status: {status}",
                        trace_id=trace,
                        source_urls=[]
                    )
                    if db is not None:
                        try:
                            db.add(new_rec)
                            db.commit()
                        except Exception as e:
                            print(f"Failed to write discovery staging record to DB: {e}", flush=True)
                    else:
                        print(f"Discovery StagingRecord (db disabled): name={new_rec.original_id} status={new_rec.status} reason={new_rec.agent_reasoning}", flush=True)
            except Exception as e:
                print(f"Failed to persist discovery results: {e}", flush=True)
        except Exception as e:
            print(f"Discovery pipeline error: {e}", flush=True)
    except Exception as e:
        print(f"Error in refresh pipeline: {e}", flush=True)
    finally:
        db.close()
        last_refresh_time = datetime.now()
        is_refreshing = False
        print("Refresh pipeline completed.", flush=True)

@router.get("/status")
def get_status():
    return {
        "is_refreshing": is_refreshing,
        "last_refresh_time": last_refresh_time.isoformat() if last_refresh_time else None
    }

@router.post("/refresh")
def trigger_refresh(background_tasks: BackgroundTasks):
    global is_refreshing
    if is_refreshing:
        raise HTTPException(status_code=400, detail="Refresh is already in progress.")
    background_tasks.add_task(trigger_refresh_pipeline)
    return {"message": "Refresh pipeline triggered."}

@router.get("/staging", response_model=List[schemas.StagingRecordResponse])
def get_pending_staging_records(db: Session = Depends(get_db)):
    records = db.query(models.StagingRecord).filter(models.StagingRecord.status == "pending").all()
    return records

@router.post("/staging/{record_id}/approve")
def approve_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.StagingRecord).filter(models.StagingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if record.status != "pending":
        raise HTTPException(status_code=400, detail="Record is not pending")
    
    import os
    import csv

    # Write to CSV logic
    if record.category and record.proposed_data:
        # Determine CSV path
        csv_filename = record.category
        if not csv_filename.endswith(".csv"):
            csv_filename += ".csv"
        
        # Look in container path or local repo
        csv_path = f"/app/data/{csv_filename}"
        if not os.path.exists(csv_path):
            repo_csv_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data'))
            csv_path = os.path.join(repo_csv_dir, csv_filename)
        
        if os.path.exists(csv_path):
            try:
                # Read existing rows
                with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
                    reader = csv.reader(f)
                    rows = list(reader)
                
                if rows:
                    headers = rows[0]
                    updated = False
                    new_row = []
                    for header in headers:
                        # Try exact match, then lowercase/underscore
                        val = record.proposed_data.get(header)
                        if val is None:
                            val = record.proposed_data.get(header.lower().replace(" ", "_"))
                        if val is None:
                            val = record.proposed_data.get(header.strip())
                        new_row.append(str(val) if val is not None else "")
                    
                    # Check if we are updating an existing record
                    if record.original_id:
                        for i, row in enumerate(rows):
                            if i == 0: continue # Skip header
                            if len(row) > 0 and row[0] == record.original_id:
                                # Preserve ID if it got lost in the new row
                                if not new_row[0]:
                                    new_row[0] = row[0]
                                rows[i] = new_row
                                updated = True
                                break
                    
                    if not updated:
                        # Append new row
                        import uuid
                        if not new_row[0]:
                            new_row[0] = record.original_id or f"tool_{uuid.uuid4().hex[:8]}"
                        rows.append(new_row)
                    
                    # Write back to file
                    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
                        writer = csv.writer(f)
                        writer.writerows(rows)
            except Exception as e:
                print(f"Failed to update CSV {csv_path}: {e}")
        else:
            print(f"Warning: CSV file {csv_path} not found. Cannot write approved data.")
    
    if record.trace_id:
        try:
            lf = Langfuse()
            lf.score(
                trace_id=record.trace_id,
                name="human-in-the-loop",
                value=1.0,
                comment="Approved by human"
            )
            lf.flush()
        except Exception as e:
            print(f"Failed to push Langfuse score: {e}")
    
    record.status = "approved"
    db.commit()
    return {"message": f"Record {record_id} approved and merged to CSV."}

@router.post("/staging/{record_id}/reject")
def reject_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.StagingRecord).filter(models.StagingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    if record.trace_id:
        try:
            lf = Langfuse()
            lf.score(
                trace_id=record.trace_id,
                name="human-in-the-loop",
                value=0.0,
                comment="Rejected by human"
            )
            lf.flush()
        except Exception as e:
            print(f"Failed to push Langfuse score: {e}")

    record.status = "rejected"
    db.commit()
    return {"message": f"Record {record_id} rejected."}
