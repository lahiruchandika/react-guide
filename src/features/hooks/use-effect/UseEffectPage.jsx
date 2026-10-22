/**
 * UseEffectPage - lesson: the useEffect hook
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   examples/     one file per live demo (shown in the "Code" tabs)
 *   components/   LogPanel + createLogger (helpers that visualise effect runs)
 *   api/          mockUserApi.js - a fake server for the fetching demo
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import DependencyArrayExample from './examples/DependencyArrayExample';
import dependencyArraySource from './examples/DependencyArrayExample.jsx?raw';
import DocumentTitleExample from './examples/DocumentTitleExample';
import documentTitleSource from './examples/DocumentTitleExample.jsx?raw';
import IntervalTimerExample from './examples/IntervalTimerExample';
import intervalTimerSource from './examples/IntervalTimerExample.jsx?raw';
import WindowSizeExample from './examples/WindowSizeExample';
import windowSizeSource from './examples/WindowSizeExample.jsx?raw';
import FetchDataExample from './examples/FetchDataExample';
import fetchDataSource from './examples/FetchDataExample.jsx?raw';
import mockApiSource from './api/mockUserApi.js?raw';

export default function UseEffectPage() {
  return (
    <ConceptPage
      topicId="use-effect"
      intro={
        <p>
          Rendering should be pure: take props and state, return JSX. But real apps also need to talk to the{' '}
          <strong>outside world</strong> - start timers, listen to window events, change the tab title, fetch
          data. <code>useEffect</code> lets you run that code <strong>after</strong> React has updated the
          screen, and gives you a <strong>cleanup</strong> function to undo it.
        </p>
      }
      keyPoints={[
        'Effects run AFTER the render is committed to the screen.',
        'No array = every render, [] = once on mount, [a, b] = when a or b change.',
        'Return a cleanup function to undo the effect (clear timers, remove listeners, cancel requests).',
        'Cleanup runs before the effect re-runs and when the component unmounts.',
        'In development, StrictMode runs mount -> cleanup -> mount to reveal missing cleanups.',
        'Don\'t use effects for values you can compute during render.',
      ]}
      syntax={`import { useEffect } from 'react';

useEffect(() => {
  // setup: runs after render
  const id = setInterval(tick, 1000);

  return () => {
    // cleanup: runs before the next effect and on unmount
    clearInterval(id);
  };
}, [dependency]); // re-run only when dependency changes`}
    >
      <Example
        title="1. When does an effect run? (dependency array)"
        description="Three effects with different dependency arrays write to the log. Type, click +1, and mount/unmount to compare."
        code={dependencyArraySource}
        fileName="examples/DependencyArrayExample.jsx"
      >
        <DependencyArrayExample />
      </Example>

      <Example
        title="2. Sync with the outside world: document.title"
        description="An inbox that writes the unread count into the real browser tab title, and restores it on cleanup."
        code={documentTitleSource}
        fileName="examples/DocumentTitleExample.jsx"
      >
        <DocumentTitleExample />
      </Example>

      <Example
        title="3. Timer with setInterval + cleanup"
        description="Start and pause the focus timer. Each pause clears the interval; each start creates a new one."
        code={intervalTimerSource}
        fileName="examples/IntervalTimerExample.jsx"
      >
        <IntervalTimerExample />
      </Example>

      <Example
        title="4. Event listener: window resize"
        description="Resize the browser window. The listener is added on mount and removed in the cleanup."
        code={windowSizeSource}
        fileName="examples/WindowSizeExample.jsx"
      >
        <WindowSizeExample />
      </Example>

      <Example
        title="5. Fetching data without race conditions"
        description="Switch users quickly. Compare no cleanup (bug) with an ignore flag and AbortController."
        code={`${fetchDataSource}\n\n// ===================== api/mockUserApi.js =====================\n\n${mockApiSource}`}
        fileName="examples/FetchDataExample.jsx + api/mockUserApi.js"
      >
        <FetchDataExample />
      </Example>

      <Callout type="info" title="Why does my effect run twice? (StrictMode)">
        In development, <code>&lt;StrictMode&gt;</code> (see <code>src/main.jsx</code>) deliberately mounts every
        component, immediately unmounts it, and mounts it again. You will see <em>effect → cleanup → effect</em>{' '}
        in the logs above. If your app behaves correctly after that, your cleanup is right. This only happens in
        development - production builds run effects once.
      </Callout>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <strong>Missing cleanup:</strong> intervals and listeners pile up and run multiple times.
          </li>
          <li>
            <strong>Missing dependencies:</strong> the effect keeps using old (stale) values. List every prop/state
            the effect reads.
          </li>
          <li>
            <strong>Infinite loops:</strong> <code>useEffect(() =&gt; setCount(count + 1))</code> with no array
            updates state after every render, which causes another render...
          </li>
          <li>
            <strong>Making the effect function async:</strong> <code>useEffect(async () =&gt; ...)</code> returns a
            Promise, not a cleanup. Define an async function inside and call it.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use useEffect (and when not)">
        Use it to <strong>synchronize</strong> with something outside React: timers, subscriptions, browser
        APIs, network requests, third-party widgets. You do <em>not</em> need an effect to transform data for
        rendering (compute it directly, or with <code>useMemo</code>) or to respond to a click (do it in the event
        handler).
      </Callout>
    </ConceptPage>
  );
}
