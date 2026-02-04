# CORS Fix for Frontend-Backend Communication

## Problem
The frontend was getting **405 Method Not Allowed** errors when trying to register users:
```
OPTIONS /auth/register?email=x@x.com&password=12345678 HTTP/1.1" 405 Method Not Allowed
```

## Root Cause
When a browser makes a cross-origin request (frontend on `localhost:3000` to backend on `localhost:8000`), it first sends an **OPTIONS preflight request** to check if the server allows the actual request.

The FastAPI backend **did not have CORS middleware configured**, so it rejected all OPTIONS requests with 405 errors.

## Solution
Added **CORS middleware** to `backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
```

## What This Does
- ✅ Allows OPTIONS preflight requests
- ✅ Allows requests from `localhost:3000` (Next.js frontend)
- ✅ Allows all HTTP methods (GET, POST, etc.)
- ✅ Allows all headers (Content-Type, Authorization, etc.)
- ✅ Enables credentials (cookies, auth headers)

## Testing
After this fix, the frontend should be able to:
1. ✅ Register users via `/auth/register`
2. ✅ Login users via `/auth/login`
3. ✅ Create events via `/events`
4. ✅ Make all other API calls without CORS errors

## Note
The backend will automatically reload (if running with `uvicorn app.main:app --reload`). You don't need to restart it manually.

Try registering a user again from the frontend - it should work now! 🎉
