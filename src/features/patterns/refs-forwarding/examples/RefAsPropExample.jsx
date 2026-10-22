/**
 * RefAsPropExample - pass a ref from a parent to a CUSTOM component.
 * ----------------------------------------------------------------------------
 * Scenario: a product search bar. The parent wants to:
 *   - focus the search box when a button is clicked
 *   - focus it when the user presses the "/" key (like GitHub or YouTube)
 *   - select all the text
 *
 * The <input> lives INSIDE <TextInput>, so the parent can't reach it directly.
 * Solution (React 19): create a ref in the parent and pass it as a prop:
 *     <TextInput ref={searchRef} />
 * TextInput forwards it to its inner <input>. Now searchRef.current is that
 * DOM element and the parent can call .focus(), .select(), etc.
 * ----------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import { Search, TextSelect, Keyboard } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import TextInput from '../components/TextInput';

const PRODUCTS = ['Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub', '4K Monitor', 'Laptop Stand', 'Webcam HD'];

export default function RefAsPropExample() {
  // 1. Create a ref. It starts as null; React fills it after the input mounts.
  const searchRef = useRef(null);

  const [query, setQuery] = useState('');
  const [info, setInfo] = useState('Nothing inspected yet');

  // 2. Global keyboard shortcut: press "/" anywhere to focus the search box
  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore the key while the user is already typing in some field
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault(); // don't type "/" into the box
        searchRef.current?.focus(); // 3. use the DOM node through the ref
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // cleanup on unmount
  }, []);

  // 4. Event handlers can use the ref too (never read refs DURING render)
  const focusSearch = () => searchRef.current.focus();
  const selectAll = () => {
    searchRef.current.focus();
    searchRef.current.select(); // a native DOM method
  };
  const inspect = () => {
    const el = searchRef.current;
    setInfo(`<${el.tagName.toLowerCase()} type="${el.type}"> | value length: ${el.value.length} | placeholder: "${el.placeholder}"`);
  };

  const results = PRODUCTS.filter((p) => p.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="stack">
      {/* 5. Pass the ref like any other prop */}
      <TextInput
        ref={searchRef}
        icon={Search}
        label="Search products"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        hint='Tip: click outside, then press "/" to jump here'
      />

      <div className="row">
        <Button size="sm" icon={<Search />} onClick={focusSearch}>Focus search</Button>
        <Button size="sm" variant="secondary" icon={<TextSelect />} onClick={selectAll}>Select all text</Button>
        <Button size="sm" variant="secondary" icon={<Keyboard />} onClick={inspect}>Inspect ref.current</Button>
      </div>

      <div className="rf-console">
        <span className="muted">searchRef.current →</span> {info}
      </div>

      <div className="row">
        {results.map((p) => (
          <Badge key={p} tone="primary">{p}</Badge>
        ))}
        {results.length === 0 && <span className="muted small">No products match &quot;{query}&quot;</span>}
      </div>
    </div>
  );
}
