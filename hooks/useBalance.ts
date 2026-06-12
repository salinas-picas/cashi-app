import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as apiService from '../services/apiService';

export function useBalance() {
  const { token } = useAuth();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getBalance(token);
      setTotalIncome(data.totalIncome);
      setTotalExpense(data.totalExpense);
      setBalance(data.balance);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al calcular balance');
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { totalIncome, totalExpense, balance, loading, error, recargar };
}
