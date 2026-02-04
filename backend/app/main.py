from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api import events, pool, categories, expenses, settlement

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cooper – Shared Expense Platform")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://unmalignantly-chalcedonic-ignacia.ngrok-free.dev"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(pool.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(settlement.router)
