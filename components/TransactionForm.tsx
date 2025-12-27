import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Transaction, TransactionType, CategoryMap } from '../types';

interface Props {
  onAddTransaction: (t: Partial<Transaction>) => void;
  categories: CategoryMap;
  selectedMonthId: string; // Expected format YYYY-MM
}

const TransactionForm: React.FC<Props> = ({ onAddTransaction, categories, selectedMonthId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('VARIABLE');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [date, setDate] = useState('');

  // Update default date when the selected month changes
  useEffect(() => {
    if (selectedMonthId) {
      const now = new Date();
      // If current month matches selected month, use today. Otherwise use 1st of selected month.
      const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM
      
      if (currentMonthStr === selectedMonthId) {
         setDate(now.toISOString().split('T')[0]);
      } else {
         setDate(`${selectedMonthId}-01`);
      }
    }
  }, [selectedMonthId]);

  // Update category when type changes or if current category is invalid for new type
  useEffect(() => {
    const currentCats = categories[type];
    if (!currentCats.includes(category)) {
      setCategory(currentCats[0] || '');
    }
  }, [type, categories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) return;

    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    onAddTransaction({
      description,
      amount: val,
      category,
      type,
      paymentMethod,
      status: 'PENDING',
      date: date
    });

    // Reset form fields except date (keep user in same context)
    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-1 shadow-lg mb-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 transition-colors">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-end md:items-center flex-wrap">
            
            <div className="flex-1 min-w-[200px] w-full md:w-auto">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Descrição</label>
                <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Almoço, Salário..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </div>

             <div className="w-full md:w-32">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Data</label>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
                />
            </div>

            <div className="w-full md:w-28">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Valor (R$)</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </div>

            <div className="w-full md:w-28">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Tipo</label>
                <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                    <option value="VARIABLE">Variável</option>
                    <option value="FIXED">Fixo</option>
                    <option value="INCOME">Receita</option>
                </select>
            </div>

            <div className="w-full md:w-36">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Categoria</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                    {categories[type].map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="w-full md:w-32">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">Pagamento</label>
                <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                >
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão Crédito">Crédito</option>
                    <option value="Cartão Débito">Débito</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Transferência">Transferência</option>
                </select>
            </div>

            <div className="w-full md:w-auto">
                <label className="block md:hidden text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 uppercase">&nbsp;</label>
                <button 
                    type="submit"
                    className="w-full md:w-auto bg-slate-900 dark:bg-slate-700 text-white h-[38px] px-4 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span className="md:hidden">Adicionar</span>
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default TransactionForm;