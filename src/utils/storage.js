const KEYS = {
  stars:           'mal_stars',
  badges:          'mal_badges',
  progress:        'mal_progress',
  quizHistory:     'mal_quiz_history',
  mode:            'mal_mode',
  lastVisit:       'mal_last_visit',
  childName:       'mal_child_name',
  streak:          'mal_streak',
  streakDate:      'mal_streak_date',
  moodHistory:     'mal_mood_history',
  craftsCompleted: 'mal_crafts_completed',
  dailyChallenged: 'mal_daily_challenge',
  levelsCompleted: 'mal_levels_completed',
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

export { clearAll }
