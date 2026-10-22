/**
 * UsersLayout - a LAYOUT ROUTE: the user list on the left + <Outlet /> on the right.
 * ----------------------------------------------------------------------------
 * <Outlet /> is a placeholder: React Router renders the matching CHILD route
 * there.
 *   /users     -> <Outlet /> renders <UsersIndex />   (index route)
 *   /users/3   -> <Outlet /> renders <UserDetail />   (path ":userId")
 *
 * The list stays on screen (and keeps its state, e.g. the filter text) while
 * only the right side changes - that's the power of nested routes.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LESSON_BASE } from '../../constants';
import { USERS } from '../../data/users';

export default function UsersLayout() {
  // This state survives navigating between users, because the layout stays mounted
  const [filter, setFilter] = useState('');
  const visible = USERS.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="rr-users">
      <aside className="rr-users-list">
        <input
          className="rr-mini-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter users..."
          aria-label="Filter users"
        />
        {visible.map((user) => (
          <NavLink
            key={user.id}
            to={`${LESSON_BASE}/users/${user.id}`}
            className={({ isActive }) => `rr-user-link ${isActive ? 'active' : ''}`}
          >
            <span aria-hidden>{user.emoji}</span> {user.name}
          </NavLink>
        ))}
      </aside>

      <section className="rr-users-detail">
        {/* The child route renders here */}
        <Outlet />
      </section>
    </div>
  );
}
