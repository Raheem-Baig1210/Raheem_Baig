import { useEffect, useState } from 'react'
import Response from '../components/Response'
import { certifications, certificatesPdf } from '../data/profile'

export default function Certifications() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="wide certs-page">
      <Response path="/certifications" title="Certifications" />

      <div className="cert-grid">
        {certifications.map((c) => (
          <button key={c.title} className="cert" onClick={() => setOpen(c)}>
            <span className="cert-img">
              <img src={c.image} alt={`${c.title} certificate`} loading="lazy" />
            </span>
            <span className="cert-body">
              <span className="cert-title">{c.title}</span>
              <span className="cert-issuer">{c.issuer}</span>
            </span>
          </button>
        ))}
      </div>

      <p className="alt-contact">
        Original certificates — <a href={certificatesPdf} target="_blank" rel="noreferrer">view the original PDF ↗</a>
      </p>

      {open && (
        <div className="lightbox" role="dialog" aria-label={open.title} onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={open.image} alt={`${open.title} certificate`} />
            <figcaption>
              <span>{open.title}</span>
              <button onClick={() => setOpen(null)} aria-label="Close">esc ✕</button>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  )
}
