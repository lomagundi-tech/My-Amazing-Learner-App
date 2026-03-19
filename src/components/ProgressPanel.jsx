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

  // Merge base percentages with quiz correct-answer increments (+2% per correct answer, capped at 100%)
  const subjectProgress = getSubjectProgress()
  const progressAreas = PROGRESS_AREAS.map((area) => ({
    ...area,
    pct: area.subjectKey
      ? Math.min(area.pct + (subjectProgress[area.subjectKey] ?? 0) * 2, 100)
      : area.pct,
  }))

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
  const moodHistory = getMoodHistory()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toDateString()
    return moodHistory.find((m) => m.date === d) ?? { date: d, mood: null }
  }).reverse()

  // Data for print report
  const earnedBadgeIds = getBadges()
  const craftsCompleted = getCraftsCompleted()
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
      <div id="print-report" className="print-only">

        {/* HEADER */}
        <div style={pr.header}>
          <div style={pr.headerLogo}>
            <span style={pr.logoEmoji} aria-hidden="true">💫</span>
            <span style={pr.logoText}>My Amazing Learner</span>
          </div>
          <div style={pr.headerTitle}>Progress Report</div>
          <div style={pr.headerDate}>{today}</div>
        </div>

        <hr style={pr.rule} />

        {/* CHILD HERO — Enhancement B1: dynamic strength headline */}
        <div style={pr.heroSection}>
          <h1 style={pr.heroName}>{name}&apos;s Amazing Learning Journey!</h1>
          <p style={pr.heroStrength}>{strengthHeadline}</p>
        </div>

        {/* SUMMARY STRIP */}
        <div style={pr.summaryStrip}>
          <div style={pr.statBox}>
            <div style={pr.statNum}>{totalStars}</div>
            <div style={pr.statLbl}>Stars Earned ⭐</div>
          </div>
          <div style={pr.statBox}>
            <div style={pr.statNum}>{earnedBadgeCount}/11</div>
            <div style={pr.statLbl}>Badges Collected 🏅</div>
          </div>
          <div style={pr.statBox}>
            <div style={pr.statNum}>{streak}</div>
            <div style={pr.statLbl}>Day Streak 🔥</div>
          </div>
          <div style={pr.statBox}>
            <div style={pr.statNum}>{moodHistory.length}</div>
            <div style={pr.statLbl}>Mood Check-ins 😊</div>
          </div>
        </div>

        {/* PROGRESS BARS — greyscale-friendly print colours */}
        <div style={pr.section}>
          <h2 style={pr.sectionHeading}>Learning Progress</h2>
          {progressAreas.map((area) => (
            <div key={area.id} style={pr.barRow}>
              <div style={pr.barMeta}>
                <span>{area.emoji} {area.label}</span>
                <span style={pr.barPct}>{area.pct}%</span>
              </div>
              <div style={pr.barTrack}>
                <div
                  className="print-bar-fill"
                  style={{ ...pr.barFill, width: `${area.pct}%` }}
                />
              </div>
              <div style={pr.barCurriculum}>{area.curriculum}</div>
            </div>
          ))}
        </div>

        {/* BADGES GRID — earned in colour (emoji + name), locked as outlines */}
        <div style={pr.section}>
          <h2 style={pr.sectionHeading}>Badges Collected</h2>
          <div style={pr.badgeGrid}>
            {BADGES.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id)
              return (
                <div key={badge.id} style={{ ...pr.badgeItem, opacity: isEarned ? 1 : 0.35 }}>
                  <span style={pr.badgeEmoji} aria-hidden="true">{isEarned ? badge.emoji : '○'}</span>
                  <span style={pr.badgeLabel}>{badge.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* CRAFT CHECKLIST */}
        <div style={pr.section}>
          <h2 style={pr.sectionHeading}>Craft Activity Checklist</h2>
          <div style={pr.craftList}>
            {CRAFTS.map((craft) => {
              const done = craftsCompleted.includes(craft.id)
              return (
                <div key={craft.id} style={pr.craftItem}>
                  <span style={{ ...pr.craftTick, color: done ? '#2d7a2d' : '#999' }} aria-hidden="true">
                    {done ? '✅' : '○'}
                  </span>
                  <span style={{ ...pr.craftName, color: done ? '#000' : '#666' }}>
                    {craft.title} <span style={pr.craftAge}>({craft.ages})</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* SPARKY MESSAGE — Enhancement B2: condition-based pre-written message */}
        <div style={pr.sparkyBox}>
          <span style={pr.sparkyIcon} aria-hidden="true">🔮</span>
          <p style={pr.sparkyText}>{sparkyMessage}</p>
        </div>

        {/* FOOTER: tagline + website + QR code (Enhancement B3) + disclaimer (Decision C) */}
        <hr style={pr.rule} />
        <div style={pr.footer}>
          <div style={pr.footerLeft}>
            <p style={pr.footerTagline}>Keep being an Amazing Learner!</p>
            <p style={pr.footerSite}>myamazinglearner.co.uk</p>
            {/* Email to Teacher — placeholder for future sprint */}
            <button style={pr.emailTeacherBtn} disabled aria-label="Email to Teacher — coming soon">
              📧 Email to Teacher (coming soon)
            </button>
          </div>
          {/* QR code: links to collections/all — black on white, ~25mm, scannable from fridge */}
          <div style={pr.qrWrap}>
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Scan to explore our full range of learning resources"
                style={pr.qrImg}
                width={96}
                height={96}
              />
            )}
            <p style={pr.qrLabel}>Scan to explore our full range of learning resources</p>
          </div>
        </div>

        {/* DISCLAIMER — Decision C: exact client-approved wording, 7pt, italic, print-only */}
        <hr style={{ ...pr.rule, marginTop: '12px' }} />
        <p className="print-disclaimer" style={pr.disclaimer}>
          Progress scores reflect your child&apos;s activity within the My Amazing Learner app and are designed as a fun, encouraging learning guide. They are not a formal academic assessment and should not be used as such. For formal progress information, please speak with your child&apos;s class teacher.
        </p>
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

/* ── Print report styles ───────────────────────────────────── */
const pr = {
  // Header
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
  headerLogo: { display: 'flex', alignItems: 'center', gap: '6px' },
  logoEmoji: { fontSize: '1.4rem' },
  logoText: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1rem', color: '#3D1A5E' },
  headerTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', color: '#000' },
  headerDate: { fontSize: '0.75rem', color: '#555' },
  rule: { border: 'none', borderTop: '1px solid #ccc', margin: '10px 0' },

  // Child hero
  heroSection: { margin: '12px 0', textAlign: 'center' },
  heroName: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#3D1A5E', marginBottom: '4px' },
  heroStrength: { fontSize: '1rem', fontWeight: 700, color: '#555', fontStyle: 'italic' },

  // Summary strip
  summaryStrip: { display: 'flex', gap: '8px', margin: '12px 0' },
  statBox: { flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '8px', textAlign: 'center' },
  statNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.3rem', color: '#3D1A5E' },
  statLbl: { fontSize: '0.6rem', color: '#555', marginTop: '2px' },

  // Sections
  section: { margin: '14px 0' },
  sectionHeading: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.9rem', color: '#3D1A5E', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px' },

  // Progress bars
  barRow: { marginBottom: '8px' },
  barMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '3px' },
  barPct: { color: '#555' },
  barTrack: { height: '8px', background: '#eee', borderRadius: '4px' },
  barFill: { height: '8px', background: '#3D1A5E', borderRadius: '4px' },
  barCurriculum: { fontSize: '0.6rem', color: '#888', marginTop: '2px' },

  // Badges grid — max 2 rows of 5-6
  badgeGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' },
  badgeItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px' },
  badgeEmoji: { fontSize: '1.2rem' },
  badgeLabel: { fontSize: '0.65rem', textAlign: 'center', color: '#333', lineHeight: 1.2 },

  // Craft checklist
  craftList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  craftItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  craftTick: { fontSize: '0.9rem', flexShrink: 0 },
  craftName: { fontSize: '0.75rem' },
  craftAge: { color: '#888', fontSize: '0.7rem' },

  // Sparky message — Enhancement B2
  sparkyBox: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    background: '#f5f0ff', borderRadius: '10px', padding: '12px', margin: '14px 0',
    border: '1px solid #e0d5f5',
  },
  sparkyIcon: { fontSize: '1.3rem', flexShrink: 0 },
  sparkyText: { fontSize: '0.8rem', lineHeight: 1.6, color: '#2a1a4a', fontStyle: 'italic' },

  // Footer with QR code — Enhancement B3
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginTop: '10px' },
  footerLeft: { flex: 1 },
  footerTagline: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.85rem', color: '#3D1A5E', marginBottom: '2px' },
  footerSite: { fontSize: '0.7rem', color: '#555', marginBottom: '6px' },
  emailTeacherBtn: {
    fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px',
    border: '1px solid #ccc', background: '#f5f5f5', color: '#999',
    cursor: 'not-allowed', fontFamily: "'Nunito', sans-serif",
  },
  qrWrap: { textAlign: 'center', flexShrink: 0 },
  // QR: black on white only — no brand colours (client spec)
  qrImg: { display: 'block', width: '96px', height: '96px' },
  qrLabel: { fontSize: '0.55rem', color: '#555', marginTop: '4px', maxWidth: '96px', lineHeight: 1.3 },

  // Disclaimer — Decision C: exact approved wording, 7pt italic, greyscale, below QR
  disclaimer: { fontSize: '7pt', fontStyle: 'italic', color: '#555', lineHeight: 1.4, marginTop: '6px' },
}
