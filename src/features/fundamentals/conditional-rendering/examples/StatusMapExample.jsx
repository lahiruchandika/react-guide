/**
 * StatusMapExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: rendering one of MANY states without a long if/else chain.
 *
 * A data request is always in exactly one status:
 *     'idle' | 'loading' | 'error' | 'empty' | 'success'
 *
 * Two clean patterns are shown:
 *   A) An OBJECT MAP   status -> component        (STATUS_VIEWS below)
 *   B) A SWITCH        inside a helper function   (getStatusBadge below)
 *
 * The "server" is a fake, local mock that answers after a short delay, so
 * the demo works offline. Use the buttons to choose what the server returns.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { CircleAlert, Inbox, RefreshCw, Users } from 'lucide-react';
import { Button, Badge, Spinner } from '@/components/ui';

/* ---------------- Fake API (no network needed) ---------------- */
const FAKE_USERS = [
  { id: 1, name: 'Maya Fernando', role: 'Designer' },
  { id: 2, name: 'Liam Chen', role: 'Developer' },
  { id: 3, name: 'Sara Ali', role: 'Product Manager' },
];

/* ---------------- One small component per status ---------------- */
function IdleView() {
  return <p className="muted">Pick what the server should return, then load the team.</p>;
}

function LoadingView() {
  return (
    <div className="row">
      <Spinner /> <span className="muted">Loading team members...</span>
    </div>
  );
}

function ErrorView({ onRetry }) {
  return (
    <div className="cr-state cr-state-error">
      <CircleAlert size={20} />
      <span>Could not load the team (500 Server Error).</span>
      <Button size="sm" variant="secondary" icon={<RefreshCw />} onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function EmptyView() {
  return (
    <div className="cr-state">
      <Inbox size={20} />
      <span>No team members yet.</span>
    </div>
  );
}

function SuccessView({ users }) {
  return (
    <ul className="cr-user-list">
      {users.map((u) => (
        <li key={u.id}>
          <span className="cr-avatar">{u.name[0]}</span>
          <strong>{u.name}</strong>
          <span className="muted small">{u.role}</span>
        </li>
      ))}
    </ul>
  );
}

// A) OBJECT MAP: look up the component for the current status.
//    Adding a new status = adding one line here. No if/else needed.
const STATUS_VIEWS = {
  idle: IdleView,
  loading: LoadingView,
  error: ErrorView,
  empty: EmptyView,
  success: SuccessView,
};

// B) SWITCH: also fine, especially when each case needs a bit of logic.
function getStatusBadge(status) {
  switch (status) {
    case 'loading':
      return <Badge tone="info">loading</Badge>;
    case 'error':
      return <Badge tone="danger">error</Badge>;
    case 'empty':
      return <Badge tone="warning">empty</Badge>;
    case 'success':
      return <Badge tone="success">success</Badge>;
    default:
      return <Badge>idle</Badge>;
  }
}

export default function StatusMapExample() {
  const [status, setStatus] = useState('idle');
  const [users, setUsers] = useState([]);
  // What the fake server should answer next: 'success' | 'empty' | 'error'
  const [outcome, setOutcome] = useState('success');
  // Each click creates a NEW request object { id, outcome }, which starts the
  // effect below. A new object every time = the effect runs on every click.
  const [request, setRequest] = useState(null);

  // Simulate the request. Runs whenever a new request object is created.
  useEffect(() => {
    if (!request) return; // nothing requested yet
    const { outcome } = request; // the answer chosen at click time

    const timer = setTimeout(() => {
      if (outcome === 'error') {
        setStatus('error');
      } else {
        const data = outcome === 'empty' ? [] : FAKE_USERS;
        setUsers(data);
        setStatus(data.length === 0 ? 'empty' : 'success');
      }
    }, 1200);

    // Cleanup: cancel the pending "response" if the component unmounts
    // or a new request starts before this one finishes.
    return () => clearTimeout(timer);
  }, [request]);

  function load() {
    setStatus('loading');
    setRequest({ id: Date.now(), outcome });
  }

  // Pick the right component from the map, then render it like any component.
  const View = STATUS_VIEWS[status];

  return (
    <div className="stack">
      <div className="row">
        <span className="small muted">Server will return:</span>
        {['success', 'empty', 'error'].map((o) => (
          <Button key={o} size="sm" variant={outcome === o ? 'primary' : 'secondary'} onClick={() => setOutcome(o)}>
            {o}
          </Button>
        ))}
        <Button size="sm" icon={<Users />} onClick={load} disabled={status === 'loading'}>
          Load team
        </Button>
      </div>

      <div className="box">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <span className="box-label" style={{ margin: 0 }}>
            status = &quot;{status}&quot;
          </span>
          {getStatusBadge(status)}
        </div>

        {/* Every View receives the same props; each one uses what it needs. */}
        <View users={users} onRetry={load} />
      </div>
    </div>
  );
}
