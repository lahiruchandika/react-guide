/**
 * UseStatePage - lesson: the useState hook
 * ----------------------------------------------------------------------------
 * Each live demo lives in its own file inside ./examples/.
 * The `?raw` imports load the SAME files as plain text, so the "Code" tab
 * always shows exactly the code that is running in the "Demo" tab.
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import CounterExample from './examples/CounterExample';
import counterSource from './examples/CounterExample.jsx?raw';
import StringsBooleansExample from './examples/StringsBooleansExample';
import stringsBooleansSource from './examples/StringsBooleansExample.jsx?raw';
import ObjectStateExample from './examples/ObjectStateExample';
import objectStateSource from './examples/ObjectStateExample.jsx?raw';
import ArrayStateExample from './examples/ArrayStateExample';
import arrayStateSource from './examples/ArrayStateExample.jsx?raw';
import todoItemSource from './components/TodoItem.jsx?raw';
import UpdaterFunctionExample from './examples/UpdaterFunctionExample';
import updaterSource from './examples/UpdaterFunctionExample.jsx?raw';
import LazyInitialStateExample from './examples/LazyInitialStateExample';
import lazySource from './examples/LazyInitialStateExample.jsx?raw';

export default function UseStatePage() {
  return (
    <ConceptPage
      topicId="use-state"
      intro={
        <p>
          A normal variable inside a component is reset every time the component renders, and changing it
          does not update the screen. <code>useState</code> gives a component <strong>memory</strong>: React
          keeps the value between renders, and calling the setter tells React to <strong>re-render</strong>{' '}
          the component with the new value.
        </p>
      }
      keyPoints={[
        'useState(initial) returns a pair: [currentValue, setValue].',
        'Calling setValue schedules a re-render - the variable does not change immediately.',
        'Never mutate objects/arrays in state. Create a new copy with ... spread, map or filter.',
        'When the next value depends on the previous one, use an updater: setX(prev => prev + 1).',
        'Pass a function for expensive initial values: useState(() => compute()).',
        'Call hooks only at the top level of a component - never inside if, loops or nested functions.',
      ]}
      syntax={`import { useState } from 'react';

const [count, setCount] = useState(0);       // number
const [name, setName]   = useState('');      // string
const [user, setUser]   = useState({ name: 'Ann' });

setCount(5);                        // set a new value
setCount(prev => prev + 1);         // update from the previous value
setUser(prev => ({ ...prev, name: 'Bob' })); // copy + override`}
    >
      <Example
        title="1. Counter - your first state"
        description="A number in state, two buttons that update it, and a second independent state for the step size."
        code={counterSource}
        fileName="examples/CounterExample.jsx"
      >
        <CounterExample />
      </Example>

      <Example
        title="2. Strings & booleans - a controlled form"
        description="Text inputs are bound to string state; toggles are bound to boolean state. The preview simply reads the state."
        code={stringsBooleansSource}
        fileName="examples/StringsBooleansExample.jsx"
      >
        <StringsBooleansExample />
      </Example>

      <Example
        title="3. Objects - update with the spread operator"
        description="Edit a profile object (including a nested address). Watch the JSON update - each change creates a new object."
        code={objectStateSource}
        fileName="examples/ObjectStateExample.jsx"
      >
        <ObjectStateExample />
      </Example>

      <Example
        title="4. Arrays - a todo list (add, remove, update immutably)"
        description="The parent owns the array; each row is a TodoItem child component that receives data and callbacks as props."
        code={`${arrayStateSource}\n\n// ===================== components/TodoItem.jsx =====================\n\n${todoItemSource}`}
        fileName="examples/ArrayStateExample.jsx + components/TodoItem.jsx"
      >
        <ArrayStateExample />
      </Example>

      <Example
        title="5. Updater function vs stale value (the +3 bug)"
        description="Both buttons call the setter three times. Only the updater-function version actually adds 3."
        code={updaterSource}
        fileName="examples/UpdaterFunctionExample.jsx"
      >
        <UpdaterFunctionExample />
      </Example>

      <Example
        title="6. Lazy initial state"
        description="Type in both boxes. The left one re-runs its 'expensive' initializer on every keystroke; the right one ran it only once."
        code={lazySource}
        fileName="examples/LazyInitialStateExample.jsx"
      >
        <LazyInitialStateExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <strong>Mutating state:</strong> <code>todos.push(x); setTodos(todos)</code> passes the same array, so
            React may not re-render. Use <code>setTodos([...todos, x])</code>.
          </li>
          <li>
            <strong>Expecting the value to change right away:</strong> after <code>setCount(1)</code>, the{' '}
            <code>count</code> variable still holds the old value until the next render.
          </li>
          <li>
            <strong>Storing derived data:</strong> don&apos;t keep <code>remaining</code> in its own state if you can
            compute it from <code>todos</code> - two states can get out of sync.
          </li>
          <li>
            <strong>Using the array index as key</strong> for lists that can be reordered or deleted from.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use useState">
        Use it for any value that, when it changes, should update what the user sees: form inputs, toggles,
        selected tabs, lists of items, loading flags. If the value should <em>not</em> trigger a re-render (a timer
        id, a DOM node), use <code>useRef</code> instead. If many related values change together through
        complex rules, consider <code>useReducer</code>.
      </Callout>
    </ConceptPage>
  );
}
