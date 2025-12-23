from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from src.database import get_db
from src.models.user import User
from src.schemas.auth import UserRegister, UserLogin, TokenResponse
from src.utils.password import hash_password, verify_password
from src.utils.jwt import create_access_token
import json
import os

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # #region agent log
    log_path = r"c:\Users\patri\SCT_app\.cursor\debug.log"
    try:
        with open(log_path, "a") as f:
            f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"auth.py:register:entry","message":"Register endpoint called","data":{"email":user_data.email[:20]+"..." if len(user_data.email) > 20 else user_data.email},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
    except: pass
    # #endregion
    
    try:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"auth.py:register:before_query","message":"Before checking existing user","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"B","location":"auth.py:register:after_query","message":"After checking existing user","data":{"existing_user_found":existing_user is not None},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"auth.py:register:before_create","message":"Before creating user","data":{},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            email=user_data.email,
            password_hash=hashed_password
        )
        db.add(new_user)
        
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"auth.py:register:before_commit","message":"Before database commit","data":{"user_email":new_user.email},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        db.commit()
        db.refresh(new_user)
        
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"C","location":"auth.py:register:after_commit","message":"After database commit","data":{"user_id":new_user.id,"user_email":new_user.email},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        # Generate token
        access_token = create_access_token(data={"sub": new_user.id})
        
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"A","location":"auth.py:register:success","message":"Registration successful","data":{"user_id":new_user.id},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        
        return TokenResponse(
            access_token=access_token,
            user_id=new_user.id,
            email=new_user.email
        )
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"D","location":"auth.py:register:db_error","message":"Database error during registration","data":{"error":str(e)[:200]},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # #region agent log
        try:
            with open(log_path, "a") as f:
                f.write(json.dumps({"sessionId":"debug-session","runId":"run1","hypothesisId":"E","location":"auth.py:register:general_error","message":"General error during registration","data":{"error":str(e)[:200]},"timestamp":int(os.path.getmtime(__file__)*1000) if os.path.exists(__file__) else 0}) + "\n")
        except: pass
        # #endregion
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return TokenResponse(
        access_token=access_token,
        user_id=user.id,
        email=user.email
    )

