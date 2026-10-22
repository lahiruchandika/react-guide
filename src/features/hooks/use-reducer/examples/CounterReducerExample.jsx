/**
 * CounterReducerExample.jsx
 * ----------------------------------------------------------------------------
 * The smallest possible useReducer example.
 *
 *   const [state, dispatch] = useReducer(reducer, initialState);
 *
 *   - state     the current value (like the first item from useState)
 *   - dispatch  a function you call with an ACTION object: dispatch({ type: 'increment' })
 *   - reducer   a function (state, action) => nextState that decides what changes
 *
 * Instead of saying HOW to change state in the event handler (setCount(c + step)),
 * components only say WHAT happened (dispatch({ type: 'increment' })).
 * The reducer contains all the "how".
 *
 * The action history is part of the state too, so you can watch every
 * action flow through the reducer.
 * ----------------------------------------------------------------------------
 */
import { useReducer } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';

// 1. Initial state: an object, because we track several related values.
const initialState = { count: 0, step: 1, history: [], seq: 0 };

// 2. The reducer: a PURE function, defined outside the component.
function counterReducer(state, action) {
  // Remember the action for the history panel (newest first, max 6).
  // `seq` is a running number used as a stable React key for each entry.
  const seq = state.seq + 1;
  const history = [{ id: seq, action }, ...state.history].slice(0, 6);

  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step, history, seq };
    case 'decrement':
      return { ...state, count: state.count - state.step, history, seq };
    case 'setStep':
      return { ...state, step: action.payload, history, seq };
    case 'reset':
      return { ...initialState, step: state.step, history, seq };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function CounterReducerExample() {
  // 3. Connect the reducer to the component.
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div className="grid-2">
      <div className="rd-counter">
        <span className="big-number">{state.count}</span>

        {/* 4. Event handlers only DISPATCH actions - no logic here */}
        <div className="row" style={{ justifyContent: 'center' }}>
          <Button variant="secondary" icon={<Minus size={16} />} onClick={() => dispatch({ type: 'decrement' })}>
            {state.step}
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => dispatch({ type: 'increment' })}>
            {state.step}
          </Button>
          <Button variant="ghost" icon={<RotateCcw size={16} />} onClick={() => dispatch({ type: 'reset' })}>
            Reset
          </Button>
        </div>

        {/* An action can carry extra data in its `payload` */}
        <div className="row small" style={{ justifyContent: 'center' }}>
          <span className="muted">Step:</span>
          {[1, 5, 10].map((step) => (
            <button
              key={step}
              type="button"
              className={`rd-chip ${state.step === step ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'setStep', payload: step })}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {/* Visualise what was dispatched */}
      <div className="rd-log">
        <span className="box-label">dispatched actions</span>
        {state.history.length === 0 && <span className="small">Click a button to dispatch an action.</span>}
        {state.history.map((entry) => (
          <code key={entry.id} className="rd-log-line">
            {JSON.stringify(entry.action)}
          </code>
        ))}
      </div>
    </div>
  );
}
