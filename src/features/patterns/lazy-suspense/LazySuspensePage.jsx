/**
 * LazySuspensePage - lesson: code splitting with React.lazy and <Suspense>.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   LazySuspensePage.jsx / .css   this page
 *   examples/                     one file per live demo (shown in the Code tab)
 *   components/                   SalesChart, ActivityFeed, TeamStats (the lazily
 *                                 loaded "heavy" components), Skeletons, ReviewList
 *   utils/lazyWithDelay.js        lazy() + fake network delay so loading is visible
 *   data/reviewsApi.js            fake server for the use() demo
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './LazySuspensePage.css';

import LazyOnClickExample from './examples/LazyOnClickExample';
import lazyOnClickSource from './examples/LazyOnClickExample.jsx?raw';
import NestedSuspenseExample from './examples/NestedSuspenseExample';
import nestedSource from './examples/NestedSuspenseExample.jsx?raw';
import LazyTabsExample from './examples/LazyTabsExample';
import tabsSource from './examples/LazyTabsExample.jsx?raw';
import SuspenseDataExample from './examples/SuspenseDataExample';
import dataSource from './examples/SuspenseDataExample.jsx?raw';
import reviewListSource from './components/ReviewList.jsx?raw';
import AppCodeSplittingExample from './examples/AppCodeSplittingExample';
import appSource from './examples/AppCodeSplittingExample.jsx?raw';
import routesSource from '@/app/routes.jsx?raw';

const combine = (...parts) =>
  parts.map(([name, src]) => `// ===================== ${name} =====================\n\n${src.trim()}`).join('\n\n\n');

export default function LazySuspensePage() {
  return (
    <ConceptPage
      topicId="lazy-suspense"
      intro={
        <p>
          By default, all your components are bundled into one big JavaScript file that must download before anything
          shows. <code>React.lazy</code> lets you <strong>split</strong> a component into its own file that is
          downloaded <strong>only when it is first rendered</strong>. While it loads, the nearest{' '}
          <code>&lt;Suspense&gt;</code> boundary shows a <code>fallback</code> (spinner or skeleton). In React 19,
          Suspense also works for <strong>data</strong> with the <code>use()</code> hook.
        </p>
      }
      keyPoints={[
        'lazy(() => import(\'./X\')) - X must be a default export',
        'Call lazy() at the top level of a module, never inside a component',
        'A suspending component shows the fallback of the NEAREST <Suspense> above it',
        'Nested boundaries let fast parts appear early; one boundary waits for everything',
        'startTransition keeps the old UI visible instead of flashing a fallback',
        'Route-based splitting (one chunk per page) is the best place to start',
      ]}
      syntax={`import { lazy, Suspense } from 'react';

// top level of the file
const SalesChart = lazy(() => import('./SalesChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <SalesChart />
    </Suspense>
  );
}`}
    >
      <Example
        title="1. Load a heavy component on click"
        description="The chart's code is downloaded the first time you show it (with a fake 1.5s delay). The second time it's instant."
        code={lazyOnClickSource}
        fileName="examples/LazyOnClickExample.jsx"
      >
        <LazyOnClickExample />
      </Example>

      <Example
        title="2. One boundary vs nested boundaries"
        description="Three widgets load at different speeds. Compare when each one appears with one Suspense vs nested Suspense boundaries."
        code={nestedSource}
        fileName="examples/NestedSuspenseExample.jsx"
      >
        <NestedSuspenseExample />
      </Example>

      <Example
        title="3. Lazy tabs with startTransition"
        description="Switch tabs with and without startTransition. With it, the old tab stays visible until the new one is ready."
        code={tabsSource}
        fileName="examples/LazyTabsExample.jsx"
      >
        <LazyTabsExample />
      </Example>

      <Example
        title="4. Suspense for data: use(promise) (React 19)"
        description="Pick a product - the reviews component suspends while its data promise is pending."
        code={combine(['examples/SuspenseDataExample.jsx', dataSource], ['components/ReviewList.jsx', reviewListSource])}
        fileName="examples/SuspenseDataExample.jsx + components/ReviewList.jsx"
      >
        <SuspenseDataExample />
      </Example>

      <Example
        title="5. This app does it too: every lesson is lazy"
        description="The Code tab shows the app's real src/app/routes.jsx - one lazy() per lesson."
        code={combine(['examples/AppCodeSplittingExample.jsx', appSource], ['src/app/routes.jsx', routesSource])}
        fileName="examples/AppCodeSplittingExample.jsx + src/app/routes.jsx"
      >
        <AppCodeSplittingExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li><strong>Calling <code>lazy()</code> inside a component</strong> - a new lazy component each render means its state resets and it loads again. Declare it at the top of the file.</li>
          <li><strong>Named exports:</strong> <code>lazy</code> needs a default export. For named ones: <code>lazy(() =&gt; import(&apos;./X&apos;).then((m) =&gt; ({'{ default: m.Chart }'})))</code>.</li>
          <li><strong>No Suspense boundary</strong> above a lazy component (or a component calling <code>use()</code>) - React has nothing to show while waiting.</li>
          <li><strong>Creating the promise during render</strong> for <code>use()</code>: <code>use(fetchData())</code> makes a new promise every render. Create it in an event handler, a loader or a cache.</li>
          <li><strong>Splitting tiny components</strong>: every chunk is an extra network request. Split big, rarely-used things (pages, charts, editors, modals).</li>
          <li><strong>Forgetting errors</strong>: if the download fails (offline), the error goes to the nearest Error Boundary - see the next lesson.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Pages/routes, big third-party widgets (charts, maps, rich-text editors, PDF viewers), admin-only screens, and
        dialogs or panels that most users never open. Use skeletons that match the final layout, and place boundaries
        around independent sections so fast content isn&apos;t blocked by slow content.
      </Callout>
    </ConceptPage>
  );
}
