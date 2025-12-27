import React, { useState } from 'react';
import { CategoryMap, TransactionType } from '../types';
import { X, Plus, Tag, Trash2 } from 'lucide-react';
import { availableIcons, getIconComponent } from '../utils/icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryMap;
  onAddCategory: (type: TransactionType, name: string, icon: string) => void;
  onDeleteCategory: (type: TransactionType, name: string) => void;
  categoryIcons: Record<string, string>;
}

const CategoryManager: React.FC<Props> = ({ isOpen, onClose, categories, onAddCategory, onDeleteCategory, categoryIcons }) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('VARIABLE');
  const [newCategory, setNewCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Tag');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newCategory.trim()) {
      onAddCategory(activeTab, newCategory.trim(), selectedIcon);
      setNewCategory('');
      setSelectedIcon('Tag'); // Reset to default
    }
  };

  const tabs: { id: TransactionType; label: string; color: string; darkColor: string }[] = [
    { id: 'VARIABLE', label: 'Variáveis', color: 'text-blue-600 bg-blue-50', darkColor: 'dark:text-blue-400 dark:bg-blue-900/30' },
    { id: 'FIXED', label: 'Fixas', color: 'text-pink-600 bg-pink-50', darkColor: 'dark:text-pink-400 dark:bg-pink-900/30' },
    { id: 'INCOME', label: 'Receitas', color: 'text-emerald-600 bg-emerald-50', darkColor: 'dark:text-emerald-400 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] transition-colors">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Gerenciar Categorias</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? `${tab.color} ${tab.darkColor} shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/10` 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Add Input */}
          <div className="mb-6 space-y-3">
             <div className="flex gap-2">
                <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome da categoria..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <button
                onClick={handleAdd}
                disabled={!newCategory.trim()}
                className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <Plus className="w-5 h-5" />
                </button>
            </div>
            
            {/* Icon Picker */}
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">Escolha um ícone</p>
                <div className="grid grid-cols-8 gap-2">
                    {availableIcons.map(iconName => (
                        <button
                            key={iconName}
                            onClick={() => setSelectedIcon(iconName)}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                                selectedIcon === iconName 
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900' 
                                : 'text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                            title={iconName}
                        >
                            {getIconComponent(iconName, "w-5 h-5")}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Categorias Existentes</h3>
            {categories[activeTab].map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 rounded-lg group hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        {getIconComponent(categoryIcons[cat], "w-4 h-4")}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium text-sm">{cat}</span>
                </div>
                <button 
                  onClick={() => onDeleteCategory(activeTab, cat)}
                  className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                  title="Remover categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories[activeTab].length === 0 && (
                <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-4">Nenhuma categoria encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;