/**
 * NotCaughtExample - errors that error boundaries DO NOT catch.
 * ----------------------------------------------------------------------------
 * Boundaries only catch errors thrown while React is RENDERING. They do not
 * see errors from:
 *   - event handlers (onClick, onSubmit...)   -> the click happens after render
 *   - async code (setTimeout, fetch, promises) -> runs later, outside React
 *
 * For those, use normal try/catch (or .catch) and put the error in STATE so
 * you can show it. Everything here is inside an <ErrorBoundary>, and yet the
 * first two buttons never trigger its fallback.
 *
 * Trick (button 3): to send an async error TO the boundary, throw it inside a
 * state updater:  setState(() => { throw error; })
 * React runs the updater during render, so the boundary catches it.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { MousePointerClick, Timer, Send } from 'lucide-react';
import { Button, Callout } from '@/components/ui';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorFallback from '../components/ErrorFallback';

// A fake API call that always fails after 800ms
const saveSettings = () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error('Server returned 500 while saving settings')), 800));

function SettingsPanel() {
  const [message, setMessage] = useState(null); // { tone, text } shown inline
  const [saving, setSaving] = useState(false);
  const [, setCrash] = useState(null); // only used to forward errors to the boundary

  // 1. Event handler error -> boundary can't see it -> use try/catch
  const handleClick = () => {
    try {
      JSON.parse('{ not valid json'); // throws SyntaxError
    } catch (err) {
      setMessage({ tone: 'warning', text: `Caught in onClick with try/catch: ${err.message}` });
    }
  };

  // 2. Async error -> boundary can't see it -> use try/catch around await
  const handleAsync = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings();
    } catch (err) {
      setMessage({ tone: 'warning', text: `Caught async error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  // 3. Forward an async error to the nearest error boundary
  const handleForward = async () => {
    setSaving(true);
    try {
      await saveSettings();
    } catch (err) {
      // Throwing inside the updater makes React throw during render -> boundary catches it
      setCrash(() => {
        throw err;
      });
    }
  };

  return (
    <div className="stack">
      <div className="row">
        <Button size="sm" variant="secondary" icon={<MousePointerClick />} onClick={handleClick}>
          1. Error in onClick
        </Button>
        <Button size="sm" variant="secondary" icon={<Timer />} onClick={handleAsync} disabled={saving}>
          2. Async error {saving && '...'}
        </Button>
        <Button size="sm" variant="danger" icon={<Send />} onClick={handleForward} disabled={saving}>
          3. Forward to boundary
        </Button>
      </div>

      {message ? (
        <Callout type={message.tone} title="The boundary did NOT catch this - we handled it ourselves">
          {message.text}
        </Callout>
      ) : (
        <p className="muted small">The component is healthy. Its boundary fallback has not been triggered.</p>
      )}
    </div>
  );
}

export default function NotCaughtExample() {
  return (
    <div className="box">
      <span className="box-label">{'<ErrorBoundary>'}</span>
      <ErrorBoundary
        fallback={({ error, reset }) => (
          <ErrorFallback error={error} onRetry={reset} title="Boundary caught the forwarded async error" />
        )}
      >
        <SettingsPanel />
      </ErrorBoundary>
    </div>
  );
}
