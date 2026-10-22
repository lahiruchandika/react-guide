/**
 * SubmittedPreview.jsx
 * ----------------------------------------------------------------------------
 * Shows the data that was submitted (what you would send to an API).
 * The password is masked - never display secrets.
 * `onReset` is a function prop: the button asks the parent to clear the form.
 * ----------------------------------------------------------------------------
 */
import { CircleCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';

export default function SubmittedPreview({ data, onReset }) {
  // Build a safe copy to display: replace the password with dots, drop "confirm".
  const { confirm: _confirm, ...rest } = data;
  const safeData = { ...rest, password: '•'.repeat(data.password.length) };

  return (
    <div className="ef-success">
      <div className="ef-success-head">
        <CircleCheck size={28} />
        <div>
          <h4>Welcome aboard, {data.fullName.split(' ')[0]}!</h4>
          <p className="small muted">This object would be sent to your server:</p>
        </div>
      </div>

      <pre className="ef-json">{JSON.stringify(safeData, null, 2)}</pre>

      <Button variant="secondary" icon={<RotateCcw size={14} />} onClick={onReset}>
        Sign up another user
      </Button>
    </div>
  );
}
