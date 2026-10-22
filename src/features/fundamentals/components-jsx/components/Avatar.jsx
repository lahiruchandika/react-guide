/**
 * Avatar.jsx
 * ----------------------------------------------------------------------------
 * A tiny, single-purpose component: shows a user's initials in a circle.
 *
 * Industry habit: ONE component per file, file name = component name.
 * Small components are easier to read, test and reuse.
 *
 * (It receives data through "props" - covered in the next lesson.)
 * ----------------------------------------------------------------------------
 */

// Helper: "Grace Hopper" -> "GH"
function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({ name, color }) {
  return (
    // data-component is only used by the "show outlines" toggle in the demo
    <div className="cj-avatar" data-component="Avatar" style={{ background: color }}>
      {getInitials(name)}
    </div>
  );
}
