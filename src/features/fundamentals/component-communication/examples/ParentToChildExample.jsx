/**
 * ParentToChildExample.jsx  (PARENT component)
 * ----------------------------------------------------------------------------
 * Demonstrates: PARENT -> CHILD communication with props.
 *
 * The parent owns the state (which user is selected, compact mode, accent
 * color) and passes it DOWN to <UserCard> as props. The child just displays
 * what it receives. Change anything here and the child re-renders with the
 * new props (see its render counter).
 *
 * File relationship:
 *   examples/ParentToChildExample.jsx   --imports-->   components/UserCard.jsx
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Button } from '@/components/ui';
import UserCard from '../components/UserCard';

const USERS = [
  { id: 1, name: 'Maya Fernando', role: 'UI Designer', email: 'maya@example.com', city: 'Colombo', skills: ['Figma', 'CSS'] },
  { id: 2, name: 'Liam Chen', role: 'React Developer', email: 'liam@example.com', city: 'Singapore', skills: ['React', 'Vite', 'Tests'] },
  { id: 3, name: 'Sara Ali', role: 'Product Manager', email: 'sara@example.com', city: 'Dubai', skills: ['Roadmaps', 'Research'] },
];

const ACCENTS = ['primary', 'success', 'warning', 'info'];

export default function ParentToChildExample() {
  // 1. The PARENT owns the data (state)
  const [userId, setUserId] = useState(1);
  const [compact, setCompact] = useState(false);
  const [accent, setAccent] = useState('primary');

  const selectedUser = USERS.find((u) => u.id === userId);

  return (
    <div className="grid-2">
      {/* ---------------- Parent's controls ---------------- */}
      <div className="box stack">
        <span className="box-label">Parent: ParentToChildExample (owns the state)</span>

        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="small muted">user</span>
          <div className="row" style={{ gap: 'var(--space-2)' }}>
            {USERS.map((u) => (
              <Button key={u.id} size="sm" variant={u.id === userId ? 'primary' : 'secondary'} onClick={() => setUserId(u.id)}>
                {u.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="stack" style={{ gap: 'var(--space-2)' }}>
          <span className="small muted">accent</span>
          <div className="row" style={{ gap: 'var(--space-2)' }}>
            {ACCENTS.map((a) => (
              <button
                key={a}
                type="button"
                className={`cc-swatch cc-accent-${a} ${a === accent ? 'is-active' : ''}`}
                onClick={() => setAccent(a)}
                aria-label={a}
                title={a}
              />
            ))}
          </div>
        </div>

        <label className="row small" style={{ gap: 'var(--space-2)', cursor: 'pointer' }}>
          <input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
          compact
        </label>

        {/* Show exactly which props the child receives */}
        <pre className="cc-props-preview">
          {`<UserCard\n  user={{ name: "${selectedUser.name}", ... }}\n  compact={${compact}}\n  accent="${accent}"\n/>`}
        </pre>
      </div>

      {/* ---------------- The child ---------------- */}
      <div className="box">
        <span className="box-label">Child: &lt;UserCard /&gt; (only reads props)</span>
        {/* 2. Pass data DOWN as props (like HTML attributes) */}
        <UserCard user={selectedUser} compact={compact} accent={accent} />
      </div>
    </div>
  );
}
