/**
 * CancelOnUnmountExample - cancel a request when the component disappears.
 * ----------------------------------------------------------------------------
 * The user opens a panel that loads slowly (3 seconds), then closes it before
 * the data arrives. Without cleanup the request keeps running and then tries
 * to update a component that no longer exists (wasted work, possible bugs).
 *
 * With `return () => controller.abort()` the request is cancelled the moment
 * the component unmounts. Watch the log: "aborted - component unmounted".
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { mockApi } from '@/services/mockApi';
import LogPanel from '../components/LogPanel';
import { useEventLog } from '../hooks/useEventLog';

/** A child component that fetches its own data when it mounts. */
function SlowPostsPanel({ log }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    log('mounted -> request started (3s)', 'start');

    mockApi
      .getPosts({ signal: controller.signal, delay: 3000 })
      .then((data) => {
        setPosts(data.slice(0, 4));
        log('response received -> rendered', 'success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') log('aborted - component unmounted', 'abort');
        else log(err.message, 'error');
      });

    // Runs when the component is removed from the screen (unmount)
    return () => controller.abort();
  }, [log]);

  if (!posts) {
    return (
      <div className="df-panel row muted">
        <Spinner /> Loading latest posts (3 seconds)...
      </div>
    );
  }

  return (
    <ul className="df-panel df-post-list">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default function CancelOnUnmountExample() {
  const [isOpen, setIsOpen] = useState(false);
  const { entries, log, clear } = useEventLog(8);

  return (
    <div className="grid-2">
      <div className="stack">
        <Button
          variant={isOpen ? 'secondary' : 'primary'}
          icon={isOpen ? <EyeOff size={14} /> : <Eye size={14} />}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Hide panel (unmount)' : 'Show panel (mount)'}
        </Button>
        {/* Conditional rendering mounts / unmounts the child */}
        {isOpen ? <SlowPostsPanel log={log} /> : <div className="df-panel muted small">Panel is unmounted.</div>}
        <p className="small muted">Show the panel, then hide it before the 3 seconds are over.</p>
      </div>
      <LogPanel entries={entries} onClear={clear} />
    </div>
  );
}
