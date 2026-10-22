/**
 * StateVsReducerExample.jsx
 * ----------------------------------------------------------------------------
 * The same feature built twice: "load a user profile" with loading / error /
 * data states.
 *
 * LEFT  - useState: three separate pieces of state, updated by hand in every
 *         handler. It is easy to forget one setter, which creates "impossible"
 *         states (e.g. an error message AND old data at the same time).
 *
 * RIGHT - useReducer: one `status` field and named transitions
 *         (start / success / failure). Each action returns a complete,
 *         consistent state, so impossible combinations cannot happen.
 *
 * Try it: click "Load" on both, then "Load (fail)" on both. The left card shows
 * the old profile next to the error - that is the bug.
 * ----------------------------------------------------------------------------
 */
import { useReducer, useState } from 'react';
import { CircleAlert, UserRound } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';

/** Mock API: resolves or rejects after 700 ms (no network needed). */
function fetchProfile(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error('Server error 500 - please try again'));
      else resolve({ name: 'Jordan Rivera', role: 'Frontend Developer', followers: Math.floor(100 + Math.random() * 900) });
    }, 700);
  });
}

// ---------------------------------------------------------------- useState version
function ProfileWithState() {
  // Three independent states that must be kept in sync manually.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const load = async (shouldFail) => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await fetchProfile(shouldFail));
    } catch (err) {
      setError(err.message);
      // ❌ BUG: we forgot setProfile(null) -> old data + error shown together
    } finally {
      setLoading(false);
    }
  };

  return <ProfileCard title="useState" tone="warning" loading={loading} error={error} profile={profile} onLoad={load} />;
}

// -------------------------------------------------------------- useReducer version
const initialRequest = { status: 'idle', profile: null, error: null };

// Each case returns the WHOLE next state, so nothing can be "forgotten".
function requestReducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, status: 'loading', error: null };
    case 'success':
      return { status: 'success', profile: action.payload, error: null };
    case 'failure':
      return { status: 'error', profile: null, error: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function ProfileWithReducer() {
  const [state, dispatch] = useReducer(requestReducer, initialRequest);

  const load = async (shouldFail) => {
    dispatch({ type: 'start' });
    try {
      dispatch({ type: 'success', payload: await fetchProfile(shouldFail) });
    } catch (err) {
      dispatch({ type: 'failure', payload: err.message });
    }
  };

  return (
    <ProfileCard
      title="useReducer"
      tone="success"
      loading={state.status === 'loading'}
      error={state.error}
      profile={state.profile}
      status={state.status}
      onLoad={load}
    />
  );
}

// --------------------------------------------- shared presentational card (UI only)
function ProfileCard({ title, tone, loading, error, profile, status, onLoad }) {
  return (
    <div className="rd-profile">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Badge tone={tone}>{title}</Badge>
        {status && <code className="small">status: '{status}'</code>}
      </div>

      <div className="rd-profile-body">
        {loading && <Spinner />}
        {profile && (
          <div className="row">
            <span className="rd-avatar">
              <UserRound size={20} />
            </span>
            <div>
              <strong>{profile.name}</strong>
              <div className="small muted">
                {profile.role} · {profile.followers} followers
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="rd-error">
            <CircleAlert size={16} /> {error}
          </div>
        )}
        {!loading && !profile && !error && <span className="small muted">No profile loaded yet.</span>}
      </div>

      <div className="row">
        <Button size="sm" onClick={() => onLoad(false)} disabled={loading}>
          Load
        </Button>
        <Button size="sm" variant="danger" onClick={() => onLoad(true)} disabled={loading}>
          Load (fail)
        </Button>
      </div>
    </div>
  );
}

export default function StateVsReducerExample() {
  return (
    <div className="grid-2">
      <ProfileWithState />
      <ProfileWithReducer />
    </div>
  );
}
