# Rule-Based Functionality Temporarily Removed

## 🔄 Changes Made

The spending rule-based functionality has been **temporarily removed** to simplify the expense creation flow.

---

## ✅ What Was Removed

### Backend (`backend/app/api/expenses.py`)

**Before** (With Rules):
```python
from app.models.spending_rule import SpendingRule
from app.services.rule_engine import check_spending_rules

@router.post("/")
def create_expense(
    event_id: int,
    category_id: int,
    amount: float,
    user_id: int,  # Required for rule checking
    db: Session = Depends(get_db)
):
    rule = db.query(SpendingRule).filter_by(event_id=event_id).first()
    
    if rule:
        allowed, reason = check_spending_rules(
            db=db,
            event_id=event_id,
            user_id=user_id,
            amount=amount,
            rule=rule
        )
        if not allowed:
            return {"error": reason}
    
    # Finternet logic...
```

**After** (Without Rules):
```python
from app.services.finternet_client import FinternetClient

finternet = FinternetClient()

@router.post("/")
def create_expense(
    event_id: int,
    category_id: int,
    amount: float,
    # user_id removed - not needed without rules
    db: Session = Depends(get_db)
):
    # Create Finternet payment intent
    intent = finternet.create_payment_intent(amount)

    # Store expense in database
    expense = Expense(
        event_id=event_id,
        category_id=category_id,
        amount=amount,
        payment_intent_id=intent["id"]
    )
    db.add(expense)
    db.commit()

    return {
        "intent_id": intent["id"],
        "payment_url": intent["paymentUrl"],
        "status": intent["status"]
    }
```

---

### Frontend

**API Call** (`src/lib/api.ts`):
```typescript
// Reverted to original signature
createExpense: async (eventId: number, categoryId: number, amount: number)
```

**Component** (`src/components/features/CreateExpense.tsx`):
```typescript
// Removed userId prop
interface CreateExpenseProps {
    eventId: number;
    // userId removed
}
```

**Dashboard** (`src/app/events/[eventId]/page.tsx`):
```tsx
{/* Removed userId prop */}
<CreateExpense eventId={eventId} />
```

---

## 📊 Current API Endpoint

### Create Expense
```
POST /expenses?event_id=&category_id=&amount=
```

**Parameters**:
- `event_id` (required): Event ID
- `category_id` (required): Category ID
- `amount` (required): Expense amount

**Response**:
```json
{
  "intent_id": "intent_xxx",
  "payment_url": "https://pay.fmm.finternetlab.io/?intent=intent_xxx",
  "status": "INITIATED"
}
```

---

## 🎯 What Still Works

✅ **Expense Creation**
- Create expenses with Finternet payment
- Get payment URL
- Track payment intent

✅ **Other Features**
- User authentication
- Event management
- Participant management
- Categories
- Voting
- Pool deposits
- Settlement
- Expense charts

---

## ❌ What's Temporarily Disabled

❌ **Spending Rules**
- Admin-only spending checks
- Amount limit enforcement
- Approval requirement validation

❌ **SpendingRules Component**
- Still visible in UI
- Creates rules in database
- But rules are **not enforced** during expense creation

---

## 💡 Why Remove Rules Temporarily?

1. **Simplify testing** - Focus on core expense functionality
2. **Avoid complexity** - Rule enforcement can be added back later
3. **Faster development** - Get basic features working first
4. **Easier debugging** - Fewer moving parts

---

## 🔮 To Re-Enable Rules Later

1. **Backend**: Restore rule checking in `expenses.py`
2. **Add `user_id` parameter** back to expense creation
3. **Frontend**: Pass `userId` to `CreateExpense` component
4. **Test rule scenarios** (admin-only, limits, approval)

---

## ✅ Current Status

- ✅ Basic expense creation working
- ✅ Finternet payment integration working
- ✅ No rule enforcement (simplified)
- ✅ SpendingRules component still in UI (for future use)

**The expense creation is now simplified and working without rule enforcement!** 🎉
