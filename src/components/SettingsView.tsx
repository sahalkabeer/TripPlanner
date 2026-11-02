import React from 'react';

const widgetLabels: Record<string, string> = {
  departureTicket: 'Departure Ticket',
  returnTicket: 'Return Ticket',
  weather: 'Weather Forecast',
  reminders: 'Smart Reminders',
  packing: 'Packing List',
  shopping: 'Shopping List',
  budget: 'Budget Tracker',
  transport: 'Transport Info',
  food: 'Food & Dining',
  prayer: 'Prayer Times',
  vault: 'Document Vault',
};

export const SettingsView = ({ settings, onToggle }: { settings: any, onToggle: (key: string) => void }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="font-medium text-gray-700">{widgetLabels[key] || key}</span>
            <button
              onClick={() => onToggle(key)}
              className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
