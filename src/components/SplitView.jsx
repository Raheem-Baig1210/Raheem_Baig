import { NavLink, Outlet } from 'react-router-dom'

// Two-pane layout: an indexed list of items on the left, the selected item's detail on the right.
export default function SplitView({ base, items, caption }) {
  return (
    <div className="split">
      <nav className="split-list" aria-label={base}>
        {items.map((item, i) => (
          <NavLink key={item.slug} to={`/${base}/${item.slug}`} className={({ isActive }) => `split-item ${isActive ? 'active' : ''}`}>
            <span className="split-index">[{String(i).padStart(2, '0')}]</span>
            <span className="split-text">
              <span className="split-name">{item.name || item.company}</span>
              <span className="split-caption">{caption(item)}</span>
            </span>
          </NavLink>
        ))}
      </nav>
      <section className="split-detail">
        <Outlet />
      </section>
    </div>
  )
}
