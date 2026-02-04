from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contribution import Contribution

router = APIRouter(prefix="/pool")

@router.post("/deposit")
def deposit(event_id: int, user_id: int, amount: float, db: Session = Depends(get_db)):
    db.add(Contribution(event_id=event_id, user_id=user_id, amount=amount))
    db.commit()
    return {"status": "deposited"}
