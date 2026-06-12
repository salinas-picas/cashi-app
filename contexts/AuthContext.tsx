import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as apiService from '../services/apiService';

const TOKEN_KEY = 'cashi_token';
const EMAIL_KEY = 'cashi_email';

type AuthContextType = {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(EMAIL_KEY),
    ]).then(([t, e]) => {
      setToken(t);
      setEmail(e);
      setIsLoading(false);
    });
  }, []);

  const login = async (userEmail: string, password: string) => {
    const data = await apiService.login(userEmail, password);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    await SecureStore.setItemAsync(EMAIL_KEY, userEmail);
    setToken(data.token);
    setEmail(userEmail);
  };

  const register = async (userEmail: string, password: string) => {
    const data = await apiService.register(userEmail, password);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    await SecureStore.setItemAsync(EMAIL_KEY, userEmail);
    setToken(data.token);
    setEmail(userEmail);
  };

  const logout = async () => {
    setToken(null);
    setEmail(null);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(EMAIL_KEY);
    } catch {
      // El estado ya fue limpiado; el error de SecureStore no es crítico
    }
  };

  return (
    <AuthContext.Provider value={{ token, email, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
