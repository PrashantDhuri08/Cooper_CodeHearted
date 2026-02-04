# Frontend API Update Summary

## Overview
The frontend has been completely updated to match the exact 9 backend API routes specified. All non-existent routes have been removed.

## ✅ Exact API Routes Implemented

### 1️⃣ **Register User**
- **Route**: `POST /auth/register?email=&password=`
- **Response**: `{ "status": "registered" }`
- **Component**: `Auth.tsx`

### 2️⃣ **Login User**
- **Route**: `POST /auth/login?email=&password=`
- **Response**: `{ "user_id": 1 }` or `{ "error": "invalid credentials" }`
- **Component**: `Auth.tsx`

### 3️⃣ **Create Event**
- **Route**: `POST /events?title=&admin_email=`
- **Response**: `{ "event_id": 1 }`
- **Component**: `CreateEvent.tsx`

### 4️⃣ **Add Participant**
- **Route**: `POST /events/{event_id}/add-participant?email=&admin_id=`
- **Responses**:
  - Success: `{ "status": "participant added" }`
  - Errors: `{ "error": "user not found" }`, `{ "error": "only admin can add participants" }`, `{ "error": "user already participant" }`
- **Component**: `ParticipantManager.tsx`

### 5️⃣ **Create Category**
- **Route**: `POST /categories?event_id=&name=`
- **Response**: `{ "category_id": 1 }`
- **Component**: `ExpenseCategories.tsx`

### 6️⃣ **Join Category**
- **Route**: `POST /categories/{category_id}/join?user_id=&event_id=`
- **Responses**:
  - Approved: `{ "status": "joined" }`
  - Not enough votes: `{ "error": "50% approval required" }`
- **Component**: Not yet implemented (can be added to ExpenseCategories)

### 7️⃣ **Vote for User Inclusion**
- **Route**: `POST /votes?event_id=&target_user_id=&voter_user_id=&approve=`
- **Response**: `{ "status": "vote recorded" }`
- **API Function**: `splitwiseApi.vote()` (available but no UI component yet)

### 8️⃣ **Create Expense**
- **Route**: `POST /expenses?event_id=&category_id=&amount=`
- **Response**: 
  ```json
  {
    "intent_id": "intent_xxx",
    "payment_url": "https://pay.fmm.finternetlab.io/?intent=intent_xxx",
    "status": "INITIATED"
  }
  ```
- **Component**: `CreateExpense.tsx`

### 9️⃣ **Get Payment Status**
- **Route**: `GET /payments/{intent_id}/status`
- **Responses**:
  - Before release: `{ "intent_id": "intent_xxx", "status": "PROCESSING", "settlement_status": "PENDING" }`
  - After release: `{ "intent_id": "intent_xxx", "status": "COMPLETED", "settlement_status": "SETTLED" }`
- **Component**: `PaymentManager.tsx`

## ❌ Removed Routes (Not in Backend)

The following routes were removed from the frontend API:
- `/users` - No user listing endpoint
- `/wallet` - No wallet functionality
- `/refund` - No refund endpoint
- `/remove-participant` - No participant removal
- `/list-events` - No event listing
- `/list-participants` - No participant listing
- `/pool/deposit` - No pool deposit endpoint
- `/pool/{event_id}/balance` - No pool balance endpoint
- `/categories` GET - No category listing endpoint
- `/settlement/{event_id}` - No settlement endpoint
- Finternet direct API calls (release payment, ledger entries)

## 📁 Updated Files

### Core API Layer
- **`src/lib/api.ts`**: Completely rewritten to match exact backend specification
- **`src/lib/types.ts`**: Existing types (not modified yet, but can be updated if needed)

### Components Created/Updated
1. **`src/components/features/Auth.tsx`**: Register & Login
2. **`src/components/features/CreateEvent.tsx`**: Event creation with admin_email
3. **`src/components/features/ParticipantManager.tsx`**: Add participants (admin only)
4. **`src/components/features/ExpenseCategories.tsx`**: Create categories
5. **`src/components/features/CreateExpense.tsx`**: Create expenses (Finternet payment intents)
6. **`src/components/features/PaymentManager.tsx`**: Check payment status
7. **`src/components/features/SharedPool.tsx`**: Placeholder (no API)
8. **`src/components/features/SettlementGraph.tsx`**: Placeholder (no API)
9. **`src/components/features/SettlementTable.tsx`**: Placeholder (no API)
10. **`src/components/features/ExpenseChart.tsx`**: Simplified (no category listing API)

### Pages
- **`src/app/page.tsx`**: Updated with Auth flow
- **`src/app/events/[eventId]/page.tsx`**: Updated to use URL params for userId and adminId

## 🔄 User Flow

1. **Home Page** → User sees Auth component
2. **Register/Login** → User gets `user_id` on successful login
3. **Create Event** → User creates event with their email as admin
4. **Event Dashboard** → Navigate to `/events/{event_id}?userId={userId}&adminId={adminId}`
5. **Add Participants** → Admin can add participants by email
6. **Create Categories** → Any user can create expense categories
7. **Create Expense** → User creates expense, gets Finternet payment URL
8. **Check Payment Status** → User can check payment intent status

## 🎯 What's Working

- ✅ Complete authentication flow
- ✅ Event creation
- ✅ Participant management (admin only)
- ✅ Category creation
- ✅ Expense creation with Finternet payment intents
- ✅ Payment status checking
- ✅ Proper error handling for all API calls
- ✅ Beautiful, animated UI with glassmorphism

## 🚧 What's Missing (No Backend API)

- ❌ Category listing (no GET /categories endpoint)
- ❌ Participant listing (no GET /events/{id}/participants)
- ❌ Join category UI (API exists but needs voting implementation)
- ❌ Voting UI (API exists but no component)
- ❌ Pool deposits (no /pool endpoints)
- ❌ Settlement calculations (no /settlement endpoint)

## 🎨 UI/UX Features

- Modern glassmorphism design
- Smooth animations with Framer Motion
- Responsive layout
- Loading states
- Error handling with user-friendly messages
- Success feedback
- Color-coded status indicators
