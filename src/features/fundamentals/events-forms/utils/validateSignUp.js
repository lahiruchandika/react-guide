/**
 * validateSignUp.js
 * ----------------------------------------------------------------------------
 * Pure validation logic for the sign-up form, kept OUT of the component.
 *
 * Why a separate file?
 *   - The component stays focused on UI.
 *   - Plain functions are easy to test (no React needed).
 *
 * Takes the form values, returns an object of error messages:
 *   { email: 'Enter a valid email' }   ->  empty object {} means "valid"
 * ----------------------------------------------------------------------------
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignUp(values) {
  const errors = {};

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Please enter at least 2 characters.';
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/\d/.test(values.password)) {
    errors.password = 'Add at least one number.';
  }

  if (values.confirm !== values.password || !values.confirm) {
    errors.confirm = 'Passwords do not match.';
  }

  if (!values.role) {
    errors.role = 'Choose a role.';
  }

  if (!values.terms) {
    errors.terms = 'You must accept the terms.';
  }

  return errors;
}

/** Scores a password from 0 (empty) to 4 (strong). */
export function passwordScore(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}
