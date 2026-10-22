/**
 * AppLayout - the frame around every page: Sidebar + Header + main content.
 *
 * <Outlet /> is where React Router renders the matched child route
 * (HomePage, a lesson page, or NotFoundPage).
 *
 * <Suspense> shows a spinner while a lazily-loaded lesson chunk downloads.
 */
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Spinner from '@/components/ui/Spinner';
import './AppLayout.css';

export default function AppLayout() {
  // Mobile only: is the sidebar drawer open?
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // When the URL changes: close the mobile drawer and scroll back to the top.
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content">
          <Suspense
            fallback={
              <div className="page-loading">
                <Spinner size={32} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
