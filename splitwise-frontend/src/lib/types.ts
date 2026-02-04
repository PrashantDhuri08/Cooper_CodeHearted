export interface Event {
    eventId: string;
    title: string;
    organizerId: number;
}

export interface Participant {
    id: number;
    eventId: string;
    userId: number;
}

export interface ExpenseCategory {
    id: number;
    eventId: string;
    name: string;
}

export interface Expense {
    id: number;
    eventId: string;
    categoryId: number;
    amount: number;
    payerId: number; // Assuming payer is tracked, though endpoint doesn't explicitly ask for it in CREATE EXPENSE? 
    // Wait, CREATE EXPENSE: POST /expenses?event_id={eventId}&category_id={categoryId}&amount={amount}
    // It doesn't take user_id? That's odd. Maybe it assumes a context or it's incomplete in spec. 
    // Re-reading spec: "POST /expenses... UI: Select Category, Input Amount". 
    // Maybe backend handles it? Or maybe I missed something. 
    // Ah, the user flow says "CREATE EXPENSE (FINTERNET PAYMENT)".
    // For now I'll stick to the response types.
}

export interface Settlement {
    userId: number;
    netBalance: number;
}

export interface Deposit {
    userId: number;
    amount: number;
}

export interface CreateEventResponse {
    id: number;
    title: string;
    organizer_id: number;
}

export interface PaymentIntentResponse {
    intent_id: string;
    payment_url: string;
    status: string;
}

export interface PaymentStatus {
    intent_id: string;
    status: string;
    settlement_status: string;
}

export interface LedgerEntry {
    reference: string;
    amount: string;
    status: string;
}

export type SettlementResponse = Record<string, number>;
