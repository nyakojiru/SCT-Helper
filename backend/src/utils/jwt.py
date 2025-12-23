from datetime import datetime, timedelta
from jose import JWTError, jwt
from src.config import settings
import json
import os

# #region agent log
log_path = r"c:\Users\patri\SCT_app\.cursor\debug.log"
# #endregion

def create_access_token(data: dict, expires_delta: timedelta = None):
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"jwt.py:create_access_token:entry","message":"Creating access token","data":{"user_id":data.get("sub")},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    to_encode = data.copy()
    # Convert sub to string if it's an integer (jose library requirement)
    if "sub" in to_encode and isinstance(to_encode["sub"], int):
        to_encode["sub"] = str(to_encode["sub"])
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"jwt.py:create_access_token:success","message":"Token created","data":{"token_length":len(encoded_jwt)},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    return encoded_jwt

def verify_token(token: str):
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"jwt.py:verify_token:entry","message":"Verifying token","data":{"token_length":len(token) if token else 0},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"jwt.py:verify_token:success","message":"Token verified","data":{"user_id":payload.get("sub")},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        return payload
    except JWTError as e:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"G","location":"jwt.py:verify_token:error","message":"Token verification failed","data":{"error":str(e)[:200]},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        return None

