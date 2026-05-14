import { useEffect, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import { t } from '../utils/i18n'

const PARENT_CHIPS = [
  'How do I support SEN readers?',
  'What KS2 maths topics are hardest?',
  'Recommend an activity for age 5',
]

export default function AITutor({ mode, childName, lang = 'en' }) {
  const OPENING_MESSAGE = {
    role: 'assistant',
    content: t('ai_greeting', lang),
  }
  const { messages, input, setInput, loading, error, sendChat } = useChat(childName, mode, lang, OPENING_MESSAGE, t('ai_error', lang))
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSubmit(e) {
    e.preventDefault()
    sendChat(input, mode)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(input, mode) }
  }

  return (
    <div className="panel-enter" style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.avatar} aria-hidden="true">🔮</span>
        <div>
          <h2 style={styles.name}>Sparky</h2>
          <p style={styles.tagline}>
            {mode === 'child' ? t('ai_tagline_child', lang) : t('ai_tagline_parent', lang)}
          </p>
        </div>
      </div>

      {/* Chat window */}
      <div style={styles.chatBox} aria-live="polite" aria-label="Chat with Sparky">
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user'
                ? (mode === 'child' ? 'var(--coral)' : 'var(--plum)')
                : '#f4f0fa',
              color: msg.role === 'user' ? '#fff' : 'var(--text-dark)',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '20px',
              borderBottomLeftRadius: msg.role === 'user' ? '20px' : '4px',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.bubble, alignSelf: 'flex-start', background: '#f4f0fa' }}>
            <span style={styles.thinkingText}>{t('ai_thinking', lang)}</span>
            <span style={styles.dot} />
            <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
            <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
          </div>
        )}

        {error && (
          <div style={{ ...styles.bubble, alignSelf: 'flex-start', background: '#fff3f3', color: 'var(--coral)' }}>
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Parent quick-prompt chips */}
      {mode === 'parent' && (
        <div style={styles.chips}>
          {PARENT_CHIPS.map((chip) => (
            <button key={chip} onClick={() => sendChat(chip, mode)} style={styles.chip}>
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('ai_placeholder', lang)}
          style={styles.input}
          disabled={loading}
          aria-label="Message input"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            ...styles.sendBtn,
            background: mode === 'child' ? 'var(--coral)' : 'var(--plum)',
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
          aria-label="Send message"
        >
          {t('ai_send', lang)}
        </button>
      </form>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', gap: '16px',
    padding: '32px 0', maxWidth: '720px', margin: '0 auto',
  },
  header: {
    display: 'flex', alignItems: 'center', gap: '16px',
    background: '#fff', borderRadius: 'var(--radius-card)',
    padding: '16px 24px', boxShadow: 'var(--shadow-small)',
  },
  avatar: { fontSize: '2.5rem' },
  name: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.25rem' },
  tagline: { color: 'var(--text-mid)', fontSize: '0.85rem' },
  chatBox: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)', padding: '20px',
    minHeight: '320px', maxHeight: '420px', overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  bubble: {
    maxWidth: '80%', padding: '12px 16px',
    borderRadius: '20px', fontSize: '0.95rem',
    lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: '4px',
  },
  dot: {
    display: 'inline-block', width: '8px', height: '8px',
    background: 'var(--violet)', borderRadius: '50%',
    animation: 'typingBounce 1.2s ease-in-out infinite',
  },
  thinkingText: {
    marginRight: '6px',
  },
  chips: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  chip: {
    padding: '8px 16px', borderRadius: 'var(--radius-pill)',
    background: 'rgba(107,63,160,0.08)', border: '1px solid rgba(107,63,160,0.2)',
    color: 'var(--violet)', fontSize: '0.8rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    transition: 'background 0.2s ease', minHeight: '44px',
  },
  form: { display: 'flex', gap: '10px' },
  input: {
    flex: 1, padding: '14px 20px', borderRadius: 'var(--radius-pill)',
    border: '2px solid rgba(107,63,160,0.2)', fontSize: '0.95rem',
    fontFamily: "'Nunito', sans-serif", outline: 'none', color: 'var(--text-dark)',
    background: '#fff',
  },
  sendBtn: {
    minWidth: '84px', height: '52px', borderRadius: 'var(--radius-pill)',
    border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 800,
    padding: '0 18px',
    cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.2s ease',
  },
}
