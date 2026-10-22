/**
 * CartContext.jsx
 * ----------------------------------------------------------------------------
 * useReducer + Context: a tiny "global store" without any library.
 *
 *   1. The provider owns the state with useReducer(cartReducer, ...).
 *   2. It shares { cart, totals, dispatch } through Context.
 *   3. ANY component inside the provider calls useCart() to read the cart or
 *      dispatch actions - no props passed through every level ("prop drilling").
 *
 * This is the same idea that libraries like Redux are built on.
 * (See the useContext lesson for Context in depth.)
 * ----------------------------------------------------------------------------
 */
import { createContext, useContext, useReducer } from 'react';
import { cartReducer, initialCartState, selectCartTotals } from '../reducers/cartReducer';

// 1. Create the context (null = "used outside a provider").
const CartContext = createContext(null);

// 2. Provider component: holds the reducer and shares it.
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  const totals = selectCartTotals(cart);

  // React 19: render the context itself as the provider (<CartContext.Provider> also still works).
  return <CartContext value={{ cart, totals, dispatch }}>{children}</CartContext>;
}

// 3. Custom hook: the only way components should read the cart.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
