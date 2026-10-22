/**
 * MultipleContextsExample
 * ----------------------------------------------------------------------------
 * A mini shop that uses TWO contexts at the same time:
 *   - UserContext -> who is shopping (greeting)
 *   - CartContext -> what is in the cart (badge, product buttons, summary)
 *
 * Providers are simply nested. Each component subscribes only to the context
 * it needs - watch the render counters: adding to the cart re-renders the
 * cart consumers, but NOT the <Greeting> (it only reads the user).
 * ----------------------------------------------------------------------------
 */
import { Coffee, BookOpen, Headphones, Watch, Trash2 } from 'lucide-react';
import { Button, RenderCounter } from '@/components/ui';
import { UserProvider, useUser } from '../context/UserContext';
import { CartProvider, useCart } from '../context/CartContext';
import CartBadge from '../components/CartBadge';
import ProductCard from '../components/ProductCard';

// Static data lives outside the component so it isn't re-created on every render
const PRODUCTS = [
  { id: 1, name: 'Coffee beans', price: 12.5, icon: Coffee },
  { id: 2, name: 'React book', price: 29.0, icon: BookOpen },
  { id: 3, name: 'Headphones', price: 79.99, icon: Headphones },
  { id: 4, name: 'Smart watch', price: 149.0, icon: Watch },
];

// Reads ONLY the user context
function Greeting() {
  const { user } = useUser();
  return (
    <div className="row">
      <span>
        Hi, <strong>{user.name.split(' ')[0]}</strong>! Happy shopping.
      </span>
      <RenderCounter />
    </div>
  );
}

// Reads ONLY the cart context
function CartSummary() {
  const { items, total, removeItem, clear } = useCart();

  if (items.length === 0) {
    return <p className="muted small ctx-empty">Your cart is empty - add a product.</p>;
  }

  return (
    <div className="stack">
      <ul className="ctx-cart-list">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} <span className="muted small">x{item.qty}</span>
            </span>
            <span className="row">
              <strong>${(item.price * item.qty).toFixed(2)}</strong>
              <button type="button" className="ctx-icon-btn" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}>
                <Trash2 size={14} />
              </button>
            </span>
          </li>
        ))}
      </ul>
      <div className="row ctx-cart-total">
        <strong>Total: ${total.toFixed(2)}</strong>
        <Button size="sm" variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}

// The layout itself has NO state and reads NO context.
// Because it's passed as `children` to the providers, it does not re-render
// when the context values change - only the consumers do.
function ShopLayout() {
  return (
    <div className="ctx-app stack">
      <header className="ctx-app-header">
        <Greeting />
        <CartBadge />
      </header>
      <div className="ctx-shop">
        <div className="ctx-products">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <aside className="box">
          <span className="box-label">{'<CartSummary>'}</span>
          <CartSummary />
        </aside>
      </div>
    </div>
  );
}

export default function MultipleContextsExample() {
  return (
    // Nest providers: order only matters if one provider needs the other.
    <UserProvider initialUser={{ name: 'Grace Hopper', role: 'Customer' }}>
      <CartProvider>
        <ShopLayout />
      </CartProvider>
    </UserProvider>
  );
}
