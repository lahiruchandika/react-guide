/**
 * cartReducer.js
 * ----------------------------------------------------------------------------
 * All shopping-cart state logic in ONE pure function, in its own file.
 *
 * A reducer answers one question:
 *   "Given the CURRENT state and an ACTION (what happened), what is the NEXT state?"
 *
 *     (state, action) => newState
 *
 * Rules of a reducer:
 *   1. Pure: same inputs -> same output. No fetch, no Math.random, no Date.now.
 *   2. Never mutate `state` - always return a NEW object/array.
 *   3. Unknown action types should throw (helps you catch typos).
 *
 * Because it is plain JavaScript (no React import), it is trivial to unit test:
 *   expect(cartReducer(initialCartState, addItem(apple)).items).toHaveLength(1)
 * ----------------------------------------------------------------------------
 */

// 1. Action type constants: a typo in a string like 'ADD_ITME' fails silently,
//    a typo in a constant (CART_ACTIONS.ADD_ITME) is caught immediately.
export const CART_ACTIONS = {
  ADD_ITEM: 'cart/addItem',
  REMOVE_ITEM: 'cart/removeItem',
  INCREASE_QTY: 'cart/increaseQty',
  DECREASE_QTY: 'cart/decreaseQty',
  APPLY_COUPON: 'cart/applyCoupon',
  CLEAR: 'cart/clear',
};

// 2. The initial state shape lives next to the reducer.
export const initialCartState = {
  items: [], // [{ id, name, price, emoji, qty }]
  coupon: null, // e.g. { code: 'SAVE10', percent: 10 }
};

// Coupons the shop accepts (static data, so the reducer stays pure).
const COUPONS = { SAVE10: 10, REACT20: 20 };

// 3. The reducer itself.
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      // Already in the cart? -> just increase its quantity.
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)),
        };
      }
      // New product -> append a new line with qty 1.
      return { ...state, items: [...state.items, { ...product, qty: 1 }] };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case CART_ACTIONS.INCREASE_QTY:
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload ? { ...item, qty: item.qty + 1 } : item)),
      };

    case CART_ACTIONS.DECREASE_QTY:
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.payload ? { ...item, qty: item.qty - 1 } : item))
          .filter((item) => item.qty > 0), // quantity 0 -> remove the line
      };

    case CART_ACTIONS.APPLY_COUPON: {
      const code = action.payload.trim().toUpperCase();
      const percent = COUPONS[code];
      // Invalid code -> remove any coupon and remember the error for the UI.
      return { ...state, coupon: percent ? { code, percent } : { code, percent: 0, invalid: true } };
    }

    case CART_ACTIONS.CLEAR:
      return initialCartState;

    default:
      // 4. Fail loudly for unknown actions.
      throw new Error(`cartReducer: unknown action type "${action.type}"`);
  }
}

// 5. Action creators (optional helpers) - build action objects in one place,
//    so components call dispatch(addItem(product)) instead of writing objects by hand.
export const addItem = (product) => ({ type: CART_ACTIONS.ADD_ITEM, payload: product });
export const removeItem = (id) => ({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
export const increaseQty = (id) => ({ type: CART_ACTIONS.INCREASE_QTY, payload: id });
export const decreaseQty = (id) => ({ type: CART_ACTIONS.DECREASE_QTY, payload: id });
export const applyCoupon = (code) => ({ type: CART_ACTIONS.APPLY_COUPON, payload: code });
export const clearCart = () => ({ type: CART_ACTIONS.CLEAR });

// 6. Selectors: derive totals FROM state instead of storing them in state
//    (stored totals could get out of sync with the items).
export function selectCartTotals(state) {
  const itemCount = state.items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = state.coupon ? (subtotal * state.coupon.percent) / 100 : 0;
  const shipping = subtotal === 0 || subtotal - discount >= 50 ? 0 : 4.99; // free shipping over $50
  return { itemCount, subtotal, discount, shipping, total: subtotal - discount + shipping };
}
