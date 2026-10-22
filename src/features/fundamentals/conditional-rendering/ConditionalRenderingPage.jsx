/**
 * ConditionalRenderingPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: Conditional Rendering - showing different UI for different states.
 *
 * Each live demo lives in its own file inside ./examples/. The `?raw` imports
 * load the SAME file as plain text, so the "Code" tab always shows the real
 * source of the demo you are playing with.
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import EarlyReturnExample from './examples/EarlyReturnExample';
import earlyReturnSource from './examples/EarlyReturnExample.jsx?raw';
import TernaryAndExample from './examples/TernaryAndExample';
import ternaryAndSource from './examples/TernaryAndExample.jsx?raw';
import ZeroPitfallExample from './examples/ZeroPitfallExample';
import zeroPitfallSource from './examples/ZeroPitfallExample.jsx?raw';
import StatusMapExample from './examples/StatusMapExample';
import statusMapSource from './examples/StatusMapExample.jsx?raw';
import ToggleUiExample from './examples/ToggleUiExample';
import toggleUiSource from './examples/ToggleUiExample.jsx?raw';

import './ConditionalRenderingPage.css';

export default function ConditionalRenderingPage() {
  return (
    <ConceptPage
      topicId="conditional-rendering"
      intro={
        <p>
          React has no special &quot;v-if&quot; syntax. You decide what to show with <strong>plain JavaScript</strong>:
          an <code>if</code> before the <code>return</code>, the ternary <code>? :</code> inside JSX, the logical{' '}
          <code>&amp;&amp;</code> operator, or a lookup object. When state changes, the component re-renders and the
          condition is evaluated again.
        </p>
      }
      keyPoints={[
        'Use if + early return to render a completely different screen.',
        'Use condition ? <A /> : <B /> to choose between two pieces of UI.',
        'Use condition && <A /> to render something or nothing.',
        'Returning null renders nothing (the component still exists).',
        'Watch out: {0 && <A />} renders "0" - use a real boolean like count > 0.',
        'For many states (loading / error / success) use an object map or switch.',
      ]}
      syntax={`// 1. if + early return
if (!user) return <Login />;

// 2. ternary: either / or
{isOnline ? <Online /> : <Offline />}

// 3. && : something or nothing
{count > 0 && <Badge count={count} />}

// 4. object map for many states
const VIEWS = { loading: Spinner, success: List };
const View = VIEWS[status];
return <View />;`}
    >
      <Example
        title="1. if + early return (and returning null)"
        description="Log in and out. The Dashboard returns a different screen when there is no user; the banner returns null when there is nothing to show."
        code={earlyReturnSource}
        fileName="examples/EarlyReturnExample.jsx"
      >
        <EarlyReturnExample />
      </Example>

      <Example
        title="2. Ternary ? : and logical &&"
        description="Flip the switches on the left and watch which parts of the product card appear, disappear or change."
        code={ternaryAndSource}
        fileName="examples/TernaryAndExample.jsx"
      >
        <TernaryAndExample />
      </Example>

      <Example
        title='3. The "0 &&" pitfall - bad vs good'
        description="Remove items until the cart is empty. The left version prints a stray 0, the right version correctly renders nothing."
        code={zeroPitfallSource}
        fileName="examples/ZeroPitfallExample.jsx"
      >
        <ZeroPitfallExample />
      </Example>

      <Example
        title="4. Many states: object map & switch"
        description="Choose what the fake server returns, then load. One component per status is picked from a lookup object - no if/else chain."
        code={statusMapSource}
        fileName="examples/StatusMapExample.jsx"
      >
        <StatusMapExample />
      </Example>

      <Example
        title="5. Toggling UI: accordion, show password, hide vs unmount"
        description="Store which item is open, flip booleans, and see that && unmounts a component (its state is lost) while hidden only hides it."
        code={toggleUiSource}
        fileName="examples/ToggleUiExample.jsx"
      >
        <ToggleUiExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Writing <code>if</code> inside JSX - JSX only accepts expressions. Move the <code>if</code> above the{' '}
            <code>return</code> or use a ternary.
          </li>
          <li>
            <code>{'{items.length && <List />}'}</code> renders <code>0</code> when the array is empty. Use{' '}
            <code>{'items.length > 0 &&'}</code>.
          </li>
          <li>Deeply nested ternaries (a ? b : c ? d : e) are hard to read - extract a component or use a map.</li>
          <li>
            Calling hooks after an early return. Hooks must run in the same order every render, so put all{' '}
            <code>useState</code>/<code>useEffect</code> calls <em>before</em> any <code>return</code>.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use which">
        <ul>
          <li>
            <strong>Early return</strong> - guard clauses: not logged in, still loading, no data.
          </li>
          <li>
            <strong>Ternary</strong> - two alternatives in the same spot (Login / Logout button).
          </li>
          <li>
            <strong>&amp;&amp;</strong> - optional extras (badges, warnings, a selected-item panel).
          </li>
          <li>
            <strong>Object map / switch</strong> - three or more mutually exclusive states.
          </li>
        </ul>
      </Callout>
    </ConceptPage>
  );
}
