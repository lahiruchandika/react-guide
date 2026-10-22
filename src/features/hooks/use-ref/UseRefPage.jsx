/**
 * UseRefPage - lesson: the useRef hook
 * ----------------------------------------------------------------------------
 * Each live demo lives in its own file inside ./examples/ and its source is
 * shown in the "Code" tab via Vite's `?raw` import.
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import FocusInputExample from './examples/FocusInputExample';
import focusInputSource from './examples/FocusInputExample.jsx?raw';
import RefVsStateExample from './examples/RefVsStateExample';
import refVsStateSource from './examples/RefVsStateExample.jsx?raw';
import PreviousValueExample from './examples/PreviousValueExample';
import previousValueSource from './examples/PreviousValueExample.jsx?raw';
import StopwatchExample from './examples/StopwatchExample';
import stopwatchSource from './examples/StopwatchExample.jsx?raw';
import ScrollToExample from './examples/ScrollToExample';
import scrollToSource from './examples/ScrollToExample.jsx?raw';

export default function UseRefPage() {
  return (
    <ConceptPage
      topicId="use-ref"
      intro={
        <p>
          <code>useRef</code> gives you a small box - <code>{'{ current: value }'}</code> - that React keeps for the
          whole life of the component. You can change <code>ref.current</code> any time and{' '}
          <strong>it will not cause a re-render</strong>. That makes refs perfect for two jobs: pointing at a
          real <strong>DOM element</strong> (to focus or scroll it), and remembering values that the UI does not
          display (timer ids, previous values, flags).
        </p>
      }
      keyPoints={[
        'useRef(initial) returns the same { current } object on every render.',
        'Changing ref.current does NOT re-render the component (state does).',
        'Pass a ref to JSX (<input ref={myRef} />) and React fills ref.current with the DOM node.',
        'Read and write refs in event handlers and effects - not during rendering.',
        'React 19: ref is a normal prop, so custom components can accept ref without forwardRef.',
      ]}
      syntax={`import { useRef } from 'react';

const inputRef = useRef(null);   // DOM ref
const timerRef = useRef(null);   // value that should not re-render

<input ref={inputRef} />

function handleClick() {
  inputRef.current.focus();                 // use the DOM node
  timerRef.current = setTimeout(save, 500); // store a value silently
}`}
    >
      <Example
        title="1. Focus an input (DOM ref)"
        description="Buttons call DOM methods (focus, select) on the input through a ref - passed to our custom Input component."
        code={focusInputSource}
        fileName="examples/FocusInputExample.jsx"
      >
        <FocusInputExample />
      </Example>

      <Example
        title="2. Ref vs state: no re-render"
        description="Click the ref button a few times - the screen doesn't change. Then re-render to reveal the stored value."
        code={refVsStateSource}
        fileName="examples/RefVsStateExample.jsx"
      >
        <RefVsStateExample />
      </Example>

      <Example
        title="3. Remember the previous value"
        description="A stock ticker that compares the current price with the previous one, stored in a ref by a usePrevious hook."
        code={previousValueSource}
        fileName="examples/PreviousValueExample.jsx"
      >
        <PreviousValueExample />
      </Example>

      <Example
        title="4. Stopwatch: store the interval id in a ref"
        description="Start, lap, stop and resume. The interval id and start time live in refs; only the displayed time is state."
        code={stopwatchSource}
        fileName="examples/StopwatchExample.jsx"
      >
        <StopwatchExample />
      </Example>

      <Example
        title="5. Scroll to an element"
        description="Send a message to auto-scroll the chat, or jump to any message. Uses a Map of refs filled by ref callbacks."
        code={scrollToSource}
        fileName="examples/ScrollToExample.jsx"
      >
        <ScrollToExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <strong>Displaying a ref value and expecting it to update:</strong> the screen only changes on a
            re-render. If the UI shows it, use state.
          </li>
          <li>
            <strong>Using ref.current during render</strong> (e.g. <code>inputRef.current.focus()</code> in the
            component body). On the first render the DOM node doesn&apos;t exist yet - use an event handler or effect.
          </li>
          <li>
            <strong>Calling useRef in a loop</strong> for a list of elements. Use one ref holding a Map plus ref
            callbacks (example 5).
          </li>
          <li>
            <strong>Forgetting to clear timers</strong> stored in refs when the component unmounts.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use useRef">
        Reach for a ref when you need to <strong>touch the DOM</strong> (focus, scroll, measure, play a video,
        integrate a non-React library) or to <strong>remember something between renders without showing it</strong>{' '}
        (interval/timeout ids, previous values, &quot;already initialised&quot; flags, the latest callback). If changing
        the value should update the screen, it belongs in <code>useState</code>.
      </Callout>
    </ConceptPage>
  );
}
