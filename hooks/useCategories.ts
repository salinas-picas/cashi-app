import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as apiService from '../services/apiService';
import { Category } from '../types/category';

export function useCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getCategories(token);
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getById = useCallback(async (id: number): Promise<Category | undefined> => {
    if (!token) return undefined;
    try {
      const data = await apiService.getCategories(token);
      return data.find(c => c.id === id);
    } catch {
      return undefined;
    }
  }, [token]);

  return { categories, loading, error, recargar, getById };
}
