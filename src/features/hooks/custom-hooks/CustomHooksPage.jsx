/**
 * CustomHooksPage - lesson: building and using your own hooks.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   CustomHooksPage.jsx / .css   this page
 *   examples/                    one file per live demo (shown in the Code tab)
 *   components/                  small pieces used by the page and demos
 *
 * The reusable hooks themselves live in src/hooks/ so ANY feature can use them.
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import RulesOfHooks from './components/RulesOfHooks';
import HookLibrary from './components/HookLibrary';
import './CustomHooksPage.css';

// Live demos + their source code (Vite "?raw" imports a file as a string)
import FirstCustomHookExample from './examples/FirstCustomHookExample';
import firstSource from './examples/FirstCustomHookExample.jsx?raw';
import ExtractLogicExample from './examples/ExtractLogicExample';
import extractSource from './examples/ExtractLogicExample.jsx?raw';
import UseToggleExample from './examples/UseToggleExample';
import toggleSource from './examples/UseToggleExample.jsx?raw';
import UseDebounceExample from './examples/UseDebounceExample';
import debounceSource from './examples/UseDebounceExample.jsx?raw';
import UseFetchExample from './examples/UseFetchExample';
import fetchSource from './examples/UseFetchExample.jsx?raw';

export default function CustomHooksPage() {
  return (
    <ConceptPage
      topicId="custom-hooks"
      intro={
        <p>
          A <strong>custom hook</strong> is a normal JavaScript function whose name starts with <code>use</code> and
          that calls other hooks. It lets you pull stateful logic (subscriptions, timers, fetching, storage...) out of
          a component, give it a clear name, and reuse it anywhere. Components become short and readable:
          they describe <em>what</em> they need, the hook handles <em>how</em>.
        </p>
      }
      keyPoints={[
        'A custom hook is just a function named useSomething that calls other hooks',
        'It shares LOGIC, not state - every call gets its own independent state',
        'Return whatever is convenient: a value, an array [value, setter] or an object',
        'Hooks can use other hooks: useFetch + useDebounce = debounced search',
        'Follow the Rules of Hooks inside custom hooks too',
        'Put reusable hooks in src/hooks/, feature-only hooks next to the feature',
      ]}
      syntax={`// src/hooks/useToggle.js
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// any component
const [isOpen, toggleOpen] = useToggle();`}
    >
      <Example
        title="1. Your first custom hook: useCounter"
        description="Three cart rows use the same hook. Each one gets its own quantity - hooks share logic, not state."
        code={firstSource}
        fileName="examples/FirstCustomHookExample.jsx"
      >
        <FirstCustomHookExample />
      </Example>

      <Example
        title="2. Extracting logic: before vs after"
        description="Same UI, same behaviour. Resize the window or go offline - the right side needs only two lines."
        code={extractSource}
        fileName="examples/ExtractLogicExample.jsx"
      >
        <ExtractLogicExample />
      </Example>

      <Example
        title="3. useToggle in three places"
        description="Password visibility, a switch and an FAQ accordion - all powered by the same tiny hook."
        code={toggleSource}
        fileName="examples/UseToggleExample.jsx"
      >
        <UseToggleExample />
      </Example>

      <Example
        title="4. useDebounce + useFetch: search as you type"
        description="Type quickly and compare keystrokes with real searches. Hooks compose like LEGO bricks."
        code={debounceSource}
        fileName="examples/UseDebounceExample.jsx"
      >
        <UseDebounceExample />
      </Example>

      <Example
        title="5. useFetch: loading, error, retry in one line"
        description="Switch authors quickly and turn on the flaky server to see error handling and Retry."
        code={fetchSource}
        fileName="examples/UseFetchExample.jsx"
      >
        <UseFetchExample />
      </Example>

      <RulesOfHooks />

      <HookLibrary />

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>Naming a hook without the <code>use</code> prefix - React and the linter can't check the rules.</li>
          <li>Expecting two components to share state just because they call the same hook (use Context or lift state up for that).</li>
          <li>Forgetting the cleanup in a hook&apos;s effect (listeners, timers, requests) - every component using it leaks.</li>
          <li>Making everything a hook. If a function doesn&apos;t call any hooks, it&apos;s just a regular helper function.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to write a custom hook">
        When you copy-paste the same <code>useState</code> + <code>useEffect</code> combination into a second
        component, or when a component&apos;s logic hides what it renders. Good names describe the purpose:{' '}
        <code>useOnlineStatus</code>, <code>useCart</code>, <code>useAuth</code> - not <code>useEffectOnce</code>.
      </Callout>
    </ConceptPage>
  );
}
