/**
 * UseToggleExample - one tiny hook, used in three different UI situations.
 * ----------------------------------------------------------------------------
 * Hook: src/hooks/useToggle.js  ->  const [value, toggle, setValue] = useToggle(false)
 *
 *   1. Show / hide a password
 *   2. An "email notifications" switch, plus an explicit "turn off" button
 *      that uses the third item (setValue)
 *   3. An FAQ accordion - every <FaqItem> (./components/FaqItem.jsx) calls
 *      useToggle on its own, so each item opens independently
 * ----------------------------------------------------------------------------
 */
import { Eye, EyeOff } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { useToggle } from '@/hooks';
import FaqItem from '../components/FaqItem';

const FAQS = [
  { id: 1, question: 'What is a custom hook?', answer: 'A JavaScript function whose name starts with "use" and that calls other hooks.' },
  { id: 2, question: 'Do components share the state?', answer: 'No. Every call creates separate state. Hooks share logic, not data.' },
  { id: 3, question: 'Where should I put them?', answer: 'Reusable ones in src/hooks/, feature-specific ones next to the feature.' },
];

export default function UseToggleExample() {
  // 1. Each useToggle call = an independent boolean.
  const [showPassword, toggleShowPassword] = useToggle(false);
  // 2. Destructure the 3rd item (setter) when you need to set an exact value.
  const [notifications, toggleNotifications, setNotifications] = useToggle(true);

  return (
    <div className="grid-2">
      <div className="stack">
        <Card title="Login">
          {/* Password inputs belong inside a <form> (browsers warn otherwise) */}
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Hidden username field: helps password managers and accessibility */}
            <input type="text" name="username" autoComplete="username" defaultValue="learner" hidden />
            <label className="field-label" htmlFor="ch-password">Password</label>
            <div className="ch-password">
              <input
                id="ch-password"
                className="field-input"
                // The toggle decides the input type:
                type={showPassword ? 'text' : 'password'}
                defaultValue="react-is-fun"
                autoComplete="current-password"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleShowPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Preferences">
          <div className="row ch-between">
            <span>Email notifications</span>
            {/* A switch built from a button + CSS; aria-pressed exposes its state */}
            <button
              type="button"
              className={`ch-switch ${notifications ? 'on' : ''}`}
              onClick={toggleNotifications}
              aria-pressed={notifications}
              aria-label="Email notifications"
            />
          </div>
          <div className="row ch-between" style={{ marginTop: 'var(--space-3)' }}>
            <Badge tone={notifications ? 'success' : 'neutral'}>{notifications ? 'ON' : 'OFF'}</Badge>
            <Button size="sm" variant="secondary" onClick={() => setNotifications(false)}>
              Turn off (setValue)
            </Button>
          </div>
        </Card>
      </div>

      <Card title="FAQ (each item has its own useToggle)">
        {FAQS.map((faq) => (
          <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </Card>
    </div>
  );
}
