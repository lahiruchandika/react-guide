/**
 * FilterTransitionExample
 * ----------------------------------------------------------------------------
 * A product search with TWO pieces of state:
 *
 *   text   -> what's in the input   (URGENT: must update on every keystroke)
 *   query  -> what the list filters (NON-URGENT: can lag behind a little)
 *
 * In "transition" mode we update `text` normally and `query` inside
 * startTransition, so typing stays smooth while the slow list catches up.
 * In "blocking" mode both update together and every keystroke waits for
 * the slow list - type fast and feel the lag.
 * ----------------------------------------------------------------------------
 */
import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { Badge, Button, Spinner } from '@/components/ui';
import SlowProductList from '../components/SlowProductList';

export default function FilterTransitionExample() {
  const [mode, setMode] = useState('transition'); // 'transition' | 'blocking'
  const [text, setText] = useState(''); // urgent state: the input value
  const [query, setQuery] = useState(''); // non-urgent state: drives the slow list
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value); // 1. urgent: the input shows the new letter right away

    if (mode === 'transition') {
      startTransition(() => setQuery(value)); // 2. non-urgent: filter in the background
    } else {
      setQuery(value); // blocking: React must render the slow list before the next keystroke
    }
  };

  return (
    <div className="stack">
      <div className="row">
        <span className="small muted">Mode:</span>
        <Button size="sm" variant={mode === 'blocking' ? 'danger' : 'secondary'} onClick={() => setMode('blocking')}>
          Blocking
        </Button>
        <Button size="sm" variant={mode === 'transition' ? 'primary' : 'secondary'} onClick={() => setMode('transition')}>
          useTransition
        </Button>
      </div>

      <div className="utr-search">
        <Search size={16} className="utr-search-icon" />
        <input
          className="field-input"
          placeholder='Type fast, e.g. "wireless blue"'
          value={text}
          onChange={handleChange}
          aria-label="Search products"
        />
        {isPending && <Spinner size={16} />}
      </div>

      <div className="row small">
        <span>
          input: <Badge tone="primary">{text || '""'}</Badge>
        </span>
        <span>
          list query: <Badge tone={text === query ? 'success' : 'warning'}>{query || '""'}</Badge>
        </span>
      </div>

      {/* Dim the list while a newer query is being rendered */}
      <div className={isPending ? 'utr-stale' : ''}>
        <SlowProductList query={query} />
      </div>
    </div>
  );
}
