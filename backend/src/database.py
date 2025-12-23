from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.config import settings
import json
import os

# #region agent log
log_path = r"c:\Users\patri\SCT_app\.cursor\debug.log"
try:
    with open(log_path, "a") as f:
        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"database.py:6","message":"Database connection setup","data":{"database_url":settings.DATABASE_URL[:50]+"..." if len(settings.DATABASE_URL) > 50 else settings.DATABASE_URL,"env_db_url":os.getenv("DATABASE_URL","not_set")[:50]+"..." if len(os.getenv("DATABASE_URL","")) > 50 else os.getenv("DATABASE_URL","not_set")},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
except: pass
# #endregion

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.ENVIRONMENT == "development"
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

