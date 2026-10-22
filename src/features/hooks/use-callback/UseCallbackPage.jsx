/**
 * UseCallbackPage.jsx  -  route: /hooks/use-callback
 * ----------------------------------------------------------------------------
 * Lesson page for useCallback and React.memo.
 *
 *   use-callback/
 *     UseCallbackPage.jsx / .css
 *     examples/    one file per live demo (shown in the "Code" tab via ?raw)
 *     components/  memo() child components used by the demos
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import WithVsWithoutExample from './examples/WithVsWithoutExample';
import withVsWithoutSource from './examples/WithVsWithoutExample.jsx?raw';
import actionCardSource from './components/ActionCard.jsx?raw';
import TodoListExample from './examples/TodoListExample';
import todoListSource from './examples/TodoListExample.jsx?raw';
import todoItemSource from './components/TodoItem.jsx?raw';
import StaleClosureExample from './examples/StaleClosureExample';
import staleSource from './examples/StaleClosureExample.jsx?raw';
import EffectDependencyExample from './examples/EffectDependencyExample';
import effectSource from './examples/EffectDependencyExample.jsx?raw';

import './UseCallbackPage.css';

/** Show the example file AND the memo() child it uses in one Code tab. */
const withChild = (exampleSrc, childPath, childSrc) =>
  `${exampleSrc.trim()}\n\n\n// ===================== ${childPath} =====================\n\n${childSrc.trim()}`;

export default function UseCallbackPage() {
  return (
    <ConceptPage
      topicId="use-callback"
      intro={
        <>
          <p>
            When a component re-renders, every function declared inside it is <b>created again</b>. The new function
            does the same thing, but it is a <b>different object</b>: <code>{'(() => {}) !== (() => {})'}</code>.
          </p>
          <p>
            Usually that does not matter. It <b>does</b> matter when the function is passed to a child wrapped in{' '}
            <code>memo()</code> (the child thinks its props changed) or used in a <code>useEffect</code> dependency
            array (the effect re-runs). <code>useCallback</code> returns the <b>same function</b> between renders
            until its dependencies change.
          </p>
        </>
      }
      keyPoints={[
        'useCallback(fn, deps) caches the function itself; useMemo(() => fn, deps) is the same thing.',
        'memo(Component) skips re-rendering when props are equal - but a new function prop is never equal.',
        'useCallback is only useful together with memo() children or hook dependency arrays.',
        'List every value the function reads in deps, or use the updater form setX(prev => ...) to need fewer deps.',
        'With the React Compiler enabled, React can memoise functions for you automatically.',
      ]}
      syntax={`import { useCallback, memo } from 'react';

const handleAdd = useCallback((item) => {   // 1. the function
  setCart((prev) => [...prev, item]);
}, []);                                     // 2. dependencies

const ProductList = memo(function ProductList({ onAdd }) { ... });
<ProductList onAdd={handleAdd} />`}
    >
      <Example
        title="1. The problem: new function = re-render (without vs with)"
        description="Both cards are the same memo() component. Type in the status box and compare their render counters."
        code={withChild(withVsWithoutSource, 'components/ActionCard.jsx', actionCardSource)}
        fileName="examples/WithVsWithoutExample.jsx + components/ActionCard.jsx"
      >
        <WithVsWithoutExample />
      </Example>

      <Example
        title="2. Real world: a todo list with memoised rows"
        description="useCallback + updater functions keep handlers stable, so only the row that changed re-renders."
        code={withChild(todoListSource, 'components/TodoItem.jsx', todoItemSource)}
        fileName="examples/TodoListExample.jsx + components/TodoItem.jsx"
      >
        <TodoListExample />
      </Example>

      <Example
        title="3. Pitfall: missing dependencies (stale closure)"
        description="A callback with an empty dependency array keeps the values from the first render forever."
        code={staleSource}
        fileName="examples/StaleClosureExample.jsx"
      >
        <StaleClosureExample />
      </Example>

      <Example
        title="4. A function as a useEffect dependency"
        description="The effect depends on a memoised function, so unrelated re-renders do not trigger a new search."
        code={effectSource}
        fileName="examples/EffectDependencyExample.jsx"
      >
        <EffectDependencyExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <b>useCallback without memo()</b> - if the child is not wrapped in <code>memo()</code>, it re-renders
            with its parent anyway, so useCallback only adds overhead.
          </li>
          <li>
            <b>Stale values</b> - forgetting a dependency means the function reads old state. Add it to the array
            or switch to the updater form <code>setCount(c =&gt; c + 1)</code>.
          </li>
          <li>
            <b>Breaking memo with other props</b> - passing a new object or array (<code>style={'{{...}}'}</code>,{' '}
            <code>items={'{[...]}'}</code>) next to a memoised callback still makes memo() re-render. Memoise those
            with useMemo.
          </li>
          <li>
            <b>Calling instead of passing</b> - <code>onClick={'{handleClick()}'}</code> runs immediately during
            render; pass the function itself: <code>onClick={'{handleClick}'}</code>.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use useCallback">
        Use it when you pass a callback to a <code>memo()</code> component (large lists, heavy charts), when the
        function is a dependency of <code>useEffect</code>/<code>useMemo</code>, or when you return a function from a
        custom hook. Don't add it everywhere "just in case". The <b>React Compiler</b> (an optional build plugin)
        automatically memoises components, values and functions, so in compiler-enabled projects you will write far
        fewer manual <code>useCallback</code>/<code>useMemo</code> calls - but you will still meet them in most
        existing codebases.
      </Callout>
    </ConceptPage>
  );
}
