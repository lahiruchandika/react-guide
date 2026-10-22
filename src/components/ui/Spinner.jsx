/**
 * Spinner - a small loading indicator.
 *   <Spinner />            default 20px
 *   <Spinner size={32} />
 */
import './Spinner.css';

export default function Spinner({ size = 20, label = 'Loading...' }) {
  return (
    <span className="spinner-wrap" role="status" aria-label={label}>
      <span className="spinner" style={{ width: size, height: size }} />
    </span>
  );
}
