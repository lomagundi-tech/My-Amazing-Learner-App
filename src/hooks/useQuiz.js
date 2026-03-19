import { useState } from 'react'
import { QUIZ_QUESTIONS } from '../data/quizData'
import { addStar, earnBadge, incrementCorrect, getCorrectCount, markLevelComplete, getLevelsCompleted, recordQuizAnswer } from '../utils/storage'
import { launchConfetti } from '../utils/confetti'

export function useQuiz(onStarsChange, onBadgesChange) {
  const [level, setLevel]       = useState('budding')
  const [subject, setSubject]   = useState('all')
  const [questionIndex, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null

  const questions = QUIZ_QUESTIONS.filter(
    (q) => q.level === level && (subject === 'all' || q.subject === subject)
  )
  const current = questions[questionIndex % Math.max(questions.length, 1)] ?? questions[0]

  function changeLevel(newLevel) {
    setLevel(newLevel)
    setIndex(0)
    setSelected(null)
    setFeedback(null)
  }

  function changeSubject(newSubject) {
    setSubject(newSubject)
    setIndex(0)
    setSelected(null)
    setFeedback(null)
  }

  function answer(option) {
    if (selected) return
    setSelected(option)

    if (option === current.answer) {
      setFeedback('correct')
      addStar()
      incrementCorrect()
      recordQuizAnswer(current.subject, true)
      onStarsChange()

      // Badge checks
      const total = getCorrectCount()
      if (total >= 1)  { if (earnBadge('first_star'))    { launchConfetti(); onBadgesChange() } }
      if (total >= 10) { if (earnBadge('quiz_champ'))    { launchConfetti(); onBadgesChange() } }

      // Level completion badge
      markLevelComplete(level)
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
    setIndex((i) => (i + 1) % Math.max(questions.length, 1))
  }

  return { level, subject, questions, current, questionIndex, selected, feedback, changeLevel, changeSubject, answer, next }
}
