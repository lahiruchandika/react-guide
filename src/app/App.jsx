/**
 * App.jsx - the root component.
 * ----------------------------------------------------------------------------
 * Wraps the whole app in global "providers" (context) and the router.
 * Everything inside <ThemeProvider> can read/change the theme with useTheme().
 * ----------------------------------------------------------------------------
 */
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { router } from '@/app/router';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
