/**
 * BasicFetchExample - the classic "fetch in useEffect" pattern.
 * ----------------------------------------------------------------------------
 * Every request has THREE possible states, and the UI must handle each one:
 *   loading  -> show a spinner / skeleton
 *   error    -> show a message and a Retry button
 *   data     -> show the result
 *
 * Steps:
 *   1. useState for data, loading and error
 *   2. useEffect starts the request after the component renders
 *   3. AbortController cancels it in the cleanup (unmount / re-run)
 *   4. A "reloadKey" state that the Retry button increments re-runs the effect
 *
 * Data comes from src/services/mockApi.js (a fake server with a delay).
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge, Button, Callout } from '@/components/ui';
import { mockApi } from '@/services/mockApi';
import UserCard from '../components/UserCard';

export default function BasicFetchExample() {
  // 1. The three request states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Demo controls
  const [simulateError, setSimulateError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // change it -> effect runs again

  // 2. Fetch after render, and again whenever reloadKey changes
  useEffect(() => {
    const controller = new AbortController(); // 3. lets us cancel the request

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await mockApi.getUsers({
          signal: controller.signal,
          delay: 1200,
          failRate: simulateError ? 1 : 0, // 100% failure when the checkbox is on
        });
        setUsers(data); // success
      } catch (err) {
        if (err.name === 'AbortError') return; // cancelled on purpose - ignore
        setError(err.message); // failure
      } finally {
        // Don't touch state for a cancelled request
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadUsers(); // effects can't be async themselves, so call an async function inside

    return () => controller.abort(); // cleanup: cancel if we re-run or unmount
  }, [reloadKey, simulateError]);

  const retry = () => setReloadKey((k) => k + 1); // 4. re-run the effect

  return (
    <div className="stack">
      <div className="row df-between">
        <label className="row small">
          <input type="checkbox" checked={simulateError} onChange={(e) => setSimulateError(e.target.checked)} />
          Simulate server error
        </label>
        <div className="row">
          <Badge tone={loading ? 'info' : error ? 'danger' : 'success'}>
            {loading ? 'loading...' : error ? 'error' : `${users.length} users loaded`}
          </Badge>
          <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={retry} disabled={loading}>
            Reload
          </Button>
        </div>
      </div>

      {/* ---- Render the right UI for each state ---- */}
      {error ? (
        <Callout type="warning" title="Something went wrong">
          <p>{error}</p>
          <Button size="sm" icon={<RefreshCw size={14} />} onClick={retry}>Retry</Button>
        </Callout>
      ) : loading ? (
        // Skeleton cards keep the layout stable while loading
        <div className="df-user-grid">
          {[1, 2, 3, 4].map((n) => <UserCard key={n} user={null} loading />)}
        </div>
      ) : (
        <div className="df-user-grid">
          {users.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </div>
  );
}
