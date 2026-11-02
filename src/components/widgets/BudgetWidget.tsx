import React, { useState } from 'react';
import { Widget } from '../Widget';
import { useTripStore } from '../../store/useTripStore';
import { Wallet, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function BudgetWidget({ isMaximized = false }: { isMaximized?: boolean }) {
  const { budgetItems, totalBudget, addBudgetItem, removeBudgetItem, updateTotalBudget } = useTripStore();
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [newTotal, setNewTotal] = useState(totalBudget.toString());
  
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [category, setCategory] = useState('Misc');

  const categories = ['Flights', 'Stay', 'Food', 'Transport', 'Shopping', 'Misc'];
  
  const spent = budgetItems.reduce((acc, item) => acc + item.amount, 0);
  const remaining = totalBudget - spent;
  const progress = totalBudget > 0 ? Math.min((spent / totalBudget) * 100, 100) : 0;

  const formatCurrency = (aed: number) => {
    const uzs = Math.round(aed * 3270);
    return (
      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-bold leading-tight">{aed.toLocaleString()} AED</span>
        <span className="text-xs text-gray-500 font-normal tracking-tight">(~{uzs.toLocaleString()} UZS)</span>
      </div>
    );
  };

  const handleSaveTotal = () => {
    const val = parseFloat(newTotal);
    if (!isNaN(val) && val >= 0) {
      updateTotalBudget(val);
    }
    setIsEditingTotal(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAmount.trim()) return;
    const amount = parseFloat(newItemAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    addBudgetItem({ name: newItemName.trim(), amount, category });
    setNewItemName('');
    setNewItemAmount('');
  };

  return (
    <Widget 
      title="Budget Tracker" 
      icon={<Wallet className="w-5 h-5 text-emerald-400" />} 
      className={cn(
        "col-span-1 md:col-span-2 lg:col-span-2",
        isMaximized ? "h-auto shadow-none border-none bg-transparent p-0" : "h-[600px]"
      )}
    >
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 shrink-0">
        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Total Budget</span>
            {isEditingTotal ? (
              <button onClick={handleSaveTotal} className="text-emerald-500 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
            ) : (
              <button onClick={() => setIsEditingTotal(true)} className="text-gray-400 hover:text-gray-600"><Edit2 className="w-4 h-4" /></button>
            )}
          </div>
          {isEditingTotal ? (
            <input 
              type="number" 
              value={newTotal} 
              onChange={(e) => setNewTotal(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-gray-900 font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              autoFocus
              onBlur={handleSaveTotal}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTotal()}
            />
          ) : (
            <div className="text-xl font-bold text-gray-900">{formatCurrency(totalBudget)}</div>
          )}
        </div>

        <div className="col-span-1 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Spent</span>
          <div className="text-rose-500">{formatCurrency(spent)}</div>
        </div>

        <div className="col-span-1 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Remaining</span>
          <div className={remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}>
            {formatCurrency(remaining)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 shrink-0">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${progress > 90 ? 'bg-rose-500' : progress > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          />
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4 shrink-0">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Expense name..."
          className="col-span-4 sm:col-span-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
        />
        <input
          type="number"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          placeholder="Amount (AED)"
          className="col-span-2 sm:col-span-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="col-span-2 sm:col-span-2 bg-white border border-gray-200 rounded-xl px-2 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-4 sm:col-span-1 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-colors flex items-center justify-center shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar min-h-0">
        <AnimatePresence>
          {budgetItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center justify-between group bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-100 transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex flex-col items-end">
                  <span className="font-semibold text-gray-900 text-sm md:text-base">
                    {item.amount.toLocaleString()} AED
                  </span>
                  <span className="text-gray-500 text-[10px] md:text-xs">
                    (~{Math.round(item.amount * 3270).toLocaleString()} UZS)
                  </span>
                </div>
                <button
                  onClick={() => removeBudgetItem(item.id)}
                  className="p-1.5 md:p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {budgetItems.length === 0 && (
          <div className="text-center text-gray-400 py-8">No expenses added yet.</div>
        )}
      </div>
    </Widget>
  );
}
