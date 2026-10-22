/**
 * AsyncTransitionExample (React 19 "Actions")
 * ----------------------------------------------------------------------------
 * Since React 19, startTransition accepts an ASYNC function. isPending stays
 * true for the whole async operation - no manual `isLoading` state needed.
 *
 *   startTransition(async () => {
 *     const saved = await saveName(name);           // isPending = true meanwhile
 *     startTransition(() => setSavedName(saved));   // updates AFTER await need their own startTransition
 *   });
 *
 * The "server" is a local mock with setTimeout, so no network is needed.
 * Type a name containing "error" to see the failure path.
 * ----------------------------------------------------------------------------
 */
import { useState, useTransition } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { Button, Callout, Input } from '@/components/ui';

// Mock API: resolves after 1.2s, rejects if the name contains "error"
function saveName(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name.toLowerCase().includes('error')) reject(new Error('Server rejected that name.'));
      else resolve(name.trim());
    }, 1200);
  });
}

export default function AsyncTransitionExample() {
  const [name, setName] = useState('Ada'); // the input value
  const [savedName, setSavedName] = useState('Ada'); // what the "server" confirmed
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    // 1. An async transition: isPending is true until this function finishes
    startTransition(async () => {
      try {
        const saved = await saveName(name);
        // 2. State updates after an await must be wrapped again (current React limitation)
        startTransition(() => setSavedName(saved));
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="grid-2">
      <div className="stack">
        <Input
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint='Tip: include the word "error" to simulate a failure.'
        />
        <div className="row">
          {/* 3. isPending drives the loading UI */}
          <Button icon={<Save size={16} />} onClick={handleSave} disabled={isPending || !name.trim()}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          {isPending && <span className="muted small">talking to the mock server...</span>}
        </div>
        {error && (
          <Callout type="warning" title="Save failed">
            {error}
          </Callout>
        )}
      </div>

      <div className={`utr-profile ${isPending ? 'utr-stale' : ''}`}>
        <span className="box-label">Saved profile</span>
        <div className="row">
          <span className="utr-profile-avatar">{savedName.charAt(0).toUpperCase() || '?'}</span>
          <div>
            <strong>{savedName}</strong>
            <div className="small muted row">
              <CheckCircle2 size={14} /> confirmed by server
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
