/**
 * DrilledTree.jsx  -  THE PROBLEM: prop drilling
 * ----------------------------------------------------------------------------
 * Only <UserMenu> (the deepest component) needs `user`, but to get it there
 * we must pass it through <Layout> and <Sidebar>, which don't care about it:
 *
 *   App (user) -> Layout (user) -> Sidebar (user) -> UserMenu (uses user)
 *                   ^ forwards        ^ forwards
 *
 * Problems:
 *   - Middle components get props they never use (noise).
 *   - Renaming or adding a prop means editing EVERY level.
 *   - The deeper the tree, the worse it gets.
 *
 * (Several tiny components in one file keeps this demo compact; in a real app
 *  each would usually have its own file.)
 * ----------------------------------------------------------------------------
 */
import LevelBox from './LevelBox';

/* Level 4 - the only one that really needs `user` */
function UserMenu({ user }) {
  return (
    <LevelBox name="<UserMenu user>" role="uses" note={`renders ${user.name}`}>
      <div className="cc-usermenu">
        <span className="cc-usermenu-avatar">{user.avatar}</span>
        <div>
          <strong>{user.name}</strong>
          <div className="muted small">{user.email}</div>
        </div>
      </div>
    </LevelBox>
  );
}

/* Level 3 - doesn't use `user`, only passes it on */
function Sidebar({ user }) {
  return (
    <LevelBox name="<Sidebar user>" role="forwards">
      <UserMenu user={user} />
    </LevelBox>
  );
}

/* Level 2 - doesn't use `user`, only passes it on */
function Layout({ user }) {
  return (
    <LevelBox name="<Layout user>" role="forwards">
      <Sidebar user={user} />
    </LevelBox>
  );
}

/* Level 1 - owns the data (receives it from the example's state) */
export default function DrilledTree({ user }) {
  return (
    <LevelBox name="<App>" role="owner" note="const [user, setUser] = useState(...)">
      <Layout user={user} />
    </LevelBox>
  );
}
