/**
 * TodoItem - one row of the todo list.
 *
 * It owns NO state. It gets the todo and two callback functions from its
 * parent ("child -> parent communication"): when the user clicks, the child
 * calls the parent's function and the parent updates the list.
 */
import { Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`ls-todo ${todo.done ? 'is-done' : ''}`}>
      <label className="ls-todo-label">
        <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button type="button" className="ls-icon-btn" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.text}`}>
        <Trash2 size={15} />
      </button>
    </li>
  );
}
