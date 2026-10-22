/**
 * HomePage - welcome screen with a card for every lesson.
 *
 * The cards are rendered from the TOPICS array with .map() - the same data
 * that drives the sidebar, so both always stay in sync.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, FolderTree, MousePointerClick } from 'lucide-react';
import { TOPIC_GROUPS, TOPICS, topicPath } from '@/data/topics';
import Badge from '@/components/ui/Badge';
import './HomePage.css';

const LEVEL_TONE = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' };

// Small presentational component used only on this page.
function Feature({ icon, title, text }) {
  return (
    <div className="home-feature">
      <span className="home-feature-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = 'React Guide - Learn React by Example';
  }, []);

  const firstTopic = TOPICS[0];

  return (
    <div className="home">
      <section className="home-hero">
        <Badge tone="primary">React 19 · Vite · React Router</Badge>
        <h1>
          Learn React by <span>doing</span>.
        </h1>
        <p>
          {TOPICS.length} focused lessons. Every lesson has a live demo you can play with and the real, commented source
          code behind it. Open the project in VS Code and read along.
        </p>
        <Link to={topicPath(firstTopic)} className="home-cta">
          Start with {firstTopic.title} <ArrowRight size={18} />
        </Link>
      </section>

      <section className="home-features">
        <Feature icon={<MousePointerClick size={20} />} title="Live demos" text="Click, type and watch state change in real time." />
        <Feature icon={<Code2 size={20} />} title="Real source code" text='Switch any demo to the "Code" tab to see exactly how it works.' />
        <Feature icon={<FolderTree size={20} />} title="Industry structure" text="Feature folders, shared UI, hooks, context and services." />
        <Feature icon={<BookOpen size={20} />} title="Commented code" text="Every file explains the what and the why." />
      </section>

      {TOPIC_GROUPS.map((group) => (
        <section key={group.id} className="home-group">
          <h2>{group.title}</h2>
          <div className="home-grid">
            {TOPICS.filter((t) => t.group === group.id).map((topic) => (
              <Link key={topic.id} to={topicPath(topic)} className="topic-card">
                <div className="topic-card-top">
                  <h3>{topic.title}</h3>
                  <Badge tone={LEVEL_TONE[topic.level]}>{topic.level}</Badge>
                </div>
                <p>{topic.summary}</p>
                <span className="topic-card-link">
                  Open lesson <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
