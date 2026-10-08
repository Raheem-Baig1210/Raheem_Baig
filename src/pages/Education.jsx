import Response from '../components/Response'
import { education } from '../data/profile'

export default function Education() {
  return (
    <div className="narrow">
      <Response path="/education" title="Education" />
      <div className="cards">
        {education.map((e) => (
          <article key={e.title} className="glow-card">
            <span className="card-date">{e.date}</span>
            <h2 className="card-title">{e.title}</h2>
            <p className="card-org">{e.org}</p>
            <p className="card-text">{e.text}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
