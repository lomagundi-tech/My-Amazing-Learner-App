// Base percentages are the starting floor — quiz correct answers push them higher (capped at 100%)
// subjectKey links each area to the quiz subject that feeds it
export const PROGRESS_AREAS = [
  { id: 'reading',   label: 'Reading',   pct: 72, colour: 'var(--mint)',   emoji: '📖', curriculum: 'English — Reading',          subjectKey: 'english' },
  { id: 'numeracy',  label: 'Numeracy',  pct: 58, colour: 'var(--violet)', emoji: '🔢', curriculum: 'Mathematics',                subjectKey: 'maths'   },
  { id: 'writing',   label: 'Writing',   pct: 84, colour: 'var(--sky)',    emoji: '✏️', curriculum: 'English — Writing',          subjectKey: null      },
  { id: 'wellbeing', label: 'Wellbeing', pct: 91, colour: 'var(--gold)',   emoji: '💛', curriculum: 'PSHE / Emotional Literacy',  subjectKey: null      },
  { id: 'creative',  label: 'Creative',  pct: 67, colour: 'var(--coral)',  emoji: '🎨', curriculum: 'Art & Design / Craft',       subjectKey: 'general' },
  { id: 'science',   label: 'Science',   pct: 43, colour: 'var(--mint)',   emoji: '🔭', curriculum: 'Science — lowest score',     subjectKey: 'science' },
]
