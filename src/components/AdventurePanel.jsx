import { useState, useEffect, useRef, useCallback } from 'react'
import { TRAIL_ID, TRAIL_META, STOPS, TOKEN_TO_STOP, OPENING_RIDDLE } from '../data/trailData'
import {
  getTrailProgress,
  startTrail,
  markTrailStopComplete,
  saveDiscountCode,
  getTrailSyncedData,
  addStars,
  earnBadge,
  completeGrandQuiz,
} from '../utils/storage'
import { launchConfetti } from '../utils/confetti'
import { t } from '../utils/i18n'

export default function AdventurePanel({ childName, deviceId, onStarsChange, onBadgesChange, lang = 'en' }) {
  const [screen, setScreen]               = useState('trail-list')
  const [progress, setProgress]           = useState(() => getTrailProgress())
  const [syncedData, setSyncedData]       = useState(() => getTrailSyncedData(TRAIL_ID))
  const [activeStop, setActiveStop]       = useState(null)
  const [scanError, setScanError]         = useState(null)
  const [codeLoading, setCodeLoading]     = useState(false)
  const [codeError, setCodeError]         = useState(null)
  const [copied, setCopied]               = useState(false)
  const [isOnline, setIsOnline]           = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [showRiddleHint, setShowRiddleHint] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizIndex, setQuizIndex]         = useState(0)
  const [quizSelected, setQuizSelected]   = useState(null)
  const [quizConfirmed, setQuizConfirmed] = useState(false)
  const [quizAnswers, setQuizAnswers]     = useState([])
  const scannerRef      = useRef(null)
  const autoAdvanceRef  = useRef(null)

  useEffect(() => {
    const up   = () => setIsOnline(true)
    const down = () => setIsOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    }
  }, [])

  useEffect(() => {
    if (screen === 'quiz-results') launchConfetti()
    if (screen !== 'grand-quiz' && autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current)
      autoAdvanceRef.current = null
    }
  }, [screen])

  // ── QR validation ─────────────────────────────────────────────
  const handleQRScan = useCallback((rawText) => {
    setScanError(null)
    let parsed
    try { parsed = JSON.parse(rawText) } catch {
      setScanError(t('adventure_error_invalid_qr', lang))
      return
    }

    const { trailId, stopNumber, token } = parsed

    if (trailId !== TRAIL_ID) {
      setScanError(t('adventure_error_invalid_qr', lang))
      return
    }
    if (!token || TOKEN_TO_STOP[token] !== stopNumber) {
      setScanError(t('adventure_error_invalid_qr', lang))
      return
    }

    const currentProgress = getTrailProgress()

    if (currentProgress.stopsCompleted.includes(stopNumber)) {
      setScanError(t('adventure_error_already_done', lang))
      return
    }

    const nextExpected = currentProgress.stopsCompleted.length === 0
      ? 1
      : Math.max(...currentProgress.stopsCompleted) + 1

    if (stopNumber !== nextExpected) {
      setScanError(t('adventure_error_wrong_order', lang))
      return
    }

    const synced = getTrailSyncedData(TRAIL_ID)
    const stop   = synced?.stops[stopNumber]
    if (!stop) {
      setScanError(t('adventure_error_load', lang))
      return
    }

    // Stars awarded on scan (v3.0 — not quiz-gated)
    addStars(stop.stars)
    onStarsChange()

    markTrailStopComplete(stopNumber)
    setProgress(getTrailProgress())
    setActiveStop(stop)
    setShowRiddleHint(false)
    setScreen('stop-content')
  }, [lang, onStarsChange])

  // ── QR scanner lifecycle ───────────────────────────────────────
  useEffect(() => {
    if (screen !== 'scanner') return

    let mounted = true

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        const scanner = new Html5Qrcode('qr-viewfinder')
        scannerRef.current = scanner
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!mounted) return
            scanner.stop().catch(() => {})
            handleQRScan(decodedText)
          },
          () => {}
        )
      } catch {
        if (mounted) setScanError(t('adventure_error_camera', lang))
      }
    }

    startScanner()

    return () => {
      mounted = false
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [screen, lang, handleQRScan])

  // ── Start trail ───────────────────────────────────────────────
  function handleStartTrail() {
    if (!isOnline) {
      setScanError(t('adventure_error_no_connection', lang))
      return
    }
    const stopsObject = Object.fromEntries(STOPS.map((stop) => [stop.number, stop]))
    startTrail(TRAIL_ID, stopsObject)
    setProgress(getTrailProgress())
    setSyncedData(getTrailSyncedData(TRAIL_ID))
    setScanError(null)
    setShowRiddleHint(false)
    setScreen('opening-riddle')
  }

  // ── Discount code ─────────────────────────────────────────────
  async function fetchDiscountCode() {
    if (!isOnline) { setScreen('reward'); setCodeLoading(false); return }
    setCodeLoading(true)
    setCodeError(null)
    setScreen('reward')
    try {
      const res  = await fetch('/api/generate-trail-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, trailId: TRAIL_ID }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unknown error')
      saveDiscountCode(data.code, data.issuedAt, data.expiresAt)
      setProgress(getTrailProgress())
    } catch (err) {
      setCodeError(err.message)
    } finally {
      setCodeLoading(false)
    }
  }

  function handleViewReward() {
    const current = getTrailProgress()
    if (current?.discountCode) {
      setScreen('reward')
    } else {
      fetchDiscountCode()
    }
  }

  function copyCode() {
    if (!progress?.discountCode) return
    navigator.clipboard.writeText(progress.discountCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  // ── Grand Quiz ────────────────────────────────────────────────
  function startGrandQuiz() {
    const shuffled = [...STOPS].sort(() => Math.random() - 0.5)
    setQuizQuestions(shuffled)
    setQuizIndex(0)
    setQuizSelected(null)
    setQuizConfirmed(false)
    setQuizAnswers([])
    setScreen('grand-quiz')
  }

  function handleGrandQuizConfirm() {
    if (quizSelected === null || quizConfirmed) return
    const correct    = quizSelected === quizQuestions[quizIndex].quiz.correctIndex
    const newAnswers = [...quizAnswers, { selected: quizSelected, correct }]
    setQuizAnswers(newAnswers)
    setQuizConfirmed(true)

    if (quizIndex + 1 === quizQuestions.length) {
      const score      = newAnswers.filter((a) => a.correct).length
      const bonusStars = score * 10
      addStars(bonusStars)
      onStarsChange()

      let badgeId
      if (score === 8)     badgeId = 'explorer_full'
      else if (score >= 5) badgeId = 'explorer_amazing'
      else if (score > 0)  badgeId = 'explorer_adventurer'
      else                 badgeId = 'brave_explorer'

      const gained = earnBadge(badgeId)
      if (gained) onBadgesChange()
      completeGrandQuiz(score, badgeId)
      setProgress(getTrailProgress())
    }

    // Auto-advance: 1.5s on correct, 2.5s on wrong (SRS v3.0)
    const capturedIndex = quizIndex
    const delay = correct ? 1500 : 2500
    autoAdvanceRef.current = setTimeout(() => {
      autoAdvanceRef.current = null
      if (capturedIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1)
        setQuizSelected(null)
        setQuizConfirmed(false)
      } else {
        setScreen('quiz-results')
      }
    }, delay)
  }

  function handleGrandQuizNext() {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current)
      autoAdvanceRef.current = null
    }
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex((i) => i + 1)
      setQuizSelected(null)
      setQuizConfirmed(false)
    } else {
      setScreen('quiz-results')
    }
  }

  const stopsCount = progress?.stopsCompleted?.length ?? 0

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="panel-enter" style={s.panel}>

      {/* ── Trail list ── */}
      {screen === 'trail-list' && (
        <div>
          <h2 style={s.heading}>{t('adventure_heading', lang)}</h2>
          <p style={s.sub}>{t('adventure_sub', lang)}</p>

          <div style={s.trailCard}>
            <div style={s.trailHeader}>
              <span style={s.trailEmoji}>🚢</span>
              <div>
                <h3 style={s.trailName}>{TRAIL_META.name}</h3>
                <p style={s.trailVenue}>{TRAIL_META.venue}</p>
              </div>
            </div>
            <div style={s.chips}>
              <span style={s.chip}>⚓ {TRAIL_META.stopCount} {t('adventure_stops', lang)}</span>
              <span style={s.chip}>⏱ ~{TRAIL_META.estimatedMinutes} {t('adventure_mins', lang)}</span>
              <span style={s.chip}>{t('adventure_reward_label', lang)}</span>
            </div>

            {(!progress || progress.status === 'NOT_STARTED') && (
              <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={() => setScreen('trail-overview')}>
                {t('adventure_start', lang)}
              </button>
            )}
            {progress?.status === 'IN_PROGRESS' && (
              <>
                <p style={s.progressNote}>{stopsCount} / 8 {t('adventure_stops', lang)}</p>
                <button style={{ ...s.btn, background: 'var(--violet)' }} onClick={() => setScreen('trail-overview')}>
                  {t('adventure_continue', lang)}
                </button>
              </>
            )}
            {(progress?.status === 'ALL_SCANS_COMPLETE' || progress?.status === 'REWARD_UNLOCKED') && (
              <>
                <p style={{ ...s.progressNote, color: 'var(--gold)' }}>All 8 stops complete! 🎉</p>
                <button style={{ ...s.btn, background: '#D4A017' }} onClick={handleViewReward}>
                  Claim Your Reward
                </button>
              </>
            )}
            {progress?.status === 'FULLY_COMPLETED' && (
              <>
                <p style={{ ...s.progressNote, color: 'var(--mint)' }}>
                  Trail complete! Score: {progress.grandQuizScore}/8
                </p>
                <button style={{ ...s.btn, background: 'var(--mint)', color: 'var(--text-dark)' }} onClick={() => setScreen('quiz-results')}>
                  View Your Results
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Trail overview ── */}
      {screen === 'trail-overview' && (
        <div>
          <button style={s.back} onClick={() => setScreen('trail-list')}>{t('adventure_back', lang)}</button>
          <h2 style={s.heading}>{TRAIL_META.name}</h2>
          <p style={s.sub}>{TRAIL_META.venue}</p>

          {scanError && (
            <div style={s.errorBanner}>
              {scanError}
              <button style={s.dismissBtn} onClick={() => setScanError(null)}>✕</button>
            </div>
          )}

          <div style={s.stopList}>
            {STOPS.map((stop) => {
              const done    = progress?.stopsCompleted?.includes(stop.number)
              const nextNum = progress
                ? (progress.stopsCompleted.length === 0 ? 1 : Math.max(...progress.stopsCompleted) + 1)
                : 1
              const locked  = !done && stop.number > nextNum
              return (
                <div key={stop.number} style={{ ...s.stopRow, opacity: locked ? 0.5 : 1 }}>
                  <div style={{
                    ...s.stopCircle,
                    background: done ? 'var(--mint)' : stop.number === nextNum ? 'var(--plum)' : '#ccc',
                  }}>
                    {done ? '✓' : stop.number}
                  </div>
                  <div style={s.stopInfo}>
                    <p style={s.stopName}>{stop.name}</p>
                    <p style={s.stopLocation}>{stop.location}</p>
                    <span style={s.currTag}>{stop.curriculumLink}</span>
                  </div>
                  <span style={s.starChip}>+{stop.stars}⭐</span>
                </div>
              )
            })}
          </div>

          {(!progress || progress.status === 'NOT_STARTED') && (
            <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={handleStartTrail}>
              {t('adventure_start', lang)}
            </button>
          )}
          {progress?.status === 'IN_PROGRESS' && (
            <button style={{ ...s.btn, background: 'var(--violet)' }} onClick={() => { setScanError(null); setScreen('scanner') }}>
              {t('adventure_continue', lang)}
            </button>
          )}
          {(progress?.status === 'ALL_SCANS_COMPLETE' || progress?.status === 'REWARD_UNLOCKED') && (
            <button style={{ ...s.btn, background: '#D4A017' }} onClick={handleViewReward}>
              Claim Your Reward
            </button>
          )}
          {progress?.status === 'FULLY_COMPLETED' && (
            <button style={{ ...s.btn, background: 'var(--mint)', color: 'var(--text-dark)' }} onClick={() => setScreen('quiz-results')}>
              View Your Results
            </button>
          )}
        </div>
      )}

      {/* ── Opening riddle ── */}
      {screen === 'opening-riddle' && (
        <div style={s.centred}>
          <button style={{ ...s.back, display: 'block', textAlign: 'left' }} onClick={() => setScreen('trail-overview')}>
            {t('adventure_back', lang)}
          </button>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🦊</div>
          <h2 style={s.heading}>Sparky&apos;s First Clue!</h2>
          <p style={s.sub}>Solve the riddle to find your first stop</p>

          <div style={s.riddleCard}>
            <span style={s.riddleIcon}>🧩</span>
            <p style={s.riddleText}>{OPENING_RIDDLE.text}</p>
          </div>

          {!showRiddleHint ? (
            <button style={s.hintBtn} onClick={() => setShowRiddleHint(true)}>
              Show Hint 💡
            </button>
          ) : (
            <div style={s.hintPill}>📍 {OPENING_RIDDLE.hint}</div>
          )}

          <button
            style={{ ...s.btn, background: 'var(--plum)', marginTop: 24 }}
            onClick={() => { setShowRiddleHint(false); setScreen('scanner') }}
          >
            I&apos;m Ready — Scan Stop 1! 📷
          </button>
        </div>
      )}

      {/* ── Scanner ── */}
      {screen === 'scanner' && (
        <div style={s.centred}>
          <h2 style={s.heading}>{t('adventure_scanner_heading', lang)}</h2>
          <p style={s.sub}>{t('adventure_scanner_sub', lang)}</p>
          <p style={s.progressNote}>{stopsCount} / 8 {t('adventure_stops', lang)}</p>

          <div id="qr-viewfinder" style={s.viewfinder} />

          {scanError && (
            <div style={s.errorBanner}>
              {scanError}
              <button style={s.dismissBtn} onClick={() => setScanError(null)}>✕</button>
            </div>
          )}

          <button
            style={{ ...s.btn, background: 'var(--plum)', marginTop: 24 }}
            onClick={() => { setScanError(null); setScreen('trail-overview') }}
          >
            {t('adventure_back_to_map', lang)}
          </button>
        </div>
      )}

      {/* ── Stop content ── */}
      {screen === 'stop-content' && activeStop && (
        <div>
          <div style={s.starsEarned}>+{activeStop.stars} Stars earned! ⭐</div>
          <div style={s.stopBadge}>{t('adventure_stop_of', lang).replace('{n}', activeStop.number)}</div>
          <h2 style={{ ...s.heading, color: 'var(--plum)', marginTop: 8 }}>{activeStop.name}</h2>
          <p style={s.stopLocation}>{activeStop.location}</p>
          <span style={{ ...s.currTag, display: 'inline-block', marginBottom: 20 }}>{activeStop.curriculumLink}</span>

          <div style={s.factCard}>
            <span style={{ fontSize: 32 }}>📖</span>
            <p style={s.factText}>{activeStop.fact}</p>
          </div>

          {activeStop.riddle ? (
            <button
              style={{ ...s.btn, background: 'var(--plum)' }}
              onClick={() => { setShowRiddleHint(false); setScreen('riddle') }}
            >
              See Your Next Clue 🧩
            </button>
          ) : (
            <button style={{ ...s.btn, background: '#D4A017' }} onClick={handleViewReward}>
              You&apos;ve done all 8! Claim Your Reward 🎁
            </button>
          )}
        </div>
      )}

      {/* ── Riddle (next stop clue) ── */}
      {screen === 'riddle' && activeStop?.riddle && (
        <div style={s.centred}>
          <button style={{ ...s.back, display: 'block', textAlign: 'left' }} onClick={() => setScreen('stop-content')}>
            {t('adventure_back', lang)}
          </button>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧩</div>
          <h2 style={s.heading}>Clue for Stop {activeStop.number + 1}</h2>
          <p style={s.sub}>Sparky&apos;s clue to find your next stop!</p>

          <div style={s.riddleCard}>
            <p style={s.riddleText}>{activeStop.riddle.text}</p>
          </div>

          {!showRiddleHint ? (
            <button style={s.hintBtn} onClick={() => setShowRiddleHint(true)}>
              Show Hint 💡
            </button>
          ) : (
            <div style={s.hintPill}>📍 {activeStop.riddle.hint}</div>
          )}

          <button
            style={{ ...s.btn, background: 'var(--plum)', marginTop: 24 }}
            onClick={() => { setScanError(null); setShowRiddleHint(false); setScreen('scanner') }}
          >
            Scan Stop {activeStop.number + 1}! 📷
          </button>
        </div>
      )}

      {/* ── Reward ── */}
      {screen === 'reward' && (
        <div style={s.centred}>
          <div style={{ fontSize: 64 }}>🎁</div>
          <h2 style={s.heading}>You Did It!</h2>
          <p style={s.sub}>All 8 stops complete — here&apos;s your gift shop reward!</p>

          {codeLoading && (
            <div style={s.codeBox}>
              <p style={{ color: 'var(--text-mid)' }}>{t('adventure_reward_loading', lang)}</p>
            </div>
          )}

          {!codeLoading && progress?.discountCode && (
            <>
              <div style={s.codeBox}>
                <p style={s.codeText}>{progress.discountCode}</p>
              </div>
              <button style={{ ...s.btn, background: 'var(--plum)', marginBottom: 8 }} onClick={copyCode}>
                {copied ? t('adventure_copied', lang) : t('adventure_copy_code', lang)}
              </button>
              <p style={s.hintText}>{t('adventure_reward_validity', lang)} {TRAIL_META.rewardMinSpend}</p>
            </>
          )}

          {!codeLoading && !progress?.discountCode && !codeError && (
            <div style={{ ...s.errorBanner, background: '#FFF3CD', color: '#856404', borderColor: 'var(--gold)' }}>
              {t('adventure_reward_offline', lang)}
              <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 12 }} onClick={fetchDiscountCode}>
                {t('adventure_quiz_try_again', lang)}
              </button>
            </div>
          )}

          {codeError && (
            <div style={s.errorBanner}>
              {t('adventure_reward_error', lang)}
              <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 12 }} onClick={fetchDiscountCode}>
                {t('adventure_quiz_try_again', lang)}
              </button>
            </div>
          )}

          <div style={{ ...s.mintBanner, marginTop: 24, textAlign: 'left' }}>
            <p style={{ fontWeight: 700, margin: '0 0 8px', color: 'var(--plum)', fontFamily: "'Baloo 2', sans-serif" }}>
              Grand Quiz time! 🏆
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', margin: '0 0 14px', lineHeight: 1.5 }}>
              Answer 8 questions about what you learned. Get them right to earn bonus Stars and win your explorer badge!
            </p>
            <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={startGrandQuiz}>
              Start the Grand Quiz →
            </button>
          </div>
        </div>
      )}

      {/* ── Grand Quiz ── */}
      {screen === 'grand-quiz' && quizQuestions.length > 0 && (
        <div>
          <div style={s.quizHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={s.quizCounter}>Question {quizIndex + 1} of {quizQuestions.length}</span>
              {quizAnswers.length > 0 && (
                <span style={s.quizScore}>{quizAnswers.filter((a) => a.correct).length} correct ⭐</span>
              )}
            </div>
            <div style={s.quizBar}>
              <div style={{ ...s.quizBarFill, width: `${(quizAnswers.length / quizQuestions.length) * 100}%` }} />
            </div>
          </div>

          <p style={s.quizStopLabel}>{quizQuestions[quizIndex].name}</p>
          <p style={s.quizQ}>{quizQuestions[quizIndex].quiz.question}</p>

          <div style={s.optionList}>
            {quizQuestions[quizIndex].quiz.options.map((opt, i) => {
              const isSelected  = quizSelected === i
              const isCorrect   = i === quizQuestions[quizIndex].quiz.correctIndex
              let bg = '#fff'
              if (quizConfirmed && isCorrect)                bg = 'var(--mint)'
              if (quizConfirmed && isSelected && !isCorrect) bg = 'var(--coral)'

              return (
                <button
                  key={i}
                  style={{
                    ...s.optionBtn,
                    background: bg,
                    border: isSelected && !quizConfirmed
                      ? '2px solid var(--plum)'
                      : quizConfirmed && isCorrect
                        ? '2px solid var(--mint)'
                        : quizConfirmed && isSelected && !isCorrect
                          ? '2px solid var(--coral)'
                          : '2px solid transparent',
                    opacity: quizConfirmed && !isSelected && !isCorrect ? 0.5 : 1,
                  }}
                  onClick={() => { if (!quizConfirmed) setQuizSelected(i) }}
                  disabled={quizConfirmed}
                >
                  <span style={s.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {!quizConfirmed ? (
            <button
              style={{ ...s.btn, background: quizSelected !== null ? 'var(--plum)' : '#ccc', cursor: quizSelected !== null ? 'pointer' : 'default' }}
              onClick={handleGrandQuizConfirm}
              disabled={quizSelected === null}
            >
              Confirm Answer
            </button>
          ) : (
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              {quizAnswers[quizIndex]?.correct ? (
                <p style={{ color: 'var(--mint)', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 14px' }}>
                  Correct! +10 bonus Stars ⭐
                </p>
              ) : (
                <>
                  <p style={{ color: 'var(--coral)', fontWeight: 600, margin: '0 0 10px' }}>
                    Not quite — but well tried!
                  </p>
                  {quizQuestions[quizIndex]?.sparky_explanation && (
                    <div style={{ ...s.sparkyExplanation, maxWidth: 480, margin: '0 auto 12px', textAlign: 'left' }}>
                      <span style={s.sparkyAvatar}>🦊</span>
                      <p style={s.sparkyText}>{quizQuestions[quizIndex].sparky_explanation}</p>
                    </div>
                  )}
                </>
              )}
              <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={handleGrandQuizNext}>
                {quizIndex + 1 < quizQuestions.length ? 'Continue →' : 'See Your Results! 🏆'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Quiz results ── */}
      {screen === 'quiz-results' && progress?.status === 'FULLY_COMPLETED' && (
        <div style={s.centred}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>
            {progress.grandQuizBadgeId === 'explorer_full' ? '🧭'
              : progress.grandQuizBadgeId === 'explorer_amazing' ? '⭐'
              : progress.grandQuizBadgeId === 'explorer_adventurer' ? '🌟'
              : '🦁'}
          </div>

          <h2 style={s.heading}>
            {progress.grandQuizBadgeId === 'explorer_full'
              ? 'Full Explorer!'
              : progress.grandQuizBadgeId === 'explorer_amazing'
                ? 'Amazing Explorer!'
                : progress.grandQuizBadgeId === 'explorer_adventurer'
                  ? 'Brilliant Adventurer!'
                  : 'Brave Explorer!'}
          </h2>

          <div style={s.scoreCircle}>
            <span style={s.scoreBig}>{progress.grandQuizScore}</span>
            <span style={s.scoreOutOf}>/8</span>
          </div>

          <p style={{ ...s.sub, marginTop: 8 }}>
            {progress.grandQuizBadgeId === 'explorer_full'
              ? 'Perfect score — you nailed every single question!'
              : progress.grandQuizBadgeId === 'explorer_amazing'
                ? 'Brilliant! You answered most of the Grand Quiz correctly.'
                : progress.grandQuizBadgeId === 'explorer_adventurer'
                  ? 'Great job completing the whole HMS Alliance Trail!'
                  : 'Well done for completing the Grand Quiz — keep exploring to learn more!'}
          </p>

          <div style={s.resultStats}>
            <div style={s.statItem}>
              <span style={s.statNum}>+{progress.grandQuizScore * 10}</span>
              <span style={s.statLabel}>Bonus Stars</span>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <span style={s.statNum}>{progress.grandQuizScore}/8</span>
              <span style={s.statLabel}>Correct</span>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <span style={s.statNum}>8/8</span>
              <span style={s.statLabel}>Stops</span>
            </div>
          </div>

          {progress?.discountCode && (
            <div style={{ marginTop: 20 }}>
              <p style={{ ...s.sub, marginBottom: 8, fontSize: '0.9rem' }}>Don&apos;t forget your gift shop reward:</p>
              <div style={{ ...s.codeBox, maxWidth: 260, margin: '0 auto' }}>
                <p style={s.codeText}>{progress.discountCode}</p>
              </div>
            </div>
          )}

          <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 28 }} onClick={() => setScreen('trail-list')}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  )
}

const s = {
  panel:    { animation: 'fadeUp 0.35s ease', padding: '0 0 40px' },
  heading:  { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.6rem', color: 'var(--plum)', margin: '0 0 6px' },
  sub:      { color: 'var(--text-mid)', marginBottom: 24 },
  back:     { background: 'none', border: 'none', color: 'var(--plum)', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', padding: '0 0 16px', fontFamily: "'Nunito', 'Noto Sans', sans-serif" },
  btn:      { display: 'block', width: '100%', padding: '14px 24px', borderRadius: 40, border: 'none', color: '#fff', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  centred:  { textAlign: 'center' },

  // Trail card
  trailCard:   { background: '#fff', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)', marginBottom: 20 },
  trailHeader: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 },
  trailEmoji:  { fontSize: 40 },
  trailName:   { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.2rem', color: 'var(--plum)', margin: 0 },
  trailVenue:  { color: 'var(--text-mid)', fontSize: '0.85rem', margin: '4px 0 0' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip:  { background: 'rgba(61,26,94,0.08)', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text-mid)' },
  progressNote: { textAlign: 'center', color: 'var(--violet)', fontWeight: 600, margin: '12px 0' },

  // Stop list
  stopList:   { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  stopRow:    { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow-small)' },
  stopCircle: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 },
  stopInfo:   { flex: 1 },
  stopName:   { fontWeight: 700, color: 'var(--text-dark)', margin: 0, fontSize: '0.95rem' },
  stopLocation: { color: 'var(--text-mid)', fontSize: '0.8rem', margin: '2px 0 4px' },
  currTag:    { background: 'rgba(78,205,196,0.15)', color: 'var(--mint)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 },
  starChip:   { fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', flexShrink: 0 },

  // Scanner
  viewfinder: { width: 300, height: 300, borderRadius: 20, border: '3px solid var(--mint)', margin: '24px auto', animation: 'pulseRings 1.5s ease-out infinite', overflow: 'hidden' },

  // Riddle
  riddleCard: { background: 'rgba(61,26,94,0.05)', border: '2px dashed var(--violet)', borderRadius: 16, padding: 20, margin: '0 auto 16px', maxWidth: 440, textAlign: 'left' },
  riddleIcon: { fontSize: 28, display: 'block', marginBottom: 10 },
  riddleText: { fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-dark)', margin: 0 },
  hintBtn:    { background: 'none', border: '2px solid var(--gold)', borderRadius: 40, padding: '8px 20px', cursor: 'pointer', color: 'var(--gold)', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem' },
  hintPill:   { display: 'inline-block', background: 'rgba(212,160,23,0.12)', border: '1px solid var(--gold)', borderRadius: 40, padding: '8px 18px', color: '#856404', fontWeight: 600, fontSize: '0.9rem', marginTop: 4 },

  // Stop content
  starsEarned: { background: 'linear-gradient(135deg, var(--gold), #FFD93D)', borderRadius: 12, padding: '10px 16px', textAlign: 'center', fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: 'var(--plum)', marginBottom: 16 },
  stopBadge:  { display: 'inline-block', background: 'var(--plum)', color: '#fff', borderRadius: 20, padding: '4px 16px', fontSize: '0.85rem', fontWeight: 700 },
  factCard:   { background: '#fff', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)', border: '2px solid var(--gold)', marginBottom: 24, textAlign: 'left' },
  factText:   { fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-dark)', margin: '12px 0 0' },
  hintText:   { textAlign: 'center', color: 'var(--text-mid)', fontSize: '0.85rem', marginTop: 10 },

  // Errors
  errorBanner: { background: 'rgba(255,107,107,0.12)', border: '1px solid var(--coral)', borderRadius: 12, padding: 16, color: 'var(--coral)', marginTop: 16, position: 'relative' },
  dismissBtn:  { position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontSize: '1rem' },
  mintBanner:  { background: 'rgba(78,205,196,0.12)', border: '1px solid var(--mint)', borderRadius: 14, padding: 16, color: 'var(--text-dark)' },

  // Discount code
  codeBox:  { background: '#fff', border: '2px solid var(--gold)', borderRadius: 16, padding: '20px 24px', margin: '16px auto', maxWidth: 300 },
  codeText: { fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 700, color: 'var(--plum)', letterSpacing: 2, margin: 0 },

  // Grand quiz
  quizHeader:  { marginBottom: 20 },
  quizCounter: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: 'var(--plum)', display: 'block', marginBottom: 8 },
  quizBar:     { height: 8, background: 'rgba(61,26,94,0.1)', borderRadius: 4, overflow: 'hidden' },
  quizBarFill: { height: '100%', background: 'var(--plum)', borderRadius: 4, transition: 'width 0.4s ease' },
  quizScore:     { fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: 'var(--gold)' },
  quizStopLabel: { fontFamily: "'Baloo 2', sans-serif", color: 'var(--violet)', fontSize: '0.9rem', margin: '0 0 6px', fontWeight: 700 },
  quizQ:       { fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 20, lineHeight: 1.5 },
  optionList:  { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  optionBtn:   { width: '100%', padding: '14px 18px', borderRadius: 14, cursor: 'pointer', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 600, fontSize: '0.95rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s ease' },
  optionLetter: { width: 28, height: 28, borderRadius: '50%', background: 'rgba(61,26,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 },

  // Quiz results
  scoreCircle: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4, margin: '16px 0 4px' },
  scoreBig:    { fontFamily: "'Baloo 2', sans-serif", fontSize: '4rem', fontWeight: 800, color: 'var(--plum)', lineHeight: 1 },
  scoreOutOf:  { fontFamily: "'Baloo 2', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text-mid)', lineHeight: 1 },
  resultStats: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, background: 'rgba(61,26,94,0.06)', borderRadius: 16, padding: '16px 24px', margin: '20px auto 0', maxWidth: 320 },
  statItem:    { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  statNum:     { fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--plum)' },
  statLabel:   { fontSize: '0.72rem', color: 'var(--text-mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  statDivider:       { width: 1, height: 40, background: 'rgba(61,26,94,0.12)' },
  sparkyExplanation: { display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(61,26,94,0.06)', border: '1px solid rgba(61,26,94,0.15)', borderRadius: 14, padding: '14px 16px' },
  sparkyAvatar:      { fontSize: 28, flexShrink: 0, lineHeight: 1 },
  sparkyText:        { fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-dark)', margin: 0, fontStyle: 'italic' },
}
