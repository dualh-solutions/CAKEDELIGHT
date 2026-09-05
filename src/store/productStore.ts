import { create } from 'zustand';
import { Product, CATEGORIES as FallbackCategories } from '@/lib/mockData';

interface ProductState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  source: string;
  hasFetched: boolean;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: FallbackCategories,
  isLoading: false,
  error: null,
  source: 'none',
  hasFetched: false,
  fetchProducts: async () => {
    if (get().isLoading || get().hasFetched) return;
    
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch API');
      
      const data = await res.json();
      set({ 
        products: data.products || [], 
        categories: data.categories || FallbackCategories,
        source: data.source, 
        isLoading: false,
        hasFetched: true
      });
    } catch (err) {
      set({ error: 'Failed to load products', isLoading: false, hasFetched: true });
    }
  }
}));
