import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../types/product";

interface CartContextValue {
  cart: Product[];
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  removeByProductId: (productId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

interface StoredCartItem extends Product {
  cartId: string;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<StoredCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ecommerce_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("ecommerce_cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = (product: Product) => {
    if (!product?.id) return;

    setCart((prevCart) => [
      ...prevCart,
      {
        ...product,
        cartId: `${product.id}-${Date.now()}-${Math.random()}`,
      },
    ]);
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const removeByProductId = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + (item.price || 0), 0);

  const getCartCount = () => cart.length;

  const cartItems = useMemo(() => {
    const grouped = new Map<number, CartItem>();

    for (const item of cart) {
      const existing = grouped.get(item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        grouped.set(item.id, { ...item, quantity: 1 });
      }
    }

    return Array.from(grouped.values());
  }, [cart]);

  const value: CartContextValue = {
    cart,
    cartItems,
    addToCart,
    removeFromCart,
    removeByProductId,
    clearCart,
    getTotalPrice,
    getCartCount,
    isLoading,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
