/**
 * ShoppingCartExample.jsx
 * ----------------------------------------------------------------------------
 * A realistic useReducer example: a shopping cart.
 *
 * Where things live (industry-style separation):
 *   reducers/cartReducer.js   -> action types, reducer, action creators, selectors
 *   data/catalog.js           -> product data
 *   components/ProductCard    -> one product (calls onAdd)
 *   components/CartLine       -> one cart line (dispatches qty/remove actions)
 *   components/CartSummary    -> totals + coupon form
 *   this file                 -> wires everything together with useReducer
 *
 * Notice how this component contains almost NO logic: it only dispatches
 * actions. Every state change is described in cartReducer.js.
 * ----------------------------------------------------------------------------
 */
import { useReducer } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import ProductCard from '../components/ProductCard';
import CartLine from '../components/CartLine';
import CartSummary from '../components/CartSummary';
import { CATALOG } from '../data/catalog';
import { addItem, cartReducer, clearCart, initialCartState, selectCartTotals } from '../reducers/cartReducer';

export default function ShoppingCartExample() {
  // 1. One reducer manages the whole cart (items + coupon).
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // 2. Derived values are calculated from state on each render.
  const totals = selectCartTotals(cart);

  // Helper: how many of a product are in the cart (for the button label).
  const qtyInCart = (id) => cart.items.find((item) => item.id === id)?.qty ?? 0;

  return (
    <div className="rd-shop">
      {/* Left: product catalogue */}
      <div className="stack">
        <span className="box-label">Products</span>
        {CATALOG.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inCart={qtyInCart(product.id)}
            onAdd={(p) => dispatch(addItem(p))} // 3. dispatch an action object
          />
        ))}
      </div>

      {/* Right: the cart */}
      <div className="rd-cart">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 8 }}>
            <ShoppingCart size={18} />
            <strong>Your cart</strong>
            <Badge tone="primary">{totals.itemCount}</Badge>
          </div>
          <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={() => dispatch(clearCart())} disabled={cart.items.length === 0}>
            Clear
          </Button>
        </div>

        {cart.items.length === 0 ? (
          <p className="rd-empty">Your cart is empty. Add something from the list!</p>
        ) : (
          <ul className="rd-lines">
            {cart.items.map((item) => (
              // 4. Children receive `dispatch` and send their own actions.
              <CartLine key={item.id} item={item} dispatch={dispatch} />
            ))}
          </ul>
        )}

        <CartSummary totals={totals} coupon={cart.coupon} dispatch={dispatch} />
      </div>
    </div>
  );
}
