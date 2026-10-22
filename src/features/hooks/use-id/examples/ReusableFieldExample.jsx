/**
 * ReusableFieldExample
 * ----------------------------------------------------------------------------
 * A sign-up form built from the SAME <FormField> component three times.
 * Each instance calls useId() internally, so every label, hint and error
 * is wired to the right input automatically - no ids passed as props.
 *
 * Toggle "Show generated ids" to see them, then submit the empty form to see
 * error messages connected with aria-describedby + aria-invalid.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button, Callout } from '@/components/ui';
import FormField from '../components/FormField';

const EMPTY = { name: '', email: '', password: '' };

// Simple validation: returns an object { fieldName: 'message' }
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.';
  if (values.password.length < 8) errors.password = 'At least 8 characters.';
  return errors;
}

export default function ReusableFieldExample() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showIds, setShowIds] = useState(true);
  const [done, setDone] = useState(false);

  // One change handler for all fields, using the input's "name" attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear that field's error while typing
    setDone(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setDone(Object.keys(found).length === 0);
  };

  return (
    <form className="stack uid-form" onSubmit={handleSubmit} noValidate>
      <label className="uid-check small">
        <input type="checkbox" checked={showIds} onChange={(e) => setShowIds(e.target.checked)} />
        Show generated ids
      </label>

      {/* Same component, three instances -> three different useId() values */}
      <FormField label="Full name" name="name" value={values.name} onChange={handleChange} error={errors.name} showIds={showIds} />
      <FormField
        label="Email"
        name="email"
        autoComplete="username"
        type="email"
        hint="We'll never share it."
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        showIds={showIds}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="Use 8 or more characters."
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        showIds={showIds}
      />

      <div className="row">
        <Button type="submit" icon={<UserPlus size={16} />}>
          Create account
        </Button>
        <Button variant="ghost" onClick={() => { setValues(EMPTY); setErrors({}); setDone(false); }}>
          Reset
        </Button>
      </div>

      {done && (
        <Callout type="success" title="Account created">
          Welcome, {values.name}! (Nothing was really sent.)
        </Callout>
      )}
    </form>
  );
}
