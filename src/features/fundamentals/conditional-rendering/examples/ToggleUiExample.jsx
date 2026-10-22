/**
 * ToggleUiExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: TOGGLING parts of the UI with boolean state.
 *
 *   1. An FAQ accordion: only ONE item is open at a time, so we store the
 *      open item's id (or null) instead of many booleans.
 *   2. A "show password" toggle: same input, different `type` attribute.
 *   3. Hide vs unmount: `{show && <Comp/>}` UNMOUNTS the component (its state
 *      is lost) while the `hidden` attribute only HIDES it (state is kept).
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui';

const FAQ = [
  { id: 'q1', question: 'What is conditional rendering?', answer: 'Showing different UI depending on state or props, using plain JavaScript: if, ? :, && and early returns.' },
  { id: 'q2', question: 'Can I use if inside JSX?', answer: 'No - JSX only accepts expressions. Use a ternary or &&, or move the if above the return.' },
  { id: 'q3', question: 'What does returning null do?', answer: 'The component renders nothing, but it is still part of the tree and its hooks still run.' },
];

/* A tiny counter used to show the difference between hiding and unmounting */
function MiniCounter() {
  const [n, setN] = useState(0);
  return (
    <Button size="sm" variant="secondary" onClick={() => setN(n + 1)}>
      clicked {n} times
    </Button>
  );
}

export default function ToggleUiExample() {
  // Accordion: id of the open question, or null when all are closed.
  const [openId, setOpenId] = useState('q1');
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(true);

  return (
    <div className="grid-2">
      {/* ---------------- 1. Accordion ---------------- */}
      <div className="cr-accordion">
        {FAQ.map((item) => {
          const isOpen = openId === item.id; // derived boolean
          return (
            <div key={item.id} className={isOpen ? 'cr-acc-item is-open' : 'cr-acc-item'}>
              <button
                type="button"
                className="cr-acc-head"
                aria-expanded={isOpen}
                // Clicking the open item closes it; clicking another opens that one.
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                {item.question}
                <ChevronDown size={16} className="cr-acc-chevron" />
              </button>
              {/* && renders the answer only for the open item */}
              {isOpen && <p className="cr-acc-body">{item.answer}</p>}
            </div>
          );
        })}
      </div>

      <div className="stack">
        {/* ---------------- 2. Show / hide password ---------------- */}
        <div className="box">
          <span className="box-label">Password field</span>
          {/* Password inputs belong inside a <form>; preventDefault stops a page reload on Enter */}
          <form className="row" style={{ flexWrap: 'nowrap' }} onSubmit={(e) => e.preventDefault()}>
            {/* Ternary on an attribute: 'text' or 'password' */}
            <input className="field-input" type={showPassword ? 'text' : 'password'} defaultValue="react-is-fun" autoComplete="off" aria-label="Password" />
            <Button
              variant="secondary"
              size="sm"
              icon={showPassword ? <EyeOff /> : <Eye />}
              onClick={() => setShowPassword((s) => !s)} // flip the boolean
            >
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </form>
        </div>

        {/* ---------------- 3. Hide vs unmount ---------------- */}
        <div className="box">
          <span className="box-label" style={{ display: 'block' }}>Click the counters, then toggle</span>
          <Button size="sm" onClick={() => setVisible((v) => !v)}>
            {visible ? 'Hide both' : 'Show both'}
          </Button>
          <div className="cr-hide-grid">
            <div>
              <code>{'{visible && <MiniCounter/>}'}</code>
              {/* Unmounted when hidden -> count resets to 0 when shown again */}
              <div className="cr-hide-slot">{visible && <MiniCounter />}</div>
            </div>
            <div>
              <code>{'<div hidden={!visible}>'}</code>
              {/* Always mounted, just hidden with CSS -> count is kept */}
              <div className="cr-hide-slot">
                <div hidden={!visible}>
                  <MiniCounter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
