export default function ProgressPanel({ mode }) {
  return (
    <div className="panel-enter" style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.avatar} aria-hidden="true">📊</span>
        <h2 style={styles.title}>Progress Tracker</h2>
        <p style={styles.desc}>
          {mode === 'child'
            ? 'Watch your learning bars grow as you complete activities! 🌱'
            : 'Animated progress bars across 6 learning areas: Reading, Numeracy, Writing, Wellbeing, Creative, Science. Parent AI insights included. Coming in Phase 2.'}
        </p>
        <div style={styles.pill}>Phase 2</div>
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
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--mint)', fontSize: '1.75rem', marginBottom: '12px' },
  desc: { color: 'var(--text-mid)', lineHeight: 1.7 },
  pill: {
    display: 'inline-block', marginTop: '20px', padding: '6px 18px',
    background: 'var(--mint)', color: '#fff', borderRadius: 'var(--radius-pill)',
    fontSize: '0.8rem', fontWeight: 700,
  },
}
