/**
 * ComposingExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: splitting a UI into components in SEPARATE FILES and
 * composing them together.
 *
 *   components/
 *   ├── ProfileCard.jsx    <- the parent, uses the three below
 *   ├── Avatar.jsx
 *   ├── UserInfo.jsx
 *   └── ProfileStats.jsx
 *
 * Turn on "Show component outlines" to SEE where each component starts
 * and ends on the screen. (See all files in the Code tab.)
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui';
import ProfileCard from '../components/ProfileCard'; // 1. import the component from its own file

// Data lives outside the component (it never changes, so no state needed).
const USERS = [
  {
    id: 1,
    name: 'Grace Hopper',
    role: 'Compiler Engineer',
    location: 'New York, USA',
    color: 'var(--color-primary)',
    stats: [
      { label: 'Projects', value: 42 },
      { label: 'Followers', value: '12k' },
      { label: 'Talks', value: 87 },
    ],
  },
  {
    id: 2,
    name: 'Alan Turing',
    role: 'Research Scientist',
    location: 'London, UK',
    color: 'var(--color-accent)',
    stats: [
      { label: 'Projects', value: 18 },
      { label: 'Followers', value: '9.4k' },
      { label: 'Papers', value: 31 },
    ],
  },
];

export default function ComposingExample() {
  const [showOutlines, setShowOutlines] = useState(false);

  return (
    <div className="stack">
      <div className="row">
        <Button
          size="sm"
          variant={showOutlines ? 'primary' : 'secondary'}
          icon={<Layers size={14} />}
          onClick={() => setShowOutlines((on) => !on)}
        >
          {showOutlines ? 'Hide' : 'Show'} component outlines
        </Button>
        <span className="muted small">Same &lt;ProfileCard /&gt; component, different data.</span>
      </div>

      {/* 2. A class on the wrapper turns on the outline styles (see ComponentsJsxPage.css) */}
      <div className={showOutlines ? 'grid-2 cj-outlines' : 'grid-2'}>
        {USERS.map((user) => (
          // 3. Reuse the composed component for every user
          <ProfileCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
