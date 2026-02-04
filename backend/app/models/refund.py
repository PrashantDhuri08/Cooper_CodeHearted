from sqlalchemy import Column, Integer, Float
from app.db.base import Base

class Refund(Base):
    __tablename__ = "refunds"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    amount = Column(Float)
    release_at = Column(Integer)
