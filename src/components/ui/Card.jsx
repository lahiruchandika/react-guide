/**
 * Card - a simple surface container with an optional title.
 * Shows the "children" pattern: whatever you put between <Card> and </Card>
 * arrives here as the `children` prop.
 *
 *   <Card title="Profile">
 *     <p>Any content here</p>
 *   </Card>
 */
import './Card.css';

export default function Card({ title, actions, className = '', children }) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h4 className="card-title">{title}</h4>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
