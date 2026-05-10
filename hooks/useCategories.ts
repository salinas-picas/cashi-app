import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types/category';

const KEY = 'categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const raw = await AsyncStorage.getItem(KEY);
      setCategories(raw ? JSON.parse(raw) : []);
    } catch {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  const agregar = async (data: Omit<Category, 'id'>) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    const nueva: Category = { id: Date.now().toString(), ...data };
    await AsyncStorage.setItem(KEY, JSON.stringify([...list, nueva]));
  };

  const actualizar = async (id: string, data: Omit<Category, 'id'>) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    const updated = list.map(c => (c.id === id ? { ...c, ...data } : c));
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const eliminar = async (id: string) => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(c => c.id !== id);
    await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
  };

  const getById = useCallback(async (id: string): Promise<Category | undefined> => {
    const raw = await AsyncStorage.getItem(KEY);
    const list: Category[] = raw ? JSON.parse(raw) : [];
    return list.find(c => c.id === id);
  }, []);

  return { categories, loading, error, recargar, agregar, actualizar, eliminar, getById };
}
