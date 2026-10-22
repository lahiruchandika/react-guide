/**
 * PreviousValueExample - remember the value from the previous render
 * ----------------------------------------------------------------------------
 * Scenario: a stock ticker that shows the current price, the previous price
 * and whether it went up or down.
 *
 * How usePrevious works:
 *   1. During render, ref.current still holds the value from the LAST render.
 *   2. After the render is on screen, the effect stores the NEW value in the ref.
 *   3. Updating a ref doesn't re-render, so nothing loops.
 *
 *   function usePrevious(value) {
 *     const ref = useRef(undefined);
 *     useEffect(() => { ref.current = value; }, [value]);
 *     return ref.current;     // the value from the previous render
 *   }
 *
 * Note: React's docs generally advise not reading ref.current during render,
 * because the component may not re-render when it changes. That's fine here:
 * the price is state, so every change re-renders and the ref is read once per
 * render. An alternative is to store the previous value in state as well.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Shuffle } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import '../UseRefPage.css';

// A tiny custom hook built on useRef + useEffect.
function usePrevious(value) {
  const ref = useRef(undefined); // nothing "previous" on the first render
  useEffect(() => {
    ref.current = value; // runs AFTER render -> becomes "previous" for the next render
  }, [value]);
  return ref.current;
}

export default function PreviousValueExample() {
  const [price, setPrice] = useState(182.5);
  const previous = usePrevious(price); // the price from the last render

  const diff = previous === undefined ? 0 : price - previous;
  const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // Change the price by a random amount between -5 and +5.
  function randomTick() {
    setPrice((p) => Math.max(1, +(p + (Math.random() * 10 - 5)).toFixed(2)));
  }

  return (
    <div className="ur-ticker">
      <div className="ur-ticker-head">
        <div>
          <strong>ACME Corp</strong>
          <div className="muted small">NASDAQ: ACME</div>
        </div>
        <Badge tone={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'neutral'}>
          <TrendIcon size={12} /> {diff >= 0 ? '+' : ''}
          {diff.toFixed(2)}
        </Badge>
      </div>

      <div className="row ur-ticker-prices">
        <div>
          <div className="muted small">Current</div>
          <span className={`big-number ur-trend-${trend}`}>${price.toFixed(2)}</span>
        </div>
        <div>
          <div className="muted small">Previous (from ref)</div>
          <span className="ur-prev">{previous === undefined ? '-' : `$${previous.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="row">
        <Button icon={<Shuffle />} onClick={randomTick}>Market tick</Button>
        <Button variant="secondary" size="sm" onClick={() => setPrice((p) => +(p + 1).toFixed(2))}>+$1</Button>
        <Button variant="secondary" size="sm" onClick={() => setPrice((p) => Math.max(1, +(p - 1).toFixed(2)))}>-$1</Button>
      </div>
    </div>
  );
}
