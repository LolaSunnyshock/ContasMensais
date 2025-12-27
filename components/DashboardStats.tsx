import React from 'react';
import { SummaryStats } from '../types';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface Props {
  stats: SummaryStats;
}

const DashboardStats: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Balance */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stats.balance >= 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}`}>
            {stats.balance >= 0 ? 'Positivo' : 'Negativo'}
          </span>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saldo Atual</p>
          <h3 className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-slate-800 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'}`}>
            R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Income */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Receitas</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            R$ {stats.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Fixed Expenses */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
            <PiggyBank className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Despesas Fixas</p>
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            R$ {stats.totalFixed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Variable Expenses */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Despesas Variáveis</p>
          <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            R$ {stats.totalVariable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;