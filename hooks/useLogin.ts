import { useState } from 'react';
import { useRouter } from 'expo-router';

export function useLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError('');
  };

  const handleLogin = () => {
    if (email !== 'usuario@correo.com' || password !== '1234') {
      setError('Credenciales incorrectas');
      return;
    }
    router.push('/(tabs)');
  };

  return { email, password, error, handleEmailChange, handlePasswordChange, handleLogin };
}
