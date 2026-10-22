/**
 * FormField - a reusable, accessible form field.
 * ----------------------------------------------------------------------------
 * ONE call to useId() gives this field instance a unique base id, e.g. "«r5»".
 * From it we build every id the field needs:
 *
 *   «r5»-input   -> <input id>           linked from <label htmlFor>
 *   «r5»-hint    -> helper text          linked via aria-describedby
 *   «r5»-error   -> error message        linked via aria-describedby + aria-invalid
 *
 * Because each instance calls useId() itself, you can render <FormField>
 * 10 times on one page and the ids will NEVER collide.
 * ----------------------------------------------------------------------------
 */
import { useId } from 'react';

export default function FormField({ label, hint, error, showIds = false, ...inputProps }) {
  const id = useId(); // 1. unique + stable for this component instance

  // 2. Derive related ids from the same base (one useId call is enough)
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  // 3. aria-describedby can list several ids separated by spaces.
  //    Screen readers read the label, then the hint, then the error.
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field uid-field">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>

      <input
        id={inputId}
        className={`field-input ${error ? 'has-error' : ''}`}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        {...inputProps}
      />

      {hint && (
        <span id={hintId} className="field-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}

      {/* Teaching aid: reveal the generated ids */}
      {showIds && (
        <code className="uid-id-tag">
          id="{inputId}"{describedBy && ` aria-describedby="${describedBy}"`}
        </code>
      )}
    </div>
  );
}
