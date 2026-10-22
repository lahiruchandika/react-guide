/**
 * UserAvatar - a small, reusable component that reads the user from context.
 *
 * Notice: it receives NO `user` prop. Wherever you place it (inside a
 * <UserProvider>), it can find the current user by itself with useUser().
 */
import { useUser } from '../context/UserContext';
import '../UseContextPage.css';

export default function UserAvatar({ size = 36, showName = false }) {
  const { user } = useUser(); // consume the context - no props needed!

  // Logged out: show a neutral placeholder
  if (!user) {
    return (
      <span className="ctx-avatar ctx-avatar-empty" style={{ width: size, height: size }}>
        ?
      </span>
    );
  }

  // First letters of the name, e.g. "Ada Lovelace" -> "AL"
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <span className="ctx-avatar-wrap">
      <span className="ctx-avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
        {initials || '?'}
      </span>
      {showName && (
        <span className="ctx-avatar-text">
          <strong>{user.name || 'Anonymous'}</strong>
          <span className="muted small">{user.role}</span>
        </span>
      )}
    </span>
  );
}
