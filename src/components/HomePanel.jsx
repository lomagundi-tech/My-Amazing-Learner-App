import { MARKET_STATS, MARKET_GAPS } from '../data/marketData'

export default function HomePanel({ mode, onTabChange }) {
  const isChild = mode === 'child'

  return (
    <div className="panel-enter">
      {isChild ? (
        <ChildHome onTabChange={onTabChange} />
      ) : (
        <ParentHome onTabChange={onTabChange} />
      )}
    </div>
  )
}

/* ── Parent Home ───────────────────────────────────────────── */

function ParentHome({ onTabChange }) {
  return (
    <div style={styles.section}>
      {/* Welcome */}
      <div style={styles.welcomeCard}>
        <h2 style={{ ...styles.heading, color: 'var(--plum)' }}>
          Welcome to My Amazing Learner
        </h2>
        <p style={styles.intro}>
          Your all-in-one digital companion to the MAL physical product range. Track progress,
          chat with Sparky the AI tutor, and discover activities perfectly matched to your child&apos;s needs.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => onTabChange(1)}
          style={{ marginTop: '16px' }}
        >
          Meet Sparky the AI Tutor 🤖
        </button>
      </div>

      {/* Market Stats Strip */}
      <div>
        <h3 style={{ ...styles.sectionTitle, color: 'var(--plum)' }}>Market Opportunity</h3>
        <div style={styles.statsGrid}>
          {MARKET_STATS.map((stat) => (
            <div key={stat.id} className="card" style={{ ...styles.statCard, borderTop: `4px solid ${stat.colour}` }}>
              <div style={{ ...styles.statValue, color: stat.colour }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
              <div style={styles.statSub}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gaps Grid */}
      <div>
        <h3 style={{ ...styles.sectionTitle, color: 'var(--plum)' }}>Where MAL Wins</h3>
        <div style={styles.gapsGrid}>
          {MARKET_GAPS.map((gap) => (
            <div key={gap.id} className="card" style={{ ...styles.gapCard, borderLeft: `4px solid ${gap.colour}` }}>
              <span style={{ ...styles.gapTag, background: gap.colour }}>{gap.tag}</span>
              <h4 style={styles.gapTitle}>{gap.title}</h4>
              <p style={styles.gapDesc}>{gap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Promo Banner */}
      <div style={styles.shopBanner}>
        <div>
          <h3 style={styles.shopHeading}>Explore the MAL Shop</h3>
          <p style={styles.shopDesc}>
            Laminated worksheets, velcro mats, personalised literacy packs and more — perfectly paired with this app.
          </p>
        </div>
        <a
          href="https://myamazinglearner.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold"
          style={{ flexShrink: 0 }}
        >
          Visit Shop →
        </a>
      </div>
    </div>
  )
}

/* ── Child Home ────────────────────────────────────────────── */

function ChildHome({ onTabChange }) {
  const activities = [
    { label: '🤖 Chat with Sparky', tab: 1, bg: 'var(--violet)', desc: 'Ask me anything!' },
    { label: '🎯 Play a Quiz',      tab: 2, bg: 'var(--coral)',  desc: 'Win stars and badges!' },
    { label: '📊 See Progress',     tab: 3, bg: 'var(--mint)',   desc: 'Watch your bars grow!' },
    { label: '🎨 Try a Craft',      tab: 4, bg: 'var(--gold)',   desc: 'Make something amazing!' },
    { label: '⭐ My Rewards',       tab: 5, bg: 'var(--plum)',   desc: 'Collect all 8 badges!' },
    { label: '💙 SEN Tools',        tab: 6, bg: 'var(--sky)',    desc: 'Learning your way!' },
  ]

  return (
    <div style={styles.section}>
      <div style={styles.childWelcome}>
        <span style={styles.childEmoji} aria-hidden="true">🌟</span>
        <h2 style={{ ...styles.heading, color: 'var(--coral)' }}>
          Hi there, Amazing Learner!
        </h2>
        <p style={{ ...styles.intro, color: 'var(--text-mid)' }}>
          What would you like to do today? Pick an activity below!
        </p>
      </div>

      <div style={styles.activitiesGrid}>
        {activities.map((act) => (
          <button
            key={act.tab}
            onClick={() => onTabChange(act.tab)}
            style={{ ...styles.activityCard, background: act.bg }}
            aria-label={`Go to ${act.label}`}
          >
            <span style={styles.activityLabel}>{act.label}</span>
            <span style={styles.activityDesc}>{act.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Styles ────────────────────────────────────────────────── */

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
    padding: '40px 0',
  },
  welcomeCard: {
    background: '#fff',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: '32px',
  },
  heading: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    marginBottom: '12px',
  },
  intro: {
    fontSize: '1rem',
    color: 'var(--text-mid)',
    lineHeight: 1.7,
    maxWidth: '680px',
  },
  sectionTitle: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    fontSize: '1.25rem',
    marginBottom: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  statCard: {
    textAlign: 'center',
  },
  statValue: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: '2rem',
    marginBottom: '4px',
  },
  statLabel: {
    fontWeight: 700,
    fontSize: '0.875rem',
    color: 'var(--text-dark)',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '0.8rem',
    color: 'var(--text-mid)',
  },
  gapsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  gapCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  gapTag: {
    display: 'inline-block',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    alignSelf: 'flex-start',
  },
  gapTitle: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--text-dark)',
  },
  gapDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-mid)',
    lineHeight: 1.6,
  },
  shopBanner: {
    background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)',
    borderRadius: 'var(--radius-card)',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
  },
  shopHeading: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    color: '#fff',
    fontSize: '1.25rem',
    marginBottom: '8px',
  },
  shopDesc: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.9rem',
    maxWidth: '500px',
  },
  childWelcome: {
    textAlign: 'center',
    padding: '16px 0',
  },
  childEmoji: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '16px',
  },
  activitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  activityCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '28px 20px',
    borderRadius: 'var(--radius-card)',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    minHeight: '120px',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    fontFamily: "'Nunito', sans-serif",
  },
  activityLabel: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  activityDesc: {
    fontSize: '0.875rem',
    opacity: 0.9,
  },
}
