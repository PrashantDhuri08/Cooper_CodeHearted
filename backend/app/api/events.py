from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.event import Event
from app.models.participant import Participant

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/")
def create_event(title: str, organizer_id: int, db: Session = Depends(get_db)):
    event = Event(title=title)
    db.add(event)
    db.commit()
    db.refresh(event)

    participant = Participant(
        event_id=event.id,
        user_id=organizer_id
    )
    db.add(participant)
    db.commit()

    # 🔥 THIS RETURN IS REQUIRED
    return {
        "id": event.id,
        "title": event.title,
        "organizer_id": organizer_id
    }
