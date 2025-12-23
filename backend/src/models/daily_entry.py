from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base

class DailyEntry(Base):
    __tablename__ = "daily_entries"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    mental_energy = Column(Integer, default=5)
    fog_episodes = Column(Integer, default=0)
    sleep_hours = Column(Float, default=7.0)
    notes = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="daily_entries")
    
    __table_args__ = ({"sqlite_autoincrement": True},)

