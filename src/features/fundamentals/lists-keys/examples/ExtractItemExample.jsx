/**
 * ExtractItemExample.jsx
 * ----------------------------------------------------------------------------
 * Demonstrates: extracting a list item into its own component (TodoItem)
 * and updating an array in state immutably.
 *
 *   {todos.map((todo) => (
 *     <TodoItem key={todo.id} todo={todo} onToggle={...} />   // key HERE
 *   ))}
 *
 * Immutable array updates (never push/splice the state array directly):
 *   add     ->  [...todos, newTodo]
 *   remove  ->  todos.filter((t) => t.id !== id)
 *   update  ->  todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import TodoItem from '../components/TodoItem';

const STARTER_TODOS = [
  { id: 1, text: 'Read the Lists & Keys lesson', done: true },
  { id: 2, text: 'Build a filterable product list', done: false },
  { id: 3, text: 'Double-click a todo to edit it', done: false },
];

const FILTERS = ['all', 'active', 'done'];

export default function ExtractItemExample() {
  const [todos, setTodos] = useState(STARTER_TODOS);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  // ---------- Array updates (all return NEW arrays) ----------
  function addTodo(e) {
    e.preventDefault(); // stop the form from reloading the page
    const trimmed = text.trim();
    if (!trimmed) return;
    // Give each todo a unique id ONCE, when it is created - perfect for keys.
    // (Date.now() is fine for a demo; real apps get ids from the server or
    //  use crypto.randomUUID().) Never generate keys during render!
    setTodos([...todos, { id: Date.now(), text: trimmed, done: false }]);
    setText('');
  }

  const toggleTodo = (id) => setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));
  const renameTodo = (id, newText) => setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));

  // ---------- Derived values ----------
  const visible = todos.filter((t) => (filter === 'active' ? !t.done : filter === 'done' ? t.done : true));
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="lk-todo-app">
      <form className="row" onSubmit={addTodo} style={{ flexWrap: 'nowrap' }}>
        <input className="field-input" placeholder="What needs to be done?" value={text} onChange={(e) => setText(e.target.value)} aria-label="New todo" />
        <Button type="submit" icon={<Plus />}>
          Add
        </Button>
      </form>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 'var(--space-2)' }}>
          {FILTERS.map((f) => (
            <Button key={f} size="sm" variant={filter === f ? 'primary' : 'ghost'} onClick={() => setFilter(f)}>
              {f}
            </Button>
          ))}
        </div>
        <Badge tone={remaining === 0 ? 'success' : 'info'}>{remaining} left</Badge>
      </div>

      {visible.length === 0 ? (
        <p className="muted small" style={{ textAlign: 'center', margin: 'var(--space-4) 0' }}>
          Nothing here 🎉
        </p>
      ) : (
        <ul className="lk-todo-list">
          {visible.map((todo) => (
            // The key goes on <TodoItem>, the element returned from map().
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onRename={renameTodo} />
          ))}
        </ul>
      )}
    </div>
  );
}
