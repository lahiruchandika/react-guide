/**
 * TooltipExample
 * ----------------------------------------------------------------------------
 * The classic useLayoutEffect use case: positioning something based on the
 * size of an element that has just been rendered.
 *
 * Hover (or Tab to) each button. The <Tooltip> component (components/Tooltip.jsx)
 * measures itself and the button, then:
 *   - shows ABOVE the button when there is room
 *   - FLIPS BELOW when the button is near the top edge
 *   - is CLAMPED so it never overflows the left/right edges
 * ----------------------------------------------------------------------------
 */
import { useRef } from 'react';
import { Button } from '@/components/ui';
import Tooltip from '../components/Tooltip';

export default function TooltipExample() {
  // The tooltip measures itself relative to this container
  const stageRef = useRef(null);

  return (
    <div ref={stageRef} className="ule-stage">
      <span className="ule-stage-hint muted small">Hover or Tab to the buttons</span>

      {/* Near the top edge: no room above, so the tooltip flips below */}
      <div className="ule-spot ule-spot-top">
        <Tooltip boundaryRef={stageRef} text="No room above me, so I flipped below!">
          <Button size="sm" variant="secondary">Top edge</Button>
        </Tooltip>
      </div>

      {/* Left edge: centered position would overflow, so it is clamped */}
      <div className="ule-spot ule-spot-left">
        <Tooltip boundaryRef={stageRef} text="I'm clamped so I don't leave the box on the left.">
          <Button size="sm" variant="secondary">Left edge</Button>
        </Tooltip>
      </div>

      {/* Plenty of space: normal centered tooltip above */}
      <div className="ule-spot ule-spot-center">
        <Tooltip boundaryRef={stageRef} text="Plenty of space - centered above.">
          <Button size="sm">Center</Button>
        </Tooltip>
      </div>

      {/* Right edge: clamped on the right side */}
      <div className="ule-spot ule-spot-right">
        <Tooltip
          boundaryRef={stageRef}
          text="A longer tooltip that is clamped against the right edge. Its height is measured, not guessed."
        >
          <Button size="sm" variant="secondary">Right edge</Button>
        </Tooltip>
      </div>
    </div>
  );
}
