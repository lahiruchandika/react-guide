/**
 * OverflowProblemExample - WHY portals exist.
 * ----------------------------------------------------------------------------
 * Both cards below have `overflow: hidden` (very common: rounded cards,
 * scroll areas, carousels...). Open the "..." menu in each one:
 *
 *   LEFT  - the menu is rendered inline -> it gets CUT OFF by the card.
 *   RIGHT - the menu is rendered with createPortal into <body> -> fully visible.
 *
 * Same component, same code - only the `usePortal` prop differs.
 * (Fun fact: the white lesson box around this demo also has overflow: hidden!)
 * ----------------------------------------------------------------------------
 */
import { useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Copy, Share2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import Popover from '../components/Popover';

const MENU = [
  { label: 'Rename', icon: Pencil },
  { label: 'Duplicate', icon: Copy },
  { label: 'Share', icon: Share2 },
  { label: 'Delete', icon: Trash2 },
];

/** One card with a "..." menu. Reused twice with a different usePortal value. */
function FileCard({ title, usePortal }) {
  const buttonRef = useRef(null); // the Popover measures this button
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState('none');

  return (
    // pt-clip = overflow: hidden + fixed height  (the "problem" container)
    <div className="pt-clip">
      <div className="row pt-between">
        <strong>{title}</strong>
        <button ref={buttonRef} type="button" className="pt-icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Open menu">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="muted small">Last action: {lastAction}</p>
      <Badge tone={usePortal ? 'success' : 'danger'}>{usePortal ? 'createPortal → body' : 'inline (clipped)'}</Badge>

      <Popover anchorRef={buttonRef} open={open} usePortal={usePortal}>
        {MENU.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="pt-menu-item"
            onClick={() => {
              setLastAction(label); // state lives here, even though the menu is in <body>
              setOpen(false);
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </Popover>
    </div>
  );
}

export default function OverflowProblemExample() {
  return (
    <div className="grid-2">
      <FileCard title="report-2025.pdf" usePortal={false} />
      <FileCard title="budget.xlsx" usePortal />
    </div>
  );
}
