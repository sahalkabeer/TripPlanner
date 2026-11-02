import { Widget } from '../Widget';
import { useTripStore } from '../../store/useTripStore';
import { Utensils, CheckCircle2, Circle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const initialFoodItems = [
  { name: 'Plov (Osh)', price: '~50,000 UZS', checked: false },
  { name: 'Manti', price: '~40,000 UZS', checked: false },
  { name: 'Shashlik', price: '~30,000 UZS', checked: false },
  { name: 'Lagman', price: '~45,000 UZS', checked: false },
  { name: 'Samsa', price: '~10,000 UZS', checked: false },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const foodImages: Record<string, string> = {};

const displayPrice = (price: string) => {
  if (price.includes('UZS') && !price.includes('AED')) {
    const numMatch = price.replace(/,/g, '').match(/\d+/);
    if (numMatch) {
      const uzs = parseInt(numMatch[0]);
      const aed = Math.round(uzs / 3270);
      return `~${uzs.toLocaleString()} UZS (~${aed} AED)`;
    }
  }
  return price;
};

export function FoodWidget() {
  const { foodItems, toggleFoodItem } = useTripStore();

  const handleRestore = async () => {
    const user = auth.currentUser;
    if (!user) return;
    initialFoodItems.forEach(async (item) => {
      const id = generateId();
      await setDoc(doc(db, `users/${user.uid}/foodItems/${id}`), { ...item, id });
    });
  };

  return (
    <Widget title="Must-Try Uzbek Food" icon={<Utensils className="w-5 h-5 text-orange-500" />} className="col-span-1 md:col-span-1 lg:col-span-1">
      <div className="space-y-3">
        {foodItems.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4 text-sm">Your food list is empty.</p>
            <button 
              onClick={handleRestore}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium border border-orange-200"
            >
              <RefreshCw className="w-4 h-4" />
              Restore Default List
            </button>
          </div>
        ) : (
          foodItems.map((item) => (
            <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer shadow-sm ${
              item.checked ? 'bg-emerald-50/20 border-emerald-200/20 backdrop-blur-sm' : 'bg-white/20 border-white/20 backdrop-blur-md hover:bg-white/30'
            }`}
            onClick={() => toggleFoodItem(item.id, item.checked)}
          >
            <div className="flex items-center gap-3">
              {item.checked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 shrink-0" />
              )}
              <img 
                src={foodImages[item.name] || `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/100/100`} 
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <span className={`font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {item.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-orange-700 bg-orange-100/20 backdrop-blur-sm px-2 py-1 rounded-md text-right border border-orange-200/20">
              {displayPrice(item.price)}
            </span>
          </motion.div>
          ))
        )}
      </div>
    </Widget>
  );
}
