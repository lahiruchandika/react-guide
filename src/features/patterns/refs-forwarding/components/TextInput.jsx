/**
 * TextInput - a styled, reusable input that ACCEPTS A REF FROM ITS PARENT.
 * ----------------------------------------------------------------------------
 * React 19: `ref` is now a normal prop for function components.
 * We simply read it from props and put it on the real <input> element.
 *
 *   const inputRef = useRef(null);
 *   <TextInput ref={inputRef} label="Search" />
 *   inputRef.current.focus();   // parent controls the inner <input>
 *
 * Before React 19 you had to wrap the component in forwardRef() to do this
 * (see LegacyInput.jsx in this folder).
 * ----------------------------------------------------------------------------
 */
export default function TextInput({ ref, label, icon: Icon, hint, ...rest }) {
  return (
    <label className="rf-field">
      {label && <span className="rf-field-label">{label}</span>}

      <span className="rf-input-wrap">
        {/* `icon` is a component (e.g. Search from lucide-react) - renamed to Icon so JSX treats it as a component */}
        {Icon && <Icon size={16} className="rf-input-icon" />}

        {/* The parent's ref ends up HERE, on the real DOM node */}
        <input ref={ref} className="rf-input" {...rest} />
      </span>

      {hint && <span className="rf-field-hint">{hint}</span>}
    </label>
  );
}
