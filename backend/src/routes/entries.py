from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional
from src.database import get_db
from src.models.user import User
from src.models.daily_entry import DailyEntry
from src.schemas.entry import DailyEntryCreate, DailyEntryUpdate, DailyEntryResponse
from src.middleware.auth import get_current_user

router = APIRouter()

@router.get("", response_model=list[DailyEntryResponse])
async def get_entries(
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(DailyEntry).filter(DailyEntry.user_id == current_user.id)
    
    if from_date:
        query = query.filter(DailyEntry.date >= from_date)
    if to_date:
        query = query.filter(DailyEntry.date <= to_date)
    
    entries = query.order_by(DailyEntry.date.desc()).all()
    return entries

@router.post("", response_model=DailyEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry_data: DailyEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if entry already exists for this date
    existing = db.query(DailyEntry).filter(
        DailyEntry.user_id == current_user.id,
        DailyEntry.date == entry_data.date
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Entry already exists for this date"
        )
    
    new_entry = DailyEntry(
        user_id=current_user.id,
        **entry_data.dict()
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@router.put("/{entry_date}", response_model=DailyEntryResponse)
async def update_entry(
    entry_date: date,
    entry_data: DailyEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = db.query(DailyEntry).filter(
        DailyEntry.user_id == current_user.id,
        DailyEntry.date == entry_date
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    update_data = entry_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
    
    db.commit()
    db.refresh(entry)
    return entry

