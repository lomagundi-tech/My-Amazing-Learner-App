export const DAILY_CHALLENGES = [
  { id: 0,  q: 'What colour do you get when you mix red and blue?',   options: ['Green','Purple','Orange','Pink'],      answer: 'Purple',  subject: 'Creative' },
  { id: 1,  q: 'How many legs does a spider have?',                   options: ['6','8','4','10'],                     answer: '8',       subject: 'Science' },
  { id: 2,  q: 'What is 10 − 4?',                                     options: ['5','7','6','8'],                      answer: '6',       subject: 'Maths' },
  { id: 3,  q: 'Which animal lays eggs?',                             options: ['Dog','Cat','Hen','Cow'],              answer: 'Hen',     subject: 'Science' },
  { id: 4,  q: 'What is the opposite of hot?',                        options: ['Warm','Cool','Cold','Icy'],           answer: 'Cold',    subject: 'English' },
  { id: 5,  q: 'How many days are in a week?',                        options: ['5','6','8','7'],                      answer: '7',       subject: 'Maths' },
  { id: 6,  q: 'Which planet do we live on?',                         options: ['Mars','Venus','Earth','Jupiter'],     answer: 'Earth',   subject: 'Science' },
  { id: 7,  q: 'What is 3 × 4?',                                      options: ['10','11','12','13'],                  answer: '12',      subject: 'Maths' },
  { id: 8,  q: 'Which word is a noun?',                               options: ['Run','Happy','Apple','Quickly'],      answer: 'Apple',   subject: 'English' },
  { id: 9,  q: 'What sound does a cow make?',                         options: ['Baa','Oink','Moo','Cluck'],           answer: 'Moo',     subject: 'General' },
  { id: 10, q: 'How many months are in a year?',                      options: ['10','11','12','13'],                  answer: '12',      subject: 'Maths' },
  { id: 11, q: 'What colour is a banana?',                            options: ['Red','Blue','Green','Yellow'],        answer: 'Yellow',  subject: 'General' },
  { id: 12, q: 'What is the largest ocean?',                          options: ['Atlantic','Indian','Arctic','Pacific'], answer: 'Pacific', subject: 'Geography' },
  { id: 13, q: 'Which of these is a vowel?',                          options: ['B','C','E','F'],                      answer: 'E',       subject: 'English' },
  { id: 14, q: 'What is 20 ÷ 4?',                                     options: ['4','5','6','7'],                      answer: '5',       subject: 'Maths' },
  { id: 15, q: 'How many sides does a square have?',                  options: ['3','5','6','4'],                      answer: '4',       subject: 'Maths' },
  { id: 16, q: 'What do plants need to grow?',                        options: ['Ice','Sunlight','Darkness','Sand'],   answer: 'Sunlight', subject: 'Science' },
  { id: 17, q: 'Which of these is a fruit?',                          options: ['Carrot','Potato','Mango','Onion'],    answer: 'Mango',   subject: 'General' },
  { id: 18, q: 'What is 15 + 7?',                                     options: ['21','22','23','24'],                  answer: '22',      subject: 'Maths' },
  { id: 19, q: 'Which animal lives in a hive?',                       options: ['Ants','Bees','Wasps','Butterflies'],  answer: 'Bees',    subject: 'Science' },
  { id: 20, q: 'What is the past tense of "run"?',                    options: ['Runned','Runs','Ran','Running'],      answer: 'Ran',     subject: 'English' },
  { id: 21, q: 'How many centimetres are in a metre?',                options: ['10','1000','100','50'],               answer: '100',     subject: 'Maths' },
  { id: 22, q: 'Which season comes after Summer?',                    options: ['Spring','Winter','Autumn','Summer'],  answer: 'Autumn',  subject: 'General' },
  { id: 23, q: 'What is 9 × 9?',                                      options: ['72','80','81','90'],                  answer: '81',      subject: 'Maths' },
  { id: 24, q: 'Which of these floats on water?',                     options: ['Rock','Iron','Wood','Coin'],          answer: 'Wood',    subject: 'Science' },
  { id: 25, q: 'What is the capital city of England?',                options: ['Manchester','London','Bristol','Leeds'], answer: 'London', subject: 'Geography' },
  { id: 26, q: 'Which word rhymes with MOON?',                        options: ['Sun','Star','Tune','Cloud'],          answer: 'Tune',    subject: 'English' },
  { id: 27, q: 'How many pence are in a pound?',                      options: ['10','50','100','1000'],               answer: '100',     subject: 'Maths' },
  { id: 28, q: 'What do caterpillars turn into?',                     options: ['Moths','Bees','Butterflies','Flies'], answer: 'Butterflies', subject: 'Science' },
  { id: 29, q: 'What is a group of fish called?',                     options: ['Herd','Flock','Pack','Shoal'],        answer: 'Shoal',   subject: 'English' },
]

export function getTodaysChallenge() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  )
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length]
}
