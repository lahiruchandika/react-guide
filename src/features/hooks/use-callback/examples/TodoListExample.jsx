/**
 * TodoListExample.jsx
 * ----------------------------------------------------------------------------
 * A realistic use of useCallback + memo(): a todo list where each row is a
 * memoised <TodoItem>.
 *
 * Key ideas:
 *   1. handleToggle / handleDelete are created with useCallback.
 *   2. They use the UPDATER form  setTodos(prev => ...)  so they don't need
 *      `todos` in their dependency array -> deps can be []  -> never change.
 *   3. When one todo changes, we create a new object ONLY for that todo;
 *      the other todo objects keep their reference, so their rows skip rendering.
 *
 * Try it: type in the input (no row re-renders), tick one item (only that row
 * re-renders), add an item (only the new row renders).
 * ----------------------------------------------------------------------------
 */
import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button, RenderCounter } from '@/components/ui';
import TodoItem from '../components/TodoItem';

const INITIAL_TODOS = [
  { id: 1, text: 'Read the useCallback docs', done: true },
  { id: 2, text: 'Wrap TodoItem in memo()', done: false },
  { id: 3, text: 'Compare render counters', done: false },
];

export default function TodoListExample() {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [text, setText] = useState(''); // typing here re-renders the parent only

  // 1. Stable callback: toggle one todo by id.
  const handleToggle = useCallback((id) => {
    setTodos((prev) =>
      // Only the matching todo becomes a NEW object; the others are reused as-is.
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []); // [] -> created once, because it only uses the updater form

  // 2. Stable callback: delete one todo by id.
  const handleDelete = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // A normal function is fine here: it is not passed to a memoised child.
  const handleAdd = (e) => {
    e.preventDefault(); // stop the form from reloading the page
    if (!text.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="uc-todo-app">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 8 }}>
          <strong>My tasks</strong>
          <Badge tone="primary">{remaining} left</Badge>
        </div>
        <RenderCounter label="list renders" />
      </div>

      <form className="uc-todo-form" onSubmit={handleAdd}>
        <input className="field-input" placeholder="Add a task and press Enter..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button type="submit" icon={<Plus size={16} />}>
          Add
        </Button>
      </form>

      <ul className="uc-todo-list">
        {todos.map((todo) => (
          // Same callbacks passed to every row; the row passes its own id back.
          <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
        ))}
        {todos.length === 0 && <li className="muted small">All done! Add a new task above.</li>}
      </ul>
    </div>
  );
}
