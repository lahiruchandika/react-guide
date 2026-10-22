/**
 * PersistentTodosExample - a todo list that survives a page refresh.
 * ----------------------------------------------------------------------------
 * The only difference from a normal todo list is ONE line:
 *
 *   const [todos, setTodos] = useState(DEFAULT_TODOS);                      // forgotten on refresh
 *   const [todos, setTodos] = useLocalStorage('react-guide:todos', DEFAULT_TODOS); // remembered!
 *
 * useLocalStorage (src/hooks/useLocalStorage.js) works exactly like useState,
 * but reads the saved value on the first render and writes every change back.
 *
 * Add a few todos, tick some off, then press "Reload page".
 * ----------------------------------------------------------------------------
 */
import { useState } from 'react';
import { Plus, RotateCw } from 'lucide-react';
import { Badge, Button, Input } from '@/components/ui';
import { useLocalStorage } from '@/hooks';
import TodoItem from '../components/TodoItem';

const DEFAULT_TODOS = [
  { id: 1, text: 'Read the useState lesson', done: true },
  { id: 2, text: 'Learn localStorage', done: false },
  { id: 3, text: 'Build my own app', done: false },
];

export default function PersistentTodosExample() {
  // 1. Persistent state - same API as useState. The key names the storage slot.
  const [todos, setTodos] = useLocalStorage('react-guide:todos', DEFAULT_TODOS);

  // 2. Normal (temporary) state for the input - no need to persist half-typed text.
  const [text, setText] = useState('');

  // 3. Derived value - computed from todos, never stored separately.
  const remaining = todos.filter((t) => !t.done).length;

  const addTodo = (e) => {
    e.preventDefault(); // stop the form from reloading the page
    const trimmed = text.trim();
    if (!trimmed) return;
    // Always create a NEW array (immutability) so React sees the change.
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed, done: false }]);
    setText('');
  };

  const toggleTodo = (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const deleteTodo = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));
  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  return (
    <div className="grid-2">
      <div className="stack">
        <form className="ls-todo-form" onSubmit={addTodo}>
          <Input placeholder="What needs to be done?" value={text} onChange={(e) => setText(e.target.value)} aria-label="New todo" />
          <Button type="submit" icon={<Plus size={14} />}>Add</Button>
        </form>

        <ul className="ls-todos">
          {todos.map((todo) => (
            // 4. Pass data + callbacks down to the child component.
            <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
          ))}
          {todos.length === 0 && <li className="muted small ls-empty">Nothing to do. Add a todo above!</li>}
        </ul>

        <div className="row ls-between">
          <Badge tone="primary">{remaining} left</Badge>
          <div className="row">
            <Button size="sm" variant="ghost" onClick={clearDone} disabled={remaining === todos.length}>Clear done</Button>
            <Button size="sm" variant="ghost" onClick={() => setTodos(DEFAULT_TODOS)}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="stack">
        <div className="box">
          <span className="box-label">localStorage[&apos;react-guide:todos&apos;]</span>
          {/* Exactly what useLocalStorage writes (JSON string) */}
          <pre className="ls-pre ls-pre-scroll">{JSON.stringify(todos)}</pre>
        </div>
        <Button variant="secondary" icon={<RotateCw size={14} />} onClick={() => window.location.reload()}>
          Reload page - your todos stay
        </Button>
      </div>
    </div>
  );
}
