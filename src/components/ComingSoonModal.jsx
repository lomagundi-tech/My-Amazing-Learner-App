import { useState, useEffect, useRef } from 'react'
import { t } from '../utils/i18n'

const NOTIFY_KEY = 'mal_notify_email'

export default function ComingSoonModal({ tier, onClose, lang = 'en' }) {
  const [email, setEmail]       = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]       = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus email input on open
    setTimeout(() => inputRef.current?.focus(), 50)

    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t('coming_soon_email_error', lang))
      return
    }
    try {
      localStorage.setItem(NOTIFY_KEY, trimmed)
    } catch {}
    setSubmitted(true)
    setError('')
  }

  return (
    <div
      style={s.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="csm-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={s.card}>
        <button
          onClick={onClose}
          style={s.closeBtn}
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div style={s.successState}>
            <span style={s.bigEmoji} aria-hidden="true">🎉</span>
            <h2 style={s.title}>{t('coming_soon_success_title', lang)}</h2>
            <p style={s.sub}>{t('coming_soon_success_sub', lang)}</p>
            <button onClick={onClose} className="btn btn-primary" style={s.doneBtn}>
              {t('coming_soon_success_cta', lang)}
            </button>
          </div>
        ) : (
          <>
            <span style={s.bigEmoji} aria-hidden="true">🚀</span>
            <h2 id="csm-title" style={s.title}>{t('coming_soon_title', lang)}</h2>
            <p style={s.sub}>{t('coming_soon_sub', lang).replace('{tier}', tier)}</p>

            <form onSubmit={handleSubmit} noValidate style={s.form}>
              <label htmlFor="csm-email" style={s.label}>{t('coming_soon_email_label', lang)}</label>
              <input
                id="csm-email"
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder={t('coming_soon_email_label', lang)}
                style={{ ...s.input, borderColor: error ? '#E63737' : 'rgba(107,63,160,0.25)' }}
                autoComplete="email"
              />
              {error && <p style={s.errorText} role="alert">{error}</p>}
              <button type="submit" className="btn btn-primary" style={s.submitBtn}>
                {t('coming_soon_submit', lang)}
              </button>
            </form>

            <p style={s.note}>{t('coming_soon_note', lang)}</p>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(61,26,94,0.72)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: '0 24px 80px rgba(61,26,94,0.3)',
    padding: '40px 36px', maxWidth: '440px', width: '100%',
    position: 'relative', textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute', top: '16px', right: '16px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '1rem', color: 'var(--text-mid)', padding: '4px 8px',
    borderRadius: '4px', minHeight: '32px', minWidth: '32px',
    lineHeight: 1,
  },
  bigEmoji: { fontSize: '3rem', display: 'block', marginBottom: '12px' },
  title: {
    fontFamily: "'Baloo 2', cursive", fontWeight: 800,
    color: 'var(--plum)', fontSize: '1.6rem', marginBottom: '12px',
  },
  sub: {
    color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7,
    marginBottom: '24px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' },
  label: { fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)' },
  input: {
    padding: '12px 16px', borderRadius: 'var(--radius-pill)',
    border: '2px solid rgba(107,63,160,0.25)', fontSize: '1rem',
    fontFamily: "'Nunito', 'Noto Sans', sans-serif", outline: 'none', width: '100%',
    boxSizing: 'border-box',
  },
  errorText: { color: '#E63737', fontSize: '0.8rem', margin: 0 },
  submitBtn: { marginTop: '4px', width: '100%', minHeight: '48px', fontSize: '1rem' },
  note: { marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-mid)' },
  successState: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  doneBtn: { marginTop: '20px', minHeight: '48px', padding: '0 32px', fontSize: '1rem' },
}
