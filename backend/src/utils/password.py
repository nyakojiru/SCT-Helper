from passlib.context import CryptContext
import json
import os

# #region agent log
log_path = r"c:\Users\patri\SCT_app\.cursor\debug.log"
try:
    with open(log_path, "a") as f:
        f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"password.py:init","message":"Initializing password context","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
except: pass
# #endregion

try:
    # Suppress bcrypt version warning by using auto scheme detection
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception as e:
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"password.py:init_error","message":"Error initializing CryptContext","data":{"error":str(e)[:200]},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    raise

def hash_password(password: str) -> str:
    # #region agent log
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"password.py:hash_password:entry","message":"Hashing password","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    try:
        result = pwd_context.hash(password)
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"password.py:hash_password:success","message":"Password hashed successfully","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        return result
    except Exception as e:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"F","location":"password.py:hash_password:error","message":"Error hashing password","data":{"error":str(e)[:200]},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

