/**
 * MiniPages - the small, simple pages of the mini app (one file, several
 * named exports, because each is only a few lines long).
 *
 *   MiniHome      index route        /patterns/react-router
 *   UsersIndex    users index route  /patterns/react-router/users
 *   MiniAbout     "about"            /patterns/react-router/about
 *   MiniNotFound  "*" (catch-all)    /patterns/react-router/anything-else
 */
import { Link, useLocation } from 'react-router-dom';
import { MousePointerClick } from 'lucide-react';
import { LESSON_BASE } from '../../constants';

export function MiniHome() {
  return (
    <div className="rr-mini-page">
      <h4>🏠 Mini app home</h4>
      <p className="small muted">
        This is the <strong>index route</strong> - it renders when the URL is exactly the lesson URL.
      </p>
      <Link to={`${LESSON_BASE}/users`}>Browse the team →</Link>
    </div>
  );
}

export function UsersIndex() {
  return (
    <div className="rr-empty">
      <MousePointerClick size={22} />
      <p className="small">Select a user from the list. This text is the <strong>index route</strong> of /users.</p>
    </div>
  );
}

export function MiniAbout() {
  const { state } = useLocation(); // hidden data passed with <Link state={...}>
  return (
    <div className="rr-mini-page">
      <h4>ℹ️ About</h4>
      <p className="small muted">A static page at <code>/about</code>.</p>
      <p className="small">
        location.state: <code>{state ? JSON.stringify(state) : 'null'}</code>
      </p>
    </div>
  );
}

export function MiniNotFound() {
  const { pathname } = useLocation();
  return (
    <div className="rr-mini-page">
      <h4>🤷 404 inside the mini app</h4>
      <p className="small muted">
        No route matched <code>{pathname.replace(LESSON_BASE, '')}</code>. The <code>path=&quot;*&quot;</code> route catches it.
      </p>
      <Link to={LESSON_BASE}>Go to mini home</Link>
    </div>
  );
}
