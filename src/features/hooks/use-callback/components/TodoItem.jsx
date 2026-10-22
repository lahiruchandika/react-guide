/**
 * TodoItem.jsx
 * ----------------------------------------------------------------------------
 * One row of the todo list, wrapped in memo().
 *
 * It receives the todo object plus two callbacks (onToggle, onDelete).
 * Because the parent creates those callbacks with useCallback, and only the
 * changed todo gets a new object, typing in the "new todo" input or toggling
 * ONE item re-renders only that one row - watch the render counters.
 * ----------------------------------------------------------------------------
 */
import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { RenderCounter } from '@/components/ui';

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`uc-todo ${todo.done ? 'is-done' : ''}`}>
      <label className="uc-todo-label">
        {/* Pass the id back up so ONE shared callback works for every row */}
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <RenderCounter />
      <button type="button" className="uc-icon-btn" aria-label={`Delete ${todo.text}`} onClick={() => onDelete(todo.id)}>
        <Trash2 size={15} />
      </button>
    </li>
  );
}

export default memo(TodoItem);
