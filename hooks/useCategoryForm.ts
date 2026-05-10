import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { categorySchema, CategoryFormData } from '../schemas/category.schema';

type Mode = 'create' | 'edit';

type Props = {
  mode: Mode;
  defaultValues?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
};

export function useCategoryForm({ mode, defaultValues, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Reset every time the screen gains focus in create mode
  useFocusEffect(
    useCallback(() => {
      if (mode === 'create') {
        setName('');
        setError('');
      }
    }, [mode])
  );

  // Populate field once when editing and defaultValues arrive
  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      setName(defaultValues.name);
    }
  }, [defaultValues]);

  const handleSubmit = () => {
    const result = categorySchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Error de validación');
      return;
    }
    setError('');
    onSubmit(result.data);
  };

  return { name, setName, error, handleSubmit };
}
