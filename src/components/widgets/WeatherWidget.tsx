import React, { useState } from 'react';
import { Widget } from '../Widget';
import { CloudRain, Sun, Cloud, ThermometerSun, Shirt } from 'lucide-react';
import { cn } from '../../lib/utils';

type DailyWeather = {
  date: string;
  temp: { min: number; max: number };
  rainProb: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  outfit: string;
};

const weatherData: Record<'tashkent' | 'samarkand', DailyWeather[]> = {
  tashkent: [
    { date: 'Nov 28', temp: { min: 3, max: 12 }, rainProb: 20, condition: 'cloudy', outfit: 'Winter layers, warm jacket, comfortable shoes' },
    { date: 'Nov 29', temp: { min: 2, max: 11 }, rainProb: 10, condition: 'sunny', outfit: 'Winter coat, gloves, hat — mountain day at Amirsoy, snow up top' },
    { date: 'Nov 30', temp: { min: 1, max: 10 }, rainProb: 10, condition: 'sunny', outfit: 'Warm jacket, layers, walking shoes for the train day' },
    { date: 'Dec 1', temp: { min: 0, max: 9 }, rainProb: 30, condition: 'cloudy', outfit: 'Heavy winter coat, scarf, warm shoes' },
    { date: 'Dec 2', temp: { min: 1, max: 9 }, rainProb: 20, condition: 'cloudy', outfit: 'Winter layers, warm jacket' },
    { date: 'Dec 3', temp: { min: 0, max: 8 }, rainProb: 10, condition: 'sunny', outfit: 'Warm travel clothes, winter coat for the flight home' },
  ],
  samarkand: [
    { date: 'Nov 28', temp: { min: 1, max: 11 }, rainProb: 10, condition: 'sunny', outfit: 'Warm jacket, layers' },
    { date: 'Nov 29', temp: { min: 0, max: 10 }, rainProb: 10, condition: 'sunny', outfit: 'Winter coat, gloves in the evening' },
    { date: 'Nov 30', temp: { min: 0, max: 10 }, rainProb: 20, condition: 'cloudy', outfit: 'Winter layers — Registan day, warm jacket' },
    { date: 'Dec 1', temp: { min: -2, max: 9 }, rainProb: 10, condition: 'sunny', outfit: 'Heavy coat, hat and gloves — coldest day, Shah-i-Zinda in the morning' },
    { date: 'Dec 2', temp: { min: -1, max: 8 }, rainProb: 20, condition: 'cloudy', outfit: 'Winter coat, scarf, warm shoes' },
    { date: 'Dec 3', temp: { min: -2, max: 8 }, rainProb: 10, condition: 'cloudy', outfit: 'Warm travel clothes' },
  ]
};

export function WeatherWidget() {
  const [activeCity, setActiveCity] = useState<'tashkent' | 'samarkand'>('tashkent');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const cityData = weatherData[activeCity];
  const selectedDay = cityData[selectedIndex];

  const getWeatherIcon = (condition: string, className: string) => {
    if (condition === 'rainy') return <CloudRain className={className} />;
    if (condition === 'cloudy') return <Cloud className={className} />;
    return <Sun className={className} />;
  };

  return (
    <Widget title="Weather Forecast" icon={<Sun className="w-5 h-5 text-yellow-400" />} className="col-span-1 md:col-span-2 lg:col-span-2">
      <div className="flex flex-col h-full">
        {/* City Toggle */}
        <div className="flex gap-2 mb-4 bg-white/10 backdrop-blur-md p-1 rounded-xl shrink-0 border border-white/10">
          <button
            onClick={() => setActiveCity('tashkent')}
            className={cn(
              'flex-1 py-1.5 text-sm font-medium rounded-lg transition-all',
              activeCity === 'tashkent' ? 'bg-white/40 backdrop-blur-sm text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Tashkent
          </button>
          <button
            onClick={() => setActiveCity('samarkand')}
            className={cn(
              'flex-1 py-1.5 text-sm font-medium rounded-lg transition-all',
              activeCity === 'samarkand' ? 'bg-white/40 backdrop-blur-sm text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            Samarkand
          </button>
        </div>

        {/* Horizontal Date Scroll */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-4 custom-scrollbar shrink-0">
          {cityData.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'flex flex-col items-center min-w-[64px] p-2 rounded-xl transition-all border',
                selectedIndex === idx
                  ? 'bg-white/30 border-white/30 shadow-sm'
                  : 'bg-white/10 border-white/10 hover:bg-white/20'
              )}
            >
              <span className={cn("text-xs mb-2 whitespace-nowrap", selectedIndex === idx ? "text-gray-900 font-medium" : "text-gray-500")}>{day.date}</span>
              {getWeatherIcon(day.condition, cn('w-5 h-5 mb-1', day.condition === 'rainy' ? 'text-blue-500' : day.condition === 'sunny' ? 'text-yellow-500' : 'text-gray-400'))}
              <span className={cn("text-sm font-bold mt-1", selectedIndex === idx ? "text-gray-900" : "text-gray-700")}>{day.temp.max}°</span>
            </button>
          ))}
        </div>

        {/* Selected Day Details */}
        <div className="flex-1 bg-white/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center justify-center shrink-0">
            {getWeatherIcon(selectedDay.condition, cn('w-16 h-16 mb-2', selectedDay.condition === 'rainy' ? 'text-blue-500' : selectedDay.condition === 'sunny' ? 'text-yellow-500' : 'text-gray-400'))}
            <span className="text-lg font-bold text-gray-900 capitalize">{selectedDay.condition}</span>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-6 text-gray-900 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-gray-400" />
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{selectedDay.temp.max}°</span>
                  <span className="text-lg text-gray-500">/ {selectedDay.temp.min}°</span>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
                <span className="text-xl font-medium">{selectedDay.rainProb}%</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-gray-900 bg-indigo-50/20 backdrop-blur-md p-3 rounded-xl border border-indigo-100/20">
              <div className="p-2 bg-indigo-100/30 backdrop-blur-sm rounded-xl text-indigo-600 shrink-0 mt-0.5">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-indigo-800/60 uppercase tracking-wider mb-1 font-semibold">Outfit Suggestion ({selectedDay.date})</p>
                <p className="text-sm font-medium leading-relaxed text-indigo-900">{selectedDay.outfit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
}
