/**
 * ToastContext - lets ANY component inside <ToastProvider> show a toast:
 *
 *   const toast = useToast();
 *   toast({ type: 'success', title: 'Saved!', message: 'Your changes are live.' });
 *
 * Kept in its own file (no components here) so Vite's Fast Refresh keeps
 * working for the component files.
 */
import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error('useToast() must be used inside <ToastProvider>');
  return toast;
}
