from sqlalchemy import Column, Integer, String, Time, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from src.database import Base

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    habit_key = Column(String, nullable=False, index=True)
    time = Column(Time, nullable=False)
    enabled = Column(Boolean, default=True)
    days_of_week = Column(JSON, default=[0, 1, 2, 3, 4, 5, 6])  # 0=Monday, 6=Sunday
    
    user = relationship("User", back_populates="reminders")
    
    __table_args__ = ({"sqlite_autoincrement": True},)

