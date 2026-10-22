/**
 * UseFetchExample - loading data with ONE line thanks to a custom hook.
 * ----------------------------------------------------------------------------
 * Hook: src/hooks/useFetch.js
 *   const { data, error, loading, refetch } = useFetch(fetcher, deps);
 *
 * Without the hook, every component that loads data would repeat:
 * 3 useStates + a useEffect + AbortController + try/catch.
 *
 * Try it:
 *   - pick different authors (the old request is cancelled automatically)
 *   - switch on "Flaky server" so half the requests fail, then use Retry
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge, Button, Callout, Spinner } from '@/components/ui';
import { useFetch, useToggle } from '@/hooks';
import { USERS, mockApi } from '@/services/mockApi';

export default function UseFetchExample() {
  const [userId, setUserId] = useState(1);
  const [flaky, toggleFlaky] = useToggle(false); // custom hooks work great together

  // 1. All the fetching logic in one line. Re-fetches when userId or flaky changes.
  const { data: posts, error, loading, refetch } = useFetch(
    (signal) => mockApi.getPosts({ userId, signal, failRate: flaky ? 0.5 : 0 }),
    [userId, flaky],
  );

  return (
    <div className="stack">
      {/* Author picker */}
      <div className="row">
        {USERS.slice(0, 4).map((user) => (
          <Button
            key={user.id}
            size="sm"
            variant={user.id === userId ? 'primary' : 'secondary'}
            onClick={() => setUserId(user.id)}
          >
            {user.name.split(' ')[0]}
          </Button>
        ))}
      </div>

      <div className="row ch-between">
        <label className="row small">
          <input type="checkbox" checked={flaky} onChange={toggleFlaky} /> Flaky server (50% of requests fail)
        </label>
        <div className="row">
          {/* 2. Show the current status from the hook */}
          <Badge tone={loading ? 'info' : error ? 'danger' : 'success'}>
            {loading ? 'loading' : error ? 'error' : 'success'}
          </Badge>
          <Button size="sm" variant="ghost" icon={<RefreshCw size={14} />} onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>

      {/* 3. Render each state: loading -> error -> data */}
      {loading && !posts && (
        <div className="row muted"><Spinner /> Loading posts...</div>
      )}

      {error && (
        <Callout type="warning" title="Could not load posts">
          <div className="row">
            <span>{error.message}</span>
            <Button size="sm" onClick={refetch}>Retry</Button>
          </div>
        </Callout>
      )}

      {posts && !error && (
        <ul className={`ch-posts ${loading ? 'is-loading' : ''}`}>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <span className="muted small">{post.body}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
