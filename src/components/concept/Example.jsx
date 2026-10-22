/**
 * Example - one live demo inside a lesson, with "Demo" and "Code" tabs.
 *
 *   import CounterExample from './examples/CounterExample';
 *   import counterSource from './examples/CounterExample.jsx?raw';
 *
 *   <Example
 *     title="1. Basic counter"
 *     description="Click the buttons to change state."
 *     code={counterSource}
 *     fileName="examples/CounterExample.jsx"
 *   >
 *     <CounterExample />
 *   </Example>
 *
 * The live demo is passed as `children`; the source is passed as a string.
 */
import { useState } from 'react';
import { Code2, Play } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import './Example.css';

export default function Example({ title, description, code, fileName, children }) {
  // Which tab is active: 'demo' or 'code'
  const [tab, setTab] = useState('demo');

  return (
    <section className="example">
      <header className="example-header">
        <div>
          <h3 className="example-title">{title}</h3>
          {description && <p className="example-desc">{description}</p>}
        </div>

        {/* Only show tabs when source code was provided */}
        {code && (
          <div className="example-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'demo'} className={tab === 'demo' ? 'active' : ''} onClick={() => setTab('demo')}>
              <Play size={14} /> Demo
            </button>
            <button role="tab" aria-selected={tab === 'code'} className={tab === 'code' ? 'active' : ''} onClick={() => setTab('code')}>
              <Code2 size={14} /> Code
            </button>
          </div>
        )}
      </header>

      {/* Hide (not unmount) the demo while viewing code, so its state is kept */}
      <div className="example-demo" hidden={tab !== 'demo'}>
        {children}
      </div>
      {tab === 'code' && code && (
        <div className="example-code">
          <CodeBlock code={code} fileName={fileName} />
        </div>
      )}
    </section>
  );
}
