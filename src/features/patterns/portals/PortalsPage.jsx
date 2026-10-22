/**
 * PortalsPage - lesson: rendering outside the parent DOM node with createPortal.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   PortalsPage.jsx / .css     this page (the .css also styles portaled content -
 *                              CSS is global, so it still applies inside <body>)
 *   examples/                  one file per live demo (shown in the Code tab)
 *   components/Modal.jsx       reusable accessible modal
 *   components/Popover.jsx     floating menu (inline or portal)
 *   components/toast/          ToastProvider + Toast + ToastContext (useToast)
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './PortalsPage.css';

import OverflowProblemExample from './examples/OverflowProblemExample';
import overflowSource from './examples/OverflowProblemExample.jsx?raw';
import popoverSource from './components/Popover.jsx?raw';
import ModalExample from './examples/ModalExample';
import modalExampleSource from './examples/ModalExample.jsx?raw';
import modalSource from './components/Modal.jsx?raw';
import EventBubblingExample from './examples/EventBubblingExample';
import bubblingSource from './examples/EventBubblingExample.jsx?raw';
import ToastExample from './examples/ToastExample';
import toastExampleSource from './examples/ToastExample.jsx?raw';
import toastProviderSource from './components/toast/ToastProvider.jsx?raw';
import toastSource from './components/toast/Toast.jsx?raw';

// Show the example AND the components it uses in the Code tab.
const combine = (...parts) =>
  parts.map(([name, src]) => `// ===================== ${name} =====================\n\n${src.trim()}`).join('\n\n\n');

export default function PortalsPage() {
  return (
    <ConceptPage
      topicId="portals"
      intro={
        <p>
          Normally a component&apos;s HTML is placed <strong>inside its parent&apos;s HTML</strong>. That becomes a problem
          for things that must float above the page - modals, dropdown menus, tooltips, toasts - because a parent with{' '}
          <code>overflow: hidden</code>, <code>z-index</code> or <code>transform</code> can clip or hide them.{' '}
          <code>createPortal(children, domNode)</code> renders the children into a <strong>different DOM node</strong>{' '}
          (usually <code>document.body</code>) while keeping them in the same place in the <strong>React tree</strong>.
        </p>
      }
      keyPoints={[
        "createPortal comes from 'react-dom', not 'react'",
        'The DOM node moves, but props, state, context and events work exactly as before',
        'Events bubble through the React tree - a portal click reaches its React parents',
        'Portals escape overflow: hidden and z-index stacking problems',
        'Modals still need accessibility work: focus management, Escape key, aria-modal',
        'The target node must already exist in the DOM when the portal renders',
      ]}
      syntax={`import { createPortal } from 'react-dom';

function Modal({ open, children }) {
  if (!open) return null;
  return createPortal(
    <div className="backdrop">
      <div role="dialog" aria-modal="true">{children}</div>
    </div>,
    document.body // where to render
  );
}`}
    >
      <Example
        title="1. The problem: overflow: hidden clips floating UI"
        description="Open the '...' menu in both cards. The inline menu is cut off; the portal menu escapes to <body>."
        code={combine(['examples/OverflowProblemExample.jsx', overflowSource], ['components/Popover.jsx', popoverSource])}
        fileName="examples/OverflowProblemExample.jsx + components/Popover.jsx"
      >
        <OverflowProblemExample />
      </Example>

      <Example
        title="2. A reusable, accessible Modal"
        description="Delete a project or edit the profile. Try the keyboard: Tab stays inside, Escape closes, focus returns to the button."
        code={combine(['examples/ModalExample.jsx', modalExampleSource], ['components/Modal.jsx', modalSource])}
        fileName="examples/ModalExample.jsx + components/Modal.jsx"
      >
        <ModalExample />
      </Example>

      <Example
        title="3. Events bubble through the React tree"
        description="The portal button sits in the right box in the DOM, but its click is handled by its React parent on the left."
        code={bubblingSource}
        fileName="examples/EventBubblingExample.jsx"
      >
        <EventBubblingExample />
      </Example>

      <Example
        title="4. Toast notifications (Context + Portal)"
        description="Click the buttons - toasts appear in the corner of the screen. Hover one to pause its timer."
        code={combine(
          ['examples/ToastExample.jsx', toastExampleSource],
          ['components/toast/ToastProvider.jsx', toastProviderSource],
          ['components/toast/Toast.jsx', toastSource],
        )}
        fileName="examples/ToastExample.jsx + components/toast/*"
      >
        <ToastExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li><strong>Importing from the wrong package:</strong> it&apos;s <code>import {'{ createPortal }'} from &apos;react-dom&apos;</code>.</li>
          <li><strong>Forgetting accessibility:</strong> a portal only moves HTML. You still need <code>role=&quot;dialog&quot;</code>, <code>aria-modal</code>, focus management and the Escape key.</li>
          <li><strong>Surprise bubbling:</strong> a click inside a portaled modal also triggers <code>onClick</code> handlers of its React parents. Use <code>e.stopPropagation()</code> if that is unwanted.</li>
          <li><strong>Click-outside checks with <code>contains()</code></strong> fail for portals, because the modal is not a DOM child of the parent.</li>
          <li><strong>Not cleaning up</strong> listeners, timers and <code>body</code> styles (scroll lock) when the modal closes.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Modals and dialogs, dropdown menus, tooltips and popovers, toast notifications, and full-screen overlays - anything
        that must visually &quot;break out&quot; of its container. Also handy for rendering into DOM nodes that React
        doesn&apos;t own (for example inside a map or chart library). For simple dialogs, the native{' '}
        <code>&lt;dialog&gt;</code> element with <code>showModal()</code> is also worth knowing.
      </Callout>
    </ConceptPage>
  );
}
