/**
 * FocusInputExample - useRef to reach a real DOM element
 * ----------------------------------------------------------------------------
 *   const inputRef = useRef(null);   // 1. create an empty ref box: { current: null }
 *   <input ref={inputRef} />         // 2. React puts the DOM node into inputRef.current
 *   inputRef.current.focus();        // 3. call DOM methods in event handlers / effects
 *
 * Scenario: a search bar with buttons that focus, select and clear the input.
 *
 * React 19 note: `ref` is now a normal prop for function components, so our
 * own <Input> component (src/components/ui/Input.jsx) can receive ref={...}
 * and pass it to its <input>. Before React 19 you needed forwardRef() for that.
 * ----------------------------------------------------------------------------
 */
import { useRef, useState } from 'react';
import { Search, TextCursorInput, X, MousePointerClick } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import '../UseRefPage.css';

const SUGGESTIONS = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useContext', 'useReducer'];

export default function FocusInputExample() {
  // 1. Create the ref. It starts as null because the <input> doesn't exist yet.
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  // 3. Use the DOM node inside event handlers (never during render).
  function handleFocus() {
    inputRef.current.focus();
  }

  function handleSelectAll() {
    inputRef.current.focus();
    inputRef.current.select(); // a DOM method React has no prop for
  }

  function handleClear() {
    setQuery('');
    inputRef.current.focus(); // put the cursor back so the user can type again
  }

  const results = SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="stack ur-search">
      {/* 2. Attach the ref. Works on our custom Input because ref is a prop in React 19. */}
      <Input
        ref={inputRef}
        label="Search hooks"
        placeholder="Type a hook name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="row">
        <Button variant="secondary" size="sm" icon={<TextCursorInput />} onClick={handleFocus}>
          Focus
        </Button>
        <Button variant="secondary" size="sm" icon={<MousePointerClick />} onClick={handleSelectAll}>
          Select text
        </Button>
        <Button variant="ghost" size="sm" icon={<X />} onClick={handleClear}>
          Clear &amp; focus
        </Button>
      </div>

      <div className="ur-results">
        {results.length === 0 ? (
          <span className="muted small">No matches</span>
        ) : (
          results.map((hook) => (
            <span key={hook} className="ur-result">
              <Search size={13} /> {hook}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
