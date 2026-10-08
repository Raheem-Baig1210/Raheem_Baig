import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Response from '../components/Response'
import { answer, starters } from '../lib/assistant'
import { profile } from '../data/profile'

// Splits an answer into stream tokens; links stay whole so they never render half-typed.
const TOKENS = /\[[^\]]*\]\([^)]*\)|\s+|[^\s]+/g
let uid = 0

function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      if (href.startsWith('/') && !href.endsWith('.pdf')) return <Link key={i} to={href}>{label}</Link>
      const external = /^https?:/.test(href)
      return (
        <a key={i} href={href} target={external ? '_blank' : undefined} rel="noreferrer" download={href.endsWith('.pdf') || undefined}>
          {label}
        </a>
      )
    }
    return part.replace(/\*\*/g, '') // hide a bold marker that hasn't closed yet mid-stream
  })
}

function Markdown({ text, streaming }) {
  const blocks = text.split(/\n\n+/)
  return (
    <div className="md">
      {blocks.map((block, i) => {
        const caret = streaming && i === blocks.length - 1 ? <span className="caret" /> : null
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}><Inline text={l.slice(2)} />{j === lines.length - 1 && caret}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}><Inline text={block} />{caret}</p>
      })}
    </div>
  )
}

function Composer({ value, onChange, onSubmit, onStop, busy, autoFocus }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  useEffect(() => {
    if (autoFocus && window.matchMedia('(min-width: 901px)').matches) ref.current.focus()
  }, [autoFocus])

  return (
    <form className="composer" onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
      <textarea
        ref={ref}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
        }}
        placeholder="Ask anything about me"
        aria-label="Ask a question about Raheem"
      />
      {busy ? (
        <button type="button" className="send stop" onClick={onStop} aria-label="Stop generating">
          <span />
        </button>
      ) : (
        <button type="submit" className="send" disabled={!value.trim()} aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </form>
  )
}

export default function Ask() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)
  const endRef = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [messages])

  const patch = (id, changes) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...changes } : m)))

  function send(text = input) {
    const question = text.trim()
    if (!question || busy) return
    const { text: full, suggestions } = answer(question)
    const id = ++uid
    setMessages((ms) => [...ms, { id: ++uid, role: 'user', text: question }, { id, role: 'bot', text: '', suggestions, thinking: true }])
    setInput('')
    setBusy(true)

    // Reveal the answer a few tokens at a time, like a model streaming its output.
    const tokens = full.match(TOKENS) || []
    let shown = 0
    const tick = () => {
      shown = Math.min(tokens.length, shown + 1 + Math.floor(Math.random() * 3))
      patch(id, { text: tokens.slice(0, shown).join(''), thinking: false })
      if (shown < tokens.length) timer.current = setTimeout(tick, 16 + Math.random() * 34)
      else { patch(id, { done: true }); setBusy(false) }
    }
    timer.current = setTimeout(tick, 450 + Math.random() * 450)
  }

  function stop() {
    clearTimeout(timer.current)
    setMessages((ms) => ms.map((m, i) => (i === ms.length - 1 ? { ...m, thinking: false, done: true, stopped: true } : m)))
    setBusy(false)
  }

  function reset() {
    clearTimeout(timer.current)
    setMessages([])
    setBusy(false)
  }

  const composer = (
    <Composer value={input} onChange={setInput} onSubmit={() => send()} onStop={stop} busy={busy} autoFocus />
  )

  if (!messages.length) {
    return (
      <div className="ask ask-empty">
        <Response method="POST" path="/ask" />
        <div className="ask-welcome">
          <h1 className="ask-title">Know more about me</h1>
          <p className="ask-sub">Ask about my education, experience, skills, projects, anything.</p>
          {composer}
          <div className="ask-chips">
            {starters.map((s) => (
              <button key={s} className="ask-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const last = messages[messages.length - 1]

  return (
    <div className="ask">
      <div className="ask-head">
        <Response method="POST" path="/ask" />
        <button className="pill" onClick={reset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          New chat
        </button>
      </div>

      <div className="thread" aria-live="polite">
        {messages.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className="msg msg-user"><div className="bubble">{m.text}</div></div>
          ) : (
            <div key={m.id} className="msg msg-bot">
              <img className="bot-avatar" src={profile.avatar} alt="" />
              <div className="bot-body">
                {m.thinking ? (
                  <div className="thinking" aria-label="Thinking"><i /><i /><i /></div>
                ) : (
                  m.text && <Markdown text={m.text} streaming={!m.done} />
                )}
                {m.stopped && <p className="stopped-note">Response stopped.</p>}
                {m === last && m.done && !m.stopped && m.suggestions && (
                  <div className="ask-chips follow">
                    {m.suggestions.map((s) => (
                      <button key={s} className="ask-chip" onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <div className="dock">
        {composer}
        <p className="dock-note">Answers are generated from Raheem's portfolio data.</p>
      </div>
      {/* Scroll anchor sits below the dock so new text is never hidden behind it. */}
      <div ref={endRef} />
    </div>
  )
}
