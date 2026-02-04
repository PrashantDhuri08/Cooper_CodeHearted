from sqlalchemy import Column, Integer, Float, Boolean
from app.db.base import Base

class SpendingRule(Base):
    __tablename__ = "spending_rules"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)

    max_amount = Column(Float)        # max allowed without approval
    admin_only = Column(Boolean)      # only admin can spend
    approval_required = Column(Boolean)  # needs 50% approval
