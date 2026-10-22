/**
 * WithVsWithoutExample.jsx
 * ----------------------------------------------------------------------------
 * The classic useCallback problem and fix, side by side.
 *
 * Both cards are the SAME memo() component (ActionCard). The only difference
 * is how the onAction function is created in the parent:
 *
 *   ❌ onAction={() => setLikes(n => n + 1)}         new function every render
 *   ✅ const handleLike = useCallback(..., []);       same function every render
 *
 * Try it: type in the "Status message" box. The parent re-renders on every key
 * press. The LEFT card re-renders too (its function prop is new), the RIGHT
 * card does not (its function prop is the same one as before).
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Input, RenderCounter } from '@/components/ui';
import ActionCard from '../components/ActionCard';

// JSX elements are objects too! Creating <ThumbsUp /> inside the component would
// make a NEW element every render and break memo() for BOTH cards.
// Creating it once, outside the component, keeps the prop identical.
const LIKE_ICON = <ThumbsUp size={16} />;

export default function WithVsWithoutExample() {
  const [likes, setLikes] = useState(0); // shared counter, both cards add to it
  const [status, setStatus] = useState(''); // unrelated state - only causes re-renders

  // ✅ useCallback returns the SAME function object between renders.
  //    Empty deps [] is safe here because we use the updater form (n => n + 1),
  //    so the function never needs to read the current `likes` value.
  const handleLike = useCallback(() => {
    setLikes((n) => n + 1);
  }, []);

  return (
    <div className="stack">
      <div className="uc-parent">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="box-label">Parent component</span>
          <RenderCounter label="parent renders" />
        </div>
        <div className="uc-parent-row">
          <Input label="Status message (re-renders the parent)" placeholder="Type something..." value={status} onChange={(e) => setStatus(e.target.value)} />
          <div className="uc-likes">
            <span className="big-number">{likes}</span>
            <span className="small muted">total likes</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* ❌ Inline arrow function: a new function on every parent render */}
        <ActionCard
          title="Without useCallback"
          tone="danger"
          hint="onAction={() => setLikes(n => n + 1)}"
          actionLabel="Like"
          icon={LIKE_ICON}
          onAction={() => setLikes((n) => n + 1)}
        />

        {/* ✅ Memoised function: the same reference every render */}
        <ActionCard
          title="With useCallback"
          tone="success"
          hint="onAction={handleLike}  // useCallback(fn, [])"
          actionLabel="Like"
          icon={LIKE_ICON}
          onAction={handleLike}
        />
      </div>
    </div>
  );
}
