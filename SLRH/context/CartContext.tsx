import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { ImageSourcePropType } from "react-native";

/* ----------------------------- Types ----------------------------- */
export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: ImageSourcePropType; // ✅ proper RN image type
  quantity: number;
  rating?: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalPrice: number; // ✅ renamed from total for clarity
  itemCount: number;
};

/* ----------------------------- Context ----------------------------- */
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  /* -------------------- Add Item to Cart -------------------- */
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Increase quantity if item already in cart
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Add new item
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  /* -------------------- Remove Item -------------------- */
  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  /* -------------------- Update Quantity -------------------- */
  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0) // Remove if quantity 0
    );
  };

  /* -------------------- Clear Cart -------------------- */
  const clearCart = () => setItems([]);

  /* -------------------- Totals -------------------- */
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  /* -------------------- Context Value -------------------- */
  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ----------------------------- Hook ----------------------------- */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("❌ useCart must be used within CartProvider");
  return context;
};
