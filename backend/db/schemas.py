from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime

class StagingRecordBase(BaseModel):
    category: str
    original_id: Optional[str] = None
    proposed_data: Dict[str, Any]
    status: str = "pending"
    agent_reasoning: Optional[str] = None
    trace_id: Optional[str] = None
    source_urls: Optional[List[str]] = None

class StagingRecordCreate(StagingRecordBase):
    pass

class StagingRecordResponse(StagingRecordBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class AuditLogBase(BaseModel):
    run_id: str
    agent_name: str
    action: str
    details: Dict[str, Any]

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
