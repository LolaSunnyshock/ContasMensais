import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CheckCircle2, Circle, AlertCircle, CreditCard, Banknote, Calendar } from 'lucide-react';
import { getIconComponent } from '../utils/icons';

interface Props {
  transactions: Transaction[];
  title: string;
  type: TransactionType;
  colorTheme: 'pink' | 'blue' | 'emerald';
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  categoryIcons: Record<string, string>;
}

const TransactionTable: React.FC<Props> = ({ transactions, title, type, colorTheme, onDelete, onToggleStatus, categoryIcons }) => {
  const filtered = transactions.filter(t => t.type === type);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Pago
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Circle className="w-3 h-3 mr-1" /> A Pagar
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3 mr-1" /> Atrasado
          </span>
        );
      default:
        return null;
    }
  };

  const getIcon = () => {
    if (type === 'FIXED') return <Calendar className={`w-6 h-6 text-${colorTheme}-500 dark:text-${colorTheme}-400`} />;
    if (type === 'VARIABLE') return <CreditCard className={`w-6 h-6 text-${colorTheme}-500 dark:text-${colorTheme}-400`} />;
    return <Banknote className={`w-6 h-6 text-${colorTheme}-500 dark:text-${colorTheme}-400`} />;
  };

  const headerColor = {
    pink: 'text-pink-600 dark:text-pink-400',
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400'
  }[colorTheme];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 transition-colors">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h2 className={`text-lg font-bold ${headerColor} uppercase tracking-wide`}>{title}</h2>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
          {filtered.length} itens
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/80">
              <th className="px-4 py-3 min-w-[200px]">Descrição</th>
              <th className="px-4 py-3 min-w-[140px]">Categoria</th>
              <th className="px-4 py-3 min-w-[120px]">Valor</th>
              <th className="px-4 py-3 min-w-[120px]">Status</th>
              <th className="px-4 py-3 min-w-[150px]">Forma de Pagamento</th>
              <th className="px-4 py-3 w-[50px]"></th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200 flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${colorTheme}-50 dark:bg-${colorTheme}-900/30 text-${colorTheme}-600 dark:text-${colorTheme}-400`}>
                        {getIconComponent(categoryIcons[t.category], "w-4 h-4")}
                    </div>
                    {t.description}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2.5 cursor-pointer select-none" onClick={() => onToggleStatus(t.id)}>
                    {getStatusBadge(t.status)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-slate-500 dark:text-slate-400 text-xs bg-slate-50 dark:bg-slate-700/50 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;