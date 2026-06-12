import { Transaction } from '../types/transaction';
import { Category } from '../types/category';

const API_URL = 'https://cashi-api-hp21.onrender.com';

type RequestOptions = RequestInit & { token?: string };

async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {};

  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: { ...(fetchOptions.headers as Record<string, string>), ...headers },
    });
  } catch {
    throw new Error('Error de conexión');
  }

  if (!res.ok) {
    const rawText = await res.text().catch(() => '');
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(rawText); } catch { /* body no es JSON */ }
    const msg = (parsed.error ?? parsed.message ?? parsed.detail ?? rawText ?? 'Error desconocido') as string;
    throw new Error(msg);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

function normalizeTransaction(raw: Record<string, unknown>): Transaction {
  const { latitude, longitude, ...rest } = raw;
  return {
    ...rest,
    ...(latitude != null && longitude != null
      ? { location: { latitude: latitude as number, longitude: longitude as number } }
      : {}),
  } as Transaction;
}

export async function register(email: string, password: string): Promise<{ token: string }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCategories(token: string): Promise<Category[]> {
  return request('/categories', { token });
}

export async function getTransactions(token: string): Promise<Transaction[]> {
  const data = await request<Record<string, unknown>[]>('/transactions', { token });
  return data.map(normalizeTransaction);
}

export async function getTransactionById(token: string, id: number): Promise<Transaction> {
  const data = await request<Record<string, unknown>>(`/transactions/${id}`, { token });
  return normalizeTransaction(data);
}

export async function createTransaction(token: string, data: Record<string, unknown>): Promise<Transaction> {
  const raw = await request<Record<string, unknown>>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });
  return normalizeTransaction(raw);
}

export async function updateTransaction(token: string, id: number, data: Record<string, unknown>): Promise<Transaction> {
  const raw = await request<Record<string, unknown>>(`/transactions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    token,
  });
  return normalizeTransaction(raw);
}

export async function deleteTransaction(token: string, id: number): Promise<void> {
  await request(`/transactions/${id}`, { method: 'DELETE', token });
}

export async function getBalance(token: string): Promise<{ totalIncome: number; totalExpense: number; balance: number }> {
  return request('/transactions/balance', { token });
}

export async function uploadReceipt(token: string, photoUri: string): Promise<{ receiptUrl: string }> {
  const formData = new FormData();
  const filename = photoUri.split('/').pop() ?? 'photo.jpg';
  formData.append('receipt', { uri: photoUri, name: filename, type: 'image/jpeg' } as unknown as Blob);
  return request('/transactions/upload', { method: 'POST', body: formData, token });
}
