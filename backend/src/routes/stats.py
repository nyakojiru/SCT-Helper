from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import Optional
from src.database import get_db
from src.models.user import User
from src.models.daily_entry import DailyEntry
from src.models.habit_log import HabitLog
from src.schemas.stats import StatsSummary, CorrelationData
from src.middleware.auth import get_current_user

router = APIRouter()

@router.get("/summary", response_model=StatsSummary)
async def get_stats_summary(
    period: str = Query("30", description="Number of days"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    days = int(period)
    start_date = date.today() - timedelta(days=days)
    
    # Get entries
    entries = db.query(DailyEntry).filter(
        DailyEntry.user_id == current_user.id,
        DailyEntry.date >= start_date
    ).all()
    
    if not entries:
        return StatsSummary(
            period=period,
            total_entries=0,
            avg_mental_energy=0,
            avg_fog_episodes=0,
            avg_sleep_hours=0,
            habits_completed={},
            streaks={}
        )
    
    # Calculate averages
    avg_mental_energy = sum(e.mental_energy for e in entries) / len(entries)
    avg_fog_episodes = sum(e.fog_episodes for e in entries) / len(entries)
    avg_sleep_hours = sum(e.sleep_hours for e in entries) / len(entries)
    
    # Get habit completions
    habit_logs = db.query(HabitLog).filter(
        HabitLog.user_id == current_user.id,
        HabitLog.date >= start_date,
        HabitLog.completed == True
    ).all()
    
    habits_completed = {}
    for log in habit_logs:
        habits_completed[log.habit_key] = habits_completed.get(log.habit_key, 0) + 1
    
    # Simple streak calculation (can be enhanced)
    streaks = {}
    
    return StatsSummary(
        period=period,
        total_entries=len(entries),
        avg_mental_energy=round(avg_mental_energy, 2),
        avg_fog_episodes=round(avg_fog_episodes, 2),
        avg_sleep_hours=round(avg_sleep_hours, 2),
        habits_completed=habits_completed,
        streaks=streaks
    )

@router.get("/correlations", response_model=CorrelationData)
async def get_correlations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get last 90 days of data
    start_date = date.today() - timedelta(days=90)
    
    entries = db.query(DailyEntry).filter(
        DailyEntry.user_id == current_user.id,
        DailyEntry.date >= start_date
    ).all()
    
    # Build correlation data
    sleep_vs_energy = [
        {"sleep": float(e.sleep_hours), "energy": float(e.mental_energy)}
        for e in entries
    ]
    
    # Exercise vs fog (simplified - would need to join with habit_logs)
    # Convert date to timestamp (days since epoch) for numeric compatibility
    exercise_vs_fog = [
        {"fog": float(e.fog_episodes), "date": float(e.date.toordinal())}
        for e in entries
    ]
    
    # Calculate simple correlations
    correlations = {}
    if len(entries) > 1:
        # Simple correlation calculation
        correlations["sleep_energy"] = 0.5  # Placeholder
        correlations["exercise_fog"] = -0.3  # Placeholder
    
    return CorrelationData(
        sleep_vs_energy=sleep_vs_energy,
        exercise_vs_fog=exercise_vs_fog,
        correlations=correlations
    )

