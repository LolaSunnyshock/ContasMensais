import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_TRANSACTIONS, MONTHS, CATEGORIES, DEFAULT_CATEGORY_ICONS } from './constants';
import { Transaction, SummaryStats, TransactionType, CategoryMap, MonthData, CategoryIconMap } from './types';
import TransactionTable from './components/TransactionTable';
import DashboardStats from './components/DashboardStats';
import TransactionForm from './components/TransactionForm'; 
import CategoryManager from './components/CategoryManager'; 
import MonthManager from './components/MonthManager';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { LayoutDashboard, Receipt, Menu, X, ChevronDown, Settings, CalendarDays, LogIn, LogOut, Cloud, CloudOff, RefreshCw, Moon, Sun, AlertTriangle, UserCheck } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { saveUserData, loadUserData } from './firebase';

const COLORS = ['#10b981', '#ec4899', '#f97316'];

const App: React.FC = () => {
  const { user, signInWithGoogle, logout, isConfigured } = useAuth();
  
  // State
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [categories, setCategories] = useState<CategoryMap>(CATEGORIES);
  const [categoryIcons, setCategoryIcons] = useState<CategoryIconMap>(DEFAULT_CATEGORY_ICONS);
  const [months, setMonths] = useState<MonthData[]>(MONTHS);
  
  // UI State
  const [selectedMonth, setSelectedMonth] = useState<string>(MONTHS[0]?.id || `${new Date().getFullYear()}-01`); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isMonthManagerOpen, setIsMonthManagerOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  
  // Theme State (Default to true for Dark Mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Apply Dark Mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Data logic
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsSyncing(true);
        try {
          // Load from Firebase
          const data = await loadUserData(user.uid);

          if (data) {
            if (data.transactions) setTransactions(data.transactions);
            if (data.categories) setCategories(data.categories);
            if (data.months) setMonths(data.months);
          }
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        }
        setDataLoaded(true);
        setIsSyncing(false);
      } else {
        // Reset to mock/default data on logout
        setTransactions(MOCK_TRANSACTIONS);
        setCategories(CATEGORIES);
        setDataLoaded(false);
      }
    };
    fetchData();
  }, [user]);

  // Save Data Logic (Firebase Only)
  useEffect(() => {
    if (user && dataLoaded) {
      const saveData = async () => {
        setIsSyncing(true);
        const dataToSave = {
          transactions,
          categories,
          months
        };

        // Save to Firebase
        await saveUserData(user.uid, dataToSave);
        setIsSyncing(false);
      };
      
      const timeoutId = setTimeout(saveData, 1000); // Debounce save by 1s
      return () => clearTimeout(timeoutId);
    }
  }, [transactions, categories, months, user, dataLoaded]);


  // Filter transactions by month
  const currentTransactions = useMemo(() => {
    return transactions.filter(t => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Calculate stats
  const stats = useMemo<SummaryStats>(() => {
    const income = currentTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const fixed = currentTransactions.filter(t => t.type === 'FIXED').reduce((acc, t) => acc + t.amount, 0);
    const variable = currentTransactions.filter(t => t.type === 'VARIABLE').reduce((acc, t) => acc + t.amount, 0);
    
    return {
      totalIncome: income,
      totalFixed: fixed,
      totalVariable: variable,
      balance: income - (fixed + variable)
    };
  }, [currentTransactions]);

  // Handlers
  const handleAddTransaction = (partial: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: partial.description || 'Nova Transação',
      category: partial.category || 'Outros',
      amount: partial.amount || 0,
      status: partial.status || 'PENDING',
      paymentMethod: partial.paymentMethod || 'Dinheiro',
      date: partial.date || new Date().toISOString().split('T')[0],
      type: partial.type || 'VARIABLE'
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'PAID' ? 'PENDING' : 'PAID' } : t
    ));
  };

  const handleAddCategory = (type: TransactionType, name: string, icon: string) => {
    setCategories(prev => {
        if (prev[type].includes(name)) return prev;
        return { ...prev, [type]: [...prev[type], name] };
    });
    setCategoryIcons(prev => ({ ...prev, [name]: icon }));
  };

  const handleDeleteCategory = (type: TransactionType, name: string) => {
    setCategories(prev => ({ ...prev, [type]: prev[type].filter(c => c !== name) }));
  };

  const handleAddMonth = (monthIndex: number, year: number) => {
    const monthStr = monthIndex.toString().padStart(2, '0');
    const id = `${year}-${monthStr}`;
    
    if (months.some(m => m.id === id)) {
        alert("Este mês já existe!");
        return;
    }

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const newMonth: MonthData = {
        id,
        name: monthNames[monthIndex - 1],
        year
    };

    setMonths(prev => [...prev, newMonth].sort((a,b) => a.id.localeCompare(b.id)));
    setSelectedMonth(id);
    setIsMonthManagerOpen(false);
  };

  const handleDeleteMonth = (id: string) => {
    if (months.length <= 1) {
        alert("Você deve manter pelo menos um mês.");
        return;
    }
    setMonths(prev => prev.filter(m => m.id !== id));
    if (selectedMonth === id) {
        setSelectedMonth(months.find(m => m.id !== id)?.id || '');
    }
  };
  
  // Charts Data
  const categoryData = useMemo(() => {
     const data: Record<string, number> = {};
     currentTransactions.filter(t => t.type !== 'INCOME').forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
     });
     return Object.keys(data).map(key => ({ name: key, value: data[key] }));
  }, [currentTransactions]);

  const selectedMonthObj = months.find(m => m.id === selectedMonth);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar - Mobile Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 dark:bg-slate-950 text-slate-300 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl md:shadow-none flex flex-col`}>
        <div className="p-6 flex items-center justify-between shrink-0">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="text-emerald-400" />
                MeuDinheiro
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                <X className="w-6 h-6" />
            </button>
        </div>
        
        {/* User Profile Section */}
        <div className="px-4 pb-4">
           {user ? (
             <div className="bg-slate-800 dark:bg-slate-900 rounded-lg p-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-slate-400 truncate">Logado como</p>
                    <p className="text-sm font-medium text-white truncate" title={user.displayName || user.email || ''}>{user.displayName || user.email?.split('@')[0]}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cloud className="w-3 h-3 text-emerald-400" />}
                      <span>{isSyncing ? 'Salvando...' : 'Salvo na nuvem'}</span>
                    </div>
                </div>

                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-red-900/50 hover:text-red-200 text-xs py-2 rounded transition-colors"
                >
                  <LogOut className="w-3 h-3" /> Sair
                </button>
             </div>
           ) : (
             <button 
                onClick={() => signInWithGoogle()}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-md ${
                    isConfigured 
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700' 
                    : 'bg-slate-700 text-slate-400 dark:text-slate-500 border border-dashed border-slate-600 hover:bg-slate-600 hover:text-white'
                }`}
             >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                <span>Entrar com Google</span>
             </button>
           )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2 py-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-900/20 font-medium">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
            </button>
            
            <div className="pt-4 mt-4 border-t border-slate-700">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Configurações</p>
                <button 
                    onClick={() => setIsCategoryManagerOpen(true)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Categorias
                </button>
                <button 
                    onClick={() => setIsMonthManagerOpen(true)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <CalendarDays className="w-5 h-5" />
                    Meses
                </button>

                 <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {darkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
            </div>
            
            {!user && (
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3">
                  <CloudOff className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Backup na Nuvem</p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                        Faça login para salvar seus dados com segurança e acessá-los de qualquer dispositivo.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 shadow-sm z-10 transition-colors">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-600 dark:text-slate-300">
                <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4">
                <div className="relative">
                    <button 
                        onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                        className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                        <span className="text-sm text-slate-400 mr-1">Mês:</span>
                        {selectedMonthObj ? `${selectedMonthObj.name} ${selectedMonthObj.year}` : 'Selecione'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Month Dropdown Overlay */}
                    {isMonthDropdownOpen && (
                        <div className="fixed inset-0 z-40" onClick={() => setIsMonthDropdownOpen(false)}></div>
                    )}

                    {/* Month Dropdown Menu */}
                    {isMonthDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {months.map(m => (
                                    <button 
                                        key={m.id}
                                        onClick={() => {
                                            setSelectedMonth(m.id);
                                            setIsMonthDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex justify-between items-center ${selectedMonth === m.id ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-900/20' : 'text-slate-600 dark:text-slate-300'}`}
                                    >
                                        <span>{m.name} {m.year}</span>
                                        {selectedMonth === m.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>}
                                    </button>
                                ))}
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1 p-2">
                                <button 
                                    onClick={() => {
                                        setIsMonthManagerOpen(true);
                                        setIsMonthDropdownOpen(false);
                                    }}
                                    className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 py-2 rounded-lg transition-colors uppercase tracking-wide"
                                >
                                    + Gerenciar Meses
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
                
                {/* Transaction Form with explicit selected month */}
                <TransactionForm 
                    onAddTransaction={handleAddTransaction} 
                    categories={categories}
                    selectedMonthId={selectedMonth}
                />

                {/* Dashboard Stats */}
                <DashboardStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-6">Visão Geral de Gastos</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Fixos', value: stats.totalFixed },
                                    { name: 'Variáveis', value: stats.totalVariable },
                                    { name: 'Receita', value: stats.totalIncome },
                                ]} barSize={40}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                    <YAxis hide />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000'}}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {
                                            [stats.totalFixed, stats.totalVariable, stats.totalIncome].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">Por Categoria</h3>
                        <div className="h-[250px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 space-y-2">
                             {categoryData.slice(0, 3).map((item, idx) => (
                                 <div key={idx} className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                     <span>{item.name}</span>
                                     <span className="font-medium">R$ {item.value}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Transaction Tables */}
                <TransactionTable 
                    title="Despesas Fixas" 
                    type="FIXED" 
                    transactions={currentTransactions} 
                    colorTheme="pink"
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    categoryIcons={categoryIcons}
                />

                <TransactionTable 
                    title="Despesas Variáveis" 
                    type="VARIABLE" 
                    transactions={currentTransactions} 
                    colorTheme="blue"
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    categoryIcons={categoryIcons}
                />
                 
                 <TransactionTable 
                    title="Entradas / Receitas" 
                    type="INCOME" 
                    transactions={currentTransactions} 
                    colorTheme="emerald"
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    categoryIcons={categoryIcons}
                />

            </div>
        </main>
      </div>
      
      {/* Modals */}
      <CategoryManager 
        isOpen={isCategoryManagerOpen} 
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        categoryIcons={categoryIcons}
      />

      <MonthManager 
        isOpen={isMonthManagerOpen} 
        onClose={() => setIsMonthManagerOpen(false)}
        months={months}
        onAddMonth={handleAddMonth}
        onDeleteMonth={handleDeleteMonth}
      />
    </div>
  );
};

export default App;