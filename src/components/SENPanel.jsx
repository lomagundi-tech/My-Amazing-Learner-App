const SEN_TOOLS = [
  { id: 'read_aloud',    tool: 'Read Aloud',     emoji: '🔊', bg: '#E8F5E9', desc: 'Every word spoken clearly with highlighted text tracking.' },
  { id: 'high_contrast', tool: 'High Contrast',  emoji: '🔆', bg: '#FFF8E1', desc: 'Bold visual mode for visual processing needs. Increases contrast.' },
  { id: 'extra_time',    tool: 'Extra Time',      emoji: '⏳', bg: '#E3F2FD', desc: 'Adjustable timers — never rushed. All quiz activities run at your pace.' },
  { id: 'chunked_tasks', tool: 'Chunked Tasks',   emoji: '🧩', bg: '#F3E5F5', desc: 'Break any activity into small, manageable steps to reduce cognitive load.' },
  { id: 'visual_symbols',tool: 'Visual Symbols',  emoji: '🖼️', bg: '#FCE4EC', desc: 'Widgit-style pictogram symbols alongside every instruction.' },
  { id: 'calm_mode',     tool: 'Calm Mode',       emoji: '🌿', bg: '#E8F5E9', desc: 'Reduced animations and sounds for sensory processing needs.' },
]

export default function SENPanel({ mode }) {
  return (
    <div className="panel-enter" style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>🌈 Accessibility & SEN Tools</h2>
        <p style={styles.sub}>
          {mode === 'parent'
            ? 'My Amazing Learner is designed for every learner. These tools support children with a range of additional needs — from dyslexia to sensory processing differences.'
            : 'These special tools help you learn in the way that works best for you! 💙'}
        </p>
      </div>

      <div style={styles.grid}>
        {SEN_TOOLS.map((tool) => (
          <div key={tool.id} className="card" style={{ ...styles.card, background: tool.bg }}>
            <span style={styles.toolEmoji} aria-hidden="true">{tool.emoji}</span>
            <h3 style={styles.toolName}>{tool.tool}</h3>
            <p style={styles.toolDesc}>{tool.desc}</p>
          </div>
        ))}
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
  wrapper: { display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 0' },
  header: {},
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '8px' },
  sub: { color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '680px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  card: {
    display: 'flex', flexDirection: 'column', gap: '10px',
    borderRadius: 'var(--radius-card) !important',
    boxShadow: 'none !important',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  toolEmoji: { fontSize: '2rem' },
  toolName: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--text-dark)', fontSize: '1.05rem' },
  toolDesc: { color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.6 },
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
