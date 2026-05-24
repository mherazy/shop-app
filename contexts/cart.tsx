import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { type Product } from '@/hooks/use-products';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const STORAGE_KEY = '@shop_app/cart';

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setItems(JSON.parse(raw) as CartItem[]);
        } catch {
          // corrupted data — start fresh
        }
      }
    });
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, product.stock) }
            : i
        );
      } else {
        next = [...prev, { product, quantity: 1 }];
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.product.id !== productId);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      let next: CartItem[];
      if (newQty < 1) {
        next = prev.filter((i) => i.product.id !== productId);
      } else {
        const clamped = Math.min(newQty, item.product.stock);
        next = prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: clamped } : i
        );
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => {
    return s + i.product.price * (1 - i.product.discount / 100) * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
