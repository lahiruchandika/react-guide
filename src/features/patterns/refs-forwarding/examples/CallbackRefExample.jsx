/**
 * CallbackRefExample - callback refs that clean up after themselves (React 19).
 * ----------------------------------------------------------------------------
 * Every <NoteCard> attaches a ResizeObserver to its textarea in a callback ref
 * and returns a cleanup that disconnects it. Add and remove notes and watch
 * the log: "attach" when a card appears, "detach" when it disappears.
 *
 * Note: in development <StrictMode> attaches, detaches and re-attaches each
 * ref once on mount to check your cleanup works - so you may see an extra
 * attach/detach pair. That's expected and doesn't happen in production.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import NoteCard from '../components/NoteCard';

let nextId = 3; // module-level id counter for new notes
let nextLogId = 0; // unique keys for log lines

export default function CallbackRefExample() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Groceries', text: 'Milk, eggs, coffee' },
    { id: 2, title: 'Ideas', text: 'Build a React quiz app' },
  ]);
  const [log, setLog] = useState([]);

  // Stable function (useCallback) because NoteCard's ref callback depends on it
  const addLog = useCallback((text) => {
    setLog((prev) => [{ id: nextLogId++, text }, ...prev].slice(0, 6));
  }, []);

  const addNote = () => {
    const id = nextId++;
    setNotes((prev) => [...prev, { id, title: `Note #${id}`, text: 'Resize me from the corner ↘' }]);
  };
  const removeNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="stack">
      <div className="row">
        <Button size="sm" icon={<Plus />} onClick={addNote}>Add note</Button>
        <span className="muted small">{notes.length} note(s) - each one owns a ResizeObserver</span>
      </div>

      <div className="rf-notes">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onRemove={removeNote} onLog={addLog} />
        ))}
      </div>

      <div className="rf-log">
        <div className="rf-log-title">Ref callback log</div>
        {log.map((line) => (
          <div key={line.id} className="rf-log-line">{line.text}</div>
        ))}
      </div>
    </div>
  );
}
