from pydantic import BaseModel
from datetime import date
from typing import Optional

class DailyEntryCreate(BaseModel):
    date: date
    mental_energy: int = 5
    fog_episodes: int = 0
    sleep_hours: float = 7.0
    notes: str = ""

class DailyEntryUpdate(BaseModel):
    mental_energy: Optional[int] = None
    fog_episodes: Optional[int] = None
    sleep_hours: Optional[float] = None
    notes: Optional[str] = None

class DailyEntryResponse(BaseModel):
    id: int
    user_id: int
    date: date
    mental_energy: int
    fog_episodes: int
    sleep_hours: float
    notes: str
    
    class Config:
        from_attributes = True

