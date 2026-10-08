import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Response from '../components/Response'
import { certifications } from '../data/profile'

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
          <button key={c.title} className="cert" onClick={() => setOpen(c)} aria-label={`Open certificate: ${c.title}`}>
            <span className="cert-img">
              <img src={c.image} alt={`${c.title} certificate`} loading="lazy" />
            </span>
            <span className="cert-body">
              <span className="cert-title">{c.title}</span>
              <span className="cert-meta">
                <span className="cert-issuer">{c.issuer}</span>
                {c.date && <span className="cert-date">{c.date}</span>}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Portalled to <body> so the page's enter animation can't clip the overlay. */}
      {open && createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <button className="lightbox-close" onClick={() => setOpen(null)} aria-label="Close">×</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={open.image} alt={`${open.title} certificate`} />
            <figcaption>
              <span className="lightbox-title">{open.title}</span>
              <span className="lightbox-sub">{open.date || open.issuer}</span>
            </figcaption>
          </figure>
        </div>,
        document.body
      )}
    </div>
  )
}
