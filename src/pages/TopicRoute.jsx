/**
 * TopicRoute - picks the right lesson page for the current URL.
 *
 * useParams() reads the dynamic parts of the URL defined in router.jsx:
 *   path ":group/:topicId/*"   +   URL "/hooks/use-state"
 *   -> { group: "hooks", topicId: "use-state" }
 */
import { useParams } from 'react-router-dom';
import { TOPIC_PAGES } from '@/app/routes';
import { getTopic } from '@/data/topics';
import NotFoundPage from './NotFoundPage';

export default function TopicRoute() {
  const { group, topicId } = useParams();
  const topic = getTopic(topicId);
  const Page = TOPIC_PAGES[topicId]; // a lazy component (see routes.jsx)

  // Unknown lesson or wrong group in the URL -> 404
  if (!topic || topic.group !== group || !Page) return <NotFoundPage />;

  // key={topicId} resets all state when switching between lessons.
  return <Page key={topicId} />;
}
