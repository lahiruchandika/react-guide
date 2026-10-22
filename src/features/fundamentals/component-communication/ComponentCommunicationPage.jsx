/**
 * ComponentCommunicationPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: how components talk to each other.
 *
 *   parent -> child     props
 *   child  -> parent    callback props (functions passed down)
 *   sibling <-> sibling lift the state up to the common parent
 *   far away            Context (instead of prop drilling)
 *
 * Folder layout of this lesson (see how the files import each other):
 *   examples/                         the "parent" side of every demo
 *   components/UserCard.jsx           child that only reads props
 *   components/StarRating.jsx         child that calls a callback prop
 *   components/ProductPicker.jsx      sibling #1
 *   components/CartSummary.jsx        sibling #2
 *   components/prop-drilling/*        the drilling problem and the Context fix
 * ----------------------------------------------------------------------------
 */
import { Link } from 'react-router-dom';
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import ParentToChildExample from './examples/ParentToChildExample';
import parentToChildSource from './examples/ParentToChildExample.jsx?raw';
import userCardSource from './components/UserCard.jsx?raw';

import ChildToParentExample from './examples/ChildToParentExample';
import childToParentSource from './examples/ChildToParentExample.jsx?raw';
import starRatingSource from './components/StarRating.jsx?raw';

import SiblingsExample from './examples/SiblingsExample';
import siblingsSource from './examples/SiblingsExample.jsx?raw';
import productPickerSource from './components/ProductPicker.jsx?raw';
import cartSummarySource from './components/CartSummary.jsx?raw';

import PropDrillingExample from './examples/PropDrillingExample';
import propDrillingSource from './examples/PropDrillingExample.jsx?raw';
import drilledTreeSource from './components/prop-drilling/DrilledTree.jsx?raw';
import contextTreeSource from './components/prop-drilling/ContextTree.jsx?raw';
import userContextSource from './components/prop-drilling/UserContext.js?raw';
import levelBoxSource from './components/prop-drilling/LevelBox.jsx?raw';

import './ComponentCommunicationPage.css';

/** Join several source files into one string for the "Code" tab. */
const withFiles = (...files) =>
  files.map(([name, src]) => `// ${'='.repeat(70)}\n// FILE: ${name}\n// ${'='.repeat(70)}\n${src}`).join('\n\n');

export default function ComponentCommunicationPage() {
  return (
    <ConceptPage
      topicId="component-communication"
      intro={
        <p>
          In React, <strong>data flows down</strong> and <strong>events flow up</strong>. A parent gives data to a child
          through props; a child asks the parent to change something by calling a function the parent passed down. When
          two siblings need the same data, you move that state to their closest common parent. Each demo below is split
          into several files - open the <em>Code</em> tab to see how they import and talk to each other.
        </p>
      }
      keyPoints={[
        'Parent → child: pass data as props. Props are read-only.',
        'Child → parent: pass a function down (onSomething) and let the child call it.',
        'Siblings: lift the shared state up to the closest common parent.',
        'Keep a single source of truth - never copy the same data into two states.',
        'Passing props through many levels that don’t use them = prop drilling.',
        'Fix deep prop drilling with Context (useContext) or component composition.',
      ]}
      syntax={`// Parent
function Parent() {
  const [rating, setRating] = useState(0);
  return (
    <StarRating
      value={rating}        // data DOWN
      onChange={setRating}  // event UP
    />
  );
}

// Child
function StarRating({ value, onChange }) {
  return (
    <button onClick={() => onChange(5)}>{value} ★</button>
  );
}`}
    >
      <div className="cc-flow">
        <div className="cc-flow-node">Parent</div>
        <div className="cc-flow-arrows">
          <span className="cc-flow-down">props (data) ↓</span>
          <span className="cc-flow-up">↑ callbacks (events)</span>
        </div>
        <div className="cc-flow-node">Child</div>
      </div>

      <Example
        title="1. Parent → child with props"
        description="The parent owns the state. Change the user, accent or compact mode and the child re-renders with the new props."
        code={withFiles(['examples/ParentToChildExample.jsx', parentToChildSource], ['components/UserCard.jsx', userCardSource])}
        fileName="ParentToChildExample.jsx + UserCard.jsx"
      >
        <ParentToChildExample />
      </Example>

      <Example
        title="2. Child → parent with callback props"
        description="Click a star. The child calls onChange(stars), the parent updates its state and the log records each call."
        code={withFiles(['examples/ChildToParentExample.jsx', childToParentSource], ['components/StarRating.jsx', starRatingSource])}
        fileName="ChildToParentExample.jsx + StarRating.jsx"
      >
        <ChildToParentExample />
      </Example>

      <Example
        title="3. Siblings: lifting state up"
        description="Add products on the left; the cart on the right updates. The siblings never talk directly - they share the parent's cart state."
        code={withFiles(
          ['examples/SiblingsExample.jsx', siblingsSource],
          ['components/ProductPicker.jsx', productPickerSource],
          ['components/CartSummary.jsx', cartSummarySource],
        )}
        fileName="SiblingsExample.jsx + ProductPicker.jsx + CartSummary.jsx"
      >
        <SiblingsExample />
      </Example>

      <Example
        title="4. Prop drilling - and the Context fix"
        description="Only <UserMenu> needs the user, yet in drilling mode it is passed through every level. Switch to Context to see the cleaner tree."
        code={withFiles(
          ['examples/PropDrillingExample.jsx', propDrillingSource],
          ['components/prop-drilling/DrilledTree.jsx', drilledTreeSource],
          ['components/prop-drilling/UserContext.js', userContextSource],
          ['components/prop-drilling/ContextTree.jsx', contextTreeSource],
          ['components/prop-drilling/LevelBox.jsx', levelBoxSource],
        )}
        fileName="PropDrillingExample.jsx + prop-drilling/*"
      >
        <PropDrillingExample />
      </Example>

      <Callout type="info" title="Learn more about Context">
        Context is covered in depth in the <Link to="/hooks/use-context">useContext lesson</Link>. Don&apos;t reach for it
        too early: passing props 1-2 levels down is perfectly normal and makes data flow easy to follow.
      </Callout>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Changing props inside the child (<code>props.user.name = &apos;x&apos;</code>). Props are read-only - ask the
            parent to change its state instead.
          </li>
          <li>
            Calling the callback while rendering: <code>{'onClick={onAdd(product)}'}</code> runs immediately. Pass a function:{' '}
            <code>{'onClick={() => onAdd(product)}'}</code>.
          </li>
          <li>Copying a prop into the child&apos;s own state - it won&apos;t update when the parent changes it.</li>
          <li>Keeping the same data in two siblings&apos; states - they get out of sync. Lift it up instead.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="Which technique when?">
        <ul>
          <li>
            <strong>Props</strong> - the default for everything parent → child.
          </li>
          <li>
            <strong>Callback props</strong> - a child reports a click, a selection, a form submit.
          </li>
          <li>
            <strong>Lifting state up</strong> - two or more components must show/edit the same data.
          </li>
          <li>
            <strong>Context</strong> - &quot;global-ish&quot; data needed by many components at different depths (theme,
            logged-in user, language, cart).
          </li>
        </ul>
      </Callout>
    </ConceptPage>
  );
}
