/**
 * EventBubblingExample - portals keep their place in the REACT tree.
 * ----------------------------------------------------------------------------
 * Two surprising facts about portals:
 *
 *  1. The target can be ANY DOM node, not only document.body. Here we portal
 *     into the "Target area" box on the right. We get that node with a
 *     callback ref stored in state: <div ref={setTarget} />.
 *
 *  2. Events bubble through the REACT tree, not the DOM tree. The button is
 *     physically inside the right box, but its React parent is the left box,
 *     so clicking it triggers the LEFT box's onClick handler.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui';

export default function EventBubblingExample() {
  // The DOM node to portal into. A callback ref (setTarget) fills it after mount.
  const [target, setTarget] = useState(null);
  const [parentClicks, setParentClicks] = useState(0);
  const [lastSource, setLastSource] = useState('-');

  // This handler belongs to the LEFT box
  const handleParentClick = (e) => {
    setParentClicks((c) => c + 1);
    setLastSource(e.target.closest('button')?.dataset.source ?? 'box itself');
  };

  return (
    <div className="grid-2">
      {/* React parent: catches clicks bubbling up from ALL its React children */}
      <div className="box pt-zone" onClick={handleParentClick}>
        <span className="box-label">{'<ParentBox onClick>'} - React parent</span>
        <div className="big-number">{parentClicks}</div>
        <span className="muted small">clicks received · last from: <strong>{lastSource}</strong></span>

        <Button size="sm" variant="secondary" data-source="normal child" icon={<MousePointerClick />}>
          Normal child button
        </Button>

        {/* Rendered HERE in JSX... but placed into the right box in the DOM */}
        {target &&
          createPortal(
            <Button size="sm" data-source="portal child" icon={<MousePointerClick />}>
              Portal child button
            </Button>,
            target,
          )}
      </div>

      {/* DOM target: has NO onClick handler at all */}
      <div className="box pt-zone pt-target">
        <span className="box-label">{'<div ref={setTarget}>'} - portal target</span>
        <p className="muted small">The button below is a DOM child of this box, yet clicking it updates the counter on the left.</p>
        <div ref={setTarget} />
      </div>
    </div>
  );
}
