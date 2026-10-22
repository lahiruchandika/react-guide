/**
 * UpdateFromChildExample
 * ----------------------------------------------------------------------------
 * Context is not read-only: the provider can share FUNCTIONS too.
 * Here a form deep inside "Settings" calls updateUser() / logout(), and the
 * header at the top updates instantly - the two components never talk to each
 * other directly, they both talk to the context.
 *
 *   <UserProvider>
 *     <AppHeader />            reads user  (avatar, name, Log out)
 *     <SettingsPage>
 *       <ProfileForm />        calls updateUser()   <- updates from a child
 *     </SettingsPage>
 *     <LoginPanel />           calls login()        (shown when logged out)
 *   </UserProvider>
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { Badge, Button, Input, RenderCounter } from '@/components/ui';
import { UserProvider, useUser } from '../context/UserContext';
import UserAvatar from '../components/UserAvatar';

const ROLES = ['Admin', 'Editor', 'Viewer'];

// Top of the "app": shows who is logged in
function AppHeader() {
  const { user, logout } = useUser(); // read state AND an action

  return (
    <header className="ctx-app-header">
      <strong>My Dashboard</strong>
      <div className="row">
        <UserAvatar showName />
        {user && (
          <Button size="sm" variant="ghost" icon={<LogOut size={14} />} onClick={logout}>
            Log out
          </Button>
        )}
        <RenderCounter />
      </div>
    </header>
  );
}

// A nested page - it does NOT receive or forward anything
function SettingsPage() {
  return (
    <div className="box">
      <span className="box-label">{'<SettingsPage>'}</span>
      <ProfileForm />
    </div>
  );
}

// Deep child that UPDATES the context
function ProfileForm() {
  const { user, updateUser } = useUser();

  return (
    <div className="box ctx-nested">
      <span className="box-label">{'<ProfileForm>'} calls updateUser()</span>
      <div className="grid-2">
        {/* Every keystroke updates the context -> the header re-renders too */}
        <Input label="Display name" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
        <div className="field">
          <span className="field-label">Role</span>
          <div className="row">
            {ROLES.map((role) => (
              <Button
                key={role}
                size="sm"
                variant={user.role === role ? 'primary' : 'secondary'}
                onClick={() => updateUser({ role })}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shown when logged out: calls login() from the context
function LoginPanel() {
  const { login } = useUser();
  const [name, setName] = useState(''); // local state: only this form cares about it

  const handleSubmit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    if (name.trim()) login(name.trim());
  };

  return (
    <form className="box stack" onSubmit={handleSubmit}>
      <span className="box-label">{'<LoginPanel>'} calls login()</span>
      <div className="row ctx-login-row">
        <Input label="Your name" placeholder="e.g. Grace Hopper" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" icon={<LogIn size={14} />} disabled={!name.trim()}>
          Log in
        </Button>
      </div>
    </form>
  );
}

// Decides what to show based on the context value (conditional rendering)
function AppBody() {
  const { user } = useUser();
  return user ? <SettingsPage /> : <LoginPanel />;
}

export default function UpdateFromChildExample() {
  return (
    <UserProvider>
      <div className="ctx-app stack">
        <AppHeader />
        <AppBody />
        <p className="muted small">
          Try typing a new name or switching role: the header updates even though it is a sibling of the form.
          {' '}<Badge tone="info">Log out</Badge> swaps the whole body to the login panel.
        </p>
      </div>
    </UserProvider>
  );
}
