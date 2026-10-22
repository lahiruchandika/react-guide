/**
 * PropDrillingExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: the PROP DRILLING problem, and its fix with Context.
 *
 * Switch between the two modes and compare the nested boxes:
 *   - "Prop drilling": the yellow boxes receive `user` only to pass it on.
 *   - "Context":       the middle boxes are clean; the deepest component
 *                      reads the value directly with useContext().
 *
 * Switching the user shows that in both modes the data reaches the bottom.
 *
 * File relationship:
 *   examples/PropDrillingExample.jsx
 *     --imports--> components/prop-drilling/DrilledTree.jsx --> LevelBox.jsx
 *     --imports--> components/prop-drilling/ContextTree.jsx --> LevelBox.jsx, UserContext.js
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Button } from '@/components/ui';
import DrilledTree from '../components/prop-drilling/DrilledTree';
import ContextTree from '../components/prop-drilling/ContextTree';

const USERS = [
  { id: 1, name: 'Maya Fernando', email: 'maya@example.com', avatar: '🦊' },
  { id: 2, name: 'Liam Chen', email: 'liam@example.com', avatar: '🐼' },
];

export default function PropDrillingExample() {
  const [mode, setMode] = useState('drilling'); // 'drilling' | 'context'
  const [userIndex, setUserIndex] = useState(0);
  const user = USERS[userIndex];

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        {/* Segmented control to choose the mode */}
        <div className="cc-segment" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'drilling'} className={mode === 'drilling' ? 'is-active' : ''} onClick={() => setMode('drilling')}>
            😩 Prop drilling
          </button>
          <button type="button" role="tab" aria-selected={mode === 'context'} className={mode === 'context' ? 'is-active' : ''} onClick={() => setMode('context')}>
            😌 Context (the fix)
          </button>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setUserIndex((i) => (i + 1) % USERS.length)}>
          Switch user ({user.avatar} {user.name.split(' ')[0]})
        </Button>
      </div>

      {/* Same data, two different ways of getting it to <UserMenu> */}
      {mode === 'drilling' ? <DrilledTree user={user} /> : <ContextTree user={user} />}

      <p className="small muted" style={{ margin: 0 }}>
        {mode === 'drilling'
          ? '⚠️ 2 of the 4 components receive a prop they never use. Imagine 10 levels and 5 props...'
          : '✅ Only the provider and the consumer know about user. Middle components stay simple.'}
      </p>
    </div>
  );
}
