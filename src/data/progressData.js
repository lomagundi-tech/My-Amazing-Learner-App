// Progress is driven entirely by real activity data — no dummy base values.
// subjectKey: quiz subject that feeds this area | maxAnswers: total questions in that subject
// writing: driven by craft completions (6 crafts = 100%)
// wellbeing: driven by mood check-ins (20 check-ins = 100%)
export const PROGRESS_AREAS = [
  { id: 'reading',   label: 'Reading',   pct: 0, colour: 'var(--mint)',   emoji: '📖', curriculum: 'English — Reading',         subjectKey: 'english', maxAnswers: 6  },
  { id: 'numeracy',  label: 'Numeracy',  pct: 0, colour: 'var(--violet)', emoji: '🔢', curriculum: 'Mathematics',               subjectKey: 'maths',   maxAnswers: 12 },
  { id: 'writing',   label: 'Writing',   pct: 0, colour: 'var(--sky)',    emoji: '✏️', curriculum: 'English — Writing',         subjectKey: null,      maxAnswers: null },
  { id: 'wellbeing', label: 'Wellbeing', pct: 0, colour: 'var(--gold)',   emoji: '💛', curriculum: 'PSHE / Emotional Literacy', subjectKey: null,      maxAnswers: null },
  { id: 'creative',  label: 'Creative',  pct: 0, colour: 'var(--coral)',  emoji: '🎨', curriculum: 'Art & Design / Craft',      subjectKey: 'general', maxAnswers: 6  },
  { id: 'science',   label: 'Science',   pct: 0, colour: 'var(--mint)',   emoji: '🔭', curriculum: 'Science',                   subjectKey: 'science', maxAnswers: 6  },
]
