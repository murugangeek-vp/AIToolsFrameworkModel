from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from sqlalchemy.sql import func
from .database import Base

class StagingRecord(Base):
    __tablename__ = "staging_records"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)  # e.g., 'llm_models.csv'
    original_id = Column(String, index=True, nullable=True) # if updating existing
    proposed_data = Column(JSON) # The new extracted data
    status = Column(String, default="pending") # pending, approved, rejected
    agent_reasoning = Column(Text, nullable=True)
    trace_id = Column(String, nullable=True) # For Langfuse Tracking
    source_urls = Column(JSON, nullable=True) # For Data Lineage
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String, index=True) # links to langfuse or general run
    agent_name = Column(String)
    action = Column(String)
    details = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
