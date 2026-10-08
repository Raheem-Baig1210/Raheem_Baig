import { Link, useLocation } from 'react-router-dom'
import Response from '../components/Response'

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <div className="narrow">
      <Response code="404 Not Found" path={pathname} title="No such endpoint" subtitle="That route isn't part of this API. Try one from the sidebar." />
      <Link to="/" className="pill">← GET /me</Link>
    </div>
  )
}
