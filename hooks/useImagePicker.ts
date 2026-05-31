import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFromGallery = async () => {
    setLoading(true);
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso de galería denegado');
      setLoading(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
    setLoading(false);
  };

  const takePhoto = async () => {
    setLoading(true);
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Permiso de cámara denegado');
      setLoading(false);
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
    setLoading(false);
  };

  const reset = useCallback((initial: string | null = null) => {
    setPhotoUri(initial);
    setError(null);
  }, []);

  const clearPhoto = () => {
    setPhotoUri(null);
    setError(null);
  };

  return { photoUri, pickFromGallery, takePhoto, clearPhoto, reset, error, loading };
}
