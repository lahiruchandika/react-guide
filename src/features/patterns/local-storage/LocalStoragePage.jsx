/**
 * LocalStoragePage - lesson: saving data in the browser so it survives a refresh.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   LocalStoragePage.jsx / .css  this page
 *   examples/                    one file per live demo (shown in the Code tab)
 *   components/                  StorageViewer, TodoItem (used by the demos)
 *
 * The reusable hook used here: src/hooks/useLocalStorage.js
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './LocalStoragePage.css';

import RawStorageExample from './examples/RawStorageExample';
import rawSource from './examples/RawStorageExample.jsx?raw';
import JsonObjectsExample from './examples/JsonObjectsExample';
import jsonSource from './examples/JsonObjectsExample.jsx?raw';
import PersistentTodosExample from './examples/PersistentTodosExample';
import todosSource from './examples/PersistentTodosExample.jsx?raw';
import SettingsFormExample from './examples/SettingsFormExample';
import settingsSource from './examples/SettingsFormExample.jsx?raw';
import CrossTabSyncExample from './examples/CrossTabSyncExample';
import syncSource from './examples/CrossTabSyncExample.jsx?raw';

export default function LocalStoragePage() {
  return (
    <ConceptPage
      topicId="local-storage"
      intro={
        <p>
          React state lives in memory, so it disappears when the page reloads. The browser&apos;s{' '}
          <code>localStorage</code> is a small key/value store that <strong>keeps data forever</strong> (until it is
          deleted) for your website. Combine the two: keep data in state for rendering, and copy it to localStorage so
          it can be restored next time - the <code>useLocalStorage</code> hook does exactly that.
        </p>
      }
      keyPoints={[
        'API: setItem, getItem, removeItem, clear - all synchronous',
        'Only strings are stored: use JSON.stringify to save and JSON.parse to load',
        'Changing localStorage does NOT re-render - keep the data in state too',
        'Read once with a lazy useState initializer, write in an effect or event handler',
        "The 'storage' event tells OTHER tabs that a key changed",
        'About 5MB per site, visible to any script - never store passwords or tokens',
      ]}
      syntax={`// Plain JavaScript
localStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('user'));

// In React (src/hooks/useLocalStorage.js)
const [todos, setTodos] = useLocalStorage('todos', []);`}
    >
      <Example
        title="1. The raw localStorage API"
        description="Save, read and delete keys. The live viewer shows everything stored for this site."
        code={rawSource}
        fileName="examples/RawStorageExample.jsx"
      >
        <RawStorageExample />
      </Example>

      <Example
        title="2. Objects need JSON.stringify / JSON.parse"
        description="Save the same object with and without JSON and compare what actually gets stored."
        code={jsonSource}
        fileName="examples/JsonObjectsExample.jsx"
      >
        <JsonObjectsExample />
      </Example>

      <Example
        title="3. A todo list that survives refresh (useLocalStorage)"
        description="Swap useState for useLocalStorage and the list is remembered. Try the reload button."
        code={todosSource}
        fileName="examples/PersistentTodosExample.jsx"
      >
        <PersistentTodosExample />
      </Example>

      <Example
        title="4. Settings form with Save / Discard"
        description="Edit a draft in normal state, persist it only when the user clicks Save."
        code={settingsSource}
        fileName="examples/SettingsFormExample.jsx"
      >
        <SettingsFormExample />
      </Example>

      <Example
        title="5. Sync across tabs with the 'storage' event"
        description="Open this lesson in two tabs side by side and type in one of them."
        code={syncSource}
        fileName="examples/CrossTabSyncExample.jsx"
      >
        <CrossTabSyncExample />
      </Example>

      <Callout type="warning" title="Pitfalls">
        <ul>
          <li><strong>Strings only:</strong> numbers come back as <code>&quot;42&quot;</code>, objects as <code>&quot;[object Object]&quot;</code> unless you use JSON.</li>
          <li><strong>getItem returns null</strong> for missing keys - always provide a default value.</li>
          <li><strong>JSON.parse can throw</strong> on corrupted data - wrap it in <code>try/catch</code>.</li>
          <li><strong>~5MB limit</strong> per site; <code>setItem</code> throws <code>QuotaExceededError</code> when full. Don&apos;t store images or huge lists.</li>
          <li><strong>Not secure:</strong> any JavaScript on the page can read it. Never store passwords, credit cards or auth tokens.</li>
          <li><strong>Synchronous:</strong> big reads/writes block the page. Read once on mount, not on every render.</li>
          <li><strong>Not available on the server</strong> (SSR/Next.js) - only touch it in the browser (effects or event handlers).</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        User preferences (theme, language, layout), drafts, shopping carts for guests, recently viewed items, small
        caches. Use <code>sessionStorage</code> (same API) for data that should vanish when the tab closes, and a real
        backend for anything important or shared between devices.
      </Callout>
    </ConceptPage>
  );
}
