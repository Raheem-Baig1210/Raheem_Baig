import { Navigate, useParams } from 'react-router-dom'
import SplitView from '../components/SplitView'
import Response from '../components/Response'
import { experience } from '../data/profile'

export default function Experience() {
  return <SplitView base="experience" items={experience} caption={(e) => e.period} />
}

export function ExperienceDetail() {
  const { slug } = useParams()
  const job = experience.find((e) => e.slug === slug)
  if (!job) return <Navigate to="/experience" replace />

  return (
    <article className="detail" key={slug}>
      <Response path={`/experience/${job.slug}`} title={job.company} />
      <div className="detail-head">
        <b>{job.role}</b>
        <span>{job.period}</span>
      </div>
      <p className="detail-meta">{job.location}</p>
      <ul className="bullets">
        {job.points.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <div className="chips">
        {job.tags.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
    </article>
  )
}
