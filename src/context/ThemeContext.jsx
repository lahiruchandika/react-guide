/**
 * ThemeContext.jsx
 * ----------------------------------------------------------------------------
 * A real-world Context example used by the whole app (light / dark theme).
 *
 * The 3 steps of Context:
 *   1. createContext()        -> create the "channel"
 *   2. <ThemeContext value>   -> PROVIDE a value near the top of the tree
 *   3. useContext()           -> CONSUME the value in any child, at any depth
 *
 * We also export a small custom hook `useTheme()` so components don't need to
 * import ThemeContext + useContext every time.
 * ----------------------------------------------------------------------------
 */
import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Step 1: create the context (null = "no provider found" default).
const ThemeContext = createContext(null);

// Step 2: the provider component holds the state and shares it.
export function ThemeProvider({ children }) {
  // Persist the chosen theme in localStorage.
  const [theme, setTheme] = useLocalStorage('react-guide:theme', 'light');

  // Side effect: put data-theme="dark" on <html> so CSS variables switch.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // In React 19 the context object itself can be rendered as the provider.
  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

// Step 3: a custom hook to consume the context safely.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
