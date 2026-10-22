/**
 * ProfileCard.jsx
 * ----------------------------------------------------------------------------
 * COMPOSITION: a bigger component built from smaller ones.
 *
 *   ProfileCard
 *   ├── Avatar        (./Avatar.jsx)
 *   ├── UserInfo      (./UserInfo.jsx)
 *   └── ProfileStats  (./ProfileStats.jsx)
 *
 * ProfileCard does not know HOW an avatar is drawn - it just uses <Avatar />.
 * Each piece can change independently. That is the core idea of React:
 * build UIs like LEGO from small, focused components.
 * ----------------------------------------------------------------------------
 */
import Avatar from './Avatar';
import UserInfo from './UserInfo';
import ProfileStats from './ProfileStats';

export default function ProfileCard({ user }) {
  return (
    <article className="cj-profile" data-component="ProfileCard">
      {/* 1. Each child component gets only the data it needs */}
      <Avatar name={user.name} color={user.color} />
      <UserInfo name={user.name} role={user.role} location={user.location} />
      <ProfileStats stats={user.stats} />
    </article>
  );
}
