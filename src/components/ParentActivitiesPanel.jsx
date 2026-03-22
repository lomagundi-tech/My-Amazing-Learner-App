import { useState, useEffect } from 'react'
import {
  getParentCompletions, addParentCompletion, hasCompletedActivityToday,
  getParentTier, getParentMonthlyStats,
  addParentVoucher, getActiveVouchers,
  initiateJointSession, completeJointSide, getJointSession,
  getParentFlashcards, saveParentFlashcard, deleteParentFlashcard,
  addLifeSkillsEntry, saveGamificationSnapshot, addStars,
  getMonthlyCapState,
  getStars, getCorrectCount, getSubjectProgress, getLevelsCompleted, getStreak,
} from '../utils/storage'
import { SUBJECTS, LEVELS } from '../data/quizData'
import {
  MODULE_A, MODULE_B, MODULE_C, MODULE_D, PARENT_TIERS,
  SPELLING_BEE_QUESTIONS, GENERAL_KNOWLEDGE_QUESTIONS, MATHS_MENTAL_QUESTIONS,
  READING_TIP_ARTICLE, FLASHCARD_TOPICS,
  SCAVENGER_CHECKLIST, MINDFULNESS_STEPS, LANGUAGE_PHRASES,
  HISTORY_MYSTERY, STORY_PROMPTS, TEACH_TOPICS,
} from '../data/parentActivitiesData'

const QUIZ_MAP = {
  spelling_bee:      SPELLING_BEE_QUESTIONS,
  general_knowledge: GENERAL_KNOWLEDGE_QUESTIONS,
  maths_mental:      MATHS_MENTAL_QUESTIONS,
}

// ── Tier banner ────────────────────────────────────────────────
function TierBanner({ stats }) {
  const tierIndex = getParentTier()
  const tier = PARENT_TIERS[tierIndex]
  const nextTier = PARENT_TIERS[Math.min(tierIndex + 1, 4)]
  const target = tierIndex === 0 ? 5 : tierIndex === 1 ? 10 : tierIndex === 2 ? 15 : 20
  const progress = tierIndex === 4 ? 100 : Math.round((stats.total / target) * 100)

  return (
    <div style={{ ...st.tierBanner, borderColor: tier.colour }}>
      <div style={st.tierLeft}>
        <div style={{ ...st.tierBadge, background: tier.colour }}>
          {tierIndex === 0 ? '🌱' : tierIndex === 1 ? '🥉' : tierIndex === 2 ? '🥈' : tierIndex === 3 ? '🥇' : '👑'}
        </div>
        <div>
          <div style={st.tierLabel}>{tier.label}</div>
          <div style={st.tierSub}>{stats.total} activities this month</div>
        </div>
      </div>
      <div style={st.tierRight}>
        {tierIndex < 4 && (
          <>
            <div style={st.tierNextLabel}>Next: {nextTier.label}</div>
            <div style={st.tierTrack}>
              <div style={{ ...st.tierFill, width: `${Math.min(progress, 100)}%`, background: tier.colour }} />
            </div>
            <div style={st.tierHint}>{nextTier.requirement}</div>
          </>
        )}
        {tierIndex === 4 && <div style={{ ...st.tierNextLabel, color: '#6B3FA0' }}>Maximum tier reached! 👑</div>}
      </div>
    </div>
  )
}

// ── Quiz modal ─────────────────────────────────────────────────
function QuizModal({ activity, questions, onClose, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[current]
  const total = questions.length

  function handleAnswer(opt) {
    if (selected) return
    setSelected(opt)
    if (opt === q.answer) setScore((s) => s + 1)
  }

  function handleNext() {
    if (current + 1 >= total) setDone(true)
    else { setCurrent((c) => c + 1); setSelected(null) }
  }

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>

        {!done ? (
          <>
            <div style={st.quizProgress}>
              Question {current + 1} of {total}
              <div style={st.quizProgressTrack}>
                <div style={{ ...st.quizProgressFill, width: `${((current + 1) / total) * 100}%` }} />
              </div>
            </div>
            <p style={st.questionText}>{q.q}</p>
            <div style={st.optionsGrid}>
              {q.options.map((opt) => {
                let bg = '#f5f0fa', border = 'rgba(107,63,160,0.15)', color = 'var(--text-dark)'
                if (selected) {
                  if (opt === q.answer) { bg = 'var(--mint)'; border = 'var(--mint)'; color = '#fff' }
                  else if (opt === selected && opt !== q.answer) { bg = 'var(--coral)'; border = 'var(--coral)'; color = '#fff' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected}
                    style={{ ...st.optionBtn, background: bg, borderColor: border, color }}>
                    {opt}
                  </button>
                )
              })}
            </div>
            {selected && (
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <div style={{ marginBottom: '8px', fontWeight: 700, color: selected === q.answer ? 'var(--mint)' : 'var(--coral)' }}>
                  {selected === q.answer ? 'Correct!' : `The answer is: ${q.answer}`}
                </div>
                <button onClick={handleNext} style={st.nextBtn}>
                  {current + 1 >= total ? 'See Results' : 'Next Question'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={st.resultsBox}>
            <div style={st.resultScore}>{score}/{total}</div>
            <div style={st.resultLabel}>
              {score === total ? 'Perfect score! Outstanding!' : score >= total * 0.7 ? 'Great work!' : 'Good effort — keep practising!'}
            </div>
            {activity.reward?.pct > 0 && <div style={st.rewardPill}>You earned {activity.reward.label}!</div>}
            <button onClick={() => { onComplete(score, total); onClose() }} style={st.nextBtn}>Claim Reward &amp; Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Article modal (Reading Tip) ───────────────────────────────
function ArticleModal({ activity, onClose, onComplete }) {
  const [stage, setStage] = useState('read')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  const qs = READING_TIP_ARTICLE.questions
  const q = qs[current]

  function handleAnswer(opt) {
    if (selected) return
    setSelected(opt)
    if (opt === q.answer) setScore((s) => s + 1)
  }

  function handleNext() {
    if (current + 1 >= qs.length) setStage('done')
    else { setCurrent((c) => c + 1); setSelected(null) }
  }

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '85vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>

        {stage === 'read' && (
          <>
            <h4 style={{ color: 'var(--plum)', marginBottom: '12px', fontFamily: "'Baloo 2', cursive" }}>{READING_TIP_ARTICLE.title}</h4>
            {READING_TIP_ARTICLE.body.map((para, i) => (
              <p key={i} style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-dark)', marginBottom: '12px' }}>{para}</p>
            ))}
            <button onClick={() => setStage('quiz')} style={st.nextBtn}>Take the Quiz →</button>
          </>
        )}

        {stage === 'quiz' && (
          <>
            <div style={st.quizProgress}>Question {current + 1} of {qs.length}</div>
            <p style={st.questionText}>{q.q}</p>
            <div style={st.optionsGrid}>
              {q.options.map((opt) => {
                let bg = '#f5f0fa', border = 'rgba(107,63,160,0.15)', color = 'var(--text-dark)'
                if (selected) {
                  if (opt === q.answer) { bg = 'var(--mint)'; border = 'var(--mint)'; color = '#fff' }
                  else if (opt === selected) { bg = 'var(--coral)'; border = 'var(--coral)'; color = '#fff' }
                }
                return <button key={opt} onClick={() => handleAnswer(opt)} disabled={!!selected} style={{ ...st.optionBtn, background: bg, borderColor: border, color }}>{opt}</button>
              })}
            </div>
            {selected && (
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button onClick={handleNext} style={st.nextBtn}>{current + 1 >= qs.length ? 'Finish' : 'Next'}</button>
              </div>
            )}
          </>
        )}

        {stage === 'done' && (
          <div style={st.resultsBox}>
            <div style={st.resultScore}>{score}/{qs.length}</div>
            <div style={st.resultLabel}>Reading tip complete!</div>
            <div style={st.rewardPill}>Badge unlocked: Reading Champion</div>
            <button onClick={() => { onComplete(score, qs.length); onClose() }} style={st.nextBtn}>Claim Badge &amp; Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Flashcard builder modal ────────────────────────────────────
function FlashcardModal({ activity, onClose, onComplete }) {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [cards, setCards] = useState(() => getParentFlashcards())
  const [flipped, setFlipped] = useState({})

  function handleAdd() {
    if (!front.trim() || !back.trim() || !selectedTopic) return
    saveParentFlashcard(selectedTopic, front.trim(), back.trim())
    setCards(getParentFlashcards())
    setFront(''); setBack('')
  }

  function handleDelete(id) {
    deleteParentFlashcard(id)
    setCards(getParentFlashcards())
  }

  const topicCards = selectedTopic ? cards.filter((c) => c.topicId === selectedTopic) : cards

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '88vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button onClick={() => setSelectedTopic(null)} style={{ ...st.chip, background: !selectedTopic ? 'var(--plum)' : '#f0ebfa', color: !selectedTopic ? '#fff' : 'var(--violet)' }}>All</button>
          {FLASHCARD_TOPICS.map((t) => (
            <button key={t.id} onClick={() => setSelectedTopic(t.id)} style={{ ...st.chip, background: selectedTopic === t.id ? 'var(--plum)' : '#f0ebfa', color: selectedTopic === t.id ? '#fff' : 'var(--violet)' }}>{t.label}</button>
          ))}
        </div>

        <div style={st.flashcardInputRow}>
          <input value={front} onChange={(e) => setFront(e.target.value)} placeholder="Front (question)" style={st.flashInput} />
          <input value={back} onChange={(e) => setBack(e.target.value)} placeholder="Back (answer)" style={st.flashInput} />
          <button onClick={handleAdd} disabled={!front.trim() || !back.trim() || !selectedTopic} style={{ ...st.nextBtn, padding: '10px 18px', margin: 0 }}>+ Add</button>
        </div>
        {!selectedTopic && <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '8px' }}>Select a topic above to add cards.</p>}

        <div style={st.cardGrid}>
          {selectedTopic && FLASHCARD_TOPICS.find((t) => t.id === selectedTopic)?.cards.map((card, i) => (
            <div key={i} style={st.flashcard} onClick={() => setFlipped((f) => ({ ...f, [`pre_${i}`]: !f[`pre_${i}`] }))}>
              <span style={st.flashCardText}>{flipped[`pre_${i}`] ? card.split('→')[1]?.trim() ?? card : card.split('→')[0]?.trim() ?? card}</span>
              <span style={st.flashCardHint}>tap to flip</span>
            </div>
          ))}
          {topicCards.map((card) => (
            <div key={card.id} style={st.flashcard} onClick={() => setFlipped((f) => ({ ...f, [card.id]: !f[card.id] }))}>
              <span style={st.flashCardText}>{flipped[card.id] ? card.back : card.front}</span>
              <span style={st.flashCardHint}>tap to flip</span>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(card.id) }} style={st.flashDeleteBtn}>✕</button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(0, 0); onClose() }} style={st.nextBtn}>Done — Mark as Complete</button>
        </div>
      </div>
    </div>
  )
}

// ── Confirm modal (Module B joint + Module C/D confirm-type) ──
function ConfirmModal({ activity, onClose, onComplete, module }) {
  const [parentDone, setParentDone] = useState(false)
  const [childDone, setChildDone] = useState(false)
  const isJoint = !!activity.childEarns
  const isLifeSkill = module === 'C'

  const canConfirm = isJoint ? (parentDone && childDone) : parentDone

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '20px' }}>{activity.description}</p>

        {isLifeSkill && activity.freq && (
          <div style={st.freqBadge}>Target frequency: {activity.freq}</div>
        )}

        <div style={st.jointChecks}>
          <label style={st.checkRow}>
            <input type="checkbox" checked={parentDone} onChange={(e) => setParentDone(e.target.checked)} style={{ width: '20px', height: '20px' }} />
            <span>I confirm {activity.childEarns ? `we both completed: ${activity.title}` : `I have completed this activity`}</span>
          </label>
          {isJoint && (
            <label style={st.checkRow}>
              <input type="checkbox" checked={childDone} onChange={(e) => setChildDone(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span>My child has completed their part</span>
            </label>
          )}
          {activity.childEarns && (
            <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => { onComplete(canConfirm ? 1 : 0, 1); onClose() }}
            disabled={!canConfirm}
            style={{ ...st.nextBtn, opacity: canConfirm ? 1 : 0.4 }}
          >
            Mark Complete &amp; Claim Reward
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Module D specialist modals ─────────────────────────────────

function StepsModal({ activity, onClose, onComplete }) {
  const [steps, setSteps] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const target = 10000
  const reached = parseInt(steps, 10) >= target

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        <div style={st.inputGroup}>
          <label style={st.inputLabel}>Enter your family step count today:</label>
          <input
            type="number" value={steps} onChange={(e) => setSteps(e.target.value)}
            placeholder="e.g. 10500"
            style={{ ...st.flashInput, width: '100%' }}
          />
          {steps && <div style={{ marginTop: '8px', fontWeight: 700, color: reached ? 'var(--mint)' : 'var(--coral)', fontSize: '0.85rem' }}>
            {reached ? 'Goal reached! Well done!' : `${(target - parseInt(steps, 10)).toLocaleString()} steps to go`}
          </div>}
        </div>
        <label style={{ ...st.checkRow, marginTop: '16px' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span>We both completed this walk together</span>
        </label>
        <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(1, 1); onClose() }} disabled={!steps || !confirmed}
            style={{ ...st.nextBtn, opacity: steps && confirmed ? 1 : 0.4 }}>
            Claim Reward &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}

function ChecklistModal({ activity, onClose, onComplete }) {
  const [ticked, setTicked] = useState({})

  function toggle(item) {
    setTicked((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  const tickedCount = Object.values(ticked).filter(Boolean).length
  const allDone = tickedCount === SCAVENGER_CHECKLIST.length

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '85vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        <div style={st.progressBar}>
          <div style={{ ...st.progressFill, width: `${(tickedCount / SCAVENGER_CHECKLIST.length) * 100}%` }} />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '12px' }}>{tickedCount} of {SCAVENGER_CHECKLIST.length} found</p>
        <div style={st.checklistGrid}>
          {SCAVENGER_CHECKLIST.map((item) => (
            <label key={item} style={{ ...st.checkRow, background: ticked[item] ? '#e8f5e9' : '#f5f0fa', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!ticked[item]} onChange={() => toggle(item)} style={{ width: '20px', height: '20px' }} />
              <span style={{ color: ticked[item] ? 'var(--mint)' : 'var(--text-dark)', textDecoration: ticked[item] ? 'line-through' : 'none' }}>{item}</span>
            </label>
          ))}
        </div>
        {allDone && <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(tickedCount, SCAVENGER_CHECKLIST.length); onClose() }} disabled={tickedCount < 4}
            style={{ ...st.nextBtn, opacity: tickedCount >= 4 ? 1 : 0.4 }}>
            {allDone ? 'Complete Hunt! Claim Reward' : tickedCount >= 4 ? 'Good effort — Mark Complete' : `Find at least 4 items to complete`}
          </button>
        </div>
      </div>
    </div>
  )
}

function GuidedModal({ activity, onClose, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [done, setDone] = useState(false)

  function advance() {
    if (stepIndex + 1 >= MINDFULNESS_STEPS.length) setDone(true)
    else setStepIndex((i) => i + 1)
  }

  const step = MINDFULNESS_STEPS[stepIndex]

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        {!done ? (
          <>
            <div style={st.progressBar}>
              <div style={{ ...st.progressFill, width: `${((stepIndex + 1) / MINDFULNESS_STEPS.length) * 100}%` }} />
            </div>
            <div style={st.guidedStepBox}>
              <div style={st.stepNumber}>Step {step.step} of {MINDFULNESS_STEPS.length}</div>
              <p style={st.stepInstruction}>{step.instruction}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button onClick={advance} style={st.nextBtn}>
                {stepIndex + 1 >= MINDFULNESS_STEPS.length ? 'All done' : 'Next Step'}
              </button>
            </div>
          </>
        ) : (
          <div style={st.resultsBox}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🧘</div>
            <div style={st.resultLabel}>Mindfulness complete! Well done.</div>
            <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
            <button onClick={() => { onComplete(1, 1); onClose() }} style={st.nextBtn}>Claim Reward &amp; Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

function TextModal({ activity, onClose, onComplete }) {
  const [text, setText] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const label = activity.id === 'draw_and_caption'
    ? 'Describe your child\'s drawing and add a caption:'
    : 'Describe the kind act your child performed:'

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        <div style={st.inputGroup}>
          <label style={st.inputLabel}>{label}</label>
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Write a sentence or two..."
            rows={4}
            style={{ ...st.flashInput, width: '100%', resize: 'vertical' }}
          />
        </div>
        <label style={{ ...st.checkRow, marginTop: '12px' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span>We both confirm this was completed</span>
        </label>
        {activity.childEarns && <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(1, 1); onClose() }} disabled={!text.trim() || !confirmed}
            style={{ ...st.nextBtn, opacity: text.trim() && confirmed ? 1 : 0.4 }}>
            Claim Reward &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}

function StoryModal({ activity, onClose, onComplete }) {
  const [answers, setAnswers] = useState(Array(STORY_PROMPTS.length).fill(''))
  const [confirmed, setConfirmed] = useState(false)

  const allFilled = answers.every((a) => a.trim().length > 0)

  function setAnswer(i, val) {
    setAnswers((prev) => prev.map((a, idx) => idx === i ? val : a))
  }

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '85vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        {STORY_PROMPTS.map((prompt, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <label style={st.inputLabel}>{prompt.label}</label>
            <input
              value={answers[i]} onChange={(e) => setAnswer(i, e.target.value)}
              placeholder={prompt.placeholder}
              style={{ ...st.flashInput, width: '100%' }}
            />
          </div>
        ))}
        {allFilled && (
          <div style={st.storyPreview}>
            <strong>Your story:</strong> Once upon a time, {answers[0] || '...'} lived in {answers[1] || '...'}. One day, they discovered that {answers[2] || '...'}.
          </div>
        )}
        <label style={{ ...st.checkRow, marginTop: '12px' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span>We created this story together</span>
        </label>
        <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(1, 1); onClose() }} disabled={!allFilled || !confirmed}
            style={{ ...st.nextBtn, opacity: allFilled && confirmed ? 1 : 0.4 }}>
            Save Story &amp; Claim Reward
          </button>
        </div>
      </div>
    </div>
  )
}

function RatingModal({ activity, onClose, onComplete }) {
  const [topic, setTopic] = useState('')
  const [rating, setRating] = useState(0)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        <div style={st.inputGroup}>
          <label style={st.inputLabel}>Your child chose to teach you about:</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {TEACH_TOPICS.map((t) => (
              <button key={t} onClick={() => setTopic(t)}
                style={{ ...st.chip, background: topic === t ? 'var(--plum)' : '#f0ebfa', color: topic === t ? '#fff' : 'var(--violet)' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={st.inputLabel}>Rate their explanation (1 = good start, 5 = amazing!):</div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}
                style={{ ...st.ratingBtn, background: rating >= n ? 'var(--gold)' : '#f0ebfa', color: rating >= n ? '#1A0A2E' : 'var(--text-mid)' }}>
                {n === 1 ? '⭐' : n === 2 ? '⭐⭐' : n === 3 ? '⭐⭐⭐' : n === 4 ? '⭐⭐⭐⭐' : '⭐⭐⭐⭐⭐'}
              </button>
            ))}
          </div>
        </div>
        <label style={{ ...st.checkRow, marginTop: '16px' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span>My child taught me about this topic today</span>
        </label>
        <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(rating, 5); onClose() }} disabled={!topic || !rating || !confirmed}
            style={{ ...st.nextBtn, opacity: topic && rating && confirmed ? 1 : 0.4 }}>
            Claim Reward &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}

function PhrasesModal({ activity, onClose, onComplete }) {
  const [practised, setPractised] = useState({})
  const [confirmed, setConfirmed] = useState(false)

  const allPractised = LANGUAGE_PHRASES.every((p) => practised[p.phrase])
  const practisedCount = Object.values(practised).filter(Boolean).length

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '85vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={st.modalBody}>{activity.description}</p>
        <div style={st.progressBar}>
          <div style={{ ...st.progressFill, width: `${(practisedCount / LANGUAGE_PHRASES.length) * 100}%` }} />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '12px' }}>{practisedCount} of {LANGUAGE_PHRASES.length} practised</p>
        {LANGUAGE_PHRASES.map((p) => (
          <div key={p.phrase} style={{ ...st.phraseCard, background: practised[p.phrase] ? '#e8f5e9' : '#f5f0fa', borderColor: practised[p.phrase] ? 'var(--mint)' : 'rgba(107,63,160,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--plum)', fontFamily: "'Baloo 2', cursive" }}>{p.phrase}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{p.english}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)', fontStyle: 'italic' }}>Say it: {p.pronunciation}</div>
              </div>
              <button onClick={() => setPractised((prev) => ({ ...prev, [p.phrase]: !prev[p.phrase] }))}
                style={{ ...st.chip, background: practised[p.phrase] ? 'var(--mint)' : 'var(--violet)', color: '#fff', minWidth: '80px' }}>
                {practised[p.phrase] ? 'Practised ✓' : 'Practise'}
              </button>
            </div>
          </div>
        ))}
        <label style={{ ...st.checkRow, marginTop: '12px' }}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
          <span>We both practised these phrases together</span>
        </label>
        {allPractised && <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => { onComplete(practisedCount, LANGUAGE_PHRASES.length); onClose() }} disabled={!confirmed || practisedCount < 3}
            style={{ ...st.nextBtn, opacity: confirmed && practisedCount >= 3 ? 1 : 0.4 }}>
            Claim Reward &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}

function MysteryModal({ activity, onClose, onComplete }) {
  const [clueIndex, setClueIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ ...st.modal, maxHeight: '85vh' }}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {HISTORY_MYSTERY.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>
        <div style={st.progressBar}>
          <div style={{ ...st.progressFill, width: `${((clueIndex + 1) / HISTORY_MYSTERY.clues.length) * 100}%` }} />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '12px' }}>Clue {clueIndex + 1} of {HISTORY_MYSTERY.clues.length}</p>

        {HISTORY_MYSTERY.clues.slice(0, clueIndex + 1).map((clue, i) => (
          <div key={i} style={{ ...st.clueCard, opacity: i < clueIndex ? 0.7 : 1 }}>
            <span style={{ fontWeight: 700, color: 'var(--violet)', marginRight: '6px' }}>Clue {i + 1}:</span>
            {clue}
          </div>
        ))}

        {clueIndex < HISTORY_MYSTERY.clues.length - 1 && (
          <button onClick={() => setClueIndex((i) => i + 1)} style={{ ...st.nextBtn, marginTop: '12px' }}>Next Clue →</button>
        )}

        {clueIndex === HISTORY_MYSTERY.clues.length - 1 && !revealed && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontWeight: 700, color: 'var(--plum)', marginBottom: '8px' }}>{HISTORY_MYSTERY.question}</p>
            <button onClick={() => setRevealed(true)} style={{ ...st.nextBtn, background: 'var(--gold)', color: '#1A0A2E' }}>Reveal the Answer!</button>
          </div>
        )}

        {revealed && (
          <div style={st.answerBox}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--plum)', marginBottom: '8px' }}>{HISTORY_MYSTERY.answer}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>
              <strong>Fun fact:</strong> {HISTORY_MYSTERY.funFact}
            </div>
            <label style={{ ...st.checkRow, marginTop: '12px' }}>
              <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span>We solved this mystery together</span>
            </label>
            <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <button onClick={() => { onComplete(1, 1); onClose() }} disabled={!confirmed}
                style={{ ...st.nextBtn, opacity: confirmed ? 1 : 0.4 }}>
                Claim Reward &amp; Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Voucher wallet ─────────────────────────────────────────────
function VoucherWallet({ vouchers }) {
  const [copied, setCopied] = useState(null)

  function copyCode(voucher) {
    navigator.clipboard?.writeText(voucher.code).catch(() => {})
    setCopied(voucher.id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (vouchers.length === 0) return null

  return (
    <div style={st.walletSection}>
      <h3 style={st.sectionTitle}>Your Discount Vouchers ({vouchers.length} active)</h3>
      <p style={st.walletNote}>
        Copy your code and contact us at <strong>hello@myamazinglearner.co.uk</strong> to redeem your discount. Vouchers expire 30 days after issue.
      </p>
      <div style={st.voucherGrid}>
        {vouchers.map((v) => {
          const expiresIn = Math.ceil((new Date(v.expires_at || v.expiresAt) - new Date()) / 86400000)
          return (
            <div key={v.id} style={st.voucherCard}>
              <div style={st.voucherPct}>{v.pct}% off</div>
              <div style={st.voucherCode}>{v.code}</div>
              <div style={st.voucherExpiry}>Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}</div>
              <button onClick={() => copyCode(v)} style={st.voucherBtn}>
                {copied === v.id ? 'Copied!' : 'Copy Code'}
              </button>
              <div style={st.redeemNote}>Email hello@myamazinglearner.co.uk to redeem</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Cap meter ──────────────────────────────────────────────────
function CapMeter() {
  const cap = getMonthlyCapState()
  return (
    <div style={st.capMeter}>
      <div style={st.capRow}>
        <span style={st.capLabel}>Solo activities (Module A): {cap.soloTotal}% of 30% used</span>
        <div style={st.capTrack}>
          <div style={{ ...st.capFill, width: `${Math.min((cap.soloTotal / 30) * 100, 100)}%`, background: cap.soloTotal >= 30 ? 'var(--coral)' : 'var(--mint)' }} />
        </div>
      </div>
      <div style={st.capRow}>
        <span style={st.capLabel}>Combined (A + B): {cap.combinedTotal}% of 40% used</span>
        <div style={st.capTrack}>
          <div style={{ ...st.capFill, width: `${Math.min((cap.combinedTotal / 40) * 100, 100)}%`, background: cap.combinedTotal >= 40 ? 'var(--coral)' : 'var(--violet)' }} />
        </div>
      </div>
      <p style={st.capNote}>Caps reset on the 1st of each month. Modules C and D are not subject to the discount cap.</p>
    </div>
  )
}

// ── Activity card ──────────────────────────────────────────────
function ActivityCard({ activity, module, onOpen, doneToday, jointSession }) {
  const isJoint = module === 'B' || !!activity.childEarns
  const bothComplete = jointSession?.status === 'complete'
  const done = doneToday || bothComplete
  const isLifeSkill = module === 'C'

  return (
    <button
      onClick={() => !done && onOpen(activity)}
      style={{
        ...st.actCard,
        background: done ? '#f0faf0' : activity.bg || '#f5f0fa',
        borderColor: done ? 'var(--mint)' : 'rgba(107,63,160,0.12)',
        cursor: done ? 'default' : 'pointer',
        opacity: done ? 0.85 : 1,
      }}
      aria-label={activity.title}
    >
      <div style={st.actCardTop}>
        <span style={st.actEmoji}>{activity.emoji}</span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {done && <span style={st.donePill}>Done ✓</span>}
          {activity.category && <span style={st.categoryPill}>{activity.category}</span>}
          {isJoint && !done && jointSession && (
            <span style={{ ...st.donePill, background: '#FFB347', color: '#000' }}>
              {jointSession.parentDone && !jointSession.childDone ? 'Awaiting child' : 'In progress'}
            </span>
          )}
        </div>
      </div>
      <h3 style={st.actTitle}>{activity.title}</h3>
      <p style={st.actDesc}>{activity.description}</p>
      <div style={st.actFooter}>
        {isLifeSkill && <span style={st.actFormat}>{activity.freq}</span>}
        {activity.format && <span style={st.actFormat}>{activity.format}</span>}
        <span style={st.actReward}>{activity.reward?.label || activity.parentReward}</span>
      </div>
      {isJoint && (
        <div style={st.jointIndicator}>
          <span style={{ color: jointSession?.parentDone ? 'var(--mint)' : 'var(--text-mid)' }}>Parent {jointSession?.parentDone ? '✓' : '○'}</span>
          <span style={{ color: 'var(--text-mid)', margin: '0 4px' }}>+</span>
          <span style={{ color: jointSession?.childDone ? 'var(--mint)' : 'var(--text-mid)' }}>Child {jointSession?.childDone ? '✓' : '○'}</span>
        </div>
      )}
    </button>
  )
}

// ── Main panel ─────────────────────────────────────────────────
// ── Child Quiz Snapshot ────────────────────────────────────────
const HELP_TIPS = {
  maths:   'Try counting objects around the house together — small steps build big confidence!',
  english: 'Reading aloud together for just 10 minutes a day makes a huge difference.',
  science: 'Science questions come alive when you explore simple experiments at home!',
  general: 'Exploring the world through books, maps, or documentaries boosts general knowledge fast.',
}

function ChildQuizSnapshot({ childName }) {
  const subjectProgress = getSubjectProgress()
  const totalCorrect    = getCorrectCount()
  const stars           = getStars()
  const streak          = getStreak()
  const levelsCompleted = getLevelsCompleted()
  const name            = childName || 'your learner'
  const hasActivity     = totalCorrect > 0 || stars > 0

  const quizSubjects = SUBJECTS.filter((s) => s.id !== 'all')
  const maxCount = Math.max(...quizSubjects.map((s) => subjectProgress[s.id] ?? 0), 1)

  const attempted = quizSubjects.filter((s) => (subjectProgress[s.id] ?? 0) > 0)
  const weakest   = attempted.length
    ? attempted.reduce((a, b) => (subjectProgress[a.id] ?? 0) <= (subjectProgress[b.id] ?? 0) ? a : b)
    : null

  return (
    <div style={snap.wrapper}>
      <div style={snap.header}>
        <span style={snap.headerIcon} aria-hidden="true">📊</span>
        <h3 style={snap.title}>
          {childName ? `${childName}'s Quiz Activity` : "Your Learner's Quiz Activity"}
        </h3>
      </div>

      {!hasActivity ? (
        <div style={snap.zeroState}>
          <span style={snap.zeroRocket} aria-hidden="true">🚀</span>
          <p style={snap.zeroHead}>No quiz activity yet!</p>
          <p style={snap.zeroSub}>
            Switch to <strong>Child mode</strong> using the toggle at the top, then hand the
            device to {name}. Their results will appear here as they learn.
          </p>
          <div style={snap.zeroHint}>
            <span style={snap.zeroHintDot} aria-hidden="true" />
            Use the <strong>Parent / Child</strong> pill in the header to switch
          </div>
        </div>
      ) : (
        <>
          <div style={snap.statsRow}>
            {[
              { label: 'Stars',      value: stars,        emoji: '⭐', bg: '#FFB347' },
              { label: 'Correct',    value: totalCorrect, emoji: '✅', bg: '#4ECDC4' },
              { label: 'Day Streak', value: streak,       emoji: '🔥', bg: '#6B3FA0' },
            ].map((s) => (
              <div key={s.label} style={{ ...snap.statPill, background: s.bg }}>
                <span style={snap.statEmoji} aria-hidden="true">{s.emoji}</span>
                <span style={snap.statNum}>{s.value}</span>
                <span style={snap.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={snap.section}>
            <p style={snap.sectionLabel}>By subject</p>
            {quizSubjects.map((s) => {
              const count = subjectProgress[s.id] ?? 0
              const pct   = Math.round((count / maxCount) * 100)
              return (
                <div key={s.id} style={snap.barRow}>
                  <span style={snap.barSubject}>{s.emoji} {s.label}</span>
                  <div style={snap.barTrack}>
                    <div style={{ ...snap.barFill, width: `${pct}%` }} />
                  </div>
                  <span style={snap.barCount}>{count}</span>
                </div>
              )
            })}
          </div>

          <div style={snap.section}>
            <p style={snap.sectionLabel}>Levels explored</p>
            <div style={snap.levelsRow}>
              {LEVELS.map((l) => {
                const done = levelsCompleted.includes(l.id)
                return (
                  <div
                    key={l.id}
                    style={{
                      ...snap.levelPill,
                      background: done ? l.colour : 'rgba(0,0,0,0.05)',
                      color: done ? '#fff' : 'var(--text-mid)',
                    }}
                  >
                    {l.emoji} {l.label}{done ? ' ✓' : ''}
                  </div>
                )
              })}
            </div>
          </div>

          {weakest && (
            <div style={snap.tip}>
              <span style={snap.tipIcon} aria-hidden="true">💡</span>
              <p style={snap.tipText}>
                <strong>{weakest.emoji} {weakest.label}</strong> has the fewest correct answers.{' '}
                {HELP_TIPS[weakest.id]}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const snap = {
  wrapper: {
    background: '#fff',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: { display: 'flex', alignItems: 'center', gap: '10px' },
  headerIcon: { fontSize: '1.3rem' },
  title: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--plum)',
    margin: 0,
  },
  zeroState: { textAlign: 'center', padding: '16px 0 8px' },
  zeroRocket: { fontSize: '3rem', display: 'block', marginBottom: '12px' },
  zeroHead: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize: '1.2rem',
    color: 'var(--plum)',
    margin: '0 0 8px',
  },
  zeroSub: {
    color: 'var(--text-mid)',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: '0 auto 16px',
    maxWidth: '340px',
  },
  zeroHint: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f5f0fa',
    borderRadius: 'var(--radius-pill)',
    padding: '8px 16px',
    fontSize: '0.82rem',
    color: 'var(--violet)',
    fontWeight: 600,
  },
  zeroHintDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--violet)',
    flexShrink: 0,
  },
  statsRow: { display: 'flex', gap: '10px' },
  statPill: {
    flex: 1,
    borderRadius: '14px',
    padding: '10px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  statEmoji: { fontSize: '1.2rem' },
  statNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem', color: '#fff' },
  statLbl: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, textAlign: 'center' },
  section: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sectionLabel: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-mid)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  barSubject: { width: '90px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', flexShrink: 0 },
  barTrack: { flex: 1, height: '10px', background: 'rgba(0,0,0,0.06)', borderRadius: '5px', overflow: 'hidden' },
  barFill: { height: '100%', background: 'var(--violet)', borderRadius: '5px', transition: 'width 1.2s ease' },
  barCount: { width: '24px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-mid)', textAlign: 'right' },
  levelsRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  levelPill: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    fontSize: '0.82rem',
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
  },
  tip: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    background: '#fffbf0',
    border: '1.5px solid #FFB347',
    borderRadius: '14px',
    padding: '12px 16px',
  },
  tipIcon: { fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' },
  tipText: { margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-dark)' },
}

// ── Main panel ─────────────────────────────────────────────────
export default function ParentActivitiesPanel({ childName }) {
  const [activeModule, setActiveModule] = useState('A')
  const [activeModal, setActiveModal] = useState(null)
  const [completions, setCompletions] = useState(() => getParentCompletions())
  const [vouchers, setVouchers] = useState(() => getActiveVouchers())
  const [stats, setStats] = useState(() => getParentMonthlyStats())
  const [jointSessions, setJointSessions] = useState({})
  const [capMsg, setCapMsg] = useState(null)

  useEffect(() => {
    const map = {}
    MODULE_B.forEach((a) => {
      const s = getJointSession(a.id)
      if (s) map[a.id] = s
    })
    setJointSessions(map)
  }, [completions])

  function refreshState() {
    setCompletions(getParentCompletions())
    setVouchers(getActiveVouchers())
    setStats(getParentMonthlyStats())
  }

  function openModal(activity, module) {
    if (module === 'B') {
      initiateJointSession(activity.id)
      setJointSessions((prev) => ({ ...prev, [activity.id]: getJointSession(activity.id) }))
    }
    setActiveModal({ activity, module })
  }

  function handleActivityComplete(activity, module, score, total) {
    const passed = total === 0 || score >= total * 0.5
    if (!passed) return

    if (module === 'B') {
      completeJointSide(activity.id, 'parent')
      completeJointSide(activity.id, 'child')
      const session = getJointSession(activity.id)
      if (session?.status === 'complete' && !session.rewardGranted) {
        addParentCompletion(activity.id, 'B')
        if (activity.rewardPct > 0) {
          const result = addParentVoucher(activity.id, activity.rewardPct, activity.parentReward, 'B')
          if (result.granted === false && result.reason !== 'no-discount') setCapMsg(result.reason)
        }
        if (activity.childEarns) addStars(activity.childEarns)
      }
    } else if (module === 'C') {
      addParentCompletion(activity.id, 'C')
      addLifeSkillsEntry(activity.id, true)
      if (activity.childEarns) addStars(activity.childEarns)
    } else if (module === 'D') {
      addParentCompletion(activity.id, 'D')
      if (activity.rewardPct > 0) {
        addParentVoucher(activity.id, activity.rewardPct, activity.parentReward, 'D')
      }
      if (activity.childEarns) addStars(activity.childEarns)
    } else {
      // Module A
      addParentCompletion(activity.id, 'A')
      if (activity.reward?.pct > 0) {
        const result = addParentVoucher(activity.id, activity.reward.pct, activity.reward.label, 'A')
        if (result.granted === false && result.reason !== 'no-discount') setCapMsg(result.reason)
      }
    }

    saveGamificationSnapshot()
    refreshState()
  }

  const MODULES = [
    { id: 'A', label: 'Solo Activities', emoji: '👤', count: MODULE_A.length },
    { id: 'B', label: 'Do It Together', emoji: '👨‍👧', count: MODULE_B.length },
    { id: 'C', label: 'Life Skills', emoji: '🌟', count: MODULE_C.length },
    { id: 'D', label: 'Extended Bank', emoji: '🌈', count: MODULE_D.length },
  ]

  const activeActivities =
    activeModule === 'A' ? MODULE_A :
    activeModule === 'B' ? MODULE_B :
    activeModule === 'C' ? MODULE_C :
    MODULE_D

  return (
    <div className="panel-enter" style={st.wrapper}>

      <div style={st.header}>
        <h2 style={st.title}>
          Parent Activity Hub{childName ? ` — supporting ${childName}` : ''}
        </h2>
        <p style={st.subtitle}>
          Complete activities to earn discount vouchers, unlock badges, and strengthen your child&apos;s learning.
          Solo and joint activity discounts are capped at 30% and 40% per month respectively.
        </p>
      </div>

      <TierBanner stats={stats} />
      <ChildQuizSnapshot childName={childName} />

      {/* Cap message */}
      {capMsg && (
        <div style={st.capAlert}>
          {capMsg}
          <button onClick={() => setCapMsg(null)} style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Module tabs */}
      <div style={st.moduleTabs} role="tablist">
        {MODULES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={activeModule === m.id}
            onClick={() => setActiveModule(m.id)}
            style={{
              ...st.moduleTab,
              background: activeModule === m.id ? 'var(--plum)' : '#fff',
              color: activeModule === m.id ? '#fff' : 'var(--text-mid)',
              borderColor: activeModule === m.id ? 'var(--plum)' : 'rgba(107,63,160,0.15)',
            }}
          >
            <span>{m.emoji}</span>
            <span style={st.moduleTabLabel}>{m.label}</span>
            <span style={{ ...st.moduleCount, background: activeModule === m.id ? 'rgba(255,255,255,0.2)' : 'rgba(107,63,160,0.1)' }}>{m.count}</span>
          </button>
        ))}
      </div>

      {/* Module description */}
      <div style={st.moduleDesc}>
        {activeModule === 'A' && <p>Complete these solo activities to better support your child — and earn discounts along the way. <em>30% monthly cap applies.</em></p>}
        {activeModule === 'B' && <p>Do these activities <strong>together with {childName || 'your child'}</strong>. Both must confirm to unlock rewards for both of you. <em>40% combined monthly cap applies.</em></p>}
        {activeModule === 'C' && <p>Help your child build real-world habits. Tick the checkbox to confirm each challenge — your word is enough for the soft launch.</p>}
        {activeModule === 'D' && <p>Extended activities across Wellbeing, Creative, Values, and Cultural categories. Labelled <em>&lsquo;New this week&rsquo;</em> — rotated monthly to keep things fresh.</p>}
      </div>

      {/* Activity grid */}
      <div style={st.grid}>
        {activeActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            module={activeModule}
            onOpen={(a) => openModal(a, activeModule)}
            doneToday={activeModule === 'C' ? false : hasCompletedActivityToday(activity.id)}
            jointSession={jointSessions[activity.id]}
          />
        ))}
      </div>

      <VoucherWallet vouchers={vouchers} />
      <CapMeter />

      {/* Modals */}
      {activeModal && (() => {
        const { activity, module } = activeModal
        const close = () => setActiveModal(null)
        const complete = (score, total) => handleActivityComplete(activity, module, score, total)

        if (QUIZ_MAP[activity.id]) {
          return <QuizModal activity={activity} questions={QUIZ_MAP[activity.id]} onClose={close} onComplete={complete} />
        }
        if (activity.type === 'article') {
          return <ArticleModal activity={activity} onClose={close} onComplete={complete} />
        }
        if (activity.type === 'tool') {
          return <FlashcardModal activity={activity} onClose={close} onComplete={complete} />
        }
        // Module D types
        if (activity.type === 'steps')     return <StepsModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'checklist') return <ChecklistModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'guided')    return <GuidedModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'text')      return <TextModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'story')     return <StoryModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'rating')    return <RatingModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'phrases')   return <PhrasesModal activity={activity} onClose={close} onComplete={complete} />
        if (activity.type === 'mystery')   return <MysteryModal activity={activity} onClose={close} onComplete={complete} />

        return <ConfirmModal activity={activity} onClose={close} onComplete={complete} module={module} />
      })()}
    </div>
  )
}

// ── Styles ─────────────────────────────────────────────────────
const st = {
  wrapper:    { display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px 0' },
  header:     {},
  title:      { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '8px' },
  subtitle:   { color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '680px' },

  tierBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
    background: '#fff', borderRadius: 'var(--radius-card)', padding: '16px 20px',
    border: '2px solid', boxShadow: 'var(--shadow-small)', flexWrap: 'wrap',
  },
  tierLeft:   { display: 'flex', alignItems: 'center', gap: '12px' },
  tierBadge:  { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 },
  tierLabel:  { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1rem' },
  tierSub:    { fontSize: '0.8rem', color: 'var(--text-mid)' },
  tierRight:  { flex: 1, minWidth: '180px', maxWidth: '260px' },
  tierNextLabel: { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)', marginBottom: '4px' },
  tierTrack:  { height: '6px', background: '#e8e0f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' },
  tierFill:   { height: '100%', borderRadius: '3px', transition: 'width 0.8s ease' },
  tierHint:   { fontSize: '0.72rem', color: 'var(--text-mid)' },

  capAlert: {
    background: '#FFF3CD', border: '1px solid #FFB347', borderRadius: '10px',
    padding: '12px 16px', fontSize: '0.875rem', color: '#856404', fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },

  moduleTabs:    { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  moduleTab:     {
    flex: 1, minWidth: '120px', display: 'flex', alignItems: 'center', gap: '6px',
    padding: '12px 16px', borderRadius: 'var(--radius-card)', border: '2px solid',
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem',
    transition: 'all 0.2s ease', minHeight: '52px',
  },
  moduleTabLabel: { flex: 1, textAlign: 'left' },
  moduleCount:    { fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '20px' },

  moduleDesc: { background: '#f5f0fa', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.5 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' },

  actCard: {
    display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px',
    borderRadius: 'var(--radius-card)', border: '2px solid', textAlign: 'left',
    fontFamily: "'Nunito', sans-serif", transition: 'all 0.2s ease', position: 'relative',
  },
  actCardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  actEmoji:      { fontSize: '1.8rem' },
  donePill:      { fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', background: 'var(--mint)', color: '#fff' },
  categoryPill:  { fontSize: '0.6rem', fontWeight: 700, padding: '3px 7px', borderRadius: '20px', background: 'rgba(107,63,160,0.1)', color: 'var(--violet)' },
  actTitle:      { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '0.95rem', margin: 0 },
  actDesc:       { fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5, margin: 0, flex: 1 },
  actFooter:     { display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' },
  actFormat:     { fontSize: '0.72rem', color: 'var(--text-mid)' },
  actReward:     { fontSize: '0.72rem', fontWeight: 700, color: 'var(--violet)' },
  jointIndicator: { display: 'flex', alignItems: 'center', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px' },

  // Voucher wallet
  walletSection: { background: '#fff', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-small)' },
  sectionTitle:  { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1.1rem', marginBottom: '6px' },
  walletNote:    { fontSize: '0.8rem', color: 'var(--text-mid)', marginBottom: '12px', lineHeight: 1.6 },
  voucherGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  voucherCard:   {
    background: 'linear-gradient(135deg, var(--plum), var(--violet))',
    borderRadius: '14px', padding: '16px', color: '#fff',
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  voucherPct:    { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem' },
  voucherCode:   { fontFamily: 'monospace', fontSize: '0.9rem', background: 'rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: '6px', letterSpacing: '0.1em', fontWeight: 700 },
  voucherExpiry: { fontSize: '0.72rem', opacity: 0.8 },
  voucherBtn:    { padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito', sans-serif" },
  redeemNote:    { fontSize: '0.68rem', opacity: 0.75, lineHeight: 1.4 },

  // Cap meter
  capMeter: { background: '#fff', borderRadius: 'var(--radius-card)', padding: '16px 20px', boxShadow: 'var(--shadow-small)' },
  capRow:   { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  capLabel: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-mid)' },
  capTrack: { height: '8px', background: '#e8e0f0', borderRadius: '4px', overflow: 'hidden' },
  capFill:  { height: '100%', borderRadius: '4px', transition: 'width 0.8s ease' },
  capNote:  { fontSize: '0.72rem', color: 'var(--text-mid)', margin: 0, lineHeight: 1.5 },

  // Modals
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(26,10,46,0.6)',
    zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
  },
  modal: {
    background: '#fff', borderRadius: '20px', padding: '24px',
    width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto',
    boxShadow: '0 16px 48px rgba(61,26,94,0.3)',
  },
  modalHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  modalTitle:   { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.1rem' },
  closeBtn:     { background: 'transparent', border: 'none', fontSize: '1rem', color: 'var(--text-mid)', cursor: 'pointer', padding: '4px 8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBody:    { fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '16px' },

  quizProgress:     { fontSize: '0.8rem', color: 'var(--text-mid)', marginBottom: '8px', fontWeight: 600 },
  quizProgressTrack: { height: '4px', background: '#e8e0f0', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' },
  quizProgressFill:  { height: '100%', background: 'var(--violet)', borderRadius: '2px', transition: 'width 0.3s ease' },
  questionText:  { fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', lineHeight: 1.4 },
  optionsGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optionBtn:     { padding: '12px', borderRadius: '12px', border: '2px solid', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s ease', minHeight: '52px' },
  nextBtn:       { background: 'var(--plum)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px 28px', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' },

  resultsBox:   { textAlign: 'center', padding: '16px 0' },
  resultScore:  { fontSize: '3rem', fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)' },
  resultLabel:  { fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' },
  rewardPill:   { display: 'inline-block', background: 'linear-gradient(135deg, var(--gold), #FFD93D)', color: '#1A0A2E', borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' },

  jointChecks:  { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' },
  checkRow:     { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' },
  freqBadge:    { display: 'inline-block', background: 'rgba(107,63,160,0.08)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--violet)', marginBottom: '12px' },

  flashcardInputRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' },
  flashInput:   { flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '10px', border: '2px solid rgba(107,63,160,0.2)', fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif", color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' },
  cardGrid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginTop: '8px', maxHeight: '220px', overflowY: 'auto' },
  flashcard:    { background: 'linear-gradient(135deg, var(--plum), var(--violet))', borderRadius: '12px', padding: '14px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', minHeight: '80px', justifyContent: 'center' },
  flashCardText: { color: '#fff', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' },
  flashCardHint: { color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' },
  flashDeleteBtn: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  chip: { padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s ease', minHeight: '36px' },

  // Module D modal styles
  inputGroup:      { marginBottom: '16px' },
  inputLabel:      { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' },
  progressBar:     { height: '8px', background: '#e8e0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' },
  progressFill:    { height: '100%', background: 'var(--mint)', borderRadius: '4px', transition: 'width 0.4s ease' },
  checklistGrid:   { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  guidedStepBox:   { background: '#f5f0fa', borderRadius: '16px', padding: '24px', textAlign: 'center', marginTop: '16px' },
  stepNumber:      { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-mid)', marginBottom: '12px' },
  stepInstruction: { fontSize: '1.05rem', fontWeight: 700, color: 'var(--plum)', lineHeight: 1.6, margin: 0 },
  storyPreview:    { background: '#f0faf0', borderRadius: '12px', padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: 1.6, marginTop: '12px', marginBottom: '8px' },
  ratingBtn:       { flex: 1, padding: '10px 6px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.65rem', transition: 'all 0.15s ease', minHeight: '52px', textAlign: 'center' },
  phraseCard:      { border: '2px solid', borderRadius: '12px', padding: '14px 16px', marginBottom: '8px' },
  clueCard:        { background: '#f5f0fa', borderRadius: '10px', padding: '12px 14px', fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '10px' },
  answerBox:       { background: '#f0faf0', borderRadius: '14px', padding: '20px', marginTop: '16px', border: '2px solid var(--mint)' },
}
