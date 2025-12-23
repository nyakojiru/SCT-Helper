from pydantic import BaseModel
from datetime import time
from typing import List, Optional

class ReminderCreate(BaseModel):
    habit_key: str
    time: time
    enabled: bool = True
    days_of_week: List[int] = [0, 1, 2, 3, 4, 5, 6]

class ReminderUpdate(BaseModel):
    time: Optional[time] = None
    enabled: Optional[bool] = None
    days_of_week: Optional[List[int]] = None

class ReminderResponse(BaseModel):
    id: int
    user_id: int
    habit_key: str
    time: time
    enabled: bool
    days_of_week: List[int]
    
    class Config:
        from_attributes = True

