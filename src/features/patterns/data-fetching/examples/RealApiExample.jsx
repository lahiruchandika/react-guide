/**
 * RealApiExample - calling a REAL public API with a fallback.
 * ----------------------------------------------------------------------------
 * API: https://jsonplaceholder.typicode.com (free fake REST API)
 *
 *   const res = await fetch(url, { signal });
 *   if (!res.ok) throw new Error(...);   // fetch does NOT throw on 404 / 500!
 *   const data = await res.json();       // parse the JSON body
 *
 * If the request fails (offline, blocked, too slow > 5s) we fall back to the
 * local mockApi so the demo always works. A badge shows where data came from.
 *
 * This example also shows the second way to avoid stale updates: an
 * "ignore" flag (`cancelled`) set in the cleanup - useful for promises that
 * can't be aborted.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Cloud, HardDrive, WifiOff } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { USERS, mockApi } from '@/services/mockApi';

const API_URL = 'https://jsonplaceholder.typicode.com';
const TIMEOUT_MS = 5000;

export default function RealApiExample() {
  const [userId, setUserId] = useState(1);
  const [forceOffline, setForceOffline] = useState(false);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'live' | 'fallback' | 'error'
  const [reason, setReason] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false; // the "ignore" flag
    // Give up on the real API after 5 seconds
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    async function load() {
      setStatus('loading');
      try {
        if (forceOffline) throw new Error('Simulated offline mode');

        // 1. Real HTTP request
        const res = await fetch(`${API_URL}/posts?userId=${userId}`, { signal: controller.signal });
        // 2. Check the HTTP status ourselves
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // 3. Parse the JSON body
        const data = await res.json();

        if (cancelled) return; // a newer effect took over - ignore this result
        setPosts(data.slice(0, 4));
        setStatus('live');
      } catch (err) {
        if (cancelled) return; // unmounted or userId changed - do nothing

        // 4. Fallback: load the same kind of data from the local mock API
        setReason(err.name === 'AbortError' ? `timed out after ${TIMEOUT_MS / 1000}s` : err.message);
        try {
          const data = await mockApi.getPosts({ userId, delay: 400 });
          if (cancelled) return;
          setPosts(data);
          setStatus('fallback');
        } catch (fallbackErr) {
          if (!cancelled) {
            setReason(fallbackErr.message);
            setStatus('error');
          }
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    load();

    return () => {
      cancelled = true; // ignore any result that arrives later
      controller.abort(); // and cancel the real network request
      clearTimeout(timeoutId);
    };
  }, [userId, forceOffline]);

  return (
    <div className="stack">
      <div className="row df-between">
        <div className="row">
          {USERS.slice(0, 3).map((user) => (
            <Button
              key={user.id}
              size="sm"
              variant={user.id === userId ? 'primary' : 'secondary'}
              onClick={() => setUserId(user.id)}
            >
              User {user.id}
            </Button>
          ))}
        </div>
        <label className="row small">
          <input type="checkbox" checked={forceOffline} onChange={(e) => setForceOffline(e.target.checked)} />
          <WifiOff size={14} /> Simulate offline
        </label>
      </div>

      {/* Where did the data come from? */}
      <div className="row">
        {status === 'loading' && <Badge tone="info"><Spinner size={10} /> fetching...</Badge>}
        {status === 'live' && <Badge tone="success"><Cloud size={12} /> Live: jsonplaceholder.typicode.com</Badge>}
        {status === 'fallback' && <Badge tone="warning"><HardDrive size={12} /> Fallback: local mockApi</Badge>}
        {status === 'error' && <Badge tone="danger">Failed</Badge>}
        {(status === 'fallback' || status === 'error') && <span className="small muted">Reason: {reason}</span>}
        <code className="small">GET /posts?userId={userId}</code>
      </div>

      <ul className={`df-api-posts ${status === 'loading' ? 'is-loading' : ''}`}>
        {posts.map((post) => (
          <li key={post.id}>
            <span className="df-api-id">#{post.id}</span>
            <div>
              <strong>{post.title}</strong>
              <p className="muted small">{post.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
