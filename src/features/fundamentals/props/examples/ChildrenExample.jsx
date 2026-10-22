/**
 * ChildrenExample.jsx
 * ----------------------------------------------------------------------------
 * DEMONSTRATES: the `children` prop and composition.
 *
 * The same <Panel> wrapper (components/Panel.jsx) is used three times with
 * completely different content inside. Panel never needs to know what the
 * content is - it just renders {children}.
 *
 * Toggle "Highlight children" to see which part comes from `children`.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { CloudSun, ListTodo, Music, Highlighter } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import Panel from '../components/Panel';

export default function ChildrenExample() {
  const [highlight, setHighlight] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="stack">
      <div className="row">
        <Button
          size="sm"
          variant={highlight ? 'primary' : 'secondary'}
          icon={<Highlighter size={14} />}
          onClick={() => setHighlight((h) => !h)}
        >
          Highlight children
        </Button>
      </div>

      <div className={highlight ? 'grid-3 pr-show-children' : 'grid-3'}>
        {/* 1. children = some text and a big number */}
        <Panel title="Weather" icon={<CloudSun size={18} />} tone="info">
          <div className="big-number">24°</div>
          <p className="muted small">Sunny with light wind</p>
        </Panel>

        {/* 2. children = a list, plus a `footer` slot prop */}
        <Panel
          title="Today"
          icon={<ListTodo size={18} />}
          tone="success"
          footer={<span className="small muted">3 tasks · footer passed as a prop</span>}
        >
          <ul className="pr-panel-list">
            <li>Read the props lesson</li>
            <li>Build a Panel component</li>
            <li>Drink some water</li>
          </ul>
        </Panel>

        {/* 3. children = interactive content with its OWN state from this parent */}
        <Panel title="Now playing" icon={<Music size={18} />} tone="warning">
          <p>
            <strong>Lo-fi beats</strong> <Badge tone={playing ? 'success' : 'neutral'}>{playing ? 'playing' : 'paused'}</Badge>
          </p>
          <Button size="sm" onClick={() => setPlaying((p) => !p)}>
            {playing ? 'Pause' : 'Play'}
          </Button>
        </Panel>
      </div>
    </div>
  );
}
