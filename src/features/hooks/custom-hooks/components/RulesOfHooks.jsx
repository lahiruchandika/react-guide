/**
 * RulesOfHooks - a static "bad vs good" reference card used by the lesson page.
 *
 * React identifies each hook by the ORDER it is called in. If that order can
 * change between renders (because of an if, a loop or an early return), React
 * mixes up the state of different hooks. Hence the two rules.
 */
import { CircleCheck, CircleX } from 'lucide-react';
import { CodeBlock } from '@/components/ui';

const BAD = `function Profile({ userId }) {
  if (!userId) return null; // early return first

  if (userId > 10) {
    useState(0);            // inside a condition
  }

  items.forEach(() => useEffect(...)); // loop

  function handleClick() {
    useToggle();            // inside a handler
  }
}

function formatUser() {
  useState();   // not a component or hook
}`;

const GOOD = `function Profile({ userId }) {
  // 1. ALL hooks first, at the top level
  const [x, setX] = useState(0);
  const user = useFetch(...);
  const [open, toggleOpen] = useToggle();

  // 2. Conditions INSIDE hooks or AFTER them
  useEffect(() => {
    if (!userId) return; // inside the effect
    // ...
  }, [userId]);

  if (!userId) return null; // after hooks
  return <h1>{user.name}</h1>;
}

// 3. Custom hooks: name starts with "use"
function useUserName(user) { ... }`;

export default function RulesOfHooks() {
  return (
    <section className="ch-rules">
      <h2>The Rules of Hooks</h2>
      <ol className="ch-rules-list">
        <li>
          <strong>Only call hooks at the top level.</strong> Never inside conditions, loops, nested functions or after
          an early return.
        </li>
        <li>
          <strong>Only call hooks from React functions:</strong> components or other custom hooks (names starting
          with <code>use</code>).
        </li>
      </ol>
      <div className="grid-2">
        <div>
          <div className="ch-rules-head bad"><CircleX size={16} /> Breaks the rules</div>
          <CodeBlock code={BAD} fileName="Bad.jsx" />
        </div>
        <div>
          <div className="ch-rules-head good"><CircleCheck size={16} /> Follows the rules</div>
          <CodeBlock code={GOOD} fileName="Good.jsx" />
        </div>
      </div>
    </section>
  );
}
