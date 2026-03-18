export default function AITutor({ mode }) {
  return (
    <div className="panel-enter" style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.avatar} aria-hidden="true">🔮</span>
        <h2 style={styles.title}>Sparky AI Tutor</h2>
        <p style={styles.desc}>
          {mode === 'child'
            ? "Hi! I'm Sparky! I'll be ready to help you learn really soon! ⭐"
            : 'Sparky AI Tutor — coming in Phase 2. Full Claude API integration with parent and child mode prompts.'}
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
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.75rem', marginBottom: '12px' },
  desc: { color: 'var(--text-mid)', lineHeight: 1.7 },
  pill: {
    display: 'inline-block', marginTop: '20px', padding: '6px 18px',
    background: 'var(--violet)', color: '#fff', borderRadius: 'var(--radius-pill)',
    fontSize: '0.8rem', fontWeight: 700,
  },
}
