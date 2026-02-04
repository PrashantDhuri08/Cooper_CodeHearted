import time
from app.models.refund import Refund
from app.models.user import User

def process_refunds(db):
    now = int(time.time())
    refunds = db.query(Refund).filter(Refund.release_at <= now).all()

    for r in refunds:
        user = db.query(User).get(r.user_id)
        user.wallet_balance += r.amount
        db.delete(r)

    db.commit()
