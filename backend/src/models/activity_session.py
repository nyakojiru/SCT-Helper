from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.database import Base

class ActivitySession(Base):
    __tablename__ = "activity_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_type = Column(String, nullable=False, index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    score = Column(Float, default=0.0)
    metadata_json = Column(JSON, default={})
    
    user = relationship("User", back_populates="activity_sessions")
    
    __table_args__ = ({"sqlite_autoincrement": True},)

