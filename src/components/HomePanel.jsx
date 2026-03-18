import { useState } from 'react'
import { MARKET_STATS, MARKET_GAPS } from '../data/marketData'
import { getTodaysChallenge } from '../data/dailyChallenges'
import { addStar, hasAnsweredTodaysChallenge, setDailyChallengedDate } from '../utils/storage'

export default function HomePanel({ mode, onTabChange, childName, stars, streak, onStarsChange }) {
  const isChild = mode === 'child'
  return (
    <div className="panel-enter">
      {isChild
        ? <ChildHome onTabChange={onTabChange} childName={childName} stars={stars} streak={streak} onStarsChange={onStarsChange} />
        : <ParentHome onTabChange={onTabChange} childName={childName} stars={stars} streak={streak} onStarsChange={onStarsChange} />
      }
    </div>
  )
}

/* ── Daily Challenge ────────────────────────────────────────── */
function DailyChallenge({ mode, onStarsChange }) {
  const challenge = getTodaysChallenge()
  const [selected, setSelected] = useState(null)
  const [answered] = useState(() => hasAnsweredTodaysChallenge())
  const isChild = mode === 'child'

  function pick(opt) {
    if (selected || answered) return
    setSelected(opt)
    setDailyChallengedDate()
    if (opt === challenge.answer) {
      addStar()
      onStarsChange()
    }
  }

  const correct = selected === challenge.answer
  const wrong   = selected && !correct

  return (
    <div style={dc.card}>
      <div style={dc.badge}>✨ Daily Challenge — {challenge.subject}</div>
      <p style={dc.question}>{challenge.q}</p>

      {answered && !selected ? (
        <p style={dc.done}>Already answered today — come back tomorrow! 🌅</p>
      ) : (
        <div style={dc.opts}>
          {challenge.options.map((opt) => {
            let bg = 'rgba(255,255,255,0.6)'
            if (selected) {
              if (opt === challenge.answer) bg = 'rgba(78,205,196,0.3)'
              else if (opt === selected)    bg = 'rgba(255,107,107,0.3)'
            }
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                disabled={!!selected}
                style={{ ...dc.optBtn, background: bg }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <p style={{ ...dc.result, color: correct ? '#1a6b67' : '#b22222' }}>
          {correct
            ? (isChild ? 'Brilliant! +1 star ⭐' : `Correct! +1 star earned.`)
            : (isChild ? `Not quite — the answer was ${challenge.answer} 💛` : `The answer was ${challenge.answer}.`)}
        </p>
      )}
    </div>
  )
}

/* ── Parent Home ────────────────────────────────────────────── */
function ParentHome({ onTabChange, childName, stars, streak, onStarsChange }) {
  const name = childName || 'your learner'
  return (
    <div style={s.section}>
      {/* Welcome + streak */}
      <div style={s.welcomeCard}>
        <div style={s.welcomeTop}>
          <div>
            <h2 style={{ ...s.heading, color: 'var(--plum)' }}>
              Welcome back{childName ? `, ${childName}&apos;s parent` : ''}! 🦉
            </h2>
            <p style={s.intro}>
              Track {name}&apos;s learning, chat with Sparky, and explore activities matched to their level.
            </p>
          </div>
          {streak > 0 && (
            <div style={s.streakBadge}>
              <span style={s.streakFlame}>🔥</span>
              <span style={s.streakNum}>{streak}</span>
              <span style={s.streakLabel}>day streak</span>
            </div>
          )}
        </div>
        <div style={s.quickStats}>
          <div style={s.statPill}>⭐ {stars} stars earned</div>
          <button className="btn btn-primary" onClick={() => onTabChange(1)} style={{ fontSize: '0.875rem' }}>
            Open Sparky 🔮
          </button>
        </div>
      </div>

      {/* Daily challenge */}
      <DailyChallenge mode="parent" onStarsChange={onStarsChange} />

      {/* Market Stats */}
      <div>
        <h3 style={{ ...s.sectionTitle, color: 'var(--plum)' }}>Market Opportunity</h3>
        <div style={s.statsGrid}>
          {MARKET_STATS.map((stat) => (
            <div key={stat.id} className="card" style={{ ...s.statCard, borderTop: `4px solid ${stat.colour}` }}>
              <div style={{ ...s.statValue, color: stat.colour }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
              <div style={s.statSub}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gaps */}
      <div>
        <h3 style={{ ...s.sectionTitle, color: 'var(--plum)' }}>Where MAL Wins</h3>
        <div style={s.gapsGrid}>
          {MARKET_GAPS.map((gap) => (
            <div key={gap.id} className="card" style={{ ...s.gapCard, borderLeft: `4px solid ${gap.colour}` }}>
              <span style={{ ...s.gapTag, background: gap.colour }}>{gap.tag}</span>
              <h4 style={s.gapTitle}>{gap.title}</h4>
              <p style={s.gapDesc}>{gap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Shop Banner */}
      <div style={s.shopBanner}>
        <div>
          <h3 style={s.shopHeading}>Explore the MAL Shop</h3>
          <p style={s.shopDesc}>Laminated worksheets, velcro mats, personalised literacy packs — paired with this app.</p>
        </div>
        <a href="https://myamazinglearner.co.uk" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ flexShrink: 0 }}>
          Visit Shop →
        </a>
      </div>
    </div>
  )
}

/* ── Child Home ─────────────────────────────────────────────── */
function ChildHome({ onTabChange, childName, stars, streak, onStarsChange }) {
  const greeting = childName ? `Hi ${childName}!` : 'Hi there!'
  const activities = [
    { label: '🔮 Chat with Sparky', tab: 1, bg: 'var(--violet)', desc: 'Ask me anything!' },
    { label: '🧩 Play a Quiz',      tab: 2, bg: 'var(--coral)',  desc: 'Win medals and badges!' },
    { label: '🌱 See Progress',     tab: 3, bg: 'var(--mint)',   desc: 'Watch yourself grow!' },
    { label: '🪡 Try a Craft',      tab: 4, bg: 'var(--gold)',   desc: 'Make something amazing!' },
    { label: '🎖️ My Rewards',      tab: 5, bg: 'var(--plum)',   desc: 'Collect all 8 badges!' },
    { label: '🌈 SEN Tools',        tab: 6, bg: 'var(--sky)',    desc: 'Learning your way!' },
  ]

  return (
    <div style={s.section}>
      <div style={s.childWelcome}>
        <span style={s.childEmoji} aria-hidden="true">🦄</span>
        <h2 style={{ ...s.heading, color: 'var(--coral)' }}>{greeting} Ready to learn? 🚀</h2>
        <div style={s.childStats}>
          {stars > 0 && <span style={s.statPill}>⭐ {stars} stars</span>}
          {streak > 1 && <span style={{ ...s.statPill, background: 'var(--coral)' }}>🔥 {streak} day streak!</span>}
        </div>
      </div>

      {/* Daily challenge */}
      <DailyChallenge mode="child" onStarsChange={onStarsChange} />

      <div style={s.activitiesGrid}>
        {activities.map((act) => (
          <button
            key={act.tab}
            onClick={() => onTabChange(act.tab)}
            style={{ ...s.activityCard, background: act.bg }}
            aria-label={`Go to ${act.label}`}
          >
            <span style={s.activityLabel}>{act.label}</span>
            <span style={s.activityDesc}>{act.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  section: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px 0' },
  welcomeCard: { background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '28px 32px' },
  welcomeTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' },
  heading: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '8px' },
  intro: { color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '560px' },
  streakBadge: {
    background: 'linear-gradient(135deg, #FF6B6B, #FFB347)',
    borderRadius: 'var(--radius-card)', padding: '12px 16px', textAlign: 'center',
    flexShrink: 0, minWidth: '80px',
  },
  streakFlame: { fontSize: '1.5rem', display: 'block' },
  streakNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#fff', fontSize: '1.75rem', display: 'block', lineHeight: 1 },
  streakLabel: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, textTransform: 'uppercase' },
  quickStats: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  statPill: {
    background: 'rgba(255,179,71,0.15)', color: 'var(--text-dark)',
    padding: '6px 14px', borderRadius: 'var(--radius-pill)',
    fontWeight: 700, fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif",
  },
  sectionTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', marginBottom: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' },
  statCard: { textAlign: 'center' },
  statValue: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px' },
  statLabel: { fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dark)', marginBottom: '2px' },
  statSub: { fontSize: '0.75rem', color: 'var(--text-mid)' },
  gapsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' },
  gapCard: { display: 'flex', flexDirection: 'column', gap: '8px' },
  gapTag: { display: 'inline-block', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-start' },
  gapTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' },
  gapDesc: { fontSize: '0.825rem', color: 'var(--text-mid)', lineHeight: 1.6 },
  shopBanner: {
    background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)',
    borderRadius: 'var(--radius-card)', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
  },
  shopHeading: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#fff', fontSize: '1.15rem', marginBottom: '6px' },
  shopDesc: { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', maxWidth: '480px' },
  childWelcome: { textAlign: 'center', padding: '8px 0' },
  childEmoji: { fontSize: '3.5rem', display: 'block', marginBottom: '12px' },
  childStats: { display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' },
  activitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' },
  activityCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '24px 16px', borderRadius: 'var(--radius-card)', border: 'none', cursor: 'pointer',
    color: '#fff', minHeight: '110px', boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease', fontFamily: "'Nunito', sans-serif",
  },
  activityLabel: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem' },
  activityDesc: { fontSize: '0.8rem', opacity: 0.9 },
}

const dc = {
  card: {
    background: 'linear-gradient(135deg, #fff 0%, #f8f0ff 100%)',
    borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-small)',
    padding: '24px 28px', border: '2px solid rgba(107,63,160,0.12)',
  },
  badge: {
    display: 'inline-block', background: 'var(--violet)', color: '#fff',
    fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px',
    borderRadius: 'var(--radius-pill)', marginBottom: '12px', letterSpacing: '0.04em',
  },
  question: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1.1rem', marginBottom: '16px' },
  opts: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  optBtn: {
    padding: '10px 20px', borderRadius: 'var(--radius-pill)',
    border: '2px solid rgba(107,63,160,0.15)', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.9rem',
    transition: 'background 0.2s ease', minHeight: '44px',
  },
  result: { marginTop: '12px', fontWeight: 700, fontSize: '0.95rem' },
  done: { color: 'var(--text-mid)', fontSize: '0.9rem', fontStyle: 'italic' },
}
