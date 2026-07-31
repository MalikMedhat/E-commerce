
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (open) => set({ isOpen: open }),
    }),
    { name: 'cart-storage' }
  )
);
