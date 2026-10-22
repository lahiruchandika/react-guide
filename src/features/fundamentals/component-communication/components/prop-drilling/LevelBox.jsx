/**
 * LevelBox.jsx
 * ----------------------------------------------------------------------------
 * A purely visual helper: draws one "component" as a labelled, nested box so
 * you can SEE the component tree and which levels touch the `user` prop.
 *
 *   <LevelBox name="<Sidebar>" role="forwards" note="passes user down">
 *     ...children (the next level)...
 *   </LevelBox>
 *
 * role: 'owner' | 'forwards' | 'uses' | 'none'  -> picks color + badge text
 * ----------------------------------------------------------------------------
 */
import { Badge } from '@/components/ui';

// Lookup object: role -> badge tone + label
const ROLES = {
  owner: { tone: 'primary', label: 'owns the state' },
  forwards: { tone: 'warning', label: 'only forwards the prop' },
  uses: { tone: 'success', label: 'actually uses it' },
  none: { tone: 'neutral', label: 'no user prop' },
};

export default function LevelBox({ name, role = 'none', note, children }) {
  const { tone, label } = ROLES[role];

  return (
    <div className={`cc-level cc-level-${role}`}>
      <div className="cc-level-head">
        <code className="cc-level-name">{name}</code>
        <Badge tone={tone}>{label}</Badge>
        {note && <span className="cc-level-note">{note}</span>}
      </div>
      {children}
    </div>
  );
}
