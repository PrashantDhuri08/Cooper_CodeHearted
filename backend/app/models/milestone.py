from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer)
    intent_id = Column(String)

    bill_uploaded = Column(Boolean, default=False)
    approved = Column(Boolean, default=False)
    released = Column(Boolean, default=False)
