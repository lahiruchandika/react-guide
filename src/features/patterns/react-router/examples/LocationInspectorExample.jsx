/**
 * LocationInspectorExample - how THIS app is routed, and reading the URL.
 * ----------------------------------------------------------------------------
 * src/app/router.jsx defines the app's routes with createBrowserRouter:
 *
 *   /                        -> <AppLayout>  (sidebar + header + <Outlet />)
 *     index                  -> <HomePage />
 *     :group/:topicId/*      -> <TopicRoute />  (picks the lesson page)
 *     *                      -> <NotFoundPage />
 *
 * For the URL /patterns/react-router the dynamic segments become:
 *   useParams() -> { group: 'patterns', topicId: 'react-router', '*': '' }
 *
 * useLocation() returns the full current location:
 *   pathname, search (?query), hash (#anchor), state (hidden data), key
 *
 * Click the links below and watch every value update live.
 * ----------------------------------------------------------------------------
 */
import { Link, useLocation, useParams } from 'react-router-dom';
import { LESSON_BASE } from '../constants';
import AddressBar from '../components/AddressBar';

export default function LocationInspectorExample() {
  const location = useLocation(); // 1. the current URL as an object
  const params = useParams(); // 2. dynamic segments matched by the route

  const rows = [
    ['location.pathname', location.pathname],
    ['location.search', location.search || '""'],
    ['location.hash', location.hash || '""'],
    ['location.state', JSON.stringify(location.state)],
    ['location.key', location.key],
    ['useParams()', JSON.stringify(params)],
  ];

  return (
    <div className="stack">
      <AddressBar />

      <div className="rr-chips">
        {/* 3. Links that change different parts of the URL */}
        <Link className="rr-chip" to={LESSON_BASE}>Lesson root</Link>
        <Link className="rr-chip" to={`${LESSON_BASE}?view=grid&page=2`}>?view=grid&amp;page=2</Link>
        <Link className="rr-chip" to={`${LESSON_BASE}#notes`}>#notes</Link>
        <Link className="rr-chip" to={`${LESSON_BASE}/users/2`}>/users/2</Link>
        {/* `state` travels with the navigation but is NOT visible in the URL */}
        <Link className="rr-chip" to={`${LESSON_BASE}/about`} state={{ from: 'inspector', at: new Date().toLocaleTimeString() }}>
          /about + state
        </Link>
      </div>

      <table className="rr-table">
        <tbody>
          {rows.map(([name, value]) => (
            <tr key={name}>
              <th><code>{name}</code></th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
