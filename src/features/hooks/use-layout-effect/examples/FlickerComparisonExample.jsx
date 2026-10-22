/**
 * FlickerComparisonExample
 * ----------------------------------------------------------------------------
 * Same popover, two hooks. Both popovers render first at a WRONG position
 * (top-left, red "unmeasured"), then measure the anchor button and move.
 *
 *   useEffect        runs AFTER the browser paints  -> you SEE the wrong frame (flicker)
 *   useLayoutEffect  runs BEFORE the browser paints -> you only see the final frame
 *
 * Real measurements take ~1ms, so the flicker is usually a 1-frame "jump".
 * The slider adds an artificial delay (blockFor) inside the effect so your
 * eyes can actually catch the difference.
 *
 * Note: React may run useEffect before paint for updates caused directly by a
 * click. To show the real-world case (data arriving, timers...), we open the
 * popover from a setTimeout.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { blockFor } from '../utils/blockFor';

// Shared math: place the popover centered just below the anchor button
function measureBelow(anchorEl, popoverEl) {
  const anchor = anchorEl.getBoundingClientRect();
  const parent = anchorEl.offsetParent.getBoundingClientRect(); // the .ule-panel (position: relative)
  const pop = popoverEl.getBoundingClientRect();
  return {
    top: anchor.bottom - parent.top + 8,
    left: anchor.left - parent.left + anchor.width / 2 - pop.width / 2,
  };
}

/* ------------------------- BAD: measured in useEffect ------------------------ */
function EffectPopover({ anchorRef, delay }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null); // null = not measured yet

  useEffect(() => {
    blockFor(delay); // pretend measuring is slow
    setPos(measureBelow(anchorRef.current, ref.current)); // too late: the wrong frame was already painted
  }, [anchorRef, delay]);

  return <Popover popRef={ref} pos={pos} />;
}

/* ---------------------- GOOD: measured in useLayoutEffect --------------------- */
function LayoutPopover({ anchorRef, delay }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    blockFor(delay); // same slow work, but the browser waits for us before painting
    setPos(measureBelow(anchorRef.current, ref.current)); // re-render happens before paint
  }, [anchorRef, delay]);

  return <Popover popRef={ref} pos={pos} />;
}

// Pure presentational piece shared by both versions
function Popover({ popRef, pos }) {
  return (
    <div
      ref={popRef}
      className={`ule-popover ${pos ? '' : 'ule-popover-unmeasured'}`}
      style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
    >
      {pos ? 'Positioned under the button' : 'Unmeasured position!'}
    </div>
  );
}

/* ------------------------------ One demo panel ------------------------------- */
function Panel({ title, tone, PopoverComponent, delay }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const timerRef = useRef(null);

  // Clear a pending timer if the panel unmounts
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggle = () => {
    clearTimeout(timerRef.current);
    // Open from a timer = a "non-click" update, like data arriving from a server
    timerRef.current = setTimeout(() => setOpen((o) => !o), 0);
  };

  return (
    <div className="ule-panel">
      <div className="row">
        <Badge tone={tone}>{title}</Badge>
      </div>
      <div className="ule-panel-anchor">
        <Button ref={anchorRef} size="sm" onClick={toggle}>
          {open ? 'Close' : 'Open'} popover
        </Button>
      </div>
      {open && <PopoverComponent anchorRef={anchorRef} delay={delay} />}
    </div>
  );
}

export default function FlickerComparisonExample() {
  const [delay, setDelay] = useState(250); // artificial slowness in ms

  return (
    <div className="stack">
      <label className="ule-slider">
        <span className="small">
          Artificial delay inside the effect: <strong>{delay} ms</strong>
        </span>
        <input type="range" min="0" max="600" step="50" value={delay} onChange={(e) => setDelay(Number(e.target.value))} />
      </label>

      <div className="grid-2">
        <Panel title="useEffect - flickers" tone="danger" PopoverComponent={EffectPopover} delay={delay} />
        <Panel title="useLayoutEffect - no flicker" tone="success" PopoverComponent={LayoutPopover} delay={delay} />
      </div>

      <p className="muted small">
        Left: you briefly see the red box in the corner before it jumps. Right: the click feels slower (the browser
        waits), but you never see a wrong frame. In development, StrictMode runs effects twice on mount, so the delay
        is doubled.
      </p>
    </div>
  );
}
