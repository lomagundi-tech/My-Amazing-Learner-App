import { useState, useEffect, useRef, useCallback } from 'react'
import { TRAIL_ID, TRAIL_META, STOPS, TOKEN_TO_STOP } from '../data/trailData'
import {
  getTrailProgress,
  startTrail,
  markTrailStopComplete,
  saveDiscountCode,
  getTrailSyncedData,
  addStars,
  earnBadge,
} from '../utils/storage'
import { launchConfetti } from '../utils/confetti'
import { t } from '../utils/i18n'

export default function AdventurePanel({ childName, deviceId, onStarsChange, onBadgesChange, lang = 'en' }) {
  const [screen, setScreen]             = useState('trail-list')
  const [progress, setProgress]         = useState(() => getTrailProgress())
  const [syncedData, setSyncedData]     = useState(() => getTrailSyncedData(TRAIL_ID))
  const [activeStop, setActiveStop]     = useState(null)
  const [scanError, setScanError]       = useState(null)
  const [quizSelected, setQuizSelected] = useState(null)
  const [quizResult, setQuizResult]     = useState(null)
  const [codeLoading, setCodeLoading]   = useState(false)
  const [codeError, setCodeError]       = useState(null)
  const [copied, setCopied]             = useState(false)
  const [isOnline, setIsOnline]         = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const scannerRef = useRef(null)

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

  // ── Completion confetti ────────────────────────────────────────
  useEffect(() => {
    if (screen === 'completion') launchConfetti()
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

    setActiveStop(stop)
    setQuizSelected(null)
    setQuizResult(null)
    setScreen('stop-content')
  }, [lang])

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
    const stopsObject = Object.fromEntries(STOPS.map((s) => [s.number, s]))
    startTrail(TRAIL_ID, stopsObject)
    setProgress(getTrailProgress())
    setSyncedData(getTrailSyncedData(TRAIL_ID))
    setScanError(null)
    setScreen('scanner')
  }

  // ── Quiz answer ───────────────────────────────────────────────
  function handleQuizAnswer(selectedIndex) {
    if (quizResult !== null) return
    setQuizSelected(selectedIndex)
    const correct = selectedIndex === activeStop.quiz.correctIndex
    setQuizResult(correct ? 'correct' : 'wrong')

    if (correct) {
      addStars(activeStop.stars)
      onStarsChange()
      const { status } = markTrailStopComplete(activeStop.number)
      setProgress(getTrailProgress())

      if (status === 'FULLY_COMPLETED') {
        const gained = earnBadge('explorer_full')
        if (gained) { onBadgesChange(); launchConfetti() }
      }
    }
  }

  function handleQuizNext() {
    if (quizResult === 'wrong') {
      setQuizSelected(null)
      setQuizResult(null)
      return
    }
    const currentProgress = getTrailProgress()
    if (currentProgress.status === 'FULLY_COMPLETED') {
      setScreen('completion')
      return
    }
    if (currentProgress.status === 'REWARD_UNLOCKED' && !currentProgress.discountCode) {
      fetchDiscountCode()
      return
    }
    if (currentProgress.status === 'REWARD_UNLOCKED' && currentProgress.discountCode) {
      setScreen('reward')
      return
    }
    setScanError(null)
    setScreen('scanner')
  }

  // ── Discount code ─────────────────────────────────────────────
  async function fetchDiscountCode() {
    if (!isOnline) { setScreen('reward'); return }
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

  function copyCode() {
    if (!progress?.discountCode) return
    navigator.clipboard.writeText(progress.discountCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
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
            {progress?.status === 'REWARD_UNLOCKED' && (
              <>
                <p style={{ ...s.progressNote, color: 'var(--gold)' }}>{t('adventure_reward_unlocked', lang)}</p>
                <button style={{ ...s.btn, background: '#D4A017' }} onClick={() => setScreen('reward')}>
                  {t('adventure_show_reward', lang)}
                </button>
              </>
            )}
            {progress?.status === 'FULLY_COMPLETED' && (
              <>
                <p style={{ ...s.progressNote, color: 'var(--mint)' }}>{t('adventure_all_done_label', lang)}</p>
                <button style={{ ...s.btn, background: 'var(--mint)', color: 'var(--text-dark)' }} onClick={() => setScreen('completion')}>
                  {t('adventure_view_completion', lang)}
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
              const nextNum = progress ? (progress.stopsCompleted.length === 0 ? 1 : Math.max(...progress.stopsCompleted) + 1) : 1
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

          {(!progress || progress.status === 'NOT_STARTED') ? (
            <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={handleStartTrail}>
              {t('adventure_start', lang)}
            </button>
          ) : (
            <button style={{ ...s.btn, background: 'var(--violet)' }} onClick={() => { setScanError(null); setScreen('scanner') }}>
              {t('adventure_continue', lang)}
            </button>
          )}
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

          <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 24 }} onClick={() => { setScanError(null); setScreen('trail-overview') }}>
            {t('adventure_back_to_map', lang)}
          </button>
        </div>
      )}

      {/* ── Stop content ── */}
      {screen === 'stop-content' && activeStop && (
        <div>
          <button style={s.back} onClick={() => setScreen('scanner')}>{t('adventure_back', lang)}</button>
          <div style={s.stopBadge}>{t('adventure_stop_of', lang).replace('{n}', activeStop.number)}</div>
          <h2 style={{ ...s.heading, color: 'var(--plum)' }}>{activeStop.name}</h2>
          <p style={s.stopLocation}>{activeStop.location}</p>
          <span style={{ ...s.currTag, display: 'inline-block', marginBottom: 20 }}>{activeStop.curriculumLink}</span>

          <div style={s.factCard}>
            <span style={{ fontSize: 32 }}>📖</span>
            <p style={s.factText}>{activeStop.fact}</p>
          </div>

          <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={() => setScreen('stop-quiz')}>
            {t('adventure_quiz_button', lang)}
          </button>
          <p style={s.hintText}>Answer correctly to earn +{activeStop.stars} Stars ⭐</p>
        </div>
      )}

      {/* ── Stop quiz ── */}
      {screen === 'stop-quiz' && activeStop && (
        <div>
          <h3 style={s.quizStopName}>{activeStop.name}</h3>
          <p style={s.quizQ}>{activeStop.quiz.question}</p>

          <div style={s.optionList}>
            {activeStop.quiz.options.map((opt, i) => {
              const isSelected = quizSelected === i
              const isCorrect  = i === activeStop.quiz.correctIndex
              let bg = '#fff'
              if (quizResult && isSelected && isCorrect)  bg = 'var(--mint)'
              if (quizResult && isSelected && !isCorrect) bg = 'var(--coral)'
              if (quizResult && !isSelected && isCorrect) bg = 'var(--mint)'

              return (
                <button
                  key={i}
                  style={{ ...s.optionBtn, background: bg, border: isSelected && !quizResult ? '2px solid var(--plum)' : '2px solid transparent' }}
                  onClick={() => handleQuizAnswer(i)}
                  disabled={quizResult !== null}
                >
                  <span style={s.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {quizResult === 'correct' && (
            <div style={s.correctFeedback}>
              <p style={s.correctMsg}>{t('adventure_quiz_correct', lang)}</p>
              <p style={s.progressNote}>{stopsCount} / 8 {t('adventure_stops', lang)}</p>
              {stopsCount >= 6 && <p style={{ color: 'var(--gold)', fontWeight: 700 }}>{t('adventure_quiz_reward', lang)}</p>}
              <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={handleQuizNext}>
                {t('adventure_quiz_next', lang)}
              </button>
            </div>
          )}

          {quizResult === 'wrong' && (
            <div style={s.wrongFeedback}>
              <p style={s.wrongMsg}>{t('adventure_quiz_wrong', lang)}</p>
              <button style={{ ...s.btn, background: 'var(--coral)' }} onClick={handleQuizNext}>
                {t('adventure_quiz_try_again', lang)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Reward ── */}
      {screen === 'reward' && (
        <div style={s.centred}>
          <h2 style={s.heading}>{t('adventure_reward_heading', lang)}</h2>
          <p style={s.sub}>{t('adventure_reward_sub', lang)}</p>

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

          {stopsCount < 8 && (
            <div style={{ ...s.mintBanner, marginTop: 20 }}>
              {t('adventure_keep_going', lang)}
              <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 12 }} onClick={() => { setScanError(null); setScreen('scanner') }}>
                {t('adventure_continue', lang)}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Completion ── */}
      {screen === 'completion' && (
        <div style={{ ...s.centred, background: 'linear-gradient(135deg, var(--gold) 0%, #FFD93D 100%)', borderRadius: 20, padding: 32 }}>
          <div style={{ fontSize: 64 }}>🏆</div>
          <h2 style={{ ...s.heading, color: 'var(--plum)' }}>{t('adventure_completion_heading', lang)}</h2>
          <p style={{ ...s.sub, color: 'var(--plum)' }}>
            {t('adventure_completion_sub', lang)}
          </p>
          <p style={{ ...s.progressNote, color: 'var(--plum)' }}>8 / 8 stops · 120 Stars earned · 🧭 Full Explorer badge</p>

          {progress?.discountCode && (
            <>
              <p style={{ ...s.sub, color: 'var(--plum)', marginTop: 20 }}>Your gift shop reward:</p>
              <div style={{ ...s.codeBox, borderColor: 'var(--plum)' }}>
                <p style={{ ...s.codeText, color: 'var(--plum)' }}>{progress.discountCode}</p>
              </div>
            </>
          )}

          <button style={{ ...s.btn, background: 'var(--plum)', marginTop: 24 }} onClick={() => setScreen('trail-list')}>
            {t('adventure_completion_back', lang)}
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
  trailCard: { background: '#fff', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)', marginBottom: 20 },
  trailHeader: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 },
  trailEmoji: { fontSize: 40 },
  trailName:  { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.2rem', color: 'var(--plum)', margin: 0 },
  trailVenue: { color: 'var(--text-mid)', fontSize: '0.85rem', margin: '4px 0 0' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip:  { background: 'rgba(61,26,94,0.08)', borderRadius: 20, padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text-mid)' },
  btn: { display: 'block', width: '100%', padding: '14px 24px', borderRadius: 40, border: 'none', color: '#fff', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  progressNote: { textAlign: 'center', color: 'var(--violet)', fontWeight: 600, margin: '12px 0' },
  stopList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  stopRow:  { display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 14, padding: 14, boxShadow: 'var(--shadow-small)' },
  stopCircle: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 },
  stopInfo: { flex: 1 },
  stopName: { fontWeight: 700, color: 'var(--text-dark)', margin: 0, fontSize: '0.95rem' },
  stopLocation: { color: 'var(--text-mid)', fontSize: '0.8rem', margin: '2px 0 4px' },
  currTag: { background: 'rgba(78,205,196,0.15)', color: 'var(--mint)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 },
  starChip: { fontWeight: 700, color: 'var(--gold)', fontSize: '0.9rem', flexShrink: 0 },
  centred: { textAlign: 'center' },
  viewfinder: { width: 300, height: 300, borderRadius: 20, border: '3px solid var(--mint)', margin: '24px auto', animation: 'pulseRings 1.5s ease-out infinite', overflow: 'hidden' },
  errorBanner: { background: 'rgba(255,107,107,0.12)', border: '1px solid var(--coral)', borderRadius: 12, padding: 16, color: 'var(--coral)', marginTop: 16, position: 'relative' },
  dismissBtn: { position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--coral)', fontSize: '1rem' },
  stopBadge: { display: 'inline-block', background: 'var(--plum)', color: '#fff', borderRadius: 20, padding: '4px 16px', fontSize: '0.85rem', fontWeight: 700, marginBottom: 10 },
  factCard: { background: '#fff', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)', border: '2px solid var(--gold)', marginBottom: 24, textAlign: 'left' },
  factText: { fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-dark)', margin: '12px 0 0' },
  hintText: { textAlign: 'center', color: 'var(--text-mid)', fontSize: '0.85rem', marginTop: 10 },
  quizStopName: { fontFamily: "'Baloo 2', sans-serif", color: 'var(--plum)', marginBottom: 8 },
  quizQ: { fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 20, lineHeight: 1.5 },
  optionList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  optionBtn:  { width: '100%', padding: '14px 18px', borderRadius: 14, cursor: 'pointer', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 600, fontSize: '0.95rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s ease' },
  optionLetter: { width: 28, height: 28, borderRadius: '50%', background: 'rgba(61,26,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 },
  correctFeedback: { textAlign: 'center', marginTop: 8 },
  wrongFeedback:   { textAlign: 'center', marginTop: 8 },
  correctMsg: { color: 'var(--mint)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 },
  wrongMsg:   { color: 'var(--coral)', fontWeight: 600, marginBottom: 12 },
  codeBox:  { background: '#fff', border: '2px solid var(--gold)', borderRadius: 16, padding: '20px 24px', margin: '16px auto', maxWidth: 300 },
  codeText: { fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 700, color: 'var(--plum)', letterSpacing: 2, margin: 0 },
  mintBanner: { background: 'rgba(78,205,196,0.12)', border: '1px solid var(--mint)', borderRadius: 14, padding: 16, color: 'var(--text-dark)' },
}
