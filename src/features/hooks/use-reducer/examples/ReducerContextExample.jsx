/**
 * ReducerContextExample.jsx
 * ----------------------------------------------------------------------------
 * Preview: useReducer + Context.
 *
 *   <CartProvider>            <- owns useReducer(cartReducer)
 *     <StoreHeader>           <- reads totals with useCart()
 *       <CartBadge />
 *     <ProductShelf>          <- passes NO cart props down
 *       <ShelfItem>
 *         <AddToCartButton /> <- dispatches with useCart()
 *
 * The button and the badge are far apart in the tree, yet they share the same
 * cart - without passing props through ProductShelf and ShelfItem.
 * The dashed boxes show the component nesting.
 * ----------------------------------------------------------------------------
 */
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { CartProvider, useCart } from '../context/CartContext';
import { CATALOG, money } from '../data/catalog';
import { addItem, clearCart } from '../reducers/cartReducer';

// Deeply nested consumer #1: reads state.
function CartBadge() {
  const { totals } = useCart();
  return (
    <div className="row" style={{ gap: 8 }}>
      <ShoppingBag size={18} />
      <Badge tone="primary">{totals.itemCount} items</Badge>
      <b>{money(totals.total)}</b>
    </div>
  );
}

function StoreHeader() {
  const { cart, dispatch } = useCart();
  return (
    <div className="box">
      <span className="box-label">&lt;StoreHeader&gt;</span>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <strong>Mini Store</strong>
        <div className="row">
          <CartBadge />
          <Button size="sm" variant="ghost" icon={<Trash2 size={14} />} onClick={() => dispatch(clearCart())} disabled={!cart.items.length}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}

// Deeply nested consumer #2: dispatches actions.
function AddToCartButton({ product }) {
  const { dispatch } = useCart();
  return (
    <Button size="sm" onClick={() => dispatch(addItem(product))}>
      Add
    </Button>
  );
}

// Middle components: they do NOT know about the cart at all.
function ShelfItem({ product }) {
  return (
    <div className="rd-shelf-item">
      <span className="rd-product-emoji">{product.emoji}</span>
      <span className="small">{product.name}</span>
      <AddToCartButton product={product} />
    </div>
  );
}

function ProductShelf() {
  return (
    <div className="box">
      <span className="box-label">&lt;ProductShelf&gt; → &lt;ShelfItem&gt; → &lt;AddToCartButton&gt;</span>
      <div className="grid-3">
        {CATALOG.slice(0, 3).map((p) => (
          <ShelfItem key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ReducerContextExample() {
  return (
    // Everything inside the provider can use useCart().
    <CartProvider>
      <div className="stack">
        <StoreHeader />
        <ProductShelf />
      </div>
    </CartProvider>
  );
}
