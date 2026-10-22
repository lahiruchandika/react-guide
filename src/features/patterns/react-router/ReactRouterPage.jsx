/**
 * ReactRouterPage - lesson: client-side routing with React Router v7.
 * ----------------------------------------------------------------------------
 * Folder layout of this lesson:
 *   ReactRouterPage.jsx / .css       this page
 *   examples/                        one file per live demo (shown in the Code tab)
 *   components/AddressBar.jsx        fake browser bar showing useLocation()
 *   components/mini-app/             pages of the nested-routes mini app
 *   hooks/usePreserveScroll.js       keeps your scroll position on nested navigation
 *   data/users.js                    mock users + products
 *   constants.js                     LESSON_BASE = '/patterns/react-router'
 *
 * The app's real router lives in src/app/router.jsx (shown in example 1).
 * ----------------------------------------------------------------------------
 */
import ConceptPage from '@/components/concept/ConceptPage';
import Example from '@/components/concept/Example';
import { Callout } from '@/components/ui';
import { usePreserveScroll } from './hooks/usePreserveScroll';
import './ReactRouterPage.css';

import LocationInspectorExample from './examples/LocationInspectorExample';
import inspectorSource from './examples/LocationInspectorExample.jsx?raw';
import appRouterSource from '@/app/router.jsx?raw';
import LinkVsNavLinkExample from './examples/LinkVsNavLinkExample';
import linkSource from './examples/LinkVsNavLinkExample.jsx?raw';
import UseNavigateExample from './examples/UseNavigateExample';
import navigateSource from './examples/UseNavigateExample.jsx?raw';
import SearchParamsExample from './examples/SearchParamsExample';
import searchSource from './examples/SearchParamsExample.jsx?raw';
import NestedRoutesExample from './examples/NestedRoutesExample';
import nestedSource from './examples/NestedRoutesExample.jsx?raw';
import usersLayoutSource from './components/mini-app/UsersLayout.jsx?raw';
import userDetailSource from './components/mini-app/UserDetail.jsx?raw';

const combine = (...parts) =>
  parts.map(([name, src]) => `// ===================== ${name} =====================\n\n${src.trim()}`).join('\n\n\n');

export default function ReactRouterPage() {
  // The demos change the URL; don't jump to the top of the page each time
  usePreserveScroll();

  return (
    <ConceptPage
      topicId="react-router"
      intro={
        <p>
          A React app is usually a <strong>single HTML page</strong>. <strong>React Router</strong> makes it feel like a
          multi-page website: it reads the URL, decides which components to show, and changes the URL{' '}
          <strong>without reloading</strong> the page when the user clicks a link. Every lesson in this guide is a route -
          look at the address bar as you use the demos below. We use <code>react-router-dom</code> v7 (in v7 everything
          is also exported from <code>react-router</code>).
        </p>
      }
      keyPoints={[
        'createBrowserRouter + <RouterProvider> define the app routes (src/app/router.jsx)',
        '<Link> navigates without a reload; <NavLink> also knows if it is active',
        'useNavigate() navigates from code: after submit, login, timers...',
        'useParams() reads dynamic segments like :userId - always as strings',
        'useSearchParams() reads/writes the ?query string - great for filters',
        'Nested <Route>s + <Outlet /> build shared layouts; useLocation() gives the full URL',
      ]}
      syntax={`import { createBrowserRouter, RouterProvider, Link,
  useParams, useNavigate, useSearchParams } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Layout />, children: [
    { index: true, element: <Home /> },
    { path: 'users/:userId', element: <UserDetail /> },
  ]},
]);
<RouterProvider router={router} />

<Link to="/users/2">Ava</Link>
const { userId } = useParams();          // "2"
const navigate = useNavigate();  navigate('/');
const [params, setParams] = useSearchParams();`}
    >
      <Example
        title="1. How this app is routed + useLocation / useParams"
        description="Click the links and watch the live location object and params. The Code tab also shows the app's real src/app/router.jsx."
        code={combine(['examples/LocationInspectorExample.jsx', inspectorSource], ['src/app/router.jsx', appRouterSource])}
        fileName="examples/LocationInspectorExample.jsx + src/app/router.jsx"
      >
        <LocationInspectorExample />
      </Example>

      <Example
        title="2. <a> vs <Link> vs <NavLink>"
        description="Increase the ❤️ counter, then navigate with each kind of link. Only <a> reloads the page and loses state."
        code={linkSource}
        fileName="examples/LinkVsNavLinkExample.jsx"
      >
        <LinkVsNavLinkExample />
      </Example>

      <Example
        title="3. useNavigate: navigate from code"
        description="Submit the form, try Back/Forward, or 'log in' to be redirected with replace + state."
        code={navigateSource}
        fileName="examples/UseNavigateExample.jsx"
      >
        <UseNavigateExample />
      </Example>

      <Example
        title="4. useSearchParams: filters stored in the URL"
        description="Search, pick a category, sort. The filters live in the query string, so they survive refresh and can be shared."
        code={searchSource}
        fileName="examples/SearchParamsExample.jsx"
      >
        <SearchParamsExample />
      </Example>

      <Example
        title="5. Nested routes, <Outlet /> and useParams"
        description="A mini app with its own <Routes> inside this lesson: users list → user detail at users/:userId."
        code={combine(
          ['examples/NestedRoutesExample.jsx', nestedSource],
          ['components/mini-app/UsersLayout.jsx', usersLayoutSource],
          ['components/mini-app/UserDetail.jsx', userDetailSource],
        )}
        fileName="examples/NestedRoutesExample.jsx + components/mini-app/*"
      >
        <NestedRoutesExample />
      </Example>

      <Callout type="warning" title="Common mistakes">
        <ul>
          <li><strong>Using <code>&lt;a href&gt;</code> for internal links</strong> - it reloads the whole app. Use <code>&lt;Link to&gt;</code>.</li>
          <li><strong>Comparing params as numbers</strong>: <code>useParams().userId</code> is the string <code>&quot;3&quot;</code>. Convert with <code>Number()</code>.</li>
          <li><strong>Calling <code>navigate()</code> during render</strong> - call it in event handlers or effects (or render <code>&lt;Navigate to=&quot;...&quot; /&gt;</code>).</li>
          <li><strong>Forgetting <code>end</code></strong> on a NavLink to <code>/</code> - it would look active on every page.</li>
          <li><strong>Copying search params into useState</strong> - the two get out of sync. Read them straight from the URL.</li>
          <li><strong>Missing <code>/*</code></strong> on a parent route whose component renders its own <code>&lt;Routes&gt;</code>.</li>
          <li><strong>Hosting problems</strong>: refreshing <code>/users/2</code> on a static host returns 404 unless the server falls back to <code>index.html</code>.</li>
        </ul>
      </Callout>

      <Callout type="tip" title="When to use">
        Any app with more than one &quot;screen&quot;: pages, detail views (<code>/products/:id</code>), tabs and filters
        you want to bookmark or share (<code>?tab=settings</code>), and layouts shared by several pages (dashboard
        sidebar + <code>&lt;Outlet /&gt;</code>). React Router v7 also offers loaders, actions and a framework mode for
        data loading - worth exploring next.
      </Callout>
    </ConceptPage>
  );
}
