from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from src.database import get_db
from src.models.user import User
from src.models.habit_log import HabitLog
from src.schemas.habit import HabitLogCreate, HabitLogResponse
from src.middleware.auth import get_current_user

router = APIRouter()

@router.get("/today", response_model=list[HabitLogResponse])
async def get_today_habits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = date.today()
    habits = db.query(HabitLog).filter(
        HabitLog.user_id == current_user.id,
        HabitLog.date == today
    ).all()
    return habits

@router.post("/{habit_key}/complete", response_model=HabitLogResponse)
async def complete_habit(
    habit_key: str,
    habit_data: HabitLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if habit log already exists
    existing = db.query(HabitLog).filter(
        HabitLog.user_id == current_user.id,
        HabitLog.date == habit_data.date,
        HabitLog.habit_key == habit_key
    ).first()
    
    if existing:
        existing.completed = habit_data.completed
        existing.value = habit_data.value
        db.commit()
        db.refresh(existing)
        return existing
    
    # Exclude habit_key from dict since we're using the path parameter
    habit_dict = habit_data.dict(exclude={'habit_key'})
    new_habit_log = HabitLog(
        user_id=current_user.id,
        habit_key=habit_key,
        **habit_dict
    )
    db.add(new_habit_log)
    db.commit()
    db.refresh(new_habit_log)
    return new_habit_log

