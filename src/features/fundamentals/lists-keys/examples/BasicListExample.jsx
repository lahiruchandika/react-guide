/**
 * BasicListExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: turning an ARRAY into a list of elements with .map().
 *
 *   array.map((item) => <li key={item.id}>{item.name}</li>)
 *
 * .map() returns a NEW array of JSX elements, and React knows how to render
 * an array. Every element in that array needs a unique `key` prop.
 *
 * Two lists are shown:
 *   1. An array of strings   (the string itself is a fine key if unique)
 *   2. An array of objects   (use the object's id as key)
 * ----------------------------------------------------------------------------
 */
import { Badge } from '@/components/ui';

// 1. Simple array of unique strings
const SKILLS = ['JSX', 'Props', 'State', 'Effects', 'Context'];

// 2. Array of objects - the most common case in real apps
const TEAM = [
  { id: 101, name: 'Maya Fernando', role: 'Designer', online: true },
  { id: 102, name: 'Liam Chen', role: 'Frontend Developer', online: false },
  { id: 103, name: 'Sara Ali', role: 'Product Manager', online: true },
  { id: 104, name: 'Noah Perera', role: 'Backend Developer', online: true },
];

export default function BasicListExample() {
  // You can also derive values from the array before rendering.
  const onlineCount = TEAM.filter((member) => member.online).length;

  return (
    <div className="grid-2">
      {/* ---------------- 1. Strings ---------------- */}
      <div className="box" style={{ alignSelf: 'start' }}>
        <span className="box-label">SKILLS.map(skill =&gt; ...)</span>
        <div className="row">
          {/* The string is unique, so it can be the key */}
          {SKILLS.map((skill) => (
            <Badge key={skill} tone="primary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* ---------------- 2. Objects ---------------- */}
      <div className="box">
        <span className="box-label">
          TEAM.map(member =&gt; ...) &middot; {onlineCount}/{TEAM.length} online
        </span>
        <ul className="lk-team">
          {TEAM.map((member) => (
            // key goes on the OUTERMOST element returned by map()
            <li key={member.id} className="lk-team-row">
              <span className="lk-avatar">{member.name[0]}</span>
              <div className="lk-team-info">
                <strong>{member.name}</strong>
                <span className="muted small">{member.role}</span>
              </div>
              {/* Conditional rendering inside a list item */}
              <span className={member.online ? 'lk-dot is-online' : 'lk-dot'} title={member.online ? 'Online' : 'Offline'} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
