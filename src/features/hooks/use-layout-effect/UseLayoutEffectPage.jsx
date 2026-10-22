/**
 * UseLayoutEffectPage - the "useLayoutEffect" lesson.
 *
 *   components/Tooltip.jsx   a self-positioning tooltip (measures the DOM)
 *   utils/blockFor.js        fake slow work, used to make flicker visible
 *   examples/                one file per live demo below
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import TooltipExample from './examples/TooltipExample';
import tooltipExampleSource from './examples/TooltipExample.jsx?raw';
import tooltipComponentSource from './components/Tooltip.jsx?raw';
import FlickerComparisonExample from './examples/FlickerComparisonExample';
import flickerSource from './examples/FlickerComparisonExample.jsx?raw';
import ChatScrollExample from './examples/ChatScrollExample';
import chatSource from './examples/ChatScrollExample.jsx?raw';
import ExecutionOrderExample from './examples/ExecutionOrderExample';
import orderSource from './examples/ExecutionOrderExample.jsx?raw';
import './UseLayoutEffectPage.css';

// Show the Tooltip component's code together with the example that uses it
const tooltipSource = `${tooltipComponentSource}\n\n// ===================== examples/TooltipExample.jsx =====================\n\n${tooltipExampleSource}`;

export default function UseLayoutEffectPage() {
  return (
    <ConceptPage
      topicId="use-layout-effect"
      intro={
        <p>
          <code>useLayoutEffect</code> has the same signature as <code>useEffect</code>, but it runs{' '}
          <strong>synchronously after React updates the DOM and before the browser paints</strong> the screen. That
          makes it the right tool when you must <em>measure</em> an element (size, position, scroll) and immediately
          adjust the layout - the user only ever sees the final result, with no flicker. The price: it blocks
          painting, so keep it short and use <code>useEffect</code> for everything else.
        </p>
      }
      keyPoints={[
        'Order: render -> DOM update -> useLayoutEffect -> browser paint -> useEffect.',
        'Use it to read layout (getBoundingClientRect, scrollHeight) and then set state or styles.',
        'State updates inside it are applied before paint, so intermediate positions are never shown.',
        'It blocks the browser from painting - slow code here makes the whole UI feel frozen.',
        'Same rules as useEffect: dependency array and cleanup function.',
        'Default to useEffect; switch only when you can actually see a flicker.',
      ]}
      syntax={`useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect(); // measure
  setTooltipHeight(height);                             // re-render before paint
  return () => { /* optional cleanup */ };
}, [deps]);`}
    >
      <Example
        title="1. Tooltip positioning"
        description="The tooltip measures its own size and the trigger's position, then flips or clamps itself to stay inside the box."
        code={tooltipSource}
        fileName="components/Tooltip.jsx + examples/TooltipExample.jsx"
      >
        <TooltipExample />
      </Example>

      <Example
        title="2. Flicker: useEffect vs useLayoutEffect"
        description="Identical popovers - only the hook differs. Open each one and watch for the red 'unmeasured' box in the corner."
        code={flickerSource}
        fileName="examples/FlickerComparisonExample.jsx"
      >
        <FlickerComparisonExample />
      </Example>

      <Example
        title="3. Chat that scrolls to the newest message"
        description="After each new message the list grows; we scroll to the bottom before paint so it never jumps."
        code={chatSource}
        fileName="examples/ChatScrollExample.jsx"
      >
        <ChatScrollExample />
      </Example>

      <Example
        title="4. Execution order"
        description="A timeline of when render, useLayoutEffect, useEffect and the next paint frame happen."
        code={orderSource}
        fileName="examples/ExecutionOrderExample.jsx"
      >
        <ExecutionOrderExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Using <code>useLayoutEffect</code> for data fetching, timers or logging - none of those need to block
            painting. Use <code>useEffect</code>.
          </li>
          <li>Doing heavy work inside it: the screen stays frozen until it finishes.</li>
          <li>
            Forgetting the dependency array, so it measures and sets state after <em>every</em> render (possible
            infinite loop).
          </li>
          <li>
            Expecting it to run on the server: during server rendering layout effects do not run (there is no DOM to
            measure).
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Tooltips, popovers and dropdowns that position themselves; auto-scrolling chat/log views; reading an
        element's size to choose a layout; syncing scroll position; animations that must start from a measured
        position. Rule of thumb: if <code>useEffect</code> causes a visible jump, switch to{' '}
        <code>useLayoutEffect</code>.
      </Callout>
    </ConceptPage>
  );
}
