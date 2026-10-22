/**
 * Toast - one notification. It removes itself after `duration` ms.
 * Hovering pauses the timer (so the user has time to read it), and leaving
 * resumes it with the time that was left.
 *
 * Each toast owns its timer in a useEffect with a cleanup: if the toast is
 * closed early (or the component unmounts) the timer is cancelled.
 */
import { useEffect, useRef, useState } from 'react';
import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';

const ICONS = { success: CircleCheck, error: CircleAlert, warning: TriangleAlert, info: Info };

export default function Toast({ toast, onDismiss }) {
  const [paused, setPaused] = useState(false);
  const Icon = ICONS[toast.type] ?? Info;

  // How much time is left. A ref, because changing it should NOT re-render.
  const remaining = useRef(toast.duration);

  useEffect(() => {
    if (paused) return; // no timer while the mouse is over the toast
    const startedAt = Date.now();
    const id = setTimeout(() => onDismiss(toast.id), remaining.current);

    // cleanup: runs on pause, dismiss or unmount
    return () => {
      clearTimeout(id);
      remaining.current -= Date.now() - startedAt; // remember the time already used
    };
  }, [paused, toast.id, onDismiss]);

  return (
    <div
      className={`pt-toast pt-toast-${toast.type}`}
      role="status"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Icon size={18} className="pt-toast-icon" />
      <div className="pt-grow">
        <strong>{toast.title}</strong>
        {toast.message && <div className="small muted">{toast.message}</div>}
      </div>
      <button type="button" className="pt-icon-btn" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
        <X size={14} />
      </button>
      {/* Progress bar shrinking over `duration`; animation pauses on hover */}
      <span
        className="pt-toast-progress"
        style={{ animationDuration: `${toast.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </div>
  );
}
