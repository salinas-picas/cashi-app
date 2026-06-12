import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { transactionSchema, TransactionFormData } from '../schemas/transaction.schema';

type Mode = 'create' | 'edit';

type Props = {
  mode: Mode;
  defaultValues?: Partial<TransactionFormData>;
  onSubmit: (data: TransactionFormData) => void;
};

export function useTransactionForm({ mode, defaultValues, onSubmit }: Props) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (mode === 'create') {
        setAmount('');
        setType('expense');
        setDescription('');
        setCategoryId('');
        setError('');
      }
    }, [mode])
  );

  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      if (defaultValues.amount !== undefined) setAmount(defaultValues.amount.toString());
      if (defaultValues.type) setType(defaultValues.type);
      if (defaultValues.description !== undefined) setDescription(defaultValues.description);
      if (defaultValues.categoryId !== undefined) setCategoryId(defaultValues.categoryId);
    }
  }, [defaultValues]);

  const handleSubmit = () => {
    const result = transactionSchema.safeParse({
      amount: parseFloat(amount),
      type,
      description,
      categoryId,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Error de validación');
      return;
    }
    setError('');
    onSubmit(result.data);
  };

  return { amount, setAmount, type, setType, description, setDescription, categoryId, setCategoryId, error, handleSubmit };
}
