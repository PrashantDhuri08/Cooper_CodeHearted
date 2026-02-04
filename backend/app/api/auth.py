from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.services.auth import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    user = User(email=email, hashed_password=hash_password(password))
    db.add(user)
    db.commit()
    return {"status": "registered"}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=email).first()
    if not user:
        return {"error": "invalid credentials"}
    if not verify_password(password, user.hashed_password):
        return {"error": "invalid credentials"}
    return {"user_id": user.id}
