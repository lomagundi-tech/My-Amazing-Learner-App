export const QUIZ_QUESTIONS = [

  // ── BUDDING (ages 3–5) ────────────────────────────────────────
  { id:  1, level: 'budding',     subject: 'maths',   q: 'How many pompoms? 🔴🔵🟡',                              options: ['2','3','4','5'],                                  answer: '3' },
  { id:  2, level: 'budding',     subject: 'english', q: 'Which letter comes first? A, B, C…',                   options: ['B','C','A','D'],                                  answer: 'A' },
  { id:  3, level: 'budding',     subject: 'maths',   q: 'What shape is a wheel? ⭕',                             options: ['Square','Triangle','Circle','Star'],              answer: 'Circle' },
  { id:  4, level: 'budding',     subject: 'general', q: 'Which animal says "moo"? 🐄',                           options: ['Dog','Cow','Cat','Duck'],                         answer: 'Cow' },
  { id:  5, level: 'budding',     subject: 'science', q: 'How many legs does a dog have?',                        options: ['2','6','4','8'],                                  answer: '4' },
  { id:  6, level: 'budding',     subject: 'maths',   q: 'What number comes after 5?',                            options: ['4','7','6','8'],                                  answer: '6' },
  { id:  7, level: 'budding',     subject: 'science', q: 'Which of these lives in the sea? 🌊',                   options: ['Cat','Fish','Horse','Rabbit'],                    answer: 'Fish' },
  { id:  8, level: 'budding',     subject: 'general', q: 'Which of these is a fruit? 🍎',                         options: ['Chair','Apple','Shoe','Table'],                   answer: 'Apple' },
  { id:  9, level: 'budding',     subject: 'maths',   q: 'How many sides does a square have?',                    options: ['3','5','6','4'],                                  answer: '4' },
  { id: 10, level: 'budding',     subject: 'general', q: 'What colour do you get mixing red and yellow? 🎨',      options: ['Green','Blue','Orange','Purple'],                 answer: 'Orange' },

  // ── GROWING (ages 5–7) ───────────────────────────────────────
  { id: 11, level: 'growing',     subject: 'maths',   q: 'What is 5 + 3?',                                        options: ['7','9','8','6'],                                  answer: '8' },
  { id: 12, level: 'growing',     subject: 'english', q: 'Which word rhymes with CAT?',                            options: ['Dog','Bat','Fish','Sun'],                         answer: 'Bat' },
  { id: 13, level: 'growing',     subject: 'maths',   q: 'How many sides does a triangle have?',                  options: ['4','5','2','3'],                                  answer: '3' },
  { id: 14, level: 'growing',     subject: 'maths',   q: 'What is 10 − 4?',                                       options: ['5','7','6','8'],                                  answer: '6' },
  { id: 15, level: 'growing',     subject: 'english', q: 'Which of these is a verb (doing word)?',                 options: ['Apple','Run','Happy','Chair'],                    answer: 'Run' },
  { id: 16, level: 'growing',     subject: 'general', q: 'What is the capital city of England?',                   options: ['Manchester','Birmingham','London','Bristol'],     answer: 'London' },
  { id: 17, level: 'growing',     subject: 'science', q: 'Which season comes after winter?',                       options: ['Autumn','Summer','Winter','Spring'],              answer: 'Spring' },
  { id: 18, level: 'growing',     subject: 'general', q: 'How many days are in a week?',                           options: ['5','6','8','7'],                                  answer: '7' },
  { id: 19, level: 'growing',     subject: 'science', q: 'What do bees make? 🐝',                                  options: ['Milk','Honey','Butter','Juice'],                  answer: 'Honey' },
  { id: 20, level: 'growing',     subject: 'maths',   q: 'What is 3 × 4?',                                        options: ['10','14','12','9'],                               answer: '12' },

  // ── FLOURISHING (ages 7–11) ──────────────────────────────────
  { id: 21, level: 'flourishing', subject: 'maths',   q: 'What is 7 × 8?',                                        options: ['54','56','48','63'],                              answer: '56' },
  { id: 22, level: 'flourishing', subject: 'english', q: 'Which is the correct spelling?',                         options: ['Beutiful','Beautifull','Beautiful','Beautifall'], answer: 'Beautiful' },
  { id: 23, level: 'flourishing', subject: 'maths',   q: 'What fraction is one half?',                             options: ['1/3','2/4','1/2','2/3'],                          answer: '1/2' },
  { id: 24, level: 'flourishing', subject: 'maths',   q: 'What is 144 ÷ 12?',                                     options: ['11','13','14','12'],                              answer: '12' },
  { id: 25, level: 'flourishing', subject: 'science', q: 'Which is the largest planet in our solar system?',       options: ['Saturn','Mars','Jupiter','Neptune'],              answer: 'Jupiter' },
  { id: 26, level: 'flourishing', subject: 'english', q: 'Which of these is an antonym of "ancient"?',             options: ['Old','Modern','Historic','Aged'],                 answer: 'Modern' },
  { id: 27, level: 'flourishing', subject: 'science', q: 'Which gas makes up most of Earth\'s atmosphere?',        options: ['Oxygen','Carbon dioxide','Hydrogen','Nitrogen'], answer: 'Nitrogen' },
  { id: 28, level: 'flourishing', subject: 'maths',   q: 'What type of numbers are 2, 3, 5, 7 and 11?',           options: ['Even','Square','Prime','Odd'],                    answer: 'Prime' },
  { id: 29, level: 'flourishing', subject: 'english', q: 'Who wrote Romeo and Juliet?',                            options: ['Dickens','Roald Dahl','Shakespeare','Tolkien'],   answer: 'Shakespeare' },
  { id: 30, level: 'flourishing', subject: 'general', q: 'Which is the longest river in the world?',               options: ['Amazon','Thames','Nile','Yangtze'],               answer: 'Nile' },

]

export const LEVELS = [
  { id: 'budding',     label: 'Budding',     ages: '3–5',  colour: 'var(--mint)',   emoji: '🌱' },
  { id: 'growing',     label: 'Growing',     ages: '5–7',  colour: 'var(--violet)', emoji: '🌿' },
  { id: 'flourishing', label: 'Flourishing', ages: '7–11', colour: 'var(--plum)',   emoji: '🌳' },
]

export const SUBJECTS = [
  { id: 'all',     label: 'All',     emoji: '📚' },
  { id: 'maths',   label: 'Maths',   emoji: '🔢' },
  { id: 'english', label: 'English', emoji: '📖' },
  { id: 'science', label: 'Science', emoji: '🔬' },
  { id: 'general', label: 'General', emoji: '🌍' },
]
