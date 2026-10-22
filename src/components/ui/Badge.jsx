/**
 * Badge - a small colored label.
 *
 *   <Badge tone="success">Saved</Badge>
 *
 * tone: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
 */
import './Badge.css';

export default function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
