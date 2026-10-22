/**
 * DependencyArrayExample
 * ----------------------------------------------------------------------------
 * The dependency array (2nd argument) decides WHEN an effect runs:
 *
 *   useEffect(fn)            -> after EVERY render
 *   useEffect(fn, [])        -> once, after the first render (mount)
 *   useEffect(fn, [count])   -> after mount, and again whenever `count` changes
 *
 * The function an effect RETURNS is its "cleanup". React runs it:
 *   - before running the same effect again (with the old values), and
 *   - when the component unmounts (is removed from the screen).
 *
 * Try it: type in the text box (only "no array" runs), click +1 (count effect
 * runs, with cleanup first), and hide/show the component (mount + unmount).
 *
 * StrictMode note: in development React mounts, unmounts and re-mounts every
 * component once, so you will see "mount -> cleanup -> mount" on first load.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { Button, Badge, RenderCounter } from '@/components/ui';
import { createLogger } from '../components/createLogger';
import LogPanel from '../components/LogPanel';
import '../UseEffectPage.css';

// One logger for this demo (lives outside React - see createLogger.js).
const logger = createLogger();

// The child component that owns the three effects we are watching.
function EffectWatcher({ count, text }) {
  // A) No dependency array -> runs after EVERY render of this component.
  useEffect(() => {
    logger.log(`no array  -> ran (count=${count}, text="${text}")`, 'effect');
  });

  // B) Empty array -> runs once after mount. Its cleanup runs on unmount.
  useEffect(() => {
    logger.log('[]        -> ran once (mounted)', 'effect');
    return () => logger.log('[]        -> cleanup (unmounted)', 'cleanup');
  }, []);

  // C) [count] -> runs on mount and whenever `count` changes (typing does NOT trigger it).
  useEffect(() => {
    logger.log(`[count]   -> ran, count = ${count}`, 'effect');
    // The cleanup "remembers" the count from ITS render.
    return () => logger.log(`[count]   -> cleanup for count = ${count}`, 'cleanup');
  }, [count]);

  return (
    <div className="box">
      <span className="box-label">&lt;EffectWatcher /&gt;</span>
      <div className="row">
        <Badge tone="primary">count: {count}</Badge>
        <Badge tone="info">text: &quot;{text}&quot;</Badge>
        <RenderCounter />
      </div>
    </div>
  );
}

export default function DependencyArrayExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(true);

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="row">
          <Button icon={<Plus />} onClick={() => setCount((c) => c + 1)}>
            count
          </Button>
          <input
            className="ue-input"
            placeholder="Type to change text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            icon={visible ? <EyeOff /> : <Eye />}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? 'Unmount component' : 'Mount component'}
          </Button>
        </div>

        {/* Conditional rendering = mounting / unmounting */}
        {visible ? (
          <EffectWatcher count={count} text={text} />
        ) : (
          <div className="box muted small">EffectWatcher is unmounted. Its cleanups have run.</div>
        )}

        <ul className="ue-legend">
          <li><code>useEffect(fn)</code> every render</li>
          <li><code>useEffect(fn, [])</code> mount only</li>
          <li><code>useEffect(fn, [count])</code> when count changes</li>
        </ul>
      </div>

      <LogPanel logger={logger} title="Effect log (newest first)" height={300} />
    </div>
  );
}
