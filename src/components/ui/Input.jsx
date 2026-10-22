/**
 * Input - a labelled text input.
 *
 * Uses the useId() hook to connect <label htmlFor> with <input id>, so
 * clicking the label focuses the input and screen readers announce it.
 *
 *   <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
 *
 * Props: label, hint, error, plus any normal <input> prop (value, onChange, type...).
 * In React 19 `ref` is a normal prop, so <Input ref={myRef} /> also works.
 */
import { useId } from 'react';
import './Input.css';

export default function Input({ label, hint, error, className = '', ...rest }) {
  const id = useId(); // unique id like ":r3:" - stable across renders

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <input id={id} className={`field-input ${error ? 'has-error' : ''}`} {...rest} />
      {error ? <span className="field-error">{error}</span> : hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
