import { useState, useEffect } from 'react'
import { LOCAL_FACTS, CATEGORY_EMOJI } from '../data/localFactsData'
import { findLocalFacts, filterByCategory, sortByDistance } from '../utils/localFacts'
import { launchConfetti } from '../utils/confetti'
import {
  getMyAreaCoords, setMyAreaCoords,
  getMyAreaEnabled, setMyAreaEnabled,
  getMyAreaFacts, setMyAreaFacts,
  getMyAreaCompleted, markFactComplete,
  getMyAreaTodayIndex,
  clearMyArea,
  addStars, earnBadge,
  getLegendScore, recordLegendAnswer,
} from '../utils/storage'
import { t } from '../utils/i18n'

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/

function validatePostcodeFormat(raw) {
  return UK_POSTCODE_REGEX.test(raw.replace(/\s/g, '').toUpperCase())
}

export default function MyAreaPanel({ onStarsChange, onBadgesChange, lang = 'en' }) {
  const [screen, setScreen]                 = useState('entry')
  const [postcode, setPostcode]             = useState('')
  const [postcodeError, setPostcodeError]   = useState(null)
  const [coords, setCoords]                 = useState(null)
  const [facts, setFacts]                   = useState([])
  const [radiusLabel, setRadiusLabel]       = useState('')
  const [completed, setCompleted]           = useState([])
  const [todayIndex, setTodayIndex]         = useState(0)
  const [category, setCategory]             = useState('All')
  const [activeFact, setActiveFact]         = useState(null)
  const [quizSelected, setQuizSelected]     = useState(null)
  const [quizResult, setQuizResult]         = useState(null)
  const [discoveredCount, setDiscoveredCount] = useState(0)
  const [showLegendOverlay, setShowLegendOverlay] = useState(false)
  const [basePaid, setBasePaid]                   = useState(false)
  const [legendScore, setLegendScore]             = useState(() => getLegendScore())

  useEffect(() => {
    if (!getMyAreaEnabled()) return
    const storedCoords    = getMyAreaCoords()
    const storedFacts     = getMyAreaFacts()
    const storedCompleted = getMyAreaCompleted()
    const idx             = getMyAreaTodayIndex()

    if (!storedCoords || !storedFacts.length) return

    const { radiusLabel: labelFn } = findLocalFacts(LOCAL_FACTS, storedCoords.lat, storedCoords.lng)
    setCoords(storedCoords)
    setFacts(storedFacts)
    setCompleted(storedCompleted)
    setTodayIndex(idx)
    setRadiusLabel(labelFn(storedCoords.areaName))
    setScreen('feed')
  }, [])

  function animateDiscovery(total) {
    let count = 0
    setDiscoveredCount(0)
    const interval = setInterval(() => {
      count += 1
      setDiscoveredCount(count)
      if (count >= total) {
        clearInterval(interval)
        launchConfetti()
        setTimeout(() => setScreen('feed'), 1500)
      }
    }, 180)
  }

  async function handlePostcodeSubmit(e) {
    e.preventDefault()
    setPostcodeError(null)

    if (!validatePostcodeFormat(postcode)) {
      setPostcodeError(t('myarea_postcode_error', lang))
      return
    }

    setDiscoveredCount(0)
    setScreen('loading')

    try {
      const res  = await fetch('/api/postcode', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ postcode: postcode.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPostcodeError(data.error || t('myarea_postcode_error', lang))
        setScreen('entry')
        return
      }
      const { lat, lng, areaName } = data
      const { facts: found, radiusLabel: labelFn } = findLocalFacts(LOCAL_FACTS, lat, lng)
      const sorted     = sortByDistance(found)
      const coordsData = { lat, lng, areaName, setupDate: new Date().toDateString() }

      setMyAreaCoords(coordsData)
      setMyAreaEnabled(true)
      setMyAreaFacts(sorted)

      setCoords(coordsData)
      setFacts(sorted)
      setRadiusLabel(labelFn(areaName))
      setCompleted(getMyAreaCompleted())
      setTodayIndex(0)
      setPostcode('') // discard postcode from state — never persisted
      animateDiscovery(sorted.length)
    } catch {
      setPostcodeError(t('myarea_postcode_api_error', lang))
      setScreen('entry')
    }
  }

  function handleSkip() {
    const coordsData    = { lat: 52.3555, lng: -1.1743, areaName: 'UK Discoveries', setupDate: new Date().toDateString() }
    const nationalFacts = LOCAL_FACTS.filter((f) => f.isNational)
    const fallback      = nationalFacts.length > 0 ? nationalFacts : LOCAL_FACTS

    setMyAreaCoords(coordsData)
    setMyAreaEnabled(true)
    setMyAreaFacts(fallback)

    setCoords(coordsData)
    setFacts(fallback)
    setMyAreaEnabled(true)
    setCompleted(getMyAreaCompleted())
    setTodayIndex(0)
    setDiscoveredCount(0)
    setScreen('loading')
    animateDiscovery(fallback.length)
  }

  function handleChangeArea() {
    const confirmed = window.confirm(
      t('myarea_change_confirm', lang)
    )
    if (!confirmed) return
    clearMyArea()
    setPostcode('')
    setPostcodeError(null)
    setFacts([])
    setCoords(null)
    setCompleted([])
    setTodayIndex(0)
    setCategory('All')
    setActiveFact(null)
    setScreen('entry')
  }

  function handleFactOpen(fact, realIndex) {
    if (realIndex > todayIndex) return
    const alreadyDone = completed.includes(fact.id)
    if (!alreadyDone) {
      // Base stars awarded on card open, before quiz (SRS v3.0)
      addStars(fact.starsReward)
      onStarsChange()
    }
    setActiveFact(fact)
    setQuizSelected(null)
    setQuizResult(null)
    setShowLegendOverlay(false)
    setBasePaid(false)  // reset: no quiz attempt submitted yet this session
    setScreen('fact')
  }

  function handleQuizAnswer(selectedIndex) {
    if (quizResult !== null) return
    setQuizSelected(selectedIndex)
    const correct     = selectedIndex === activeFact.correctAnswer
    const alreadyDone = completed.includes(activeFact.id)

    if (!alreadyDone) {
      if (!basePaid) {
        // First quiz attempt this session — record legend score
        recordLegendAnswer(correct)
        setLegendScore(getLegendScore())
        setBasePaid(true)
      }
      // Note: base stars already awarded when card was opened

      if (correct) {
        if (activeFact.bonusStars) {
          addStars(activeFact.bonusStars)
          onStarsChange()
        }
        markFactComplete(activeFact.id)
        const newCompleted = getMyAreaCompleted()
        setCompleted(newCompleted)
        if (newCompleted.length >= facts.length) {
          const gained = earnBadge('local_legend')
          if (gained) { onBadgesChange(); launchConfetti(); setShowLegendOverlay(true) }
        }
      } else if (basePaid) {
        // Retry wrong — mark card complete (SRS v3.0)
        markFactComplete(activeFact.id)
        const newCompleted = getMyAreaCompleted()
        setCompleted(newCompleted)
        if (newCompleted.length >= facts.length) {
          const gained = earnBadge('local_legend')
          if (gained) { onBadgesChange(); launchConfetti(); setShowLegendOverlay(true) }
        }
      }
    }

    setQuizResult(correct ? 'correct' : 'wrong')
  }

  function getLegendTier(correct, answered) {
    if (answered === 0) return null
    const pct = (correct / answered) * 100
    if (pct === 100)  return 'Perfect Local Legend'
    if (pct >= 75)    return 'Neighbourhood Scholar'
    if (pct >= 50)    return 'Local Learner'
    return 'Curious Explorer'
  }

  const availableCategories = ['All', ...new Set(facts.map((f) => f.category))]
  const filteredFacts        = filterByCategory(facts, category)
  const allDone              = facts.length > 0 && completed.length >= facts.length
  const msUntilMidnight      = new Date().setHours(24, 0, 0, 0) - Date.now()
  const hoursUntilMidnight   = Math.ceil(msUntilMidnight / 3600000)

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="panel-enter" style={s.panel}>

      {/* ── Entry screen ── */}
      {screen === 'entry' && (
        <div>
          <h2 style={s.heading}>{t('myarea_heading', lang)}</h2>
          <p style={s.sub}>{t('myarea_sub', lang)}</p>

          <div style={s.entryCard}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 52 }}>🗺️</span>
              <h3 style={s.entryTitle}>{t('myarea_entry_title', lang)}</h3>
              <p style={s.entryDesc}>{t('myarea_entry_desc', lang)}</p>
            </div>

            <p style={{ ...s.privacyNote, marginTop: 0, marginBottom: 16 }}>
              {t('myarea_privacy_note', lang)}
            </p>

            <form onSubmit={handlePostcodeSubmit}>
              <label style={s.label} htmlFor="postcode-input">{t('myarea_postcode_label', lang)}</label>
              <input
                id="postcode-input"
                type="text"
                value={postcode}
                onChange={(e) => { setPostcode(e.target.value.toUpperCase()); setPostcodeError(null) }}
                placeholder={t('myarea_postcode_placeholder', lang)}
                style={{
                  ...s.input,
                  borderColor: postcodeError ? 'var(--coral)' : 'rgba(61,26,94,0.2)',
                }}
                maxLength={8}
                autoComplete="postal-code"
              />
              {postcodeError && <p style={s.fieldError}>{postcodeError}</p>}
              <button type="submit" style={{ ...s.btn, background: 'var(--plum)' }}>
                {t('myarea_postcode_submit', lang)}
              </button>
            </form>

            <button style={s.skipBtn} onClick={handleSkip}>{t('myarea_skip', lang)}</button>
          </div>
        </div>
      )}

      {/* ── Loading / discovery animation screen ── */}
      {screen === 'loading' && (
        <div style={s.centred}>
          <div style={{ fontSize: 64, animation: 'mapPulse 1.2s ease-in-out infinite', display: 'inline-block', marginBottom: 20 }}>
            📍
          </div>
          {discoveredCount === 0 ? (
            <>
              <h2 style={s.heading}>{t('myarea_loading_heading', lang)}</h2>
              <p style={s.sub}>{t('myarea_loading_sub', lang)}</p>
            </>
          ) : (
            <h2 style={{ ...s.heading, animation: 'countUp 0.3s ease' }}>
              🌟 {discoveredCount} amazing {discoveredCount === 1 ? 'fact' : 'facts'} found near your home!
            </h2>
          )}
        </div>
      )}

      {/* ── Feed screen ── */}
      {screen === 'feed' && (
        <div>
          {/* Location header card */}
          {coords && (
            <div style={s.locationCard}>
              <h2 style={s.locationName}>{coords.areaName}</h2>
              <p style={s.locationSub}>{radiusLabel}</p>
            </div>
          )}

          {/* Local Legend Score (v3.0) */}
          {legendScore.answered > 0 && (
            <div style={s.legendScoreCard}>
              <span style={s.legendScoreIcon}>🏆</span>
              <div style={s.legendScoreBody}>
                <p style={s.legendScoreLabel}>{getLegendTier(legendScore.correct, legendScore.answered)}</p>
                <p style={s.legendScoreNum}>{legendScore.correct}/{legendScore.answered} correct</p>
              </div>
              <span style={s.legendScorePct}>
                {Math.round((legendScore.correct / legendScore.answered) * 100)}%
              </span>
            </div>
          )}

          {/* Category filter chips */}
          <div style={s.catRow}>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  ...s.catChip,
                  background: category === cat ? 'var(--plum)' : '#fff',
                  color:      category === cat ? '#fff' : 'var(--text-mid)',
                  fontWeight: category === cat ? 700 : 600,
                }}
              >
                {cat !== 'All' && CATEGORY_EMOJI[cat] ? `${CATEGORY_EMOJI[cat]} ` : ''}
                {cat === 'All' ? t('quiz_subject_all', lang) : t(`myarea_cat_${cat.toLowerCase()}`, lang)}
              </button>
            ))}
          </div>

          {/* All caught up state */}
          {allDone && todayIndex >= facts.length - 1 && (
            <div style={s.caughtUpBanner}>
              {t('myarea_caught_up', lang)}
            </div>
          )}

          {/* Fact cards */}
          <div style={s.factList}>
            {filteredFacts.map((fact) => {
              const realIndex  = facts.findIndex((f) => f.id === fact.id)
              const isUnlocked = realIndex <= todayIndex
              const isDone     = completed.includes(fact.id)
              const isToday    = realIndex === todayIndex && !isDone
              const daysAway   = realIndex - todayIndex

              return (
                <button
                  key={fact.id}
                  style={{
                    ...s.factCard,
                    opacity:    isUnlocked ? 1 : 0.5,
                    cursor:     isUnlocked ? 'pointer' : 'not-allowed',
                    background: isDone && !isToday ? 'rgba(78,205,196,0.06)' : '#fff',
                    border:     isToday ? '2px solid var(--gold)' : isDone ? '2px solid var(--mint)' : '2px solid transparent',
                  }}
                  onClick={() => handleFactOpen(fact, realIndex)}
                  disabled={!isUnlocked}
                  aria-disabled={!isUnlocked}
                >
                  <div style={s.factCardRow}>
                    <div style={s.factCardIcon}>
                      {isDone ? '✅' : isToday ? '⭐' : isUnlocked ? (CATEGORY_EMOJI[fact.category] || '📖') : '🔒'}
                    </div>
                    <div style={s.factCardBody}>
                      <p style={{ ...s.factCardTitle, color: isDone ? 'var(--text-mid)' : 'var(--text-dark)' }}>
                        {fact.title}
                      </p>
                      <p style={s.factCardLocation}>{fact.locationName}</p>
                      <div style={s.factCardMeta}>
                        <span style={s.currTag}>{t(`myarea_cat_${fact.category.toLowerCase()}`, lang)}</span>
                        {isUnlocked && !isDone && <span style={s.starsChip}>+{fact.starsReward + (fact.bonusStars || 0)}⭐</span>}
                        {isDone && <span style={s.doneLabel}>{t('myarea_fact_completed', lang)}</span>}
                        {isToday && <span style={s.todayBadge}>{t('myarea_fact_today', lang)}</span>}
                        {!isUnlocked && (
                          <span style={s.lockNote}>
                            {daysAway === 1 ? t('myarea_unlock_tomorrow', lang) : t('myarea_unlock_days', lang).replace('{n}', daysAway)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredFacts.length === 0 && !allDone && (
            <div style={s.emptyState}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <p style={{ color: 'var(--text-mid)', marginBottom: 12 }}>
                {t('myarea_empty_category', lang)}
              </p>
              <button
                style={{ ...s.catChip, background: 'var(--plum)', color: '#fff' }}
                onClick={() => setCategory('All')}
              >
                {t('myarea_show_all', lang)}
              </button>
            </div>
          )}

          <div style={s.changeAreaRow}>
            <button style={s.changeAreaBtn} onClick={handleChangeArea}>{t('myarea_change_location', lang)}</button>
            <p style={s.privacyNote}>{t('myarea_privacy_footer', lang)}</p>
          </div>
        </div>
      )}

      {/* ── Full fact view ── */}
      {screen === 'fact' && activeFact && (() => {
        const alreadyDone = completed.includes(activeFact.id)
        const options     = [activeFact.optionA, activeFact.optionB, activeFact.optionC, activeFact.optionD]

        return (
          <div>
            {/* Local Legend overlay */}
            {showLegendOverlay && (
              <div style={s.legendOverlay}>
                <span style={{ fontSize: 64 }}>📍</span>
                <h2 style={{ ...s.heading, color: '#fff', marginTop: 12 }}>🌟 Local Legend!</h2>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: 1.6, margin: '12px 0 24px' }}>
                  You&apos;ve discovered everything about {coords?.areaName || 'your area'}! You&apos;re now a {coords?.areaName || 'Local'} Explorer! 🏆
                </p>
                <button
                  style={{ ...s.btn, background: '#fff', color: 'var(--plum)', width: 'auto', padding: '14px 32px' }}
                  onClick={() => { setShowLegendOverlay(false); setScreen('feed') }}
                >
                  {t('myarea_legend_button', lang)}
                </button>
              </div>
            )}

            <button style={s.back} onClick={() => { setScreen('feed'); setActiveFact(null) }}>{t('adventure_back', lang)}</button>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <div style={s.factBadge}>
                {CATEGORY_EMOJI[activeFact.category]} {t(`myarea_cat_${activeFact.category.toLowerCase()}`, lang)}
              </div>
              {activeFact.distanceMiles != null && (
                <div style={s.distanceBadge}>
                  📍 {activeFact.distanceMiles.toFixed(1)} {t('myarea_distance', lang)}
                </div>
              )}
            </div>

            <h2 style={s.heading}>{activeFact.title}</h2>

            <div style={s.locationBarCard}>
              <span>📍</span>
              <span style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>{activeFact.locationName}</span>
            </div>

            <span style={{ ...s.currTag, display: 'inline-block', marginBottom: 20 }}>{activeFact.curriculumLink}</span>

            <div style={s.fullFactCard}>
              <span style={{ fontSize: 32 }}>📖</span>
              <p style={s.fullFactText}>{activeFact.factText}</p>
            </div>

            {/* Quiz section */}
            <h3 style={{ fontFamily: "'Baloo 2', sans-serif", color: 'var(--plum)', marginBottom: 4 }}>{t('myarea_quiz_heading', lang)}</h3>

            {alreadyDone && quizResult === null && (
              <div style={s.alreadyDoneBanner}>
                {t('myarea_already_done', lang)}
              </div>
            )}

            <p style={s.quizQ}>{activeFact.quizQuestion}</p>
            <div style={s.optionList}>
              {options.map((opt, i) => {
                const isSelected = quizSelected === i
                const isCorrect  = i === activeFact.correctAnswer
                let bg = '#fff'
                if (alreadyDone && quizResult === null && isCorrect) bg = 'var(--mint)'
                if (quizResult && isSelected && isCorrect)           bg = 'var(--mint)'
                if (quizResult && isSelected && !isCorrect)          bg = 'var(--coral)'
                if (quizResult && !isSelected && isCorrect)          bg = 'var(--mint)'

                return (
                  <button
                    key={i}
                    style={{
                      ...s.optionBtn,
                      background: bg,
                      border: isSelected && !quizResult ? '2px solid var(--plum)' : '2px solid transparent',
                    }}
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
                {!alreadyDone && activeFact.bonusStars > 0 && (
                  <p style={s.correctMsg}>+{activeFact.bonusStars} Bonus Stars! ⭐</p>
                )}
                <button style={{ ...s.btn, background: 'var(--plum)' }} onClick={() => { setScreen('feed'); setActiveFact(null) }}>
                  {t('myarea_back', lang)}
                </button>
              </div>
            )}

            {quizResult === 'wrong' && (
              <div style={s.wrongFeedback}>
                <p style={s.wrongMsg}>{t('myarea_quiz_wrong', lang)}</p>
                {activeFact.sparky_explanation && (
                  <div style={s.sparkyExplanation}>
                    <span style={s.sparkyAvatar}>🦊</span>
                    <p style={s.sparkyText}>{activeFact.sparky_explanation}</p>
                  </div>
                )}
                <button
                  style={{ ...s.btn, background: 'var(--coral)' }}
                  onClick={() => { setQuizSelected(null); setQuizResult(null) }}
                >
                  {t('myarea_quiz_try_again', lang)}
                </button>
              </div>
            )}

            {!quizResult && !alreadyDone && (
              <p style={s.hintText}>{t('myarea_quiz_hint', lang)}</p>
            )}

            <p style={{ ...s.hintText, marginTop: 8 }}>{t('myarea_fact_source', lang)} {activeFact.sourceReference}</p>
          </div>
        )
      })()}
    </div>
  )
}

const s = {
  panel:           { animation: 'fadeUp 0.35s ease', padding: '0 0 40px' },
  heading:         { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.6rem', color: 'var(--plum)', margin: '0 0 6px' },
  sub:             { color: 'var(--text-mid)', marginBottom: 24 },
  back:            { background: 'none', border: 'none', color: 'var(--plum)', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', padding: '0 0 16px', fontFamily: "'Nunito', 'Noto Sans', sans-serif" },
  entryCard:       { background: '#fff', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow-card)' },
  entryTitle:      { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.2rem', color: 'var(--plum)', margin: '12px 0 8px' },
  entryDesc:       { color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 },
  label:           { display: 'block', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8, fontSize: '0.95rem' },
  input:           { width: '100%', padding: '12px 16px', borderRadius: 40, border: '2px solid rgba(61,26,94,0.2)', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontSize: '1rem', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box', marginBottom: 12, background: 'var(--cream)', letterSpacing: 1 },
  fieldError:      { color: 'var(--coral)', fontSize: '0.875rem', fontWeight: 600, margin: '-4px 0 12px', paddingLeft: 4 },
  btn:             { display: 'block', width: '100%', padding: '14px 24px', borderRadius: 40, border: 'none', color: '#fff', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  skipBtn:         { display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--text-mid)', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline', marginTop: 12, padding: '8px 0' },
  privacyNote:     { fontSize: '0.8rem', color: 'var(--text-mid)', textAlign: 'center', marginTop: 16, lineHeight: 1.5 },
  centred:         { textAlign: 'center', paddingTop: 40 },
  locationCard:    { background: 'var(--plum)', borderRadius: 20, padding: '20px 24px', marginBottom: 20, boxShadow: 'var(--shadow-card)' },
  locationName:    { fontFamily: "'Baloo 2', sans-serif", fontSize: '1.5rem', color: '#fff', margin: '0 0 4px' },
  locationSub:     { color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', margin: 0 },
  catRow:          { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  catChip:         { padding: '8px 16px', borderRadius: 40, border: 'none', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s ease, color 0.2s ease', whiteSpace: 'nowrap', minHeight: 44 },
  caughtUpBanner:  { background: 'linear-gradient(135deg, var(--gold) 0%, #FFD93D 100%)', borderRadius: 14, padding: '16px 20px', marginBottom: 20, color: 'var(--plum)', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.5 },
  factList:        { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  factCard:        { background: '#fff', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-small)', textAlign: 'left', width: '100%', fontFamily: "'Nunito', 'Noto Sans', sans-serif", cursor: 'pointer', transition: 'transform 0.2s ease' },
  factCardRow:     { display: 'flex', gap: 14, alignItems: 'center' },
  factCardIcon:    { fontSize: 28, flexShrink: 0, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  factCardBody:    { flex: 1 },
  factCardTitle:   { fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 2px', fontSize: '0.95rem' },
  factCardLocation:{ color: 'var(--text-mid)', fontSize: '0.8rem', margin: '0 0 6px' },
  factCardMeta:    { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  currTag:         { background: 'rgba(78,205,196,0.15)', color: 'var(--mint)', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 600 },
  starsChip:       { fontWeight: 700, color: 'var(--gold)', fontSize: '0.85rem' },
  todayBadge:      { background: 'var(--gold)', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 },
  doneLabel:       { color: 'var(--mint)', fontSize: '0.75rem', fontWeight: 600 },
  lockNote:        { color: 'var(--text-mid)', fontSize: '0.75rem', fontStyle: 'italic' },
  emptyState:      { textAlign: 'center', padding: '40px 20px', color: 'var(--text-mid)' },
  changeAreaRow:   { textAlign: 'center', paddingTop: 8 },
  changeAreaBtn:   { background: 'none', border: '1px solid rgba(61,26,94,0.2)', borderRadius: 40, padding: '10px 20px', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontSize: '0.875rem', color: 'var(--text-mid)', cursor: 'pointer' },
  legendOverlay:   { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 },
  factBadge:       { display: 'inline-block', background: 'rgba(61,26,94,0.08)', color: 'var(--plum)', borderRadius: 20, padding: '4px 16px', fontSize: '0.85rem', fontWeight: 700 },
  distanceBadge:   { display: 'inline-block', background: 'rgba(61,26,94,0.06)', color: 'var(--text-mid)', borderRadius: 20, padding: '4px 16px', fontSize: '0.8rem' },
  locationBarCard: { display: 'flex', gap: 8, alignItems: 'center', background: '#fff', borderRadius: 12, padding: '10px 16px', marginBottom: 12, borderLeft: '4px solid var(--mint)', boxShadow: 'var(--shadow-small)' },
  fullFactCard:    { background: '#fff', borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-card)', border: '2px solid var(--gold)', marginBottom: 24, textAlign: 'left' },
  fullFactText:    { fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-dark)', margin: '12px 0 0' },
  alreadyDoneBanner: { background: 'rgba(78,205,196,0.12)', border: '1px solid var(--mint)', borderRadius: 12, padding: '12px 16px', color: 'var(--text-dark)', marginBottom: 16, fontWeight: 600, textAlign: 'center', fontSize: '0.9rem' },
  quizQ:           { fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 20, lineHeight: 1.5 },
  optionList:      { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  optionBtn:       { width: '100%', padding: '14px 18px', borderRadius: 14, cursor: 'pointer', fontFamily: "'Nunito', 'Noto Sans', sans-serif", fontWeight: 600, fontSize: '0.95rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, transition: 'background 0.2s ease' },
  optionLetter:    { width: 28, height: 28, borderRadius: '50%', background: 'rgba(61,26,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 },
  correctFeedback: { textAlign: 'center', marginTop: 8 },
  wrongFeedback:   { textAlign: 'center', marginTop: 8 },
  correctMsg:      { color: 'var(--mint)', fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 },
  wrongMsg:        { color: 'var(--coral)', fontWeight: 600, marginBottom: 12 },
  hintText:        { textAlign: 'center', color: 'var(--text-mid)', fontSize: '0.85rem', marginTop: 10 },

  // Local Legend Score card (v3.0)
  legendScoreCard:  { display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, boxShadow: 'var(--shadow-small)' },
  legendScoreIcon:  { fontSize: 28, flexShrink: 0 },
  legendScoreBody:  { flex: 1 },
  legendScoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' },
  legendScoreNum:   { color: '#fff', fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.2rem', margin: '2px 0 0' },
  legendScorePct:   { color: 'rgba(255,255,255,0.9)', fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 },

  // Sparky wrong-answer explanation (v3.0)
  sparkyExplanation: { display: 'flex', gap: 12, alignItems: 'flex-start', background: 'rgba(61,26,94,0.06)', border: '1px solid rgba(61,26,94,0.15)', borderRadius: 14, padding: '14px 16px', margin: '0 0 16px', textAlign: 'left' },
  sparkyAvatar:      { fontSize: 28, flexShrink: 0, lineHeight: 1 },
  sparkyText:        { fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-dark)', margin: 0, fontStyle: 'italic' },
}
