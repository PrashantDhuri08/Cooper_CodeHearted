from sqlalchemy import Column, Integer, String, Float
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    wallet_balance = Column(Float, default=0.0)
