export default function SENPanel({ mode }) {
  return (
    <div className="panel-enter" style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.avatar} aria-hidden="true">💙</span>
        <h2 style={styles.title}>SEN Tools</h2>
        <p style={styles.desc}>
          {mode === 'child'
            ? 'Special tools to help you learn in the way that works best for you! 💙'
            : '6 accessibility tools: Read Aloud, High Contrast, Extra Time, Chunked Tasks, Visual Symbols, Calm Mode. Full WCAG AA compliance. Coming in Phase 3.'}
        </p>
        <div style={styles.pill}>Phase 3</div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { padding: '60px 0', display: 'flex', justifyContent: 'center' },
  card: {
    background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)',
    padding: '48px 32px', textAlign: 'center', maxWidth: '480px', width: '100%',
  },
  avatar: { fontSize: '3.5rem', display: 'block', marginBottom: '16px' },
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--sky)', fontSize: '1.75rem', marginBottom: '12px' },
  desc: { color: 'var(--text-mid)', lineHeight: 1.7 },
  pill: {
    display: 'inline-block', marginTop: '20px', padding: '6px 18px',
    background: 'var(--sky)', color: 'var(--text-dark)', borderRadius: 'var(--radius-pill)',
    fontSize: '0.8rem', fontWeight: 700,
  },
}
