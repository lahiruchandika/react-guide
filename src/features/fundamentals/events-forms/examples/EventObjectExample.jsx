/**
 * EventObjectExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: the event object in detail.
 *
 *   A) Keyboard events: e.key, e.code, e.ctrlKey/e.shiftKey, and
 *      e.preventDefault() to block a key from being typed.
 *   B) Event bubbling: a click on an inner element ALSO triggers onClick
 *      on its parents. e.stopPropagation() stops it from going further up.
 *
 * React wraps the browser event in a "SyntheticEvent" that works the same in
 * every browser. The real browser event is still available as e.nativeEvent.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Badge, Button } from '@/components/ui';

export default function EventObjectExample() {
  // ---------- A) keyboard ----------
  const [lastKey, setLastKey] = useState(null);
  const [text, setText] = useState('');
  const [blockDigits, setBlockDigits] = useState(true);

  function handleKeyDown(e) {
    // Save some details of the event object so we can display them
    setLastKey({ key: e.key, code: e.code, shift: e.shiftKey, ctrl: e.ctrlKey || e.metaKey });

    // preventDefault() cancels the browser's default action (typing the char)
    if (blockDigits && /^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  }

  // ---------- B) bubbling ----------
  const [stop, setStop] = useState(false);
  const [path, setPath] = useState([]);

  // Each box calls this with its own name. The order shows how events bubble.
  function handleBoxClick(name, e) {
    if (name === 'inner') setPath([]); // a fresh click starts a new trail
    setPath((prev) => [...prev, name]);
    if (stop && name === 'inner') {
      e.stopPropagation(); // the parents' onClick will NOT run
    }
  }

  return (
    <div className="grid-2">
      {/* A) Keyboard */}
      <div className="stack">
        <span className="box-label">A) onKeyDown + preventDefault</span>
        <input
          className="field-input"
          placeholder="Type here… (try some numbers)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <label className="row small">
          <input type="checkbox" checked={blockDigits} onChange={(e) => setBlockDigits(e.target.checked)} />
          Block digits with <code>e.preventDefault()</code>
        </label>

        <div className="ef-keys">
          {/* the space key is " ", so show a readable label for it */}
          <div><span className="muted small">e.key</span><kbd>{lastKey?.key === ' ' ? 'Space' : lastKey?.key ?? '—'}</kbd></div>
          <div><span className="muted small">e.code</span><kbd>{lastKey?.code ?? '—'}</kbd></div>
          <div><span className="muted small">e.shiftKey</span><Badge tone={lastKey?.shift ? 'success' : 'neutral'}>{String(!!lastKey?.shift)}</Badge></div>
          <div><span className="muted small">e.ctrlKey</span><Badge tone={lastKey?.ctrl ? 'success' : 'neutral'}>{String(!!lastKey?.ctrl)}</Badge></div>
        </div>
      </div>

      {/* B) Bubbling */}
      <div className="stack">
        <span className="box-label">B) bubbling & stopPropagation</span>
        {/* Click handlers on three nested elements */}
        <div className="ef-bubble ef-bubble-outer" onClick={(e) => handleBoxClick('outer', e)}>
          outer
          <div className="ef-bubble ef-bubble-middle" onClick={(e) => handleBoxClick('middle', e)}>
            middle
            <button type="button" className="ef-bubble ef-bubble-inner" onClick={(e) => handleBoxClick('inner', e)}>
              click me (inner)
            </button>
          </div>
        </div>

        <div className="row">
          <label className="row small">
            <input type="checkbox" checked={stop} onChange={(e) => setStop(e.target.checked)} />
            call <code>e.stopPropagation()</code> in inner
          </label>
          <Button size="sm" variant="ghost" onClick={() => setPath([])}>Reset</Button>
        </div>

        <div className="row">
          <span className="small muted">Handlers that ran:</span>
          {path.length === 0 && <span className="small muted">none yet</span>}
          {path.map((name, i) => (
            // index key is fine here: the list is only ever appended/reset
            <Badge key={i} tone="primary">{i + 1}. {name}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
