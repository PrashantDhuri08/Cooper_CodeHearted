from app.models.event import Event
from app.services.voting import is_approved

def check_spending_rules(
    *,
    db,
    event_id: int,
    user_id: int,
    amount: float,
    rule
):
    # Rule 1: Admin-only spending
    if rule.admin_only:
        event = db.query(Event).filter_by(id=event_id).first()
        if event.admin_user_id != user_id:
            return False, "Only admin can spend"

    # Rule 2: Amount limit
    if rule.max_amount and amount > rule.max_amount:
        if not rule.approval_required:
            return False, "Amount exceeds spending limit"

    # Rule 3: High-value approval
    if rule.approval_required:
        if not is_approved(event_id, user_id, db):
            return False, "50% approval required for this expense"

    return True, "Allowed"
