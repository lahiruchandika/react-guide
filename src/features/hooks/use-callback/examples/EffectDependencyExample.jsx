/**
 * EffectDependencyExample.jsx
 * ----------------------------------------------------------------------------
 * useCallback for a function that is used as a useEffect DEPENDENCY.
 *
 *   const loadUsers = useCallback(() => searchUsers(query), [query]);
 *   useEffect(() => { ...loadUsers()... }, [loadUsers]);
 *
 * Without useCallback, `loadUsers` would be a new function on every render,
 * so the effect would re-run (and re-fetch!) after EVERY render. If the effect
 * also sets state, that causes another render -> new function -> effect again
 * -> an infinite loop. (That's why it isn't shown live here!)
 *
 * With useCallback, the function only changes when `query` changes, so the
 * effect runs only when a new search is really needed.
 *
 * Try it: type a name (effect runs, see log). Then click "Unrelated re-render":
 * the component renders again but the effect does NOT run.
 *
 * Simpler alternative worth knowing: define the function INSIDE the effect and
 * depend on [query] directly. useCallback is handy when the function is also
 * needed outside the effect (e.g. a "Retry" button, as below).
 * ----------------------------------------------------------------------------
 */
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, RotateCw } from 'lucide-react';
import { Badge, Button, Input, RenderCounter, Spinner } from '@/components/ui';

const USERS = ['Alice Johnson', 'Bob Smith', 'Carlos Diaz', 'Diana Prince', 'Ethan Hunt', 'Fatima Khan', 'George Lee', 'Hana Sato'];

/** Mock API: returns matching users after 400 ms (no network needed). */
function searchUsers(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(USERS.filter((u) => u.toLowerCase().includes(query.trim().toLowerCase())));
    }, 400);
  });
}

let nextLogId = 1; // unique ids for log lines

export default function EffectDependencyExample() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [ticks, setTicks] = useState(0); // unrelated state

  // 1. A stable function that changes only when `query` changes.
  const loadUsers = useCallback(() => searchUsers(query), [query]);

  // 2. The effect depends on the function itself.
  useEffect(() => {
    let ignore = false; // protects against out-of-order responses
    setLoading(true);
    setLog((prev) => [{ id: nextLogId++, text: 'effect ran → loadUsers() called' }, ...prev].slice(0, 6));

    loadUsers().then((result) => {
      if (!ignore) {
        setUsers(result);
        setLoading(false);
      }
    });

    // 3. Cleanup runs before the next effect (and on unmount / StrictMode re-run).
    return () => {
      ignore = true;
    };
  }, [loadUsers]); // re-runs only when loadUsers is a NEW function

  // The same memoised function reused outside the effect.
  const retry = () => {
    setLoading(true);
    loadUsers().then((result) => {
      setUsers(result);
      setLoading(false);
    });
  };

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>User search</strong>
          <RenderCounter />
        </div>
        <Input label="Search users" placeholder="Try 'an' or 'li'" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="row">
          <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={() => setTicks((t) => t + 1)}>
            Unrelated re-render ({ticks})
          </Button>
          <Button variant="ghost" size="sm" icon={<RotateCw size={14} />} onClick={retry}>
            Retry search
          </Button>
          {loading && <Spinner size={18} />}
        </div>
        <div className="uc-chips">
          {users.map((u) => (
            <Badge key={u} tone="primary">
              {u}
            </Badge>
          ))}
          {!loading && users.length === 0 && <span className="small muted">No users found.</span>}
        </div>
      </div>

      <div className="uc-log">
        <span className="box-label">useEffect run log</span>
        {log.map((entry) => (
          <div key={entry.id} className="uc-log-line good">
            {entry.text}
          </div>
        ))}
        <p className="small" style={{ marginTop: 'auto', marginBottom: 0, opacity: 0.7 }}>
          Note: in development, StrictMode runs effects twice on mount, so you may see two lines at first.
        </p>
      </div>
    </div>
  );
}
