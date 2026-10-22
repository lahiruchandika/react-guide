/**
 * VideoPlayer - a (simulated) media player with an imperative API.
 * ----------------------------------------------------------------------------
 * Media players are THE classic use case for useImperativeHandle: the parent
 * wants to send COMMANDS ("play", "seek to 1:30") rather than pass state.
 *
 *   ref.current.play()   ref.current.pause()   ref.current.toggle()
 *   ref.current.seek(s)  ref.current.restart()
 *
 * Data still flows UP through a normal callback prop: onTimeUpdate(seconds).
 *   commands go DOWN  through the ref
 *   events   go UP    through callback props
 *
 * No real video file is needed: a timer advances `time` while playing.
 * (With a real <video> element you would call videoRef.current.play() etc.)
 * ----------------------------------------------------------------------------
 */
import { useEffect, useImperativeHandle, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const format = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function VideoPlayer({ ref, title, duration = 120, onTimeUpdate }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  // 1. While playing, advance the time every 250ms
  useEffect(() => {
    if (!playing) return; // nothing to do while paused
    const id = setInterval(() => {
      // Updater functions must be pure: just compute the next value.
      // 1 "second" per tick = 4x speed, so the demo is quick.
      setTime((t) => Math.min(t + 1, duration));
    }, 250);
    return () => clearInterval(id); // cleanup: stop the timer on pause/unmount
  }, [playing, duration]);

  // Reached the end? Stop playing (the cleanup above then clears the timer)
  if (playing && time >= duration) {
    setPlaying(false); // setting state during render is allowed for "adjusting state" like this
  }

  // 2. Tell the parent about the new time (event goes UP)
  useEffect(() => {
    onTimeUpdate?.(time);
  }, [time, onTimeUpdate]);

  // 3. The commands the parent can call (commands come DOWN)
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        setTime((t) => (t >= duration ? 0 : t)); // at the end? start over
        setPlaying(true);
      },
      pause: () => setPlaying(false),
      toggle: () => setPlaying((p) => !p),
      seek: (seconds) => setTime(Math.min(Math.max(seconds, 0), duration)),
      restart: () => {
        setTime(0);
        setPlaying(true);
      },
    }),
    [duration],
  );

  const progress = (time / duration) * 100;

  return (
    <div className="rf-player">
      {/* The "screen" - clicking it toggles playback, like YouTube */}
      <button type="button" className="rf-screen" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
        <span className={`rf-screen-glow ${playing ? 'is-playing' : ''}`} />
        <span className="rf-screen-title">{title}</span>
        <span className="rf-screen-icon">{playing ? <Pause size={28} /> : <Play size={28} />}</span>
      </button>

      {/* Built-in controls */}
      <div className="rf-player-bar">
        <span className="rf-time">{format(time)}</span>
        <input
          type="range"
          min={0}
          max={duration}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
          className="rf-range"
          style={{ '--rf-progress': `${progress}%` }}
          aria-label="Seek"
        />
        <span className="rf-time">{format(duration)}</span>
      </div>
    </div>
  );
}
