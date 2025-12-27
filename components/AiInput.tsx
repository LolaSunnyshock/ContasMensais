import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { parseTransactionWithAI } from '../services/geminiService';
import { Transaction, TransactionType } from '../types';

interface Props {
  onAddTransaction: (t: Partial<Transaction>) => void;
}

const AiInput: React.FC<Props> = ({ onAddTransaction }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await parseTransactionWithAI(input);
      if (result) {
        onAddTransaction({
          description: result.description,
          amount: result.amount,
          category: result.category,
          type: result.type as TransactionType,
          paymentMethod: result.paymentMethod || 'Outros',
          status: 'PENDING',
          date: new Date().toISOString().split('T')[0]
        });
        setInput('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-1 shadow-lg mb-8">
      <div className="bg-white rounded-lg p-2 flex items-center gap-2">
        <div className="pl-3">
            <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="IA Mágica: 'Almoço no shopping 45 reais cartão' ou 'Conta de Luz 150 fixo'"
          className="flex-1 border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 py-2 bg-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleParse()}
        />
        <button 
          onClick={handleParse}
          disabled={loading || !input}
          className="bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default AiInput;