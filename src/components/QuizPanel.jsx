import { useQuiz } from '../hooks/useQuiz'
import { LEVELS, SUBJECTS } from '../data/quizData'
import { getStars } from '../utils/storage'
import MoodCheckIn from './MoodCheckIn'
import { useState, useRef } from 'react'

const CORRECT_MSGS = ['Amazing! 🎉', 'You got it! 🚀', 'Brilliant! 🌟', 'Superstar! 🦄']

export default function QuizPanel({ mode, onStarsChange, onBadgesChange }) {
  const { level, subject, questions, current, selected, feedback, changeLevel, changeSubject, answer, next } = useQuiz(onStarsChange, onBadgesChange)
  const [moodDone, setMoodDone] = useState(false)
  const isChild = mode === 'child'
  const stars = getStars()

  // Pick a random correct message once per question — stable across re-renders
  const correctMsgRef = useRef(CORRECT_MSGS[0])
  if (!selected) {
    correctMsgRef.current = CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)]
  }
  const correctMsg = isChild ? correctMsgRef.current : 'Correct! Well done.'
  const wrongMsg = isChild
    ? "Not quite — but you're learning! Try the next one 💛"
    : 'Not quite. The correct answer is highlighted below.'

  return (
    <div className="panel-enter" style={styles.wrapper}>
      {/* Mood check-in (child mode, once per day) */}
      {isChild && !moodDone && (
        <MoodCheckIn onDone={() => setMoodDone(true)} />
      )}

      {/* Star counter */}
      <div style={styles.starBar}>
        <span style={styles.starCount}>⭐ {stars} stars earned</span>
      </div>

      {/* Level selector */}
      <div style={styles.levelRow} role="group" aria-label="Select difficulty level">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => changeLevel(l.id)}
            aria-pressed={level === l.id}
            style={{
              ...styles.levelBtn,
              background: level === l.id ? l.colour : '#fff',
              color: level === l.id ? '#fff' : 'var(--text-mid)',
              borderColor: level === l.id ? l.colour : 'rgba(0,0,0,0.1)',
            }}
          >
            {l.emoji} {l.label} <span style={styles.ageTag}>{l.ages}</span>
          </button>
        ))}
      </div>

      {/* Subject filter */}
      <div style={styles.subjectRow} role="group" aria-label="Filter by subject">
        {SUBJECTS.map((s) => {
          const count = s.id === 'all'
            ? questions.length
            : questions.filter((q) => q.subject === s.id).length
          const isActive = subject === s.id
          if (s.id !== 'all' && count === 0) return null // hide subjects with no questions in this level
          return (
            <button
              key={s.id}
              onClick={() => changeSubject(s.id)}
              aria-pressed={isActive}
              style={{
                ...styles.subjectBtn,
                background: isActive ? 'var(--plum)' : '#f5f0fa',
                color: isActive ? '#fff' : 'var(--text-mid)',
                borderColor: isActive ? 'var(--plum)' : 'transparent',
              }}
            >
              {s.emoji} {s.label}
              <span style={{ ...styles.subjectCount, opacity: isActive ? 0.8 : 0.6 }}>
                {s.id === 'all' ? questions.length : count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Question card */}
      {questions.length === 0 ? (
        <div style={styles.emptyState}>
          No questions for this combination yet — try a different subject or level!
        </div>
      ) : (
        <div style={styles.questionCard} key={current?.id}>
          <div style={styles.questionMeta}>
            <span style={styles.subjectPill}>
              {SUBJECTS.find((s) => s.id === current?.subject)?.emoji} {current?.subject}
            </span>
          </div>
          <p style={styles.questionText}>{current?.q}</p>
          <div style={styles.optionsGrid}>
            {current?.options.map((opt) => {
              let bg = '#fff'
              let border = '2px solid rgba(0,0,0,0.1)'
              let color = 'var(--text-dark)'

              if (selected) {
                if (opt === current.answer) {
                  bg = 'var(--mint)'; border = '2px solid var(--mint)'; color = '#fff'
                } else if (opt === selected && opt !== current.answer) {
                  bg = 'var(--coral)'; border = '2px solid var(--coral)'; color = '#fff'
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => answer(opt)}
                  disabled={!!selected}
                  style={{ ...styles.optionBtn, background: bg, border, color }}
                  aria-label={`Answer: ${opt}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{
              ...styles.feedback,
              background: feedback === 'correct' ? 'rgba(78,205,196,0.12)' : 'rgba(255,107,107,0.12)',
              borderColor: feedback === 'correct' ? 'var(--mint)' : 'var(--coral)',
              color: feedback === 'correct' ? '#1a6b67' : '#b22222',
            }}>
              {feedback === 'correct' ? correctMsg : wrongMsg}
            </div>
          )}

          {selected && (
            <button onClick={next} style={styles.nextBtn}>
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px 0', maxWidth: '640px', margin: '0 auto' },
  starBar: { textAlign: 'right' },
  starCount: {
    background: 'var(--gold)', color: 'var(--text-dark)',
    padding: '6px 16px', borderRadius: 'var(--radius-pill)',
    fontWeight: 700, fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif",
  },
  levelRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  levelBtn: {
    flex: 1, minWidth: '100px', padding: '10px 16px',
    borderRadius: 'var(--radius-pill)', border: '2px solid',
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    fontWeight: 700, fontSize: '0.875rem', transition: 'all 0.2s ease',
    minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  },
  ageTag: { fontSize: '0.7rem', opacity: 0.8 },
  subjectRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  subjectBtn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '7px 14px', borderRadius: 'var(--radius-pill)',
    border: '2px solid', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem',
    transition: 'all 0.2s ease', minHeight: '44px',
  },
  subjectCount: {
    background: 'rgba(0,0,0,0.1)', borderRadius: '10px',
    padding: '1px 6px', fontSize: '0.7rem', fontWeight: 700,
  },
  emptyState: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)', padding: '40px 24px',
    textAlign: 'center', color: 'var(--text-mid)', fontStyle: 'italic',
  },
  questionCard: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)', padding: '28px 24px',
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  questionMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  subjectPill: {
    background: 'rgba(107,63,160,0.1)', color: 'var(--violet)',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize',
  },
  questionText: {
    fontFamily: "'Baloo 2', cursive", fontWeight: 700,
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: 'var(--text-dark)', textAlign: 'center',
  },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  optionBtn: {
    padding: '16px 12px', borderRadius: '14px', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '1rem',
    transition: 'all 0.2s ease', minHeight: '56px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  feedback: {
    padding: '14px 20px', borderRadius: '14px', border: '2px solid',
    fontWeight: 600, fontSize: '0.95rem', textAlign: 'center',
  },
  nextBtn: {
    alignSelf: 'flex-end', padding: '12px 24px',
    background: 'var(--plum)', color: '#fff', border: 'none',
    borderRadius: 'var(--radius-pill)', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700,
    fontSize: '0.95rem', minHeight: '44px',
  },
}
