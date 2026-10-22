/**
 * StorageViewer - shows every key/value currently in localStorage as a table.
 *
 * It is a "presentational" component: it receives the entries as a prop and
 * just renders them. The parent decides when to re-read localStorage.
 *
 * Props:
 *   entries    array of { key, value } objects
 *   highlight  optional key to highlight (e.g. the key you just changed)
 *   onRemove   optional callback(key) - shows a small delete button per row
 */
import { Trash2 } from 'lucide-react';

export default function StorageViewer({ entries, highlight, onRemove }) {
  if (entries.length === 0) {
    return <div className="ls-viewer-empty muted small">localStorage is empty.</div>;
  }

  return (
    <div className="ls-viewer">
      {entries.map(({ key, value }) => (
        <div key={key} className={`ls-viewer-row ${key === highlight ? 'is-highlight' : ''}`}>
          <code className="ls-viewer-key">{key}</code>
          {/* Long values are cut with CSS (text-overflow: ellipsis); hover shows all */}
          <span className="ls-viewer-value" title={value}>{value}</span>
          {onRemove && (
            <button type="button" className="ls-icon-btn" onClick={() => onRemove(key)} aria-label={`Remove ${key}`}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
