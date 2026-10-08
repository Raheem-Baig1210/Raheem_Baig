import { NavLink } from 'react-router-dom'
import { endpoints, profile } from '../data/profile'

export function MethodBadge({ method }) {
  return <span className={`method ${method.toLowerCase()}`}>{method}</span>
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-name">{profile.brand}</span>
          <span className="brand-version">{profile.version}</span>
        </div>

        <nav className="endpoints" aria-label="Endpoints">
          <h2 className="eyebrow">Endpoints</h2>
          {endpoints.map((e) => (
            <NavLink key={e.path} to={e.to} end={e.to === '/'} className={({ isActive }) => `endpoint ${isActive ? 'active' : ''}`}>
              <MethodBadge method={e.method} />
              <span className="endpoint-path">{e.path}</span>
            </NavLink>
          ))}
        </nav>

        <dl className="vitals">
          <div><dt>uptime</dt><dd>99.9%</dd></div>
          <div><dt>timezone</dt><dd className="plain">{profile.tzLabel}</dd></div>
          <div><dt>resume</dt><dd><a href={profile.resume} download>download</a></dd></div>
        </dl>
      </aside>
    </>
  )
}
