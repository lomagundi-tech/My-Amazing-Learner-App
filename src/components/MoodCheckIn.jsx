import { useState } from 'react'
import { addMood, getTodaysMood } from '../utils/storage'
import { t } from '../utils/i18n'

const MOOD_IDS = [
  { id: 1, emoji: '😢' },
  { id: 2, emoji: '😕' },
  { id: 3, emoji: '😐' },
  { id: 4, emoji: '🙂' },
  { id: 5, emoji: '🤩' },
]

export default function MoodCheckIn({ onDone, lang = 'en' }) {
  const todaysMood = getTodaysMood()
  const [selected, setSelected] = useState(todaysMood)

  if (todaysMood && !selected) return null

  function pick(value) {
    setSelected(value)
    addMood(value)
    setTimeout(onDone, 800)
  }

  function skip() {
    onDone()
  }

  const picked = MOOD_IDS.find((m) => m.id === selected)

  return (
    <div style={styles.card}>
      {selected ? (
        <p style={styles.thanks}>
          {t('mood_thanks', lang)} {picked?.emoji}
        </p>
      ) : (
        <>
          <p style={styles.question}>{t('mood_question', lang)}</p>
          <div style={styles.faces}>
            {MOOD_IDS.map((m) => (
              <button
                key={m.id}
                onClick={() => pick(m.id)}
                aria-label={t(`mood_label_${m.id}`, lang)}
                style={styles.faceBtn}
              >
                <span style={styles.faceEmoji}>{m.emoji}</span>
                <span style={styles.faceLabel}>{t(`mood_label_${m.id}`, lang)}</span>
              </button>
            ))}
          </div>
          <button onClick={skip} style={styles.skipBtn} aria-label="Skip mood check-in">
            {t('mood_skip', lang)}
          </button>
        </>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: 'linear-gradient(135deg, #fff 0%, #f8f0ff 100%)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-small)',
    padding: '20px 24px',
    marginBottom: '24px',
    textAlign: 'center',
    border: '2px solid rgba(107,63,160,0.1)',
  },
  question: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    color: 'var(--plum)',
    fontSize: '1.1rem',
    marginBottom: '16px',
  },
  faces: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  faceBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'transparent',
    border: '2px solid transparent',
    borderRadius: '12px',
    padding: '8px 10px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
    minWidth: '52px',
    minHeight: '44px',
  },
  faceEmoji: { fontSize: '1.8rem' },
  faceLabel: { fontSize: '0.65rem', color: 'var(--text-mid)', fontWeight: 600 },
  thanks: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 700,
    color: 'var(--violet)',
    fontSize: '1rem',
  },
  skipBtn: {
    display: 'block',
    margin: '12px auto 0',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-mid)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '4px 8px',
    minHeight: '44px',
  },
}
