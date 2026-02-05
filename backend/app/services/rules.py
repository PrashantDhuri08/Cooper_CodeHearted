from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.spending_rule import SpendingRule

router = APIRouter(prefix="/rules", tags=["Spending Rules"])

@router.post("/")
def create_rule(
    event_id: int,
    max_amount: float,
    admin_only: bool = False,
    approval_required: bool = False,
    db: Session = Depends(get_db)
):
    rule = SpendingRule(
        event_id=event_id,
        max_amount=max_amount,
        admin_only=admin_only,
        approval_required=approval_required
    )
    db.add(rule)
    db.commit()

    return {"status": "rule created"}
