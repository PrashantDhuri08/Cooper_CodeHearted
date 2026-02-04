from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.contribution import Contribution
from app.services.finternet_client import FinternetClient

router = APIRouter(prefix="/pool", tags=["Shared Pool"])
finternet = FinternetClient()

@router.post("/deposit")
def deposit(event_id: int, user_id: int, amount: float, db: Session = Depends(get_db)):
    # 1. Create Finternet payment intent
    intent = finternet.create_payment_intent(amount)

    # 2. Record contribution logically
    contribution = Contribution(
        event_id=event_id,
        user_id=user_id,
        amount=amount
    )
    db.add(contribution)
    db.commit()

    return {
        "intent_id": intent["id"],
        "payment_url": intent["paymentUrl"],
        "status": intent["status"]
    }


@router.get("/{event_id}")
def get_pool(event_id: int, db: Session = Depends(get_db)):
    contributions = db.query(Contribution).filter_by(event_id=event_id).all()
    total = sum(c.amount for c in contributions)

    return {
        "event_id": event_id,
        "total_pool": total,
        "contributors": [
            {"user_id": c.user_id, "amount": c.amount}
            for c in contributions
        ]
    }
