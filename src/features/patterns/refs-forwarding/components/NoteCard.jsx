/**
 * NoteCard - uses a CALLBACK REF with a CLEANUP function (new in React 19).
 * ----------------------------------------------------------------------------
 * A ref doesn't have to be a useRef object. It can be a FUNCTION:
 *
 *     <textarea ref={(node) => { ...node is the DOM element... }} />
 *
 * React calls it with the DOM node when the element is attached.
 * NEW in React 19: the function may RETURN a cleanup, which React calls when
 * the element is removed - just like a useEffect cleanup:
 *
 *     ref={(node) => {
 *       const observer = new ResizeObserver(...);
 *       observer.observe(node);
 *       return () => observer.disconnect();   // runs on detach
 *     }}
 *
 * Here each card watches its own size with a ResizeObserver.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { X } from 'lucide-react';

export default function NoteCard({ note, onRemove, onLog }) {
  const [size, setSize] = useState(null);

  // useCallback keeps the ref function the SAME between renders.
  // If it changed every render, React would detach + re-attach it each time.
  const measureRef = useCallback(
    (node) => {
      onLog(`attach  → "${note.title}"`);

      // Watch the element's size; fires once immediately, then on every resize
      const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ width: Math.round(width), height: Math.round(height) });
      });
      observer.observe(node);

      // React 19: returned function = cleanup, called when the node is removed
      return () => {
        observer.disconnect();
        onLog(`detach  → "${note.title}" (observer disconnected)`);
      };
    },
    [note.title, onLog],
  );

  return (
    <div className="rf-note">
      <div className="row rf-between">
        <strong className="small">{note.title}</strong>
        <button type="button" className="rf-icon-btn" onClick={() => onRemove(note.id)} aria-label={`Remove ${note.title}`}>
          <X size={14} />
        </button>
      </div>
      {/* Drag the textarea's corner to resize it and watch the numbers change */}
      <textarea ref={measureRef} className="rf-textarea" defaultValue={note.text} rows={3} />
      <span className="rf-size">{size ? `${size.width} × ${size.height}px` : 'measuring...'}</span>
    </div>
  );
}
