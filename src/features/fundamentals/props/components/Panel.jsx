/**
 * Panel.jsx
 * ----------------------------------------------------------------------------
 * A reusable WRAPPER component that uses the special `children` prop.
 *
 *   <Panel title="Weather" icon={<Sun />} footer={<a>More</a>}>
 *     <p>Anything you put here...</p>      <- arrives as `children`
 *   </Panel>
 *
 * - `children` = whatever is written BETWEEN the opening and closing tag.
 * - Other props can also hold JSX ("slots"), like `icon` and `footer` here.
 *
 * The Panel controls the FRAME (border, header, footer). The parent decides
 * the CONTENT. This is called COMPOSITION and is how most UI libraries work.
 * ----------------------------------------------------------------------------
 */

export default function Panel({ title, icon, footer, tone = 'primary', children }) {
  return (
    <section className={`pr-panel pr-panel-${tone}`}>
      <header className="pr-panel-header">
        {icon && <span className="pr-panel-icon">{icon}</span>}
        <h4>{title}</h4>
      </header>

      {/* Render whatever the parent placed between <Panel> and </Panel> */}
      <div className="pr-panel-body">{children}</div>

      {/* Optional "slot": only rendered when the parent passes a footer */}
      {footer && <footer className="pr-panel-footer">{footer}</footer>}
    </section>
  );
}
