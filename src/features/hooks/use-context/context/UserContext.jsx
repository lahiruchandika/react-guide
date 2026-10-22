/**
 * UserContext.jsx
 * ----------------------------------------------------------------------------
 * Shares the "logged-in user" with every component below <UserProvider>,
 * no matter how deeply nested, WITHOUT passing props through each level.
 *
 * The 3 steps of Context (same pattern as src/context/ThemeContext.jsx):
 *   1. createContext()            -> create the "channel"
 *   2. <UserContext value={...}>  -> PROVIDE a value (inside UserProvider)
 *   3. useContext(UserContext)    -> CONSUME it (wrapped in the useUser() hook)
 *
 * Industry convention: keep each context in its own file and export
 *   - a Provider component (holds the state)
 *   - a custom hook (useUser) so consumers never touch the raw context object
 * ----------------------------------------------------------------------------
 */
import { createContext, useContext, useMemo, useState } from 'react';

// 1. Create the context. The default value (null) is only used when a
//    component calls useUser() WITHOUT a provider above it.
const UserContext = createContext(null);

const DEFAULT_USER = { name: 'Ada Lovelace', role: 'Admin', avatarColor: 'primary' };

// 2. The provider component: owns the state and shares it with its children.
export function UserProvider({ initialUser = DEFAULT_USER, children }) {
  const [user, setUser] = useState(initialUser); // null = logged out

  // useMemo keeps the SAME value object between renders unless `user` changes.
  // Without it, every render of UserProvider would create a new object and
  // force every consumer to re-render (a common performance pitfall).
  const value = useMemo(() => {
    // Actions that children can call to UPDATE the context from below.
    // (setUser from useState is always stable, so these are safe to memoize.)
    const login = (name) => setUser({ ...DEFAULT_USER, name });
    const logout = () => setUser(null);
    const updateUser = (changes) => setUser((prev) => ({ ...prev, ...changes }));

    return { user, login, logout, updateUser };
  }, [user]);

  // React 19: render the context itself as the provider (<UserContext.Provider> still works too).
  return <UserContext value={value}>{children}</UserContext>;
}

// 3. Custom hook: the ONLY way components should read this context.
export function useUser() {
  const ctx = useContext(UserContext);
  // A clear error is much better than "cannot read property 'user' of null".
  if (!ctx) throw new Error('useUser() must be used inside <UserProvider>');
  return ctx;
}
