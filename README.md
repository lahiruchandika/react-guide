# React Guide

An interactive React learning project. Every core React concept has its own lesson page with:

- **Live demos** you can click, type into and break on purpose.
- **The real source code** of each demo (the **Code** tab shows the exact file you can open in VS Code).
- **Comments everywhere**: every file starts with a header comment explaining what it demonstrates, and important lines are explained inline.
- **Key points, syntax cheat-sheet, common mistakes and "when to use"** notes on every page.

Built with **React 19**, **Vite 6** and **React Router 7** in plain JavaScript (JSX). There is no TypeScript and no CSS framework, so you only have to read React code.

**Live demo:** https://lahiruchandika.github.io/react-guide/

The best way to use it: run the app, open a lesson in the browser, and open the same lesson folder in VS Code side by side.

---

## How to run

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install       # install dependencies (first time only)
npm run dev       # start the dev server -> http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

> In development, React's `<StrictMode>` runs effects twice on mount (mount → cleanup → mount). Several lessons show this in their logs on purpose.

---

## Recommended learning order

Follow the lessons top to bottom. The sidebar and the **Previous / Next** buttons at the bottom of each page use the same order.

| # | Lesson | Level | URL | Folder |
|---|--------|-------|-----|--------|
| **Fundamentals** |||||
| 1 | Components & JSX | Beginner | `/fundamentals/components-jsx` | `src/features/fundamentals/components-jsx/` |
| 2 | Props & Children | Beginner | `/fundamentals/props` | `src/features/fundamentals/props/` |
| 3 | Events & Forms | Beginner | `/fundamentals/events-forms` | `src/features/fundamentals/events-forms/` |
| 4 | Conditional Rendering | Beginner | `/fundamentals/conditional-rendering` | `src/features/fundamentals/conditional-rendering/` |
| 5 | Lists & Keys | Beginner | `/fundamentals/lists-keys` | `src/features/fundamentals/lists-keys/` |
| 6 | Component Communication | Intermediate | `/fundamentals/component-communication` | `src/features/fundamentals/component-communication/` |
| **Hooks** |||||
| 7 | useState | Beginner | `/hooks/use-state` | `src/features/hooks/use-state/` |
| 8 | useEffect | Intermediate | `/hooks/use-effect` | `src/features/hooks/use-effect/` |
| 9 | useRef | Intermediate | `/hooks/use-ref` | `src/features/hooks/use-ref/` |
| 10 | useMemo | Intermediate | `/hooks/use-memo` | `src/features/hooks/use-memo/` |
| 11 | useCallback & memo | Intermediate | `/hooks/use-callback` | `src/features/hooks/use-callback/` |
| 12 | useReducer | Intermediate | `/hooks/use-reducer` | `src/features/hooks/use-reducer/` |
| 13 | useContext | Intermediate | `/hooks/use-context` | `src/features/hooks/use-context/` |
| 14 | useLayoutEffect | Advanced | `/hooks/use-layout-effect` | `src/features/hooks/use-layout-effect/` |
| 15 | useId | Beginner | `/hooks/use-id` | `src/features/hooks/use-id/` |
| 16 | useTransition & useDeferredValue | Advanced | `/hooks/use-transition` | `src/features/hooks/use-transition/` |
| 17 | Custom Hooks | Intermediate | `/hooks/custom-hooks` | `src/features/hooks/custom-hooks/` |
| **Patterns & Advanced** |||||
| 18 | Local Storage | Beginner | `/patterns/local-storage` | `src/features/patterns/local-storage/` |
| 19 | Data Fetching | Intermediate | `/patterns/data-fetching` | `src/features/patterns/data-fetching/` |
| 20 | Refs as Props (and useImperativeHandle) | Intermediate | `/patterns/refs-forwarding` | `src/features/patterns/refs-forwarding/` |
| 21 | Portals & Modals | Intermediate | `/patterns/portals` | `src/features/patterns/portals/` |
| 22 | Lazy Loading & Suspense | Advanced | `/patterns/lazy-suspense` | `src/features/patterns/lazy-suspense/` |
| 23 | Error Boundaries | Advanced | `/patterns/error-boundaries` | `src/features/patterns/error-boundaries/` |
| 24 | React Router | Intermediate | `/patterns/react-router` | `src/features/patterns/react-router/` |

**Suggested path for a total beginner:** do lessons 1–7 first, then build something small, such as a todo list using `useState` and `useLocalStorage`. After that, continue with useEffect (8) and Data Fetching (19), and treat the rest as reference.

---

## Folder structure

The project uses a **feature-based** structure, which is common in industry. Shared, reusable pieces live in top-level folders. Everything that belongs to one lesson (one "feature") lives together in that lesson's folder.

```text
react-guide/
├── index.html                  # The single HTML page; Vite injects the app into <div id="root">
├── package.json                # Dependencies and npm scripts (dev / build / preview)
├── vite.config.js              # Vite config: React plugin + the "@" -> src/ import alias
├── jsconfig.json               # Tells VS Code about the "@/..." alias (Ctrl+Click works)
├── .prettierrc                 # Code formatting rules (Prettier)
├── .vscode/extensions.json     # Recommended VS Code extensions
├── public/                     # Static files served as-is (favicon)
└── src/
    ├── main.jsx                # ENTRY POINT: createRoot(...).render(<StrictMode><App/></StrictMode>)
    │
    ├── app/                    # App-level wiring (runs once, glues everything together)
    │   ├── App.jsx             #   Root component: global providers (ThemeProvider) + RouterProvider
    │   ├── router.jsx          #   Route table (createBrowserRouter): layout, home, lessons, 404
    │   └── routes.jsx          #   topicId -> lazy(() => import(page)) map: one code-split chunk per lesson
    │
    ├── components/             # SHARED components, used by many features
    │   ├── ui/                 #   Design-system primitives: Button, Card, Badge, Callout, CodeBlock,
    │   │                       #   Input, RenderCounter, Spinner. index.js re-exports them all:
    │   │                       #   import { Button, Card } from '@/components/ui';
    │   ├── layout/             #   App shell: AppLayout (sidebar + header + <Outlet/>), Header, Sidebar
    │   └── concept/            #   Lesson building blocks: ConceptPage (title, intro, key points,
    │                           #   syntax, prev/next) and Example (Demo / Code tabs)
    │
    ├── context/                # App-wide React Context providers
    │   └── ThemeContext.jsx    #   Light/dark theme: ThemeProvider + useTheme() hook
    │
    ├── hooks/                  # Reusable CUSTOM HOOKS shared across the app
    │   ├── index.js            #   One import point: import { useToggle } from '@/hooks';
    │   ├── useLocalStorage.js  #   useState that persists to localStorage
    │   ├── useToggle.js        #   boolean on/off helper
    │   ├── useDebounce.js      #   delay a fast-changing value
    │   ├── useFetch.js         #   data + loading + error + refetch, with AbortController
    │   ├── useWindowSize.js    #   current window width/height (resize listener)
    │   └── useOnlineStatus.js  #   online/offline via useSyncExternalStore
    │
    ├── services/               # Talking to the outside world (APIs). No React code in here.
    │   └── mockApi.js          #   Fake backend (users, products, posts) with delays, errors, abort
    │
    ├── data/                   # Static app data / configuration
    │   └── topics.js           #   The list of lessons: drives the sidebar, home page and routes
    │
    ├── pages/                  # Route-level pages that are NOT lessons
    │   ├── HomePage.jsx        #   "/": overview cards for every lesson
    │   ├── TopicRoute.jsx      #   "/:group/:topicId": looks up the lesson and renders it lazily
    │   └── NotFoundPage.jsx    #   404 page
    │
    ├── features/               # ONE FOLDER PER LESSON, grouped like the sidebar
    │   ├── fundamentals/
    │   ├── hooks/
    │   └── patterns/
    │       └── <topic-id>/                 # e.g. hooks/use-state/
    │           ├── <Name>Page.jsx          #   The lesson page (ConceptPage + several <Example>s)
    │           ├── <Name>Page.css          #   Lesson-only styles; classes use a short prefix (us-, ue-...)
    │           ├── examples/               #   One file per live demo: what you see in the "Code" tab
    │           │   └── <Something>Example.jsx
    │           ├── components/             #   Small child components used by the demos
    │           └── (optional) data/, utils/, hooks/, context/, reducers/, api/
    │                                       #   Lesson-local helpers, kept next to the code that uses them
    │
    └── styles/                 # Global CSS
        ├── variables.css       #   Design tokens (colors, spacing, radius, shadows) + dark theme overrides
        └── global.css          #   Reset, base typography and utility classes (.row .stack .grid-2 ...)
```

### Why it is organised this way

- **Colocation.** Everything about one feature is in one folder, so you can learn (or delete) a lesson without searching the whole project.
- **Shared vs local.** If code is used in only one place, it stays in that feature's folder. Once two or more features need it, it moves up to `components/`, `hooks/` or `services/`.
- **Separation of concerns.** UI primitives (`components/ui`), app shell (`components/layout`), state shared app-wide (`context/`), logic (`hooks/`) and data access (`services/`) are kept apart.
- **Naming conventions:**
  - Components use `PascalCase.jsx`.
  - Hooks use `useSomething.js`.
  - Plain helpers use `camelCase.js`.
  - Each CSS file sits next to its component.
- **Code splitting.** Each lesson is loaded with `React.lazy`, so the browser downloads a lesson's code only when you open it.

### How the "Code" tab shows real files

Each lesson page imports its demo twice:

```jsx
import CounterExample from './examples/CounterExample';              // the component (Demo tab)
import counterSource from './examples/CounterExample.jsx?raw';        // its source text (Code tab)
```

The `?raw` suffix is a Vite feature that imports a file's content as a string. The code you read in the browser is therefore always the same as the file on disk.

---

## How to add a new lesson

1. **Create the folder** `src/features/<group>/<topic-id>/` with an `examples/` subfolder.
2. **Write a demo** in `examples/MyDemoExample.jsx`:
   - Make it a default-exported component.
   - Start the file with a header comment.
   - Use the shared UI from `@/components/ui` and colors from `var(--color-...)`.
3. **Write the page** in `<Name>Page.jsx`:

   ```jsx
   import ConceptPage from '@/components/concept/ConceptPage';
   import Example from '@/components/concept/Example';
   import { Callout } from '@/components/ui';
   import MyDemoExample from './examples/MyDemoExample';
   import myDemoSource from './examples/MyDemoExample.jsx?raw';

   export default function MyTopicPage() {
     return (
       <ConceptPage topicId="my-topic" intro={<p>...</p>} keyPoints={['...']} syntax={`...`}>
         <Example title="1. ..." description="..." code={myDemoSource} fileName="examples/MyDemoExample.jsx">
           <MyDemoExample />
         </Example>
         <Callout type="warning" title="Common mistakes">...</Callout>
       </ConceptPage>
     );
   }
   ```

4. **Register it** in `src/data/topics.js`:

   ```js
   { id: 'my-topic', group: 'hooks', title: 'My Topic', level: 'Beginner', summary: '...' },
   ```

5. **Add the lazy route** in `src/app/routes.jsx`:

   ```js
   'my-topic': lazy(() => import('@/features/hooks/my-topic/MyTopicPage')),
   ```

6. Run `npm run dev`. The new lesson appears in the sidebar, on the home page and in the Previous/Next navigation.

---

## React concepts cheat-sheet

| Concept | One-liner |
|---------|-----------|
| Component | A function that returns JSX: `function Card() { return <div/>; }`. Name starts with a capital letter. |
| JSX | HTML-like syntax in JS; use `className`, camelCase attributes and `{expressions}`. |
| Props | Read-only inputs from the parent: `<Card title="Hi" />` → `function Card({ title })`. |
| `children` | Whatever you put between a component's tags: `<Panel>...</Panel>`. |
| Events | `onClick={handleClick}` passes the function; don't call it: `onClick={handleClick()}` is wrong. |
| Conditional rendering | `if` + early return, `cond ? <A/> : <B/>`, `cond && <A/>` (watch out for `0 &&`). |
| Lists & keys | `items.map(i => <Row key={i.id} />)`. Use a stable id as the key, not the index, for dynamic lists. |
| `useState` | `const [value, setValue] = useState(init)`: state that triggers a re-render; use `setX(prev => ...)` when the new value depends on the old one. |
| `useEffect` | `useEffect(() => { ...; return cleanup; }, [deps])`: sync with the outside world (timers, listeners, fetch). |
| `useRef` | `const ref = useRef(init)`: a mutable box (`ref.current`) that does not re-render; also points at DOM nodes. |
| `useMemo` | `useMemo(() => compute(a, b), [a, b])`: caches a calculated **value** between renders. |
| `useCallback` | `useCallback(fn, [deps])`: caches a **function** so `memo()` children / effects see the same one. |
| `memo` | `memo(Component)`: skips re-rendering when props are shallow-equal. |
| `useReducer` | `const [state, dispatch] = useReducer(reducer, init)`: state changes described as actions. |
| `useContext` | `useContext(Ctx)`: reads the value of the nearest provider, with no prop drilling. React 19: `<Ctx value={...}>`. |
| `useLayoutEffect` | Like `useEffect` but runs before the browser paints. Use it to measure the DOM without flicker. |
| `useId` | `const id = useId()`: unique, stable id for `htmlFor` / `aria-*` attributes. |
| `useTransition` | `const [isPending, startTransition] = useTransition()`: marks a state update as non-urgent. |
| `useDeferredValue` | `const deferred = useDeferredValue(value)`: a lagging copy of a value for slow renders. |
| `useImperativeHandle` | `useImperativeHandle(ref, () => ({ focus() {} }))`: exposes a custom API through a ref. |
| `useSyncExternalStore` | Subscribe to an external store (e.g. browser online status) safely. |
| `use` (React 19) | `use(promise)` / `use(Context)`: read a promise (with Suspense) or context, even conditionally. |
| Custom hook | A `useSomething` function that calls other hooks to reuse **logic** (not state). |
| Refs as props (React 19) | `function Input({ ref })`: `forwardRef` is no longer needed. |
| Portals | `createPortal(children, document.body)`: render outside the parent DOM node (modals, toasts). |
| `lazy` + `Suspense` | `lazy(() => import('./X'))` + `<Suspense fallback={...}>`: code splitting with a loading UI. |
| Error boundary | A class component with `getDerivedStateFromError` that shows a fallback instead of crashing. |
| localStorage | `localStorage.setItem(k, JSON.stringify(v))` / `JSON.parse(getItem(k))`, wrapped up in the `useLocalStorage` hook. |
| Rules of hooks | Only call hooks at the top level of components or custom hooks: never inside `if`, loops or callbacks. |
| StrictMode | Dev-only double render / double effect to surface missing cleanups. |

---

## Recommended VS Code setup

When you open the folder, VS Code suggests the extensions listed in `.vscode/extensions.json`:

- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`): type `rafce` to scaffold a component.
- **Prettier** (`esbenp.prettier-vscode`): formats code using `.prettierrc`.

Tip: hold **Ctrl** and click any `@/...` import to jump to that file.

## License

This project is licensed under the [MIT License](LICENSE) © 2026 Lahiru Chandika.
