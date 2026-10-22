/**
 * HookLibrary - a table of the reusable hooks that live in src/hooks/.
 * Data-driven UI: the rows come from an array, rendered with map().
 */
import { Card } from '@/components/ui';

const HOOKS = [
  { name: 'useToggle', file: 'useToggle.js', signature: 'const [on, toggle, setOn] = useToggle(false)', uses: 'useState + useCallback' },
  { name: 'useDebounce', file: 'useDebounce.js', signature: 'const debounced = useDebounce(value, 500)', uses: 'useState + useEffect (timer)' },
  { name: 'useFetch', file: 'useFetch.js', signature: 'const { data, error, loading, refetch } = useFetch(fn, deps)', uses: 'useState + useEffect + AbortController' },
  { name: 'useLocalStorage', file: 'useLocalStorage.js', signature: "const [value, setValue] = useLocalStorage('key', initial)", uses: 'useState + useEffect' },
  { name: 'useWindowSize', file: 'useWindowSize.js', signature: 'const { width, height } = useWindowSize()', uses: 'useState + useEffect (listener)' },
  { name: 'useOnlineStatus', file: 'useOnlineStatus.js', signature: 'const isOnline = useOnlineStatus()', uses: 'useSyncExternalStore' },
];

export default function HookLibrary() {
  return (
    <Card title="Hooks you can reuse - src/hooks/ (import from '@/hooks')">
      <div className="ch-table-wrap">
        <table className="ch-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>Usage</th>
              <th>Built with</th>
            </tr>
          </thead>
          <tbody>
            {HOOKS.map((hook) => (
              <tr key={hook.name}>
                <td>
                  <code>{hook.name}</code>
                  <div className="muted small">{hook.file}</div>
                </td>
                <td className="ch-mono small">{hook.signature}</td>
                <td className="muted small">{hook.uses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
