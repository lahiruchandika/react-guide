/**
 * ToastProvider - keeps the list of toasts and renders them in a PORTAL.
 * ----------------------------------------------------------------------------
 * - The toast list lives in state here.
 * - Children get a `toast()` function through context (React 19 lets us
 *   render <ToastContext value={...}> directly - no .Provider needed).
 * - The stack is rendered with createPortal into document.body, so toasts
 *   float above everything, fixed to the corner of the screen, no matter
 *   how deep in the page the provider sits.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './ToastContext';
import Toast from './Toast';

let nextId = 1;

export default function ToastProvider({ children, max = 4 }) {
  const [toasts, setToasts] = useState([]);

  // Add a toast (newest at the bottom, keep at most `max`)
  const toast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, title, message, duration }].slice(-max));
    },
    [max],
  );

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext value={toast}>
      {children}

      {/* The toast stack escapes to <body> */}
      {createPortal(
        <div className="pt-toasts" aria-live="polite">
          {toasts.map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext>
  );
}
