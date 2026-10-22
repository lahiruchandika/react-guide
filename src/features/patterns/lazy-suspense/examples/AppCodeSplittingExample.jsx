/**
 * AppCodeSplittingExample - this very app lazy-loads every lesson page!
 * ----------------------------------------------------------------------------
 * Look at these files in VS Code:
 *
 *   src/app/routes.jsx            TOPIC_PAGES = { 'use-state': lazy(() => import(...)), ... }
 *   src/pages/TopicRoute.jsx      picks TOPIC_PAGES[topicId] for the current URL
 *   src/components/layout/AppLayout.jsx
 *                                 <Suspense fallback={<Spinner />}> <Outlet /> </Suspense>
 *
 * Result: opening the app downloads only the layout + home page. Each lesson
 * (including the one you are reading) is a separate chunk downloaded the first
 * time you open it. This is called ROUTE-BASED CODE SPLITTING - the most
 * common and most effective place to use React.lazy.
 * ----------------------------------------------------------------------------
 */
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import { TOPIC_PAGES } from '@/app/routes';

// The steps that happen when you click a lesson in the sidebar
const STEPS = [
  { file: 'Sidebar.jsx', text: '<NavLink> changes the URL' },
  { file: 'router.jsx', text: "route ':group/:topicId/*' matches" },
  { file: 'TopicRoute.jsx', text: 'TOPIC_PAGES[topicId] → lazy page' },
  { file: 'AppLayout.jsx', text: '<Suspense> shows a spinner' },
  { file: 'Lesson chunk', text: 'downloaded → page renders' },
];

export default function AppCodeSplittingExample() {
  const lessonCount = Object.keys(TOPIC_PAGES).length;

  return (
    <div className="stack">
      <div className="lz-flow">
        {STEPS.map((step, i) => (
          <div key={step.file} className="lz-flow-item">
            <div className="lz-flow-step">
              <span className="lz-flow-num">{i + 1}</span>
              <code>{step.file}</code>
              <span className="small muted">{step.text}</span>
            </div>
            {i < STEPS.length - 1 && <ArrowRight size={16} className="lz-flow-arrow" />}
          </div>
        ))}
      </div>

      <div className="row">
        <Badge tone="primary">{lessonCount} lessons</Badge>
        <span className="small muted">
          = {lessonCount} separate JavaScript chunks, each loaded only when you open that lesson. Run{' '}
          <code>npm run build</code> and look at <code>dist/assets/</code> to see them.
        </span>
      </div>
    </div>
  );
}
