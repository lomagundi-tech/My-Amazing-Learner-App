export const QUIZ_QUESTIONS = [
  // Budding (3-5)
  { id: 1, level: 'budding',      q: 'How many pompoms? 🔴🔵🟡',                                         options: ['2','3','4','5'],                                    answer: '3' },
  { id: 2, level: 'budding',      q: 'Which letter comes first? A, B, C…',                              options: ['B','C','A','D'],                                    answer: 'A' },
  { id: 3, level: 'budding',      q: 'What shape is a wheel? ⭕',                                        options: ['Square','Triangle','Circle','Star'],                answer: 'Circle' },
  // Growing (5-7)
  { id: 4, level: 'growing',      q: 'What is 5 + 3?',                                                  options: ['7','9','8','6'],                                    answer: '8' },
  { id: 5, level: 'growing',      q: 'Which word rhymes with CAT?',                                     options: ['Dog','Bat','Fish','Sun'],                           answer: 'Bat' },
  { id: 6, level: 'growing',      q: 'How many sides does a triangle have?',                            options: ['4','5','2','3'],                                    answer: '3' },
  // Flourishing (7-11)
  { id: 7, level: 'flourishing',  q: 'What is 7 × 8?',                                                  options: ['54','56','48','63'],                                answer: '56' },
  { id: 8, level: 'flourishing',  q: 'Which is the correct spelling?',                                  options: ['Beutiful','Beautifull','Beautiful','Beautifall'],   answer: 'Beautiful' },
  { id: 9, level: 'flourishing',  q: 'What fraction is one half?',                                      options: ['1/3','2/4','1/2','2/3'],                            answer: '1/2' },
]

export const LEVELS = [
  { id: 'budding',     label: 'Budding',     ages: '3–5',  colour: 'var(--mint)',   emoji: '🌱' },
  { id: 'growing',     label: 'Growing',     ages: '5–7',  colour: 'var(--violet)', emoji: '🌿' },
  { id: 'flourishing', label: 'Flourishing', ages: '7–11', colour: 'var(--plum)',   emoji: '🌳' },
]
