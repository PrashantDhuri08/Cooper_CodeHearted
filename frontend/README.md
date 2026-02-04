# Cooper Frontend

A Next.js 14 (App Router) frontend for the Cooper group expense management platform with Finternet payment integration.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Features

### 1. Event Creation (Home Page)
- Create new expense events
- Set organizer ID
- Auto-navigate to event dashboard

### 2. Event Dashboard (`/events/[eventId]`)

#### Shared Pool Management
- Deposit funds to shared pool
- Track all deposits by user

#### Category Management
- Create expense categories (e.g., Food, Transport)
- Users can join categories
- Track category participants

#### Expense Creation & Payment
- Select category
- Enter expense amount
- Automatic redirect to Finternet payment URL
- Backend handles expense splitting among category participants

#### Real-time Settlement View
- Calculate net balances
- Visual indicators:
  - **Green**: User is owed a refund (positive balance)
  - **Red**: User owes money (negative balance)
  - **Gray**: Settled (zero balance)

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (event creation)
│   ├── globals.css             # Global styles
│   └── events/
│       └── [eventId]/
│           └── page.tsx        # Event dashboard
├── components/
│   ├── Button.tsx              # Reusable button
│   ├── Input.tsx               # Reusable input
│   ├── Card.tsx                # Card container
│   ├── ErrorMessage.tsx        # Error display
│   └── LoadingSpinner.tsx      # Loading state
├── lib/
│   ├── api.ts                  # Backend API functions
│   └── types.ts                # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## API Integration

All backend endpoints are integrated via `lib/api.ts`:

- `POST /events` - Create event
- `POST /pool/deposit` - Deposit to pool
- `POST /categories` - Create category
- `POST /categories/{id}/join` - Join category
- `POST /expenses` - Create expense (returns payment URL)
- `GET /settlement/{eventId}` - Get settlement balances
- `GET /escrow/{intentId}` - Check escrow status

## Environment Configuration

Backend URL is hardcoded to `http://localhost:8000`. To change:

Edit `frontend/lib/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:8000"; // Change this
```

## User Flow

1. **Create Event** → Enter title and organizer ID
2. **Navigate to Dashboard** → Automatic redirect after creation
3. **Add Deposits** → Users deposit funds to shared pool
4. **Create Categories** → Define expense groups (Food, Transport, etc.)
5. **Join Categories** → Users join relevant categories
6. **Create Expense** → Select category, enter amount
7. **Pay via Finternet** → Redirect to payment URL
8. **View Settlement** → See who owes/is owed money

## Design Principles

- **No Authentication** - Uses numeric user IDs
- **Client-side State** - Simple useState for UI state
- **No Local Splitting Logic** - Backend handles all expense calculations
- **Payment Redirect** - Finternet payment via URL redirect
- **Clean UI** - Tailwind CSS with gradient backgrounds
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls

## Notes

- User IDs are numeric (1, 2, 3, etc.)
- All amounts support decimals (0.01 precision)
- Settlement calculation is backend-driven
- Expense splitting is automatic based on category participants
- Payment execution happens on Finternet's payment page

## Development

To add new features:

1. Add API function in `lib/api.ts`
2. Add TypeScript types in `lib/types.ts`
3. Create/update page components in `app/`
4. Use existing UI components from `components/`

## Troubleshooting

**CORS errors**: Ensure backend allows `http://localhost:3000`

**API connection failed**: Check backend is running on port 8000

**Type errors**: Run `npm run build` to check TypeScript errors
