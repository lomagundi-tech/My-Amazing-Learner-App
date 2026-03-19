import { useState } from 'react'
import { getSenActive, toggleSenTool } from '../utils/storage'
import { SEN_TOOLS } from '../utils/senTools'

export default function SENPanel({ mode }) {
  const [activeTools, setActiveTools] = useState(() => getSenActive())
  const isChild = mode === 'child'

  function handleToggle(toolId) {
    const updated = toggleSenTool(toolId)
    setActiveTools(updated)
    const tool = SEN_TOOLS.find((t) => t.id === toolId)
    tool?.apply(updated.includes(toolId))
  }

  const anyActive = activeTools.length > 0

  return (
    <div className="panel-enter" style={styles.wrapper}>

      <div style={styles.header}>
        <h2 style={styles.title}>🌈 Accessibility & SEN Tools</h2>
        <p style={styles.sub}>
          {isChild
            ? 'Turn on the tools that help you learn your way! Tap any card to switch it on or off. 💙'
            : 'My Amazing Learner is designed for every learner. Toggle any tool on — changes apply instantly across the whole app.'}
        </p>
        {anyActive && (
          <div style={styles.activeBanner}>
            <span>✅ {activeTools.length} tool{activeTools.length > 1 ? 's' : ''} currently active</span>
            <button
              onClick={() => {
                activeTools.forEach((id) => {
                  const tool = SEN_TOOLS.find((t) => t.id === id)
                  tool?.apply(false)
                })
                activeTools.forEach((id) => toggleSenTool(id))
                setActiveTools([])
              }}
              style={styles.clearBtn}
            >
              Turn all off
            </button>
          </div>
        )}
      </div>

      <div style={styles.grid}>
        {SEN_TOOLS.map((tool) => {
          const isOn = activeTools.includes(tool.id)
          return (
            <button
              key={tool.id}
              onClick={() => handleToggle(tool.id)}
              aria-pressed={isOn}
              style={{
                ...styles.card,
                background: isOn ? 'var(--plum)' : tool.bg,
                borderColor: isOn ? 'var(--plum)' : 'rgba(0,0,0,0.07)',
                transform: isOn ? 'translateY(-2px)' : 'none',
                boxShadow: isOn ? '0 8px 24px rgba(61,26,94,0.25)' : '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div style={styles.cardTop}>
                <span style={styles.toolEmoji} aria-hidden="true">{tool.emoji}</span>
                <span style={{
                  ...styles.togglePill,
                  background: isOn ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)',
                  color: isOn ? '#fff' : 'var(--text-mid)',
                }}>
                  {isOn ? 'ON' : 'OFF'}
                </span>
              </div>
              <h3 style={{ ...styles.toolName, color: isOn ? '#fff' : 'var(--text-dark)' }}>
                {tool.label}
              </h3>
              <p style={{ ...styles.toolDesc, color: isOn ? 'rgba(255,255,255,0.82)' : 'var(--text-mid)' }}>
                {tool.desc}
              </p>
            </button>
          )
        })}
      </div>

      <div style={styles.insightCallout}>
        <span style={styles.insightEmoji} aria-hidden="true">💙</span>
        <div>
          <h3 style={styles.insightTitle}>Our Commitment to Every Learner</h3>
          <p style={styles.insightBody}>
            22% of KS2 pupils in the UK have identified SEN — and most educational apps simply ignore them.
            My Amazing Learner is built from day one with accessibility as a first-class feature, not an afterthought.
            We also offer a dedicated{' '}
            <a
              href="https://myamazinglearner.co.uk/collections/sen-resources"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.insightLink}
            >
              SEN physical resources collection
            </a>.
          </p>
        </div>
      </div>

    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 0' },
  header: {},
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '8px' },
  sub: { color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '680px', marginBottom: '12px' },
  activeBanner: {
    display: 'inline-flex', alignItems: 'center', gap: '12px',
    background: 'rgba(78,205,196,0.12)', border: '1px solid rgba(78,205,196,0.4)',
    borderRadius: 'var(--radius-pill)', padding: '8px 16px',
    fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)',
  },
  clearBtn: {
    background: 'transparent', border: 'none', color: 'var(--coral)',
    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
    textDecoration: 'underline', padding: '0', minHeight: '44px',
    fontFamily: "'Nunito', sans-serif",
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' },
  card: {
    display: 'flex', flexDirection: 'column', gap: '8px',
    padding: '20px', borderRadius: 'var(--radius-card)',
    border: '2px solid', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s ease', minHeight: '44px',
    fontFamily: "'Nunito', sans-serif",
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  toolEmoji: { fontSize: '2rem' },
  togglePill: {
    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em',
    padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase',
  },
  toolName: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.05rem', margin: 0 },
  toolDesc: { fontSize: '0.875rem', lineHeight: 1.6, margin: 0 },
  insightCallout: {
    background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)',
    borderRadius: 'var(--radius-card)', padding: '28px 24px',
    display: 'flex', gap: '20px', alignItems: 'flex-start',
  },
  insightEmoji: { fontSize: '2.5rem', flexShrink: 0 },
  insightTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#fff', fontSize: '1.1rem', marginBottom: '8px' },
  insightBody: { color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: 1.7 },
  insightLink: { color: 'var(--gold)', textDecoration: 'underline' },
}
