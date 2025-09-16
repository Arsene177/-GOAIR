# routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from models import User
from database import get_session
from schemas import RegisterIn, LoginIn, TokenOut
from utils.security import hash_password, verify_password, create_access_token

auth_router = APIRouter()

@auth_router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, session: Session = Depends(get_session)):
    try:
        q = select(User).where(User.email == payload.email)
        existing = session.exec(q).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(email=payload.email,
                    hashed_password=hash_password(payload.password),
                    first_name=payload.firstName,
                    last_name=payload.lastName)
        session.add(user)
        session.commit()
        session.refresh(user)
        token = create_access_token(str(user.id))
        return {"access_token": token, "expires_in": 60*60*24*7, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"register_failed: {e}")

@auth_router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, session: Session = Depends(get_session)):
    try:
        q = select(User).where(User.email == payload.email)
        user = session.exec(q).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        token = create_access_token(str(user.id))
        return {"access_token": token, "expires_in": 60*60*24*7, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"login_failed: {e}")

from deps import get_current_user

@auth_router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "first_name": current_user.first_name, "last_name": current_user.last_name}
