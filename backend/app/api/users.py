from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.participant import Participant
from app.models.event import Event

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{user_id}/events")
def get_user_events(user_id: int, db: Session = Depends(get_db)):
    events = (
        db.query(Event)
        .join(Participant, Participant.event_id == Event.id)
        .filter(Participant.user_id == user_id)
        .all()
    )

    return {
        "user_id": user_id,
        "events": [
            {
                "event_id": e.id,
                "title": e.title
            } for e in events
        ]
    }
