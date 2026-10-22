/**
 * ActivityFeed - a lazily loaded widget (default export for React.lazy).
 */
import { useEffect } from 'react';

const ACTIVITY = [
  { id: 1, who: 'Maya', what: 'placed order #1042', when: '2 min ago' },
  { id: 2, who: 'Leo', what: 'left a 5★ review', when: '8 min ago' },
  { id: 3, who: 'Sara', what: 'subscribed to Pro', when: '15 min ago' },
  { id: 4, who: 'Tom', what: 'requested a refund', when: '1 h ago' },
];

export default function ActivityFeed({ onReady }) {
  useEffect(() => {
    onReady?.('Activity feed');
  }, [onReady]);

  return (
    <div className="lz-widget lz-loaded">
      <strong>Recent activity</strong>
      {ACTIVITY.map((a) => (
        <div key={a.id} className="row lz-activity">
          <span className="lz-avatar">{a.who[0]}</span>
          <div className="lz-grow">
            <div className="small">
              <strong>{a.who}</strong> {a.what}
            </div>
            <div className="muted small">{a.when}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
