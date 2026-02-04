from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api import auth, events, categories, expenses,users, votes, payments,pool, settlement, expense_chart

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cooper – Programmable Group Payments")

# from app.api import 


# ✅ CORS Configuration - Allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # In case Next.js uses alternate port
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(pool.router)
app.include_router(settlement.router)
app.include_router(expense_chart.router)
app.include_router(events.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(votes.router)
app.include_router(payments.router)
