/**
 * CartContext.jsx
 * ----------------------------------------------------------------------------
 * A second, independent context: the shopping cart.
 * Real apps often have several contexts (auth, theme, cart, language...).
 * Each one has a single responsibility, so a change in the cart does not
 * re-render components that only care about the user.
 * ----------------------------------------------------------------------------
 */
import { createContext, useContext, useMemo, useState } from 'react';

// 1. Create the context
const CartContext = createContext(null);

// 2. Provider: holds the cart items and the actions that change them
export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, qty }]

  const value = useMemo(() => {
    // Add a product, or increase its quantity if it's already in the cart
    const addItem = (product) =>
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        }
        return [...prev, { ...product, qty: 1 }];
      });

    const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
    const clear = () => setItems([]);

    // Derived values: calculated from state, never stored separately
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

    return { items, count, total, addItem, removeItem, clear };
  }, [items]); // re-create the value only when items change

  return <CartContext value={value}>{children}</CartContext>;
}

// 3. Custom hook to consume the cart
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() must be used inside <CartProvider>');
  return ctx;
}
