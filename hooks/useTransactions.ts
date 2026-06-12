import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as apiService from '../services/apiService';
import { Transaction } from '../types/transaction';

type TransactionBody = Omit<Transaction, 'id' | 'date'>;

function buildApiBody(data: TransactionBody) {
  const { photoUri, location, ...rest } = data;
  return {
    ...rest,
    ...(photoUri ? { photoUri } : {}),
    ...(location ? { latitude: location.latitude, longitude: location.longitude } : {}),
  };
}

export function useTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getTransactions(token);
      setTransactions(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const agregar = async (data: TransactionBody) => {
    if (!token) return;
    setError('');
    try {
      let { photoUri } = data;
      if (photoUri?.startsWith('file://')) {
        const { receiptUrl } = await apiService.uploadReceipt(token, photoUri);
        photoUri = receiptUrl;
      }
      const body = buildApiBody({ ...data, photoUri });
      await apiService.createTransaction(token, { ...body, date: new Date().toISOString() });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al crear transacción';
      setError(msg);
      throw new Error(msg);
    }
  };

  const actualizar = async (id: number, data: TransactionBody) => {
    if (!token) return;
    setError('');
    try {
      console.log('[actualizar] inicio — id:', id, 'typeof:', typeof id);
      let { photoUri } = data;
      if (photoUri?.startsWith('file://')) {
        console.log('[actualizar] subiendo receipt:', photoUri);
        const { receiptUrl } = await apiService.uploadReceipt(token, photoUri);
        console.log('[actualizar] receipt subido:', receiptUrl);
        photoUri = receiptUrl;
      }
      console.log('[actualizar] llamando updateTransaction — URL: /transactions/' + id);
      await apiService.updateTransaction(token, id, buildApiBody({ ...data, photoUri }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al actualizar transacción';
      setError(msg);
      throw new Error(msg);
    }
  };

  const eliminar = async (id: number) => {
    if (!token) return;
    setError('');
    try {
      await apiService.deleteTransaction(token, id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error al eliminar transacción';
      setError(msg);
      throw new Error(msg);
    }
  };

  const getById = useCallback(async (id: number): Promise<Transaction | undefined> => {
    if (!token) return undefined;
    try {
      return await apiService.getTransactionById(token, id);
    } catch {
      return undefined;
    }
  }, [token]);

  const getBalance = useCallback(async () => {
    if (!token) return { totalIncome: 0, totalExpense: 0, balance: 0 };
    return apiService.getBalance(token);
  }, [token]);

  return { transactions, loading, error, recargar, agregar, actualizar, eliminar, getById, getBalance };
}
