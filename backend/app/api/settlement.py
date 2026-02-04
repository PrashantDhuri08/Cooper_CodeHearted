from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.expense import Expense
from app.models.participant import Participant

router = APIRouter(prefix="/settlement", tags=["Settlement"])

@router.get("/{event_id}")
def get_settlement(event_id: int, db: Session = Depends(get_db)):
    expenses = db.query(Expense).filter_by(event_id=event_id).all()
    participants = db.query(Participant).filter_by(event_id=event_id).all()

    if not participants:
        return {"event_id": event_id, "settlement": []}

    total = sum(e.amount for e in expenses)
    share = total / len(participants)

    settlement = []
    for p in participants:
        settlement.append({
            "user_id": p.user_id,
            "net_balance": round(-share, 2)
        })

    return {
        "event_id": event_id,
        "settlement": settlement
    }
