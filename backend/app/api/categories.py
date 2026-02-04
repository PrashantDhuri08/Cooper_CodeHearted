from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.category import Category
from app.models.category_participant import CategoryParticipant
from app.services.voting import is_approved

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/")
def create_category(event_id: int, name: str, db: Session = Depends(get_db)):
    cat = Category(event_id=event_id, name=name)
    db.add(cat)
    db.commit()
    return {"category_id": cat.id}

@router.post("/{category_id}/join")
def join_category(category_id: int, user_id: int, event_id: int, db: Session = Depends(get_db)):
    if not is_approved(event_id, user_id, db):
        return {"error": "50% approval required"}

    db.add(CategoryParticipant(category_id=category_id, user_id=user_id))
    db.commit()
    return {"status": "joined"}
