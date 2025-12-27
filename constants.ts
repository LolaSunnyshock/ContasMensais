import { Transaction, MonthData, CategoryIconMap } from './types';

// Helper to get current year
const currentYear = new Date().getFullYear();

export const MONTHS: MonthData[] = [
  { id: `${currentYear}-01`, name: 'Janeiro', year: currentYear },
  { id: `${currentYear}-02`, name: 'Fevereiro', year: currentYear },
  { id: `${currentYear}-03`, name: 'Março', year: currentYear },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Fixed Expenses
  { id: '1', description: 'Aluguel', category: 'Casa', amount: 2500.00, status: 'PAID', paymentMethod: 'Boleto', date: `${currentYear}-01-05`, type: 'FIXED' },
  { id: '2', description: 'Condomínio', category: 'Casa', amount: 800.00, status: 'PAID', paymentMethod: 'Boleto', date: `${currentYear}-01-10`, type: 'FIXED' },
  { id: '3', description: 'Internet', category: 'Casa', amount: 120.00, status: 'PAID', paymentMethod: 'Débito Auto', date: `${currentYear}-01-15`, type: 'FIXED' },
  { id: '4', description: 'Netflix', category: 'Assinatura', amount: 55.90, status: 'PENDING', paymentMethod: 'Cartão Crédito', date: `${currentYear}-01-20`, type: 'FIXED' },
  
  // Variable Expenses
  { id: '6', description: 'Supermercado Semanal', category: 'Alimentação', amount: 450.00, status: 'PAID', paymentMethod: 'Cartão Crédito', date: `${currentYear}-01-08`, type: 'VARIABLE' },
  
  // Income
  { id: '10', description: 'Salário', category: 'Trabalho', amount: 6500.00, status: 'PAID', paymentMethod: 'Transferência', date: `${currentYear}-01-05`, type: 'INCOME' },
];

export const CATEGORIES = {
  FIXED: ['Casa', 'Educação', 'Assinatura', 'Transporte', 'Saúde'],
  VARIABLE: ['Alimentação', 'Lazer', 'Vestuário', 'Presentes', 'Outros'],
  INCOME: ['Trabalho', 'Investimentos', 'Extra']
};

export const DEFAULT_CATEGORY_ICONS: CategoryIconMap = {
  'Casa': 'Home',
  'Educação': 'GraduationCap',
  'Assinatura': 'Smartphone',
  'Transporte': 'Car',
  'Saúde': 'HeartPulse',
  'Alimentação': 'Utensils',
  'Lazer': 'Gamepad',
  'Vestuário': 'Shirt',
  'Presentes': 'Gift',
  'Outros': 'Tag',
  'Trabalho': 'Briefcase',
  'Investimentos': 'DollarSign',
  'Extra': 'Zap'
};
