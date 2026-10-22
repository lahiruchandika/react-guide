/**
 * SmartInput - exposes a SMALL, CUSTOM API to its parent with useImperativeHandle.
 * ----------------------------------------------------------------------------
 * Instead of giving the parent the whole <input> DOM node (which would let it
 * change anything: styles, value, attributes...), we decide exactly which
 * methods the parent is allowed to call:
 *
 *     ref.current.focus()
 *     ref.current.clear()
 *     ref.current.shake()      <- something a plain <input> can't do!
 *     ref.current.getValue()
 *
 * useImperativeHandle(ref, createHandle, deps)
 *   - ref:          the ref received from the parent (a normal prop in React 19)
 *   - createHandle: returns the object that becomes parentRef.current
 * ----------------------------------------------------------------------------
 */
import { useImperativeHandle, useRef, useState } from 'react';

export default function SmartInput({ ref, label, ...rest }) {
  // A PRIVATE ref to the real input - the parent never sees this one
  const inputRef = useRef(null);

  const [value, setValue] = useState('');
  const [shaking, setShaking] = useState(false);

  // Whatever we return here becomes `ref.current` in the parent
  useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current.focus();
      },
      clear() {
        setValue(''); // the component owns its value, so it resets itself
        inputRef.current.focus();
      },
      shake() {
        setShaking(true); // CSS animation; removed again in onAnimationEnd
      },
      getValue() {
        return value;
      },
    }),
    [value], // re-create the handle when `value` changes so getValue() is fresh
  );

  return (
    <label className="rf-field">
      {label && <span className="rf-field-label">{label}</span>}
      <span
        className={`rf-input-wrap ${shaking ? 'rf-shake' : ''}`}
        onAnimationEnd={() => setShaking(false)} // ready to shake again next time
      >
        <input
          ref={inputRef}
          className="rf-input"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          {...rest}
        />
      </span>
    </label>
  );
}
