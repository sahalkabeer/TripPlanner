import { create } from 'zustand';
import { db, auth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export type ListItem = {
  id: string;
  text: string;
  checked: boolean;
  category: string;
};

export type BudgetItem = {
  id: string;
  category: string;
  amount: number;
  name: string;
};

export type FoodItem = {
  id: string;
  name: string;
  price: string;
  checked: boolean;
};

export type DocumentItem = {
  id: string;
  name: string;
  type: 'passport' | 'ticket' | 'hotel' | 'other';
  url?: string;
  subtext?: string;
};

interface TripState {
  packingList: ListItem[];
  shoppingList: ListItem[];
  budgetItems: BudgetItem[];
  totalBudget: number;
  foodItems: FoodItem[];
  documents: DocumentItem[];
  visibleWidgets: { [key: string]: boolean };

  // Setters for Firebase sync
  setPackingList: (items: ListItem[]) => void;
  setShoppingList: (items: ListItem[]) => void;
  setBudgetItems: (items: BudgetItem[]) => void;
  setFoodItems: (items: FoodItem[]) => void;
  setDocuments: (items: DocumentItem[]) => void;
  setTotalBudget: (amount: number) => void;
  setVisibleWidgets: (widgets: { [key: string]: boolean }) => void;

  // Actions (Write to Firebase)
  addPackingItem: (item: Omit<ListItem, 'id'>) => Promise<void>;
  togglePackingItem: (id: string, checked: boolean) => Promise<void>;
  removePackingItem: (id: string) => Promise<void>;

  addShoppingItem: (item: Omit<ListItem, 'id'>) => Promise<void>;
  toggleShoppingItem: (id: string, checked: boolean) => Promise<void>;
  removeShoppingItem: (id: string) => Promise<void>;

  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => Promise<void>;
  removeBudgetItem: (id: string) => Promise<void>;
  updateTotalBudget: (amount: number) => Promise<void>;

  toggleFoodItem: (id: string, checked: boolean) => Promise<void>;
  
  addDocument: (doc: Omit<DocumentItem, 'id'>) => Promise<void>;
  updateDocument: (id: string, updates: Partial<DocumentItem>) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;

  updateVisibleWidget: (key: string, value: boolean) => Promise<void>;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useTripStore = create<TripState>((set) => ({
  packingList: [],
  shoppingList: [],
  budgetItems: [],
  totalBudget: 7000,
  foodItems: [],
  documents: [],
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
  },
  setPackingList: (items) => set({ packingList: items }),
  setShoppingList: (items) => set({ shoppingList: items }),
  setBudgetItems: (items) => set({ budgetItems: items }),
  setFoodItems: (items) => set({ foodItems: items }),
  setDocuments: (items) => set({ documents: items }),
  setTotalBudget: (amount) => set({ totalBudget: amount }),
  setVisibleWidgets: (widgets) => set({ visibleWidgets: widgets }),

  addPackingItem: async (item) => {
    const user = auth.currentUser;
    if (!user) return;
    const id = generateId();
    const path = `users/${user.uid}/packingList/${id}`;
    
    // Optimistic update
    set((state) => ({ packingList: [...state.packingList, { ...item, id }] }));
    
    try {
      await setDoc(doc(db, path), { ...item, id });
    } catch (error) {
      // Rollback on error
      set((state) => ({ packingList: state.packingList.filter(i => i.id !== id) }));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  togglePackingItem: async (id, checked) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    set((state) => ({ 
      packingList: state.packingList.map(i => i.id === id ? { ...i, checked: !checked } : i) 
    }));
    
    const path = `users/${user.uid}/packingList/${id}`;
    try {
      await updateDoc(doc(db, path), { checked: !checked });
    } catch (error) {
      // Rollback on error
      set((state) => ({ 
        packingList: state.packingList.map(i => i.id === id ? { ...i, checked: checked } : i) 
      }));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
  removePackingItem: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const item = useTripStore.getState().packingList.find(i => i.id === id);
    set((state) => ({ packingList: state.packingList.filter(i => i.id !== id) }));
    
    const path = `users/${user.uid}/packingList/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      // Rollback on error
      if (item) set((state) => ({ packingList: [...state.packingList, item] }));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  addShoppingItem: async (item) => {
    const user = auth.currentUser;
    if (!user) return;
    const id = generateId();
    const path = `users/${user.uid}/shoppingList/${id}`;
    
    // Optimistic update
    set((state) => ({ shoppingList: [...state.shoppingList, { ...item, id }] }));
    
    try {
      await setDoc(doc(db, path), { ...item, id });
    } catch (error) {
      // Rollback on error
      set((state) => ({ shoppingList: state.shoppingList.filter(i => i.id !== id) }));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  toggleShoppingItem: async (id, checked) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    set((state) => ({ 
      shoppingList: state.shoppingList.map(i => i.id === id ? { ...i, checked: !checked } : i) 
    }));
    
    const path = `users/${user.uid}/shoppingList/${id}`;
    try {
      await updateDoc(doc(db, path), { checked: !checked });
    } catch (error) {
      // Rollback on error
      set((state) => ({ 
        shoppingList: state.shoppingList.map(i => i.id === id ? { ...i, checked: checked } : i) 
      }));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
  removeShoppingItem: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const item = useTripStore.getState().shoppingList.find(i => i.id === id);
    set((state) => ({ shoppingList: state.shoppingList.filter(i => i.id !== id) }));
    
    const path = `users/${user.uid}/shoppingList/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      // Rollback on error
      if (item) set((state) => ({ shoppingList: [...state.shoppingList, item] }));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  addBudgetItem: async (item) => {
    const user = auth.currentUser;
    if (!user) return;
    const id = generateId();
    const path = `users/${user.uid}/budgetItems/${id}`;
    
    // Optimistic update
    set((state) => ({ budgetItems: [...state.budgetItems, { ...item, id }] }));
    
    try {
      await setDoc(doc(db, path), { ...item, id });
    } catch (error) {
      // Rollback on error
      set((state) => ({ budgetItems: state.budgetItems.filter(i => i.id !== id) }));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  removeBudgetItem: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const item = useTripStore.getState().budgetItems.find(i => i.id === id);
    set((state) => ({ budgetItems: state.budgetItems.filter(i => i.id !== id) }));
    
    const path = `users/${user.uid}/budgetItems/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      // Rollback on error
      if (item) set((state) => ({ budgetItems: [...state.budgetItems, item] }));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },
  updateTotalBudget: async (amount) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const previousBudget = useTripStore.getState().totalBudget;
    set({ totalBudget: amount });
    
    const path = `users/${user.uid}/settings/trip`;
    try {
      await updateDoc(doc(db, path), { totalBudget: amount });
    } catch (error) {
      // Rollback on error
      set({ totalBudget: previousBudget });
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  toggleFoodItem: async (id, checked) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    set((state) => ({ 
      foodItems: state.foodItems.map(i => i.id === id ? { ...i, checked: !checked } : i) 
    }));
    
    const path = `users/${user.uid}/foodItems/${id}`;
    try {
      await updateDoc(doc(db, path), { checked: !checked });
    } catch (error) {
      // Rollback on error
      set((state) => ({ 
        foodItems: state.foodItems.map(i => i.id === id ? { ...i, checked: checked } : i) 
      }));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  addDocument: async (item) => {
    const user = auth.currentUser;
    if (!user) return;
    const id = generateId();
    const path = `users/${user.uid}/documents/${id}`;
    
    // Optimistic update
    set((state) => ({ documents: [...state.documents, { ...item, id }] }));
    
    try {
      await setDoc(doc(db, path), { ...item, id });
    } catch (error) {
      // Rollback on error
      set((state) => ({ documents: state.documents.filter(i => i.id !== id) }));
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
  updateDocument: async (id, updates) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const previousDocument = useTripStore.getState().documents.find(i => i.id === id);
    set((state) => ({ 
      documents: state.documents.map(i => i.id === id ? { ...i, ...updates } : i) 
    }));
    
    const path = `users/${user.uid}/documents/${id}`;
    try {
      await updateDoc(doc(db, path), updates);
    } catch (error) {
      // Rollback on error
      if (previousDocument) {
        set((state) => ({ 
          documents: state.documents.map(i => i.id === id ? previousDocument : i) 
        }));
      }
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
  removeDocument: async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Optimistic update
    const item = useTripStore.getState().documents.find(i => i.id === id);
    set((state) => ({ documents: state.documents.filter(i => i.id !== id) }));
    
    const path = `users/${user.uid}/documents/${id}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      // Rollback on error
      if (item) set((state) => ({ documents: [...state.documents, item] }));
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  updateVisibleWidget: async (key, value) => {
    const user = auth.currentUser;
    if (!user) return;

    // Optimistic update
    set((state) => ({
      visibleWidgets: { ...state.visibleWidgets, [key]: value }
    }));

    const path = `users/${user.uid}/settings/trip`;
    try {
      await updateDoc(doc(db, path), { [`visibleWidgets.${key}`]: value });
    } catch (error) {
      // Rollback on error
      set((state) => ({
        visibleWidgets: { ...state.visibleWidgets, [key]: !value }
      }));
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
}));
