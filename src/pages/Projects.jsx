import { Navigate, useParams } from 'react-router-dom'
import SplitView from '../components/SplitView'
import Response from '../components/Response'
import Icon from '../components/Icons'
import { projects } from '../data/profile'

export default function Projects() {
  return <SplitView base="projects" items={projects} caption={(p) => p.kind} />
}

export function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <Navigate to="/projects" replace />

  return (
    <article className="detail" key={slug}>
      <Response
        path={`/projects/${project.slug}`}
        title={project.name}
        icon={project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer" className="title-icon" aria-label="View source on GitHub">
            <Icon name="github" size={22} />
          </a>
        )}
      />

      {project.image ? (
        <a href={project.live} target="_blank" rel="noreferrer" className="shot">
          <img src={project.image} alt={`${project.name} screenshot`} loading="lazy" />
          <span className="shot-cta">Open live site ↗</span>
        </a>
      ) : (
        <div className="shot shot-empty">
          <span>{project.name}</span>
          <small>{project.kind}</small>
        </div>
      )}

      <p className="prose">{project.description}</p>

      {project.points && (
        <ul className="bullets">
          {project.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}

      <div className="chips">
        {project.tags.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>

      {(project.live || project.repo) && (
        <div className="pills">
          {project.live && <a className="pill" href={project.live} target="_blank" rel="noreferrer">Live demo ↗</a>}
          {project.repo && <a className="pill" href={project.repo} target="_blank" rel="noreferrer"><Icon name="github" size={14} /> Source</a>}
        </div>
      )}
    </article>
  )
}
