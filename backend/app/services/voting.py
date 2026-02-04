from app.models.vote import Vote
from app.models.participant import Participant

def is_approved(event_id, target_user_id, db):
    approvals = db.query(Vote).filter_by(
        event_id=event_id,
        target_user_id=target_user_id,
        approve=True
    ).count()

    total = db.query(Participant).filter_by(event_id=event_id).count()
    return approvals >= (total / 2)
