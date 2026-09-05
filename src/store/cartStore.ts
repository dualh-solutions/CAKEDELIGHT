import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/mockData';

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for cart item (important if same product added with different options)
  quantity: number;
  selectedFlavor?: string;
  selectedWeight?: string;
  selectedSize?: string;
  message?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          // Check if identical item exists (same id, flavor, weight, message)
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.id === item.id &&
              i.selectedFlavor === item.selectedFlavor &&
              i.selectedWeight === item.selectedWeight &&
              i.selectedSize === item.selectedSize &&
              i.message === item.message
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return { items: newItems };
          }

          const cartItemId = `${item.id}-${Date.now()}`;
          return { items: [...state.items, { ...item, cartItemId }] };
        });
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
      },
    }),
    {
      name: 'cakoo-cart-storage',
    }
  )
);
