/**
 * NotFoundPage - shown for any URL that doesn't match a route (404).
 */
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate(); // navigate in code, e.g. after a button click

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div className="big-number" style={{ fontSize: 72, color: 'var(--color-primary)' }}>
        404
      </div>
      <h2>Page not found</h2>
      <p className="muted">This lesson doesn't exist (yet).</p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button onClick={() => navigate('/')}>Home</Button>
      </div>
    </div>
  );
}
