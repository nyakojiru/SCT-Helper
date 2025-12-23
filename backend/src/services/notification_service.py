from sqlalchemy.orm import Session
from src.models.notification import Notification
from src.models.reminder import Reminder

def create_notification(
    db: Session,
    user_id: int,
    reminder_id: int = None,
    status: str = "sent"
):
    notification = Notification(
        user_id=user_id,
        reminder_id=reminder_id,
        status=status
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification

