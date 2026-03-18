import { useEffect, useState } from 'react'
import { PROGRESS_AREAS } from '../data/progressData'
import { getMoodHistory, getStars } from '../utils/storage'

const MOODS = ['', '😔', '😕', '😐', '🙂', '😄']

export default function ProgressPanel({ mode, stars, childName }) {
  const [animated, setAnimated] = useState(false)
  const isChild = mode === 'child'
  const name = childName || 'your learner'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Last 7 days of mood data
  const moodHistory = getMoodHistory()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000).toDateString()
    return moodHistory.find((m) => m.date === d) ?? { date: d, mood: null }
  }).reverse()

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
              Here&apos;s how {name} is doing across all learning areas.
            </p>
          </div>
          <button onClick={printReport} style={styles.printBtn} aria-label="Print progress report">
            🖨️ Print Report
          </button>
        </div>
      )}

      {/* Progress bars */}
      <div style={styles.barsWrapper}>
        {PROGRESS_AREAS.map((area) => (
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

      {/* Printable report (visible only in print) */}
      <div id="print-report" style={styles.printReport}>
        <h1 style={styles.printTitle}>My Amazing Learner — Progress Report</h1>
        <p style={styles.printMeta}>
          Learner: <strong>{childName || 'My Amazing Learner'}</strong> &nbsp;|&nbsp;
          Stars earned: <strong>{stars}</strong> &nbsp;|&nbsp;
          Date: <strong>{new Date().toLocaleDateString('en-GB')}</strong>
        </p>
        <hr style={{ borderColor: 'var(--plum)', margin: '16px 0' }} />
        {PROGRESS_AREAS.map((area) => (
          <div key={area.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>{area.emoji} {area.label}</strong> — {area.curriculum}</span>
              <span><strong>{area.pct}%</strong></span>
            </div>
            <div style={{ background: '#eee', height: '8px', borderRadius: '4px', marginTop: '4px' }}>
              <div style={{ width: `${area.pct}%`, background: '#3D1A5E', height: '8px', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
        <p style={{ marginTop: '24px', fontSize: '0.75rem', color: '#666' }}>
          Generated by myamazinglearner.co.uk — Inspiring Amazing Learners to unlock their unique superpowers.
        </p>
      </div>
    </div>
  )
}

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
  printReport: { display: 'none' },
}
