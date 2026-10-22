/**
 * TodoItem - one row of the todo list (child component).
 * ----------------------------------------------------------------------------
 * This component owns NO state about the todo itself. The parent
 * (ArrayStateExample) owns the array and passes down:
 *   - todo       the data to display
 *   - onToggle   function to call when the checkbox changes
 *   - onRename   function to call when the text is edited
 *   - onDelete   function to call when the delete button is clicked
 * The child just calls these functions; the parent updates the state.
 * This is "data down, events up".
 * ----------------------------------------------------------------------------
 */
import { Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onRename, onDelete }) {
  return (
    <li className={`us-todo ${todo.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as done`}
      />
      {/* Editing in place: every keystroke updates ONE item inside the array */}
      <input
        className="us-todo-text"
        value={todo.text}
        onChange={(e) => onRename(todo.id, e.target.value)}
        aria-label="Todo text"
      />
      <button type="button" className="us-icon-btn" onClick={() => onDelete(todo.id)} aria-label="Delete todo">
        <Trash2 size={16} />
      </button>
    </li>
  );
}
