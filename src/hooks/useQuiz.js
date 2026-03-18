import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../data/quizData'
import { addStar, earnBadge, incrementCorrect, getCorrectCount, markLevelComplete } from '../utils/storage'
import { launchConfetti } from '../utils/confetti'

export function useQuiz(onStarsChange, onBadgesChange) {
  const [level, setLevel]             = useState('budding')
  const [questionIndex, setIndex]     = useState(0)
  const [selected, setSelected]       = useState(null)
  const [feedback, setFeedback]       = useState(null) // 'correct' | 'wrong' | null

  const questions = QUIZ_QUESTIONS.filter((q) => q.level === level)
  const current   = questions[questionIndex] ?? questions[0]

  function changeLevel(newLevel) {
    setLevel(newLevel)
    setIndex(0)
    setSelected(null)
    setFeedback(null)
  }

  function answer(option) {
    if (selected) return // already answered
    setSelected(option)

    if (option === current.answer) {
      setFeedback('correct')
      addStar()
      incrementCorrect()
      onStarsChange()

      // Badge checks
      const total = getCorrectCount()
      if (total >= 1)  { if (earnBadge('first_star'))   { launchConfetti(); onBadgesChange() } }
      if (total >= 10) { if (earnBadge('quiz_champ'))   { launchConfetti(); onBadgesChange() } }

      // Level completion badge
      markLevelComplete(level)
      const { getLevelsCompleted } = require('../utils/storage')
      const completed = getLevelsCompleted()
      if (completed.length >= 3) {
        if (earnBadge('rainbow_reader')) { launchConfetti(); onBadgesChange() }
      }
    } else {
      setFeedback('wrong')
    }
  }

  function next() {
    setSelected(null)
    setFeedback(null)
    setIndex((i) => (i + 1) % questions.length)
  }

  return { level, questions, current, questionIndex, selected, feedback, changeLevel, answer, next }
}
