/**
 * RawStorageExample - the plain localStorage API, no React magic.
 * ----------------------------------------------------------------------------
 *   localStorage.setItem(key, value)  save (value is converted to a string!)
 *   localStorage.getItem(key)         read  -> string, or null if missing
 *   localStorage.removeItem(key)      delete one key
 *   localStorage.clear()              delete EVERYTHING for this website
 *   localStorage.length / .key(i)     count and list the keys
 *
 * localStorage is NOT React state: changing it does not re-render anything.
 * That's why we copy its contents into state (`entries`) and refresh after
 * each operation - then the viewer on the right updates.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Database, Download, Eraser, Save, Trash2 } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import StorageViewer from '../components/StorageViewer';

/** Reads every key/value pair from localStorage into an array. */
function readAllEntries() {
  const entries = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); // key at position i
    entries.push({ key, value: localStorage.getItem(key) });
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

export default function RawStorageExample() {
  const [key, setKey] = useState('demo:username');
  const [value, setValue] = useState('Ada Lovelace');
  const [entries, setEntries] = useState(readAllEntries); // lazy init: read once on mount
  const [lastResult, setLastResult] = useState('Try one of the buttons above.');
  const [confirmClear, setConfirmClear] = useState(false);

  // After every operation, copy localStorage into state so React re-renders.
  const refresh = () => setEntries(readAllEntries());

  const handleSet = () => {
    localStorage.setItem(key, value); // 1. save
    setLastResult(`setItem('${key}', '${value}') -> saved`);
    refresh();
  };

  const handleGet = () => {
    const result = localStorage.getItem(key); // 2. read (null if missing)
    setLastResult(`getItem('${key}') -> ${result === null ? 'null' : `'${result}'`}`);
  };

  const handleRemove = (k = key) => {
    localStorage.removeItem(k); // 3. delete one key
    setLastResult(`removeItem('${k}') -> removed`);
    refresh();
  };

  const handleClear = () => {
    // clear() wipes ALL keys of this site (including the app's saved theme),
    // so we ask for a second click first.
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    localStorage.clear(); // 4. delete everything
    setConfirmClear(false);
    setLastResult('clear() -> every key removed');
    refresh();
  };

  return (
    <div className="grid-2">
      <div className="stack">
        <Input label="Key" value={key} onChange={(e) => setKey(e.target.value)} />
        <Input label="Value" value={value} onChange={(e) => setValue(e.target.value)} />

        <div className="row">
          <Button icon={<Save size={14} />} onClick={handleSet} disabled={!key}>setItem</Button>
          <Button variant="secondary" icon={<Download size={14} />} onClick={handleGet} disabled={!key}>getItem</Button>
          <Button variant="secondary" icon={<Trash2 size={14} />} onClick={() => handleRemove()} disabled={!key}>removeItem</Button>
          <Button variant="danger" icon={<Eraser size={14} />} onClick={handleClear} onBlur={() => setConfirmClear(false)}>
            {confirmClear ? 'Click again to clear ALL' : 'clear()'}
          </Button>
        </div>

        {/* Result of the last call, shown like a console */}
        <div className="ls-console">
          <span className="ls-console-prompt">&gt;</span> {lastResult}
        </div>
      </div>

      <div className="stack">
        <div className="row ls-between">
          <strong className="row"><Database size={16} /> Live localStorage viewer</strong>
          <Badge tone="info">length: {entries.length}</Badge>
        </div>
        <StorageViewer entries={entries} highlight={key} onRemove={handleRemove} />
        <p className="muted small">
          Same data as DevTools -&gt; Application -&gt; Local Storage. Keys from other lessons appear here too.
        </p>
      </div>
    </div>
  );
}
