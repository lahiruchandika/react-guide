/**
 * JsxRulesExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: the 5 rules of JSX you need on day one.
 *
 *   1. Return ONE parent element  -> wrap siblings in <div> or a Fragment <>...</>
 *   2. Use className, not class    -> "class" is a reserved word in JavaScript
 *   3. Close EVERY tag             -> <img />, <br />, <input />
 *   4. camelCase attributes        -> onClick, htmlFor, tabIndex, strokeWidth
 *   5. style takes an OBJECT       -> style={{ color: 'red', fontSize: 14 }}
 *
 * Click a rule to see the "wrong" vs "right" version and the live result.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Badge } from '@/components/ui';

// --- Each rule's live "right" result is a tiny component -------------------

// Rule 1: a Fragment (<>...</>) groups siblings WITHOUT adding an extra <div>.
function FragmentDemo() {
  return (
    <>
      <dt>Name</dt>
      <dd>Ada Lovelace</dd>
      <dt>Role</dt>
      <dd>First programmer</dd>
    </>
  );
}

// The parent renders the Fragment's children straight inside a <dl>:
// no wrapper <div> ends up between <dl> and <dt>/<dd> (that would be invalid HTML).
function FragmentInList() {
  return (
    <dl className="cj-dl">
      <FragmentDemo />
    </dl>
  );
}

// Rule 2: className becomes the real HTML "class" attribute.
function ClassNameDemo() {
  return <span className="cj-pill">I am styled with className</span>;
}

// Rule 3: void elements must be self-closed with "/>".
function SelfClosingDemo() {
  return (
    <div className="row">
      <input className="field-input" placeholder="<input /> is self-closed" style={{ maxWidth: 240 }} />
      <hr className="cj-hr" />
    </div>
  );
}

// Rule 4: attributes are camelCase. htmlFor = HTML "for".
function CamelCaseDemo() {
  return (
    <div className="row">
      <label htmlFor="cj-agree">Click this label →</label>
      <input id="cj-agree" type="checkbox" tabIndex={0} />
    </div>
  );
}

// Rule 5: style uses an object; outer {} = "JS here", inner {} = the object.
function StyleDemo() {
  const boxStyle = {
    padding: 12, // numbers become pixels automatically
    borderRadius: 8,
    background: 'var(--color-primary-soft)', // CSS variables work too
    color: 'var(--color-primary)',
    fontWeight: 700,
  };
  return <div style={boxStyle}>Styled with a JS object</div>;
}

// --- Data describing every rule (rendered with .map below) -----------------
const RULES = [
  {
    id: 'parent',
    title: 'One parent element',
    wrong: `return (\n  <h1>Title</h1>\n  <p>Text</p>   // ❌ two roots\n);`,
    right: `return (\n  <>\n    <h1>Title</h1>\n    <p>Text</p>\n  </>\n);`,
    Demo: FragmentInList,
  },
  {
    id: 'classname',
    title: 'className, not class',
    wrong: `<span class="pill">Hi</span>`,
    right: `<span className="pill">Hi</span>`,
    Demo: ClassNameDemo,
  },
  {
    id: 'close',
    title: 'Close every tag',
    wrong: `<input type="text">\n<hr>`,
    right: `<input type="text" />\n<hr />`,
    Demo: SelfClosingDemo,
  },
  {
    id: 'camel',
    title: 'camelCase attributes',
    wrong: `<label for="agree" onclick={go}>`,
    right: `<label htmlFor="agree" onClick={go}>`,
    Demo: CamelCaseDemo,
  },
  {
    id: 'style',
    title: 'style is an object',
    wrong: `<div style="padding: 12px">`,
    right: `<div style={{ padding: 12 }}>`,
    Demo: StyleDemo,
  },
];

export default function JsxRulesExample() {
  // Which rule is selected (stores the rule id).
  const [activeId, setActiveId] = useState(RULES[0].id);
  const active = RULES.find((r) => r.id === activeId);
  const ActiveDemo = active.Demo; // a variable holding a component must be Capitalized

  return (
    <div className="cj-rules">
      {/* Left: list of rules */}
      <ol className="cj-rule-list">
        {RULES.map((rule, i) => (
          <li key={rule.id}>
            <button
              type="button"
              className={rule.id === activeId ? 'cj-rule active' : 'cj-rule'}
              onClick={() => setActiveId(rule.id)}
            >
              <span className="cj-rule-no">{i + 1}</span>
              {rule.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Right: wrong vs right + live result */}
      <div className="stack">
        <div className="grid-2">
          <div className="cj-snippet cj-snippet-wrong">
            <Badge tone="danger"><X size={12} /> Wrong</Badge>
            <pre>{active.wrong}</pre>
          </div>
          <div className="cj-snippet cj-snippet-right">
            <Badge tone="success"><Check size={12} /> Right</Badge>
            <pre>{active.right}</pre>
          </div>
        </div>
        <div className="box">
          <span className="box-label">live result</span>
          <ActiveDemo />
        </div>
      </div>
    </div>
  );
}
