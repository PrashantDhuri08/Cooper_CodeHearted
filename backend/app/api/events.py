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

@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        return {"error": "Event not found"}
    
    participants = db.query(Participant).filter(Participant.event_id == event_id).all()
    
    return {
        "id": event.id,
        "title": event.title,
        "participants": [{"user_id": p.user_id} for p in participants]
    }

@router.post("/{event_id}/participants")
def add_participant(event_id: int, user_id: int, db: Session = Depends(get_db)):
    # Check if participant already exists
    existing = db.query(Participant).filter(
        Participant.event_id == event_id,
        Participant.user_id == user_id
    ).first()
    
    if existing:
        return {"status": "already_joined"}
    
    participant = Participant(
        event_id=event_id,
        user_id=user_id
    )
    db.add(participant)
    db.commit()
    
    return {"status": "joined", "user_id": user_id}

@router.get("/")
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return [{"id": e.id, "title": e.title} for e in events]
