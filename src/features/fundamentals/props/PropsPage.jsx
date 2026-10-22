/**
 * PropsPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: Props & Children
 *
 *   props/
 *   ├── PropsPage.jsx          <- this page
 *   ├── PropsPage.css          <- lesson styles ("pr-" prefix)
 *   ├── examples/              <- one file per live demo
 *   └── components/            <- ProductCard and Panel, reused by the demos
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './PropsPage.css';

import BasicPropsExample from './examples/BasicPropsExample';
import DefaultPropsExample from './examples/DefaultPropsExample';
import FunctionPropsExample from './examples/FunctionPropsExample';
import ChildrenExample from './examples/ChildrenExample';
import SpreadReadOnlyExample from './examples/SpreadReadOnlyExample';

import basicSource from './examples/BasicPropsExample.jsx?raw';
import productCardSource from './components/ProductCard.jsx?raw';
import defaultSource from './examples/DefaultPropsExample.jsx?raw';
import functionSource from './examples/FunctionPropsExample.jsx?raw';
import childrenSource from './examples/ChildrenExample.jsx?raw';
import panelSource from './components/Panel.jsx?raw';
import spreadSource from './examples/SpreadReadOnlyExample.jsx?raw';

// Show the example AND the child component it uses in one Code tab.
const withFiles = (...files) =>
  files.map(([file, src]) => `// ======================= ${file} =======================\n${src.trim()}`).join('\n\n');

export default function PropsPage() {
  return (
    <ConceptPage
      topicId="props"
      intro={
        <>
          <p>
            <strong>Props</strong> (short for “properties”) are how a parent component passes data to a child -
            exactly like arguments to a function. React collects every attribute you write on a component
            into one object and hands it to the function as its first parameter.
          </p>
          <p>
            Data flows <strong>one way</strong>: from parent to child. A child can never change its props; if
            something must change, the parent owns it as state and passes a function down so the child can
            ask for the change.
          </p>
        </>
      }
      keyPoints={[
        'Props are passed like HTML attributes: <Card title="Hi" count={3} />.',
        'Any JS value can be a prop: string, number, boolean, array, object, function, even JSX.',
        'Destructure in the parameters and set defaults: function Card({ title = "Untitled" }).',
        'children = whatever you put between the opening and closing tag.',
        'Pass functions (onAdd, onChange) so a child can send data back up.',
        'Props are read-only - never modify them inside the child.',
      ]}
      syntax={`// Parent
<ProductCard
  name="Headphones"          // string
  price={59.99}              // number
  inStock                    // boolean true
  onAdd={handleAdd}          // function
>
  <p>Extra content</p>       {/* children */}
</ProductCard>

// Child
function ProductCard({
  name, price, inStock = false, onAdd, children,
}) {
  return (
    <div onClick={() => onAdd(name)}>
      {name} {children}
    </div>
  );
}`}
    >
      <Example
        title="1. Passing different types of props"
        description="Strings, numbers, booleans, arrays and objects. Edit the parent's controls and watch the child re-render with new props."
        code={withFiles(['examples/BasicPropsExample.jsx', basicSource], ['components/ProductCard.jsx', productCardSource])}
        fileName="examples/BasicPropsExample.jsx + components/ProductCard.jsx"
      >
        <BasicPropsExample />
      </Example>

      <Example
        title="2. Destructuring & default values"
        description="One UserBadge component, five ways to use it. Missing props fall back to their defaults."
        code={defaultSource}
        fileName="examples/DefaultPropsExample.jsx"
      >
        <DefaultPropsExample />
      </Example>

      <Example
        title="3. Functions as props (child → parent)"
        description="A café menu: each MenuItem calls onAdd / onRemove, and the parent updates the cart."
        code={functionSource}
        fileName="examples/FunctionPropsExample.jsx"
      >
        <FunctionPropsExample />
      </Example>

      <Example
        title="4. The children prop & composition"
        description="One Panel wrapper, three different contents. Panel draws the frame; the parent decides what goes inside."
        code={withFiles(['examples/ChildrenExample.jsx', childrenSource], ['components/Panel.jsx', panelSource])}
        fileName="examples/ChildrenExample.jsx + components/Panel.jsx"
      >
        <ChildrenExample />
      </Example>

      <Example
        title="5. Spreading props & props are read-only"
        description="Forward many props at once with {...obj}, collect the rest with ...rest, and see why a child must not mutate its props."
        code={spreadSource}
        fileName="examples/SpreadReadOnlyExample.jsx"
      >
        <SpreadReadOnlyExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Calling instead of passing a function: <code>{'onAdd={handleAdd()}'}</code> runs it immediately on
            every render. Write <code>{'onAdd={handleAdd}'}</code> or <code>{'onAdd={() => handleAdd(id)}'}</code>.
          </li>
          <li>
            Writing numbers as strings: <code>{'count="3"'}</code> passes the string <code>"3"</code>. Use{' '}
            <code>{'count={3}'}</code>.
          </li>
          <li>Changing props inside the child (<code>props.x = 1</code>). Lift the state to the parent instead.</li>
          <li>
            Expecting <code>key</code> (or <code>ref</code> in older React) to show up in props - <code>key</code>{' '}
            is used by React itself. Note: in React 19, <code>ref</code> IS passed as a normal prop, so{' '}
            <code>forwardRef</code> is no longer needed.
          </li>
          <li>Spreading huge objects everywhere - it hides which props a component really uses.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use what">
        Use plain props for data, <code>on…</code> function props for events, <code>children</code> for
        wrappers/layouts (cards, modals, panels), and spread/rest props when building small wrappers around
        native elements like <code>{'<input>'}</code> or <code>{'<button>'}</code>. If you pass the same prop
        through many levels, look at the <strong>useContext</strong> lesson.
      </Callout>
    </ConceptPage>
  );
}
