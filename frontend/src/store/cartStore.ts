import { create } from 'zustand';
import type { CartItem, Product } from '../types';

// Cart state is in-memory only — it resets on page refresh by design
// If you want a persistent cart in the future, add localStorage serialization like authStore does

interface CartState {
  items: CartItem[];
  isOpen: boolean;           // Controls whether the CartSidebar panel is visible
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;       // Sum of (price × quantity) for all items, in kr
  count: () => number;       // Total number of individual items (sum of all quantities)
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  // If the product is already in the cart, increment its quantity
  // Otherwise, add it as a new item with quantity 1
  addItem: (product) => {
    const existing = get().items.find(i => i.product.id === product.id);
    if (existing) {
      set(s => ({
        items: s.items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }));
    } else {
      set(s => ({ items: [...s.items, { product, quantity: 1 }] }));
    }
  },

  removeItem: (productId) =>
    set(s => ({ items: s.items.filter(i => i.product.id !== productId) })),

  // Setting quantity to 0 or below removes the item from the cart entirely
  updateQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeItem(productId);
      return;
    }
    set(s => ({
      items: s.items.map(i =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      )
    }));
  },

  // Empties the cart — called after a successful order placement
  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  // Derived values — computed on demand, not stored in state
  total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
