/**
 * LegacyInput - the OLD way (React 16.3 - 18): forwardRef.
 * ----------------------------------------------------------------------------
 * Before React 19, function components could NOT receive `ref` as a prop -
 * React removed it from props. You had to wrap the component in forwardRef(),
 * which passes the ref as a SECOND argument:
 *
 *     const LegacyInput = forwardRef(function LegacyInput(props, ref) { ... });
 *
 * forwardRef still works in React 19 (so old code keeps running), but it is no
 * longer needed and will be deprecated in a future version. You will see it a
 * lot in existing codebases and libraries, so it's good to recognise it.
 * ----------------------------------------------------------------------------
 */
import { forwardRef } from 'react';

const LegacyInput = forwardRef(function LegacyInput({ label, ...rest }, ref) {
  //                                                  props ^      ^ ref (2nd argument)
  return (
    <label className="rf-field">
      <span className="rf-field-label">{label}</span>
      <span className="rf-input-wrap">
        <input ref={ref} className="rf-input" {...rest} />
      </span>
    </label>
  );
});

export default LegacyInput;
