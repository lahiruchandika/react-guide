/**
 * Tooltip - a tooltip that positions itself by MEASURING the DOM.
 * ----------------------------------------------------------------------------
 * Problem: we can't know the tooltip's height (or whether it fits above the
 * button) until it has been rendered. So:
 *   1. render the tooltip (position unknown yet)
 *   2. useLayoutEffect: measure with getBoundingClientRect()
 *   3. setCoords(...) -> React re-renders with the right position
 * Steps 1-3 happen BEFORE the browser paints, so the user only ever sees the
 * final position - never the tooltip jumping around.
 *
 * Props:
 *   text         tooltip content
 *   boundaryRef  ref to the container the tooltip must stay inside
 *                (the container needs `position: relative`)
 *   children     the trigger element (e.g. a button)
 * ----------------------------------------------------------------------------
 */
import { useLayoutEffect, useRef, useState } from 'react';

const GAP = 8; // space between trigger and tooltip, in px

export default function Tooltip({ text, boundaryRef, children }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null); // { top, left, placement } once measured

  const triggerRef = useRef(null); // the element we hover
  const tooltipRef = useRef(null); // the tooltip box we need to measure

  useLayoutEffect(() => {
    if (!open) return; // nothing to measure when hidden

    // 1. Measure everything. getBoundingClientRect() returns sizes/positions
    //    relative to the viewport, so we subtract the container's position.
    const trigger = triggerRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    const box = boundaryRef.current.getBoundingClientRect();

    // 2. Prefer ABOVE the trigger; flip BELOW if there isn't enough room.
    let placement = 'top';
    let top = trigger.top - box.top - tip.height - GAP;
    if (top < 0) {
      placement = 'bottom';
      top = trigger.bottom - box.top + GAP;
    }

    // 3. Center horizontally, but clamp so it never leaves the container.
    const centered = trigger.left - box.left + trigger.width / 2 - tip.width / 2;
    const left = Math.min(Math.max(centered, GAP), box.width - tip.width - GAP);

    // 4. Update state. Because we're in useLayoutEffect, React re-renders
    //    synchronously and the browser paints only the final result.
    setCoords({ top, left, placement });
  }, [open, text, boundaryRef]);

  const show = () => setOpen(true);
  const hide = () => {
    setOpen(false);
    setCoords(null); // forget the old position: it must be re-measured next time
  };

  return (
    <>
      {/* The trigger: hover OR keyboard focus opens the tooltip (accessibility) */}
      <span
        ref={triggerRef}
        className="ule-trigger"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {open && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`ule-tooltip ule-tooltip-${coords?.placement ?? 'top'}`}
          // Before measuring we park it at 0,0 - nobody ever sees this frame.
          style={{ top: coords?.top ?? 0, left: coords?.left ?? 0 }}
        >
          {text}
          {coords && (
            <span className="ule-tooltip-meta">
              placed {coords.placement} · top {Math.round(coords.top)}px
            </span>
          )}
        </div>
      )}
    </>
  );
}
