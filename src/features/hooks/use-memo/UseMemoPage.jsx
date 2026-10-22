/**
 * UseMemoPage.jsx  -  route: /hooks/use-memo
 * ----------------------------------------------------------------------------
 * Lesson page for the useMemo hook. The page itself only arranges content;
 * every live demo lives in its own file inside ./examples/ and its REAL source
 * is shown in the "Code" tab thanks to Vite's `?raw` import.
 *
 *   use-memo/
 *     UseMemoPage.jsx / .css
 *     examples/   one file per live demo
 *     components/ small child components used by the demos
 *     utils/      plain JS helpers (fake data, slow calculations)
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import PrimeCalculatorExample from './examples/PrimeCalculatorExample';
import primeSource from './examples/PrimeCalculatorExample.jsx?raw';
import ProductFilterExample from './examples/ProductFilterExample';
import filterSource from './examples/ProductFilterExample.jsx?raw';
import MemoizedObjectExample from './examples/MemoizedObjectExample';
import objectSource from './examples/MemoizedObjectExample.jsx?raw';
import OrderStatsExample from './examples/OrderStatsExample';
import statsSource from './examples/OrderStatsExample.jsx?raw';
import resultsPanelSource from './components/ResultsPanel.jsx?raw';
import salesChartSource from './components/SalesChart.jsx?raw';

import './UseMemoPage.css';

/** Show the example file AND the child component it uses in one Code tab. */
const withChild = (exampleSrc, childPath, childSrc) =>
  `${exampleSrc.trim()}\n\n\n// ===================== ${childPath} =====================\n\n${childSrc.trim()}`;

export default function UseMemoPage() {
  return (
    <ConceptPage
      topicId="use-memo"
      intro={
        <p>
          Every time a component re-renders, <b>all the code inside it runs again</b>. Usually that is fine, but if
          you calculate something slow (filtering thousands of items, heavy math) it will be redone even when the
          inputs did not change. <code>useMemo</code> <b>caches the result</b> of a calculation and only recalculates
          when one of its dependencies changes.
        </p>
      }
      keyPoints={[
        'useMemo(fn, deps) runs fn on the first render and returns the cached result after that.',
        'It recomputes only when a value in the dependency array changes (compared with Object.is).',
        'Use it for expensive calculations, or to keep an object/array reference stable for memo() children.',
        'The function must be pure: no side effects (no fetch, no setState) inside useMemo.',
        'It is a performance optimisation - your code should still work correctly without it.',
      ]}
      syntax={`import { useMemo } from 'react';

const visibleTodos = useMemo(
  () => filterTodos(todos, tab),   // 1. calculation (must be pure)
  [todos, tab]                     // 2. dependencies
);`}
    >
      <Example
        title="1. Cache an expensive calculation"
        description="Move the slider to recalculate. Then click the unrelated buttons: the component re-renders, but the time stamp shows the cached result was reused."
        code={primeSource}
        fileName="examples/PrimeCalculatorExample.jsx"
      >
        <PrimeCalculatorExample />
      </Example>

      <Example
        title="2. Without vs with useMemo (20 000 products)"
        description="Both panels run the same slow filter. Click 'Unrelated re-render': only the left panel recalculates every time."
        code={withChild(filterSource, 'components/ResultsPanel.jsx', resultsPanelSource)}
        fileName="examples/ProductFilterExample.jsx + components/ResultsPanel.jsx"
      >
        <ProductFilterExample />
      </Example>

      <Example
        title="3. Stable objects for memo() children"
        description="useMemo keeps the same object reference, so a memo() child can skip re-rendering. Type in the notes box and compare the render counters."
        code={withChild(objectSource, 'components/SalesChart.jsx', salesChartSource)}
        fileName="examples/MemoizedObjectExample.jsx + components/SalesChart.jsx"
      >
        <MemoizedObjectExample />
      </Example>

      <Example
        title="4. The dependency array in action"
        description="Derived order statistics are recomputed only when the orders array changes. The log shows exactly when that happens."
        code={statsSource}
        fileName="examples/OrderStatsExample.jsx"
      >
        <OrderStatsExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <b>Missing dependencies</b> - if the calculation reads <code>query</code> but the array is{' '}
            <code>[]</code>, you get a stale (old) result forever. Include every value used inside.
          </li>
          <li>
            <b>Mutating instead of replacing</b> - <code>items.push(x)</code> keeps the same array reference, so
            useMemo will not notice the change. Always create a new array: <code>[...items, x]</code>.
          </li>
          <li>
            <b>Side effects inside useMemo</b> - fetching data or calling <code>setState</code> belongs in an event
            handler or <code>useEffect</code>, not in a memoised calculation.
          </li>
          <li>
            <b>Memoising everything</b> - useMemo itself has a cost. Simple math like <code>price * qty</code> does
            not need it.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use useMemo">
        Measure first (React DevTools Profiler or <code>console.time</code>). Reach for useMemo when a calculation
        is noticeably slow (roughly 1 ms or more), or when you pass an object/array to a <code>memo()</code> child
        or use it as a <code>useEffect</code> dependency. Note: the new <b>React Compiler</b> can add this
        memoisation automatically, but understanding useMemo is still essential for reading existing code.
      </Callout>
    </ConceptPage>
  );
}
