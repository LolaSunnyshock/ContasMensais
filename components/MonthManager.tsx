import React, { useState } from 'react';
import { MonthData } from '../types';
import { X, CalendarPlus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  months: MonthData[];
  onAddMonth: (month: number, year: number) => void;
  onDeleteMonth: (id: string) => void;
}

const MonthManager: React.FC<Props> = ({ isOpen, onClose, months, onAddMonth, onDeleteMonth }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());

  if (!isOpen) return null;

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleAdd = () => {
    onAddMonth(selectedMonthIndex + 1, selectedYear);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Gerenciar Meses</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Adicionar Novo Mês</h3>
            <div className="flex gap-2">
               <select 
                 value={selectedMonthIndex}
                 onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                 className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
               >
                 {monthNames.map((name, idx) => (
                   <option key={idx} value={idx}>{name}</option>
                 ))}
               </select>
               <input 
                 type="number"
                 value={selectedYear}
                 onChange={(e) => setSelectedYear(Number(e.target.value))}
                 className="w-24 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
               />
               <button 
                 onClick={handleAdd}
                 className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
               >
                 Criar
               </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Meses Ativos</h3>
            {months.sort((a,b) => b.id.localeCompare(a.id)).map((month) => (
              <div key={month.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-lg group hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                <span className="text-slate-700 dark:text-slate-200 font-medium text-sm">{month.name} {month.year}</span>
                <button 
                  onClick={() => onDeleteMonth(month.id)}
                  className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                  title="Remover mês"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthManager;