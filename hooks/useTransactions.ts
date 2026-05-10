import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types/transaction';

const KEY = 'transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const raw = await AsyncStorage.getItem(KEY);
      setTransactions(raw ? JSON.parse(raw) : []);
    } catch {
      setError('Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  }, []);

  const agregar = async (data: Omit<Transaction, 'id' | 'date'>) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Transaction[] = raw ? JSON.parse(raw) : [];
    const nueva: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...data,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify([...list, nueva]));
  };

  const actualizar = async (id: string, data: Omit<Transaction, 'id' | 'date'>) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Transaction[] = raw ? JSON.parse(raw) : [];
    const updated = list.map(t => (t.id === id ? { ...t, ...data } : t));
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const eliminar = async (id: string) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Transaction[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(t => t.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
  };

  const getById = useCallback(async (id: string): Promise<Transaction | undefined> => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Transaction[] = raw ? JSON.parse(raw) : [];
    return list.find(t => t.id === id);
  }, []);

  return { transactions, loading, error, recargar, agregar, actualizar, eliminar, getById };
}
