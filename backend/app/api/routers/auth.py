import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Validate role - do NOT allow direct registration as ADMIN
    if user_in.role.upper() == "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot self-register with ADMIN role. Contact system governance administrator."
        )

    existing_user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this official email address already exists."
        )

    # Enforce password strength
    p = user_in.password
    if len(p) < 8 or not any(c.isupper() for c in p) or not any(c.islower() for c in p) or not any(c.isdigit() for c in p):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long and contain uppercase, lowercase, and a number."
        )

    new_user = User(
        full_name=user_in.full_name.strip(),
        email=user_in.email.lower().strip(),
        phone=user_in.phone,
        organization=user_in.organization.strip(),
        department=user_in.department.strip(),
        designation=user_in.designation.strip(),
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password),
        status="APPROVED", # In demo mode accounts are approved for instant exploration
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "Account created successfully. You can now sign in to the I-STELX Command Center.",
        "user_id": new_user.id
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    email = login_data.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid official email credentials or password."
        )

    if not user.is_active or user.status == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or pending administrative approval."
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role, "name": user.full_name})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "organization": user.organization,
            "department": user.department,
            "designation": user.designation,
            "role": user.role,
            "status": user.status
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(payload: dict):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")
    return {
        "success": True,
        "message": f"Security OTP simulated and sent to {email}. Demo OTP code is: 849201",
        "demo_otp": "849201"
    }

@router.post("/reset-password")
def reset_password(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email", "").lower().strip()
    otp = payload.get("otp", "")
    new_password = payload.get("new_password", "")

    if otp != "849201" and len(otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid or expired verification OTP.")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    user.hashed_password = get_password_hash(new_password)
    db.commit()

    return {
        "success": True,
        "message": "Password reset successfully. You may now sign in."
    }
