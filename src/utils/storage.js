const KEYS = {
  stars:                'mal_stars',
  badges:               'mal_badges',
  progress:             'mal_progress',
  quizHistory:          'mal_quiz_history',
  mode:                 'mal_mode',
  lastVisit:            'mal_last_visit',
  childName:            'mal_child_name',
  streak:               'mal_streak',
  streakDate:           'mal_streak_date',
  moodHistory:          'mal_mood_history',
  craftsCompleted:      'mal_crafts_completed',
  dailyChallenged:      'mal_daily_challenge',
  levelsCompleted:      'mal_levels_completed',
  senActive:            'mal_sen_active',
  senTooltipShown:      'mal_sen_tooltip_shown',
  parentCompletions:    'mal_parent_completions',
  parentVouchers:       'mal_parent_vouchers',
  parentJointSessions:  'mal_parent_joint_sessions',
  parentFlashcards:     'mal_parent_flashcards',
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
export function addStar()            { set(KEYS.stars, getStars() + 1) }

export function getBadges()          { return get(KEYS.badges, ['first_star', 'book_worm', 'number_ninja']) }
export function setBadges(arr)       { set(KEYS.badges, arr) }
export function earnBadge(id) {
  const current = getBadges()
  if (!current.includes(id)) {
    set(KEYS.badges, [...current, id])
    return true // newly earned
  }
  return false
}

export function getChildName()       { return get(KEYS.childName, '') }
export function setChildName(name)   { set(KEYS.childName, name) }

export function getMode()            { return get(KEYS.mode, 'parent') }
export function setMode(mode)        { set(KEYS.mode, mode) }

export function getStreak()          { return get(KEYS.streak, 0) }
export function getStreakDate()      { return get(KEYS.streakDate, null) }
export function updateStreak() {
  const today = new Date().toDateString()
  const lastDate = getStreakDate()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (lastDate === today) return get(KEYS.streak, 1) // already counted today
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

// Subject progress — tracks correct quiz answers per subject
// Each correct answer adds 2% to the linked progress area (floor = base pct in progressData.js)
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
  set(KEYS.parentCompletions, [...current, { id: activityId, module, completedAt: now.toISOString(), month: monthKey }])
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
    (c) => c.id === activityId && new Date(c.completedAt).toDateString() === today
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

// Vouchers
export function getParentVouchers()  { return get(KEYS.parentVouchers, []) }

export function addParentVoucher(activityId, pct, label) {
  if (pct <= 0) return // non-discount rewards are tracked in completions only
  const current = getParentVouchers()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 86400000).toISOString()
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  const code = `MAL-${activityId.slice(0, 4).toUpperCase()}-${suffix}`
  set(KEYS.parentVouchers, [
    ...current,
    { id: `v_${Date.now()}`, code, pct, label, issuedAt: now.toISOString(), expiresAt, used: false, source: activityId },
  ])
}

export function markVoucherUsed(voucherId) {
  const current = getParentVouchers()
  set(KEYS.parentVouchers, current.map((v) => (v.id === voucherId ? { ...v, used: true } : v)))
}

export function getActiveVouchers() {
  const now = new Date()
  return getParentVouchers().filter((v) => !v.used && new Date(v.expiresAt) > now)
}

// Joint sessions
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
  // side: 'parent' | 'child'
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

// Flashcards
export function getParentFlashcards() { return get(KEYS.parentFlashcards, []) }
export function saveParentFlashcard(topicId, front, back) {
  const current = getParentFlashcards()
  set(KEYS.parentFlashcards, [...current, { id: `fc_${Date.now()}`, topicId, front, back, createdAt: new Date().toISOString() }])
}
export function deleteParentFlashcard(id) {
  set(KEYS.parentFlashcards, getParentFlashcards().filter((f) => f.id !== id))
}
