from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.vote import Vote

router = APIRouter(prefix="/votes", tags=["Votes"])

@router.post("/")
def vote(event_id: int, target_user_id: int, voter_user_id: int, approve: bool, db: Session = Depends(get_db)):
    vote = Vote(
        event_id=event_id,
        target_user_id=target_user_id,
        voter_user_id=voter_user_id,
        approve=approve
    )
    db.add(vote)
    db.commit()
    return {"status": "vote recorded"}
