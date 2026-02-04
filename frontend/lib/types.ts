// API Types based on backend responses

export interface Event {
  id: number;
  title: string;
  organizer_id: number;
}

export interface Category {
  id: number;
  event_id: number;
  name: string;
}

export interface Deposit {
  user_id: number;
  amount: number;
}

export interface Participant {
  user_id: number;
}

export interface ExpenseResponse {
  intent_id: string;
  payment_url: string;
  status: string;
}

export interface SettlementBalance {
  [user_id: string]: number;
}

export interface EscrowStatus {
  id: string;
  amount: number;
  status: string;
  paymentUrl: string;
}
