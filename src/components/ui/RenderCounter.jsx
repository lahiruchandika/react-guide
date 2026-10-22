/**
 * RenderCounter - shows how many times the component that contains it has rendered.
 * Very useful for learning memo / useMemo / useCallback: you can SEE re-renders.
 *
 *   function Child() {
 *     return <div>Child <RenderCounter /></div>;
 *   }
 *
 * How it works: a ref survives re-renders without causing new ones, so we
 * increase it every time this component's parent renders us.
 * The badge briefly flashes each time the number changes.
 *
 * Note: in development, <StrictMode> renders twice, so counts can go up by 2.
 */
import { useEffect, useRef } from 'react';
import './RenderCounter.css';

export default function RenderCounter({ label = 'renders' }) {
  const count = useRef(0);
  const badgeRef = useRef(null);

  // Mutating a ref during render is normally avoided; here it is intentional
  // and only used for this teaching helper.
  count.current += 1;

  // After every render, replay the flash animation.
  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;
    el.classList.remove('flash');
    void el.offsetWidth; // force reflow so the animation can restart
    el.classList.add('flash');
  });

  return (
    <span ref={badgeRef} className="render-counter" title="How many times this component rendered">
      {label}: {count.current}
    </span>
  );
}
