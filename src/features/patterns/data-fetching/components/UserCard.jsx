/**
 * UserCard - displays one user. Receives everything through props.
 *
 *   <UserCard user={user} />
 *   <UserCard user={null} loading />   shows a skeleton placeholder
 */
import { Building2, Mail, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui';

const ROLE_TONE = { Admin: 'danger', Editor: 'warning', Viewer: 'info' };

export default function UserCard({ user, loading = false }) {
  // Skeleton: grey placeholder blocks while the first load is in progress.
  if (!user) {
    return (
      <div className="df-user is-skeleton" aria-busy={loading}>
        <span className="df-avatar df-skel" />
        <div className="stack" style={{ flex: 1, gap: 8 }}>
          <span className="df-skel" style={{ width: '60%', height: 14 }} />
          <span className="df-skel" style={{ width: '80%', height: 10 }} />
          <span className="df-skel" style={{ width: '40%', height: 10 }} />
        </div>
      </div>
    );
  }

  // Initials for the avatar, e.g. "Leanne Graham" -> "LG"
  const initials = user.name.split(' ').map((part) => part[0]).join('');

  return (
    <div className={`df-user ${loading ? 'is-loading' : ''}`}>
      <span className="df-avatar">{initials}</span>
      <div className="df-user-info">
        <div className="row" style={{ gap: 8 }}>
          <strong>{user.name}</strong>
          {user.role && <Badge tone={ROLE_TONE[user.role] ?? 'neutral'}>{user.role}</Badge>}
        </div>
        <span className="df-user-line"><Mail size={13} /> {user.email}</span>
        <span className="df-user-line"><MapPin size={13} /> {user.city}</span>
        {user.company && <span className="df-user-line"><Building2 size={13} /> {user.company}</span>}
      </div>
    </div>
  );
}
