/**
 * SignUpFormExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: a complete, real-world form.
 *
 *   - ONE state object for all fields + ONE generic handleChange (uses e.target.name)
 *   - onSubmit on the <form> + e.preventDefault() (stops the page reload)
 *   - Validation in a separate pure function (utils/validateSignUp.js)
 *   - Errors shown only after a field was "touched" (onBlur) or on submit
 *   - A "submitting" state that disables the button, then a result preview
 *
 * Files used:
 *   examples/SignUpFormExample.jsx     <- this file (the form logic)
 *   components/PasswordStrength.jsx    <- strength meter
 *   components/SubmittedPreview.jsx    <- success screen
 *   utils/validateSignUp.js            <- validation rules
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, Input, Spinner, Badge } from '@/components/ui';
import PasswordStrength from '../components/PasswordStrength';
import SubmittedPreview from '../components/SubmittedPreview';
import { validateSignUp } from '../utils/validateSignUp';

// The starting values. Every input's `name` attribute matches a key here.
const INITIAL_VALUES = {
  fullName: '',
  email: '',
  password: '',
  confirm: '',
  role: '',
  terms: false,
};

export default function SignUpFormExample() {
  const [values, setValues] = useState(INITIAL_VALUES); // all field values
  const [touched, setTouched] = useState({});           // which fields the user has left
  const [status, setStatus] = useState('idle');         // 'idle' | 'submitting' | 'done'
  const [submitted, setSubmitted] = useState(null);     // the data that was sent

  // Errors are DERIVED from values on every render - no need to store them.
  const errors = validateSignUp(values);
  const isValid = Object.keys(errors).length === 0;

  // Show a field's error only after the user touched it.
  const errorFor = (field) => (touched[field] ? errors[field] : undefined);

  // 1. ONE handler for every input. The input's `name` tells us which key to update.
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev, // keep the other fields
      [name]: type === 'checkbox' ? checked : value, // checkbox -> boolean
    }));
  }

  // 2. Mark a field as touched when it loses focus.
  function handleBlur(e) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  // 3. Submit handler on the <form>. Runs on button click AND on Enter.
  function handleSubmit(e) {
    e.preventDefault(); // ❗ without this the browser reloads the page

    // Mark every field as touched so all errors become visible
    setTouched(Object.fromEntries(Object.keys(INITIAL_VALUES).map((key) => [key, true])));
    if (!isValid) return; // stop here if anything is wrong

    // Pretend to call an API (no network needed)
    setStatus('submitting');
    setTimeout(() => {
      setSubmitted(values);
      setStatus('done');
    }, 900);
  }

  function handleReset() {
    setValues(INITIAL_VALUES);
    setTouched({});
    setSubmitted(null);
    setStatus('idle');
  }

  // What the debug panel shows (passwords masked with dots)
  const debugState = {
    values: { ...values, password: '•'.repeat(values.password.length), confirm: '•'.repeat(values.confirm.length) },
    touched,
  };

  // Show the success screen after submitting (an "early return")
  if (status === 'done' && submitted) {
    return <SubmittedPreview data={submitted} onReset={handleReset} />;
  }

  return (
    <div className="ef-signup">
      {/* noValidate: we do our own validation instead of the browser's popups */}
      <form className="ef-form" onSubmit={handleSubmit} noValidate>
        <div className="grid-2">
          <Input
            label="Full name"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('fullName')}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('email')}
            placeholder="ada@example.com"
            autoComplete="email"
          />
        </div>

        <div className="grid-2">
          <div className="stack ef-tight">
            <Input
              label="Password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errorFor('password')}
              autoComplete="new-password"
            />
            <PasswordStrength password={values.password} />
          </div>
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            value={values.confirm}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorFor('confirm')}
            autoComplete="new-password"
          />
        </div>

        <label className="field">
          <span className="field-label">I am a…</span>
          <select className="select" name="role" value={values.role} onChange={handleChange} onBlur={handleBlur}>
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
          </select>
          {errorFor('role') && <span className="field-error">{errorFor('role')}</span>}
        </label>

        <label className="field">
          <span className="row small">
            <input type="checkbox" name="terms" checked={values.terms} onChange={handleChange} onBlur={handleBlur} />
            I accept the terms and conditions
          </span>
          {errorFor('terms') && <span className="field-error">{errorFor('terms')}</span>}
        </label>

        {/* type="submit" triggers the form's onSubmit */}
        <Button type="submit" disabled={status === 'submitting'} icon={status === 'submitting' ? <Spinner size={14} /> : <UserPlus size={16} />}>
          {status === 'submitting' ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      {/* Live view of the form's state, for learning */}
      <aside className="ef-state">
        <div className="row">
          <span className="box-label">form state</span>
          <Badge tone={isValid ? 'success' : 'warning'}>{isValid ? 'valid' : `${Object.keys(errors).length} errors`}</Badge>
        </div>
        <pre className="ef-json">{JSON.stringify(debugState, null, 2)}</pre>
      </aside>
    </div>
  );
}
