import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

export function useBalance() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const raw = await AsyncStorage.getItem('transactions');
      const list: Transaction[] = raw ? JSON.parse(raw) : [];
      const income = list
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = list
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      setTotalIncome(income);
      setTotalExpense(expense);
      setBalance(income - expense);
    } catch {
      setError('Error al calcular balance');
    } finally {
      setLoading(false);
    }
  }, []);

  return { totalIncome, totalExpense, balance, loading, error, recargar };
}
