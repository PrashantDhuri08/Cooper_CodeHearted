import axios from 'axios';
import { CreateEventResponse, PaymentIntentResponse, SettlementResponse, ExpenseCategory, PaymentStatus, LedgerEntry } from './types';

export * from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const FINTERNET_API_BASE = 'https://api.fmm.finternetlab.io/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const finternetApi = axios.create({
    baseURL: FINTERNET_API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const splitwiseApi = {
    // 1. Create Event
    createEvent: async (title: string, organizerId: number) => {
        const response = await api.post<CreateEventResponse>(`/events`, null, {
            params: { title, organizer_id: organizerId },
        });
        return response.data;
    },

    // 2. Add Participant
    addParticipant: async (eventId: string, userId: number) => {
        const response = await api.post<{ status: string }>(`/events/${eventId}/participants`, null, {
            params: { user_id: userId },
        });
        return response.data;
    },

    getParticipants: async (eventId: string) => {
        const response = await api.get<number[]>(`/events/${eventId}/participants`);
        return response.data;
    },

    // 3. Deposit Funds
    depositFunds: async (eventId: string, userId: number, amount: number) => {
        const response = await api.post<{ status: string }>(`/pool/deposit`, null, {
            params: { event_id: eventId, user_id: userId, amount },
        });
        return response.data;
    },

    getPoolBalance: async (eventId: string) => {
        const response = await api.get<{ balance: number }>(`/pool/${eventId}/balance`);
        return response.data.balance;
    },

    // 4. Create Category
    createCategory: async (eventId: string, categoryName: string) => {
        const response = await api.post<ExpenseCategory>(`/categories`, null, {
            params: { event_id: eventId, name: categoryName },
        });
        return response.data;
    },

    getCategories: async (eventId: string) => {
        const response = await api.get<ExpenseCategory[]>(`/categories`, {
            params: { event_id: eventId },
        });
        return response.data;
    },

    // 5. Join Category
    joinCategory: async (categoryId: number, userId: number) => {
        const response = await api.post<{ status: string }>(`/categories/${categoryId}/join`, null, {
            params: { user_id: userId },
        });
        return response.data;
    },

    // 6. Create Expense (Payment Intent)
    createExpense: async (eventId: string, categoryId: number, amount: number) => {
        const response = await api.post<PaymentIntentResponse>(`/expenses`, null, {
            params: { event_id: eventId, category_id: categoryId, amount },
        });
        return response.data;
    },

    // 7. Check Payment Status (Via local backend)
    checkPaymentStatus: async (intentId: string) => {
        const response = await api.get<PaymentStatus>(`/payments/${intentId}/status`);
        return response.data;
    },

    // 8. Release Payment
    releasePayment: async (intentId: string) => {
        const response = await finternetApi.post<{ intentId: string; status: string }>(`/payment-intents/${intentId}/release`);
        return response.data;
    },

    // 9. Get Ledger Entries
    getLedgerEntries: async () => {
        const response = await finternetApi.get<{ entries: LedgerEntry[] }>(`/payment-intents/account/ledger-entries`);
        return response.data.entries;
    },

    // 10. Get Settlement
    getSettlement: async (eventId: string) => {
        const response = await api.get<SettlementResponse>(`/settlement/${eventId}`);
        return response.data;
    },
};
