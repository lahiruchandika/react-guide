/**
 * UserInfo.jsx
 * ----------------------------------------------------------------------------
 * Shows the user's name, job title and location.
 * Another small "building block" that ProfileCard is composed from.
 * ----------------------------------------------------------------------------
 */
import { MapPin } from 'lucide-react';

export default function UserInfo({ name, role, location }) {
  return (
    <div className="cj-userinfo" data-component="UserInfo">
      <h4 className="cj-name">{name}</h4>
      <p className="cj-role">{role}</p>
      <p className="cj-location small muted">
        <MapPin size={13} /> {location}
      </p>
    </div>
  );
}
