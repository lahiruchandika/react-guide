/**
 * topics.js
 * ----------------------------------------------------------------------------
 * The single source of truth for every lesson in the guide.
 *
 * The Sidebar, the Home page cards and the Router are all generated from this
 * list. To add a new lesson:
 *   1. Create the page component inside src/features/<group>/<topic>/
 *   2. Add an entry here
 *   3. Add a lazy import for it in src/app/routes.jsx
 * ----------------------------------------------------------------------------
 */

/** Groups shown as headings in the sidebar (in this order). */
export const TOPIC_GROUPS = [
  { id: 'fundamentals', title: 'Fundamentals' },
  { id: 'hooks', title: 'Hooks' },
  { id: 'patterns', title: 'Patterns & Advanced' },
];

/**
 * Every lesson.
 * - id:      unique key, also used as the URL slug  ->  /fundamentals/props
 * - group:   which TOPIC_GROUPS entry it belongs to
 * - title:   label shown in the sidebar
 * - summary: one-line description shown on the Home page
 * - level:   'Beginner' | 'Intermediate' | 'Advanced'
 */
export const TOPICS = [
  // ---------------------------------------------------------------- Fundamentals
  { id: 'components-jsx', group: 'fundamentals', title: 'Components & JSX', level: 'Beginner',
    summary: 'Create function components, write JSX and compose a UI from small pieces.' },
  { id: 'props', group: 'fundamentals', title: 'Props & Children', level: 'Beginner',
    summary: 'Pass data, functions and children from parent to child components.' },
  { id: 'events-forms', group: 'fundamentals', title: 'Events & Forms', level: 'Beginner',
    summary: 'Handle clicks and typing, build controlled forms with validation.' },
  { id: 'conditional-rendering', group: 'fundamentals', title: 'Conditional Rendering', level: 'Beginner',
    summary: 'Show or hide UI with if, ternary, && and early returns.' },
  { id: 'lists-keys', group: 'fundamentals', title: 'Lists & Keys', level: 'Beginner',
    summary: 'Render arrays with map(), filter and sort them, and why keys matter.' },
  { id: 'component-communication', group: 'fundamentals', title: 'Component Communication', level: 'Intermediate',
    summary: 'Parent → child, child → parent, siblings, lifting state up and prop drilling.' },

  // ----------------------------------------------------------------------- Hooks
  { id: 'use-state', group: 'hooks', title: 'useState', level: 'Beginner',
    summary: 'Add memory to a component: numbers, strings, objects, arrays and updater functions.' },
  { id: 'use-effect', group: 'hooks', title: 'useEffect', level: 'Intermediate',
    summary: 'Run side effects: timers, subscriptions, document title and cleanup.' },
  { id: 'use-ref', group: 'hooks', title: 'useRef', level: 'Intermediate',
    summary: 'Access DOM elements and keep values that do not trigger re-renders.' },
  { id: 'use-memo', group: 'hooks', title: 'useMemo', level: 'Intermediate',
    summary: 'Cache expensive calculations between renders.' },
  { id: 'use-callback', group: 'hooks', title: 'useCallback & memo', level: 'Intermediate',
    summary: 'Keep function identity stable and skip re-rendering memoized children.' },
  { id: 'use-reducer', group: 'hooks', title: 'useReducer', level: 'Intermediate',
    summary: 'Manage complex state transitions with a reducer and actions.' },
  { id: 'use-context', group: 'hooks', title: 'useContext', level: 'Intermediate',
    summary: 'Share data (theme, user, cart) without passing props through every level.' },
  { id: 'use-layout-effect', group: 'hooks', title: 'useLayoutEffect', level: 'Advanced',
    summary: 'Measure the DOM before the browser paints to avoid flicker.' },
  { id: 'use-id', group: 'hooks', title: 'useId', level: 'Beginner',
    summary: 'Generate unique, stable IDs for accessible form fields.' },
  { id: 'use-transition', group: 'hooks', title: 'useTransition & useDeferredValue', level: 'Advanced',
    summary: 'Keep the UI responsive while slow updates happen in the background.' },
  { id: 'custom-hooks', group: 'hooks', title: 'Custom Hooks', level: 'Intermediate',
    summary: 'Extract reusable logic into your own hooks: useToggle, useDebounce, useFetch...' },

  // -------------------------------------------------------------------- Patterns
  { id: 'local-storage', group: 'patterns', title: 'Local Storage', level: 'Beginner',
    summary: 'Save and load state from the browser so data survives a page refresh.' },
  { id: 'data-fetching', group: 'patterns', title: 'Data Fetching', level: 'Intermediate',
    summary: 'Load data from an API with loading, error and cancel handling.' },
  { id: 'refs-forwarding', group: 'patterns', title: 'Refs as Props', level: 'Intermediate',
    summary: 'Pass a ref to a child component and expose methods with useImperativeHandle.' },
  { id: 'portals', group: 'patterns', title: 'Portals & Modals', level: 'Intermediate',
    summary: 'Render a modal or toast outside the parent DOM tree with createPortal.' },
  { id: 'lazy-suspense', group: 'patterns', title: 'Lazy Loading & Suspense', level: 'Advanced',
    summary: 'Split code into chunks and show a fallback while it loads.' },
  { id: 'error-boundaries', group: 'patterns', title: 'Error Boundaries', level: 'Advanced',
    summary: 'Catch rendering errors and show a friendly fallback instead of a blank page.' },
  { id: 'react-router', group: 'patterns', title: 'React Router', level: 'Intermediate',
    summary: 'Navigate between pages, read URL params and query strings.' },
];

/** Helper: build the URL for a topic, e.g. "/hooks/use-state". */
export const topicPath = (topic) => `/${topic.group}/${topic.id}`;

/** Helper: find a topic object by its id. */
export const getTopic = (id) => TOPICS.find((t) => t.id === id);
