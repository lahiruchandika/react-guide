/**
 * router.jsx
 * ----------------------------------------------------------------------------
 * Application routing with React Router (data router API).
 *
 *   /                         -> HomePage (overview of all lessons)
 *   /:group/:topicId          -> TopicRoute (loads the lesson page lazily)
 *   /patterns/react-router/*  -> nested routes used by the React Router lesson
 *   *                         -> NotFoundPage (404)
 * ----------------------------------------------------------------------------
 */
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import TopicRoute from '@/pages/TopicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // shared layout: sidebar + header + <Outlet />
    children: [
      { index: true, element: <HomePage /> },
      // The trailing "/*" lets a lesson (React Router) define its own nested routes.
      { path: ':group/:topicId/*', element: <TopicRoute /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
