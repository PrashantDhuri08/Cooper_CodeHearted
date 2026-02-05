from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.finternet_client import FinternetClient
from app.models.expense import Expense

router = APIRouter(prefix="/expenses", tags=["Expenses"])
finternet = FinternetClient()

@router.post("/")
def create_expense(
    event_id: int,
    category_id: int,
    amount: float,
    db: Session = Depends(get_db)
):
    # Create Finternet payment intent
    intent = finternet.create_payment_intent(amount)

    # Store expense in database
    expense = Expense(
        event_id=event_id,
        category_id=category_id,
        amount=amount,
        payment_intent_id=intent["id"]
    )
    db.add(expense)
    db.commit()

    return {
        "intent_id": intent["id"],
        "payment_url": intent["paymentUrl"],
        "status": intent["status"]
    }
