/**
 * IntervalTimerExample - a focus (Pomodoro-style) timer with setInterval + cleanup
 * ----------------------------------------------------------------------------
 * setInterval keeps running until you call clearInterval. If an effect starts
 * an interval and never clears it, every re-run (and every StrictMode re-mount)
 * adds ANOTHER interval -> the timer runs 2x, 3x, 4x faster. That is a bug.
 *
 *   useEffect(() => {
 *     if (!isRunning) return;
 *     const id = setInterval(() => setSeconds(s => s + 1), 1000);
 *     return () => clearInterval(id);    // cleanup = stop THIS interval
 *   }, [isRunning]);
 *
 * Notice setSeconds(s => s + 1): the updater form means the effect does not
 * need `seconds` in its dependencies, so the interval is not recreated each tick.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { createLogger } from '../components/createLogger';
import LogPanel from '../components/LogPanel';
import '../UseEffectPage.css';

const logger = createLogger();
const GOAL_SECONDS = 25; // a short "session" so the progress bar moves visibly

// Helper: 75 -> "01:15"
const format = (total) =>
  `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

export default function IntervalTimerExample() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return; // nothing to set up while paused

    // Setup: start ticking.
    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1); // updater -> always uses the latest value
    }, 1000);
    logger.log(`setInterval started (id ${intervalId})`, 'effect');

    // Cleanup: runs when isRunning changes to false, or when the component unmounts.
    return () => {
      clearInterval(intervalId);
      logger.log(`clearInterval(${intervalId}) - cleaned up`, 'cleanup');
    };
  }, [isRunning]);

  const progress = Math.min(100, (seconds / GOAL_SECONDS) * 100);
  const done = seconds >= GOAL_SECONDS;

  return (
    <div className="grid-2">
      <div className="ue-timer">
        <div
          className={`ue-timer-ring ${done ? 'done' : ''}`}
          style={{ '--progress': `${progress}%` }} // CSS variable drives the ring fill
        >
          <div className="ue-timer-inner">
            <span className="big-number">{format(seconds)}</span>
            <span className="muted small">{done ? 'Session complete!' : `goal ${format(GOAL_SECONDS)}`}</span>
          </div>
        </div>
        <div className="row">
          <Button
            icon={isRunning ? <Pause /> : <Play />}
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={() => setIsRunning((r) => !r)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="ghost"
            icon={<RotateCcw />}
            onClick={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <LogPanel logger={logger} title="Interval log" height={240} />
    </div>
  );
}
