/**
 * UseTransitionPage - the "useTransition & useDeferredValue" lesson.
 *
 *   data/products.js                  2,000 fake products
 *   utils/slow.js                     fake CPU work to make rendering slow
 *   components/SlowProductList.jsx    an intentionally slow, memoized list
 *   examples/                         one file per live demo below
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import TabsTransitionExample from './examples/TabsTransitionExample';
import tabsSource from './examples/TabsTransitionExample.jsx?raw';
import FilterTransitionExample from './examples/FilterTransitionExample';
import filterSource from './examples/FilterTransitionExample.jsx?raw';
import DeferredSearchExample from './examples/DeferredSearchExample';
import deferredSource from './examples/DeferredSearchExample.jsx?raw';
import slowListSource from './components/SlowProductList.jsx?raw';
import AsyncTransitionExample from './examples/AsyncTransitionExample';
import asyncSource from './examples/AsyncTransitionExample.jsx?raw';
import './UseTransitionPage.css';

// Show the slow list component together with the useDeferredValue demo
const deferredWithListSource = `${deferredSource}\n\n// ===================== components/SlowProductList.jsx =====================\n\n${slowListSource}`;

export default function UseTransitionPage() {
  return (
    <ConceptPage
      topicId="use-transition"
      intro={
        <p>
          By default every state update is <strong>urgent</strong>: React finishes the whole re-render before the
          browser can react to the next click or keystroke. If one update is slow (a big list, a heavy chart), the
          entire page freezes. <code>useTransition</code> and <code>useDeferredValue</code> let you mark some work as{' '}
          <strong>non-urgent</strong>: React keeps the UI responsive, renders the slow part in the background, and
          throws that work away if a newer update arrives.
        </p>
      }
      keyPoints={[
        'useTransition() returns [isPending, startTransition]; wrap NON-urgent state updates in startTransition.',
        'useDeferredValue(value) returns a copy of value that may lag behind while React is busy.',
        'Keep text inputs urgent - never put the input value itself inside a transition.',
        'Background renders are interruptible: a new keystroke cancels the outdated one.',
        'Wrap the slow component in memo() so urgent renders can skip it.',
        'React 19: startTransition accepts async functions (Actions); isPending covers the whole await.',
      ]}
      syntax={`// useTransition: defer a state UPDATE
const [isPending, startTransition] = useTransition();
startTransition(() => setQuery(text));

// useDeferredValue: defer a VALUE
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;`}
    >
      <Example
        title="1. Slow tab with useTransition"
        description="Click 'Products (slow)' then quickly 'Contact'. Toggle the switch off to feel the blocking version."
        code={tabsSource}
        fileName="examples/TabsTransitionExample.jsx"
      >
        <TabsTransitionExample />
      </Example>

      <Example
        title="2. Blocking vs non-blocking filter"
        description="Type quickly in both modes. With useTransition the input stays smooth and the list catches up; in Blocking mode every keystroke waits for the list."
        code={filterSource}
        fileName="examples/FilterTransitionExample.jsx"
      >
        <FilterTransitionExample />
      </Example>

      <Example
        title="3. Search with useDeferredValue"
        description="The input uses normal state; the list renders a deferred copy. While it catches up, the old results are dimmed."
        code={deferredWithListSource}
        fileName="examples/DeferredSearchExample.jsx + components/SlowProductList.jsx"
      >
        <DeferredSearchExample />
      </Example>

      <Example
        title="4. React 19: async transitions (Actions)"
        description="startTransition with an async function. isPending stays true until the mock server responds - no manual loading state."
        code={asyncSource}
        fileName="examples/AsyncTransitionExample.jsx"
      >
        <AsyncTransitionExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Wrapping the <strong>input's own value</strong> in startTransition - the text field would lag. Keep the
            input urgent and defer only what depends on it.
          </li>
          <li>
            Forgetting <code>memo()</code> on the slow component: it re-renders on every urgent update anyway, so
            nothing gets faster.
          </li>
          <li>
            Expecting transitions to make code faster. They don't reduce work - they just keep the UI responsive
            while the work happens. Also optimise the slow component itself.
          </li>
          <li>
            Using them for <code>setTimeout</code>-style debouncing of network calls. Transitions are about
            rendering; for fewer requests, debounce the fetch.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        <strong>useTransition</strong> when you own the state update: switching tabs or pages, applying filters,
        submitting with async Actions. <strong>useDeferredValue</strong> when you only have the value (e.g. from
        props) or want the simplest code for "search box + big list". If nothing is slow, you need neither.
      </Callout>
    </ConceptPage>
  );
}
