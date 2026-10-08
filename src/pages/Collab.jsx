import { useState } from 'react'
import Response from '../components/Response'
import { profile } from '../data/profile'

export default function Collab() {
  const [form, setForm] = useState({ email: '', subject: '', message: '' })
  const [state, setState] = useState('idle') // idle | sending | sent
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const mailto = () =>
    `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`${form.message}\n\n— ${form.email}`)}`

  // Sends through FormSubmit; falls back to the visitor's mail app if that fails.
  const onSubmit = async (e) => {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: form.email, _subject: `[portfolio] ${form.subject}`, message: form.message, _template: 'table' }),
      })
      const data = await res.json()
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message)
      setState('sent')
    } catch {
      window.location.href = mailto()
      setState('idle')
    }
  }

  return (
    <div className="narrow">
      <Response
        method="POST"
        path="/collab"
        title="Work together"
        subtitle="Whether it's a role, a freelance project, or just a question — send it through. I read every message."
      />

      {state === 'sent' ? (
        <div className="form-card sent">
          <p className="status-line ok">201 Created</p>
          <h2 className="card-title">Message delivered.</h2>
          <p className="card-text">Thanks for reaching out — I'll get back to you at <b>{form.email}</b> soon.</p>
          <button className="submit" onClick={() => { setForm({ email: '', subject: '', message: '' }); setState('idle') }}>
            POST /collab again →
          </button>
        </div>
      ) : (
        <form className="form-card" onSubmit={onSubmit}>
          <label>
            <span>Email <em>*</em></span>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={set('email')} />
          </label>
          <label>
            <span>Subject <em>*</em></span>
            <input required placeholder="what's this about?" value={form.subject} onChange={set('subject')} />
          </label>
          <label>
            <span>Message <em>*</em></span>
            <textarea required rows={5} placeholder="Hit me!" value={form.message} onChange={set('message')} />
          </label>
          <button className="submit" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'sending…' : 'POST /collab →'}
          </button>
        </form>
      )}

      <p className="alt-contact">
        or reach me directly — <a href={`mailto:${profile.email}`}>{profile.email}</a> ·{' '}
        <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a> ·{' '}
        <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
    </div>
  )
}
