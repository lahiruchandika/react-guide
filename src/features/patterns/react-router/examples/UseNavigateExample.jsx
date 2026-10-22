/**
 * UseNavigateExample - navigate from CODE instead of a link click.
 * ----------------------------------------------------------------------------
 *   const navigate = useNavigate();
 *
 *   navigate('/some/path')                        go to a URL (adds a history entry)
 *   navigate('/login', { replace: true })         REPLACE the current entry
 *                                                 (Back button won't return here)
 *   navigate('/users/2', { state: { from } })     pass hidden data along
 *   navigate(-1) / navigate(1)                    Back / Forward
 *
 * Typical uses: after a form is submitted, after login/logout, after a timer,
 * redirecting when something isn't allowed.
 * Rule: use <Link> for things the user clicks to go somewhere (better for
 * accessibility: right-click "open in new tab" works); use navigate() for
 * navigation that HAPPENS as the result of some logic.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LogIn, Search } from 'lucide-react';
import { Button, Input, Spinner } from '@/components/ui';
import { LESSON_BASE } from '../constants';
import { USERS } from '../data/users';
import AddressBar from '../components/AddressBar';

export default function UseNavigateExample() {
  const navigate = useNavigate(); // 1. get the navigate function
  const [userId, setUserId] = useState('3');
  const [signingIn, setSigningIn] = useState(false);

  // 2. Navigate after a form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`${LESSON_BASE}/users/${userId}`, { state: { from: 'search form' } });
  };

  // 3. Navigate after async work - and REPLACE so "Back" skips the login step
  const fakeLogin = async () => {
    setSigningIn(true);
    await new Promise((r) => setTimeout(r, 700)); // pretend to call an API
    setSigningIn(false);
    navigate(`${LESSON_BASE}/users/1`, { replace: true, state: { from: 'login', welcome: true } });
  };

  return (
    <div className="stack">
      <AddressBar />

      <div className="grid-2">
        <form className="rr-panel" onSubmit={handleSubmit}>
          <span className="rr-panel-title">Navigate after submit</span>
          <Input
            label={`User ID (1 - ${USERS.length}, or try 99)`}
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <Button type="submit" icon={<Search />}>Open profile</Button>
        </form>

        <div className="rr-panel">
          <span className="rr-panel-title">History & redirects</span>
          <div className="row">
            <Button variant="secondary" icon={<ArrowLeft />} onClick={() => navigate(-1)}>Back</Button>
            <Button variant="secondary" icon={<ArrowRight />} onClick={() => navigate(1)}>Forward</Button>
          </div>
          <Button icon={signingIn ? <Spinner size={14} /> : <LogIn />} onClick={fakeLogin} disabled={signingIn}>
            {signingIn ? 'Signing in...' : 'Fake login → redirect (replace)'}
          </Button>
          <span className="muted small">The profile opens in the mini app in example 5 below.</span>
        </div>
      </div>
    </div>
  );
}
