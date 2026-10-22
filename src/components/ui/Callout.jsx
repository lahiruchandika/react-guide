/**
 * Callout - a highlighted note box for tips, warnings and info.
 *
 *   <Callout type="warning" title="Common mistake">
 *     Never call hooks inside if-statements.
 *   </Callout>
 */
import { Info, Lightbulb, TriangleAlert, CircleCheck } from 'lucide-react';
import './Callout.css';

// Map each type to an icon component (an object lookup instead of if/else).
const ICONS = {
  info: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  success: CircleCheck,
};

export default function Callout({ type = 'info', title, children }) {
  const Icon = ICONS[type] ?? Info; // components must start with a capital letter

  return (
    <div className={`callout callout-${type}`}>
      <Icon className="callout-icon" size={18} />
      <div>
        {title && <strong className="callout-title">{title}</strong>}
        <div className="callout-body">{children}</div>
      </div>
    </div>
  );
}
