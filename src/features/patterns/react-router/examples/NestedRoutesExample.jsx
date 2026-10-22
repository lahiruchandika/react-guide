/**
 * NestedRoutesExample - a mini app with its OWN routes inside this lesson.
 * ----------------------------------------------------------------------------
 * The app's router matches this lesson with ':group/:topicId/*'. The "/*"
 * means "and anything after it". Any <Routes> rendered inside the lesson then
 * matches the REST of the URL (relative to /patterns/react-router):
 *
 *   <Routes>
 *     <Route index element={<MiniHome />} />                  /patterns/react-router
 *     <Route path="users" element={<UsersLayout />}>          .../users  (layout + <Outlet/>)
 *       <Route index element={<UsersIndex />} />              .../users
 *       <Route path=":userId" element={<UserDetail />} />     .../users/3
 *     </Route>
 *     <Route path="about" element={<MiniAbout />} />          .../about
 *     <Route path="*" element={<MiniNotFound />} />           anything else
 *   </Routes>
 *
 * Route paths inside <Routes> are RELATIVE (no leading "/").
 * Nested <Route> elements + <Outlet /> = nested layouts.
 * ----------------------------------------------------------------------------
 */
import { NavLink, Route, Routes } from 'react-router-dom';
import { LESSON_BASE } from '../constants';
import AddressBar from '../components/AddressBar';
import UsersLayout from '../components/mini-app/UsersLayout';
import UserDetail from '../components/mini-app/UserDetail';
import { MiniAbout, MiniHome, MiniNotFound, UsersIndex } from '../components/mini-app/MiniPages';

const TABS = [
  { to: LESSON_BASE, label: 'Home', end: true },
  { to: `${LESSON_BASE}/users`, label: 'Users' },
  { to: `${LESSON_BASE}/about`, label: 'About' },
  { to: `${LESSON_BASE}/does-not-exist`, label: 'Broken link' },
];

export default function NestedRoutesExample() {
  return (
    <div className="rr-browser">
      <AddressBar />

      {/* Mini app navigation */}
      <nav className="rr-tabs">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {tab.label}
          </NavLink>
        ))}
      </nav>

      {/* The route table - matched against the URL AFTER /patterns/react-router */}
      <div className="rr-viewport">
        <Routes>
          <Route index element={<MiniHome />} />
          <Route path="users" element={<UsersLayout />}>
            <Route index element={<UsersIndex />} />
            <Route path=":userId" element={<UserDetail />} />
          </Route>
          <Route path="about" element={<MiniAbout />} />
          <Route path="*" element={<MiniNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
