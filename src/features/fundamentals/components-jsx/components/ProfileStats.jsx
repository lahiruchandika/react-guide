/**
 * ProfileStats.jsx
 * ----------------------------------------------------------------------------
 * A row of numbers (projects / followers / ...). Renders a list with .map().
 * ----------------------------------------------------------------------------
 */

export default function ProfileStats({ stats }) {
  return (
    <ul className="cj-stats" data-component="ProfileStats">
      {stats.map((stat) => (
        // key: a unique, stable value for each list item
        <li key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </li>
      ))}
    </ul>
  );
}
