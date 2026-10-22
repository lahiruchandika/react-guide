/**
 * StringsBooleansExample
 * ----------------------------------------------------------------------------
 * State can hold ANY value. Here we use strings (text inputs) and booleans
 * (toggles) to build a small "sign up" form with a live preview card.
 *
 * What it demonstrates:
 *   - String state + a "controlled input": value={name} onChange={...}
 *   - Boolean state + toggling with !previous
 *   - Using a boolean to show / hide UI (password visibility, preview)
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Badge, Button, Card, Input } from '@/components/ui';
import '../UseStatePage.css';

export default function StringsBooleansExample() {
  // String state - starts empty.
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Boolean state - perfect for on/off things.
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="grid-2">
      {/* A <form> wrapper keeps the browser happy about the password field (onSubmit is blocked). */}
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        {/* Controlled input: React state is the "single source of truth".
            Every keystroke -> onChange -> setName -> re-render with new value. */}
        <Input
          label="Your name"
          placeholder="e.g. Ada Lovelace"
          autoComplete="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="us-password-row">
          <Input
            label="Password"
            // The boolean decides the input type.
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint={`${password.length} characters`}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={showPassword ? <EyeOff /> : <Eye />}
            // Toggle: flip true <-> false. The updater form (prev => !prev)
            // is the safest way to toggle (see example 5 for why).
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </div>

        <label className="us-switch">
          {/* For checkboxes we read e.target.checked (a boolean), not value */}
          <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
          <span>Subscribe to the newsletter</span>
        </label>
      </form>

      {/* Live preview - it simply reads the current state on every render */}
      <Card title="Live preview">
        <div className="stack">
          <div className="us-avatar">{name ? name[0].toUpperCase() : '?'}</div>
          <strong>{name.trim() || 'Anonymous'}</strong>
          <span className="muted small">Password: {showPassword ? password || '(empty)' : '•'.repeat(password.length) || '(empty)'}</span>
          <div>
            <Badge tone={newsletter ? 'success' : 'neutral'}>
              {newsletter ? 'Subscribed' : 'Not subscribed'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
