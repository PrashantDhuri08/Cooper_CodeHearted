from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.api import events, pool, categories, expenses, settlement

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cooper – Shared Expense Platform")

app.include_router(events.router)
app.include_router(pool.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(settlement.router)
