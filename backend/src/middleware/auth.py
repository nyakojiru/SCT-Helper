from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from src.database import get_db
from src.models.user import User
from src.utils.jwt import verify_token
import json
import os

security = HTTPBearer(auto_error=False)

# #region agent log
log_path = r"c:\Users\patri\SCT_app\.cursor\debug.log"
# #endregion

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:entry","message":"Authenticating user","data":{"has_credentials":credentials is not None,"has_header":authorization is not None},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    
    # Extract token from credentials or header
    token = None
    if credentials:
        token = credentials.credentials
    elif authorization:
        # Handle "Bearer <token>" format
        if authorization.startswith("Bearer "):
            token = authorization[7:]
        else:
            token = authorization
    
    if not token:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:no_token","message":"No token provided","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = verify_token(token)
    if payload is None:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:invalid_token","message":"Token verification failed","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if user_id is None:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:no_user_id","message":"No user_id in token payload","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Convert user_id to int if it's a string (from JWT)
    user_id = int(user_id) if isinstance(user_id, str) else user_id
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:user_not_found","message":"User not found in database","data":{"user_id":user_id},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"H","location":"auth.py:get_current_user:success","message":"User authenticated successfully","data":{"user_id":user.id},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    return user

