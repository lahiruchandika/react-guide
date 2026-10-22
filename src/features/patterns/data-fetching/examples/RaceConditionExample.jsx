/**
 * RaceConditionExample - why every fetch effect needs a cleanup.
 * ----------------------------------------------------------------------------
 * Requests don't always finish in the order they started. Here each user has
 * a fixed response time: Leanne is SLOW (2.5s), Ervin is FAST (0.5s).
 *
 *   Click "Leanne" and then quickly "Ervin":
 *     1. request Leanne starts (2.5s)
 *     2. request Ervin starts  (0.5s) -> arrives first, Ervin is shown
 *     3. Leanne's old response arrives LAST and overwrites the screen!
 *
 * BuggyProfile has no cleanup -> it shows the wrong user.
 * FixedProfile aborts the previous request in the cleanup -> always correct.
 *
 * Note: in development, StrictMode runs every effect twice on mount, so you
 * will see an extra "aborted" line at the start - that's the cleanup working.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import { USERS, mockApi } from '@/services/mockApi';
import UserCard from '../components/UserCard';
import LogPanel from '../components/LogPanel';
import { useEventLog } from '../hooks/useEventLog';

// Fixed response time per user id, so the race is easy to reproduce.
const DELAYS = { 1: 2500, 2: 500, 3: 1500, 4: 300 };

// ============== BUGGY: no cleanup, the last response to ARRIVE wins ==========
function BuggyProfile({ userId, log }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Only used to colour the log line red when a stale response wins.
  // (It is NOT a fix - the component still shows the stale data.)
  const latestIdRef = useRef(userId);
  useEffect(() => {
    latestIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    log(`buggy: request user ${userId}`, 'start');

    mockApi.getUser(userId, { delay: DELAYS[userId] }).then((data) => {
      // This runs even if userId has changed since -> stale data on screen!
      const isStale = latestIdRef.current !== userId;
      log(`buggy: got user ${userId} -> shown${isStale ? ' (STALE!)' : ''}`, isStale ? 'stale' : 'success');
      setUser(data);
      setLoading(false);
    });
    // no return () => ... cleanup!  <- the bug
  }, [userId, log]);

  const isWrong = user && !loading && user.id !== userId;

  return (
    <ProfileFrame title="Without cleanup" tone="danger" loading={loading}>
      <UserCard user={user} loading={loading} />
      {isWrong && (
        <div className="df-wrong">
          <TriangleAlert size={14} /> Showing user {user.id}, but you selected user {userId}!
        </div>
      )}
    </ProfileFrame>
  );
}

// ============== FIXED: abort the previous request in the cleanup =============
function FixedProfile({ userId, log }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController(); // one controller per request
    setLoading(true);
    log(`fixed: request user ${userId}`, 'start');

    mockApi
      .getUser(userId, { delay: DELAYS[userId], signal: controller.signal })
      .then((data) => {
        log(`fixed: got user ${userId} -> shown`, 'success');
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') log(`fixed: aborted user ${userId}`, 'abort');
        else log(`fixed: error ${err.message}`, 'error');
      });

    // Cleanup runs BEFORE the effect runs again with the new userId:
    // the old request is cancelled, so it can never overwrite the new one.
    return () => controller.abort();
  }, [userId, log]);

  return (
    <ProfileFrame title="With AbortController" tone="success" loading={loading}>
      <UserCard user={user} loading={loading} />
    </ProfileFrame>
  );
}

// Small layout wrapper shared by both profiles (uses the children prop).
function ProfileFrame({ title, tone, loading, children }) {
  return (
    <div className={`df-frame df-frame-${tone}`}>
      <div className="row df-between">
        <Badge tone={tone}>{title}</Badge>
        {loading && <Spinner size={16} />}
      </div>
      {children}
    </div>
  );
}

export default function RaceConditionExample() {
  const [userId, setUserId] = useState(2);
  const { entries, log, clear } = useEventLog(10);

  return (
    <div className="stack">
      <div className="row">
        <span className="small muted">Select user:</span>
        {USERS.slice(0, 4).map((user) => (
          <Button
            key={user.id}
            size="sm"
            variant={user.id === userId ? 'primary' : 'secondary'}
            onClick={() => setUserId(user.id)}
          >
            {user.name.split(' ')[0]} <span className="df-delay">{DELAYS[user.id] / 1000}s</span>
          </Button>
        ))}
      </div>
      <p className="small muted">Tip: click <strong>Leanne</strong> (slow), then immediately <strong>Ervin</strong> (fast), and wait.</p>

      <div className="grid-2">
        {/* The same userId prop goes to both versions */}
        <BuggyProfile userId={userId} log={log} />
        <FixedProfile userId={userId} log={log} />
      </div>

      <LogPanel entries={entries} onClear={clear} />
    </div>
  );
}
