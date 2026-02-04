from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.expense import Expense
from app.models.category import Category

router = APIRouter(prefix="/expenses", tags=["Expense Chart"])

@router.get("/{event_id}/chart")
def expense_chart(event_id: int, db: Session = Depends(get_db)):
    expenses = db.query(Expense).filter_by(event_id=event_id).all()
    categories = {c.id: c.name for c in db.query(Category).filter_by(event_id=event_id)}

    by_category = {}
    for e in expenses:
        name = categories.get(e.category_id, "Unknown")
        by_category[name] = by_category.get(name, 0) + e.amount

    return {
        "event_id": event_id,
        "by_category": [
            {"category": k, "amount": v} for k, v in by_category.items()
        ]
    }
