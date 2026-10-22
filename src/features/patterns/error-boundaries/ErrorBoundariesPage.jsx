/**
 * ErrorBoundariesPage - lesson: catching render errors with Error Boundaries.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   ErrorBoundariesPage.jsx / .css    this page
 *   examples/                         one file per live demo (shown in the Code tab)
 *   components/ErrorBoundary.jsx      the reusable class component (read this first!)
 *   components/ErrorFallback.jsx      friendly fallback UI
 *   components/BuggyCounter.jsx       crashes at 5
 *   components/DashboardWidget.jsx    crashes when you click "Break"
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './ErrorBoundariesPage.css';

import BasicBoundaryExample from './examples/BasicBoundaryExample';
import basicSource from './examples/BasicBoundaryExample.jsx?raw';
import boundarySource from './components/ErrorBoundary.jsx?raw';
import buggySource from './components/BuggyCounter.jsx?raw';
import GranularBoundariesExample from './examples/GranularBoundariesExample';
import granularSource from './examples/GranularBoundariesExample.jsx?raw';
import NotCaughtExample from './examples/NotCaughtExample';
import notCaughtSource from './examples/NotCaughtExample.jsx?raw';
import ResetKeysExample from './examples/ResetKeysExample';
import resetKeysSource from './examples/ResetKeysExample.jsx?raw';

const combine = (...parts) =>
  parts.map(([name, src]) => `// ===================== ${name} =====================\n\n${src.trim()}`).join('\n\n\n');

export default function ErrorBoundariesPage() {
  return (
    <ConceptPage
      topicId="error-boundaries"
      intro={
        <p>
          If a component throws an error while rendering, React removes the <strong>entire</strong> component tree -
          your users see a blank page. An <strong>Error Boundary</strong> is a component that catches errors thrown by
          its children during rendering, shows a <strong>fallback UI</strong> instead, and lets the rest of the app keep
          working. Think of it as a <code>try/catch</code> for JSX.
        </p>
      }
      keyPoints={[
        'Error boundaries must be class components (static getDerivedStateFromError)',
        'getDerivedStateFromError -> switch to the fallback; componentDidCatch -> log the error',
        'They catch errors during rendering of their CHILDREN (not in themselves)',
        'They do NOT catch errors in event handlers or async code - use try/catch there',
        'Place boundaries at several levels: app-wide safety net + around independent widgets',
        'Provide a way to recover: a reset button or resetKeys',
      ]}
      syntax={`class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };            // show fallback on next render
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

<ErrorBoundary fallback={<p>Oops!</p>}>
  <Profile />
</ErrorBoundary>`}
    >
      <Example
        title="1. Catch a crash and reset"
        description="Count up to 5 - the counter throws. The boundary shows a fallback; 'Try again' renders it fresh."
        code={combine(
          ['examples/BasicBoundaryExample.jsx', basicSource],
          ['components/ErrorBoundary.jsx', boundarySource],
          ['components/BuggyCounter.jsx', buggySource],
        )}
        fileName="examples/BasicBoundaryExample.jsx + components/ErrorBoundary.jsx + BuggyCounter.jsx"
      >
        <BasicBoundaryExample />
      </Example>

      <Example
        title="2. Granular vs whole-section boundaries"
        description="Break a widget on each side. One big boundary loses everything; one boundary per widget isolates the failure."
        code={granularSource}
        fileName="examples/GranularBoundariesExample.jsx"
      >
        <GranularBoundariesExample />
      </Example>

      <Example
        title="3. What error boundaries don't catch"
        description="Event handler and async errors bypass the boundary - handle them with try/catch. Button 3 shows how to forward one on purpose."
        code={notCaughtSource}
        fileName="examples/NotCaughtExample.jsx"
      >
        <NotCaughtExample />
      </Example>

      <Example
        title="4. resetKeys and error logging"
        description="User #3 has corrupted data. The boundary resets automatically when you pick another user, and reports errors with componentDidCatch."
        code={resetKeysSource}
        fileName="examples/ResetKeysExample.jsx"
      >
        <ResetKeysExample />
      </Example>

      <Callout type="info" title="Good to know">
        In development React logs every caught error to the console (&quot;The above error occurred in...&quot;) even
        when a boundary handles it - that&apos;s normal. React 19 also lets you hook into all errors at the root with{' '}
        <code>createRoot(el, {'{ onCaughtError, onUncaughtError }'})</code>. Many projects use the{' '}
        <code>react-error-boundary</code> package, which provides the same component you built here.
      </Callout>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li><strong>Expecting it to catch onClick errors</strong> - it won&apos;t. Use <code>try/catch</code> and state for event handlers and async code.</li>
          <li><strong>Only one boundary at the very top</strong> - any small error replaces the whole app with an error screen.</li>
          <li><strong>A boundary that throws in its own fallback</strong> - the error goes to the NEXT boundary up. Keep fallbacks simple.</li>
          <li><strong>No way to recover</strong> - always offer &quot;Try again&quot;, a link home, or reset via <code>resetKeys</code>.</li>
          <li><strong>Hiding bugs</strong> - a boundary is a safety net, not a fix. Log errors (componentDidCatch) so you can repair the cause.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Around each route/page, around independent widgets (charts, comments, ads, third-party embeds), around lazy-loaded
        components (a failed chunk download is also caught), and one top-level boundary as the final safety net.
      </Callout>
    </ConceptPage>
  );
}
