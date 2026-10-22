/**
 * ExtractLogicExample - "before vs after" extracting logic into custom hooks.
 * ----------------------------------------------------------------------------
 * BEFORE: the component does everything itself - two pieces of state, two
 *         effects, four event listeners and their cleanups. If another
 *         component needs the same info, you copy-paste all of it.
 *
 * AFTER:  the same behaviour in two lines, using reusable hooks from
 *         src/hooks/useWindowSize.js and src/hooks/useOnlineStatus.js.
 *
 * Both render the SAME UI (<DeviceStatus />). Resize the browser window or go
 * offline (DevTools -> Network -> Offline) and both update identically.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useOnlineStatus, useWindowSize } from '@/hooks';

// ======================= BEFORE: logic written inline =======================
function DeviceStatusBefore() {
  // Window width state + its own effect
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize); // cleanup
  }, []);

  // Online status state + another effect
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return <DeviceStatus width={width} isOnline={isOnline} />;
}

// ======================= AFTER: logic lives in custom hooks ==================
function DeviceStatusAfter() {
  const { width } = useWindowSize(); // all the resize logic, hidden in a hook
  const isOnline = useOnlineStatus(); // all the online/offline logic, too

  return <DeviceStatus width={width} isOnline={isOnline} />;
}

// ======================= Shared presentational component ====================
// Pure UI: receives data through props, knows nothing about where it came from.
function DeviceStatus({ width, isOnline }) {
  // Derived values - calculated during render, no extra state needed.
  const device = width < 760 ? 'Mobile' : width < 1100 ? 'Tablet' : 'Desktop';
  const Icon = { Mobile: Smartphone, Tablet: Tablet, Desktop: Monitor }[device];

  return (
    <div className="ch-device">
      <div className="row">
        <Icon size={28} className="ch-device-icon" />
        <div>
          <div className="ch-device-width">{width}px</div>
          <div className="muted small">{device} layout</div>
        </div>
      </div>
      {/* A bar that grows with the window width (max 1920px) */}
      <div className="ch-meter" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (width / 1920) * 100)}%` }} />
      </div>
      <Badge tone={isOnline ? 'success' : 'danger'}>
        {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />} {isOnline ? 'Online' : 'Offline'}
      </Badge>
    </div>
  );
}

export default function ExtractLogicExample() {
  return (
    <div className="grid-2">
      <div className="box ch-compare ch-compare-bad">
        <span className="box-label">Before - 2 states, 2 effects, ~20 lines</span>
        <DeviceStatusBefore />
      </div>
      <div className="box ch-compare ch-compare-good">
        <span className="box-label">After - 2 lines with custom hooks</span>
        <DeviceStatusAfter />
      </div>
    </div>
  );
}
