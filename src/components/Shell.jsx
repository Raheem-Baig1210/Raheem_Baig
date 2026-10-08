import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import AvatarPanel from './AvatarPanel'
import { endpoints, profile } from '../data/profile'

function useClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-GB', { timeZone: profile.timezone, hour: '2-digit', minute: '2-digit' })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Longest endpoint whose path prefixes the current URL.
function matchEndpoint(pathname) {
  return endpoints
    .filter((e) => e.to !== '/' && (pathname === e.to || pathname.startsWith(e.to + '/')))
    .sort((a, b) => b.to.length - a.to.length)[0]
}

export default function Shell({ github }) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef(null)
  const time = useClock()
  const endpoint = matchEndpoint(pathname)

  useEffect(() => {
    setMenuOpen(false)
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="device">
      <span className="device-notch top" />
      <div className="window">
        <header className="titlebar">
          <div className="dots" aria-hidden="true"><span /><span /><span /></div>
          <button className="menu-btn" aria-label="Open endpoints" onClick={() => setMenuOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" /></svg>
          </button>
          <Link to="/" className="prompt" aria-label="Home">{profile.prompt}</Link>
          <span className="online">online</span>
        </header>

        <div className="body">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <main className="main" ref={mainRef}>
            <div className="page" key={pathname.split('/')[1] || 'home'}>
              <Outlet context={github} />
            </div>
          </main>
          {endpoint?.status && <AvatarPanel status={endpoint.status} />}
        </div>

        <footer className="statusbar">
          <span className="clock"><b>{time}</b> {profile.tzLabel}</span>
        </footer>
      </div>
      <span className="device-notch bottom" />
    </div>
  )
}
