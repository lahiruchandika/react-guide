/**
 * FetchDataExample - loading data in an effect, and avoiding race conditions
 * ----------------------------------------------------------------------------
 * Fetching when `userId` changes is a side effect:
 *
 *   useEffect(() => {
 *     const controller = new AbortController();
 *     setStatus('loading');
 *     fetchUser(userId, { signal: controller.signal })
 *       .then((data) => { setUser(data); setStatus('success'); })
 *       .catch((err) => { if (err.name !== 'AbortError') setStatus('error'); });
 *     return () => controller.abort();   // cancel the OLD request
 *   }, [userId]);
 *
 * THE RACE CONDITION: user 1 is slow (2.2s), user 2 is fast (0.6s).
 * Click "1" then quickly "2". Without cleanup, user 2 shows first and then the
 * slow answer for user 1 arrives and OVERWRITES it - the screen shows the
 * wrong person! With cleanup, the old request is cancelled / ignored.
 *
 * Two common cleanup techniques (pick one with the toggle):
 *   1. ignore flag:      let ignore = false; ... if (!ignore) setUser(data); return () => { ignore = true }
 *   2. AbortController:  actually cancels the request (works with real fetch())
 *
 * The API is a local mock (api/mockUserApi.js) so it works offline.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { MapPin, Briefcase, TriangleAlert } from 'lucide-react';
import { Badge, Spinner } from '@/components/ui';
import { fetchUser, getUserDelay, USER_IDS } from '../api/mockUserApi';
import { createLogger } from '../components/createLogger';
import LogPanel from '../components/LogPanel';
import '../UseEffectPage.css';

const logger = createLogger();

const MODES = [
  { id: 'none', label: 'No cleanup (bug)' },
  { id: 'ignore', label: 'Ignore flag' },
  { id: 'abort', label: 'AbortController' },
];

export default function FetchDataExample() {
  const [userId, setUserId] = useState(1);
  const [mode, setMode] = useState('abort');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false; // technique 1
    const controller = new AbortController(); // technique 2

    setStatus('loading');
    setError(null);
    logger.log(`request user ${userId} (${getUserDelay(userId)}ms)`, 'effect');

    fetchUser(userId, { signal: mode === 'abort' ? controller.signal : undefined })
      .then((data) => {
        // With the ignore flag, a response from an outdated effect is dropped.
        if (mode === 'ignore' && ignore) {
          logger.log(`ignored stale response for user ${userId}`, 'cleanup');
          return;
        }
        logger.log(`response for user ${userId} -> setUser`, 'info');
        setUser(data);
        setStatus('success');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // aborted on purpose - not a real error
        setError(err.message);
        setStatus('error');
      });

    // Cleanup runs when userId/mode changes (before the next request) or on unmount.
    return () => {
      if (mode === 'ignore') {
        ignore = true;
        logger.log(`cleanup: ignore = true for user ${userId}`, 'cleanup');
      } else if (mode === 'abort') {
        controller.abort();
        logger.log(`cleanup: abort() request for user ${userId}`, 'cleanup');
      }
      // mode 'none' does nothing -> the race condition bug!
    };
  }, [userId, mode]);

  // A mismatch means a stale response won the race.
  const isWrongUser = status === 'success' && user && user.id !== userId;

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="row">
          <span className="muted small">Cleanup:</span>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`ue-chip ${mode === m.id ? 'active' : ''} ${m.id === 'none' ? 'danger' : ''}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="row">
          <span className="muted small">Load user:</span>
          {USER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`ue-user-btn ${userId === id ? 'active' : ''}`}
              onClick={() => setUserId(id)}
              title={`${getUserDelay(id)}ms delay`}
            >
              {id}
              <small>{(getUserDelay(id) / 1000).toFixed(1)}s</small>
            </button>
          ))}
        </div>

        {/* Render based on status: loading / error / success */}
        <div className={`ue-profile ${isWrongUser ? 'wrong' : ''}`}>
          {status === 'loading' && (
            <div className="row">
              <Spinner /> <span className="muted">Loading user {userId}...</span>
            </div>
          )}
          {status === 'error' && <p className="ue-error">{error}</p>}
          {status === 'success' && user && (
            <div className="stack">
              <div className="row">
                <div className="ue-profile-avatar">{user.name[0]}</div>
                <div>
                  <strong>{user.name}</strong>
                  <div className="muted small">user #{user.id}</div>
                </div>
              </div>
              <div className="row small">
                <span className="row"><Briefcase size={14} /> {user.role}</span>
                <span className="row"><MapPin size={14} /> {user.city}</span>
              </div>
              {isWrongUser ? (
                <Badge tone="danger">
                  <TriangleAlert size={12} /> Selected #{userId} but showing #{user.id} - race condition!
                </Badge>
              ) : (
                <Badge tone="success">Matches the selected user</Badge>
              )}
            </div>
          )}
        </div>
        <p className="muted small">
          Try: choose &quot;No cleanup&quot;, click <strong>1</strong> then quickly <strong>2</strong>.
        </p>
      </div>

      <LogPanel logger={logger} title="Request log" height={300} />
    </div>
  );
}
