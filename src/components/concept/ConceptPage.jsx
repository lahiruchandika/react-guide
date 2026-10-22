/**
 * ConceptPage - the shared layout for every lesson page.
 *
 * It reads the title / summary / level from src/data/topics.js using topicId,
 * then renders:  header  ->  "Key points" list  ->  your content (children)
 * ->  "Previous / Next lesson" navigation.
 *
 *   <ConceptPage
 *     topicId="use-state"
 *     intro={<p>useState lets a component remember values...</p>}
 *     keyPoints={['Returns [value, setValue]', 'Updating state re-renders']}
 *     syntax={`const [count, setCount] = useState(0);`}
 *   >
 *     <Example ...>...</Example>
 *   </ConceptPage>
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TOPICS, getTopic, topicPath } from '@/data/topics';
import Badge from '@/components/ui/Badge';
import CodeBlock from '@/components/ui/CodeBlock';
import './ConceptPage.css';

const LEVEL_TONE = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

export default function ConceptPage({ topicId, intro, keyPoints = [], syntax, children }) {
  const topic = getTopic(topicId);

  // Find the previous and next lessons for the bottom navigation.
  const index = TOPICS.findIndex((t) => t.id === topicId);
  const prev = TOPICS[index - 1];
  const next = TOPICS[index + 1];

  // Side effect: update the browser tab title for this lesson.
  useEffect(() => {
    document.title = `${topic?.title ?? 'Lesson'} · React Guide`;
  }, [topic]);

  if (!topic) return <p>Unknown topic: {topicId}</p>;

  return (
    <article className="concept">
      <header className="concept-hero">
        <div className="concept-meta">
          <Badge tone="primary">{topic.group}</Badge>
          <Badge tone={LEVEL_TONE[topic.level]}>{topic.level}</Badge>
        </div>
        <h1 className="concept-title">{topic.title}</h1>
        <p className="concept-summary">{topic.summary}</p>
      </header>

      {intro && <div className="concept-intro">{intro}</div>}

      {(keyPoints.length > 0 || syntax) && (
        <div className="concept-overview">
          {keyPoints.length > 0 && (
            <div className="concept-keypoints">
              <h4>Key points</h4>
              <ul>
                {keyPoints.map((point, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {syntax && (
            <div className="concept-syntax">
              <h4>Syntax</h4>
              <CodeBlock code={syntax} fileName="syntax" />
            </div>
          )}
        </div>
      )}

      {children}

      <nav className="concept-pager">
        {prev ? (
          <Link to={topicPath(prev)} className="pager-link">
            <ArrowLeft size={16} />
            <span>
              <small>Previous</small>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={topicPath(next)} className="pager-link next">
            <span>
              <small>Next</small>
              {next.title}
            </span>
            <ArrowRight size={16} />
          </Link>
        )}
      </nav>
    </article>
  );
}
