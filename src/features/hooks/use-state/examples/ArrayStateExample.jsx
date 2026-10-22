/**
 * ArrayStateExample - a todo list
 * ----------------------------------------------------------------------------
 * Storing an ARRAY in state and changing it IMMUTABLY (always a new array).
 *
 *   Action    Don't (mutates)          Do (returns a new array)
 *   -------   ----------------------   ---------------------------------------
 *   add       todos.push(item)         [...todos, item]
 *   remove    todos.splice(i, 1)       todos.filter(t => t.id !== id)
 *   update    todos[i].done = true     todos.map(t => t.id === id ? {...t, done: true} : t)
 *
 * What it demonstrates:
 *   - add / remove / update / clear items without mutation
 *   - stable `key` props (a unique id, not the array index)
 *   - passing callbacks to a child component (components/TodoItem.jsx)
 *   - derived data (remaining count, filtered list) computed during render
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import TodoItem from '../components/TodoItem';
import '../UseStatePage.css';

const INITIAL_TODOS = [
  { id: 1, text: 'Learn useState', done: true },
  { id: 2, text: 'Update arrays immutably', done: false },
  { id: 3, text: 'Build something cool', done: false },
];

const FILTERS = ['all', 'active', 'done'];

export default function ArrayStateExample() {
  const [todos, setTodos] = useState(INITIAL_TODOS); // the array
  const [draft, setDraft] = useState(''); // text of the "new todo" input
  const [filter, setFilter] = useState('all'); // which items to show

  // ADD: create a new array with the old items + the new one at the end.
  function handleAdd(e) {
    e.preventDefault(); // stop the form from reloading the page
    const text = draft.trim();
    if (!text) return;
    const newTodo = { id: crypto.randomUUID(), text, done: false }; // unique id for the key
    setTodos((prev) => [...prev, newTodo]);
    setDraft(''); // clear the input
  }

  // UPDATE: map over the array, replace only the matching item with a copy.
  function handleToggle(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function handleRename(id, text) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  }

  // REMOVE: filter returns a new array without the deleted item.
  function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function handleClearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  // DERIVED data - no need for extra state, just compute it from `todos`.
  const remaining = todos.filter((t) => !t.done).length;
  const visibleTodos = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'done' ? t.done : true,
  );

  return (
    <div className="stack us-todo-app">
      <form className="row" onSubmit={handleAdd}>
        <input
          className="us-todo-input"
          placeholder="What needs to be done?"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button type="submit" icon={<Plus />} disabled={!draft.trim()}>
          Add
        </Button>
      </form>

      <div className="row us-spread">
        <div className="row">
          {FILTERS.map((f) => (
            <button key={f} type="button" className={`us-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <Badge tone={remaining ? 'warning' : 'success'}>{remaining} left</Badge>
      </div>

      {visibleTodos.length === 0 ? (
        <p className="muted us-empty">Nothing here.</p>
      ) : (
        <ul className="us-todo-list">
          {/* key={todo.id}: lets React track each item between renders */}
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <div className="row us-spread">
        <span className="muted small">{todos.length} items in state</span>
        <Button variant="ghost" size="sm" onClick={handleClearDone} disabled={remaining === todos.length}>
          Clear completed
        </Button>
      </div>
    </div>
  );
}
