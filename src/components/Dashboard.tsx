import { useState } from 'react';
import { CountdownWidget } from './widgets/CountdownWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { PackingListWidget } from './widgets/PackingListWidget';
import { ShoppingListWidget } from './widgets/ShoppingListWidget';
import { TransportWidget } from './widgets/TransportWidget';
import { FoodWidget } from './widgets/FoodWidget';
import { BudgetWidget } from './widgets/BudgetWidget';
import { PrayerTimesWidget } from './widgets/PrayerTimesWidget';
import { DocumentVaultWidget } from './widgets/DocumentVaultWidget';
import { RemindersWidget } from './widgets/RemindersWidget';
import { FirebaseSync } from './FirebaseSync';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Maximize2, Briefcase, Wallet, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import { SettingsView } from './SettingsView';
import { useTripStore } from '../store/useTripStore';

type WidgetType = 'packing' | 'budget' | 'shopping' | 'settings' | null;

export function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [maximizedWidget, setMaximizedWidget] = useState<WidgetType>(null);
  const { visibleWidgets, updateVisibleWidget } = useTripStore();
  const widgets = visibleWidgets || {
    departureTicket: true,
    returnTicket: true,
    weather: true,
    reminders: true,
    packing: true,
    shopping: true,
    budget: true,
    transport: true,
    food: true,
    prayer: true,
    vault: true,
  };

  const toggleWidget = async (key: string) => {
    await updateVisibleWidget(key, !widgets[key]);
  };

  const menuItems = [
    { id: 'packing', label: 'Packing List', icon: Briefcase },
    { id: 'budget', label: 'Budget Tracker', icon: Wallet },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderMaximizedWidget = () => {
    switch (maximizedWidget) {
      case 'packing': return <PackingListWidget isMaximized={true} />;
      case 'budget': return <BudgetWidget isMaximized={true} />;
      case 'shopping': return <ShoppingListWidget isMaximized={true} />;
      case 'settings': return <SettingsView settings={widgets} onToggle={toggleWidget} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen text-gray-900 font-sans selection:bg-gray-200 relative">
      {/* Background Image with Blue Tint */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="/resources/background.png" 
          alt="Dashboard background"
          className="w-full h-full object-cover blur-md scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1477322524744-0eece9e79640?auto=format&fit=crop&q=80&w=2070";
          }}
        />
        {/* Frosted glass overlay with blue tint */}
        <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <AnimatePresence mode="wait">
          {!maximizedWidget ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                    Trip to <span className="font-cursive text-5xl md:text-6xl">Uzbekistan</span> 🇺🇿
                  </h1>
                  <p className="text-gray-200 mt-2 text-lg font-medium drop-shadow-sm">November 28 – December 3, 2026</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  {/* Navigation Menu */}
                  <div className="relative order-first md:order-last">
                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all shadow-lg border border-white/20"
                    >
                      {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <AnimatePresence>
                      {isMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute left-0 md:left-auto md:right-0 mt-4 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
                        >
                          <div className="p-2">
                            <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</p>
                            {menuItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setMaximizedWidget(item.id as WidgetType);
                                  setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group"
                              >
                                <div className="p-2 bg-gray-100 group-hover:bg-indigo-100 rounded-lg transition-colors">
                                  <item.icon className="w-4 h-4" />
                                </div>
                                {item.label}
                                <Maximize2 className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <FirebaseSync />
                </div>
              </motion.header>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
                {(widgets.departureTicket || widgets.returnTicket) && (
                  <CountdownWidget 
                    showDeparture={widgets.departureTicket} 
                    showReturn={widgets.returnTicket} 
                  />
                )}
                {widgets.weather && <WeatherWidget />}
                {widgets.reminders && <RemindersWidget />}
                {widgets.packing && <PackingListWidget />}
                {widgets.shopping && <ShoppingListWidget />}
                {widgets.budget && <BudgetWidget />}
                {widgets.transport && <TransportWidget />}
                {widgets.food && <FoodWidget />}
                {widgets.prayer && <PrayerTimesWidget />}
                {widgets.vault && <DocumentVaultWidget />}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="maximized"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full min-h-[80vh] flex flex-col"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setMaximizedWidget(null)}
                    className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all shadow-lg border border-white/20 group"
                  >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                  </button>
                  <div className="flex flex-col">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
                      {menuItems.find(i => i.id === maximizedWidget)?.label}
                    </h2>
                    <p className="text-gray-200 font-medium drop-shadow-sm">Full View</p>
                  </div>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMaximizedWidget(item.id as WidgetType)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-md border ${
                        maximizedWidget === item.id 
                        ? 'bg-white text-indigo-600 border-white shadow-lg' 
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-12">
                  <div className="max-w-4xl mx-auto">
                    {renderMaximizedWidget()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
