/**
 * VideoPlayerExample - controlling a child component from OUTSIDE via a ref.
 * ----------------------------------------------------------------------------
 * Scenario: a course page. The "remote control" and the chapter list are NOT
 * part of the player, yet they can play, pause and seek it:
 *
 *     playerRef.current.seek(chapter.start)
 *
 * Meanwhile the player reports its time back with onTimeUpdate, so the
 * parent can highlight the current chapter.
 * ----------------------------------------------------------------------------
 */
import { useCallback, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Rewind, FastForward } from 'lucide-react';
import { Button } from '@/components/ui';
import VideoPlayer from '../components/VideoPlayer';

const CHAPTERS = [
  { id: 'intro', title: 'Introduction', start: 0 },
  { id: 'props', title: 'Refs as props', start: 25 },
  { id: 'handle', title: 'useImperativeHandle', start: 55 },
  { id: 'recap', title: 'Recap & quiz', start: 95 },
];

export default function VideoPlayerExample() {
  // 1. The ref receives the player's API: { play, pause, toggle, seek, restart }
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  // 2. useCallback keeps this function stable, so the player's effect
  //    (which depends on onTimeUpdate) doesn't re-run on every render
  const handleTimeUpdate = useCallback((t) => setCurrentTime(t), []);

  // The current chapter is DERIVED from the time - no extra state needed
  const current = [...CHAPTERS].reverse().find((c) => currentTime >= c.start);

  return (
    <div className="rf-course">
      <VideoPlayer ref={playerRef} title="React 19 Refs - Lesson 7" duration={120} onTimeUpdate={handleTimeUpdate} />

      <div className="stack">
        <div className="rf-remote">
          <span className="rf-log-title">Remote control (outside the player)</span>
          <div className="row">
            {/* 3. Each button sends a command through the ref */}
            <Button size="sm" icon={<Play />} onClick={() => playerRef.current.play()}>Play</Button>
            <Button size="sm" variant="secondary" icon={<Pause />} onClick={() => playerRef.current.pause()}>Pause</Button>
            <Button size="sm" variant="secondary" icon={<Rewind />} onClick={() => playerRef.current.seek(currentTime - 10)}>-10s</Button>
            <Button size="sm" variant="secondary" icon={<FastForward />} onClick={() => playerRef.current.seek(currentTime + 10)}>+10s</Button>
            <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => playerRef.current.restart()}>Restart</Button>
          </div>
        </div>

        <ul className="rf-chapters">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                className={chapter.id === current?.id ? 'active' : ''}
                onClick={() => playerRef.current.seek(chapter.start)} // jump to chapter
              >
                <span className="rf-chapter-time">
                  {Math.floor(chapter.start / 60)}:{String(chapter.start % 60).padStart(2, '0')}
                </span>
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
