import { useState, FormEvent } from 'react';
import { Widget } from '../Widget';
import { Bell, AlertCircle, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reminder {
  id: number;
  text: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  completed: boolean;
}

export function RemindersWidget() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, text: 'Leave home at 12:50 AM', time: 'November 28', type: 'critical', completed: false },
    { id: 2, text: 'Check-in online (Emirates)', time: 'November 26, 4:40 AM', type: 'warning', completed: false },
    { id: 3, text: 'Book Afrosiyob train tickets — they sell out', time: 'As soon as possible', type: 'warning', completed: false },
    { id: 4, text: 'Exchange AED to UZS', time: 'Before November 27', type: 'info', completed: false },
  ]);

  const [newReminder, setNewReminder] = useState('');

  const addReminder = (e: FormEvent) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    
    const reminder: Reminder = {
      id: Date.now(),
      text: newReminder,
      time: 'Just now',
      type: 'info',
      completed: false
    };
    
    setReminders([reminder, ...reminders]);
    setNewReminder('');
  };

  const removeReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  return (
    <Widget title="Smart Reminders" icon={<Bell className="w-5 h-5 text-amber-500" />} className="col-span-1 md:col-span-1 lg:col-span-1">
      <div className="space-y-4">
        <form onSubmit={addReminder} className="flex gap-2">
          <input
            type="text"
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            placeholder="Add a reminder..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          <button
            type="submit"
            className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
          <AnimatePresence initial={false}>
            {reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={`group flex items-start gap-3 p-3 rounded-xl border transition-all relative ${
                  reminder.completed
                    ? 'bg-gray-50 border-gray-100 opacity-60'
                    : reminder.type === 'critical'
                    ? 'bg-rose-50 border-rose-200'
                    : reminder.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div 
                  className="mt-0.5 cursor-pointer"
                  onClick={() => toggleReminder(reminder.id)}
                >
                  {reminder.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : reminder.type === 'critical' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : reminder.type === 'warning' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Bell className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div 
                  className="flex flex-col flex-1 cursor-pointer"
                  onClick={() => toggleReminder(reminder.id)}
                >
                  <span className={`font-medium text-sm ${reminder.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {reminder.text}
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">{reminder.time}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeReminder(reminder.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-md transition-all text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Widget>
  );
}
