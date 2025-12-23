from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.user import User
from src.models.activity_session import ActivitySession
from src.schemas.activity import ActivitySessionCreate, ActivitySessionUpdate, ActivitySessionResponse
from src.middleware.auth import get_current_user

router = APIRouter()

@router.post("/{activity_type}/start", response_model=ActivitySessionResponse, status_code=status.HTTP_201_CREATED)
async def start_activity(
    activity_type: str,
    activity_data: ActivitySessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_session = ActivitySession(
        user_id=current_user.id,
        activity_type=activity_type,
        metadata_json=activity_data.metadata_json
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.post("/{session_id}/end", response_model=ActivitySessionResponse)
async def end_activity(
    session_id: int,
    activity_data: ActivitySessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(ActivitySession).filter(
        ActivitySession.id == session_id,
        ActivitySession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity session not found"
        )
    
    update_data = activity_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    db.commit()
    db.refresh(session)
    return session

