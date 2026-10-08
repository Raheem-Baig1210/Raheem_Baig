// The "200 OK: GET /path" line + page title at the top of every endpoint.
export default function Response({ method = 'GET', path, code, title, subtitle, icon }) {
  const status = code || (method === 'POST' ? '202 Accepted' : '200 OK')
  const tone = status.startsWith('2') ? (method === 'POST' ? 'post' : 'ok') : 'err'
  return (
    <header className="response">
      <p className={`status-line ${tone}`}>
        {status}: {method} {path}
      </p>
      {title && (
        <h1 className="title">
          {icon}
          {title}
        </h1>
      )}
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </header>
  )
}
