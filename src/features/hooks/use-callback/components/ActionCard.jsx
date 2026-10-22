/**
 * ActionCard.jsx
 * ----------------------------------------------------------------------------
 * A memoised child component that receives a FUNCTION prop (onAction).
 *
 * memo() skips re-rendering when all props are the same as last time.
 * Functions are objects, so  () => {}  !==  () => {}  - a function created
 * during the parent's render is a NEW value every time. That means:
 *   - inline function prop          -> memo() sees a "changed" prop -> re-render
 *   - useCallback function prop     -> same function -> memo() can skip
 * ----------------------------------------------------------------------------
 */
import { memo } from 'react';
import { Badge, Button, RenderCounter } from '@/components/ui';

function ActionCard({ title, tone, hint, actionLabel, icon, onAction }) {
  return (
    <div className="uc-card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Badge tone={tone}>{title}</Badge>
        <RenderCounter />
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {hint}
      </p>
      {/* Calling the function prop tells the PARENT that something happened */}
      <Button variant="secondary" icon={icon} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

// memo(Component) returns a component that only re-renders when props change.
export default memo(ActionCard);
