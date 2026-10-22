/**
 * WindowSizeExample - subscribe to a browser event, unsubscribe in cleanup
 * ----------------------------------------------------------------------------
 *   useEffect(() => {
 *     function handleResize() { setSize(...) }
 *     window.addEventListener('resize', handleResize);         // subscribe
 *     return () => window.removeEventListener('resize', handleResize); // unsubscribe
 *   }, []);
 *
 * Without the cleanup, every mount adds another listener that is never
 * removed (a memory leak), and React warns if a removed component still tries
 * to set state. Resize your browser window, then unmount the component and
 * resize again - nothing is logged because the listener was removed.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { createLogger } from '../components/createLogger';
import LogPanel from '../components/LogPanel';
import '../UseEffectPage.css';

const logger = createLogger();

// Read the current size (used for the initial state and on every resize).
const getSize = () => ({ width: window.innerWidth, height: window.innerHeight });

function getDevice(width) {
  if (width < 640) return { label: 'Mobile', Icon: Smartphone, tone: 'warning' };
  if (width < 1024) return { label: 'Tablet', Icon: Tablet, tone: 'info' };
  return { label: 'Desktop', Icon: Monitor, tone: 'success' };
}

function WindowSize() {
  // Lazy initial state: read the window size once on mount.
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    let events = 0;
    function handleResize() {
      events += 1;
      setSize(getSize());
      // Log only every 10th event - resize fires MANY times per second.
      if (events % 10 === 1) logger.log(`resize event #${events}: ${window.innerWidth}px`, 'info');
    }

    window.addEventListener('resize', handleResize);
    logger.log('addEventListener("resize")', 'effect');

    return () => {
      window.removeEventListener('resize', handleResize); // must be the SAME function reference
      logger.log('removeEventListener("resize")', 'cleanup');
    };
  }, []); // [] -> subscribe once on mount, unsubscribe on unmount

  const { label, Icon, tone } = getDevice(size.width);

  return (
    <div className="ue-size">
      <Icon size={40} className="ue-size-icon" />
      <div className="big-number">
        {size.width} <span className="muted">×</span> {size.height}
      </div>
      <Badge tone={tone}>{label} layout</Badge>
    </div>
  );
}

export default function WindowSizeExample() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="grid-2">
      <div className="stack">
        {visible ? <WindowSize /> : <div className="box muted small">Unmounted - the resize listener is gone.</div>}
        <div>
          <Button variant="secondary" size="sm" onClick={() => setVisible((v) => !v)}>
            {visible ? 'Unmount' : 'Mount'} component
          </Button>
        </div>
      </div>
      <LogPanel logger={logger} title="Listener log" height={220} />
    </div>
  );
}
