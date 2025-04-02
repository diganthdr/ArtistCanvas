import { createContext, useState, useEffect, ReactNode } from "react";
import { Artwork } from "@shared/schema";

interface CartContextType {
  items: Artwork[];
  addToCart: (item: Artwork) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isInCart: () => false,
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<Artwork[]>(() => {
    try {
      const storedCart = localStorage.getItem("diganth-cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Update localStorage whenever the cart changes
  useEffect(() => {
    try {
      localStorage.setItem("diganth-cart", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (item: Artwork) => {
    // Only add if not already in cart and item is in stock
    if (!isInCart(item.id) && item.inStock) {
      setItems([...items, item]);
    }
  };

  const removeFromCart = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id: number) => {
    return items.some(item => item.id === id);
  };

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
