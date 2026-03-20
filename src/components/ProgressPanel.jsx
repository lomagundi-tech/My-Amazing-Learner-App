import { useEffect, useState } from 'react'
import { PROGRESS_AREAS } from '../data/progressData'
import { BADGES } from '../data/badgesData'
import { CRAFTS } from '../data/craftsData'
import { getMoodHistory, getStars, getBadges, getCraftsCompleted, getStreak, getSubjectProgress } from '../utils/storage'

// Mood emoji map (index 1–5)
const MOODS = ['', '😔', '😕', '😐', '🙂', '😄']

// Enhancement B1 — dynamic strength headline (no AI call, pure conditional logic)
const STRENGTH_HEADLINES = {
  reading:   (name) => `${name} is a Reading Champion! 📚`,
  numeracy:  (name) => `${name} is a Maths Whiz! 🔢`,
  writing:   (name) => `${name} is a Writing Star! ✏️`,
  wellbeing: (name) => `${name} loves Wellbeing! 💛`,
  creative:  (name) => `${name} is a Creative Star! 🎨`,
  science:   (name) => `${name} is a Science Explorer! 🔭`,
}

function getStrengthHeadline(name, areas) {
  const strongest = [...areas].sort((a, b) => b.pct - a.pct)[0]
  const fn = STRENGTH_HEADLINES[strongest.id]
  return fn ? fn(name) : `${name} is an Amazing Learner! 🌟`
}

// Enhancement B2 — Sparky pre-written messages (condition-based, no AI call)
function getSparkyMessage(name, badgeCount, streak) {
  let msg
  if (badgeCount <= 2) {
    msg = `You've made an amazing start, ${name}! Every expert was once a beginner. Keep going! — Sparky ⭐`
  } else if (badgeCount <= 5) {
    msg = `Look at all those badges, ${name}! You're becoming a true Amazing Learner. I'm so proud of you! — Sparky ⭐⭐`
  } else if (badgeCount <= 8) {
    msg = `${name}, you are absolutely incredible! Your dedication to learning is your superpower. The sky is the limit! — Sparky ⭐⭐⭐`
  } else {
    msg = `${name}, you are a LEGEND! You've unlocked almost every badge in the app. You inspire me every single day! — Sparky ⭐⭐⭐⭐`
  }
  if (streak >= 7) {
    msg += ` And ${streak} days in a row? That's the spirit of a true champion!`
  }
  return msg
}

export default function ProgressPanel({ mode, stars, childName }) {
  const [animated, setAnimated] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const isChild = mode === 'child'
  const name = childName || 'Your Amazing Learner'
  const displayName = childName || 'your learner'

  // Real data sources
  const subjectProgress = getSubjectProgress()
  const moodHistory = getMoodHistory()
  const craftsCompleted = getCraftsCompleted()

  // Calculate progress purely from activity — no dummy base values
  const progressAreas = PROGRESS_AREAS.map((area) => {
    let pct = 0
    if (area.subjectKey && area.maxAnswers) {
      pct = Math.min(Math.round(((subjectProgress[area.subjectKey] ?? 0) / area.maxAnswers) * 100), 100)
    } else if (area.id === 'writing') {
      pct = Math.min(Math.round((craftsCompleted.length / 6) * 100), 100)
    } else if (area.id === 'wellbeing') {
      pct = Math.min(Math.round((moodHistory.length / 20) * 100), 100)
    }
    return { ...area, pct }
  })

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Generate QR code for print report (Enhancement B3)
  // TODO: Review disclaimer wording if real performance tracking is added in a future phase — wording will need updating at that point.
  useEffect(() => {
    import('qrcode').then((mod) => {
      const QRCode = mod.default || mod
      QRCode.toDataURL('https://myamazinglearner.co.uk/collections/all', {
        width: 96,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {})
    }).catch(() => {})
  }, [])

  // Last 7 days of mood data for parent view
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toDateString()
    return moodHistory.find((m) => m.date === d) ?? { date: d, mood: null }
  }).reverse()

  // Data for print report
  const earnedBadgeIds = getBadges()
  const streak = getStreak()
  const totalStars = getStars()
  const earnedBadgeCount = earnedBadgeIds.length
  const strengthHeadline = getStrengthHeadline(name, progressAreas)
  const sparkyMessage = getSparkyMessage(name, earnedBadgeCount, streak)
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  function printReport() { window.print() }

  return (
    <div className="panel-enter" style={styles.wrapper}>

      {isChild ? (
        // ── Child view ──────────────────────────────────────────
        <div style={styles.childBanner}>
          <span style={styles.bigEmoji} aria-hidden="true">🌱</span>
          <h2 style={styles.childTitle}>You are growing so much!</h2>
          <p style={styles.childSub}>
            Keep learning every day and watch your bars grow! You have earned <strong>{stars} stars</strong> so far! 🎖️
          </p>
        </div>
      ) : (
        // ── Parent view header ───────────────────────────────────
        <div style={styles.parentHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Learning Progress</h2>
            <p style={styles.parentSub}>
              Here&apos;s how {displayName} is doing across all learning areas.
            </p>
          </div>
          <button onClick={printReport} style={styles.printBtn} aria-label="Print progress report">
            🖨️ Print Report
          </button>
        </div>
      )}

      {/* Progress bars */}
      <div style={styles.barsWrapper}>
        {progressAreas.map((area) => (
          <div key={area.id} style={styles.barRow}>
            <div style={styles.barLabel}>
              <span aria-hidden="true">{area.emoji}</span>
              <span style={styles.barName}>{area.label}</span>
              {!isChild && <span style={styles.barPct}>{area.pct}%</span>}
            </div>
            <div style={styles.barTrack}>
              <div
                style={{
                  ...styles.barFill,
                  width: animated ? `${area.pct}%` : '0%',
                  background: area.colour,
                }}
              />
            </div>
            {!isChild && area.id === 'science' && (
              <p style={styles.insight}>
                💡 Science has the most room to grow — try the Sparky science questions!
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Parent: mood trend */}
      {!isChild && (
        <div style={styles.moodCard}>
          <h3 style={styles.moodTitle}>
            Mood This Week
            <span style={styles.moodLink}>
              &nbsp;— powered by{' '}
              <a href="https://myamazinglearner.co.uk/products/feelings-gauge-worksheet" target="_blank" rel="noopener noreferrer" style={styles.moodShopLink}>
                Feelings Gauge
              </a>
            </span>
          </h3>
          <div style={styles.moodRow}>
            {last7.map((entry, i) => (
              <div key={i} style={styles.moodDay}>
                <span style={styles.moodEmoji}>{entry.mood ? MOODS[entry.mood] : '–'}</span>
                <span style={styles.moodDate}>
                  {new Date(entry.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FEATURE 8: Printable Progress Report ─────────────────
          print-only class: hidden on screen, visible in @media print.
          Full confirmed spec: Decision A (window.print), B (layout + B1/B2/B3), C (disclaimer).
          Placeholder "Email to Teacher" button included for future sprint wiring.
      ──────────────────────────────────────────────────────── */}
      {/* ── FEATURE 8: Printable Progress Report — Certificate Edition ── */}
      <div id="print-report" className="print-only">
        <div style={pr.cert}>

          {/* ── TOP HEADER BAND ── */}
          <div style={pr.headerBand}>
            <div style={pr.headerInner}>
              <span style={pr.headerLogo} aria-hidden="true">💫 My Amazing Learner</span>
              <span style={pr.headerDate}>{today}</span>
            </div>
          </div>

          {/* ── HERO: name + stars + strength ── */}
          <div style={pr.hero}>
            <div style={pr.heroStars} aria-hidden="true">⭐ ⭐ ⭐ ⭐ ⭐</div>
            <h1 style={pr.heroName}>{name}</h1>
            <p style={pr.heroSub}>Amazing Learning Journey</p>
            <p style={pr.heroStrength}>{strengthHeadline}</p>
          </div>

          {/* ── STATS STRIP ── */}
          <div style={pr.statsStrip}>
            <div style={{ ...pr.statBox, background: '#FFB347' }}>
              <div style={pr.statNum}>{totalStars}</div>
              <div style={pr.statLbl}>⭐ Stars</div>
            </div>
            <div style={{ ...pr.statBox, background: '#6B3FA0' }}>
              <div style={pr.statNum}>{earnedBadgeCount}/11</div>
              <div style={pr.statLbl}>🏅 Badges</div>
            </div>
            <div style={{ ...pr.statBox, background: '#FF6B6B' }}>
              <div style={pr.statNum}>{streak}</div>
              <div style={pr.statLbl}>🔥 Day Streak</div>
            </div>
            <div style={{ ...pr.statBox, background: '#4ECDC4' }}>
              <div style={pr.statNum}>{moodHistory.length}</div>
              <div style={pr.statLbl}>😊 Check-ins</div>
            </div>
          </div>

          {/* ── TWO-COLUMN BODY ── */}
          <div style={pr.body}>

            {/* LEFT: progress bars + crafts */}
            <div style={pr.col}>
              <div style={pr.sectionCard}>
                <h2 style={pr.sectionTitle}>📊 Learning Progress</h2>
                {progressAreas.map((area) => (
                  <div key={area.id} style={pr.barRow}>
                    <div style={pr.barMeta}>
                      <span style={pr.barLabel}>{area.emoji} {area.label}</span>
                      <span style={pr.barPct}>{area.pct}%</span>
                    </div>
                    <div style={pr.barTrack}>
                      <div style={{ ...pr.barFill, width: `${area.pct}%`, background: area.colour.replace('var(--mint)', '#4ECDC4').replace('var(--violet)', '#6B3FA0').replace('var(--sky)', '#A8E6CF').replace('var(--gold)', '#FFB347').replace('var(--coral)', '#FF6B6B') }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={pr.sectionCard}>
                <h2 style={pr.sectionTitle}>🪡 Craft Checklist</h2>
                {CRAFTS.map((craft) => {
                  const done = craftsCompleted.includes(craft.id)
                  return (
                    <div key={craft.id} style={pr.craftItem}>
                      <span style={{ ...pr.craftTick, color: done ? '#2d7a2d' : '#bbb' }} aria-hidden="true">{done ? '✅' : '○'}</span>
                      <span style={{ ...pr.craftName, color: done ? '#1a0a2e' : '#999' }}>{craft.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT: badges + Sparky */}
            <div style={pr.col}>
              <div style={pr.sectionCard}>
                <h2 style={pr.sectionTitle}>🏅 Badges Collected</h2>
                <div style={pr.badgeGrid}>
                  {BADGES.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id)
                    return (
                      <div key={badge.id} style={{ ...pr.badgeItem, background: isEarned ? '#fff9ee' : '#f5f5f5', border: `2px solid ${isEarned ? '#FFB347' : '#e0e0e0'}`, opacity: isEarned ? 1 : 0.45 }}>
                        <span style={pr.badgeEmoji} aria-hidden="true">{isEarned ? badge.emoji : '○'}</span>
                        <span style={{ ...pr.badgeLabel, color: isEarned ? '#3D1A5E' : '#999' }}>{badge.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sparky message */}
              <div style={pr.sparkyBox}>
                <span style={pr.sparkyIcon} aria-hidden="true">🔮</span>
                <p style={pr.sparkyText}>{sparkyMessage}</p>
              </div>
            </div>
          </div>

          {/* ── FOOTER BAND ── */}
          <div style={pr.footerBand}>
            <div style={pr.footerInner}>
              <div>
                <p style={pr.footerTagline}>Keep being an Amazing Learner! 🚀</p>
                <p style={pr.footerSite}>myamazinglearner.co.uk</p>
              </div>
              <div style={pr.footerRight}>
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="Scan to explore resources" style={pr.qrImg} width={72} height={72} />
                )}
                <p style={pr.qrLabel}>Scan to explore resources</p>
                {/* Email to Teacher — placeholder for future sprint */}
                <button style={pr.emailTeacherBtn} disabled aria-label="Email to Teacher — coming soon">
                  📧 Email to Teacher (coming soon)
                </button>
              </div>
            </div>
          </div>

          {/* DISCLAIMER — Decision C: exact client-approved wording */}
          <p className="print-disclaimer" style={pr.disclaimer}>
            Progress scores reflect your child&apos;s activity within the My Amazing Learner app and are designed as a fun, encouraging learning guide. They are not a formal academic assessment and should not be used as such. For formal progress information, please speak with your child&apos;s class teacher.
          </p>

        </div>
      </div>

    </div>
  )
}

/* ── Screen styles ─────────────────────────────────────────── */
const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 0' },
  childBanner: {
    background: 'linear-gradient(135deg, var(--mint) 0%, var(--sky) 100%)',
    borderRadius: 'var(--radius-card)', padding: '32px', textAlign: 'center',
  },
  bigEmoji: { fontSize: '3rem', display: 'block', marginBottom: '12px' },
  childTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#fff', fontSize: '1.5rem', marginBottom: '8px' },
  childSub: { color: 'rgba(255,255,255,0.95)', fontSize: '1rem' },
  parentHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  sectionTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '4px' },
  parentSub: { color: 'var(--text-mid)', fontSize: '0.95rem' },
  printBtn: {
    padding: '10px 20px', background: 'var(--plum)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.875rem',
    minHeight: '44px', flexShrink: 0,
  },
  barsWrapper: { background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  barRow: { display: 'flex', flexDirection: 'column', gap: '6px' },
  barLabel: { display: 'flex', alignItems: 'center', gap: '8px' },
  barName: { fontWeight: 700, color: 'var(--text-dark)', flex: 1, fontFamily: "'Nunito', sans-serif" },
  barPct: { fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-mid)' },
  barTrack: { height: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '6px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '6px', transition: 'width 1.2s ease' },
  insight: { fontSize: '0.8rem', color: 'var(--violet)', fontStyle: 'italic', margin: 0 },
  moodCard: { background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-small)', padding: '20px 24px' },
  moodTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1rem', marginBottom: '16px' },
  moodLink: { fontFamily: "'Nunito', sans-serif", fontWeight: 400, fontSize: '0.8rem', color: 'var(--text-mid)' },
  moodShopLink: { color: 'var(--violet)', textDecoration: 'underline' },
  moodRow: { display: 'flex', gap: '8px', justifyContent: 'space-between' },
  moodDay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 },
  moodEmoji: { fontSize: '1.5rem' },
  moodDate: { fontSize: '0.65rem', color: 'var(--text-mid)', fontWeight: 600 },
}

/* ── Print report styles — Certificate Edition ─────────────── */
const pr = {
  // Outer certificate wrapper — decorative double border
  cert: {
    background: '#FFF9F0',
    border: '6px solid #3D1A5E',
    outline: '3px solid #FFB347',
    outlineOffset: '-10px',
    fontFamily: "'Nunito', sans-serif",
    minHeight: '270mm',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header band — plum gradient
  headerBand: {
    background: 'linear-gradient(135deg, #3D1A5E 0%, #6B3FA0 100%)',
    padding: '12px 20px',
  },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerLogo: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1rem', color: '#FFB347' },
  headerDate: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },

  // Hero — centred, celebratory
  hero: { textAlign: 'center', padding: '16px 20px 8px', background: '#FFF9F0' },
  heroStars: { fontSize: '1.1rem', letterSpacing: '6px', marginBottom: '6px', color: '#FFB347' },
  heroName: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2rem', color: '#3D1A5E', margin: '0 0 2px' },
  heroSub: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem', color: '#6B3FA0', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 6px' },
  heroStrength: { fontSize: '0.95rem', fontWeight: 700, color: '#FF6B6B', margin: 0, fontStyle: 'italic' },

  // Stats strip — coloured boxes
  statsStrip: { display: 'flex', gap: '0', margin: '12px 20px' },
  statBox: { flex: 1, borderRadius: '10px', padding: '8px 4px', textAlign: 'center', margin: '0 4px' },
  statNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#fff' },
  statLbl: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginTop: '2px' },

  // Two-column body
  body: { display: 'flex', gap: '12px', padding: '0 20px', flex: 1 },
  col: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },

  // Section cards
  sectionCard: { background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid #ede8f5' },
  sectionTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.85rem', color: '#3D1A5E', marginBottom: '8px', paddingBottom: '5px', borderBottom: '2px solid #FFB347' },

  // Progress bars
  barRow: { marginBottom: '6px' },
  barMeta: { display: 'flex', justifyContent: 'space-between', marginBottom: '3px' },
  barLabel: { fontSize: '0.72rem', fontWeight: 700, color: '#1A0A2E' },
  barPct: { fontSize: '0.72rem', fontWeight: 700, color: '#6B3FA0' },
  barTrack: { height: '9px', background: '#f0eaf8', borderRadius: '5px', overflow: 'hidden' },
  barFill: { height: '9px', borderRadius: '5px' },

  // Craft checklist
  craftItem: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' },
  craftTick: { fontSize: '0.85rem', flexShrink: 0 },
  craftName: { fontSize: '0.72rem', fontWeight: 600 },

  // Badges grid
  badgeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' },
  badgeItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '5px 3px', borderRadius: '8px', textAlign: 'center' },
  badgeEmoji: { fontSize: '1.3rem', lineHeight: 1 },
  badgeLabel: { fontSize: '0.6rem', lineHeight: 1.2, fontWeight: 700 },

  // Sparky message
  sparkyBox: {
    background: 'linear-gradient(135deg, #3D1A5E 0%, #6B3FA0 100%)',
    borderRadius: '10px', padding: '12px',
    display: 'flex', gap: '8px', alignItems: 'flex-start',
    flex: 1,
  },
  sparkyIcon: { fontSize: '1.4rem', flexShrink: 0 },
  sparkyText: { fontSize: '0.78rem', lineHeight: 1.6, color: '#fff', fontStyle: 'italic', margin: 0 },

  // Footer band — gold gradient
  footerBand: {
    background: 'linear-gradient(135deg, #FFB347 0%, #FFD93D 100%)',
    padding: '10px 20px',
    marginTop: 'auto',
  },
  footerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  footerTagline: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '0.9rem', color: '#3D1A5E', margin: '0 0 2px' },
  footerSite: { fontSize: '0.7rem', color: '#5a3a00', fontWeight: 600, margin: 0 },
  footerRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' },
  qrImg: { display: 'block', width: '72px', height: '72px', borderRadius: '6px' },
  qrLabel: { fontSize: '0.5rem', color: '#3D1A5E', textAlign: 'center', maxWidth: '72px', lineHeight: 1.3, margin: 0, fontWeight: 600 },
  emailTeacherBtn: {
    fontSize: '0.55rem', padding: '3px 8px', borderRadius: '20px',
    border: '1px solid rgba(61,26,94,0.3)', background: 'rgba(255,255,255,0.5)',
    color: '#3D1A5E', cursor: 'not-allowed', fontFamily: "'Nunito', sans-serif",
  },

  // Disclaimer — Decision C: exact approved wording, 7pt italic
  disclaimer: { fontSize: '6.5pt', fontStyle: 'italic', color: '#888', lineHeight: 1.4, padding: '6px 20px 10px', margin: 0 },
}
