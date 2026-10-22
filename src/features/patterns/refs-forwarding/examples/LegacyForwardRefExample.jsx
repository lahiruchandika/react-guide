/**
 * LegacyForwardRefExample - React 19 "ref as prop" vs the legacy forwardRef.
 * ----------------------------------------------------------------------------
 * Both inputs below behave the same for the parent: pass a ref, call focus().
 * Only the CHILD's code differs:
 *
 *   React 19 (TextInput.jsx):          function TextInput({ ref, ...props }) { }
 *   Legacy   (LegacyInput.jsx):        forwardRef(function (props, ref) { })
 *
 * When upgrading old code you can remove forwardRef and read `ref` from props.
 * ----------------------------------------------------------------------------
 */
import { useRef } from 'react';
import { Crosshair } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import TextInput from '../components/TextInput';
import LegacyInput from '../components/LegacyInput';

export default function LegacyForwardRefExample() {
  const modernRef = useRef(null);
  const legacyRef = useRef(null);

  return (
    <div className="grid-2">
      <div className="rf-compare rf-compare-new">
        <Badge tone="success">React 19 - ref is a prop</Badge>
        <TextInput ref={modernRef} label="Email" placeholder="you@example.com" />
        <Button size="sm" icon={<Crosshair />} onClick={() => modernRef.current.focus()}>Focus modern input</Button>
        <code className="rf-snippet">function TextInput({'{ ref, ...props }'})</code>
      </div>

      <div className="rf-compare rf-compare-old">
        <Badge tone="warning">Legacy - forwardRef wrapper</Badge>
        <LegacyInput ref={legacyRef} label="Email" placeholder="you@example.com" />
        <Button size="sm" variant="secondary" icon={<Crosshair />} onClick={() => legacyRef.current.focus()}>
          Focus legacy input
        </Button>
        <code className="rf-snippet">forwardRef((props, ref) =&gt; ...)</code>
      </div>
    </div>
  );
}
