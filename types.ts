
export type TransactionType = 'FIXED' | 'VARIABLE' | 'INCOME';

export type Status = 'PAID' | 'PENDING' | 'LATE';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  status: Status;
  paymentMethod: string;
  date: string; // ISO string YYYY-MM-DD
  type: TransactionType;
}

export interface MonthData {
  id: string;
  name: string;
  year: number;
}

export interface SummaryStats {
  totalIncome: number;
  totalFixed: number;
  totalVariable: number;
  balance: number;
}

export type CategoryMap = Record<TransactionType, string[]>;

// New type for mapping category names to icon names
export type CategoryIconMap = Record<string, string>;
