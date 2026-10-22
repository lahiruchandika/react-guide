/**
 * LogPanel - shows the entries written to a logger (see createLogger.js).
 * ----------------------------------------------------------------------------
 * The newest entry is shown at the top. Colors:
 *   effect  = green     cleanup = orange     render = blue     info = grey
 *
 *   <LogPanel logger={logger} title="Effect log" />
 * ----------------------------------------------------------------------------
 */
import { useSyncExternalStore } from 'react';
import { Trash2 } from 'lucide-react';

export default function LogPanel({ logger, title = 'Log', height = 220 }) {
  // Subscribe to the external logger. Re-renders ONLY this panel when it changes.
  const entries = useSyncExternalStore(logger.subscribe, logger.getSnapshot);

  return (
    <div className="ue-log">
      <div className="ue-log-header">
        <span>{title}</span>
        <button type="button" className="ue-log-clear" onClick={() => logger.clear()}>
          <Trash2 size={13} /> Clear
        </button>
      </div>
      <ol className="ue-log-list" style={{ height }}>
        {entries.length === 0 && <li className="ue-log-empty">No entries yet - interact with the demo.</li>}
        {entries.map((entry) => (
          <li key={entry.id} className={`ue-log-item ue-log-${entry.type}`}>
            <span className="ue-log-time">{entry.time}</span>
            <span className="ue-log-type">{entry.type}</span>
            <span className="ue-log-msg">{entry.message}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
