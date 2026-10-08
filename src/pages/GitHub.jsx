import { useOutletContext } from 'react-router-dom'
import Response from '../components/Response'
import { profile } from '../data/profile'

const langColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Python: '#3572A5',
  'C++': '#f34b7d',
}

function updated(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function GitHub() {
  const { user, repos, live } = useOutletContext()

  return (
    <div className="wide">
      <Response
        path={`/github/${profile.githubUser}`}
        title="Open source"
        subtitle={live ? 'Live from the GitHub API, most recently updated first.' : 'Cached snapshot — the GitHub API is unreachable right now.'}
      />

      <dl className="gh-stats">
        <div><dt>repos</dt><dd>{user?.public_repos ?? repos.length}</dd></div>
        <div><dt>followers</dt><dd>{user?.followers ?? 20}</dd></div>
        <div><dt>following</dt><dd>{user?.following ?? 21}</dd></div>
        <div><dt>profile</dt><dd><a href={profile.github} target="_blank" rel="noreferrer">@{profile.githubUser} ↗</a></dd></div>
      </dl>

      <ul className="repo-list">
        {repos.map((r) => (
          <li key={r.name}>
            <a className="repo" href={r.html_url} target="_blank" rel="noreferrer">
              <span className="repo-name">{r.name}</span>
              {r.description && <span className="repo-desc">{r.description}</span>}
              <span className="repo-meta">
                {r.language && (
                  <span><i className="lang-dot" style={{ background: langColors[r.language] || '#8b8b96' }} /> {r.language}</span>
                )}
                {r.updated_at && <span>updated {updated(r.updated_at)}</span>}
              </span>
            </a>
            {r.homepage && (
              <a className="repo-live" href={r.homepage} target="_blank" rel="noreferrer">live ↗</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
