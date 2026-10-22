/**
 * PasswordStrength.jsx
 * ----------------------------------------------------------------------------
 * A small presentational component: shows a 4-segment strength meter.
 * It receives the password as a prop and DERIVES the score - no state needed.
 * ----------------------------------------------------------------------------
 */
import { passwordScore } from '../utils/validateSignUp';

const LABELS = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const TONES = ['none', 'danger', 'warning', 'info', 'success'];

export default function PasswordStrength({ password }) {
  const score = passwordScore(password); // 0..4, recalculated every render

  return (
    <div className="ef-strength" aria-live="polite">
      <div className="ef-strength-bars">
        {[1, 2, 3, 4].map((n) => (
          // A segment is "filled" when the score reaches it
          <span key={n} className={n <= score ? `ef-bar ef-bar-${TONES[score]}` : 'ef-bar'} />
        ))}
      </div>
      <span className="small muted">{password ? LABELS[score] : 'Use 8+ chars, a number, A-z and a symbol'}</span>
    </div>
  );
}
