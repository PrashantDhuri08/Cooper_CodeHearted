// API client for Cooper backend
const API_BASE_URL = "https://unmalignantly-chalcedonic-ignacia.ngrok-free.dev";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Default headers for all requests
const defaultHeaders = {
  "ngrok-skip-browser-warning": "true",
  "Content-Type": "application/json",
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || response.statusText);
  }
  return response.json();
}

// Events API
export const createEvent = async (
  title: string,
  organizerId: number
): Promise<{ id: number; title: string; organizer_id: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/events?title=${encodeURIComponent(title)}&organizer_id=${organizerId}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

export const getEvent = async (
  eventId: number
): Promise<{ id: number; title: string; participants: Array<{ user_id: number }> }> => {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    headers: defaultHeaders,
  });
  return handleResponse(response);
};

export const listEvents = async (): Promise<Array<{ id: number; title: string }>> => {
  const response = await fetch(`${API_BASE_URL}/events`, {
    headers: defaultHeaders,
  });
  return handleResponse(response);
};

export const addParticipant = async (
  eventId: number,
  userId: number
): Promise<{ status: string; user_id: number }> => {
  const response = await fetch(
    `${API_BASE_URL}/events/${eventId}/participants?user_id=${userId}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

// Pool API
export const depositToPool = async (
  eventId: number,
  userId: number,
  amount: number
): Promise<{ status: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/pool/deposit?event_id=${eventId}&user_id=${userId}&amount=${amount}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

// Categories API
export const createCategory = async (
  eventId: number,
  name: string
): Promise<{ id: number; event_id: number; name: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/categories?event_id=${eventId}&name=${encodeURIComponent(name)}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

export const joinCategory = async (
  categoryId: number,
  userId: number
): Promise<{ status: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/categories/${categoryId}/join?user_id=${userId}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

// Expenses API
export const createExpense = async (
  eventId: number,
  categoryId: number,
  amount: number
): Promise<{ intent_id: string; payment_url: string; status: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/expenses?event_id=${eventId}&category_id=${categoryId}&amount=${amount}`,
    { method: "POST", headers: defaultHeaders }
  );
  return handleResponse(response);
};

// Settlement API
export const getSettlement = async (
  eventId: number
): Promise<{ [user_id: string]: number }> => {
  const response = await fetch(`${API_BASE_URL}/settlement/${eventId}`, {
    headers: defaultHeaders,
  });
  return handleResponse(response);
};

// Escrow API
export const getEscrowStatus = async (
  intentId: string
): Promise<{ id: string; amount: number; status: string; paymentUrl: string }> => {
  const response = await fetch(`${API_BASE_URL}/escrow/${intentId}`, {
    headers: defaultHeaders,
  });
  return handleResponse(response);
};
