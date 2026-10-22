/**
 * RelatedIdsExample
 * ----------------------------------------------------------------------------
 * One useId() call can serve a whole GROUP of related elements: just add a
 * suffix ("-street", "-city", "-heading"...).
 *
 * <AddressFields> is rendered TWICE (shipping + billing). Without useId we'd
 * have two inputs with id="street" on the page - invalid HTML, and clicking
 * the second label would focus the FIRST input. With useId each copy gets its
 * own prefix.
 *
 * It also shows:
 *   - aria-labelledby: the <section> is named by its heading
 *   - radio buttons share name={id} so each group is independent
 * ----------------------------------------------------------------------------
 */
import { useId, useState } from 'react';
import { Badge } from '@/components/ui';

const SPEEDS = ['Standard', 'Express', 'Next day'];

function AddressFields({ title }) {
  const id = useId(); // ONE base id for this whole block
  const [speed, setSpeed] = useState(SPEEDS[0]);

  return (
    // aria-labelledby points to the heading's id -> screen readers announce "Shipping address, region"
    <section className="box stack" aria-labelledby={`${id}-heading`}>
      <div className="row uid-section-head">
        <h4 id={`${id}-heading`} className="uid-heading">
          {title}
        </h4>
        <code className="uid-id-tag">prefix: {id}</code>
      </div>

      <div className="field">
        <label htmlFor={`${id}-street`} className="field-label">Street</label>
        <input id={`${id}-street`} className="field-input" placeholder="221B Baker Street" />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor={`${id}-city`} className="field-label">City</label>
          <input id={`${id}-city`} className="field-input" placeholder="London" />
        </div>
        <div className="field">
          <label htmlFor={`${id}-zip`} className="field-label">Postcode</label>
          <input id={`${id}-zip`} className="field-input" placeholder="NW1 6XE" />
        </div>
      </div>

      {/* A radio group: all radios in ONE group must share the same name.
          Using the id as name keeps the two copies of this component separate. */}
      <fieldset className="uid-fieldset">
        <legend className="field-label">Delivery speed</legend>
        <div className="row">
          {SPEEDS.map((option) => (
            <label key={option} className="uid-radio">
              <input
                type="radio"
                name={`${id}-speed`}
                value={option}
                checked={speed === option}
                onChange={() => setSpeed(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
      <span className="small muted">
        Selected: <Badge tone="primary">{speed}</Badge>
      </span>
    </section>
  );
}

export default function RelatedIdsExample() {
  return (
    <div className="grid-2">
      {/* Same component twice: no id collisions */}
      <AddressFields title="Shipping address" />
      <AddressFields title="Billing address" />
    </div>
  );
}
