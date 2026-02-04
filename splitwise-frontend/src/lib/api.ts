import axios from 'axios';

export * from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ========================================
// 🎯 BACKEND API ROUTES (14 TOTAL)
// ========================================

export const splitwiseApi = {
    // 1️⃣ Register User
    // POST /auth/register?email=&password=
    register: async (email: string, password: string) => {
        const response = await api.post<{ status: string }>('/auth/register', null, {
            params: { email, password },
        });
        return response.data;
    },

    // 2️⃣ Login User
    // POST /auth/login?email=&password=
    login: async (email: string, password: string) => {
        const response = await api.post<{ user_id: number } | { error: string }>('/auth/login', null, {
            params: { email, password },
        });
        return response.data;
    },

    // 3️⃣ Create Event (Admin creates event)
    // POST /events?title=&admin_email=
    createEvent: async (title: string, adminEmail: string) => {
        const response = await api.post<{ event_id: number }>('/events', null, {
            params: { title, admin_email: adminEmail },
        });
        return response.data;
    },

    // 4️⃣ Add Participant to Event (Admin only)
    // POST /events/{event_id}/add-participant?email=&admin_id=
    addParticipant: async (eventId: number, email: string, adminId: number) => {
        const response = await api.post<{ status: string } | { error: string }>(
            `/events/${eventId}/add-participant`,
            null,
            {
                params: { email, admin_id: adminId },
            }
        );
        return response.data;
    },

    // 5️⃣ Create Category
    // POST /categories?event_id=&name=
    createCategory: async (eventId: number, name: string) => {
        const response = await api.post<{ category_id: number }>('/categories', null, {
            params: { event_id: eventId, name },
        });
        return response.data;
    },

    // 6️⃣ Join Category (50% vote required)
    // POST /categories/{category_id}/join?user_id=&event_id=
    joinCategory: async (categoryId: number, userId: number, eventId: number) => {
        const response = await api.post<{ status: string } | { error: string }>(
            `/categories/${categoryId}/join`,
            null,
            {
                params: { user_id: userId, event_id: eventId },
            }
        );
        return response.data;
    },

    // 7️⃣ Vote for User Inclusion
    // POST /votes?event_id=&target_user_id=&voter_user_id=&approve=
    vote: async (eventId: number, targetUserId: number, voterUserId: number, approve: boolean) => {
        const response = await api.post<{ status: string }>('/votes', null, {
            params: {
                event_id: eventId,
                target_user_id: targetUserId,
                voter_user_id: voterUserId,
                approve,
            },
        });
        return response.data;
    },

    // 8️⃣ Create Expense (Creates Finternet Payment Intent)
    // POST /expenses?event_id=&category_id=&amount=
    createExpense: async (eventId: number, categoryId: number, amount: number) => {
        const response = await api.post<{
            intent_id: string;
            payment_url: string;
            status: string;
        }>('/expenses', null, {
            params: { event_id: eventId, category_id: categoryId, amount },
        });
        return response.data;
    },

    // 9️⃣ Get Payment Intent Status
    // GET /payments/{intent_id}/status
    getPaymentStatus: async (intentId: string) => {
        const response = await api.get<{
            intent_id: string;
            status: string;
            settlement_status: string;
        }>(`/payments/${intentId}/status`);
        return response.data;
    },

    // 🔟 Deposit to Pool (Creates Finternet Payment Intent)
    // POST /pool/deposit?event_id=&user_id=&amount=
    depositToPool: async (eventId: number, userId: number, amount: number) => {
        const response = await api.post<{
            intent_id: string;
            payment_url: string;
            status: string;
        }>('/pool/deposit', null, {
            params: { event_id: eventId, user_id: userId, amount },
        });
        return response.data;
    },

    // 1️⃣1️⃣ Get Pool Balance
    // GET /pool/{event_id}
    getPool: async (eventId: number) => {
        const response = await api.get<{
            event_id: number;
            total_pool: number;
            contributors: Array<{
                user_id: number;
                amount: number;
            }>;
        }>(`/pool/${eventId}`);
        return response.data;
    },

    // 1️⃣2️⃣ Get Settlement
    // GET /settlement/{event_id}
    getSettlement: async (eventId: number) => {
        const response = await api.get<{
            event_id: number;
            settlement: Array<{
                user_id: number;
                net_balance: number;
            }>;
        }>(`/settlement/${eventId}`);
        return response.data;
    },

    // 1️⃣3️⃣ Get Expense Chart
    // GET /expenses/{event_id}/chart
    getExpenseChart: async (eventId: number) => {
        const response = await api.get<{
            event_id: number;
            by_category: Array<{
                category: string;
                amount: number;
            }>;
        }>(`/expenses/${eventId}/chart`);
        return response.data;
    },

    // 1️⃣4️⃣ Get User Events
    // GET /users/{user_id}/events
    getUserEvents: async (userId: number) => {
        const response = await api.get<{
            user_id: number;
            events: Array<{
                event_id: number;
                title: string;
            }>;
        }>(`/users/${userId}/events`);
        return response.data;
    },
};
