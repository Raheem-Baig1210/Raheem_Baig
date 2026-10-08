import Response from '../components/Response'
import { origin } from '../data/profile'

export default function Origin() {
  return (
    <div className="narrow">
      <Response path="/me/origin" title="Origin story" subtitle={origin.tagline} />
      <p className="prose">{origin.story}</p>
      <dl className="facts">
        {origin.facts.map(([k, v]) => (
          <div key={k} className="fact">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
