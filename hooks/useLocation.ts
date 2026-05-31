import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso de ubicación denegado');
      setLoading(false);
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    setLoading(false);
  };

  const reset = useCallback((initial: { latitude: number; longitude: number } | null = null) => {
    setLocation(initial);
    setError(null);
  }, []);

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  return { location, getLocation, clearLocation, reset, error, loading };
}
