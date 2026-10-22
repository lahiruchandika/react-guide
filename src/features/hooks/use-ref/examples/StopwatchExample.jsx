/**
 * StopwatchExample - keep a timer id in a ref
 * ----------------------------------------------------------------------------
 * To stop an interval we need its id (returned by setInterval) later, in a
 * different click handler.
 *
 *   - A normal variable (let id) is reset on every render -> the id is lost.
 *   - State would work, but the id is never displayed, so re-rendering for
 *     it is wasteful.
 *   - A ref is perfect: it survives re-renders and changing it is "silent".
 *
 * Refs used here:
 *   intervalRef     the id of the running interval (so Stop can clear it)
 *   startTimeRef    when the current run started (Date.now())
 *   accumulatedRef  milliseconds from previous runs (for pause / resume)
 * State used here: elapsed (shown on screen), isRunning, laps.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { Flag, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import '../UseRefPage.css';

// 83456 ms -> "01:23.45"
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
}

export default function StopwatchExample() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedRef = useRef(0);

  function handleStart() {
    startTimeRef.current = Date.now();
    clearInterval(intervalRef.current); // safety: never run two intervals
    // Store the id in the ref so handleStop() can find it later.
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current));
    }, 30);
    setIsRunning(true);
  }

  function handleStop() {
    clearInterval(intervalRef.current); // read the id from the ref
    intervalRef.current = null;
    accumulatedRef.current += Date.now() - startTimeRef.current; // remember time so far
    setElapsed(accumulatedRef.current);
    setIsRunning(false);
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    accumulatedRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
    setLaps([]);
  }

  function handleLap() {
    setLaps((prev) => [{ id: prev.length + 1, time: elapsed }, ...prev]);
  }

  // Cleanup on unmount: don't leave an interval running after leaving the page.
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="grid-2">
      <div className="ur-stopwatch">
        <span className={`ur-stopwatch-time ${isRunning ? 'running' : ''}`}>{formatTime(elapsed)}</span>
        <div className="row">
          {isRunning ? (
            <Button variant="secondary" icon={<Pause />} onClick={handleStop}>Stop</Button>
          ) : (
            <Button icon={<Play />} onClick={handleStart}>{elapsed > 0 ? 'Resume' : 'Start'}</Button>
          )}
          <Button variant="secondary" icon={<Flag />} onClick={handleLap} disabled={!isRunning}>Lap</Button>
          <Button variant="ghost" icon={<RotateCcw />} onClick={handleReset} disabled={elapsed === 0}>Reset</Button>
        </div>
      </div>

      <div className="ur-laps">
        <strong className="small">Laps</strong>
        {laps.length === 0 ? (
          <p className="muted small">Press Lap while running.</p>
        ) : (
          <ol>
            {laps.map((lap) => (
              <li key={lap.id}>
                <span className="muted">Lap {lap.id}</span>
                <span className="ur-mono">{formatTime(lap.time)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
