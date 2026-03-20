// Parent Portal activity definitions — Modules A, B, C
// Module D is Phase 2 scope — not included here

// ── MODULE A — Solo Parent Activities ─────────────────────────
export const MODULE_A = [
  {
    id: 'spelling_bee',
    title: 'Spelling Bee Prep',
    emoji: '🐝',
    description: "Practice spelling words aligned to your child's current level.",
    format: 'Quiz — 10 questions',
    reward: { type: 'discount', pct: 5, label: '5% off next purchase' },
    type: 'quiz',
    bg: '#E8F5E9',
  },
  {
    id: 'general_knowledge',
    title: 'General Knowledge Quiz',
    emoji: '🌍',
    description: 'Capital cities, oceans, planets, history, and basic science.',
    format: 'Multiple choice — 10 questions',
    reward: { type: 'discount', pct: 5, label: '5% off next purchase' },
    type: 'quiz',
    bg: '#E3F2FD',
  },
  {
    id: 'flashcard_builder',
    title: 'Flashcard Builder',
    emoji: '📋',
    description: 'Create custom flashcard sets for upcoming tests or topics.',
    format: 'Card creation tool',
    reward: { type: 'both', pct: 5, label: 'Badge + 5% off' },
    type: 'tool',
    bg: '#F3E5F5',
  },
  {
    id: 'reading_tip',
    title: 'Reading Tip of the Week',
    emoji: '📖',
    description: 'Short evidence-based guide on supporting reading at home.',
    format: 'Article + 3 questions',
    reward: { type: 'badge', pct: 0, label: 'Badge unlock' },
    type: 'article',
    bg: '#FFF8E1',
  },
  {
    id: 'what_learning',
    title: "What Are They Learning?",
    emoji: '🔍',
    description: "Weekly digest of your child's in-app activity with suggested conversation questions.",
    format: 'Read and confirm',
    reward: { type: 'stars', pct: 0, label: 'Streak bonus stars' },
    type: 'read',
    bg: '#E8F5E9',
  },
  {
    id: 'maths_mental',
    title: 'Maths Mental Arithmetic',
    emoji: '🔢',
    description: "Timed mental maths matched to your child's year group.",
    format: 'Quiz — 15 questions',
    reward: { type: 'discount', pct: 5, label: '5% off next purchase' },
    type: 'quiz',
    bg: '#E3F2FD',
  },
]

// ── MODULE B — Do It Together (Joint Activities) ──────────────
export const MODULE_B = [
  {
    id: 'read_together',
    title: 'Read Together',
    emoji: '📚',
    description: 'Read any book together and answer 5 comprehension questions in-app.',
    childEarns: 50,
    parentReward: '10% off next month',
    rewardPct: 10,
    bg: '#E8F5E9',
  },
  {
    id: 'science_experiment',
    title: 'Science Experiment',
    emoji: '🔬',
    description: 'Complete one of 10 provided home experiments and discuss findings.',
    childEarns: 75,
    parentReward: '15% off next purchase',
    rewardPct: 15,
    bg: '#E3F2FD',
  },
  {
    id: 'cook_recipe',
    title: 'Cook a Recipe',
    emoji: '🍳',
    description: 'Follow a simple recipe together from the in-app library.',
    childEarns: 60,
    parentReward: 'Free premium content',
    rewardPct: 0,
    bg: '#FFF8E1',
  },
  {
    id: 'board_game_night',
    title: 'Board Game Night',
    emoji: '🎲',
    description: 'Play any board game; log the outcome and one thing the child learned.',
    childEarns: 40,
    parentReward: '5% off next month',
    rewardPct: 5,
    bg: '#F3E5F5',
  },
  {
    id: 'educational_video',
    title: 'Educational Video',
    emoji: '🎬',
    description: "Watch a selected video together; parent confirms 3-question child quiz.",
    childEarns: 30,
    parentReward: 'Monthly prize draw entry',
    rewardPct: 0,
    bg: '#FCE4EC',
  },
  {
    id: 'nature_walk',
    title: 'Nature Walk',
    emoji: '🌿',
    description: 'Complete a guided outdoor observation checklist together.',
    childEarns: 55,
    parentReward: '10% off next purchase',
    rewardPct: 10,
    bg: '#E8F5E9',
  },
  {
    id: 'creative_writing',
    title: 'Creative Writing',
    emoji: '✏️',
    description: 'Write a short story together using in-app prompts.',
    childEarns: 65,
    parentReward: 'Badge + 10% off',
    rewardPct: 10,
    bg: '#E3F2FD',
  },
  {
    id: 'country_week',
    title: 'Country of the Week',
    emoji: '🗺️',
    description: 'Learn about a featured country; answer 5 family quiz questions.',
    childEarns: 45,
    parentReward: '7.5% off next month',
    rewardPct: 7.5,
    bg: '#FFF8E1',
  },
]

// ── MODULE C — Life Skills Challenges (coming soon) ──────────
export const MODULE_C = [
  { id: 'bedtime_routine',    title: 'Bedtime Routine',       emoji: '🌙', childEarns: 100, parentReward: '10% off next bill',     freq: '3x per week', evidence: 'Short video (30–60s)' },
  { id: 'morning_school_prep',title: 'Morning School Prep',   emoji: '🎒', childEarns: 80,  parentReward: '7.5% off next bill',    freq: '3x per week', evidence: 'Photo' },
  { id: 'tooth_brushing',     title: 'Tooth Brushing',        emoji: '🦷', childEarns: 60,  parentReward: 'Free 1-week premium',   freq: '5x per week', evidence: 'Video (2 min)' },
  { id: 'tidy_bedroom',       title: 'Tidy Bedroom',          emoji: '🧹', childEarns: 70,  parentReward: 'Prize draw entry',      freq: '1x per week', evidence: 'Before & after photos' },
  { id: 'healthy_meal_prep',  title: 'Healthy Meal Prep',     emoji: '🥗', childEarns: 50,  parentReward: '5% off next purchase',  freq: '2x per week', evidence: 'Photo of completed meal' },
  { id: 'reading_before_bed', title: 'Reading Before Bed',    emoji: '📖', childEarns: 90,  parentReward: '10% off next bill',     freq: '4x per week', evidence: 'Photo: child reading in bed' },
  { id: 'outdoor_exercise',   title: 'Outdoor Exercise',      emoji: '🏃', childEarns: 70,  parentReward: '7.5% off next bill',    freq: '3x per week', evidence: 'Photo or 30-second video' },
  { id: 'screen_free_hour',   title: 'Screen-Free Hour',      emoji: '📵', childEarns: 60,  parentReward: '5% off next month',     freq: '2x per week', evidence: 'Parent confirms via checkbox' },
]

// ── QUIZ QUESTIONS ─────────────────────────────────────────────

export const SPELLING_BEE_QUESTIONS = [
  { q: 'Which is the correct spelling?', options: ['Beutiful', 'Beautifull', 'Beautiful', 'Beautifal'],    answer: 'Beautiful' },
  { q: 'Which is the correct spelling?', options: ['Recieve', 'Receive', 'Receeve', 'Receve'],             answer: 'Receive' },
  { q: 'Which is the correct spelling?', options: ['Seperate', 'Seprate', 'Separrate', 'Separate'],        answer: 'Separate' },
  { q: 'Which is the correct spelling?', options: ['Definately', 'Definitly', 'Definitely', 'Defenitely'], answer: 'Definitely' },
  { q: 'Which is the correct spelling?', options: ['Accomodate', 'Accommodate', 'Accommadate', 'Acomodate'], answer: 'Accommodate' },
  { q: 'Which is the correct spelling?', options: ['Rythm', 'Rhythem', 'Rhythm', 'Rithym'],                answer: 'Rhythm' },
  { q: 'Which is the correct spelling?', options: ['Necessary', 'Neccesary', 'Necesary', 'Necessery'],     answer: 'Necessary' },
  { q: 'Which is the correct spelling?', options: ['Embaras', 'Embarass', 'Embarrass', 'Embarras'],        answer: 'Embarrass' },
  { q: 'Which is the correct spelling?', options: ['Wierd', 'Wired', 'Weird', 'Weerd'],                    answer: 'Weird' },
  { q: 'Which is the correct spelling?', options: ['Occurance', 'Occurence', 'Occurrence', 'Occurrrence'], answer: 'Occurrence' },
]

export const GENERAL_KNOWLEDGE_QUESTIONS = [
  { q: 'What is the capital of France?',            options: ['Lyon', 'Paris', 'Nice', 'Bordeaux'],                       answer: 'Paris' },
  { q: 'Which is the largest ocean on Earth?',      options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],                 answer: 'Pacific' },
  { q: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'],                                       answer: '8' },
  { q: 'What gas do plants absorb from the air?',   options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],        answer: 'Carbon dioxide' },
  { q: 'What is the largest country by area?',      options: ['China', 'USA', 'Russia', 'Australia'],                     answer: 'Russia' },
  { q: 'Which planet is known as the Red Planet?',  options: ['Jupiter', 'Mars', 'Saturn', 'Venus'],                      answer: 'Mars' },
  { q: 'Who wrote Romeo and Juliet?',               options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Roald Dahl'], answer: 'William Shakespeare' },
  { q: 'What is the chemical symbol for water?',    options: ['WO', 'H2O', 'HO2', 'W2H'],                                answer: 'H2O' },
  { q: 'What is the tallest mountain in the world?', options: ['Ben Nevis', 'Mont Blanc', 'K2', 'Mount Everest'],         answer: 'Mount Everest' },
  { q: 'What is the capital of Australia?',         options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],             answer: 'Canberra' },
]

export const MATHS_MENTAL_QUESTIONS = [
  { q: '7 × 8 = ?',                      options: ['54', '56', '48', '64'],          answer: '56' },
  { q: '144 ÷ 12 = ?',                   options: ['10', '11', '12', '13'],          answer: '12' },
  { q: 'What is 25% of 80?',             options: ['15', '20', '25', '30'],          answer: '20' },
  { q: '3² + 4² = ?',                    options: ['14', '25', '49', '12'],          answer: '25' },
  { q: '0.5 × 36 = ?',                   options: ['16', '18', '20', '22'],          answer: '18' },
  { q: 'What is one third of 99?',        options: ['29', '31', '33', '37'],          answer: '33' },
  { q: '52 × 4 = ?',                     options: ['196', '200', '208', '212'],      answer: '208' },
  { q: '1000 − 347 = ?',                 options: ['653', '663', '673', '643'],      answer: '653' },
  { q: 'What is 10% of 350?',            options: ['30', '35', '40', '45'],          answer: '35' },
  { q: '6² = ?',                         options: ['12', '18', '36', '66'],          answer: '36' },
  { q: '4.5 + 3.7 = ?',                  options: ['7.2', '8.2', '8.1', '7.9'],     answer: '8.2' },
  { q: 'What fraction is 3 out of 12?',  options: ['1/3', '1/4', '1/6', '2/5'],     answer: '1/4' },
  { q: '72 ÷ 9 = ?',                     options: ['6', '7', '8', '9'],             answer: '8' },
  { q: 'What is 15% of 60?',             options: ['7', '8', '9', '10'],            answer: '9' },
  { q: 'Round 4,856 to the nearest thousand.', options: ['4,000', '4,800', '4,900', '5,000'], answer: '5,000' },
]

// Article content for Reading Tip of the Week
export const READING_TIP_ARTICLE = {
  title: 'Reading Tip of the Week',
  body: [
    "Research shows that just 20 minutes of daily reading at home can have a dramatic impact on your child's progress. Children who read for pleasure outside of school have significantly higher literacy scores by age 11.",
    "One of the most powerful things you can do is ask open-ended questions while reading together. Instead of 'Did you like that?' try 'What do you think will happen next?' or 'Why do you think the character did that?' These questions develop comprehension and critical thinking at the same time.",
    "Create a reading-friendly environment: a comfortable spot with good natural or lamp light, away from screens. Let your child choose books they enjoy — even comics and non-fiction count. Enjoyment is the single biggest predictor of reading improvement.",
  ],
  questions: [
    { q: 'How many minutes of daily reading is recommended?',     options: ['5 mins', '10 mins', '20 mins', '1 hour'],                             answer: '20 mins' },
    { q: 'What type of questions best develop comprehension?',    options: ['Yes/No questions', 'Spelling questions', 'Open-ended questions', 'Times tables'], answer: 'Open-ended questions' },
    { q: 'What is the biggest predictor of reading improvement?', options: ['Length of book', 'Enjoyment', 'Reading speed', 'Book level'],          answer: 'Enjoyment' },
  ],
}

// Flashcard topics for the builder
export const FLASHCARD_TOPICS = [
  { id: 'times_tables', label: 'Times Tables', cards: ['2×1=2', '2×2=4', '3×3=9', '4×4=16', '5×5=25', '6×6=36'] },
  { id: 'capital_cities', label: 'Capital Cities', cards: ['France → Paris', 'Germany → Berlin', 'Spain → Madrid', 'Italy → Rome', 'Japan → Tokyo', 'Australia → Canberra'] },
  { id: 'spellings', label: 'Tricky Spellings', cards: ['Beautiful', 'Necessary', 'Separate', 'Definitely', 'Accommodate', 'Embarrass'] },
  { id: 'planets', label: 'Planets', cards: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] },
]

// Parent tier definitions
export const PARENT_TIERS = [
  { tier: 0, label: 'Getting Started', badge: '—',         colour: '#9E9E9E', requirement: 'Complete your first activity' },
  { tier: 1, label: 'Engaged Parent',  badge: 'Bronze Shield', colour: '#CD7F32', requirement: '5 activities this month' },
  { tier: 2, label: 'Active Parent',   badge: 'Silver Shield', colour: '#C0C0C0', requirement: '10 activities including 2 joint' },
  { tier: 3, label: 'Champion Parent', badge: 'Gold Shield',   colour: '#FFB347', requirement: '15 activities across all modules' },
  { tier: 4, label: 'MAL Super Parent',badge: 'Platinum Crown',colour: '#6B3FA0', requirement: '20+ activities this month' },
]
