/**
 * AppThemeExample
 * ----------------------------------------------------------------------------
 * A REAL context used by this whole guide: src/context/ThemeContext.jsx.
 *
 *   App.jsx                     <ThemeProvider>  ...entire app...  </ThemeProvider>
 *   components/layout/Header    useTheme()  -> the moon/sun button at the top
 *   THIS component              useTheme()  -> same value, same toggle
 *
 * This demo sits many levels below App.jsx (App -> Router -> Layout -> Page ->
 * Example -> here) and still reads the theme without a single prop.
 * Click the button: the whole page switches theme, and the header button stays
 * in sync because both read the SAME context value.
 * ----------------------------------------------------------------------------
 */
import { Moon, Sun } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { useTheme } from '@/context/ThemeContext'; // the app-wide custom hook

export default function AppThemeExample() {
  const { theme, toggleTheme } = useTheme(); // read value + action from context
  const isDark = theme === 'dark';

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="row">
          <span>Current theme:</span>
          <Badge tone={isDark ? 'info' : 'warning'}>{theme}</Badge>
        </div>
        <div className="row">
          {/* Calls the function stored in context -> ThemeProvider updates its state */}
          <Button icon={isDark ? <Sun size={16} /> : <Moon size={16} />} onClick={toggleTheme}>
            Switch to {isDark ? 'light' : 'dark'}
          </Button>
        </div>
        <p className="muted small">
          The choice is also saved in localStorage (via the useLocalStorage hook inside ThemeProvider), so it
          survives a refresh.
        </p>
      </div>

      {/* A preview card that only uses CSS variables - they change with the theme */}
      <div className="ctx-theme-preview">
        <div className="row ctx-theme-preview-head">
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
          <strong>{isDark ? 'Night mode' : 'Day mode'}</strong>
        </div>
        <p className="small muted">Every color in the app comes from CSS variables that switch with data-theme.</p>
        <div className="row">
          <Badge tone="primary">primary</Badge>
          <Badge tone="success">success</Badge>
          <Badge tone="danger">danger</Badge>
        </div>
      </div>
    </div>
  );
}
