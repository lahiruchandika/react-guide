/**
 * EventsFormsPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: Events & Forms
 *
 *   events-forms/
 *   ├── EventsFormsPage.jsx     <- this page
 *   ├── EventsFormsPage.css     <- lesson styles ("ef-" prefix)
 *   ├── examples/               <- one file per live demo
 *   ├── components/             <- PasswordStrength, SubmittedPreview
 *   └── utils/                  <- validateSignUp.js (pure functions, no React)
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './EventsFormsPage.css';

import ClickEventsExample from './examples/ClickEventsExample';
import EventObjectExample from './examples/EventObjectExample';
import ControlledInputsExample from './examples/ControlledInputsExample';
import SignUpFormExample from './examples/SignUpFormExample';

import clickSource from './examples/ClickEventsExample.jsx?raw';
import eventObjectSource from './examples/EventObjectExample.jsx?raw';
import controlledSource from './examples/ControlledInputsExample.jsx?raw';
import signUpSource from './examples/SignUpFormExample.jsx?raw';
import strengthSource from './components/PasswordStrength.jsx?raw';
import previewSource from './components/SubmittedPreview.jsx?raw';
import validateSource from './utils/validateSignUp.js?raw';

// Combine the form and its helper files into one Code tab.
const signUpAllFiles = [
  ['examples/SignUpFormExample.jsx', signUpSource],
  ['utils/validateSignUp.js', validateSource],
  ['components/PasswordStrength.jsx', strengthSource],
  ['components/SubmittedPreview.jsx', previewSource],
]
  .map(([file, src]) => `// ======================= ${file} =======================\n${src.trim()}`)
  .join('\n\n');

export default function EventsFormsPage() {
  return (
    <ConceptPage
      topicId="events-forms"
      intro={
        <>
          <p>
            Users interact with your app through <strong>events</strong>: clicks, key presses, typing,
            submitting a form. In React you attach a handler with a camelCase prop such as{' '}
            <code>onClick</code> or <code>onChange</code>, and React calls your function with an{' '}
            <strong>event object</strong> describing what happened.
          </p>
          <p>
            For forms, React prefers <strong>controlled inputs</strong>: the input shows a value from state,
            and every change updates that state. Your state is then always the single source of truth -
            perfect for validation, live previews and submitting.
          </p>
        </>
      }
      keyPoints={[
        'Pass a function, do not call it: onClick={handleClick}, or onClick={() => handle(id)}.',
        'Handlers receive an event object: e.target, e.key, e.type, e.preventDefault()...',
        'Controlled input = value from state + onChange that updates state.',
        'Checkboxes use checked / e.target.checked; everything else uses value / e.target.value.',
        'Put onSubmit on the <form> and call e.preventDefault() to stop the page reload.',
        'Derive validation errors from state instead of storing them separately.',
      ]}
      syntax={`function Form() {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // stop page reload
    console.log('Send', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}`}
    >
      <Example
        title="1. Click & mouse events"
        description="onClick with arguments, onMouseEnter/Leave and onDoubleClick - every event is written to the log."
        code={clickSource}
        fileName="examples/ClickEventsExample.jsx"
      >
        <ClickEventsExample />
      </Example>

      <Example
        title="2. The event object: keys, preventDefault & bubbling"
        description="Inspect keyboard events, block keys with preventDefault, and watch a click bubble up through parent elements."
        code={eventObjectSource}
        fileName="examples/EventObjectExample.jsx"
      >
        <EventObjectExample />
      </Example>

      <Example
        title="3. Controlled inputs: every input type"
        description="A pizza order form using text, select, radio, checkbox group, single checkbox, range and textarea."
        code={controlledSource}
        fileName="examples/ControlledInputsExample.jsx"
      >
        <ControlledInputsExample />
      </Example>

      <Example
        title="4. A real sign-up form with validation"
        description="One state object, one change handler, validation on blur and submit, a loading state and a result preview."
        code={signUpAllFiles}
        fileName="examples/SignUpFormExample.jsx + utils + components"
      >
        <SignUpFormExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <code>{'onClick={handleClick()}'}</code> calls the function during render. Remove the{' '}
            <code>()</code> or wrap it: <code>{'onClick={() => handleClick(id)}'}</code>.
          </li>
          <li>Forgetting <code>e.preventDefault()</code> in onSubmit - the whole page reloads and state is lost.</li>
          <li>
            Setting <code>value</code> without <code>onChange</code> - the input becomes read-only (React warns
            about it). Use <code>defaultValue</code> for an uncontrolled input instead.
          </li>
          <li>
            Reading <code>e.target.value</code> for a checkbox - use <code>e.target.checked</code>.
          </li>
          <li>
            Forgetting that <code>e.target.value</code> is always a <strong>string</strong>, even for{' '}
            <code>type=&quot;number&quot;</code> and range inputs. Convert with <code>Number()</code>.
          </li>
          <li>
            Switching an input between <code>undefined</code> and a value (uncontrolled → controlled). Always
            start with <code>&apos;&apos;</code> or <code>false</code>.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use what">
        Controlled inputs are the default choice: you need them for live validation, formatting and
        dependent fields. For big forms, one state object with a generic <code>handleChange</code> (using the
        input&apos;s <code>name</code>) keeps the code short. In React 19 you can also use{' '}
        <code>{'<form action={fn}>'}</code> with <code>FormData</code> for simple, uncontrolled forms - but
        learn controlled inputs first.
      </Callout>
    </ConceptPage>
  );
}
