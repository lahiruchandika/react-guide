/**
 * StaleClosureExample.jsx
 * ----------------------------------------------------------------------------
 * Dependency array pitfalls: the "stale closure".
 *
 * A function "remembers" (closes over) the variables from the render in which
 * it was created. useCallback with [] keeps the FIRST function forever, so it
 * keeps seeing the FIRST values of state too.
 *
 *   ❌ useCallback(() => send(message), [])          always sends the old message
 *   ✅ useCallback(() => send(message), [message])   new function when message changes
 *   ✅ useCallback(() => setCount(c => c + 1), [])   updater form needs no deps
 *
 * Try it: type a message, then press each "Send" button and read the log.
 * Tip: the ESLint rule "react-hooks/exhaustive-deps" warns you about this.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Input } from '@/components/ui';

let nextLogId = 1; // simple unique id for log entries (used as React key)

export default function StaleClosureExample() {
  const [message, setMessage] = useState('Hello');
  const [log, setLog] = useState([]);

  // Helper that adds a line to the log (newest first, max 6 lines).
  const addLog = useCallback((type, text) => {
    setLog((prev) => [{ id: nextLogId++, type, text }, ...prev].slice(0, 6));
  }, []);

  // ❌ BUG: `message` is used inside but missing from the dependency array.
  //    This function was created during the FIRST render, when message was "Hello".
  //    (The ESLint hooks plugin would show a warning on this line - listen to it!)
  const sendStale = useCallback(() => addLog('bad', `deps [] sent: "${message}"`), []);

  // ✅ FIX: list every value the function reads. A new function is created
  //    whenever `message` changes, so it always sees the latest value.
  const sendFresh = useCallback(() => addLog('good', `deps [message] sent: "${message}"`), [message, addLog]);

  return (
    <div className="grid-2">
      <div className="stack">
        <Input label="Chat message" value={message} onChange={(e) => setMessage(e.target.value)} hint="Change the text, then press both buttons." />
        <div className="row">
          <Button variant="danger" icon={<Send size={16} />} onClick={sendStale}>
            Send (deps [])
          </Button>
          <Button icon={<Send size={16} />} onClick={sendFresh}>
            Send (deps [message])
          </Button>
        </div>
        <p className="small muted" style={{ margin: 0 }}>
          The red button always sends <b>"Hello"</b> - the value from the first render - no matter what you type.
        </p>
      </div>

      {/* Log panel */}
      <div className="uc-log">
        <span className="box-label">Sent messages</span>
        {log.length === 0 && <span className="small">Nothing sent yet.</span>}
        {log.map((entry) => (
          <div key={entry.id} className={`uc-log-line ${entry.type}`}>
            {entry.type === 'bad' ? '✗ stale  ' : '✓ fresh  '}
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}
