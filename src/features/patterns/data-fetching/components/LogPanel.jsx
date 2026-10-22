/**
 * LogPanel - shows a list of request events (started, finished, aborted...).
 * Pure presentational component: it only renders the `entries` prop.
 */
import { Eraser } from 'lucide-react';

export default function LogPanel({ title = 'Request log', entries, onClear }) {
  return (
    <div className="df-log">
      <div className="df-log-header">
        <span>{title}</span>
        {onClear && (
          <button type="button" className="df-log-clear" onClick={onClear} aria-label="Clear log">
            <Eraser size={13} /> clear
          </button>
        )}
      </div>
      <ul className="df-log-list">
        {entries.length === 0 && <li className="df-log-empty">No events yet.</li>}
        {entries.map((entry) => (
          <li key={entry.id} className={`df-log-item df-log-${entry.type}`}>
            <span className="df-log-dot" />
            <span className="df-log-time">{entry.time}</span>
            <span>{entry.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
