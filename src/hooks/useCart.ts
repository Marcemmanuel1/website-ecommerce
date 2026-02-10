import { useState, useCallback } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<number[]>([]);

  const addToCart = useCallback((productId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();

    setCartItems((prev) => [...prev, productId]);

    // Animation feedback
    if (e?.currentTarget) {
      const button = e.currentTarget as HTMLButtonElement;
      const originalBg = button.style.backgroundColor;
      button.style.backgroundColor = "#16a34a";

      setTimeout(() => {
        button.style.backgroundColor = originalBg;
      }, 300);
    }

    return true;
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: number) => {
      return cartItems.includes(productId);
    },
    [cartItems],
  );

  return {
    cartItems,
    cartCount: cartItems.length,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  };
};
