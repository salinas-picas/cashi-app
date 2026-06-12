import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a cero'),
  type: z.enum(['income', 'expense']),
  description: z.string(),
  categoryId: z.number().int().positive('Selecciona una categoría'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
