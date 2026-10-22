/**
 * UserDetail - rendered for the route "users/:userId".
 * ----------------------------------------------------------------------------
 * useParams() reads the dynamic segment from the URL:
 *   URL /patterns/react-router/users/3   ->   { userId: '3', ... }
 * (It also contains the params of parent routes: group and topicId.)
 *
 * Params are always STRINGS, so getUser() converts with Number().
 * useLocation().state shows hidden data passed by navigate(..., { state }).
 * ----------------------------------------------------------------------------
 */
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { LESSON_BASE } from '../../constants';
import { USERS, getUser } from '../../data/users';

export default function UserDetail() {
  const { userId } = useParams(); // 1. read ":userId" from the URL
  const { state } = useLocation(); // 2. optional hidden state
  const navigate = useNavigate();

  const user = getUser(userId);

  // 3. Invalid id in the URL -> show a friendly message (not a crash)
  if (!user) {
    return (
      <div className="rr-empty">
        <p>
          No user with id <code>{userId}</code>.
        </p>
        <Link to={`${LESSON_BASE}/users`}>← Back to all users</Link>
      </div>
    );
  }

  const index = USERS.indexOf(user);
  const prev = USERS[index - 1];
  const next = USERS[index + 1];

  return (
    <div className="rr-profile">
      {state?.welcome && <Badge tone="success">Welcome back! (state from navigate)</Badge>}
      {state?.from && !state.welcome && <Badge tone="info">came from: {state.from}</Badge>}

      <div className="row">
        <span className="rr-profile-emoji" aria-hidden>{user.emoji}</span>
        <div>
          <h4 className="rr-profile-name">{user.name}</h4>
          <span className="row small muted" style={{ gap: 4 }}>
            {user.role} · <MapPin size={13} /> {user.city}
          </span>
        </div>
      </div>
      <p className="small">{user.bio}</p>

      <div className="rr-param">
        useParams() → <code>{`{ userId: "${userId}" }`}</code>
      </div>

      {/* 4. Programmatic prev/next navigation */}
      <div className="row">
        <Button size="sm" variant="secondary" icon={<ChevronLeft />} disabled={!prev} onClick={() => navigate(`${LESSON_BASE}/users/${prev.id}`)}>
          Previous
        </Button>
        <Button size="sm" variant="secondary" disabled={!next} onClick={() => navigate(`${LESSON_BASE}/users/${next.id}`)}>
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
