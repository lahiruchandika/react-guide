/**
 * LinkVsNavLinkExample - <a> vs <Link> vs <NavLink>.
 * ----------------------------------------------------------------------------
 *   <a href="...">   a normal HTML link: the browser RELOADS the whole page,
 *                    all React state is lost and every file is re-downloaded.
 *
 *   <Link to="...">  React Router intercepts the click, updates the URL with
 *                    the History API and re-renders only what changed.
 *                    No reload -> state survives, navigation is instant.
 *
 *   <NavLink>        a <Link> that knows if it is ACTIVE (matches the URL).
 *                    Perfect for menus/tabs. className and style can be
 *                    functions: ({ isActive, isPending }) => ...
 *                    Use `end` so "/" isn't active for every child path.
 *
 * Proof: APP_LOADED_AT below is computed once when this file is loaded.
 * It only changes when the page really reloads (the <a> tag).
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, Users, Info, RefreshCw } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { LESSON_BASE } from '../constants';
import AddressBar from '../components/AddressBar';

// Module-level value: survives client-side navigation, reset by a full reload
const APP_LOADED_AT = new Date().toLocaleTimeString();

const NAV_ITEMS = [
  { to: LESSON_BASE, label: 'Home', icon: Home, end: true }, // end: exact match only
  { to: `${LESSON_BASE}/users`, label: 'Users', icon: Users },
  { to: `${LESSON_BASE}/about`, label: 'About', icon: Info },
];

export default function LinkVsNavLinkExample() {
  // Some React state - watch it survive <Link> clicks and vanish with <a>
  const [likes, setLikes] = useState(0);

  return (
    <div className="stack">
      <AddressBar />

      <div className="row">
        <Badge tone="info">page loaded at {APP_LOADED_AT}</Badge>
        <Button size="sm" variant="secondary" onClick={() => setLikes((n) => n + 1)}>❤️ State: {likes}</Button>
      </div>

      <div className="grid-3">
        {/* -------- NavLink: knows when it's active -------- */}
        <div className="rr-panel">
          <span className="rr-panel-title">{'<NavLink>'} - highlights the active page</span>
          <nav className="rr-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                // className can be a function that receives { isActive }
                className={({ isActive }) => `rr-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} /> {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* -------- Link: plain client-side navigation -------- */}
        <div className="rr-panel">
          <span className="rr-panel-title">{'<Link>'} - no reload, no active style</span>
          <nav className="rr-nav">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="rr-nav-link">
                <Icon size={15} /> {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* -------- <a>: full page reload -------- */}
        <div className="rr-panel rr-panel-danger">
          <span className="rr-panel-title">{'<a href>'} - full page reload!</span>
          <nav className="rr-nav">
            <a href={`${LESSON_BASE}/users`} className="rr-nav-link">
              <RefreshCw size={15} /> Users (reloads)
            </a>
          </nav>
          <span className="muted small">Click it: the &quot;loaded at&quot; time changes and the ❤️ counter resets to 0.</span>
        </div>
      </div>
    </div>
  );
}
