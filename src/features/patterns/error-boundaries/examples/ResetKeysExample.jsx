/**
 * ResetKeysExample - auto-recover when the input changes + error logging.
 * ----------------------------------------------------------------------------
 * Scenario: a user directory. One user record is corrupted (address is null),
 * so <UserProfile> crashes on `user.address.city`.
 *
 *   resetKeys={[userId]}  -> when you pick ANOTHER user, the boundary resets
 *                            itself automatically (no "Try again" needed).
 *   onError(error, info)  -> componentDidCatch: we "send" the error and the
 *                            component stack to a fake logging service.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { MapPin, Mail } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';

const USERS = {
  1: { name: 'Ava Johnson', email: 'ava@example.com', address: { city: 'London', country: 'UK' } },
  2: { name: 'Kenji Sato', email: 'kenji@example.com', address: { city: 'Osaka', country: 'Japan' } },
  3: { name: 'Broken Record', email: 'oops@example.com', address: null }, // <- corrupted data
  4: { name: 'Lucía García', email: 'lucia@example.com', address: { city: 'Madrid', country: 'Spain' } },
};

let nextLogId = 1;

/** Crashes for user 3 because it assumes address is always there. */
function UserProfile({ userId }) {
  const user = USERS[userId];
  return (
    <div className="eb-profile">
      <span className="eb-profile-avatar">{user.name[0]}</span>
      <div className="stack" style={{ gap: 4 }}>
        <strong>{user.name}</strong>
        <span className="row small muted" style={{ gap: 6 }}><Mail size={14} /> {user.email}</span>
        {/* 💥 TypeError when address is null */}
        <span className="row small muted" style={{ gap: 6 }}><MapPin size={14} /> {user.address.city}, {user.address.country}</span>
      </div>
    </div>
  );
}

export default function ResetKeysExample() {
  const [userId, setUserId] = useState(1);
  const [errorLog, setErrorLog] = useState([]);

  // Pretend this sends the error to a monitoring service like Sentry
  const logError = (error, info) => {
    // First 3 lines of the component stack are enough for the demo
    const stack = info.componentStack.trim().split('\n').slice(0, 3).map((l) => l.trim()).join('  ←  ');
    setErrorLog((prev) => [{ id: nextLogId++, message: error.message, stack }, ...prev].slice(0, 3));
  };

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="eb-user-tabs">
          {Object.entries(USERS).map(([id, user]) => (
            <button
              key={id}
              type="button"
              className={Number(id) === userId ? 'active' : ''}
              onClick={() => setUserId(Number(id))}
            >
              #{id} {user.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <ErrorBoundary
          resetKeys={[userId]} // a different user -> automatic reset
          onError={logError}
          // No "Try again" button here: picking another user resets the boundary
          fallback={({ error }) => <ErrorFallback error={error} title={`User #${userId} has invalid data - pick another user`} />}
        >
          <UserProfile userId={userId} />
        </ErrorBoundary>
      </div>

      <div className="eb-log">
        <div className="eb-log-title">Error monitoring (onError / componentDidCatch)</div>
        {errorLog.length === 0 && <span className="muted small">No errors reported. Open user #3...</span>}
        {errorLog.map((entry) => (
          <div key={entry.id} className="eb-log-entry">
            <strong>{entry.message}</strong>
            <code>{entry.stack}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
