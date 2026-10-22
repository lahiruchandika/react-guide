/**
 * UseIdPage - the "useId" lesson.
 *
 *   components/FormField.jsx   reusable accessible field (label + hint + error)
 *   examples/                  one file per live demo below
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import LabelInputExample from './examples/LabelInputExample';
import labelInputSource from './examples/LabelInputExample.jsx?raw';
import ReusableFieldExample from './examples/ReusableFieldExample';
import reusableFieldSource from './examples/ReusableFieldExample.jsx?raw';
import formFieldSource from './components/FormField.jsx?raw';
import RelatedIdsExample from './examples/RelatedIdsExample';
import relatedIdsSource from './examples/RelatedIdsExample.jsx?raw';
import WhyNotRandomExample from './examples/WhyNotRandomExample';
import whyNotRandomSource from './examples/WhyNotRandomExample.jsx?raw';
import './UseIdPage.css';

// Show the reusable component together with the form that uses it
const reusableSource = `${formFieldSource}\n\n// ===================== examples/ReusableFieldExample.jsx =====================\n\n${reusableFieldSource}`;

export default function UseIdPage() {
  return (
    <ConceptPage
      topicId="use-id"
      intro={
        <p>
          HTML accessibility attributes connect elements by <strong>id</strong>: <code>{'<label htmlFor>'}</code>{' '}
          points to an input, <code>aria-describedby</code> points to a hint or error. But a reusable component can
          appear many times on one page, so a hard-coded <code>id="email"</code> would be duplicated.{' '}
          <code>useId()</code> gives every component instance its own <strong>unique, stable</strong> id that is also
          the same on the server and in the browser.
        </p>
      }
      keyPoints={[
        'const id = useId() returns a unique string for this component instance.',
        'It stays the same across re-renders, and matches between server and client rendering.',
        'Call it once and add suffixes for related elements: `${id}-hint`, `${id}-error`.',
        'Use it for label/input pairs, aria-describedby, aria-labelledby, radio group names.',
        'Do NOT use it for list keys - keys must come from your data.',
      ]}
      syntax={`function EmailField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Email</label>
      <input id={id} aria-describedby={\`\${id}-hint\`} />
      <p id={\`\${id}-hint\`}>We never share it.</p>
    </>
  );
}`}
    >
      <Example
        title="1. Connect a label to its input"
        description="Click the label text: the input gets focus / the checkbox toggles. On the right is the HTML React produced."
        code={labelInputSource}
        fileName="examples/LabelInputExample.jsx"
      >
        <LabelInputExample />
      </Example>

      <Example
        title="2. A reusable FormField rendered many times"
        description="Each <FormField> calls useId() itself. Submit the empty form to see errors wired with aria-describedby and aria-invalid."
        code={reusableSource}
        fileName="components/FormField.jsx + examples/ReusableFieldExample.jsx"
      >
        <ReusableFieldExample />
      </Example>

      <Example
        title="3. One id prefix for a group of elements"
        description="The same address component twice on one page. A single useId() per copy builds all its ids, the heading link and the radio group name."
        code={relatedIdsSource}
        fileName="examples/RelatedIdsExample.jsx"
      >
        <RelatedIdsExample />
      </Example>

      <Example
        title="4. Why not Math.random() or a counter?"
        description="Type or click Re-render. The random id changes on every render (flashes yellow); useId never does."
        code={whyNotRandomSource}
        fileName="examples/WhyNotRandomExample.jsx"
      >
        <WhyNotRandomExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Hard-coding ids (<code>id="email"</code>) inside a reusable component - two copies on the page break the
            label links.
          </li>
          <li>
            Generating ids with <code>Math.random()</code> or <code>Date.now()</code> during render - they change
            every render and cause hydration mismatches with server rendering.
          </li>
          <li>
            Using <code>useId()</code> as a <code>key</code> in a list. Keys must be derived from your data (e.g.{' '}
            <code>item.id</code>).
          </li>
          <li>
            Using the id in a CSS selector (<code>#«r1»</code>) - the format contains special characters and can
            change between React versions.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Any time an element must reference another by id: form fields and labels, hints and errors, tabs and panels
        (<code>aria-controls</code>), dialogs and their titles (<code>aria-labelledby</code>), radio groups. The shared{' '}
        <code>Input</code> component in <code>src/components/ui/Input.jsx</code> uses exactly this technique.
      </Callout>
    </ConceptPage>
  );
}
