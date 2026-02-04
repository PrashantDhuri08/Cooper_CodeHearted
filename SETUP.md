# Cooper Setup Instructions

## Prerequisites

- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn** (for frontend package management)

## Step 1: Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

The backend will start on **http://localhost:8000**

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

## Step 2: Frontend Setup

Open a **new terminal** and:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on **http://localhost:3000**

You should see:
```
  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

## Step 3: Test the Application

1. Open your browser to **http://localhost:3000**
2. Create a new event:
   - Event Title: "Weekend Trip"
   - Organizer ID: 1
3. Click "Create Event" - you'll be redirected to the event dashboard
4. Try the features:
   - Deposit funds (User ID: 1, Amount: 100)
   - Create a category (e.g., "Food")
   - Join the category (User ID: 1)
   - Create an expense (will redirect to Finternet payment page)
   - View settlement balances

## Troubleshooting

### Backend Issues

**Import errors:**
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

**Port already in use:**
```powershell
uvicorn app.main:app --reload --port 8001
# Then update frontend/lib/api.ts with new port
```

**Database issues:**
```powershell
# Delete the database file and restart
rm cooper.db
```

### Frontend Issues

**Module not found:**
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

**Port already in use:**
```powershell
# Use different port
npm run dev -- -p 3001
```

**CORS errors:**
Ensure backend is running with CORS middleware enabled (already configured in `backend/app/main.py`)

### General Issues

**API connection failed:**
- Verify backend is running on port 8000
- Check `http://localhost:8000/docs` for API documentation
- Ensure no firewall blocking localhost

**TypeScript errors:**
```powershell
npm run build
# This will show any type errors
```

## Production Build

### Backend
```powershell
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend
```powershell
cd frontend
npm run build
npm start
```

## Development Tips

- **API Documentation**: Visit http://localhost:8000/docs for interactive API docs
- **Hot Reload**: Both frontend and backend support hot reload
- **Database Viewer**: Use DB Browser for SQLite to view `cooper.db`
- **Network Tab**: Use browser DevTools to debug API calls
- **Console**: Check browser console for frontend errors

## Quick Commands Reference

### Backend
```powershell
# Start backend
cd backend; uvicorn app.main:app --reload

# Run with different port
uvicorn app.main:app --reload --port 8001

# Reset database
rm cooper.db; uvicorn app.main:app --reload
```

### Frontend
```powershell
# Start frontend
cd frontend; npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run build
```

## Next Steps

After setup:
1. Read `README.md` for full documentation
2. Explore `backend/app/api/` for API endpoints
3. Check `frontend/app/` for page components
4. Review `frontend/components/` for UI components
5. See `frontend/lib/api.ts` for API integration

## Support

For issues:
1. Check this troubleshooting guide
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all dependencies are installed
5. Ensure correct Node.js and Python versions

## Success Indicators

✅ Backend running on http://localhost:8000  
✅ Frontend running on http://localhost:3000  
✅ Home page loads without errors  
✅ Can create an event  
✅ Event dashboard displays correctly  
✅ All API calls succeed (check Network tab)  

You're all set! 🎉
