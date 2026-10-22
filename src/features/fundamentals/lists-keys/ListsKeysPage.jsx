/**
 * ListsKeysPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: Lists & Keys - rendering arrays with map(), filtering/sorting them,
 * and understanding the `key` prop.
 *
 * Folder layout of this lesson:
 *   data/products.js            mock data (an array of objects)
 *   components/ProductCard.jsx  presentational card used in the product list
 *   components/TodoItem.jsx     an extracted list-item component
 *   examples/*.jsx              one file per live demo
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';

import BasicListExample from './examples/BasicListExample';
import basicListSource from './examples/BasicListExample.jsx?raw';
import ProductFilterExample from './examples/ProductFilterExample';
import productFilterSource from './examples/ProductFilterExample.jsx?raw';
import productCardSource from './components/ProductCard.jsx?raw';
import KeyBugExample from './examples/KeyBugExample';
import keyBugSource from './examples/KeyBugExample.jsx?raw';
import ExtractItemExample from './examples/ExtractItemExample';
import extractItemSource from './examples/ExtractItemExample.jsx?raw';
import todoItemSource from './components/TodoItem.jsx?raw';

import './ListsKeysPage.css';

/** Join several source files into one string for the "Code" tab. */
const withFiles = (...files) =>
  files.map(([name, src]) => `// ${'='.repeat(70)}\n// FILE: ${name}\n// ${'='.repeat(70)}\n${src}`).join('\n\n');

export default function ListsKeysPage() {
  return (
    <ConceptPage
      topicId="lists-keys"
      intro={
        <p>
          Most UIs are lists: products, messages, todos, search results. In React you keep the data in an{' '}
          <strong>array</strong> and turn it into elements with <code>array.map()</code>. Each element needs a{' '}
          <code>key</code> - a unique, stable identifier that helps React match items between renders so it can update,
          move or remove only what changed.
        </p>
      }
      keyPoints={[
        'Use array.map() to turn data into JSX elements.',
        'Every item returned from map() needs a unique key prop.',
        'Use a stable id from your data as the key - not Math.random().',
        'Index as key breaks state when items are added, removed or reordered.',
        'Filter and sort during render; keep only the inputs (search, sort) in state.',
        'Put the key on the component in map(), not inside the child component.',
      ]}
      syntax={`{products.map((product) => (
  <ProductCard key={product.id} product={product} />
))}

// filter + sort before rendering (sort a copy!)
const visible = [...products]
  .filter((p) => p.name.includes(query))
  .sort((a, b) => a.price - b.price);`}
    >
      <Example
        title="1. Rendering arrays with map()"
        description="An array of strings and an array of objects, each turned into a list of elements with a key."
        code={basicListSource}
        fileName="examples/BasicListExample.jsx"
      >
        <BasicListExample />
      </Example>

      <Example
        title="2. Search, filter & sort a product list"
        description="Type a search, pick a category and change the sort order. The visible list is derived from state on every render."
        code={withFiles(
          ['examples/ProductFilterExample.jsx', productFilterSource],
          ['components/ProductCard.jsx', productCardSource],
        )}
        fileName="ProductFilterExample.jsx + ProductCard.jsx"
      >
        <ProductFilterExample />
      </Example>

      <Example
        title="3. Why index keys break (live bug)"
        description="Tick a checkbox or edit a note, then click “Add to top” or “Reverse”. On the left the notes stay in place while the names move!"
        code={keyBugSource}
        fileName="examples/KeyBugExample.jsx"
      >
        <KeyBugExample />
      </Example>

      <Callout type="info" title="What just happened?">
        With <code>key=&#123;index&#125;</code>, after adding “Dates” to the top React sees keys 0, 1, 2, 3. It thinks
        key 0 still is the same row as before, so it keeps that row&apos;s input text and checkbox and only updates the
        label. A brand-new row is created at the end (key 3). With <code>key=&#123;item.id&#125;</code> React sees a new
        key at the top and simply inserts one row - every existing row keeps its own state.
      </Callout>

      <Example
        title="4. Extracting a list item component"
        description="A todo list where each row is its own <TodoItem> component with local edit state. Add, toggle, double-click to rename, delete."
        code={withFiles(['examples/ExtractItemExample.jsx', extractItemSource], ['components/TodoItem.jsx', todoItemSource])}
        fileName="ExtractItemExample.jsx + TodoItem.jsx"
      >
        <ExtractItemExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>Forgetting the key → React warns “Each child in a list should have a unique key prop”.</li>
          <li>
            <code>key=&#123;Math.random()&#125;</code> → a new key every render, so every item is destroyed and re-created
            (slow, and inputs lose focus).
          </li>
          <li>Using the array index as key for lists that can be reordered, filtered or have items inserted.</li>
          <li>
            Mutating state: <code>todos.push(x)</code> or <code>products.sort()</code> on the state array. Always create a
            new array.
          </li>
          <li>Putting the key inside the child (on its &lt;li&gt;) instead of on the component in map().</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When is index as key OK?">
        Only when the list is static: never reordered, filtered, or added to in the middle, and items have no state
        (e.g. a fixed list of footer links). If your data has an id, use it.
      </Callout>
    </ConceptPage>
  );
}
