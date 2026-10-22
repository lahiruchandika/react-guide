/**
 * UseContextPage - the "useContext" lesson.
 *
 * Folder layout (a typical feature folder):
 *   context/      UserContext.jsx, CartContext.jsx   (provider + custom hook each)
 *   components/   UserAvatar, CartBadge, ProductCard (small consumers)
 *   examples/     one file per live demo below
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout, CodeBlock } from '@/components/ui';

import PropDrillingVsContextExample from './examples/PropDrillingVsContextExample';
import propDrillingSource from './examples/PropDrillingVsContextExample.jsx?raw';
import UpdateFromChildExample from './examples/UpdateFromChildExample';
import updateFromChildSource from './examples/UpdateFromChildExample.jsx?raw';
import MultipleContextsExample from './examples/MultipleContextsExample';
import multipleContextsSource from './examples/MultipleContextsExample.jsx?raw';
import AppThemeExample from './examples/AppThemeExample';
import appThemeSource from './examples/AppThemeExample.jsx?raw';

// The context files themselves are shown in the first section
import userContextSource from './context/UserContext.jsx?raw';
import cartContextSource from './context/CartContext.jsx?raw';
import './UseContextPage.css';

export default function UseContextPage() {
  return (
    <ConceptPage
      topicId="use-context"
      intro={
        <p>
          Normally data flows down through <strong>props</strong>, one level at a time. When many components at
          different depths need the same data (the logged-in user, the theme, the cart), passing it through every
          level becomes painful - this is called <em>prop drilling</em>. <code>useContext</code> lets a component
          read a value from the nearest <strong>Provider</strong> above it, at any depth, with no props in between.
        </p>
      }
      keyPoints={[
        'createContext() creates the context; a Provider supplies its value to the whole subtree.',
        'useContext(MyContext) reads the value from the NEAREST provider above the component.',
        'When the provider value changes, every component that consumes it re-renders.',
        'Share functions in the value (login, addItem) so children can update the context.',
        'Wrap useContext in a custom hook (useUser) and throw a clear error when the provider is missing.',
        'React 19: render <MyContext value={...}> directly; <MyContext.Provider> still works.',
      ]}
      syntax={`// 1. create (in its own file)
const UserContext = createContext(null);

// 2. provide (near the top of the tree)
<UserContext value={{ user, setUser }}>
  <App />
</UserContext>

// 3. consume (in any child, at any depth)
const { user } = useContext(UserContext);`}
    >
      <Example
        title="0. The context files"
        description="Each context lives in its own file inside context/ and exports a Provider + a custom hook. All demos below use these two files."
      >
        <div className="grid-2 ctx-sources">
          <CodeBlock code={userContextSource} fileName="context/UserContext.jsx" />
          <CodeBlock code={cartContextSource} fileName="context/CartContext.jsx" />
        </div>
      </Example>

      <Example
        title="1. Prop drilling vs Context"
        description="Same component tree, two approaches. Click 'Switch user' on each side and compare which components had to know about `user`."
        code={propDrillingSource}
        fileName="examples/PropDrillingVsContextExample.jsx"
      >
        <PropDrillingVsContextExample />
      </Example>

      <Example
        title="2. Updating context from a deep child"
        description="A form nested inside Settings calls updateUser() and logout() from the context. The header (a sibling) updates instantly."
        code={updateFromChildSource}
        fileName="examples/UpdateFromChildExample.jsx"
      >
        <UpdateFromChildExample />
      </Example>

      <Example
        title="3. Multiple contexts: user + cart"
        description="Two independent providers nested together. Add products and watch the render counters: only cart consumers re-render."
        code={multipleContextsSource}
        fileName="examples/MultipleContextsExample.jsx"
      >
        <MultipleContextsExample />
      </Example>

      <Example
        title="4. The app-wide ThemeContext"
        description="This guide's own theme lives in src/context/ThemeContext.jsx. This demo reads it with useTheme() - the same hook the header button uses."
        code={appThemeSource}
        fileName="examples/AppThemeExample.jsx"
      >
        <AppThemeExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li>
            Calling <code>useContext</code> in a component that is <strong>not inside</strong> the provider - you get
            the default value (often <code>null</code>). The custom hook's error message catches this early.
          </li>
          <li>
            Creating a new value object on every render (<code>{'value={{ user, setUser }}'}</code> in a component that
            re-renders often) re-renders all consumers. Wrap it in <code>useMemo</code>, as the context files do.
          </li>
          <li>
            Putting everything in one giant context. Split by concern (user, cart, theme) so an update in one
            doesn't re-render consumers of the others.
          </li>
          <li>Mutating the value (<code>user.name = 'x'</code>) instead of calling a setter - React won't re-render.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Use context for data that many components at <strong>different depths</strong> need: auth user, theme,
        language, cart, feature flags. For data used by a parent and its direct child, plain props are simpler and
        more explicit. For complex update logic, combine context with <code>useReducer</code>. You can also nest the
        same provider again lower in the tree to <strong>override</strong> its value for one section.
      </Callout>
    </ConceptPage>
  );
}
