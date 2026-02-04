# Cooper Frontend - Complete File Structure

```
frontend/
│
├── app/                                # Next.js App Router
│   ├── events/
│   │   └── [eventId]/
│   │       └── page.tsx               # Event Dashboard (main feature page)
│   │                                   # - Pool deposits
│   │                                   # - Category management
│   │                                   # - Expense creation
│   │                                   # - Settlement view
│   ├── globals.css                     # Global Tailwind styles
│   ├── layout.tsx                      # Root layout with metadata
│   ├── loading.tsx                     # Loading state component
│   └── page.tsx                        # Home page with event creation
│
├── components/                         # Reusable UI Components
│   ├── Button.tsx                      # Button with variants (primary, secondary, danger)
│   ├── Card.tsx                        # Card container with optional title
│   ├── ErrorMessage.tsx                # Error display component
│   ├── Input.tsx                       # Input field with label and error
│   └── LoadingSpinner.tsx              # Animated loading spinner
│
├── lib/                                # Utilities and Types
│   ├── api.ts                          # Backend API client functions
│   │                                   # - createEvent()
│   │                                   # - depositToPool()
│   │                                   # - createCategory()
│   │                                   # - joinCategory()
│   │                                   # - createExpense()
│   │                                   # - getSettlement()
│   │                                   # - getEscrowStatus()
│   └── types.ts                        # TypeScript type definitions
│
├── .gitignore                          # Git ignore file
├── next.config.mjs                     # Next.js configuration
├── next-env.d.ts                       # Next.js TypeScript declarations
├── package.json                        # Dependencies and scripts
├── postcss.config.mjs                  # PostCSS configuration
├── QUICKSTART.md                       # Quick start guide
├── README.md                           # Comprehensive documentation
├── tailwind.config.ts                  # Tailwind CSS configuration
└── tsconfig.json                       # TypeScript configuration
```

## Component Details

### Pages

#### `app/page.tsx` (Home Page)
- Event creation form
- Title input
- Organizer ID input
- Auto-navigation to event dashboard
- Instructions section

#### `app/events/[eventId]/page.tsx` (Event Dashboard)
**Four main sections:**

1. **Pool Deposits Card**
   - User ID input
   - Amount input
   - Deposit button
   - List of all deposits

2. **Category Management Card**
   - Category name input
   - Create category button
   - List of categories with:
     - Join functionality (user ID + join button)
     - Participant list display

3. **Expense Creation Card**
   - Category selector dropdown
   - Amount input
   - Create & pay button
   - Redirects to Finternet payment URL

4. **Settlement View Card**
   - Calculate settlement button
   - Balance table showing:
     - User IDs
     - Net balances (color-coded)
     - Green: owed refund
     - Red: owes money
     - Gray: settled

### Reusable Components

#### `Button.tsx`
```typescript
Props:
- variant: "primary" | "secondary" | "danger"
- loading: boolean
- className: string
- ...standard button props
```

#### `Input.tsx`
```typescript
Props:
- label: string (optional)
- error: string (optional)
- className: string
- ...standard input props
```

#### `Card.tsx`
```typescript
Props:
- title: string (optional)
- children: ReactNode
- className: string (optional)
```

#### `ErrorMessage.tsx`
```typescript
Props:
- message: string
```

#### `LoadingSpinner.tsx`
```typescript
No props - self-contained animated spinner
```

### API Client (`lib/api.ts`)

All functions return Promises and handle errors via `ApiError` class.

**Base URL:** `http://localhost:8000`

**Functions:**
- `createEvent(title, organizerId)` → Event object
- `depositToPool(eventId, userId, amount)` → Status
- `createCategory(eventId, name)` → Category object
- `joinCategory(categoryId, userId)` → Status
- `createExpense(eventId, categoryId, amount)` → Payment URL
- `getSettlement(eventId)` → Balance map
- `getEscrowStatus(intentId)` → Escrow status

### Types (`lib/types.ts`)

```typescript
- Event
- Category
- Deposit
- Participant
- ExpenseResponse
- SettlementBalance
- EscrowStatus
```

## State Management

**No global state management** - using simple React hooks:
- `useState` for local component state
- `useParams` for URL parameters
- `useRouter` for navigation

## Styling Approach

**Tailwind CSS utility classes:**
- Gradient backgrounds: `bg-gradient-to-br from-blue-50 to-indigo-100`
- Responsive grid: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Color coding: Green (positive), Red (negative), Gray (neutral)
- Shadows and rounded corners for card design
- Focus states with ring utilities

## Error Handling

All API calls wrapped in try-catch:
1. Show loading state during request
2. Display errors via `ErrorMessage` component
3. Clear errors on new attempts
4. User-friendly error messages

## Loading States

- Button loading: Disabled + "Loading..." text
- Page loading: Full-screen spinner via `loading.tsx`
- Inline loading: Per-action loading states

## Navigation Flow

```
Home (/)
  ↓ Create Event
Event Dashboard (/events/[id])
  ↓ Create Expense
Finternet Payment Page (external)
```

## Key Features

✅ **Type-safe** - Full TypeScript coverage  
✅ **Responsive** - Mobile and desktop layouts  
✅ **Error handling** - Comprehensive error states  
✅ **Loading states** - Visual feedback  
✅ **Clean UI** - Tailwind CSS design  
✅ **Real-time updates** - Client-side state management  
✅ **API integration** - All backend endpoints connected  

## Development Workflow

1. Install: `npm install`
2. Develop: `npm run dev`
3. Build: `npm run build`
4. Deploy: `npm start`

## Best Practices Followed

- ✅ Component separation
- ✅ Reusable UI elements
- ✅ TypeScript for type safety
- ✅ Error boundaries
- ✅ Loading states
- ✅ Responsive design
- ✅ Clean code structure
- ✅ Proper file organization
- ✅ Comprehensive documentation
- ✅ Production-ready code
