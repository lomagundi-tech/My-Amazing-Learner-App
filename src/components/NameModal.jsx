import { useState } from 'react'
import { setChildName } from '../utils/storage'

export default function NameModal({ onSave }) {
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setChildName(trimmed)
    onSave(trimmed)
  }

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="Enter child's name">
      <div style={styles.modal}>
        <span style={styles.emoji} aria-hidden="true">🦄</span>
        <h2 style={styles.title}>Welcome to My Amazing Learner!</h2>
        <p style={styles.sub}>What&apos;s your name? We&apos;ll make the app just for you!</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name here…"
            maxLength={30}
            autoFocus
            style={styles.input}
            aria-label="Child's name"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              ...styles.btn,
              opacity: name.trim() ? 1 : 0.5,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {"Let's go! 🚀"}
          </button>
        </form>
        <button onClick={() => onSave('')} style={styles.skip}>Skip for now</button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(61,26,94,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: '0 24px 64px rgba(61,26,94,0.3)',
    padding: '40px 32px', textAlign: 'center',
    maxWidth: '420px', width: '100%',
    animation: 'fadeUp 0.35s ease both',
  },
  emoji: { fontSize: '3rem', display: 'block', marginBottom: '12px' },
  title: {
    fontFamily: "'Baloo 2', cursive", fontWeight: 800,
    color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '8px',
  },
  sub: { color: 'var(--text-mid)', fontSize: '0.95rem', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: {
    padding: '14px 20px', borderRadius: 'var(--radius-pill)',
    border: '2px solid var(--violet)', fontSize: '1rem',
    fontFamily: "'Nunito', sans-serif", outline: 'none',
    color: 'var(--text-dark)', textAlign: 'center',
  },
  btn: {
    padding: '14px 28px', borderRadius: 'var(--radius-pill)',
    background: 'var(--plum)', color: '#fff', border: 'none',
    fontFamily: "'Baloo 2', cursive", fontWeight: 700,
    fontSize: '1rem', transition: 'background 0.2s ease',
    minHeight: '44px',
  },
  skip: {
    marginTop: '12px', background: 'none', border: 'none',
    color: 'var(--text-mid)', fontSize: '0.85rem',
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    textDecoration: 'underline',
  },
}
