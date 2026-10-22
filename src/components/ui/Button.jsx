/**
 * Button - a reusable button with visual variants.
 *
 * Props:
 *   variant  'primary' | 'secondary' | 'ghost' | 'danger'   (default 'primary')
 *   size     'sm' | 'md'                                     (default 'md')
 *   icon     optional icon element shown before the text
 *   ...rest  any normal <button> prop (onClick, disabled, type...) is passed through
 *
 * Example:
 *   <Button variant="secondary" onClick={() => setCount(0)}>Reset</Button>
 */
import './Button.css';

export default function Button({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }) {
  // Build the class list from the props, e.g. "btn btn-primary btn-md"
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ');

  return (
    // type="button" stops the button from submitting a form by accident.
    <button type="button" className={classes} {...rest}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
