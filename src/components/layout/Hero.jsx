export default function Hero({ mode }) {
  const isChild = mode === 'child'

  return (
    <section
      style={{
        ...styles.hero,
        background: isChild
          ? 'linear-gradient(135deg, var(--coral) 0%, var(--gold) 60%, #FFE066 100%)'
          : 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 60%, #9B59B6 100%)',
      }}
      aria-label="Hero banner"
    >
      <div className="container" style={styles.inner}>
        <span style={styles.icon} aria-hidden="true">
          {isChild ? '🚀' : '🔭'}
        </span>
        <div>
          <h1 style={styles.headline}>
            {isChild
              ? 'Time to be an Amazing Learner! 🚀'
              : 'Inspire, Track & Empower Every Learner'}
          </h1>
          <p style={styles.sub}>
            {isChild
              ? 'Let\'s learn something amazing today! 🚀'
              : 'The AI-powered companion to your My Amazing Learner resources.'}
          </p>
        </div>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    padding: '40px 0',
    transition: 'background 0.4s ease',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  icon: {
    fontSize: '3.5rem',
    flexShrink: 0,
  },
  headline: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    color: '#fff',
    marginBottom: '8px',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  sub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '1rem',
    fontWeight: 500,
  },
}
