export default function CraftsPanel({ mode }) {
  return (
    <div className="panel-enter" style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.avatar} aria-hidden="true">🎨</span>
        <h2 style={styles.title}>Craft Activities</h2>
        <p style={styles.desc}>
          {mode === 'child'
            ? 'Fun crafts that go with your Amazing Learner kits! Get ready to make something brilliant! 🌈'
            : '6 craft activity cards linking digital activities to physical MAL products — with live shop links. Coming in Phase 2.'}
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
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--gold)', fontSize: '1.75rem', marginBottom: '12px' },
  desc: { color: 'var(--text-mid)', lineHeight: 1.7 },
  pill: {
    display: 'inline-block', marginTop: '20px', padding: '6px 18px',
    background: 'var(--gold)', color: 'var(--text-dark)', borderRadius: 'var(--radius-pill)',
    fontSize: '0.8rem', fontWeight: 700,
  },
}
