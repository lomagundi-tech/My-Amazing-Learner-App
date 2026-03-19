import ModeToggle from './ModeToggle'

export default function Header({ mode, onToggle, streak }) {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.sparkIcon} aria-hidden="true">💫</span>
          <span style={styles.wordmark} className="header-wordmark">My Amazing Learner</span>
        </div>
        <div style={styles.right}>
          {streak > 0 && (
            <div style={styles.streakBadge} aria-label={`${streak} day learning streak`} title={`${streak}-day streak!`}>
              <span aria-hidden="true">🔥</span>
              <span style={styles.streakNum}>{streak}</span>
            </div>
          )}
          <ModeToggle mode={mode} onToggle={onToggle} />
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(255, 249, 240, 0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(61, 26, 94, 0.08)',
    padding: '12px 0',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  sparkIcon: {
    fontSize: '1.75rem',
    display: 'inline-block',
    animation: 'spin 6s linear infinite',
  },
  wordmark: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: '1.25rem',
    color: 'var(--plum)',
    lineHeight: 1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  streakBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'linear-gradient(135deg, #FF6B6B, #FFB347)',
    borderRadius: 'var(--radius-pill)',
    padding: '4px 10px',
    fontSize: '0.85rem',
  },
  streakNum: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    color: '#fff',
    fontSize: '0.9rem',
    lineHeight: 1,
  },
}
