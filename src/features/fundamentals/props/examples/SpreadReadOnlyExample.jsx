/**
 * SpreadReadOnlyExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES:
 *   A) Spreading an object as props:   <ContactRow {...contact} />
 *      is the same as  <ContactRow name={contact.name} email={contact.email} ... />
 *   B) "Rest" props: pick the props you need, forward everything else:
 *      function TextField({ label, ...inputProps }) { return <input {...inputProps} /> }
 *   C) Props are READ-ONLY. A child must never change them. To change data,
 *      the child asks the parent (via a function prop) to update its state.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Mail, Phone, Lock, Unlock } from 'lucide-react';
import { Button, Badge } from '@/components/ui';

// ---------------------------------------------------------------- A) spread
const CONTACTS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', phone: '+1 555 0101', team: 'Design' },
  { id: 2, name: 'Diego Alvarez', email: 'diego@example.com', phone: '+1 555 0144', team: 'Engineering' },
];

function ContactRow({ name, email, phone, team }) {
  return (
    <div className="pr-contact">
      <div>
        <strong>{name}</strong> <Badge tone="primary">{team}</Badge>
      </div>
      <div className="small muted row">
        <span className="row pr-gap-1"><Mail size={13} /> {email}</span>
        <span className="row pr-gap-1"><Phone size={13} /> {phone}</span>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ B) rest props
// `label` is used here; ALL other props (placeholder, type, maxLength,
// value, onChange...) are collected in `inputProps` and forwarded to <input>.
function TextField({ label, ...inputProps }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className="field-input" {...inputProps} />
    </label>
  );
}

// ------------------------------------------------------- C) props read-only
// We use `props` (not destructured) here so the mutation attempt is obvious.
function ScoreCard(props) {
  const [message, setMessage] = useState('');

  function tryToMutate() {
    try {
      // ❌ NEVER do this. In development React freezes props, so this throws.
      props.score = props.score + 1;
      setMessage('No error (production build), but the parent state did NOT change - the change is lost on the next render.');
    } catch (error) {
      setMessage(`TypeError: ${error.message}`);
    }
  }

  return (
    <div className="pr-score">
      <div className="small muted">Child sees props.score</div>
      <div className="big-number">{props.score}</div>
      <div className="row">
        <Button size="sm" variant="danger" icon={<Lock size={14} />} onClick={tryToMutate}>
          props.score++ (wrong)
        </Button>
        {/* ✅ The right way: ask the parent to change ITS state */}
        <Button size="sm" icon={<Unlock size={14} />} onClick={props.onIncrease}>
          onIncrease() (right)
        </Button>
      </div>
      {message && <p className="pr-error small">{message}</p>}
    </div>
  );
}

export default function SpreadReadOnlyExample() {
  const [search, setSearch] = useState('');
  const [score, setScore] = useState(10); // the parent OWNS the score

  return (
    <div className="stack">
      <div className="grid-2">
        <div className="stack">
          <span className="box-label">A) {'<ContactRow {...contact} />'}</span>
          {CONTACTS.map((contact) => (
            // key is NOT part of props - React uses it, the child never sees it
            <ContactRow key={contact.id} {...contact} />
          ))}
        </div>

        <div className="stack">
          <span className="box-label">B) {'function TextField({ label, ...inputProps })'}</span>
          <TextField
            label="Search contacts"
            placeholder="Forwarded via ...inputProps"
            type="search"
            maxLength={20}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="small muted">
            placeholder, type, maxLength, value and onChange were all forwarded to the real &lt;input&gt;.
            Typed: <strong>{search || '—'}</strong> ({search.length}/20)
          </p>
        </div>
      </div>

      <div className="box">
        <span className="box-label">C) props are read-only · parent state: score = {score}</span>
        <ScoreCard score={score} onIncrease={() => setScore((s) => s + 1)} />
      </div>
    </div>
  );
}
