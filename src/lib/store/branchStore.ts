import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BranchId = 'attock' | 'kamra';

export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  address: string;
  mapUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export const BRANCHES: Record<BranchId, Branch> = {
  'attock': {
    id: 'attock',
    name: 'Attock City',
    shortName: 'Attock',
    address: 'Kamra, Cant, Attock, Pakistan',
    mapUrl: 'https://maps.app.goo.gl/p3jmDzJy7SrQW34NA',
    phone: '0332 7659882',
    whatsapp: 'https://wa.me/923327659882',
    email: 'sidrafatima179@gmail.com'
  },
  'kamra': {
    id: 'kamra',
    name: 'Kamra Cantt',
    shortName: 'Kamra',
    address: 'Kamra, Cant, Attock, Pakistan',
    mapUrl: 'https://maps.app.goo.gl/p3jmDzJy7SrQW34NA',
    phone: '0332 7659882',
    whatsapp: 'https://wa.me/923327659882',
    email: 'sidrafatima179@gmail.com'
  }
};

interface BranchState {
  selectedBranchId: BranchId;
  setBranch: (id: BranchId) => void;
  getCurrentBranch: () => Branch;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      selectedBranchId: 'attock', // Default branch
      setBranch: (id) => set({ selectedBranchId: id }),
      getCurrentBranch: () => {
        const branch = BRANCHES[get().selectedBranchId];
        return branch || BRANCHES['attock'];
      },
    }),
    {
      name: 'attock-cake-delight-branch-storage', // unique name
    }
  )
);
