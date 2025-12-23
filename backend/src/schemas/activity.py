from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class ActivitySessionCreate(BaseModel):
    activity_type: str
    metadata_json: Dict[str, Any] = {}

class ActivitySessionUpdate(BaseModel):
    ended_at: Optional[datetime] = None
    score: Optional[float] = None
    metadata_json: Optional[Dict[str, Any]] = None

class ActivitySessionResponse(BaseModel):
    id: int
    user_id: int
    activity_type: str
    started_at: datetime
    ended_at: Optional[datetime]
    score: float
    metadata_json: Dict[str, Any]
    
    class Config:
        from_attributes = True

