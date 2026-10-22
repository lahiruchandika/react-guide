/**
 * TernaryAndExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates the two INLINE ways to render conditionally inside JSX:
 *
 *   condition ? <A /> : <B />     -> "either A or B"   (ternary operator)
 *   condition && <A />            -> "A or nothing"    (logical AND)
 *
 * Scenario: a product card with stock status, a "Sale" badge, a wishlist
 * heart, and an "Add to cart" button that changes once the item is added.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function TernaryAndExample() {
  // Toggle switches that drive the conditions below.
  const [inStock, setInStock] = useState(true);
  const [onSale, setOnSale] = useState(true);
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);

  const price = 129;
  const salePrice = 99;

  return (
    <div className="grid-2">
      {/* ---------------- Controls (they just flip booleans) ---------------- */}
      <div className="stack">
        <span className="box-label">Flip the conditions:</span>
        <label className="cr-switch">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          inStock = <code>{String(inStock)}</code>
        </label>
        <label className="cr-switch">
          <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} />
          onSale = <code>{String(onSale)}</code>
        </label>
        <label className="cr-switch">
          <input type="checkbox" checked={liked} onChange={(e) => setLiked(e.target.checked)} />
          liked = <code>{String(liked)}</code>
        </label>
        <label className="cr-switch">
          <input type="checkbox" checked={inCart} onChange={(e) => setInCart(e.target.checked)} />
          inCart = <code>{String(inCart)}</code>
        </label>
      </div>

      {/* ---------------- The product card ---------------- */}
      <div className="cr-product">
        <div className="cr-product-image">
          🎧
          {/* && : show the Sale badge ONLY when onSale is true, otherwise nothing */}
          {onSale && (
            <span className="cr-product-ribbon">
              <Badge tone="danger">SALE -23%</Badge>
            </span>
          )}

          {/* Ternary on an attribute/className: filled heart vs outline heart */}
          <button
            type="button"
            className={liked ? 'cr-heart is-liked' : 'cr-heart'}
            onClick={() => setLiked(!liked)}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <strong>Wireless Headphones</strong>

        {/* Ternary: show the sale price OR the normal price */}
        {onSale ? (
          <div className="row">
            <span className="cr-price">${salePrice}</span>
            <s className="muted">${price}</s>
          </div>
        ) : (
          <span className="cr-price">${price}</span>
        )}

        {/* Ternary choosing between two different badges */}
        {inStock ? <Badge tone="success">In stock</Badge> : <Badge tone="neutral">Out of stock</Badge>}

        {/* Nested condition: keep it readable! Out of stock -> disabled button,
            otherwise "Added" vs "Add to cart". */}
        <Button
          variant={inCart ? 'secondary' : 'primary'}
          icon={inCart ? <Check /> : <ShoppingCart />}
          disabled={!inStock}
          onClick={() => setInCart(!inCart)}
        >
          {!inStock ? 'Unavailable' : inCart ? 'Added - click to remove' : 'Add to cart'}
        </Button>
      </div>
    </div>
  );
}
