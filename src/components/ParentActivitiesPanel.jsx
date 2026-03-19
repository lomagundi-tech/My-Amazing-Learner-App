import { useState, useEffect } from 'react'
import {
  getParentCompletions, addParentCompletion, hasCompletedActivityToday,
  getParentTier, getParentMonthlyStats,
  addParentVoucher, getActiveVouchers, markVoucherUsed,
  initiateJointSession, completeJointSide, getJointSession,
  getParentFlashcards, saveParentFlashcard, deleteParentFlashcard,
} from '../utils/storage'
import {
  MODULE_A, MODULE_B, MODULE_C, PARENT_TIERS,
  SPELLING_BEE_QUESTIONS, GENERAL_KNOWLEDGE_QUESTIONS, MATHS_MENTAL_QUESTIONS,
  READING_TIP_ARTICLE, FLASHCARD_TOPICS,
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
  const progress = tierIndex === 4 ? 100 : Math.round((stats.total / (tierIndex === 0 ? 5 : tierIndex === 1 ? 10 : tierIndex === 2 ? 15 : 20)) * 100)

  const tierColours = ['#9E9E9E', '#CD7F32', '#A8A9AD', '#FFB347', '#6B3FA0']

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
    if (current + 1 >= total) {
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
    }
  }

  function handleFinish() {
    onComplete(score, total)
    onClose()
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
                let bg = '#f5f0fa'
                let border = 'rgba(107,63,160,0.15)'
                let color = 'var(--text-dark)'
                if (selected) {
                  if (opt === q.answer) { bg = 'var(--mint)'; border = 'var(--mint)'; color = '#fff' }
                  else if (opt === selected && opt !== q.answer) { bg = 'var(--coral)'; border = 'var(--coral)'; color = '#fff' }
                }
                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    style={{ ...st.optionBtn, background: bg, borderColor: border, color }}
                  >
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
            {activity.reward.pct > 0 && (
              <div style={st.rewardPill}>
                🎉 You earned {activity.reward.label}!
              </div>
            )}
            <button onClick={handleFinish} style={st.nextBtn}>Claim Reward &amp; Close</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Article modal (Reading Tip) ───────────────────────────────
function ArticleModal({ activity, onClose, onComplete }) {
  const [stage, setStage] = useState('read') // 'read' | 'quiz' | 'done'
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
            {selected && <div style={{ textAlign: 'center', marginTop: '12px' }}><button onClick={handleNext} style={st.nextBtn}>{current + 1 >= qs.length ? 'Finish' : 'Next'}</button></div>}
          </>
        )}

        {stage === 'done' && (
          <div style={st.resultsBox}>
            <div style={st.resultScore}>{score}/{qs.length}</div>
            <div style={st.resultLabel}>Reading tip complete!</div>
            <div style={st.rewardPill}>🏅 Badge unlocked: Reading Champion</div>
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
    setFront('')
    setBack('')
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

        {/* Topic selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button onClick={() => setSelectedTopic(null)} style={{ ...st.chip, background: !selectedTopic ? 'var(--plum)' : '#f0ebfa', color: !selectedTopic ? '#fff' : 'var(--violet)' }}>All</button>
          {FLASHCARD_TOPICS.map((t) => (
            <button key={t.id} onClick={() => setSelectedTopic(t.id)} style={{ ...st.chip, background: selectedTopic === t.id ? 'var(--plum)' : '#f0ebfa', color: selectedTopic === t.id ? '#fff' : 'var(--violet)' }}>{t.label}</button>
          ))}
        </div>

        {/* Add custom card */}
        <div style={st.flashcardInputRow}>
          <input value={front} onChange={(e) => setFront(e.target.value)} placeholder="Front (question)" style={st.flashInput} />
          <input value={back} onChange={(e) => setBack(e.target.value)} placeholder="Back (answer)" style={st.flashInput} />
          <button onClick={handleAdd} disabled={!front.trim() || !back.trim() || !selectedTopic} style={{ ...st.nextBtn, padding: '10px 18px', margin: 0 }}>+ Add</button>
        </div>
        {!selectedTopic && <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', marginBottom: '8px' }}>Select a topic above to add cards.</p>}

        {/* Card grid */}
        <div style={st.cardGrid}>
          {/* Pre-made topic cards */}
          {selectedTopic && FLASHCARD_TOPICS.find((t) => t.id === selectedTopic)?.cards.map((card, i) => (
            <div key={i} style={st.flashcard} onClick={() => setFlipped((f) => ({ ...f, [`pre_${i}`]: !f[`pre_${i}`] }))}>
              <span style={st.flashCardText}>{flipped[`pre_${i}`] ? card.split('→')[1]?.trim() ?? card : card.split('→')[0]?.trim() ?? card}</span>
              <span style={st.flashCardHint}>tap to flip</span>
            </div>
          ))}
          {/* Custom cards */}
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

// ── Simple confirm modal (cook a recipe, nature walk, etc.) ───
function ConfirmModal({ activity, onClose, onComplete }) {
  const [parentDone, setParentDone] = useState(false)
  const [childDone, setChildDone] = useState(false)
  const isJoint = !!activity.childEarns

  return (
    <div style={st.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={st.modal}>
        <div style={st.modalHeader}>
          <h3 style={st.modalTitle}>{activity.emoji} {activity.title}</h3>
          <button onClick={onClose} style={st.closeBtn} aria-label="Close">✕</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: '20px' }}>{activity.description}</p>

        {isJoint ? (
          <div style={st.jointChecks}>
            <label style={st.checkRow}>
              <input type="checkbox" checked={parentDone} onChange={(e) => setParentDone(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span>I (parent) have completed my part</span>
            </label>
            <label style={st.checkRow}>
              <input type="checkbox" checked={childDone} onChange={(e) => setChildDone(e.target.checked)} style={{ width: '20px', height: '20px' }} />
              <span>My child has completed their part</span>
            </label>
            {activity.childEarns && (
              <div style={st.rewardPill}>Child earns {activity.childEarns} stars &bull; You earn: {activity.parentReward}</div>
            )}
          </div>
        ) : (
          <label style={st.checkRow}>
            <input type="checkbox" checked={parentDone} onChange={(e) => setParentDone(e.target.checked)} style={{ width: '20px', height: '20px' }} />
            <span>I have completed this activity</span>
          </label>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => { onComplete(isJoint ? (parentDone && childDone ? 1 : 0) : (parentDone ? 1 : 0), 1); onClose() }}
            disabled={isJoint ? !(parentDone && childDone) : !parentDone}
            style={{ ...st.nextBtn, opacity: (isJoint ? parentDone && childDone : parentDone) ? 1 : 0.4 }}
          >
            Mark Complete &amp; Claim Reward
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Voucher wallet ─────────────────────────────────────────────
function VoucherWallet({ vouchers, onRefresh }) {
  const [copied, setCopied] = useState(null)
  const [applying, setApplying] = useState(null)
  const [applyMsg, setApplyMsg] = useState(null)

  async function handleApply(voucher) {
    setApplying(voucher.id)
    try {
      const res = await fetch('/api/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode: voucher.code, action: 'apply' }),
      })
      const data = await res.json()
      setApplyMsg(data.message)
      markVoucherUsed(voucher.id)
      onRefresh()
    } catch {
      setApplyMsg('Could not apply voucher. Please try again.')
    } finally {
      setApplying(null)
    }
  }

  function copyCode(voucher) {
    navigator.clipboard?.writeText(voucher.code).catch(() => {})
    setCopied(voucher.id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (vouchers.length === 0) return null

  return (
    <div style={st.walletSection}>
      <h3 style={st.sectionTitle}>💳 Your Vouchers ({vouchers.length} active)</h3>
      <p style={st.walletNote}>Vouchers apply automatically at your next billing cycle once connected to your account. (Stripe integration coming soon.)</p>
      {applyMsg && <div style={st.applyMsg}>{applyMsg}</div>}
      <div style={st.voucherGrid}>
        {vouchers.map((v) => {
          const expiresIn = Math.ceil((new Date(v.expiresAt) - new Date()) / 86400000)
          return (
            <div key={v.id} style={st.voucherCard}>
              <div style={st.voucherPct}>{v.pct}% off</div>
              <div style={st.voucherCode}>{v.code}</div>
              <div style={st.voucherExpiry}>Expires in {expiresIn} day{expiresIn !== 1 ? 's' : ''}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => copyCode(v)} style={st.voucherBtn}>{copied === v.id ? 'Copied!' : 'Copy Code'}</button>
                <button onClick={() => handleApply(v)} disabled={applying === v.id} style={{ ...st.voucherBtn, background: 'var(--plum)', color: '#fff' }}>
                  {applying === v.id ? '...' : 'Apply'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Activity card ──────────────────────────────────────────────
function ActivityCard({ activity, module, onOpen, doneToday, jointSession }) {
  const isJoint = module === 'B'
  const bothComplete = jointSession?.status === 'complete'
  const done = doneToday || bothComplete

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
        {done && <span style={st.donePill}>Done ✓</span>}
        {isJoint && !done && jointSession && (
          <span style={{ ...st.donePill, background: '#FFB347', color: '#000' }}>
            {jointSession.parentDone && !jointSession.childDone ? 'Awaiting child' : 'In progress'}
          </span>
        )}
      </div>
      <h3 style={st.actTitle}>{activity.title}</h3>
      <p style={st.actDesc}>{activity.description}</p>
      <div style={st.actFooter}>
        <span style={st.actFormat}>{activity.format || (isJoint ? `Child earns ${activity.childEarns} stars` : '')}</span>
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
export default function ParentActivitiesPanel({ childName }) {
  const [activeModule, setActiveModule] = useState('A')
  const [activeModal, setActiveModal] = useState(null) // { activity, module }
  const [completions, setCompletions] = useState(() => getParentCompletions())
  const [vouchers, setVouchers] = useState(() => getActiveVouchers())
  const [stats, setStats] = useState(() => getParentMonthlyStats())
  const [jointSessions, setJointSessions] = useState({})

  // Build a map of activityId → joint session for Module B
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
      // Ensure joint session exists
      initiateJointSession(activity.id)
      setJointSessions((prev) => ({ ...prev, [activity.id]: getJointSession(activity.id) }))
    }
    setActiveModal({ activity, module })
  }

  function handleActivityComplete(activity, module, score, total) {
    const passed = total === 0 || score >= total * 0.5

    if (module === 'B') {
      // Mark both sides complete via the joint session flow
      completeJointSide(activity.id, 'parent')
      completeJointSide(activity.id, 'child')
      const session = getJointSession(activity.id)
      if (session?.status === 'complete' && !session.rewardGranted) {
        addParentCompletion(activity.id, 'B')
        if (activity.rewardPct > 0) addParentVoucher(activity.id, activity.rewardPct, activity.parentReward)
      }
    } else if (passed) {
      addParentCompletion(activity.id, module)
      if (activity.reward?.pct > 0) addParentVoucher(activity.id, activity.reward.pct, activity.reward.label)
    }

    refreshState()
  }

  const MODULES = [
    { id: 'A', label: 'Solo Activities', emoji: '👤', count: MODULE_A.length },
    { id: 'B', label: 'Do It Together', emoji: '👨‍👧', count: MODULE_B.length },
    { id: 'C', label: 'Life Skills', emoji: '🌟', count: MODULE_C.length, comingSoon: true },
  ]

  const activeActivities = activeModule === 'A' ? MODULE_A : activeModule === 'B' ? MODULE_B : MODULE_C

  return (
    <div className="panel-enter" style={st.wrapper}>

      {/* Header */}
      <div style={st.header}>
        <h2 style={st.title}>
          👋 Parent Activity Hub{childName ? ` — supporting ${childName}` : ''}
        </h2>
        <p style={st.subtitle}>
          Complete activities to earn discount vouchers, unlock badges, and strengthen your child's learning.
          Discounts are capped at 40% per month across all modules.
        </p>
      </div>

      {/* Tier banner */}
      <TierBanner stats={stats} />

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
            {m.comingSoon
              ? <span style={st.soonPill}>Soon</span>
              : <span style={{ ...st.moduleCount, background: activeModule === m.id ? 'rgba(255,255,255,0.2)' : 'rgba(107,63,160,0.1)' }}>{m.count}</span>
            }
          </button>
        ))}
      </div>

      {/* Module description strip */}
      <div style={st.moduleDesc}>
        {activeModule === 'A' && <p>Complete these activities solo to better support your child — and earn discounts along the way.</p>}
        {activeModule === 'B' && <p>Do these activities <strong>together with {childName || 'your child'}</strong>. Both must confirm to unlock rewards for both of you.</p>}
        {activeModule === 'C' && <p>Coming soon — reward your child for building real-world habits with photo &amp; video evidence. 📸</p>}
      </div>

      {/* Activity grid */}
      {activeModule === 'C' ? (
        <div style={st.grid}>
          {MODULE_C.map((activity) => (
            <div key={activity.id} style={{ ...st.actCard, background: '#f5f0fa', borderColor: 'rgba(107,63,160,0.12)', position: 'relative', cursor: 'default' }}>
              <div style={st.comingSoonOverlay}>Coming Soon</div>
              <span style={st.actEmoji}>{activity.emoji}</span>
              <h3 style={st.actTitle}>{activity.title}</h3>
              <p style={st.actDesc}>{activity.freq} · {activity.evidence}</p>
              <div style={st.actFooter}>
                <span style={st.actReward}>Child earns {activity.childEarns} stars · {activity.parentReward}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={st.grid}>
          {activeActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              module={activeModule}
              onOpen={(a) => openModal(a, activeModule)}
              doneToday={hasCompletedActivityToday(activity.id)}
              jointSession={jointSessions[activity.id]}
            />
          ))}
        </div>
      )}

      {/* Voucher wallet */}
      <VoucherWallet vouchers={vouchers} onRefresh={refreshState} />

      {/* Monthly cap notice */}
      <div style={st.capNotice}>
        💡 Discounts are capped at 30% per month for solo activities and 40% combined. Vouchers are single-use and expire 30 days after issue.
      </div>

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
        return <ConfirmModal activity={activity} onClose={close} onComplete={complete} />
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

  // Tier banner
  tierBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
    background: '#fff', borderRadius: 'var(--radius-card)', padding: '16px 20px',
    border: '2px solid', boxShadow: 'var(--shadow-small)',
    flexWrap: 'wrap',
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

  // Module tabs
  moduleTabs: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  moduleTab:  {
    flex: 1, minWidth: '120px', display: 'flex', alignItems: 'center', gap: '6px',
    padding: '12px 16px', borderRadius: 'var(--radius-card)', border: '2px solid',
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem',
    transition: 'all 0.2s ease', minHeight: '52px',
  },
  moduleTabLabel: { flex: 1, textAlign: 'left' },
  moduleCount:    { fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '20px' },
  soonPill:       { fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: '20px', background: 'rgba(255,179,71,0.2)', color: '#B8720A' },

  moduleDesc: { background: '#f5f0fa', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text-mid)', lineHeight: 1.5 },

  // Activity grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' },

  actCard: {
    display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px',
    borderRadius: 'var(--radius-card)', border: '2px solid', textAlign: 'left',
    fontFamily: "'Nunito', sans-serif", transition: 'all 0.2s ease',
    position: 'relative',
  },
  actCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  actEmoji:   { fontSize: '1.8rem' },
  donePill:   { fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', background: 'var(--mint)', color: '#fff' },
  actTitle:   { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '0.95rem', margin: 0 },
  actDesc:    { fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5, margin: 0, flex: 1 },
  actFooter:  { display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' },
  actFormat:  { fontSize: '0.72rem', color: 'var(--text-mid)' },
  actReward:  { fontSize: '0.72rem', fontWeight: 700, color: 'var(--violet)' },

  jointIndicator: { display: 'flex', alignItems: 'center', fontSize: '0.72rem', fontWeight: 700, marginTop: '4px' },

  comingSoonOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
    borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1rem',
    backdropFilter: 'blur(2px)',
  },

  // Voucher wallet
  walletSection: { background: '#fff', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-small)' },
  sectionTitle:  { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1.1rem', marginBottom: '6px' },
  walletNote:    { fontSize: '0.8rem', color: 'var(--text-mid)', marginBottom: '12px', lineHeight: 1.5 },
  applyMsg:      { background: '#e8f5e9', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#2E7D32', marginBottom: '12px', fontWeight: 600 },
  voucherGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
  voucherCard:   {
    background: 'linear-gradient(135deg, var(--plum), var(--violet))',
    borderRadius: '14px', padding: '16px', color: '#fff',
    display: 'flex', flexDirection: 'column', gap: '6px',
  },
  voucherPct:    { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.4rem' },
  voucherCode:   { fontFamily: 'monospace', fontSize: '0.8rem', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '6px', letterSpacing: '0.05em' },
  voucherExpiry: { fontSize: '0.72rem', opacity: 0.8 },
  voucherBtn:    { flex: 1, padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito', sans-serif" },

  capNotice: {
    background: 'rgba(107,63,160,0.06)', borderRadius: '10px', padding: '12px 16px',
    fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.5,
  },

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
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  modalTitle:  { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.1rem' },
  closeBtn:    { background: 'transparent', border: 'none', fontSize: '1rem', color: 'var(--text-mid)', cursor: 'pointer', padding: '4px 8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  quizProgress: { fontSize: '0.8rem', color: 'var(--text-mid)', marginBottom: '8px', fontWeight: 600 },
  quizProgressTrack: { height: '4px', background: '#e8e0f0', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' },
  quizProgressFill:  { height: '100%', background: 'var(--violet)', borderRadius: '2px', transition: 'width 0.3s ease' },
  questionText: { fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px', lineHeight: 1.4 },
  optionsGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optionBtn:    { padding: '12px', borderRadius: '12px', border: '2px solid', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s ease', minHeight: '52px' },
  nextBtn:      { background: 'var(--plum)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '12px 28px', fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', marginTop: '8px' },

  resultsBox:   { textAlign: 'center', padding: '16px 0' },
  resultScore:  { fontSize: '3rem', fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)' },
  resultLabel:  { fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '16px' },
  rewardPill:   { display: 'inline-block', background: 'linear-gradient(135deg, var(--gold), #FFD93D)', color: '#1A0A2E', borderRadius: 'var(--radius-pill)', padding: '8px 20px', fontWeight: 700, fontSize: '0.875rem', marginBottom: '16px' },

  // Joint confirm
  jointChecks: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' },
  checkRow:    { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' },

  // Flashcard builder
  flashcardInputRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' },
  flashInput:  { flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '10px', border: '2px solid rgba(107,63,160,0.2)', fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif", color: 'var(--text-dark)', outline: 'none' },
  cardGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginTop: '8px', maxHeight: '220px', overflowY: 'auto' },
  flashcard:   { background: 'linear-gradient(135deg, var(--plum), var(--violet))', borderRadius: '12px', padding: '14px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative', minHeight: '80px', justifyContent: 'center' },
  flashCardText: { color: '#fff', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' },
  flashCardHint: { color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' },
  flashDeleteBtn: { position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  chip: { padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", transition: 'all 0.15s ease', minHeight: '36px' },
}
