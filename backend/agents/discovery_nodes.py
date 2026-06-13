from typing import Dict, Any, List
from .search_provider import SearchFactory
import re
import glob
import csv
import os
from difflib import SequenceMatcher
import concurrent.futures


def market_scanner_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Searches multiple sources for recent AI tool announcements."""
    print("--> Market Scanner running...", flush=True)
    provider = SearchFactory.get_provider()
    queries = [
        "new AI tool released",
        "AI model released this week",
        "new LLM release",
        "AI tool announcement"
    ]
    results = []
    for q in queries:
        res = provider.search(q, num_results=5)
        for r in res:
            snippet = r.get("snippet") or ""
            link = r.get("link")
            results.append({"link": link, "snippet": snippet})

    state["raw_discovery_hits"] = results
    return state


def parser_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Parses raw snippets into candidate tool entries using heuristics."""
    print("--> Parser Node running...", flush=True)
    hits = state.get("raw_discovery_hits", [])
    candidates: List[Dict[str, Any]] = []
    name_pattern = re.compile(r"([A-Z][A-Za-z0-9\-]{2,}(?:\s+[A-Z][A-Za-z0-9\-]{2,})*)")
    version_pattern = re.compile(r"v?\s?(\d+\.\d+(?:\.\d+)?)")
    for h in hits:
        snippet = h.get("snippet", "")
        link = h.get("link")
        # Try to extract a candidate name and version
        name_match = name_pattern.search(snippet)
        ver_match = version_pattern.search(snippet)
        name = name_match.group(1) if name_match else None
        version = ver_match.group(1) if ver_match else None
        if not name and link:
            # derive name from URL
            name = os.path.basename(link).split('.')[0]
        if name:
            candidates.append({"name": name.strip(), "source": link, "version": version})

    state["candidates"] = candidates
    return state


def deduplicator_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """Loads existing CSVs and drops near-duplicates using fuzzy matching."""
    print("--> Deduplicator Node running...", flush=True)
    candidates = state.get("candidates", [])
    existing_names = set()
    data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    # If public/data not found relative, fallback to repo path
    repo_data_dir = os.path.join(os.path.dirname(__file__), "..", "..", "public", "data")
    if os.path.isdir(data_dir):
        csv_dir = data_dir
    elif os.path.isdir(repo_data_dir):
        csv_dir = repo_data_dir
    else:
        csv_dir = None

    if csv_dir:
        for csv_path in glob.glob(os.path.join(csv_dir, "*.csv")):
            try:
                with open(csv_path, newline='', encoding='utf-8', errors='ignore') as f:
                    reader = csv.reader(f)
                    headers = next(reader, None)
                    for row in reader:
                        if len(row) >= 2:
                            existing_names.add(row[1].strip().lower())
            except Exception:
                continue

    novel = []
    for c in candidates:
        name = c.get("name", "").lower()
        is_dup = False
        for en in existing_names:
            ratio = SequenceMatcher(None, name, en).ratio()
            if ratio > 0.85:
                is_dup = True
                break
        if not is_dup:
            novel.append(c)

    state["novel_candidates"] = novel
    return state


def trigger_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """For each novel candidate, call the main extraction graph asynchronously."""
    print("--> Trigger Node running...", flush=True)
    novel = state.get("novel_candidates", [])
    if not novel:
        return state

    # Lazy import to avoid circular dependencies at module import time
    from .graph import graph_app

    def invoke_for(candidate):
        init = {
            "tool_id": candidate.get("name").lower().replace(" ", "-"),
            "tool_name": candidate.get("name"),
            "category": "discovered",
            "schema_fields": ["id", "name", "description", "latest_version"],
            "raw_search_context": candidate.get("source") or "",
            "source_urls": [candidate.get("source")],
            "extracted_data": {},
            "original_data": {},
            "diff_summary": "",
            "lifecycle_status": "",
            "validation_passed": False,
            "recall_count": 0,
            "final_status": ""
        }
        try:
            final = graph_app.invoke(init)
            return {"name": candidate.get("name"), "status": final.get("final_status"), "trace": getattr(final, 'trace_id', None) or final.get('trace_id')}
        except Exception as e:
            return {"name": candidate.get("name"), "status": f"failed: {e}"}

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
        futures = [ex.submit(invoke_for, c) for c in novel]
        for f in concurrent.futures.as_completed(futures):
            try:
                results.append(f.result())
            except Exception as e:
                results.append({"error": str(e)})

    state["trigger_results"] = results
    return state
