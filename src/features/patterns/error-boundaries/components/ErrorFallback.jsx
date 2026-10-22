/**
 * ErrorFallback - the friendly UI shown instead of a crashed component.
 *
 *   <ErrorFallback error={error} onRetry={reset} title="Widget crashed" compact />
 *
 * A good fallback: says what happened in plain words, offers a way to
 * recover (Try again), and keeps the rest of the page usable.
 */
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ErrorFallback({ error, onRetry, title = 'Something went wrong', compact = false }) {
  return (
    <div className={`eb-fallback ${compact ? 'eb-fallback-compact' : ''}`} role="alert">
      <TriangleAlert size={compact ? 18 : 26} className="eb-fallback-icon" />
      <div className="eb-fallback-body">
        <strong>{title}</strong>
        <code className="eb-error-message">{error?.message ?? String(error)}</code>
        {onRetry && (
          <Button size="sm" variant="secondary" icon={<RotateCcw />} onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
