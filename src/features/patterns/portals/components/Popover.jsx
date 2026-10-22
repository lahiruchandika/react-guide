/**
 * Popover - a small floating menu that can render INLINE or through a PORTAL.
 * ----------------------------------------------------------------------------
 *   <Popover anchorRef={buttonRef} open={open} usePortal>
 *     ...menu items...
 *   </Popover>
 *
 * usePortal = false -> rendered right next to the button (position: absolute).
 *                      Any ancestor with overflow: hidden will CLIP it.
 * usePortal = true  -> rendered into document.body (position: fixed) at the
 *                      button's screen position. Nothing can clip it.
 *
 * For the portal version we measure the button with getBoundingClientRect()
 * in useLayoutEffect (before paint, so the menu never "jumps"), and again
 * whenever the page scrolls or resizes.
 * ----------------------------------------------------------------------------
 */
import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Popover({ anchorRef, open, usePortal = false, children }) {
  const [position, setPosition] = useState(null);

  // Measure the anchor button (only needed for the portal version)
  useLayoutEffect(() => {
    if (!open || !usePortal) return;

    function updatePosition() {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 6, left: rect.left }); // just below the button
    }
    updatePosition();

    // `true` = capture phase, so we also hear scrolls of inner scroll containers
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, usePortal, anchorRef]);

  if (!open) return null;

  // Inline version: lives inside the clipped container
  if (!usePortal) {
    return <div className="pt-popover pt-popover-inline">{children}</div>;
  }

  // Portal version: escapes to <body>
  if (!position) return null; // not measured yet
  return createPortal(
    <div className="pt-popover pt-popover-fixed" style={{ top: position.top, left: position.left }}>
      {children}
    </div>,
    document.body,
  );
}
