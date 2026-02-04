from sqlalchemy import Column, Integer, ForeignKey, Boolean
from app.db.base import Base

class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    target_user_id = Column(Integer)
    voter_user_id = Column(Integer)
    approve = Column(Boolean)
