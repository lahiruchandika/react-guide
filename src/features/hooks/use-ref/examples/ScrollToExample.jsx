/**
 * ScrollToExample - scroll a container to a specific element
 * ----------------------------------------------------------------------------
 * Scenario: a team chat.
 *   - New messages auto-scroll the chat to the bottom (ref to the container).
 *   - "Jump to" buttons scroll to any message (a Map of refs, one per message).
 *
 * Refs to MANY elements: you can't call useRef in a loop (hooks rule!), so we
 * keep ONE ref holding a Map { id -> DOM node } and fill it with a "ref
 * callback":   ref={(node) => { map.set(id, node); return () => map.delete(id); }}
 * React 19: a ref callback may return a cleanup function, called on removal.
 *
 * We scroll the chat box itself (container.scrollTo) instead of using
 * element.scrollIntoView(), so the whole page doesn't jump.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import '../UseRefPage.css';

const AUTHORS = ['Maya', 'Leo', 'Priya'];
const INITIAL_MESSAGES = [
  'Morning team! Stand-up in 5?',
  'Yes - I pushed the login fix last night.',
  'Nice. Can someone review my PR?',
  'On it after the meeting.',
  'Reminder: design review at 3pm.',
  'Who broke the build? 😅',
  'Me. Fixed now, sorry!',
  'Lunch at the new taco place?',
  'Count me in 🌮',
  'Same!',
].map((text, i) => ({ id: i + 1, author: AUTHORS[i % AUTHORS.length], text }));

export default function ScrollToExample() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [highlightId, setHighlightId] = useState(null);

  const listRef = useRef(null); // the scrollable chat container
  const itemsRef = useRef(new Map()); // id -> <li> DOM node
  const isFirstRender = useRef(true); // a "flag" ref: no re-render needed

  // Scroll the container so the given element is near the top.
  function scrollToMessage(id) {
    const node = itemsRef.current.get(id);
    const list = listRef.current;
    if (!node || !list) return;
    list.scrollTo({ top: node.offsetTop - 8, behavior: 'smooth' });
    setHighlightId(id);
  }

  function scrollToBottom(behavior = 'smooth') {
    const list = listRef.current;
    list?.scrollTo({ top: list.scrollHeight, behavior });
  }

  // After a new message renders, scroll to the bottom (the DOM is ready in effects).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // skip the smooth animation on first load
      scrollToBottom('instant');
      return;
    }
    scrollToBottom();
  }, [messages.length]);

  // Remove the highlight after a moment (with cleanup in case it changes again).
  useEffect(() => {
    if (highlightId === null) return;
    const id = setTimeout(() => setHighlightId(null), 1200);
    return () => clearTimeout(id);
  }, [highlightId]);

  function handleSend(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: prev.length + 1, author: 'You', text: draft.trim() }]);
    setDraft('');
  }

  return (
    <div className="ur-chat-layout">
      <div className="ur-chat">
        <ul className="ur-chat-list" ref={listRef}>
          {messages.map((m) => (
            <li
              key={m.id}
              // Ref callback: store this node in the Map, remove it on unmount.
              ref={(node) => {
                itemsRef.current.set(m.id, node);
                return () => itemsRef.current.delete(m.id);
              }}
              className={`ur-msg ${m.author === 'You' ? 'mine' : ''} ${highlightId === m.id ? 'highlight' : ''}`}
            >
              <span className="ur-msg-author">
                #{m.id} · {m.author}
              </span>
              {m.text}
            </li>
          ))}
        </ul>
        <form className="ur-chat-form" onSubmit={handleSend}>
          <input placeholder="Write a message..." value={draft} onChange={(e) => setDraft(e.target.value)} />
          <Button type="submit" size="sm" icon={<Send />} disabled={!draft.trim()}>
            Send
          </Button>
        </form>
      </div>

      <div className="stack">
        <strong className="small">Jump to message</strong>
        <div className="ur-jump">
          {messages.map((m) => (
            <button key={m.id} type="button" className="ur-jump-btn" onClick={() => scrollToMessage(m.id)}>
              #{m.id}
            </button>
          ))}
        </div>
        <div className="row">
          <Button variant="secondary" size="sm" icon={<ArrowUp />} onClick={() => scrollToMessage(messages[0].id)}>
            Top
          </Button>
          <Button variant="secondary" size="sm" icon={<ArrowDown />} onClick={() => scrollToBottom()}>
            Bottom
          </Button>
        </div>
      </div>
    </div>
  );
}
