import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  description: z.string(),
  categoryId: z.string(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
