# Cooper Frontend - Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```

## Project Info

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: http://localhost:8000

## File Overview

- `app/page.tsx` - Home page with event creation
- `app/events/[eventId]/page.tsx` - Event dashboard with all features
- `components/` - Reusable UI components
- `lib/api.ts` - Backend API integration
- `lib/types.ts` - TypeScript type definitions

## Key Features

1. **Event Creation** - Create new events with organizer ID
2. **Pool Deposits** - Add funds to shared pool
3. **Categories** - Create and join expense categories
4. **Expenses** - Create expenses with Finternet payment redirect
5. **Settlement** - View real-time balance calculations

## Environment

Backend URL is set to `http://localhost:8000` in `lib/api.ts`. The backend must be running before using the frontend.

## Support

See main project README for full documentation.
