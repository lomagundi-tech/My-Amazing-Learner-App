const KEYS = {
  stars:               'mal_stars',
  badges:              'mal_badges',
  progress:            'mal_progress',
  quizHistory:         'mal_quiz_history',
  mode:                'mal_mode',
  lastVisit:           'mal_last_visit',
  childName:           'mal_child_name',
  streak:              'mal_streak',
  streakDate:          'mal_streak_date',
  moodHistory:         'mal_mood_history',
  craftsCompleted:     'mal_crafts_completed',
  dailyChallenged:     'mal_daily_challenge',
  levelsCompleted:     'mal_levels_completed',
  senActive:           'mal_sen_active',
  senTooltipShown:     'mal_sen_tooltip_shown',
  // Parent portal — keys match future DB table names for clean Phase 2 migration
  parentCompletions:   'mal_activity_completions',
  parentVouchers:      'mal_vouchers',
  parentJointSessions: 'mal_joint_sessions',
  parentFlashcards:    'mal_parent_flashcards',
  monthlyCap:          'mal_monthly_cap',
  gamification:        'mal_gamification',
  lifeSkillsLog:       'mal_life_skills_log',
  // Phase 4 — Adventure Mode
  deviceId:            'mal_device_id',
  trailProgress:       'mal_trail_progress',
  trailSyncedData:     'mal_trail_synced_data',
  // Language preference
  language:            'mal_language',
  // Phase 4 — My Area
  myAreaCoords:        'mal_myarea_coords',
  myAreaEnabled:       'mal_myarea_enabled',
  myAreaFacts:         'mal_myarea_facts',
  myAreaCompleted:     'mal_myarea_completed',
  myAreaUnlock:        'mal_myarea_unlock',
}

function get(key, fallback = null) {
  try {
    const val = localStorage.getItem(key)
    if (val === null) return fallback
    return JSON.parse(val)
  } catch {
    return fallback
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function clearAll() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  } catch {}
}

// ── Specific helpers ──────────────────────────────────────────

export function getStars()           { return get(KEYS.stars, 0) }
export function setStars(n)          { set(KEYS.stars, n) }
export function addStars(n)          { set(KEYS.stars, getStars() + n) }
export function addStar()            { set(KEYS.stars, getStars() + 1) }

export function getBadges()          { return get(KEYS.badges, ['first_star', 'book_worm', 'number_ninja']) }
export function setBadges(arr)       { set(KEYS.badges, arr) }
export function earnBadge(id) {
  const current = getBadges()
  if (!current.includes(id)) {
    set(KEYS.badges, [...current, id])
    return true
  }
  return false
}

export function getChildName()       { return get(KEYS.childName, '') }
export function setChildName(name)   { set(KEYS.childName, name) }

export function getMode()            { return get(KEYS.mode, 'parent') }
export function setMode(mode)        { set(KEYS.mode, mode) }

export function getLanguage()        { return get(KEYS.language, 'en') }
export function setLanguage(code)    { set(KEYS.language, code) }

export function getStreak()          { return get(KEYS.streak, 0) }
export function getStreakDate()      { return get(KEYS.streakDate, null) }
export function updateStreak() {
  const today = new Date().toDateString()
  const lastDate = getStreakDate()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (lastDate === today) return get(KEYS.streak, 1)
  const newStreak = lastDate === yesterday ? getStreak() + 1 : 1
  set(KEYS.streak, newStreak)
  set(KEYS.streakDate, today)
  return newStreak
}

export function getLastVisit()       { return get(KEYS.lastVisit, null) }
export function setLastVisit()       { set(KEYS.lastVisit, new Date().toISOString()) }

export function getMoodHistory()     { return get(KEYS.moodHistory, []) }
export function addMood(mood) {
  const history = getMoodHistory()
  const today = new Date().toDateString()
  const filtered = history.filter((m) => m.date !== today)
  set(KEYS.moodHistory, [...filtered, { date: today, mood }])
}
export function getTodaysMood() {
  const today = new Date().toDateString()
  return getMoodHistory().find((m) => m.date === today)?.mood ?? null
}

export function getCraftsCompleted() { return get(KEYS.craftsCompleted, []) }
export function toggleCraft(id) {
  const current = getCraftsCompleted()
  const updated = current.includes(id)
    ? current.filter((c) => c !== id)
    : [...current, id]
  set(KEYS.craftsCompleted, updated)
  return updated
}

export function getDailyChallengedDate() { return get(KEYS.dailyChallenged, null) }
export function setDailyChallengedDate() { set(KEYS.dailyChallenged, new Date().toDateString()) }
export function hasAnsweredTodaysChallenge() {
  return getDailyChallengedDate() === new Date().toDateString()
}

export function getLevelsCompleted() { return get(KEYS.levelsCompleted, []) }
export function markLevelComplete(level) {
  const current = getLevelsCompleted()
  if (!current.includes(level)) {
    set(KEYS.levelsCompleted, [...current, level])
  }
}

export function getCorrectCount()    { return get(KEYS.quizHistory, { total: 0 }).total ?? 0 }
export function incrementCorrect() {
  const current = get(KEYS.quizHistory, { total: 0 })
  set(KEYS.quizHistory, { ...current, total: (current.total ?? 0) + 1 })
}

export function getSubjectProgress()  { return get(KEYS.progress, {}) }
export function recordQuizAnswer(subject, correct) {
  if (!correct || !subject) return
  const current = getSubjectProgress()
  set(KEYS.progress, { ...current, [subject]: (current[subject] ?? 0) + 1 })
}

export function getSenActive()        { return get(KEYS.senActive, []) }
export function setSenActive(arr)     { set(KEYS.senActive, arr) }
export function toggleSenTool(id) {
  const current = getSenActive()
  const updated = current.includes(id) ? current.filter((t) => t !== id) : [...current, id]
  set(KEYS.senActive, updated)
  return updated
}

export function getSenTooltipShown()  { return get(KEYS.senTooltipShown, false) }
export function setSenTooltipShown()  { set(KEYS.senTooltipShown, true) }

export { clearAll }

// ── Parent Portal ──────────────────────────────────────────────

export function getParentCompletions() { return get(KEYS.parentCompletions, []) }

export function addParentCompletion(activityId, module) {
  const current = getParentCompletions()
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  set(KEYS.parentCompletions, [
    ...current,
    { activity_id: activityId, module, completed_at: now.toISOString(), reward_granted: true, status: 'complete', month: monthKey },
  ])
}

export function getParentMonthlyStats() {
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const completions = getParentCompletions()
  const thisMonth = completions.filter((c) => c.month === monthKey)
  const jointCount = thisMonth.filter((c) => c.module === 'B').length
  return { total: thisMonth.length, jointCount, monthKey }
}

export function hasCompletedActivityToday(activityId) {
  const today = new Date().toDateString()
  return getParentCompletions().some(
    (c) => c.activity_id === activityId && new Date(c.completed_at).toDateString() === today
  )
}

export function getParentTier() {
  const { total, jointCount } = getParentMonthlyStats()
  if (total >= 20) return 4
  if (total >= 15) return 3
  if (total >= 10 && jointCount >= 2) return 2
  if (total >= 5) return 1
  return 0
}

// ── Monthly discount cap ───────────────────────────────────────
// Module A solo cap: 30% per month
// Combined Module A + B cap: 40% per month
// Modules C and D are not subject to the discount cap

export function getMonthlyCapState() {
  const now = new Date()
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const stored = get(KEYS.monthlyCap, { monthKey: '', soloTotal: 0, combinedTotal: 0, cap_limit: 40 })
  if (stored.monthKey !== monthKey) {
    const reset = { monthKey, soloTotal: 0, combinedTotal: 0, cap_limit: 40 }
    set(KEYS.monthlyCap, reset)
    return reset
  }
  return stored
}

// ── Vouchers ───────────────────────────────────────────────────
// Code format: MAL-[MODULE]-[4-CHAR-RANDOM]
// Module A → MAL-A-xxxx | Module B → MAL-JOIN-xxxx | Module C → MAL-C-xxxx | Module D → MAL-D-xxxx

export function getParentVouchers()  { return get(KEYS.parentVouchers, []) }

// Returns { granted: true, code } or { granted: false, reason: '...' }
export function addParentVoucher(activityId, pct, label, module) {
  if (pct <= 0) return { granted: false, reason: 'no-discount' }

  const cap = getMonthlyCapState()

  if (module === 'A') {
    if (cap.soloTotal + pct > 30) {
      return { granted: false, reason: `Solo activity discount cap reached (30% per month). Resets on the 1st.` }
    }
    if (cap.combinedTotal + pct > 40) {
      return { granted: false, reason: `Combined discount cap reached (40% per month). Resets on the 1st.` }
    }
  }
  if (module === 'B') {
    if (cap.combinedTotal + pct > 40) {
      return { granted: false, reason: `Combined discount cap reached (40% per month). Resets on the 1st.` }
    }
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString()
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  const prefix = module === 'B' ? 'JOIN' : (module || 'A')
  const code = `MAL-${prefix}-${suffix}`

  set(KEYS.parentVouchers, [
    ...getParentVouchers(),
    { id: `v_${Date.now()}`, code, pct, label, issued_at: now.toISOString(), expires_at: expiresAt, used: false, source: activityId, module },
  ])

  // Update cap tracking (only A and B modules count toward the cap)
  if (module === 'A' || module === 'B') {
    const updatedCap = getMonthlyCapState()
    if (module === 'A') updatedCap.soloTotal += pct
    updatedCap.combinedTotal += pct
    set(KEYS.monthlyCap, updatedCap)
  }

  return { granted: true, code }
}

export function markVoucherUsed(voucherId) {
  set(KEYS.parentVouchers, getParentVouchers().map((v) => (v.id === voucherId ? { ...v, used: true } : v)))
}

export function getActiveVouchers() {
  const now = new Date()
  return getParentVouchers().filter((v) => !v.used && new Date(v.expires_at || v.expiresAt) > now)
}

// ── Joint sessions ─────────────────────────────────────────────

export function getParentJointSessions() { return get(KEYS.parentJointSessions, []) }

export function initiateJointSession(activityId) {
  const current = getParentJointSessions()
  const existing = current.find((s) => s.activityId === activityId && s.status !== 'complete')
  if (existing) return existing
  const session = {
    id: `js_${Date.now()}`,
    activityId,
    initiatedAt: new Date().toISOString(),
    parentDone: false,
    childDone: false,
    status: 'pending',
    rewardGranted: false,
  }
  set(KEYS.parentJointSessions, [...current, session])
  return session
}

export function completeJointSide(activityId, side) {
  const current = getParentJointSessions()
  const updated = current.map((s) => {
    if (s.activityId !== activityId || s.status === 'complete') return s
    const next = { ...s, [`${side}Done`]: true }
    if (next.parentDone && next.childDone) next.status = 'complete'
    return next
  })
  set(KEYS.parentJointSessions, updated)
  return updated.find((s) => s.activityId === activityId)
}

export function getJointSession(activityId) {
  return getParentJointSessions().find((s) => s.activityId === activityId && s.status !== 'expired') ?? null
}

// ── Flashcards ─────────────────────────────────────────────────

export function getParentFlashcards() { return get(KEYS.parentFlashcards, []) }
export function saveParentFlashcard(topicId, front, back) {
  set(KEYS.parentFlashcards, [
    ...getParentFlashcards(),
    { id: `fc_${Date.now()}`, topicId, front, back, createdAt: new Date().toISOString() },
  ])
}
export function deleteParentFlashcard(id) {
  set(KEYS.parentFlashcards, getParentFlashcards().filter((f) => f.id !== id))
}

// ── Life Skills Log ────────────────────────────────────────────

export function getLifeSkillsLog() { return get(KEYS.lifeSkillsLog, []) }
export function addLifeSkillsEntry(challengeId, rewardGranted) {
  set(KEYS.lifeSkillsLog, [
    ...getLifeSkillsLog(),
    { challenge_id: challengeId, date: new Date().toISOString(), parent_confirmed: true, reward_granted: rewardGranted },
  ])
}

// ── Gamification snapshot ──────────────────────────────────────
// Kept in sync with live values — used for clean Phase 2 DB migration

export function saveGamificationSnapshot() {
  const streak = getStreak()
  const current = get(KEYS.gamification, { best_streak: 0 })
  set(KEYS.gamification, {
    current_tier: getParentTier(),
    activities_this_month: getParentMonthlyStats().total,
    streak_days: streak,
    best_streak: Math.max(streak, current.best_streak || 0),
  })
}

// ── Device Identity ────────────────────────────────────────────
// Generated once on first app load. Stable across refreshes. Never regenerated.

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function getDeviceId() {
  const existing = get(KEYS.deviceId, null)
  if (existing) return existing
  const newId = generateUUID()
  set(KEYS.deviceId, newId)
  return newId
}

// ── Trail Progress ─────────────────────────────────────────────

export function getTrailProgress()  { return get(KEYS.trailProgress, null) }
export function setTrailProgress(p) { set(KEYS.trailProgress, p) }

export function startTrail(trailId, allStopsData) {
  set(KEYS.trailProgress, {
    trailId,
    status: 'IN_PROGRESS',
    stopsCompleted: [],
    discountCode: null,
    discountCodeIssuedAt: null,
    discountCodeExpiresAt: null,
    startedAt: new Date().toISOString(),
    completedAt: null,
  })
  const existing = get(KEYS.trailSyncedData, {})
  set(KEYS.trailSyncedData, {
    ...existing,
    [trailId]: { syncedAt: new Date().toISOString(), stops: allStopsData },
  })
}

export function markTrailStopComplete(stopNumber) {
  const progress = getTrailProgress()
  if (!progress) return null
  if (progress.stopsCompleted.includes(stopNumber)) return { stopsCompleted: progress.stopsCompleted, status: progress.status }
  const stopsCompleted = [...progress.stopsCompleted, stopNumber]
  let status = progress.status
  if (stopsCompleted.length >= 6 && status === 'IN_PROGRESS') status = 'REWARD_UNLOCKED'
  if (stopsCompleted.length === 8) status = 'FULLY_COMPLETED'
  const updated = {
    ...progress,
    stopsCompleted,
    status,
    completedAt: stopsCompleted.length === 8 ? new Date().toISOString() : progress.completedAt,
  }
  set(KEYS.trailProgress, updated)
  return { stopsCompleted, status }
}

export function saveDiscountCode(code, issuedAt, expiresAt) {
  const progress = getTrailProgress()
  if (!progress) return
  set(KEYS.trailProgress, { ...progress, discountCode: code, discountCodeIssuedAt: issuedAt, discountCodeExpiresAt: expiresAt })
}

export function getTrailSyncedData(trailId) {
  const all = get(KEYS.trailSyncedData, {})
  return all[trailId] ?? null
}

// ── My Area ────────────────────────────────────────────────────

export function getMyAreaCoords()        { return get(KEYS.myAreaCoords, null) }
export function setMyAreaCoords(coords)  { set(KEYS.myAreaCoords, coords) }

export function getMyAreaEnabled()       { return get(KEYS.myAreaEnabled, false) }
export function setMyAreaEnabled(val)    { set(KEYS.myAreaEnabled, val) }

export function getMyAreaFacts()         { return get(KEYS.myAreaFacts, []) }
export function setMyAreaFacts(facts)    { set(KEYS.myAreaFacts, facts) }

export function getMyAreaCompleted()     { return get(KEYS.myAreaCompleted, []) }
export function markFactComplete(id) {
  const current = getMyAreaCompleted()
  if (!current.includes(id)) set(KEYS.myAreaCompleted, [...current, id])
}

export function getMyAreaTodayIndex() {
  const facts = getMyAreaFacts()
  if (!facts.length) return 0
  const coords = getMyAreaCoords()
  const setupDate = coords?.setupDate
  if (!setupDate) return 0
  const daysSinceSetup = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date(setupDate).setHours(0, 0, 0, 0)) / 86400000
  )
  return Math.min(daysSinceSetup, facts.length - 1)
}

export function clearMyArea() {
  set(KEYS.myAreaCoords,    null)
  set(KEYS.myAreaEnabled,   false)
  set(KEYS.myAreaFacts,     [])
  set(KEYS.myAreaCompleted, [])
  set(KEYS.myAreaUnlock,    null)
}
