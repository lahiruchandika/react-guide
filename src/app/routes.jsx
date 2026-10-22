/**
 * routes.jsx
 * ----------------------------------------------------------------------------
 * Maps every topic id to its page component.
 *
 * React.lazy() + dynamic import() means each lesson is downloaded only when the
 * user opens it (code splitting). The <Suspense> boundary in AppLayout shows a
 * spinner while the chunk loads. See the "Lazy Loading & Suspense" lesson.
 * ----------------------------------------------------------------------------
 */
import { lazy } from 'react';

export const TOPIC_PAGES = {
  // Fundamentals
  'components-jsx': lazy(() => import('@/features/fundamentals/components-jsx/ComponentsJsxPage')),
  props: lazy(() => import('@/features/fundamentals/props/PropsPage')),
  'events-forms': lazy(() => import('@/features/fundamentals/events-forms/EventsFormsPage')),
  'conditional-rendering': lazy(() => import('@/features/fundamentals/conditional-rendering/ConditionalRenderingPage')),
  'lists-keys': lazy(() => import('@/features/fundamentals/lists-keys/ListsKeysPage')),
  'component-communication': lazy(() => import('@/features/fundamentals/component-communication/ComponentCommunicationPage')),

  // Hooks
  'use-state': lazy(() => import('@/features/hooks/use-state/UseStatePage')),
  'use-effect': lazy(() => import('@/features/hooks/use-effect/UseEffectPage')),
  'use-ref': lazy(() => import('@/features/hooks/use-ref/UseRefPage')),
  'use-memo': lazy(() => import('@/features/hooks/use-memo/UseMemoPage')),
  'use-callback': lazy(() => import('@/features/hooks/use-callback/UseCallbackPage')),
  'use-reducer': lazy(() => import('@/features/hooks/use-reducer/UseReducerPage')),
  'use-context': lazy(() => import('@/features/hooks/use-context/UseContextPage')),
  'use-layout-effect': lazy(() => import('@/features/hooks/use-layout-effect/UseLayoutEffectPage')),
  'use-id': lazy(() => import('@/features/hooks/use-id/UseIdPage')),
  'use-transition': lazy(() => import('@/features/hooks/use-transition/UseTransitionPage')),
  'custom-hooks': lazy(() => import('@/features/hooks/custom-hooks/CustomHooksPage')),

  // Patterns & Advanced
  'local-storage': lazy(() => import('@/features/patterns/local-storage/LocalStoragePage')),
  'data-fetching': lazy(() => import('@/features/patterns/data-fetching/DataFetchingPage')),
  'refs-forwarding': lazy(() => import('@/features/patterns/refs-forwarding/RefsForwardingPage')),
  portals: lazy(() => import('@/features/patterns/portals/PortalsPage')),
  'lazy-suspense': lazy(() => import('@/features/patterns/lazy-suspense/LazySuspensePage')),
  'error-boundaries': lazy(() => import('@/features/patterns/error-boundaries/ErrorBoundariesPage')),
  'react-router': lazy(() => import('@/features/patterns/react-router/ReactRouterPage')),
};
