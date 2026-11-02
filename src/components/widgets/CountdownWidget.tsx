import { useEffect, useState } from 'react';
import { differenceInSeconds, subMinutes, subHours } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { PlaneTakeoff, PlaneLanding, Clock, Home, Briefcase, Luggage, Utensils, Headphones, Armchair } from 'lucide-react';

const Barcode = ({ code }: { code: string }) => {
  const bars = [2, 1, 3, 1, 1, 2, 4, 1, 2, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 1, 3, 2, 1, 2, 1, 3];
  return (
    <div className="w-full flex flex-col items-center">
      <div className="h-8 w-full flex justify-between items-end opacity-80">
        {bars.map((width, i) => (
          <div key={i} className="bg-gray-900 rounded-sm" style={{ width: `${width * 1.5}px`, height: '100%' }}></div>
        ))}
      </div>
      <p className="text-center text-[8px] tracking-[0.2em] text-gray-500 mt-1 font-mono">{code}</p>
    </div>
  );
};

const FlightInfo = ({ items }: { items: { icon: any, label: string }[] }) => (
  <div className="space-y-2 w-full">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">Economy Saver</p>
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600">
        <item.icon className="w-3 h-3 text-gray-400" />
        <span>{item.label}</span>
      </div>
    ))}
  </div>
);

export function CountdownWidget({ showDeparture = true, showReturn = true }: { showDeparture?: boolean, showReturn?: boolean }) {
  const DUBAI_TZ = 'Asia/Dubai';
  
  const departureDateStr = '2026-11-28T04:40:00+04:00'; 
  const departureDate = new Date(departureDateStr);
  const leaveHomeDate = subMinutes(subHours(departureDate, 3), 50);

  const returnDateStr = '2026-12-03T16:25:00+05:00';
  const returnDate = new Date(returnDateStr);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.max(0, differenceInSeconds(departureDate, now));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const tripDurationDays = Math.floor(differenceInSeconds(returnDate, departureDate) / (3600 * 24));

  if (!showDeparture && !showReturn) return null;

  return (
    <div className="col-span-full flex flex-col gap-6">
      {(showDeparture || showReturn) && (
        <div className="flex justify-end">
          <span className="text-[10px] text-gray-200 font-medium bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">All times are local</span>
        </div>
      )}
      
      {/* Outbound Ticket */}
      {showDeparture && (
        <div className="flex flex-col md:flex-row relative group drop-shadow-md">
          {/* Left Part */}
          <div className="flex-1 p-6 md:p-10 bg-white/95 backdrop-blur-sm rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl border-t border-l border-r md:border-r-0 border-gray-200">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <div className="flex items-center gap-2 md:gap-3 text-indigo-600 font-bold">
                <PlaneTakeoff className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-sm md:text-xl text-gray-500 font-medium tracking-tight">Departure from <span className="text-gray-900 font-bold">Dubai</span> (Flight EK 2377 · flydubai FZ 1401)</span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-8 md:mb-12">
              <div className="flex-1">
                <p className="text-[10px] md:text-base text-gray-500 font-medium mb-1 md:mb-3">28 November 2026, Saturday</p>
                <p className="text-4xl md:text-8xl font-bold text-gray-900 tracking-tighter leading-none">04:40</p>
                <p className="text-2xl md:text-6xl font-bold text-gray-900 mt-1 md:mt-4 tracking-tight">DXB</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium mt-1 md:mt-2">Dubai International Airport</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium">Terminal 3</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-2 md:px-6 pt-8 md:pt-16">
                <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-2 py-1 md:px-6 md:py-3 rounded-full border border-gray-100 flex flex-col items-center shadow-sm">
                    <span className="text-[8px] md:text-sm font-bold text-gray-400 whitespace-nowrap uppercase tracking-widest">04h 20min</span>
                    <span className="text-[8px] md:text-sm font-bold text-gray-900 whitespace-nowrap">Non-stop</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-right">
                <p className="text-[10px] md:text-base text-gray-500 font-medium mb-1 md:mb-3">28 November 2026, Saturday</p>
                <p className="text-4xl md:text-8xl font-bold text-gray-900 tracking-tighter leading-none">10:00</p>
                <p className="text-2xl md:text-6xl font-bold text-gray-900 mt-1 md:mt-4 tracking-tight">TAS</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium mt-1 md:mt-2">Tashkent International Airport</p>
              </div>
            </div>
          </div>

          {/* Divider Desktop */}
          <div 
            className="hidden md:flex flex-col items-center justify-center relative w-8 bg-white/95 backdrop-blur-sm border-t border-b border-gray-200"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 16px 0, transparent 12px, black 13px), radial-gradient(circle at 16px 100%, transparent 12px, black 13px)',
              maskImage: 'radial-gradient(circle at 16px 0, transparent 12px, black 13px), radial-gradient(circle at 16px 100%, transparent 12px, black 13px)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect'
            }}
          >
            <div className="h-[calc(100%-40px)] border-l-2 border-dashed border-gray-200"></div>
          </div>

          {/* Divider Mobile */}
          <div 
            className="md:hidden flex items-center justify-center relative h-8 bg-white/95 backdrop-blur-sm border-l border-r border-gray-200"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 0 16px, transparent 12px, black 13px), radial-gradient(circle at 100% 16px, transparent 12px, black 13px)',
              maskImage: 'radial-gradient(circle at 0 16px, transparent 12px, black 13px), radial-gradient(circle at 100% 16px, transparent 12px, black 13px)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect'
            }}
          >
            <div className="w-[calc(100%-40px)] border-t-2 border-dashed border-gray-200"></div>
          </div>

          {/* Tear-off / Countdown */}
          <div className="w-full md:w-80 bg-indigo-50/90 backdrop-blur-sm p-6 flex flex-col justify-between items-center rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl border-b border-l border-r md:border-l-0 border-gray-200">
            <div className="w-full text-center mb-4">
              <p className="text-[10px] text-indigo-600/80 uppercase tracking-widest mb-2 font-bold">Time to Departure</p>
              <div className="flex justify-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-600 font-mono">{days.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Days</span>
                </div>
                <span className="text-2xl font-bold text-indigo-300 mt-1">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-600 font-mono">{hours.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Hrs</span>
                </div>
                <span className="text-2xl font-bold text-indigo-300 mt-1">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-600 font-mono">{minutes.toString().padStart(2, '0')}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-medium">Min</span>
                </div>
              </div>
            </div>
            
            <div className="w-full mb-4">
              <FlightInfo items={[
                { icon: Briefcase, label: "7 kg hand baggage (included)" },
                { icon: Luggage, label: "25 kg checked baggage (included)" },
                { icon: Utensils, label: "Meal (included)" },
                { icon: Armchair, label: "Seat unassigned" },
                { icon: Headphones, label: "In-flight entertainment (included)" },
              ]} />
            </div>

            <div className="w-full bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-gray-100 shadow-sm mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 rounded text-rose-500 shrink-0">
                <Home className="w-3 h-3" />
              </div>
              <div className="text-left">
                <p className="text-[8px] text-gray-500 uppercase tracking-wider">Leave Home At</p>
                <p className="font-bold text-xs text-gray-900">
                  {formatInTimeZone(leaveHomeDate, DUBAI_TZ, 'hh:mm a')}
                </p>
              </div>
            </div>

            <Barcode code="EK2377-DXB-TAS-2026" />
          </div>
        </div>
      )}

      {/* Return Ticket */}
      {showReturn && (
        <div className="flex flex-col md:flex-row relative group drop-shadow-md opacity-95">
          {/* Left Part */}
          <div className="flex-1 p-6 md:p-10 bg-white/95 backdrop-blur-sm rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl border-t border-l border-r md:border-r-0 border-gray-200">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <div className="flex items-center gap-2 md:gap-3 text-emerald-600 font-bold">
                <PlaneLanding className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-sm md:text-xl text-gray-500 font-medium tracking-tight">Return from <span className="text-gray-900 font-bold">Tashkent</span> (Flight EK 2457 · flydubai FZ 1946)</span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-8 md:mb-12">
              <div className="flex-1">
                <p className="text-[10px] md:text-base text-gray-500 font-medium mb-1 md:mb-3">3 December 2026, Thursday</p>
                <p className="text-4xl md:text-8xl font-bold text-gray-900 tracking-tighter leading-none">16:25</p>
                <p className="text-2xl md:text-6xl font-bold text-gray-900 mt-1 md:mt-4 tracking-tight">TAS</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium mt-1 md:mt-2">Tashkent International Airport</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center px-2 md:px-6 pt-8 md:pt-16">
                <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-2 py-1 md:px-6 md:py-3 rounded-full border border-gray-100 flex flex-col items-center shadow-sm">
                    <span className="text-[8px] md:text-sm font-bold text-gray-400 whitespace-nowrap uppercase tracking-widest">04h 45min</span>
                    <span className="text-[8px] md:text-sm font-bold text-gray-900 whitespace-nowrap">Non-stop</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-right">
                <p className="text-[10px] md:text-base text-gray-500 font-medium mb-1 md:mb-3">3 December 2026, Thursday</p>
                <p className="text-4xl md:text-8xl font-bold text-gray-900 tracking-tighter leading-none">20:10</p>
                <p className="text-2xl md:text-6xl font-bold text-gray-900 mt-1 md:mt-4 tracking-tight">DXB</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium mt-1 md:mt-2">Dubai International Airport</p>
                <p className="text-[10px] md:text-base text-gray-500 font-medium">Terminal 3</p>
              </div>
            </div>
          </div>

          {/* Divider Desktop */}
          <div 
            className="hidden md:flex flex-col items-center justify-center relative w-8 bg-white/95 backdrop-blur-sm border-t border-b border-gray-200"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 16px 0, transparent 12px, black 13px), radial-gradient(circle at 16px 100%, transparent 12px, black 13px)',
              maskImage: 'radial-gradient(circle at 16px 0, transparent 12px, black 13px), radial-gradient(circle at 16px 100%, transparent 12px, black 13px)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect'
            }}
          >
            <div className="h-[calc(100%-40px)] border-l-2 border-dashed border-gray-200"></div>
          </div>

          {/* Divider Mobile */}
          <div 
            className="md:hidden flex items-center justify-center relative h-8 bg-white/95 backdrop-blur-sm border-l border-r border-gray-200"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 0 16px, transparent 12px, black 13px), radial-gradient(circle at 100% 16px, transparent 12px, black 13px)',
              maskImage: 'radial-gradient(circle at 0 16px, transparent 12px, black 13px), radial-gradient(circle at 100% 16px, transparent 12px, black 13px)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect'
            }}
          >
            <div className="w-[calc(100%-40px)] border-t-2 border-dashed border-gray-200"></div>
          </div>

          {/* Tear-off / Info */}
          <div className="w-full md:w-80 bg-emerald-50/90 backdrop-blur-sm p-6 flex flex-col justify-between items-center rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl border-b border-l border-r md:border-l-0 border-gray-200">
            <div className="w-full text-center mb-4">
              <p className="text-[10px] text-emerald-600/80 uppercase tracking-widest mb-2 font-bold">Trip Duration</p>
              <div className="flex justify-center items-center gap-2">
                <Clock className="w-6 h-6 text-emerald-500" />
                <span className="text-3xl font-bold text-emerald-600">{tripDurationDays}</span>
                <span className="text-xs text-gray-500 uppercase font-medium mt-1">Days</span>
              </div>
            </div>

            <div className="w-full mb-4">
              <FlightInfo items={[
                { icon: Briefcase, label: "7 kg hand baggage (included)" },
                { icon: Luggage, label: "25 kg checked baggage (included)" },
                { icon: Utensils, label: "Meal (included)" },
                { icon: Armchair, label: "Seat unassigned" },
                { icon: Headphones, label: "In-flight entertainment (included)" },
              ]} />
            </div>
            
            <Barcode code="EK2457-TAS-DXB-2026" />
          </div>
        </div>
      )}
    </div>
  );
}
