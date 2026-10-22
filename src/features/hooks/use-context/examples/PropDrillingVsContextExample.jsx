/**
 * PropDrillingVsContextExample
 * ----------------------------------------------------------------------------
 * The problem Context solves, side by side:
 *
 *   LEFT  - "prop drilling": the user is passed App -> Layout -> Sidebar -> Avatar.
 *           Layout and Sidebar don't use `user`; they only forward it.
 *   RIGHT - Context: <UserProvider> wraps the tree, and only the component that
 *           NEEDS the user (UserAvatar) reads it with useUser().
 *
 * Small helper components are defined in this file so you can read the whole
 * tree top-to-bottom in one place.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { UserProvider, useUser } from '../context/UserContext';
import UserAvatar from '../components/UserAvatar';

const NAMES = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds'];

// Pick the next name in the list (wraps back to the start)
const nextName = (current) => NAMES[(NAMES.indexOf(current) + 1) % NAMES.length];

/* ============================ LEFT: prop drilling ============================ */

function DrillApp() {
  const [user, setUser] = useState({ name: NAMES[0], role: 'Admin' }); // state lives at the top

  return (
    <div className="box">
      <span className="box-label">{'<App>'} owns the state</span>
      <Button
        size="sm"
        variant="secondary"
        icon={<RefreshCw size={14} />}
        onClick={() => setUser((u) => ({ ...u, name: nextName(u.name) }))}
      >
        Switch user
      </Button>
      {/* 1. App must pass `user` down even though it doesn't render it here */}
      <DrillLayout user={user} />
    </div>
  );
}

function DrillLayout({ user }) {
  return (
    <div className="box ctx-nested">
      <span className="box-label">
        {'<Layout user>'} <Badge tone="warning">just forwards</Badge>
      </span>
      {/* 2. Layout doesn't use `user`... it only passes it on */}
      <DrillSidebar user={user} />
    </div>
  );
}

function DrillSidebar({ user }) {
  return (
    <div className="box ctx-nested">
      <span className="box-label">
        {'<Sidebar user>'} <Badge tone="warning">just forwards</Badge>
      </span>
      {/* 3. ...and again */}
      <DrillAvatar user={user} />
    </div>
  );
}

function DrillAvatar({ user }) {
  // 4. Finally! The only component that actually needed `user`.
  return (
    <div className="box ctx-nested ctx-target">
      <span className="box-label">
        {'<Avatar user>'} <Badge tone="success">uses it</Badge>
      </span>
      <div>
        <strong>{user.name}</strong> <span className="muted small">({user.role})</span>
      </div>
    </div>
  );
}

/* ============================== RIGHT: context =============================== */

function ContextApp() {
  return (
    // 1. Wrap the tree ONCE with the provider
    <UserProvider>
      <div className="box">
        <span className="box-label">{'<UserProvider>'} owns the state</span>
        <SwitchUserButton />
        <CtxLayout /> {/* 2. No props! */}
      </div>
    </UserProvider>
  );
}

// Any component inside the provider can also UPDATE the context
function SwitchUserButton() {
  const { user, updateUser } = useUser();
  return (
    <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={() => updateUser({ name: nextName(user.name) })}>
      Switch user
    </Button>
  );
}

function CtxLayout() {
  return (
    <div className="box ctx-nested">
      <span className="box-label">{'<Layout>'} no props</span>
      <CtxSidebar />
    </div>
  );
}

function CtxSidebar() {
  return (
    <div className="box ctx-nested">
      <span className="box-label">{'<Sidebar>'} no props</span>
      <div className="box ctx-nested ctx-target">
        <span className="box-label">
          {'<UserAvatar>'} <Badge tone="success">useUser()</Badge>
        </span>
        {/* 3. Reads the user directly from context */}
        <UserAvatar showName />
      </div>
    </div>
  );
}

/* ================================ The demo ================================== */

export default function PropDrillingVsContextExample() {
  return (
    <div className="grid-2">
      <div className="stack">
        <div className="row">
          <Badge tone="danger">Prop drilling</Badge>
          <span className="muted small">3 components touch `user`</span>
        </div>
        <DrillApp />
      </div>
      <div className="stack">
        <div className="row">
          <Badge tone="success">Context</Badge>
          <span className="muted small">only the consumer touches `user`</span>
        </div>
        <ContextApp />
      </div>
    </div>
  );
}
