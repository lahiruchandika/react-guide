/**
 * ComponentsJsxPage.jsx
 * ----------------------------------------------------------------------------
 * Lesson: Components & JSX
 *
 * Folder layout of this lesson (open them in VS Code!):
 *   components-jsx/
 *   ├── ComponentsJsxPage.jsx      <- this page (text + examples)
 *   ├── ComponentsJsxPage.css      <- styles used only by this lesson ("cj-" prefix)
 *   ├── examples/                  <- one file per live demo
 *   └── components/                <- small components used by the ProfileCard demo
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import './ComponentsJsxPage.css';

// Live demos
import FirstComponentExample from './examples/FirstComponentExample';
import JsxRulesExample from './examples/JsxRulesExample';
import ExpressionsExample from './examples/ExpressionsExample';
import ComposingExample from './examples/ComposingExample';

// The same files imported as plain text (Vite "?raw") for the Code tab
import firstSource from './examples/FirstComponentExample.jsx?raw';
import rulesSource from './examples/JsxRulesExample.jsx?raw';
import expressionsSource from './examples/ExpressionsExample.jsx?raw';
import composingSource from './examples/ComposingExample.jsx?raw';
import profileCardSource from './components/ProfileCard.jsx?raw';
import avatarSource from './components/Avatar.jsx?raw';
import userInfoSource from './components/UserInfo.jsx?raw';
import statsSource from './components/ProfileStats.jsx?raw';

// Join several files into one string so the Code tab shows the whole picture.
const composingAllFiles = [
  ['examples/ComposingExample.jsx', composingSource],
  ['components/ProfileCard.jsx', profileCardSource],
  ['components/Avatar.jsx', avatarSource],
  ['components/UserInfo.jsx', userInfoSource],
  ['components/ProfileStats.jsx', statsSource],
]
  .map(([file, src]) => `// ======================= ${file} =======================\n${src.trim()}`)
  .join('\n\n');

export default function ComponentsJsxPage() {
  return (
    <ConceptPage
      topicId="components-jsx"
      intro={
        <>
          <p>
            A React app is a tree of <strong>components</strong>. A component is simply a JavaScript function
            that returns <strong>JSX</strong> - a syntax that looks like HTML but lives inside JavaScript.
            Vite compiles JSX into normal function calls, so <code>{'<h1>Hi</h1>'}</code> becomes{' '}
            <code>{"jsx('h1', { children: 'Hi' })"}</code>.
          </p>
          <p>
            You build big screens by <strong>composing</strong> small components, the same way you build
            something big out of LEGO bricks.
          </p>
        </>
      }
      keyPoints={[
        'A component is a function that returns JSX.',
        'Component names start with a Capital letter: <Welcome />.',
        'JSX must return ONE parent element - use a Fragment <>...</> when you need no wrapper.',
        'Use className, camelCase attributes, and close every tag (<img />).',
        '{ } inside JSX runs any JavaScript expression (variables, math, function calls, ternaries).',
        'Put one component per file and compose bigger components from smaller ones.',
      ]}
      syntax={`// Greeting.jsx
export default function Greeting() {
  const name = 'Ada';
  return (
    <>
      <h1 className="title">Hello, {name}!</h1>
      <img src="/logo.png" alt="logo" />
    </>
  );
}

// App.jsx
import Greeting from './Greeting';
<Greeting />`}
    >
      <Example
        title="1. Your first component"
        description="A component is a function that returns JSX. Write it once, render it anywhere - as many times as you like."
        code={firstSource}
        fileName="examples/FirstComponentExample.jsx"
      >
        <FirstComponentExample />
      </Example>

      <Example
        title="2. The rules of JSX"
        description="Pick a rule to compare the broken version with the correct one and see the live result."
        code={rulesSource}
        fileName="examples/JsxRulesExample.jsx"
      >
        <JsxRulesExample />
      </Example>

      <Example
        title="3. JavaScript inside JSX with { }"
        description="Curly braces let you drop any JavaScript expression into your markup. Type to see every expression re-evaluate."
        code={expressionsSource}
        fileName="examples/ExpressionsExample.jsx"
      >
        <ExpressionsExample />
      </Example>

      <Example
        title="4. Splitting & composing components"
        description="A ProfileCard built from Avatar, UserInfo and ProfileStats - each in its own file under components/."
        code={composingAllFiles}
        fileName="examples/ComposingExample.jsx + components/*.jsx"
      >
        <ComposingExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Lower-case component names: <code>{'<profileCard />'}</code> is treated as an unknown HTML tag.
          </li>
          <li>
            Returning two sibling elements without a wrapper or Fragment - JSX needs a single root.
          </li>
          <li>
            Writing <code>if</code> or <code>for</code> inside <code>{'{ }'}</code>. Use a ternary,{' '}
            <code>&&</code> or <code>.map()</code>, or compute the value above the <code>return</code>.
          </li>
          <li>
            Defining a component <em>inside</em> another component. It gets re-created on every render and
            loses its state - always define components at the top level of a file.
          </li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to split into a new component">
        Split when a piece of UI is <strong>repeated</strong>, has its <strong>own responsibility</strong>{' '}
        (avatar, price tag, search bar), or the file is getting hard to read. A good rule of thumb: if you
        can give it a clear name, it can be its own component.
      </Callout>
    </ConceptPage>
  );
}
