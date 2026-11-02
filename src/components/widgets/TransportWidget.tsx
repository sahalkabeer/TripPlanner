import { Widget } from '../Widget';
import { Bus, Train, Car, CarTaxiFront, Navigation } from 'lucide-react';

const displayPrice = (price: string) => {
  if (price.includes('UZS') && !price.includes('AED')) {
    const numMatch = price.replace(/,/g, '').match(/\d+/);
    if (numMatch) {
      const uzs = parseInt(numMatch[0]);
      const aed = Math.round(uzs / 3270);
      return `${price} (~${aed} AED)`;
    }
  }
  return price;
};

export function TransportWidget() {
  const transports = [
    { mode: 'Car (Private Driver)', icon: <Car className="w-5 h-5" />, price: '~1,300,000 UZS', duration: '4h 30m', available: true, color: 'text-emerald-600', bg: 'bg-emerald-100/30 backdrop-blur-sm' },
    { mode: 'Taxi (Shared)', icon: <CarTaxiFront className="w-5 h-5" />, price: '~250,000 UZS', duration: '4h', available: true, color: 'text-yellow-600', bg: 'bg-yellow-100/30 backdrop-blur-sm' },
    { mode: 'Bus', icon: <Bus className="w-5 h-5" />, price: '~120,000 UZS', duration: '5h 30m', available: true, color: 'text-amber-600', bg: 'bg-amber-100/30 backdrop-blur-sm' },
    { mode: 'Train (Afrosiyob)', icon: <Train className="w-5 h-5" />, price: '~311,000 UZS', duration: '2h 15m', available: true, color: 'text-slate-500', bg: 'bg-slate-100/30 backdrop-blur-sm' },
  ];

  return (
    <Widget title="Tashkent to Samarkand" icon={<Navigation className="w-5 h-5 text-indigo-500" />} className="col-span-1 md:col-span-1 lg:col-span-1">
      <div className="space-y-3">
        {transports.map((t) => (
          <div key={t.mode} className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-white/20 ${t.available ? 'bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors shadow-sm' : 'opacity-50 grayscale bg-white/10'}`}>
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className={`p-2 rounded-xl shrink-0 ${t.bg} ${t.color}`}>
                {t.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-semibold text-gray-900 truncate">{t.mode}</span>
                  <span className="text-xs font-bold text-gray-700 text-right ml-2">{displayPrice(t.price)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-xs">
                  <span className="text-gray-500">{t.duration}</span>
                  <span className={t.available ? 'text-emerald-600 font-medium' : 'text-rose-500 font-medium'}>
                    {t.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
}
