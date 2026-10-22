/**
 * ClickEventsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: handling mouse events.
 *
 *   <button onClick={handleClick}>             pass the function (no ())
 *   <button onClick={() => vote('yes')}>       wrap it to pass an argument
 *
 * - Event props are camelCase: onClick, onDoubleClick, onMouseEnter...
 * - React gives your handler an EVENT OBJECT (e) with details about the event:
 *   e.type, e.target, e.clientX / e.clientY, e.shiftKey ...
 *
 * Mini scenario: a feedback widget + a "hover/double-click" playground,
 * with a live log of every event React delivered.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart, MousePointerClick, Eraser } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

export default function ClickEventsExample() {
  const [votes, setVotes] = useState({ up: 0, love: 0, down: 0 });
  const [hovering, setHovering] = useState(false);
  const [log, setLog] = useState([]);

  // Push a line into the event log (newest first, keep last 6)
  function addLog(text) {
    const id = `${Date.now()}-${Math.random()}`; // unique id for the list key
    setLog((prev) => [{ id, text }, ...prev].slice(0, 6));
  }

  // 1. A handler that receives an ARGUMENT (which button) and the event object
  function handleVote(kind, e) {
    setVotes((prev) => ({ ...prev, [kind]: prev[kind] + 1 }));
    // e.shiftKey is true if Shift was held while clicking
    addLog(`${e.type} → vote "${kind}"${e.shiftKey ? ' (with Shift!)' : ''}`);
  }

  // 2. A handler used directly: React calls it with the event object
  function handleDoubleClick(e) {
    addLog(`${e.type} at x=${Math.round(e.clientX)}, y=${Math.round(e.clientY)}`);
  }

  return (
    <div className="grid-2">
      <div className="stack">
        <span className="box-label">onClick with an argument</span>
        <div className="row">
          {/* Arrow function so we can pass "up" AND forward the event */}
          <Button variant="secondary" icon={<ThumbsUp size={16} />} onClick={(e) => handleVote('up', e)}>
            {votes.up}
          </Button>
          <Button variant="secondary" icon={<Heart size={16} />} onClick={(e) => handleVote('love', e)}>
            {votes.love}
          </Button>
          <Button variant="secondary" icon={<ThumbsDown size={16} />} onClick={(e) => handleVote('down', e)}>
            {votes.down}
          </Button>
        </div>
        <p className="small muted">Tip: hold Shift while clicking to see e.shiftKey.</p>

        <span className="box-label">onMouseEnter / onMouseLeave / onDoubleClick</span>
        <div
          className={hovering ? 'ef-hover-zone active' : 'ef-hover-zone'}
          onMouseEnter={() => {
            setHovering(true);
            addLog('mouseenter');
          }}
          onMouseLeave={() => {
            setHovering(false);
            addLog('mouseleave');
          }}
          onDoubleClick={handleDoubleClick} // no () - React calls it later with the event
        >
          <MousePointerClick size={22} />
          <span>{hovering ? 'Mouse is inside! Try a double-click.' : 'Hover over me'}</span>
        </div>
      </div>

      {/* Event log panel */}
      <div className="ef-log">
        <div className="row ef-log-head">
          <span className="box-label">event log</span>
          <Badge tone="info">{log.length}</Badge>
          <Button size="sm" variant="ghost" icon={<Eraser size={14} />} onClick={() => setLog([])}>
            Clear
          </Button>
        </div>
        {log.length === 0 ? (
          <p className="muted small">Interact with the left side…</p>
        ) : (
          <ul>
            {log.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
