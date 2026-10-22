/**
 * Skeletons - grey placeholder shapes shown as Suspense fallbacks.
 * ----------------------------------------------------------------------------
 * A skeleton that has the SAME SIZE as the real content avoids layout jumps
 * when the content arrives - much nicer than a lone spinner.
 *
 *   <Suspense fallback={<ChartSkeleton />}>
 *     <SalesChart />
 *   </Suspense>
 * ----------------------------------------------------------------------------
 */

/** One shimmering grey block. */
export function Bone({ width = '100%', height = 14, round = false }) {
  return <span className="lz-bone" style={{ width, height, borderRadius: round ? '50%' : undefined }} />;
}

/** Placeholder for <SalesChart /> */
export function ChartSkeleton({ label = 'Loading chart...' }) {
  return (
    <div className="lz-widget" aria-busy="true" aria-label={label}>
      <Bone width="40%" height={16} />
      <div className="lz-chart-skel">
        {[45, 70, 55, 85, 60, 95].map((h, i) => (
          // index key is fine: a fixed, never-changing list of placeholders
          <span key={i} className="lz-bone" style={{ height: `${h}%` }} />
        ))}
      </div>
      <span className="lz-fallback-label">{label}</span>
    </div>
  );
}

/** Placeholder for <ActivityFeed /> */
export function ListSkeleton({ rows = 4, label = 'Loading list...' }) {
  return (
    <div className="lz-widget" aria-busy="true" aria-label={label}>
      <Bone width="35%" height={16} />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="row">
          <Bone width={32} height={32} round />
          <div className="stack lz-grow" style={{ gap: 6 }}>
            <Bone width="70%" />
            <Bone width="40%" height={10} />
          </div>
        </div>
      ))}
      <span className="lz-fallback-label">{label}</span>
    </div>
  );
}

/** Placeholder for <TeamStats /> */
export function StatsSkeleton({ label = 'Loading stats...' }) {
  return (
    <div className="lz-stats" aria-busy="true" aria-label={label}>
      {[1, 2, 3].map((n) => (
        <div key={n} className="lz-stat">
          <Bone width="50%" height={10} />
          <Bone width="70%" height={26} />
        </div>
      ))}
    </div>
  );
}

/** One big placeholder for a whole page/section */
export function PageSkeleton({ label = 'Loading the whole dashboard...' }) {
  return (
    <div className="lz-page-skel" aria-busy="true">
      <StatsSkeleton label={label} />
      <div className="grid-2">
        <ChartSkeleton label={label} />
        <ListSkeleton label={label} />
      </div>
    </div>
  );
}
