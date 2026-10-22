/**
 * JsonObjectsExample - storing objects and arrays with JSON.
 * ----------------------------------------------------------------------------
 * localStorage can only store STRINGS. If you give it an object, JavaScript
 * calls .toString() on it and you get the useless text "[object Object]".
 *
 *   Save:  localStorage.setItem('profile', JSON.stringify(profile));
 *   Load:  const profile = JSON.parse(localStorage.getItem('profile'));
 *
 * The demo stores the same profile both ways so you can compare.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const BAD_KEY = 'demo:profile-no-json';
const GOOD_KEY = 'demo:profile-json';

export default function JsonObjectsExample() {
  // The object we want to persist (edit it with the inputs).
  const [profile, setProfile] = useState({ name: 'Grace', age: 36, skills: ['React', 'CSS'] });

  // What is actually stored, and what we get back - shown on screen.
  // (arrow function = lazy initializer, so storage is read only on the first render)
  const [stored, setStored] = useState(() => ({ bad: localStorage.getItem(BAD_KEY), good: localStorage.getItem(GOOD_KEY) }));
  const [loaded, setLoaded] = useState(null);

  // Update one field of the object (copy it - never mutate state directly).
  const updateField = (field, fieldValue) => setProfile((p) => ({ ...p, [field]: fieldValue }));

  const saveBoth = () => {
    // WRONG: the object is turned into the string "[object Object]"
    localStorage.setItem(BAD_KEY, profile);
    // RIGHT: JSON.stringify turns the object into a JSON string first
    localStorage.setItem(GOOD_KEY, JSON.stringify(profile));
    setStored({ bad: localStorage.getItem(BAD_KEY), good: localStorage.getItem(GOOD_KEY) });
    setLoaded(null);
  };

  const loadBack = () => {
    const raw = localStorage.getItem(GOOD_KEY);
    // JSON.parse turns the string back into a real object.
    // Wrap it in try/catch: invalid JSON would throw an error.
    try {
      const parsed = raw === null ? null : JSON.parse(raw);
      setLoaded({ value: parsed, type: Array.isArray(parsed) ? 'array' : typeof parsed });
    } catch {
      setLoaded({ value: 'Invalid JSON!', type: 'error' });
    }
  };

  return (
    <div className="stack">
      <div className="grid-3">
        <Input label="name" value={profile.name} onChange={(e) => updateField('name', e.target.value)} />
        <Input label="age" type="number" value={profile.age} onChange={(e) => updateField('age', Number(e.target.value))} />
        <Input
          label="skills (comma separated)"
          value={profile.skills.join(', ')}
          onChange={(e) => updateField('skills', e.target.value.split(',').map((s) => s.trim()))}
        />
      </div>

      <div className="row">
        <Button onClick={saveBoth}>Save both ways</Button>
        <Button variant="secondary" onClick={loadBack} disabled={stored.good === null}>
          Load with JSON.parse
        </Button>
      </div>

      <div className="grid-2">
        <div className="box ls-result ls-result-bad">
          <span className="box-label row"><CircleX size={14} /> setItem(key, profile)</span>
          <pre className="ls-pre">{stored.bad ?? '(not saved yet)'}</pre>
        </div>
        <div className="box ls-result ls-result-good">
          <span className="box-label row"><CircleCheck size={14} /> setItem(key, JSON.stringify(profile))</span>
          <pre className="ls-pre">{stored.good ?? '(not saved yet)'}</pre>
        </div>
      </div>

      {loaded && (
        <div className="box">
          <span className="box-label">JSON.parse(...) -&gt; typeof: {loaded.type}</span>
          <pre className="ls-pre">{JSON.stringify(loaded.value, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
