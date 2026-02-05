# Spending Rules Integration - Cooper Frontend

## 🛡️ Rule-Based Spending Control

The frontend now supports **spending rules** to control and restrict expenses based on configurable policies!

---

## 🆕 New Endpoint: Create Spending Rule

### Backend Route
```
POST /rules?event_id=&max_amount=&admin_only=&approval_required=
```

### Parameters
- **event_id** (required): Event ID
- **max_amount** (required): Maximum allowed amount
- **admin_only** (optional, default: false): Only admin can spend
- **approval_required** (optional, default: false): High-value expenses need 50% votes

### Response
```json
{
  "status": "rule created"
}
```

---

## 🎯 Rule Types

### 1️⃣ Admin-Only Spending
**Rule**:
```json
{
  "admin_only": true
}
```

**Effect**: Only admin can create expenses

**Use Case**: Strict control where only event admin manages spending

---

### 2️⃣ Amount Limit (Hard Cap)
**Rule**:
```json
{
  "max_amount": 500
}
```

**Effect**: Expenses above ₹500 are **blocked**

**Use Case**: Prevent overspending, enforce budget limits

---

### 3️⃣ High-Value Approval Required
**Rule**:
```json
{
  "max_amount": 500,
  "approval_required": true
}
```

**Effect**: Expenses > ₹500 need **50% group approval**

**Use Case**: Democratic spending for large amounts

---

## 🎨 New Component: SpendingRules

### Purpose
Create spending rules for an event to control expense creation.

### Features
- ✅ **Max Amount** input field
- ✅ **Admin-Only** checkbox
- ✅ **Approval Required** checkbox
- ✅ Clear explanations for each option
- ✅ Example scenarios in info box
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Amber/orange gradient theme

### Design
```
┌─────────────────────────────────┐
│ 🛡️ Spending Rules               │
├─────────────────────────────────┤
│ Maximum Amount (₹)              │
│ [500                         ]  │
│ Expenses above this restricted  │
│                                 │
│ ☑ Admin-Only Spending           │
│   Only admin can create expenses│
│                                 │
│ ☑ Require Group Approval        │
│   Expenses > max need 50% votes │
│                                 │
│ [Create Rule]                   │
│                                 │
│ 📋 Rule Examples:               │
│ • Admin-only: Only admin spends │
│ • Max ₹500: Block above ₹500    │
│ • Max ₹500 + Approval: Need votes│
└─────────────────────────────────┘
```

---

## 🔄 How Rules Work

### Creating a Rule
1. Navigate to event dashboard
2. Find **"Spending Rules"** card
3. Enter max amount (e.g., 500)
4. Check options:
   - Admin-only spending
   - Require group approval
5. Click **"Create Rule"**

### When Creating Expenses
1. User tries to create expense
2. Backend checks spending rules:
   - **Admin-only?** → Check if user is admin
   - **Amount > max?** → Check if blocked or needs approval
   - **Approval required?** → Check if user has 50% votes
3. Result:
   - ✅ **Rule passed** → Expense created
   - ❌ **Rule violated** → Error message

---

## 🧪 Example Scenarios

### Scenario 1: Admin-Only Rule
**Rule**: `admin_only = true`

**User tries to create expense**:
```json
{
  "error": "Only admin can spend"
}
```

**Admin creates expense**:
```json
{
  "intent_id": "intent_xxx",
  "payment_url": "...",
  "status": "INITIATED"
}
```

---

### Scenario 2: Amount Limit (No Approval)
**Rule**: `max_amount = 500`

**User creates ₹300 expense**:
```json
{
  "intent_id": "intent_xxx",
  "payment_url": "...",
  "status": "INITIATED"
}
```

**User creates ₹600 expense**:
```json
{
  "error": "Amount exceeds spending limit"
}
```

---

### Scenario 3: High-Value Approval
**Rule**: `max_amount = 500, approval_required = true`

**User creates ₹300 expense** (below limit):
```json
{
  "intent_id": "intent_xxx",
  "payment_url": "...",
  "status": "INITIATED"
}
```

**User creates ₹600 expense** (above limit, no votes):
```json
{
  "error": "50% approval required for this expense"
}
```

**User creates ₹600 expense** (above limit, has 50%+ votes):
```json
{
  "intent_id": "intent_xxx",
  "payment_url": "...",
  "status": "INITIATED"
}
```

---

## 📍 Dashboard Integration

**Location**: Row 2, Right Column (after Voting and Join Category)

**Layout**:
```
Row 2:
├─ VotingManager (Vote for users)
├─ JoinCategory (Join with 50% votes)
└─ SpendingRules (Create spending rules) ⭐ NEW
```

---

## 📊 All 16 API Routes

### Authentication (2)
1. ✅ POST /auth/register
2. ✅ POST /auth/login

### Events (3)
3. ✅ POST /events
4. ✅ POST /events/{id}/add-participant
5. ✅ GET /events/{id}/participants

### Categories (2)
6. ✅ POST /categories
7. ✅ POST /categories/{id}/join

### Voting (1)
8. ✅ POST /votes

### Expenses (2)
9. ✅ POST /expenses
10. ✅ GET /expenses/{id}/chart

### Payments (1)
11. ✅ GET /payments/{intent_id}/status

### Pool (2)
12. ✅ POST /pool/deposit
13. ✅ GET /pool/{id}

### Settlement (1)
14. ✅ GET /settlement/{id}

### Users (1)
15. ✅ GET /users/{id}/events

### Rules (1) ⭐ NEW
16. ✅ **POST /rules** ⭐ NEW

---

## 💡 Use Cases

### 1. Budget Control
**Problem**: Need to prevent overspending
**Solution**: Set `max_amount = 1000` (hard cap)

### 2. Admin-Managed Events
**Problem**: Only organizer should spend
**Solution**: Set `admin_only = true`

### 3. Democratic Spending
**Problem**: Large expenses need group consensus
**Solution**: Set `max_amount = 500, approval_required = true`

### 4. Tiered Spending
**Problem**: Small expenses OK, large need approval
**Solution**: Set `max_amount = 500, approval_required = true`

---

## 🧪 Testing

### Test 1: Create Admin-Only Rule
1. Navigate to event dashboard
2. Find "Spending Rules" card
3. Enter max amount: `1000`
4. Check "Admin-Only Spending"
5. Click "Create Rule"
6. Should see: "Spending rule created successfully!"

### Test 2: Create Approval Rule
1. Enter max amount: `500`
2. Check "Require Group Approval"
3. Click "Create Rule"
4. Should see success message

### Test 3: Rule Enforcement
1. Create rule with `max_amount = 500`
2. Try to create expense > ₹500
3. Should see error based on rule configuration

---

## 📁 Files Created/Updated

1. **`src/lib/api.ts`** - Added `createSpendingRule()` function
2. **`src/components/features/SpendingRules.tsx`** - New component
3. **`src/app/events/[eventId]/page.tsx`** - Added to dashboard
4. **`SPENDING_RULES_INTEGRATION.md`** - This documentation

---

## ✅ What's Working

- ✅ Create spending rules with max amount
- ✅ Admin-only spending option
- ✅ Approval required option
- ✅ Clear UI with checkboxes
- ✅ Example scenarios in info box
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Beautiful amber/orange theme
- ✅ Responsive design
- ✅ Form validation

---

## 🎯 Rule Enforcement Flow

```
User Creates Expense
       ↓
Backend Checks Rules
       ↓
┌──────────────────┐
│ Admin-only?      │ → Not admin? → ❌ "Only admin can spend"
└──────────────────┘
       ↓
┌──────────────────┐
│ Amount > max?    │ → Yes, no approval? → ❌ "Amount exceeds limit"
└──────────────────┘
       ↓
┌──────────────────┐
│ Approval needed? │ → Yes, no votes? → ❌ "50% approval required"
└──────────────────┘
       ↓
✅ Expense Created
```

---

## 🚀 The Spending Rules System is Complete!

Users can now:
1. **Create spending rules** for events
2. **Control who can spend** (admin-only)
3. **Set spending limits** (max amount)
4. **Require group approval** for large expenses
5. **Enforce budget policies** automatically

The frontend now supports **all 16 backend routes**! 🎉
