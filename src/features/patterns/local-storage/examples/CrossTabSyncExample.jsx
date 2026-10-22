/**
 * CrossTabSyncExample - keep several browser tabs in sync with the 'storage' event.
 * ----------------------------------------------------------------------------
 * When one tab changes localStorage, the browser fires a 'storage' event in
 * every OTHER tab of the same website (not in the tab that made the change).
 *
 *   window.addEventListener('storage', (event) => {
 *     event.key       // which key changed (null after clear())
 *     event.newValue  // the new string value (null if removed)
 *     event.oldValue  // the previous value
 *   });
 *
 * The custom hook below listens for that event and updates React state.
 * Open this page in a second tab, type here, and watch the other tab update.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { Badge } from '@/components/ui';

const NOTE_KEY = 'react-guide:shared-note';

/**
 * useSyncedNote - state saved in localStorage AND synced across tabs.
 * (Feature-specific hook, so it lives next to the feature that uses it.)
 */
function useSyncedNote(key, initialValue) {
  // 1. Read the saved value once (lazy initializer).
  const [note, setNote] = useState(() => localStorage.getItem(key) ?? initialValue);
  const [events, setEvents] = useState([]); // log of events from other tabs

  // 2. Listen for changes made by OTHER tabs.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key && event.key !== null) return; // ignore other keys
      setNote(event.newValue ?? initialValue); // null = removed/cleared
      setEvents((prev) => [{ id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), value: event.newValue }, ...prev].slice(0, 5));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage); // cleanup on unmount
  }, [key, initialValue]);

  // 3. Our own changes: update state AND storage (this fires the event in other tabs).
  const updateNote = (value) => {
    setNote(value);
    localStorage.setItem(key, value);
  };

  return [note, updateNote, events];
}

export default function CrossTabSyncExample() {
  const [note, setNote, events] = useSyncedNote(NOTE_KEY, 'Type something here, then open a second tab...');

  return (
    <div className="grid-2">
      <div className="stack">
        <label className="field-label" htmlFor="ls-note">Shared sticky note</label>
        <textarea id="ls-note" className="textarea ls-note" rows={6} value={note} onChange={(e) => setNote(e.target.value)} />
        <a className="row small" href={window.location.href} target="_blank" rel="noreferrer">
          <ExternalLink size={14} /> Open this lesson in a new tab
        </a>
      </div>

      <div className="stack">
        <strong className="row"><Radio size={16} /> &apos;storage&apos; events received</strong>
        {events.length === 0 ? (
          <p className="muted small">No events yet. Edit the note in ANOTHER tab - events never fire in the tab that made the change.</p>
        ) : (
          <ul className="ls-events">
            {events.map((ev) => (
              <li key={ev.id}>
                <Badge tone="info">{ev.time}</Badge>
                <span className="ls-events-value">{ev.value ?? '(removed)'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
