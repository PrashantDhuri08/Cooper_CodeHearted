# Testing Guide - Cooper Frontend & Backend

## ✅ Fixed Issues

### 1. CORS Configuration
- **Problem**: Frontend getting 405 Method Not Allowed on OPTIONS requests
- **Fix**: Added CORS middleware to `backend/app/main.py`
- **Status**: ✅ Fixed

### 2. Login Bug
- **Problem**: Login would crash if user doesn't exist
- **Fix**: Added null check before password verification in `backend/app/api/auth.py`
- **Status**: ✅ Fixed

## 🧪 Testing Steps

### Step 1: Verify Backend is Running
```bash
# Should be running on http://localhost:8000
# Check terminal for: "Application startup complete"
```

### Step 2: Verify Frontend is Running
```bash
# Should be running on http://localhost:3000
# Check terminal for: "Ready in X ms"
```

### Step 3: Test User Registration
1. Open `http://localhost:3000`
2. You should see the **Auth** component (Register/Login form)
3. Click "Don't have an account? Register"
4. Enter:
   - Email: `test@example.com`
   - Password: `password123`
5. Click "Register"
6. **Expected**: Green success message "registered"

### Step 4: Test User Login
1. After registration, click "Already have an account? Login"
2. Enter the same credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"
4. **Expected**: 
   - Green success message "Login successful!"
   - Page should switch to **Create Event** form

### Step 5: Test Event Creation
1. After successful login, you should see the Create Event form
2. Enter:
   - Event Title: `Weekend Trip`
   - Admin Email: (auto-filled with your email)
3. Click "Create Event"
4. **Expected**: Navigate to event dashboard at `/events/{event_id}?userId={userId}&adminId={adminId}`

### Step 6: Test Add Participant
1. On the event dashboard, find "Add Participant" card
2. Enter:
   - Email: `friend@example.com`
3. Click "Add Participant"
4. **Expected**: 
   - If user exists: "Participant added successfully!"
   - If user not registered: Error "user not found"

### Step 7: Test Create Category
1. Find "Create Category" card
2. Enter:
   - Category Name: `Food`
3. Click "Create Category"
4. **Expected**: Success message with category ID

### Step 8: Test Create Expense
1. Scroll to "Create Expense" section
2. Enter:
   - Category ID: `1` (from previous step)
   - Amount: `100.00`
3. Click "Create Expense"
4. **Expected**: 
   - Success message with payment intent details
   - Payment URL link to Finternet payment page

### Step 9: Test Payment Status
1. Copy the `intent_id` from the expense creation
2. Find "Check Payment Status" card
3. Paste the intent ID
4. Click "Check Status"
5. **Expected**: Display payment status and settlement status

## 🐛 Common Issues & Solutions

### Issue: "Network Error" on registration
**Solution**: Check that CORS is configured correctly in `backend/app/main.py`

### Issue: "user not found" when adding participant
**Solution**: The participant must register first via the Auth page

### Issue: "only admin can add participants"
**Solution**: Make sure you're using the correct `adminId` (should match the event creator's user ID)

### Issue: Backend not reloading after changes
**Solution**: Restart uvicorn:
```bash
cd backend
uvicorn app.main:app --reload
```

### Issue: Frontend showing old code
**Solution**: Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

## 📊 Expected API Flow

```
1. POST /auth/register → {"status": "registered"}
2. POST /auth/login → {"user_id": 1}
3. POST /events → {"event_id": 1}
4. POST /events/1/add-participant → {"status": "participant added"}
5. POST /categories → {"category_id": 1}
6. POST /expenses → {"intent_id": "intent_xxx", "payment_url": "...", "status": "INITIATED"}
7. GET /payments/intent_xxx/status → {"intent_id": "...", "status": "...", "settlement_status": "..."}
```

## 🎯 Success Criteria

- ✅ User can register without CORS errors
- ✅ User can login and receive user_id
- ✅ User can create events
- ✅ Admin can add participants
- ✅ User can create categories
- ✅ User can create expenses and get Finternet payment URL
- ✅ User can check payment status
- ✅ All error messages display correctly
- ✅ UI is responsive and animated

## 🔍 Debugging Tips

### Check Backend Logs
Look for errors in the uvicorn terminal:
```
INFO:     127.0.0.1:xxxxx - "POST /auth/register?email=... HTTP/1.1" 200 OK
```

### Check Frontend Console
Open browser DevTools (F12) and check Console for errors

### Check Network Tab
Open DevTools → Network tab to see all API requests and responses

### Test Backend Directly
Use curl or Postman to test endpoints:
```bash
curl -X POST "http://localhost:8000/auth/register?email=test@test.com&password=pass123"
```

## 📝 Notes

- The frontend now uses **query parameters** for all API calls (matching backend)
- All routes use **POST** except payment status which uses **GET**
- CORS is configured to allow `localhost:3000` and `127.0.0.1:3000`
- User IDs and Admin IDs are passed via URL parameters to the event dashboard
