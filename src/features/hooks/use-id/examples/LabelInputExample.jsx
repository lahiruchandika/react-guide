/**
 * LabelInputExample
 * ----------------------------------------------------------------------------
 * The most basic use of useId: connect a <label> to its <input>.
 *
 *   <label htmlFor={id}>   <- in JSX it's "htmlFor" because "for" is a JS keyword
 *   <input id={id} />
 *
 * Why it matters:
 *   - clicking the label focuses / toggles the input (bigger click target)
 *   - screen readers announce the label when the input is focused
 *
 * Click the label TEXT (not the box) and see the input respond.
 * ----------------------------------------------------------------------------
 */
import { useId, useState } from 'react';
import { Badge } from '@/components/ui';

export default function LabelInputExample() {
  const emailId = useId(); // 1. one id for the text input
  const termsId = useId(); // 2. another id for the checkbox (each call is unique)

  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="field">
          {/* 3. htmlFor must match the input id exactly */}
          <label htmlFor={emailId} className="field-label uid-clickable">
            Email address (click me)
          </label>
          <input
            id={emailId}
            type="email"
            className="field-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="uid-check">
          <input id={termsId} type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor={termsId} className="uid-clickable">
            I agree to the terms (click this text)
          </label>
          <Badge tone={agreed ? 'success' : 'neutral'}>{agreed ? 'agreed' : 'not yet'}</Badge>
        </div>
      </div>

      {/* Show the HTML React actually produced */}
      <div className="uid-html">
        <span className="box-label">Rendered HTML</span>
        <pre>
          {`<label for="${emailId}">Email...</label>\n<input id="${emailId}" />\n\n<input id="${termsId}" type="checkbox" />\n<label for="${termsId}">I agree...</label>`}
        </pre>
        <p className="muted small">
          The ids look odd on purpose (React picks a format that is unlikely to clash with ids you write by hand).
          Never rely on their exact format.
        </p>
      </div>
    </div>
  );
}
