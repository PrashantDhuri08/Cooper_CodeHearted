from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.event import Event
from app.models.user import User
from app.models.participant import Participant

router = APIRouter(prefix="/events", tags=["Events"])

# Create event
@router.post("/")
def create_event(title: str, admin_email: str, db: Session = Depends(get_db)):
    admin = db.query(User).filter_by(email=admin_email).first()
    if not admin:
        return {"error": "admin not found"}

    event = Event(title=title, admin_user_id=admin.id)
    db.add(event)
    db.commit()
    db.refresh(event)

    db.add(Participant(event_id=event.id, user_id=admin.id))
    db.commit()

    return {"event_id": event.id}


# ✅ ADD PARTICIPANT ROUTE (THIS WAS MISSING)
@router.post("/{event_id}/add-participant")
def add_participant(
    event_id: int,
    email: str,
    admin_id: int,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter_by(id=event_id).first()
    if not event:
        return {"error": "event not found"}

    if event.admin_user_id != admin_id:
        return {"error": "only admin can add participants"}

    user = db.query(User).filter_by(email=email).first()
    if not user:
        return {"error": "user not found"}

    existing = db.query(Participant).filter_by(
        event_id=event_id,
        user_id=user.id
    ).first()

    if existing:
        return {"error": "user already participant"}

    db.add(Participant(event_id=event_id, user_id=user.id))
    db.commit()

    return {"status": "participant added"}


@router.get("/{event_id}/participants")
def list_participants(event_id: int, db: Session = Depends(get_db)):
    participants = (
        db.query(User.id, User.email)
        .join(Participant, Participant.user_id == User.id)
        .filter(Participant.event_id == event_id)
        .all()
    )

    return {
        "event_id": event_id,
        "participants": [
            {
                "user_id": p.id,
                "email": p.email
            }
            for p in participants
        ]
    }