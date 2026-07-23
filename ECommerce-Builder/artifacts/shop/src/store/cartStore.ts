import { create } from 'zustand';

interface CartState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
