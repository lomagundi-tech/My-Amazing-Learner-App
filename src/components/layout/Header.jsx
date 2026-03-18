import ModeToggle from './ModeToggle'

export default function Header({ mode, onToggle }) {
  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.sparkIcon} aria-hidden="true">💫</span>
          <span style={styles.wordmark} className="header-wordmark">My Amazing Learner</span>
        </div>
        <ModeToggle mode={mode} onToggle={onToggle} />
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
}
