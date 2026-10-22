/**
 * UserCard.jsx  (CHILD component)
 * ----------------------------------------------------------------------------
 * Receives everything it needs from its PARENT through props.
 *
 *   <UserCard user={user} compact={false} accent="primary" />
 *
 * Rules of props:
 *   - Props flow ONE way: parent -> child.
 *   - Props are READ-ONLY. The child must never do `props.user.name = ...`.
 *     If something must change, the parent changes its state and passes
 *     new props down - React then re-renders this child automatically.
 *   - Default values can be set right in the destructuring (compact = false).
 * ----------------------------------------------------------------------------
 */
import { Mail, MapPin } from 'lucide-react';
import { Badge, RenderCounter } from '@/components/ui';

export default function UserCard({ user, compact = false, accent = 'primary' }) {
  return (
    // The accent prop picks a CSS modifier class, e.g. "cc-user-card cc-accent-success"
    <div className={`cc-user-card cc-accent-${accent}`}>
      <div className="cc-user-top">
        <span className="cc-user-avatar">{user.name[0]}</span>
        <div className="cc-user-name">
          <strong>{user.name}</strong>
          <span className="muted small">{user.role}</span>
        </div>
        {/* Watch this number grow every time the parent passes new props */}
        <RenderCounter />
      </div>

      {/* A prop can switch parts of the UI on and off */}
      {!compact && (
        <div className="cc-user-details">
          <span>
            <Mail size={14} /> {user.email}
          </span>
          <span>
            <MapPin size={14} /> {user.city}
          </span>
          <div className="row" style={{ gap: 'var(--space-1)' }}>
            {user.skills.map((skill) => (
              <Badge key={skill} tone={accent}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
