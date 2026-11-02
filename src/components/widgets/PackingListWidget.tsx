import React, { useState } from 'react';
import { Widget } from '../Widget';
import { useTripStore } from '../../store/useTripStore';
import { CheckCircle2, Circle, Plus, Trash2, Backpack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function PackingListWidget({ isMaximized = false }: { isMaximized?: boolean }) {
  const { packingList, addPackingItem, togglePackingItem, removePackingItem } = useTripStore();
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Misc');

  const categories = ['Documents', 'Clothes', 'Hygiene', 'Electronics', 'Misc'];
  const packedCount = packingList.filter((i) => i.checked).length;
  const progress = packingList.length > 0 ? (packedCount / packingList.length) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    addPackingItem({ text: newItem.trim(), checked: false, category });
    setNewItem('');
  };

  return (
    <Widget 
      title="Packing List" 
      icon={<Backpack className="w-5 h-5 text-emerald-400" />} 
      className={cn(
        "col-span-1 md:col-span-1 lg:col-span-1",
        isMaximized ? "h-auto shadow-none border-none bg-transparent p-0" : "h-[600px]"
      )}
    >
      <div className="mb-6 shrink-0">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-6 shrink-0">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="sm:col-span-12 lg:col-span-5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:col-span-6 lg:col-span-4 bg-white border border-gray-200 rounded-xl px-2 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="sm:col-span-6 lg:col-span-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar min-h-0">
        {categories.map((cat) => {
          const items = packingList.filter((i) => i.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {cat}
              </h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between group bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-100"
                    >
                      <button
                        onClick={() => togglePackingItem(item.id, item.checked)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        {item.checked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            item.checked ? 'text-gray-400 line-through' : 'text-gray-700'
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>
                      <button
                        onClick={() => removePackingItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}
