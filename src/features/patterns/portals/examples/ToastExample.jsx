/**
 * ToastExample - a toast notification stack (Context + Portal together).
 * ----------------------------------------------------------------------------
 * The buttons live deep inside this demo box, but the toasts appear in the
 * bottom-right corner of the SCREEN - they are portaled into <body>.
 *
 *   <ToastProvider>          holds the list + renders the portal
 *     <ShopActions />        calls useToast() -> toast({ ... })
 *   </ToastProvider>
 *
 * Hover a toast to pause its timer. At most 4 are shown at once.
 * ----------------------------------------------------------------------------
 */
import { ShoppingCart, Heart, WifiOff, Info } from 'lucide-react';
import { Button } from '@/components/ui';
import ToastProvider from '../components/toast/ToastProvider';
import { useToast } from '../components/toast/ToastContext';

/** A child component - it doesn't know HOW toasts are shown, it just asks for one. */
function ShopActions() {
  const toast = useToast(); // from context

  return (
    <div className="pt-shop">
      <div className="pt-product">
        <span className="pt-product-emoji" aria-hidden>🎧</span>
        <div className="pt-grow">
          <strong>Noise-cancelling headphones</strong>
          <div className="muted small">$199.00 · in stock</div>
        </div>
      </div>

      <div className="row">
        <Button
          icon={<ShoppingCart />}
          onClick={() => toast({ type: 'success', title: 'Added to cart', message: 'Noise-cancelling headphones × 1' })}
        >
          Add to cart
        </Button>
        <Button
          variant="secondary"
          icon={<Heart />}
          onClick={() => toast({ type: 'info', title: 'Saved to wishlist', duration: 2500 })}
        >
          Wishlist
        </Button>
        <Button
          variant="secondary"
          icon={<Info />}
          onClick={() => toast({ type: 'warning', title: 'Only 2 left', message: 'Order soon to get it by Friday.' })}
        >
          Stock warning
        </Button>
        <Button
          variant="danger"
          icon={<WifiOff />}
          onClick={() => toast({ type: 'error', title: 'Payment failed', message: 'Network error - please try again.', duration: 6000 })}
        >
          Simulate error
        </Button>
      </div>
    </div>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider max={4}>
      <ShopActions />
    </ToastProvider>
  );
}
