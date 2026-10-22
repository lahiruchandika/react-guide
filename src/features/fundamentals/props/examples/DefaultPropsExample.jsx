/**
 * DefaultPropsExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: destructuring props and giving them DEFAULT values.
 *
 *   function UserBadge({ name = 'Guest', role = 'Viewer', online = false }) { ... }
 *
 * If the parent does not pass a prop (or passes undefined), the default is used.
 * Note: passing null does NOT trigger the default - only undefined does.
 *
 * (Old class-component "defaultProps" is removed for function components in
 * React 19 - default parameters are the modern way.)
 * ----------------------------------------------------------------------------
 */
import { Badge } from '@/components/ui';

// --- The child: destructuring + defaults in one line ------------------------
function UserBadge({ name = 'Guest', role = 'Viewer', online = false, size = 'md' }) {
  return (
    <div className={`pr-userbadge pr-userbadge-${size}`}>
      {/* the dot color depends on the boolean prop */}
      <span className={online ? 'pr-dot online' : 'pr-dot'} />
      <div>
        <strong>{name}</strong>
        <div className="small muted">{role}</div>
      </div>
    </div>
  );
}

// --- The same component WITHOUT destructuring, for comparison --------------
// function UserBadge(props) {
//   const name = props.name ?? 'Guest';
//   return <strong>{props.name}</strong> ...
// }  -> more typing, harder to see which props exist.

// Each row: the JSX we write (as text) + the result.
const USAGES = [
  { code: '<UserBadge />', element: <UserBadge />, note: 'all defaults' },
  { code: '<UserBadge name="Lina" />', element: <UserBadge name="Lina" />, note: 'role & online use defaults' },
  { code: '<UserBadge name="Omar" role="Admin" online />', element: <UserBadge name="Omar" role="Admin" online />, note: '"online" alone means true' },
  {
    code: '<UserBadge name="Mia" role="Editor" online size="lg" />',
    element: <UserBadge name="Mia" role="Editor" online size="lg" />,
    note: 'every prop passed',
  },
  { code: '<UserBadge name={undefined} />', element: <UserBadge name={undefined} />, note: 'undefined → default' },
];

export default function DefaultPropsExample() {
  return (
    <div className="pr-usages">
      {USAGES.map((usage) => (
        // the code string is unique, so it works as a key
        <div key={usage.code} className="pr-usage">
          <code className="pr-usage-code">{usage.code}</code>
          <div className="pr-usage-result">{usage.element}</div>
          <Badge tone="info">{usage.note}</Badge>
        </div>
      ))}
    </div>
  );
}
