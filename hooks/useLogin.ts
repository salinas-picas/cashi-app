import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError('');
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return { email, password, error, loading, handleEmailChange, handlePasswordChange, handleLogin };
}
