export type Transaction = {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryId: number;
  photoUri?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};
