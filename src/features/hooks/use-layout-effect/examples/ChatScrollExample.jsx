/**
 * ChatScrollExample
 * ----------------------------------------------------------------------------
 * A chat window that always keeps the newest message in view.
 *
 * After a new message is rendered, the list is taller. We read its new
 * scrollHeight and scroll to the bottom in useLayoutEffect, BEFORE paint,
 * so the user never sees the list "jump" (new message hidden, then scrolled).
 *
 * The bot reply uses a timer with a cleanup function, so it is safe under
 * StrictMode and when the component unmounts.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui';

const BOT_REPLIES = [
  'Nice! useLayoutEffect scrolled me into view before paint.',
  'Try sending a few more - the list always stays at the bottom.',
  'Fun fact: scrollTop = scrollHeight jumps to the very end.',
  'useLayoutEffect blocks painting, so keep the work inside it short.',
];

let nextId = 3; // simple id generator for new messages (module scope, survives re-renders)

export default function ChatScrollExample() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! Send me a message.' },
    { id: 2, from: 'bot', text: 'I will reply, and the chat will auto-scroll.' },
  ]);
  const [draft, setDraft] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const listRef = useRef(null); // the scrollable <ul>

  // 1. Every time the messages change -> scroll to the bottom BEFORE paint.
  useLayoutEffect(() => {
    const list = listRef.current;
    list.scrollTop = list.scrollHeight; // read layout + write scroll in one go
  }, [messages, botTyping]);

  // 2. Bot reply: when the LAST message is from the user, answer after 900ms.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last.from !== 'user') return;

    setBotTyping(true);
    const timer = setTimeout(() => {
      const text = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      const reply = { id: nextId++, from: 'bot', text }; // build it OUTSIDE the updater (updaters must be pure)
      setMessages((prev) => [...prev, reply]);
      setBotTyping(false);
    }, 900);

    // Cleanup: cancel the reply if messages change again or we unmount
    return () => clearTimeout(timer);
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const message = { id: nextId++, from: 'user', text: draft.trim() };
    setMessages((prev) => [...prev, message]); // updater form: always based on the latest list
    setDraft('');
  };

  return (
    <div className="ule-chat">
      <ul ref={listRef} className="ule-chat-list">
        {messages.map((m) => (
          <li key={m.id} className={`ule-msg ule-msg-${m.from}`}>
            {m.text}
          </li>
        ))}
        {botTyping && <li className="ule-msg ule-msg-bot ule-typing">typing...</li>}
      </ul>

      <form className="ule-chat-form" onSubmit={send}>
        <input
          className="field-input"
          placeholder="Type a message and press Enter"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Message"
        />
        <Button type="submit" icon={<Send size={14} />} disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
