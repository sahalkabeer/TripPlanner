import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut } from '../firebase';
import { useTripStore } from '../store/useTripStore';
import { LogIn, LogOut } from 'lucide-react';

// Initial data to populate if empty
const initialPackingList = [
  { text: 'Passport', checked: false, category: 'Documents' },
  { text: 'Flight Tickets (GXZPKW)', checked: false, category: 'Documents' },
  { text: 'Hotel Booking', checked: false, category: 'Documents' },
  { text: 'Winter Coat', checked: false, category: 'Clothes' },
  { text: 'Gloves & Hat', checked: false, category: 'Clothes' },
  { text: 'Sweater', checked: false, category: 'Clothes' },
  { text: 'Toothbrush', checked: false, category: 'Hygiene' },
  { text: 'Phone Charger', checked: false, category: 'Electronics' },
  { text: 'Power Bank', checked: false, category: 'Electronics' },
];

const initialShoppingList = [
  { text: 'Winter Boots', checked: false, category: 'Shoes' },
  { text: 'Thermal Socks', checked: false, category: 'Clothes' },
  { text: 'Travel Adapter (EU plug)', checked: false, category: 'Travel gear' },
  { text: 'Souvenirs for family', checked: false, category: 'Gifts' },
];

const initialFoodItems = [
  { name: 'Plov (Osh)', price: '~50,000 UZS', checked: false },
  { name: 'Manti', price: '~40,000 UZS', checked: false },
  { name: 'Shashlik', price: '~30,000 UZS', checked: false },
  { name: 'Lagman', price: '~45,000 UZS', checked: false },
  { name: 'Samsa', price: '~10,000 UZS', checked: false },
];

const initialBudgetItems = [
  { name: 'Flights DXB-TAS (Emirates, 2 pax)', category: 'Flights', amount: 3540 },
  { name: 'Hotels — Tashkent + Samarkand', category: 'Stay', amount: 1578 },
  { name: 'Afrosiyob trains (return, 2 pax)', category: 'Transport', amount: 380 },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

export function FirebaseSync() {
  const [user, setUser] = useState(auth.currentUser);
  const [signInError, setSignInError] = useState<string | null>(null);
  const { setPackingList, setShoppingList, setBudgetItems, setFoodItems, setDocuments, setTotalBudget, setVisibleWidgets } = useTripStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user has data, if not, populate initial data
        const tripSettingsRef = doc(db, `users/${currentUser.uid}/settings/trip`);
        const tripSettingsSnap = await getDoc(tripSettingsRef);
        
        if (!tripSettingsSnap.exists()) {
          // Populate initial data
          await setDoc(tripSettingsRef, { 
            totalBudget: 7000,
            visibleWidgets: {
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
            }
          });
          
          initialPackingList.forEach(async (item) => {
            const id = generateId();
            await setDoc(doc(db, `users/${currentUser.uid}/packingList/${id}`), { ...item, id });
          });
          initialShoppingList.forEach(async (item) => {
            const id = generateId();
            await setDoc(doc(db, `users/${currentUser.uid}/shoppingList/${id}`), { ...item, id });
          });
          initialFoodItems.forEach(async (item) => {
            const id = generateId();
            await setDoc(doc(db, `users/${currentUser.uid}/foodItems/${id}`), { ...item, id });
          });
          initialBudgetItems.forEach(async (item) => {
            const id = generateId();
            await setDoc(doc(db, `users/${currentUser.uid}/budgetItems/${id}`), { ...item, id });
          });
          
          const docs = [
            { id: generateId(), name: 'Passport Copy', type: 'passport' },
            { id: generateId(), name: 'Flight DXB-TAS · GXZPKW', type: 'ticket' },
            { id: generateId(), name: 'Hotel Booking', type: 'hotel' },
          ];
          docs.forEach(async (item) => {
            await setDoc(doc(db, `users/${currentUser.uid}/documents/${item.id}`), item);
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubPacking = onSnapshot(collection(db, `users/${user.uid}/packingList`), (snapshot) => {
      console.log('Packing list updated:', snapshot.docs.length);
      setPackingList(snapshot.docs.map(doc => doc.data() as any));
    }, (error) => console.error("Packing list error:", error));
    
    const unsubShopping = onSnapshot(collection(db, `users/${user.uid}/shoppingList`), (snapshot) => {
      console.log('Shopping list updated:', snapshot.docs.length);
      setShoppingList(snapshot.docs.map(doc => doc.data() as any));
    }, (error) => console.error("Shopping list error:", error));
    
    const unsubBudget = onSnapshot(collection(db, `users/${user.uid}/budgetItems`), (snapshot) => {
      console.log('Budget items updated:', snapshot.docs.length);
      setBudgetItems(snapshot.docs.map(doc => doc.data() as any));
    }, (error) => console.error("Budget items error:", error));
    
    const unsubFood = onSnapshot(collection(db, `users/${user.uid}/foodItems`), (snapshot) => {
      console.log('Food items updated:', snapshot.docs.length);
      setFoodItems(snapshot.docs.map(doc => doc.data() as any));
    }, (error) => console.error("Food items error:", error));
    
    const unsubDocs = onSnapshot(collection(db, `users/${user.uid}/documents`), (snapshot) => {
      console.log('Documents updated:', snapshot.docs.length);
      setDocuments(snapshot.docs.map(doc => doc.data() as any));
    }, (error) => console.error("Documents error:", error));
    
    const unsubSettings = onSnapshot(doc(db, `users/${user.uid}/settings/trip`), (doc) => {
      const defaultWidgets = {
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

      if (doc.exists()) {
        const data = doc.data();
        if (data.totalBudget !== undefined) {
          setTotalBudget(data.totalBudget);
        }
        const mergedWidgets = { ...defaultWidgets, ...(data.visibleWidgets || {}) };
        setVisibleWidgets(mergedWidgets);
      } else {
        // If document doesn't exist, set default widgets
        setVisibleWidgets(defaultWidgets);
      }
    }, (error) => console.error("Settings error:", error));

    return () => {
      unsubPacking();
      unsubShopping();
      unsubBudget();
      unsubFood();
      unsubDocs();
      unsubSettings();
    };
  }, [user]);

  const handleSignIn = async () => {
    try {
      setSignInError(null);
      await signInWithGoogle();
    } catch (error: any) {
      console.error(error);
      setSignInError(error.message || "Failed to sign in. Please ensure popups are allowed and try again.");
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Uzbekistan Adventure</h2>
          <p className="text-gray-500 mb-8">Sign in to sync your travel dashboard across all your devices.</p>
          <button
            onClick={handleSignIn}
            className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
          {signInError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm text-left">
              <p className="font-semibold mb-1">Sign in error:</p>
              <p>{signInError}</p>
              <p className="mt-2 text-xs opacity-80">Tip: If you are using Safari or a browser that blocks cross-site tracking, you may need to allow it or try opening the app in a new tab.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={logOut}
      className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm transition-colors text-sm font-medium text-gray-700"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
