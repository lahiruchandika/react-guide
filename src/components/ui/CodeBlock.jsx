/**
 * CodeBlock - shows source code with syntax highlighting and a Copy button.
 *
 *   <CodeBlock code={`const [count, setCount] = useState(0);`} />
 *
 * Tip: Vite can import any file as a plain string by adding "?raw":
 *   import source from './examples/Counter.jsx?raw';
 *   <CodeBlock code={source} fileName="Counter.jsx" />
 * That is how every lesson shows the REAL code of its live demo.
 */
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Check, Copy } from 'lucide-react';
import './CodeBlock.css';

export default function CodeBlock({ code, language = 'jsx', fileName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // reset the icon after 1.5s
  };

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-file">{fileName ?? language}</span>
        <button type="button" className="code-copy" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Highlight uses the "render props" pattern: it gives us tokens and we render them */}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`code-pre ${className}`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="code-line-no">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
