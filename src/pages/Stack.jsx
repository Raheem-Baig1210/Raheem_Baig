import Response from '../components/Response'
import { stack } from '../data/profile'

export default function Stack() {
  return (
    <div className="wide">
      <Response path="/stack" title="Stack" />
      {stack.map((g) => (
        <section key={g.group} className="stack-group">
          <h2 className="eyebrow lg">{g.group}</h2>
          <div className="chips">
            {g.items.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </section>
      ))}
    </div>
  )
}
