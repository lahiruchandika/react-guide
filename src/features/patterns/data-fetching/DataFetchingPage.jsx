/**
 * DataFetchingPage - lesson: loading data from an API.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   DataFetchingPage.jsx / .css  this page
 *   examples/                    one file per live demo (shown in the Code tab)
 *   components/                  UserCard, LogPanel (used by the demos)
 *   hooks/                       useEventLog (only needed by this lesson)
 *
 * Shared pieces used here: src/services/mockApi.js and src/hooks/useFetch.js
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './DataFetchingPage.css';

import BasicFetchExample from './examples/BasicFetchExample';
import basicSource from './examples/BasicFetchExample.jsx?raw';
import RaceConditionExample from './examples/RaceConditionExample';
import raceSource from './examples/RaceConditionExample.jsx?raw';
import CancelOnUnmountExample from './examples/CancelOnUnmountExample';
import unmountSource from './examples/CancelOnUnmountExample.jsx?raw';
import UseFetchHookExample from './examples/UseFetchHookExample';
import useFetchSource from './examples/UseFetchHookExample.jsx?raw';
import RealApiExample from './examples/RealApiExample';
import realApiSource from './examples/RealApiExample.jsx?raw';

export default function DataFetchingPage() {
  return (
    <ConceptPage
      topicId="data-fetching"
      intro={
        <p>
          Most apps load data from a server. In React you start the request in a <code>useEffect</code> (it runs after
          the component appears), store the result in state, and render one of three states:{' '}
          <strong>loading</strong>, <strong>error</strong> or <strong>data</strong>. The tricky parts are cancelling
          requests that are no longer needed and ignoring responses that arrive too late - this lesson shows both.
        </p>
      }
      keyPoints={[
        'Fetch inside useEffect, never directly in the component body',
        'Track three states: loading, error and data - and render each one',
        'fetch() only rejects on network errors - check res.ok for 404/500',
        'Cancel with AbortController in the cleanup to avoid race conditions',
        'Ignore AbortError - it means you cancelled on purpose',
        'Extract the pattern into a custom hook (useFetch) to avoid repetition',
      ]}
      syntax={`useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort(); // cleanup
}, [url]);`}
    >
      <Example
        title="1. Fetch in useEffect: loading, error, data + retry"
        description="Turn on the simulated server error, then use Retry. Skeleton cards keep the layout stable."
        code={basicSource}
        fileName="examples/BasicFetchExample.jsx"
      >
        <BasicFetchExample />
      </Example>

      <Example
        title="2. Race condition: without vs with AbortController"
        description="Click a slow user then a fast one. The left side ends up showing the wrong person."
        code={raceSource}
        fileName="examples/RaceConditionExample.jsx"
      >
        <RaceConditionExample />
      </Example>

      <Example
        title="3. Cancel the request when the component unmounts"
        description="Open the panel and close it before it finishes loading - the request is aborted."
        code={unmountSource}
        fileName="examples/CancelOnUnmountExample.jsx"
      >
        <CancelOnUnmountExample />
      </Example>

      <Example
        title="4. The useFetch custom hook"
        description="Everything from examples 1-3 in a single reusable line. Switch categories quickly."
        code={useFetchSource}
        fileName="examples/UseFetchHookExample.jsx"
      >
        <UseFetchHookExample />
      </Example>

      <Example
        title="5. A real public API with offline fallback"
        description="Loads posts from jsonplaceholder.typicode.com. If that fails, the local mock API takes over."
        code={realApiSource}
        fileName="examples/RealApiExample.jsx"
      >
        <RealApiExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>Making the effect itself <code>async</code> (<code>useEffect(async () =&gt; ...)</code>) - it must return a cleanup function, not a Promise. Define an async function inside and call it.</li>
          <li>Forgetting the dependency array: the effect fetches after every render, which sets state, which renders again... an infinite loop.</li>
          <li>No cleanup: old responses overwrite new ones (race condition) and unmounted components get updated.</li>
          <li>Assuming <code>fetch</code> throws on HTTP errors - a 404 still resolves; check <code>res.ok</code>.</li>
          <li>Showing an error for <code>AbortError</code> - that was your own cancellation.</li>
          <li>In development, StrictMode runs effects twice: you will see two requests on mount. That is expected and proves your cleanup works.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use what">
        <code>useEffect</code> + <code>fetch</code> (or a small <code>useFetch</code> hook) is perfect for learning
        and small apps. Larger apps usually use a data library such as <strong>TanStack Query</strong> or{' '}
        <strong>SWR</strong> (caching, deduping, background refresh), or the data loaders of a framework/router.
        React 19 also adds the <code>use()</code> API to read a Promise together with <code>&lt;Suspense&gt;</code>.
      </Callout>
    </ConceptPage>
  );
}
