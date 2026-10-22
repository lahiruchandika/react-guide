/**
 * Modal - a reusable, accessible dialog rendered with createPortal.
 * ----------------------------------------------------------------------------
 *   <Modal open={isOpen} onClose={() => setOpen(false)} title="Delete project?"
 *          footer={<Button onClick={...}>Delete</Button>}>
 *     Are you sure?
 *   </Modal>
 *
 * createPortal(jsx, domNode) renders `jsx` into `domNode` (here document.body)
 * instead of inside the parent's DOM element. In the React tree the modal is
 * STILL a child of the component that renders it (props, state, context and
 * events work normally) - only its DOM position changes.
 *
 * Features: backdrop click to close, Escape key, focus moves into the dialog
 * on open and back to the trigger button on close, Tab is trapped inside,
 * and page scrolling is locked while it is open.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Elements that can receive keyboard focus
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const dialogRef = useRef(null);
  const titleId = useId(); // connects aria-labelledby with the <h3>

  // Keep the LATEST onClose in a ref. This way the effect below does not need
  // onClose as a dependency (parents often pass a new arrow function on every
  // render, which would otherwise re-run the effect and steal focus each time).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    // 1. Remember what had focus (usually the "Open" button) to restore it later
    const previouslyFocused = document.activeElement;

    // 2. Move focus into the dialog (first focusable element, or the dialog itself)
    const dialog = dialogRef.current;
    const first = dialog.querySelector(FOCUSABLE);
    (first ?? dialog).focus();

    // 3. Keyboard: Escape closes, Tab stays inside the dialog (focus trap)
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key === 'Tab') {
        const items = [...dialog.querySelectorAll(FOCUSABLE)];
        if (items.length === 0) return;
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus(); // wrap backwards
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus(); // wrap forwards
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // 4. Lock page scroll behind the modal
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 5. Cleanup - runs when the modal closes or unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.(); // give focus back to the trigger
    };
  }, [open]);

  // Closed? Render nothing at all.
  if (!open) return null;

  // 6. The portal: this JSX is placed as a direct child of <body>
  return createPortal(
    <div
      className="pt-backdrop"
      // Close only when the backdrop itself is clicked, not the dialog inside it
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        className={`pt-modal pt-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="pt-modal-header">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="pt-icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </header>
        <div className="pt-modal-body">{children}</div>
        {footer && <footer className="pt-modal-footer">{footer}</footer>}
      </div>
    </div>,
    document.body, // <- WHERE to render
  );
}
