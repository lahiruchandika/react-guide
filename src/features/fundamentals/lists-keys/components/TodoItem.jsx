/**
 * TodoItem.jsx
 * ----------------------------------------------------------------------------
 * ONE row of the todo list, extracted into its own component and file.
 *
 * Why extract?
 *   - The parent's .map() stays short and readable.
 *   - The row can have its own local state (here: `isEditing`), which would
 *     be awkward to manage for every row from the parent.
 *
 * Data flows DOWN (todo) and events flow UP (onToggle, onDelete, onRename):
 * the parent owns the array, this component just asks it to change.
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';

export default function TodoItem({ todo, onToggle, onDelete, onRename }) {
  // Local UI state that belongs to THIS row only.
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function save() {
    const text = draft.trim();
    if (text) onRename(todo.id, text); // tell the parent the new text
    setIsEditing(false);
  }

  return (
    <li className={todo.done ? 'lk-todo is-done' : 'lk-todo'}>
      {/* Toggle "done" - the parent updates the array */}
      <button type="button" className="lk-todo-check" onClick={() => onToggle(todo.id)} aria-label="Toggle done">
        {todo.done && <Check size={14} />}
      </button>

      {isEditing ? (
        <input
          className="field-input lk-todo-edit"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          aria-label="Edit todo"
        />
      ) : (
        <span className="lk-todo-text" onDoubleClick={() => setIsEditing(true)}>
          {todo.text}
        </span>
      )}

      <div className="lk-todo-actions">
        <button
          type="button"
          className="lk-icon-btn"
          onClick={() => {
            setDraft(todo.text);
            setIsEditing(true);
          }}
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button type="button" className="lk-icon-btn danger" onClick={() => onDelete(todo.id)} aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}
