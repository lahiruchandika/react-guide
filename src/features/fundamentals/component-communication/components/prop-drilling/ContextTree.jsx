/**
 * ContextTree.jsx  -  THE FIX: share data with Context
 * ----------------------------------------------------------------------------
 * Same tree as DrilledTree.jsx, but:
 *   - <App> wraps everything in <UserContext value={user}>  (the provider)
 *   - <Layout> and <Sidebar> receive NO user prop at all
 *   - <UserMenu> reads it directly:  const user = useContext(UserContext)
 *
 *   App ── provides user ─────────────────────────────┐
 *     └ Layout (no props) └ Sidebar (no props) └ UserMenu ← useContext
 *
 * React 19 note: you can render the context itself as the provider:
 *   <UserContext value={user}>   (older code: <UserContext.Provider value={user}>)
 * ----------------------------------------------------------------------------
 */
import { useContext } from 'react';
import { UserContext } from './UserContext';
import LevelBox from './LevelBox';

/* Level 4 - grabs `user` straight from context */
function UserMenu() {
  const user = useContext(UserContext); // 👈 no props needed

  return (
    <LevelBox name="<UserMenu>" role="uses" note="useContext(UserContext)">
      <div className="cc-usermenu">
        <span className="cc-usermenu-avatar">{user.avatar}</span>
        <div>
          <strong>{user.name}</strong>
          <div className="muted small">{user.email}</div>
        </div>
      </div>
    </LevelBox>
  );
}

/* Level 3 - clean: no user prop */
function Sidebar() {
  return (
    <LevelBox name="<Sidebar>" role="none">
      <UserMenu />
    </LevelBox>
  );
}

/* Level 2 - clean: no user prop */
function Layout() {
  return (
    <LevelBox name="<Layout>" role="none">
      <Sidebar />
    </LevelBox>
  );
}

/* Level 1 - provides the value to everything inside */
export default function ContextTree({ user }) {
  return (
    <LevelBox name="<App>" role="owner" note="<UserContext value={user}>">
      <UserContext value={user}>
        <Layout />
      </UserContext>
    </LevelBox>
  );
}
