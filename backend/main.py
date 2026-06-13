from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import pytz

from db.database import engine
from db import models
from api import router as api_router

# Create DB Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AITools Framework Agentic Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router.router, prefix="/api")

scheduler = BackgroundScheduler(timezone=pytz.timezone('Asia/Kolkata'))

def scheduled_refresh_job():
    print("Running scheduled refresh job at 8 PM IST...", flush=True)
    try:
        from api import router as api_router
        # Trigger the same refresh pipeline used by the manual endpoint
        api_router.trigger_refresh_pipeline()
    except Exception as e:
        print(f"Scheduled refresh failed to trigger: {e}", flush=True)

@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(scheduled_refresh_job, 'cron', hour=20, minute=0)
    scheduler.start()

@app.on_event("shutdown")
def stop_scheduler():
    scheduler.shutdown()

@app.get("/")
def read_root():
    return {"message": "AITools Backend Service is running."}
