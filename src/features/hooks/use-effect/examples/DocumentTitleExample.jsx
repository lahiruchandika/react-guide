/**
 * DocumentTitleExample - sync React state with something OUTSIDE React
 * ----------------------------------------------------------------------------
 * The browser tab title (document.title) is not part of React's JSX output.
 * Keeping it in sync with state is a classic "side effect".
 *
 *   useEffect(() => {
 *     document.title = `(${unread}) Inbox`;
 *   }, [unread]);              // re-sync only when `unread` changes
 *
 * Scenario: a mini inbox. Receive or read messages and look at the browser tab.
 * Turn on "Sync document.title", then receive or read messages and watch the tab.
 * The cleanup restores the original title when you turn sync off or leave.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Mail, MailOpen, Bell } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import '../UseEffectPage.css';

const SENDERS = ['Alice', 'Bob', 'Carmen', 'Dmitri', 'Eve', 'Farah'];

export default function DocumentTitleExample() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Alice', read: false },
    { id: 2, from: 'Bob', read: true },
  ]);
  // Starts OFF on purpose: effects run child-first, parent-last. The lesson page
  // (our parent) also sets document.title on mount, so it would overwrite ours.
  // Turning sync on with the checkbox runs our effect AFTER the page's effect.
  const [enabled, setEnabled] = useState(false);

  // Derived value used by the effect.
  const unread = messages.filter((m) => !m.read).length;

  useEffect(() => {
    if (!enabled) return; // effects can exit early (no cleanup needed then)

    // 1. Remember the title that was there before us...
    const previousTitle = document.title;
    // 2. ...apply ours (the side effect)...
    document.title = unread > 0 ? `(${unread}) New messages · React Guide` : 'Inbox zero · React Guide';
    // 3. ...and put the old one back before the next run / on unmount.
    return () => {
      document.title = previousTitle;
    };
  }, [unread, enabled]); // every value from the component used inside is listed

  function receive() {
    setMessages((prev) => [
      { id: Date.now(), from: SENDERS[prev.length % SENDERS.length], read: false },
      ...prev,
    ]);
  }

  function markAllRead() {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="ue-tab-preview">
          <span className="ue-tab-dot" />
          <span className="ue-tab-title">
            {enabled
              ? unread > 0
                ? `(${unread}) New messages · React Guide`
                : 'Inbox zero · React Guide'
              : '(sync is off - turn it on below)'}
          </span>
        </div>
        <p className="muted small">
          {enabled ? '↑ This is what your real browser tab shows right now.' : '↑ While sync is off, the tab keeps the lesson title.'}
        </p>
        <div className="row">
          <Button icon={<Bell />} onClick={receive}>Receive message</Button>
          <Button variant="secondary" onClick={markAllRead} disabled={unread === 0}>Mark all read</Button>
        </div>
        <label className="ue-switch">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span>Sync document.title</span>
        </label>
      </div>

      <div className="ue-inbox">
        <div className="row ue-spread">
          <strong>Inbox</strong>
          <Badge tone={unread ? 'danger' : 'success'}>{unread} unread</Badge>
        </div>
        <ul className="ue-inbox-list">
          {messages.map((m) => (
            <li key={m.id} className={m.read ? 'read' : ''}>
              {m.read ? <MailOpen size={16} /> : <Mail size={16} />}
              <span>Message from {m.from}</span>
              {!m.read && (
                <button
                  type="button"
                  className="ue-link-btn"
                  onClick={() => setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)))}
                >
                  mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
