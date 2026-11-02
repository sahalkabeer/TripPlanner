import { useState, useEffect } from 'react';
import { Widget } from '../Widget';
import { MoonStar, Clock } from 'lucide-react';
import { format, isAfter, parse } from 'date-fns';

export function PrayerTimesWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Mock prayer times for Tashkent (approximate for late November)
  const prayers = [
    { name: 'Fajr', time: '05:48 AM' },
    { name: 'Dhuhr', time: '12:12 PM' },
    { name: 'Asr', time: '02:37 PM' },
    { name: 'Maghrib', time: '04:57 PM' },
    { name: 'Isha', time: '06:27 PM' },
  ];

  // Logic to find next prayer (simplified for mock data)
  const currentTimeStr = format(now, 'hh:mm a');
  let nextPrayerIndex = prayers.findIndex((p) => {
    const pTime = parse(p.time, 'hh:mm a', new Date());
    return isAfter(pTime, now);
  });

  if (nextPrayerIndex === -1) nextPrayerIndex = 0; // Next day Fajr

  return (
    <Widget title="Prayer Times (Tashkent)" icon={<MoonStar className="w-5 h-5 text-indigo-500" />} className="col-span-1 md:col-span-1 lg:col-span-1">
      <div className="space-y-3">
        {prayers.map((prayer, index) => {
          const isNext = index === nextPrayerIndex;
          
          return (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isNext
                  ? 'bg-indigo-50/20 border-indigo-200/20 backdrop-blur-sm shadow-sm'
                  : 'bg-white/10 border-white/10 backdrop-blur-sm opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                {isNext && <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />}
                <span className={`font-medium ${isNext ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {prayer.name}
                </span>
              </div>
              <span className={`font-semibold ${isNext ? 'text-gray-900' : 'text-gray-500'}`}>
                {prayer.time}
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}
