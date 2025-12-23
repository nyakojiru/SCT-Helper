from pydantic import BaseModel
from datetime import date
from typing import Optional

class HabitLogCreate(BaseModel):
    date: date
    habit_key: str
    completed: bool = False
    value: int = 0

class HabitLogResponse(BaseModel):
    id: int
    user_id: int
    date: date
    habit_key: str
    completed: bool
    value: int
    
    class Config:
        from_attributes = True

