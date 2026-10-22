/**
 * UseReducerPage.jsx  -  route: /hooks/use-reducer
 * ----------------------------------------------------------------------------
 * Lesson page for useReducer.
 *
 *   use-reducer/
 *     UseReducerPage.jsx / .css
 *     reducers/cartReducer.js   reducer + action types + action creators + selectors
 *     context/CartContext.jsx   useReducer + Context provider (example 4)
 *     data/catalog.js           static product data
 *     components/               ProductCard, CartLine, CartSummary
 *     examples/                 one file per live demo
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout, CodeBlock } from '@/components/ui';

import CounterReducerExample from './examples/CounterReducerExample';
import counterSource from './examples/CounterReducerExample.jsx?raw';
import ShoppingCartExample from './examples/ShoppingCartExample';
import cartExampleSource from './examples/ShoppingCartExample.jsx?raw';
import cartReducerSource from './reducers/cartReducer.js?raw';
import StateVsReducerExample from './examples/StateVsReducerExample';
import stateVsReducerSource from './examples/StateVsReducerExample.jsx?raw';
import ReducerContextExample from './examples/ReducerContextExample';
import reducerContextSource from './examples/ReducerContextExample.jsx?raw';
import cartContextSource from './context/CartContext.jsx?raw';

import './UseReducerPage.css';

export default function UseReducerPage() {
  return (
    <ConceptPage
      topicId="use-reducer"
      intro={
        <>
          <p>
            <code>useReducer</code> is an alternative to <code>useState</code> for state that has{' '}
            <b>several related values</b> or <b>many ways to change</b>. Instead of calling setters with new values,
            components <b>dispatch actions</b> that describe <i>what happened</i> (<code>{"{ type: 'cart/addItem' }"}</code>
            ), and a single <b>reducer function</b> decides <i>how</i> the state changes.
          </p>
          <p>
            All update logic lives in one pure function, often in its own file, which makes it easy to read, reuse
            and test.
          </p>
        </>
      }
      keyPoints={[
        'const [state, dispatch] = useReducer(reducer, initialState)',
        'A reducer is a pure function: (state, action) => newState. Never mutate state; return a new object.',
        'An action is a plain object with a type and optional payload: { type: "add", payload: item }.',
        'dispatch has a stable identity, so it is safe to pass down or use in effects without useCallback.',
        'Combine with Context to share state + dispatch across the whole component tree.',
      ]}
      syntax={`import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    default: throw new Error('Unknown action: ' + action.type);
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });`}
    >
      <Example
        title="1. Counter with a reducer"
        description="Buttons dispatch actions; the reducer computes the next state. The panel shows every action that was dispatched."
        code={counterSource}
        fileName="examples/CounterReducerExample.jsx"
      >
        <CounterReducerExample />
      </Example>

      <Example
        title="2. Shopping cart (reducer in its own file)"
        description="Add products, change quantities, apply a coupon (SAVE10 or REACT20) and clear the cart. All logic lives in reducers/cartReducer.js."
        code={cartExampleSource}
        fileName="examples/ShoppingCartExample.jsx"
      >
        <ShoppingCartExample />
      </Example>

      <h3>The cart reducer file</h3>
      <p className="muted">
        Action type constants, the reducer, action creators and selectors - everything about the cart's state in
        one plain JavaScript file with no React import. This is how most production codebases organise reducers.
      </p>
      <CodeBlock code={cartReducerSource} language="js" fileName="reducers/cartReducer.js" />

      <Example
        title="3. useState vs useReducer"
        description="The same 'load profile' feature built both ways. Load successfully, then load with a failure, and compare the two cards."
        code={stateVsReducerSource}
        fileName="examples/StateVsReducerExample.jsx"
      >
        <StateVsReducerExample />
      </Example>

      <Example
        title="4. Preview: useReducer + Context"
        description="A provider owns the reducer; deeply nested components read the cart and dispatch actions with a custom useCart() hook."
        code={`${reducerContextSource.trim()}\n\n\n// ===================== context/CartContext.jsx =====================\n\n${cartContextSource.trim()}`}
        fileName="examples/ReducerContextExample.jsx + context/CartContext.jsx"
      >
        <ReducerContextExample />
      </Example>

      <Callout type="info" title="useState or useReducer?">
        <ul>
          <li>
            <b>useState</b> - one or two independent values (a toggle, an input, a counter).
          </li>
          <li>
            <b>useReducer</b> - an object with several fields that change together, the next state depends on the
            previous one in many ways, or you want the update logic in a separate, testable file.
          </li>
        </ul>
        Both are fine; you can start with useState and refactor to useReducer when handlers get messy.
      </Callout>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            <b>Mutating state</b> - <code>state.items.push(item); return state;</code> returns the same object, so
            React sees no change and does not re-render. Return a new object: <code>{'{ ...state, items: [...state.items, item] }'}</code>.
          </li>
          <li>
            <b>Side effects in the reducer</b> - no fetch, timers, <code>Math.random()</code> or{' '}
            <code>localStorage</code> inside it. In StrictMode React calls reducers twice to help you spot this.
            Do side effects in event handlers or <code>useEffect</code>, then dispatch the result.
          </li>
          <li>
            <b>Forgetting to return</b> - every <code>case</code> must return a state; a missing return makes the
            state <code>undefined</code>.
          </li>
          <li>
            <b>Reading state right after dispatch</b> - <code>dispatch(...)</code> schedules an update; the
            <code>state</code> variable keeps its old value until the next render.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="Pro tips">
        Use action type constants (or action creator functions) to avoid typos, keep derived values like totals out
        of state (calculate them with selectors), and pass a third argument for lazy initialisation:{' '}
        <code>useReducer(cartReducer, initialCartState, loadSavedCart)</code> - the <code>loadSavedCart</code> function runs only once, which is handy for reading state from localStorage.
      </Callout>
    </ConceptPage>
  );
}
