/**
 * EarlyReturnExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: `if` statements + EARLY RETURN, and returning `null`.
 *
 * Scenario: a members-only dashboard.
 *   - <Dashboard> uses `if (!user) return <LoginPrompt />` to bail out early.
 *   - <NotificationBanner> returns `null` (= render nothing) when there are
 *     no unread notifications.
 *
 * Why early return? JSX is an expression, so you cannot write `if` INSIDE it.
 * But you CAN use a normal `if` before the `return` and return different JSX.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Bell, LogIn, LogOut, Lock } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

/* ---------- Child 1: shown when NOBODY is logged in ---------- */
function LoginPrompt({ onLogin }) {
  return (
    <div className="cr-panel cr-panel-locked">
      <Lock size={28} />
      <strong>Members only</strong>
      <p className="muted small">Please log in to see your dashboard.</p>
      <Button icon={<LogIn />} onClick={onLogin}>
        Log in as Alex
      </Button>
    </div>
  );
}

/* ---------- Child 2: returns null when there is nothing to show ---------- */
function NotificationBanner({ count }) {
  // Returning null tells React: "render nothing for this component".
  if (count === 0) return null;

  return (
    <div className="cr-banner">
      <Bell size={16} />
      You have <strong>{count}</strong> unread notification{count > 1 ? 's' : ''}
    </div>
  );
}

/* ---------- Parent: decides WHAT to render with an early return ---------- */
function Dashboard({ user, unread, onLogin, onLogout, onRead }) {
  // 1. Guard clause: if there is no user, STOP here and return different JSX.
  //    Nothing below this line runs when user is null.
  if (!user) {
    return <LoginPrompt onLogin={onLogin} />;
  }

  // 2. From here on we KNOW `user` exists, so we can safely use user.name.
  return (
    <div className="cr-panel">
      <div className="row" style={{ justifyContent: 'space-between', width: '100%' }}>
        <strong>Welcome back, {user.name}!</strong>
        <Badge tone="success">{user.plan} plan</Badge>
      </div>

      {/* 3. This child may render nothing at all (it returns null) */}
      <NotificationBanner count={unread} />

      <div className="row">
        <Button variant="secondary" size="sm" onClick={onRead} disabled={unread === 0}>
          Mark all as read
        </Button>
        <Button variant="ghost" size="sm" icon={<LogOut />} onClick={onLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}

export default function EarlyReturnExample() {
  // `user` is either null (logged out) or an object (logged in).
  const [user, setUser] = useState(null);
  const [unread, setUnread] = useState(3);

  // The parent always renders <Dashboard>; the Dashboard itself decides
  // (with an early return) whether to show the login screen or the content.
  return (
    <Dashboard
      user={user}
      unread={unread}
      onLogin={() => {
        setUser({ name: 'Alex', plan: 'Pro' });
        setUnread(3); // reset demo data on every login
      }}
      onRead={() => setUnread(0)}
      onLogout={() => setUser(null)}
    />
  );
}
