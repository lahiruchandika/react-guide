/**
 * RefsForwardingPage - lesson: passing refs to child components (React 19).
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   RefsForwardingPage.jsx / .css   this page
 *   examples/                       one file per live demo (shown in the Code tab)
 *   components/                     TextInput, SmartInput, VideoPlayer, NoteCard,
 *                                   LegacyInput - the children that receive refs
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './RefsForwardingPage.css';

import RefAsPropExample from './examples/RefAsPropExample';
import refAsPropSource from './examples/RefAsPropExample.jsx?raw';
import ImperativeHandleExample from './examples/ImperativeHandleExample';
import imperativeSource from './examples/ImperativeHandleExample.jsx?raw';
import smartInputSource from './components/SmartInput.jsx?raw';
import VideoPlayerExample from './examples/VideoPlayerExample';
import videoSource from './examples/VideoPlayerExample.jsx?raw';
import videoPlayerSource from './components/VideoPlayer.jsx?raw';
import CallbackRefExample from './examples/CallbackRefExample';
import callbackSource from './examples/CallbackRefExample.jsx?raw';
import noteCardSource from './components/NoteCard.jsx?raw';
import LegacyForwardRefExample from './examples/LegacyForwardRefExample';
import legacySource from './examples/LegacyForwardRefExample.jsx?raw';
import legacyInputSource from './components/LegacyInput.jsx?raw';
import textInputSource from './components/TextInput.jsx?raw';

// Show the example AND the child component it uses in the Code tab.
const withChild = (exampleSrc, childName, childSrc) =>
  `${exampleSrc.trim()}\n\n\n// ===================== ${childName} =====================\n\n${childSrc.trim()}`;

export default function RefsForwardingPage() {
  return (
    <ConceptPage
      topicId="refs-forwarding"
      intro={
        <p>
          A <code>ref</code> gives you direct access to a DOM element (to focus it, measure it, play a video...). On a
          plain <code>&lt;input&gt;</code> that&apos;s easy, but what if the input lives <strong>inside your own
          component</strong>? In <strong>React 19</strong>, <code>ref</code> is simply a prop: the parent passes it and
          the child puts it on the element. With <code>useImperativeHandle</code> the child can instead expose a small
          custom API like <code>focus()</code>, <code>clear()</code> or <code>play()</code>.
        </p>
      }
      keyPoints={[
        'React 19: function components receive ref as a normal prop - no forwardRef needed',
        'The child decides where the ref goes: put it on the DOM element you want to expose',
        'useImperativeHandle(ref, () => ({ ...methods })) exposes a custom API instead of the DOM node',
        'Commands go down through the ref; data/events still go up through callback props',
        'Callback refs can return a cleanup function in React 19',
        'Only read or use ref.current in event handlers and effects, never during render',
      ]}
      syntax={`// Child (React 19): ref is just a prop
function TextInput({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Child with a custom API
function Player({ ref }) {
  useImperativeHandle(ref, () => ({ play() {}, pause() {} }));
}

// Parent
const inputRef = useRef(null);
<TextInput ref={inputRef} />
inputRef.current.focus();`}
    >
      <Example
        title="1. Pass a ref as a prop to your own component"
        description="The parent focuses and selects the input that lives inside <TextInput>. Press '/' anywhere on the page."
        code={withChild(refAsPropSource, 'components/TextInput.jsx', textInputSource)}
        fileName="examples/RefAsPropExample.jsx + components/TextInput.jsx"
      >
        <RefAsPropExample />
      </Example>

      <Example
        title="2. useImperativeHandle: expose focus / clear / shake"
        description="Enter a wrong coupon code - the parent calls the child's shake() method. ref.current is a custom object, not the DOM node."
        code={withChild(imperativeSource, 'components/SmartInput.jsx', smartInputSource)}
        fileName="examples/ImperativeHandleExample.jsx + components/SmartInput.jsx"
      >
        <ImperativeHandleExample />
      </Example>

      <Example
        title="3. Real-world: controlling a video player"
        description="A remote control and a chapter list send commands (play, pause, seek) to the player through its ref."
        code={withChild(videoSource, 'components/VideoPlayer.jsx', videoPlayerSource)}
        fileName="examples/VideoPlayerExample.jsx + components/VideoPlayer.jsx"
      >
        <VideoPlayerExample />
      </Example>

      <Example
        title="4. Callback refs with cleanup (new in React 19)"
        description="Each card attaches a ResizeObserver in a ref callback and returns a cleanup. Resize the textareas, add and remove notes."
        code={withChild(callbackSource, 'components/NoteCard.jsx', noteCardSource)}
        fileName="examples/CallbackRefExample.jsx + components/NoteCard.jsx"
      >
        <CallbackRefExample />
      </Example>

      <Example
        title="5. Legacy: forwardRef (before React 19)"
        description="You will meet forwardRef in older code and libraries. It still works, but React 19 no longer needs it."
        code={withChild(legacySource, 'components/LegacyInput.jsx', legacyInputSource)}
        fileName="examples/LegacyForwardRefExample.jsx + components/LegacyInput.jsx"
      >
        <LegacyForwardRefExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li><strong>Reading <code>ref.current</code> during render</strong> - it is <code>null</code> on the first render and changing it never re-renders. Use it in event handlers or effects.</li>
          <li><strong>Forgetting to attach the ref</strong> in the child: receiving <code>ref</code> but not putting it on any element leaves <code>ref.current</code> as <code>null</code>.</li>
          <li><strong>Using refs instead of props/state</strong>: don&apos;t call <code>ref.current.setOpen(true)</code> when an <code>isOpen</code> prop would do. Refs are an escape hatch for imperative things (focus, scroll, media, animations).</li>
          <li><strong>Exposing the whole DOM node</strong> when the parent only needs one or two actions - prefer a small API with <code>useImperativeHandle</code>.</li>
          <li><strong>An inline callback ref</strong> (<code>ref={'{(n) => ...}'}</code>) is re-run on every render. Wrap it in <code>useCallback</code> if it does real work.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Focus management (forms, search, modals), scrolling an element into view, measuring size/position, controlling
        media (<code>play()</code>, <code>pause()</code>), triggering animations, and integrating non-React libraries
        (maps, charts, editors) that need a real DOM node.
      </Callout>
    </ConceptPage>
  );
}
