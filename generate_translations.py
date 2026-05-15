import json

# Data extracted from source files (simplified/representative for the script)
# I will populate these with the actual data from the files I read.

quiz_questions = [
    {"id": 1, "q": "How many pompoms? 🔴🔵🟡", "options": ["2","3","4","5"]},
    {"id": 2, "q": "Which letter comes first? A, B, C…", "options": ["B","C","A","D"]},
    {"id": 3, "q": "What shape is a wheel? ⭕", "options": ["Square","Triangle","Circle","Star"]},
    {"id": 4, "q": "Which animal says \"moo\"? 🐄", "options": ["Dog","Cow","Cat","Duck"]},
    {"id": 5, "q": "How many legs does a dog have?", "options": ["2","6","4","8"]},
    {"id": 6, "q": "What number comes after 5?", "options": ["4","7","6","8"]},
    {"id": 7, "q": "Which of these lives in the sea? 🌊", "options": ["Cat","Fish","Horse","Rabbit"]},
    {"id": 8, "q": "Which of these is a fruit? 🍎", "options": ["Chair","Apple","Shoe","Table"]},
    {"id": 9, "q": "How many sides does a square have?", "options": ["3","5","6","4"]},
    {"id": 10, "q": "What colour do you get mixing red and yellow? 🎨", "options": ["Green","Blue","Orange","Purple"]},
    {"id": 11, "q": "What is 5 + 3?", "options": ["7","9","8","6"]},
    {"id": 12, "q": "Which word rhymes with CAT?", "options": ["Dog","Bat","Fish","Sun"]},
    {"id": 13, "q": "How many sides does a triangle have?", "options": ["4","5","2","3"]},
    {"id": 14, "q": "What is 10 − 4?", "options": ["5","7","6","8"]},
    {"id": 15, "q": "Which of these is a verb (doing word)?", "options": ["Apple","Run","Happy","Chair"]},
    {"id": 16, "q": "What is the capital city of England?", "options": ["Manchester","Birmingham","London","Bristol"]},
    {"id": 17, "q": "Which season comes after winter?", "options": ["Autumn","Summer","Winter","Spring"]},
    {"id": 18, "q": "How many days are in a week?", "options": ["5","6","8","7"]},
    {"id": 19, "q": "What do bees make? 🐝", "options": ["Milk","Honey","Butter","Juice"]},
    {"id": 20, "q": "What is 3 × 4?", "options": ["10","14","12","9"]},
    {"id": 21, "q": "What is 7 × 8?", "options": ["54","56","48","63"]},
    {"id": 22, "q": "Which is the correct spelling?", "options": ["Beutiful","Beautifull","Beautiful","Beautifall"]},
    {"id": 23, "q": "What fraction is one half?", "options": ["1/3","2/4","1/2","2/3"]},
    {"id": 24, "q": "What is 144 ÷ 12?", "options": ["11","13","14","12"]},
    {"id": 25, "q": "Which is the largest planet in our solar system?", "options": ["Saturn","Mars","Jupiter","Neptune"]},
    {"id": 26, "q": "Which of these is an antonym of \"ancient\"?", "options": ["Old","Modern","Historic","Aged"]},
    {"id": 27, "q": "Which gas makes up most of Earth's atmosphere?", "options": ["Oxygen","Carbon dioxide","Hydrogen","Nitrogen"]},
    {"id": 28, "q": "What type of numbers are 2, 3, 5, 7 and 11?", "options": ["Even","Square","Prime","Odd"]},
    {"id": 29, "q": "Who wrote Romeo and Juliet?", "options": ["Dickens","Roald Dahl","Shakespeare","Tolkien"]},
    {"id": 30, "q": "Which is the longest river in the world?", "options": ["Amazon","Thames","Nile","Yangtze"]},
]

module_a = [
    {"id": "spelling_bee", "title": "Spelling Bee Prep", "description": "Practice spelling words aligned to your child's current level.", "format": "Quiz — 10 questions"},
    {"id": "general_knowledge", "title": "General Knowledge Quiz", "description": "Capital cities, oceans, planets, history, and basic science.", "format": "Multiple choice — 10 questions"},
    {"id": "flashcard_builder", "title": "Flashcard Builder", "description": "Create custom flashcard sets for upcoming tests or topics.", "format": "Card creation tool"},
    {"id": "reading_tip", "title": "Reading Tip of the Week", "description": "Short evidence-based guide on supporting reading at home.", "format": "Article + 3 questions"},
    {"id": "what_learning", "title": "What Are They Learning?", "description": "Weekly digest of your child's in-app activity with suggested conversation questions.", "format": "Read and confirm"},
    {"id": "maths_mental", "title": "Maths Mental Arithmetic", "description": "Timed mental maths matched to your child's year group.", "format": "Quiz — 15 questions"},
]

module_b = [
    {"id": "read_together", "title": "Read Together", "description": "Read any book together and answer 5 comprehension questions in-app.", "format": ""},
    {"id": "science_experiment", "title": "Science Experiment", "description": "Complete one of 10 provided home experiments and discuss findings.", "format": ""},
    {"id": "cook_recipe", "title": "Cook a Recipe", "description": "Follow a simple recipe together from the in-app library.", "format": ""},
    {"id": "board_game_night", "title": "Board Game Night", "description": "Play any board game; log the outcome and one thing the child learned.", "format": ""},
    {"id": "educational_video", "title": "Educational Video", "description": "Watch a selected video together; parent confirms 3-question child quiz.", "format": ""},
    {"id": "nature_walk", "title": "Nature Walk", "description": "Complete a guided outdoor observation checklist together.", "format": ""},
    {"id": "creative_writing", "title": "Creative Writing", "description": "Write a short story together using in-app prompts.", "format": ""},
    {"id": "country_week", "title": "Country of the Week", "description": "Learn about a featured country; answer 5 family quiz questions.", "format": ""},
]

module_c = [
    {"id": "bedtime_routine", "title": "Bedtime Routine", "description": "", "format": "3x per week"},
    {"id": "morning_school_prep", "title": "Morning School Prep", "description": "", "format": "3x per week"},
    {"id": "tooth_brushing", "title": "Tooth Brushing", "description": "", "format": "5x per week"},
    {"id": "tidy_bedroom", "title": "Tidy Bedroom", "description": "", "format": "1x per week"},
    {"id": "healthy_meal_prep", "title": "Healthy Meal Prep", "description": "", "format": "2x per week"},
    {"id": "reading_before_bed", "title": "Reading Before Bed", "description": "", "format": "4x per week"},
    {"id": "outdoor_exercise", "title": "Outdoor Exercise", "description": "", "format": "3x per week"},
    {"id": "screen_free_hour", "title": "Screen-Free Hour", "description": "", "format": "2x per week"},
]

module_d = [
    {"id": "steps_together", "title": "10,000 Steps Together", "description": "Log your family step count and confirm you reached 10,000 steps together today.", "format": ""},
    {"id": "scavenger_hunt", "title": "Outdoor Scavenger Hunt", "description": "Complete the outdoor checklist together — tick off each item you find on your walk.", "format": ""},
    {"id": "mindfulness_moment", "title": "Mindfulness Moment", "description": "Follow the guided 4-7-8 breathing exercise together for calm and focus.", "format": ""},
    {"id": "screen_free_evening", "title": "Screen-Free Family Evening", "description": "Spend an evening without screens — games, drawing, conversation, or reading together.", "format": ""},
    {"id": "draw_and_caption", "title": "Draw and Caption", "description": "Your child draws anything they like — describe the drawing and add a caption here.", "format": ""},
    {"id": "story_time_creator", "title": "Story Time Creator", "description": "Use the prompts below to build a short story together — your story is saved locally.", "format": ""},
    {"id": "random_kindness", "title": "Random Act of Kindness", "description": "Your child performs a kind act for someone — describe it here and both confirm.", "format": ""},
    {"id": "teach_the_parent", "title": "Teach the Parent", "description": "Your child picks a topic and teaches you about it — rate their explanation 1 to 5.", "format": ""},
    {"id": "family_values", "title": "Family Values Discussion", "description": "This week's topic: discuss what honesty means and share a real example from your own lives.", "format": ""},
    {"id": "world_food_night", "title": "World Food Night", "description": "Cook a dish from the featured country together and read the country profile below.", "format": ""},
    {"id": "language_phrases", "title": "Language Phrase Challenge", "description": "Learn 5 French phrases together using the pronunciation guide — practise until both are confident.", "format": ""},
    {"id": "history_detective", "title": "History Detective", "description": "Read the clues together and solve the historical mystery before revealing the answer.", "format": ""},
]

parent_tiers = [
    {"tier": 0, "label": "Getting Started", "requirement": "Complete your first activity"},
    {"tier": 1, "label": "Engaged Parent", "requirement": "5 activities this month"},
    {"tier": 2, "label": "Active Parent", "requirement": "10 activities including 2 joint"},
    {"tier": 3, "label": "Champion Parent", "requirement": "15 activities across all modules"},
    {"tier": 4, "label": "MAL Super Parent", "requirement": "20+ activities this month"},
]

spelling_quiz = [
    {"q": "Which is the correct spelling?", "options": ["Beutiful", "Beautifull", "Beautiful", "Beautifal"]},
    {"q": "Which is the correct spelling?", "options": ["Recieve", "Receive", "Receeve", "Receve"]},
    {"q": "Which is the correct spelling?", "options": ["Seperate", "Seprate", "Separrate", "Separate"]},
    {"q": "Which is the correct spelling?", "options": ["Definately", "Definitly", "Definitely", "Defenitely"]},
    {"q": "Which is the correct spelling?", "options": ["Accomodate", "Accommodate", "Accommadate", "Acomodate"]},
    {"q": "Which is the correct spelling?", "options": ["Rythm", "Rhythem", "Rhythm", "Rithym"]},
    {"q": "Which is the correct spelling?", "options": ["Necessary", "Neccesary", "Necesary", "Necessery"]},
    {"q": "Which is the correct spelling?", "options": ["Embaras", "Embarass", "Embarrass", "Embarras"]},
    {"q": "Which is the correct spelling?", "options": ["Wierd", "Wired", "Weird", "Weerd"]},
    {"q": "Which is the correct spelling?", "options": ["Occurance", "Occurence", "Occurrence", "Occurrrence"]},
]

gk_quiz = [
    {"q": "What is the capital of France?", "options": ["Lyon", "Paris", "Nice", "Bordeaux"]},
    {"q": "Which is the largest ocean on Earth?", "options": ["Atlantic", "Indian", "Arctic", "Pacific"]},
    {"q": "How many planets are in our solar system?", "options": ["7", "8", "9", "10"]},
    {"q": "What gas do plants absorb from the air?", "options": ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"]},
    {"q": "What is the largest country by area?", "options": ["China", "USA", "Russia", "Australia"]},
    {"q": "Which planet is known as the Red Planet?", "options": ["Jupiter", "Mars", "Saturn", "Venus"]},
    {"q": "Who wrote Romeo and Juliet?", "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Roald Dahl"]},
    {"q": "What is the chemical symbol for water?", "options": ["WO", "H2O", "HO2", "W2H"]},
    {"q": "What is the tallest mountain in the world?", "options": ["Ben Nevis", "Mont Blanc", "K2", "Mount Everest"]},
    {"q": "What is the capital of Australia?", "options": ["Sydney", "Melbourne", "Canberra", "Brisbane"]},
]

maths_quiz = [
    {"q": "7 × 8 = ?", "options": ["54", "56", "48", "64"]},
    {"q": "144 ÷ 12 = ?", "options": ["10", "11", "12", "13"]},
    {"q": "What is 25% of 80?", "options": ["15", "20", "25", "30"]},
    {"q": "3² + 4² = ?", "options": ["14", "25", "49", "12"]},
    {"q": "0.5 × 36 = ?", "options": ["16", "18", "20", "22"]},
    {"q": "What is one third of 99?", "options": ["29", "31", "33", "37"]},
    {"q": "52 × 4 = ?", "options": ["196", "200", "208", "212"]},
    {"q": "1000 − 347 = ?", "options": ["653", "663", "673", "643"]},
    {"q": "What is 10% of 350?", "options": ["30", "35", "40", "45"]},
    {"q": "6² = ?", "options": ["12", "18", "36", "66"]},
    {"q": "4.5 + 3.7 = ?", "options": ["7.2", "8.2", "8.1", "7.9"]},
    {"q": "What fraction is 3 out of 12?", "options": ["1/3", "1/4", "1/6", "2/5"]},
    {"q": "72 ÷ 9 = ?", "options": ["6", "7", "8", "9"]},
    {"q": "What is 15% of 60?", "options": ["7", "8", "9", "10"]},
    {"q": "Round 4,856 to the nearest thousand.", "options": ["4,000", "4,800", "4,900", "5,000"]},
]

reading_article = {
    "title": "Reading Tip of the Week",
    "body": [
        "Research shows that just 20 minutes of daily reading at home can have a dramatic impact on your child's progress. Children who read for pleasure outside of school have significantly higher literacy scores by age 11.",
        "One of the most powerful things you can do is ask open-ended questions while reading together. Instead of 'Did you like that?' try 'What do you think will happen next?' or 'Why do you think the character did that?' These questions develop comprehension and critical thinking at the same time.",
        "Create a reading-friendly environment: a comfortable spot with good natural or lamp light, away from screens. Let your child choose books they enjoy — even comics and non-fiction count. Enjoyment is the single biggest predictor of reading improvement.",
    ],
    "questions": [
        {"q": "How many minutes of daily reading is recommended?", "options": ["5 mins", "10 mins", "20 mins", "1 hour"]},
        {"q": "What type of questions best develop comprehension?", "options": ["Yes/No questions", "Spelling questions", "Open-ended questions", "Times tables"]},
        {"q": "What is the biggest predictor of reading improvement?", "options": ["Length of book", "Enjoyment", "Reading speed", "Book level"]},
    ]
}

trail_stops = [
    {
        "number": 1,
        "name": "The Jolly Roger",
        "location": "Museum Entrance / Welcome Gallery",
        "fact": "Submarines in the Royal Navy fly a Jolly Roger flag when they return from a successful mission! This tradition started in 1914 when an Admiral called submariners \"pirates.\" Each flag has symbols that show what the submarine did on its mission.",
        "quiz": {
            "question": "What started the Royal Navy tradition of submarines flying Jolly Roger flags?",
            "options": ["A captain liked pirates", "An Admiral called submariners pirates", "A sailor found a treasure map"]
        }
    },
    {
        "number": 2,
        "name": "The Torpedo Room",
        "location": "HMS Alliance — Forward Compartment",
        "fact": "HMS Alliance has four torpedo tubes at the front of the submarine. A torpedo travels through the water to hit an enemy ship. When not on a mission, nine sailors slept on bunks right next to the torpedoes — there was barely any room!",
        "quiz": {
            "question": "How many torpedo tubes are at the bow (front) of HMS Alliance?",
            "options": ["Two", "Four", "Six"]
        }
    },
    {
        "number": 3,
        "name": "The Periscope",
        "location": "HMS Alliance — Control Room / Conning Tower",
        "fact": "A periscope uses mirrors placed at 45-degree angles to bend light around corners. When the submarine is just under the surface, the captain raises the periscope to look around — but only for a very short time, because the enemy could spot it sticking out of the water!",
        "quiz": {
            "question": "What does a periscope use to bend light so the captain can see above the water?",
            "options": ["Lenses only", "Mirrors at 45 degrees", "A camera"]
        }
    },
    {
        "number": 4,
        "name": "The Helm",
        "location": "HMS Alliance — Control Room",
        "fact": "A submarine steers left and right with a rudder, just like a ship. But it also needs to go up and down underwater! It does this using special fins called hydroplanes, and by filling tanks with water to sink, or pumping water out to rise.",
        "quiz": {
            "question": "What are the fins called that control how deep a submarine goes?",
            "options": ["Rudders", "Hydroplanes", "Stabilisers"]
        }
    },
    {
        "number": 5,
        "name": "The Galley",
        "location": "HMS Alliance — Midships",
        "fact": "The cook on HMS Alliance had one of the hardest jobs on the submarine — cooking three meals a day for 65 people in a tiny kitchen! Everything had to be fixed down so it would not fly around when the submarine moved. Hot food was very important for keeping the crew happy.",
        "quiz": {
            "question": "How many crew members did the galley on HMS Alliance have to feed?",
            "options": ["25", "45", "65"]
        }
    },
    {
        "number": 6,
        "name": "The Engine Room",
        "location": "HMS Alliance — Aft Section",
        "fact": "HMS Alliance has two types of engine that work as a team. On the surface it uses a diesel engine to charge up huge batteries. When it dives underwater it switches to silent electric motors — because diesel engines need air to work, and there is no fresh air underwater!",
        "quiz": {
            "question": "Why cannot HMS Alliance use its diesel engine when it is underwater?",
            "options": ["It is too noisy", "Diesel engines need air to work", "The water would damage it"]
        }
    },
    {
        "number": 7,
        "name": "Holland I",
        "location": "Holland I Exhibition Building",
        "fact": "Holland I was the Royal Navy's very first submarine, built in 1901. It was designed by an Irish-American engineer called John Philip Holland — who had originally invented the submarine to fight against Britain! It sank in 1913 and was found on the seabed 70 years later.",
        "quiz": {
            "question": "Who designed Holland I, the Royal Navy's very first submarine?",
            "options": ["A British naval engineer", "John Philip Holland — an Irish-American engineer", "A German engineer"]
        }
    },
    {
        "number": 8,
        "name": "X24 Midget Submarine",
        "location": "Main Museum Gallery — Silent & Secret",
        "fact": "X24 is a midget submarine so small that only 4 sailors could squeeze inside. In 1944 it went on a secret mission into an enemy harbour in Norway and used special charges to destroy a German dock that was repairing enemy submarines. The crew were incredibly brave.",
        "quiz": {
            "question": "How many crew members could fit inside the X24 midget submarine?",
            "options": ["2", "4", "8"]
        }
    },
]

local_facts = [
    {
        "id": "f1",
        "title": "World's Only Sub on Land",
        "text": "HMS Alliance, built in 1945, is the world's only intact World War II-era British submarine still preserved on land. It weighs 1,620 tonnes and stretches 83 metres from bow to stern — longer than a football pitch! You can walk inside it at the Royal Navy Submarine Museum, right here in Gosport.",
        "q": "What makes HMS Alliance at the Royal Navy Submarine Museum so special?",
        "options": {"A": "It is the world's fastest submarine ever built", "B": "It is the world's only intact WWII-era British submarine preserved on land", "C": "It was the very first submarine ever invented", "D": "It sailed around the world without stopping"}
    },
    {
        "id": "f2",
        "title": "Royal Hospital Haslar",
        "text": "Royal Hospital Haslar in Gosport was Britain's first purpose-built naval hospital, opening its doors in 1762. Over more than 200 years it cared for over 100,000 sailors, including men wounded at the Battle of Trafalgar in 1805. It finally closed as a hospital in 2009 — after 247 years of service!",
        "q": "In what year did Royal Hospital Haslar first open?",
        "options": {"A": "1642", "B": "1762", "C": "1862", "D": "1962"}
    },
    {
        "id": "f3",
        "title": "Britain's Hovercraft Museum",
        "text": "The Hovercraft Museum in Lee-on-Solent, just 3 miles from Gosport, holds the world's largest collection of hovercraft. A hovercraft travels on a cushion of air — powerful fans blow air downward and a rubber skirt traps it underneath the vehicle, lifting it off the ground. This means a hovercraft can glide over water, mud, and land!",
        "q": "How does a hovercraft stay off the ground?",
        "options": {"A": "It uses very powerful wheels to bounce along", "B": "It flies like a helicopter using spinning blades", "C": "It floats on a cushion of trapped air held by a rubber skirt", "D": "It uses magnets to push away from the ground"}
    },
    {
        "id": "f4",
        "title": "Gosport Ferry — 160 Years",
        "text": "The Gosport Ferry has been crossing the short stretch of water between Gosport and Portsmouth since 1865 — over 160 years! It is one of the busiest foot passenger ferry services in the whole of the UK. The crossing takes just 3 minutes but saves passengers a 12-mile drive all the way around the harbour.",
        "q": "How long has the Gosport Ferry been running between Gosport and Portsmouth?",
        "options": {"A": "About 50 years", "B": "About 100 years", "C": "Over 160 years", "D": "Over 300 years"}
    },
    {
        "id": "f5",
        "title": "Explosion! Museum",
        "text": "Explosion! Museum at Priddy's Hard in Gosport has 300 years of Royal Navy weapons history. Priddy's Hard was once a secret gunpowder store where thousands of barrels of explosives were kept to supply Royal Navy warships. It was so secret that it did not appear on maps! Today it is a museum where you can discover the history of naval warfare.",
        "q": "What was Priddy's Hard originally used for?",
        "options": {"A": "Building Royal Navy warships", "B": "Training Royal Navy divers", "C": "Storing gunpowder and explosives for the Royal Navy", "D": "Making uniforms for sailors"}
    },
    {
        "id": "f6",
        "title": "Stokes Bay — D-Day 1944",
        "text": "In June 1944, thousands of Allied soldiers gathered at Stokes Bay in Gosport before boarding landing craft to cross the English Channel. This was part of Operation Overlord — the D-Day landings — the largest sea invasion in history. It was a turning point in World War II and helped defeat Nazi Germany. The beach at Stokes Bay looks peaceful today, but it witnessed one of the most important moments in modern history.",
        "q": "Which major World War II operation launched from Stokes Bay in Gosport?",
        "options": {"A": "The Battle of Britain", "B": "Operation Overlord — the D-Day landings", "C": "The evacuation of Dunkirk", "D": "The Battle of the Atlantic"}
    },
]

daily_challenges = [
    {"id": 0, "q": "If you have 3 bags with 4 apples in each bag, how many apples do you have altogether?", "options": ["8", "10", "12", "14"], "fact": "Farmers in the UK grow over 2,000 varieties of apple — but only about 70 kinds are sold in shops! The rest have brilliant names like \"Bloody Ploughman\" and \"Slack-ma-Girdle\"."},
    {"id": 1, "q": "Which of these numbers is the odd one out — 2, 4, 7, 8?", "options": ["2", "4", "7", "8"], "fact": "7 is the most popular \"favourite number\" in the world! More people choose 7 than any other number. Nobody is quite sure why — mathematicians find this very strange."},
    {"id": 2, "q": "What is half of 20?", "options": ["5", "8", "10", "15"], "fact": "The word \"half\" comes from an Old English word meaning \"side\" — so half literally means one side of something split in two. English has been using this word for over 1,000 years!"},
    {"id": 3, "q": "What is 7 × 8?", "options": ["54", "56", "48", "63"], "fact": "7 × 8 = 56, and 56 is called a \"pronic number\" — the product of two consecutive numbers (7 and 8). Mathematicians have given special names to thousands of different types of numbers!"},
    {"id": 4, "q": "Which of these fractions is the biggest?", "options": ["1/3", "1/4", "1/5", "1/2"], "fact": "Fractions were used in Ancient Egypt over 4,000 years ago — but Egyptian mathematicians only ever used fractions with 1 on top, like 1/2 or 1/3. They never wrote fractions like 3/4!"},
    {"id": 5, "q": "A rectangle is 8cm long and 5cm wide. What is its area?", "options": ["13cm²", "26cm²", "40cm²", "45cm²"], "fact": "Ancient Roman tax collectors used area mathematics to calculate land ownership and tax bills — maths has always had real-world power!"},
    {"id": 6, "q": "Which word rhymes with \"cat\"?", "options": ["dog", "bat", "fish", "sun"], "fact": "English has more rhyming words than almost any other language — one reason why English nursery rhymes and poetry are so rich!"},
    {"id": 7, "q": "Which of these is a noun — run, beautiful, cat, quickly?", "options": ["run", "beautiful", "cat", "quickly"], "fact": "The word \"cat\" has barely changed in over 1,000 years of English. \"Selfie,\" on the other hand, only entered the dictionary in 2013!"},
    {"id": 8, "q": "How many syllables does the word \"elephant\" have?", "options": ["1", "2", "3", "4"], "fact": "The word \"elephant\" comes from a Greek word meaning \"ivory\" — because elephant tusks were the main source of ivory in the ancient world."},
    {"id": 9, "q": "Which of these is the correct spelling?", "options": ["Beutiful", "Beautifull", "Beautiful", "Beautifall"], "fact": "A handy memory trick: think of the phrase \"Big Elephants Are Usually Tiny If For Underdogs Love\" — the first letters spell B-E-A-U-T-I-F-U-L!"},
    {"id": 10, "q": "What type of word is \"quickly\" in the sentence: \"She ran quickly to school\"?", "options": ["noun", "adjective", "verb", "adverb"], "fact": "The suffix \"-ly\" used to make adverbs comes from Old English \"-lice\" meaning \"in the manner of\" — it has been part of English for over 1,200 years."},
    {"id": 11, "q": "Which punctuation mark joins two related sentences without using a full stop?", "options": ["comma", "colon", "semicolon", "dash"], "fact": "The semicolon was first used in print in Venice in 1494 by the brilliant Italian printer Aldus Manutius — the same man who invented italic typeface and the pocket-sized book!"},
    {"id": 12, "q": "Which of the following is a mammal?", "options": ["shark", "goldfish", "eagle", "dolphin"], "fact": "Dolphins are so intelligent they have been observed giving each other names — each dolphin has its own unique whistle that acts like a name, and other dolphins use it to get their attention!"},
    {"id": 13, "q": "Which planet is closest to the Sun?", "options": ["Earth", "Venus", "Mars", "Mercury"], "fact": "Even though Mercury is closest to the Sun, it is NOT the hottest planet — Venus is! Venus has a thick atmosphere that traps heat like a blanket. Mercury has almost no atmosphere at all."},
    {"id": 14, "q": "What do plants breathe in that humans breathe out?", "options": ["oxygen", "nitrogen", "carbon dioxide", "hydrogen"], "fact": "Trees are partly made from air! They absorb carbon dioxide and use it to grow their leaves, trunk, and branches — air that was once inside someone's lungs becomes part of a tree!"},
    {"id": 15, "q": "Why does ice float on water instead of sinking?", "options": ["It is lighter than liquid water", "It is heavier than liquid water", "It has more salt", "It is magnetic"], "fact": "Water is the only common substance where the solid form floats on the liquid — almost everything else sinks when it freezes. This quirk of water is one of the reasons life on Earth can exist!"},
    {"id": 16, "q": "Which of these materials is a good conductor of electricity?", "options": ["rubber", "wood", "copper", "plastic"], "fact": "Copper helped power the world's first public electricity station — the Holborn Viaduct station in the City of London, which lit up the streets in January 1882!"},
    {"id": 17, "q": "What force keeps the Moon in orbit around the Earth?", "options": ["magnetism", "friction", "gravity", "air resistance"], "fact": "Isaac Newton developed his theory of gravity after an apple fell in his orchard in Woolsthorpe, Lincolnshire — and the original apple tree still stands today!"},
    {"id": 18, "q": "What is the capital city of Scotland?", "options": ["Glasgow", "Aberdeen", "Edinburgh", "Dundee"], "fact": "Edinburgh Castle is built on top of an ancient extinct volcano called Castle Rock — the city literally grew around a volcano!"},
    {"id": 19, "q": "Which is the longest river in the UK?", "options": ["River Thames", "River Severn", "River Trent", "River Avon"], "fact": "The Severn has one of the most dramatic tidal bores in the world — the tide can rise by up to 15 metres in a single day. Surfers actually ride the Severn Bore wave upstream!"},
    {"id": 20, "q": "How many countries make up the United Kingdom?", "options": ["2", "3", "4", "5"], "fact": "Each of the four nations has its own flower symbol: a rose for England, a daffodil for Wales, a thistle for Scotland, and a shamrock for Northern Ireland."},
    {"id": 21, "q": "Which ocean lies to the west of the United Kingdom?", "options": ["Pacific Ocean", "Indian Ocean", "Arctic Ocean", "Atlantic Ocean"], "fact": "The Atlantic Ocean grows about 2.5cm wider every year — roughly the same speed as your fingernails grow. In 100 million years it will be twice as wide!"},
    {"id": 22, "q": "Which is the largest country in the world by land area?", "options": ["China", "USA", "Canada", "Russia"], "fact": "Russia is so huge it spans 11 different time zones — when it is midnight in one part of Russia, it is already 11am the next day in another part!"},
    {"id": 23, "q": "Which of these is a source of renewable energy?", "options": ["coal", "natural gas", "wind", "oil"], "fact": "On very windy days, the United Kingdom's wind turbines sometimes generate more electricity than the whole country needs at that moment — the extra power has to be stored or shared with neighbouring countries!"},
    {"id": 24, "q": "How many colours are in a rainbow?", "options": ["5", "6", "7", "8"], "fact": "Bees can see ultraviolet light — a colour humans cannot see at all! Flowers have hidden patterns and colours in ultraviolet that only bees and some other insects can spot."},
    {"id": 25, "q": "What do you call a group of fish swimming together?", "options": ["a pack", "a flock", "a shoal", "a herd"], "fact": "Fish can turn together in a split second because they have a special organ called a \"lateral line\" that runs along their side and senses vibrations in the water from nearby fish!"},
    {"id": 26, "q": "Which is the odd one out: triangle, circle, square, cube?", "options": ["triangle", "circle", "square", "cube"], "fact": "For any 3D shape, if you count the faces, add the corners (vertices), then subtract the edges, the answer is always 2. This discovery was made by a Swiss mathematician called Leonhard Euler!"},
    {"id": 27, "q": "Who invented the World Wide Web?", "options": ["Bill Gates", "Steve Jobs", "Sir Tim Berners-Lee", "Alan Turing"], "fact": "Sir Tim Berners-Lee invented the World Wide Web in 1989 and gave it to the world for free — without his generosity, the internet as we know it today might have been owned by a private company!"},
    {"id": 28, "q": "Which is the oldest: the Eiffel Tower, the Great Wall of China, Stonehenge, or Big Ben?", "options": ["The Eiffel Tower", "The Great Wall of China", "Stonehenge", "Big Ben"], "fact": "Stonehenge is around 5,000 years old — it was already ancient when the Great Pyramid of Giza was built, and the Romans had not yet been born when its builders finished their work!"},
    {"id": 29, "q": "What is the real name of the famous clock tower at the Houses of Parliament in London?", "options": ["Big Ben", "The Victoria Tower", "The Elizabeth Tower", "The Westminster Tower"], "fact": "The real \"Big Ben\" is not the tower — it's the enormous 13.7 tonne bell inside it! The tower was renamed the Elizabeth Tower in 2012 to honour Queen Elizabeth II's Diamond Jubilee."},
]

def generate_patch(lang):
    patch = {}
    
    # Child Quiz
    for q in quiz_questions:
        patch[f"qcontent_{q['id']}_q"] = q['q']
        for i, opt in enumerate(q['options']):
            patch[f"qcontent_{q['id']}_o{i}"] = opt

    # Parent Modules
    for m in module_a:
        patch[f"acontent_a_{m['id']}_title"] = m['title']
        patch[f"acontent_a_{m['id']}_desc"] = m['description']
        patch[f"acontent_a_{m['id']}_format"] = m['format']
    for m in module_b:
        patch[f"acontent_b_{m['id']}_title"] = m['title']
        patch[f"acontent_b_{m['id']}_desc"] = m['description']
        patch[f"acontent_b_{m['id']}_format"] = m.get('format', '')
    for m in module_c:
        patch[f"acontent_c_{m['id']}_title"] = m['title']
        patch[f"acontent_c_{m['id']}_desc"] = m.get('description', '')
        patch[f"acontent_c_{m['id']}_format"] = m['format']
    for m in module_d:
        patch[f"acontent_d_{m['id']}_title"] = m['title']
        patch[f"acontent_d_{m['id']}_desc"] = m['description']
        patch[f"acontent_d_{m['id']}_format"] = m.get('format', '')

    # Parent Tiers
    for t in parent_tiers:
        patch[f"acontent_tier_{t['tier']}_label"] = t['label']
        patch[f"acontent_tier_{t['tier']}_req"] = t['requirement']

    # Parent Quizzes
    for i, q in enumerate(spelling_quiz):
        patch[f"apquiz_spelling_{i}_q"] = q['q']
        for j, opt in enumerate(q['options']):
            patch[f"apquiz_spelling_{i}_o{j}"] = opt
    for i, q in enumerate(gk_quiz):
        patch[f"apquiz_gk_{i}_q"] = q['q']
        for j, opt in enumerate(q['options']):
            patch[f"apquiz_gk_{i}_o{j}"] = opt
    for i, q in enumerate(maths_quiz):
        patch[f"apquiz_maths_{i}_q"] = q['q']
        for j, opt in enumerate(q['options']):
            patch[f"apquiz_maths_{i}_o{j}"] = opt

    # Reading Tip Article
    patch["article_reading_title"] = reading_article["title"]
    patch["article_reading_p1"] = reading_article["body"][0]
    patch["article_reading_p2"] = reading_article["body"][1]
    patch["article_reading_p3"] = reading_article["body"][2]
    for i, q in enumerate(reading_article["questions"]):
        patch[f"article_reading_q{i+1}_q"] = q["q"]
        for j, opt in enumerate(q["options"]):
            patch[f"article_reading_q{i+1}_o{j}"] = opt

    # Adventure Trail
    for s in trail_stops:
        patch[f"tcontent_s{s['number']}_name"] = s['name']
        patch[f"tcontent_s{s['number']}_fact"] = s['fact']
        patch[f"tcontent_s{s['number']}_q"] = s['quiz']['question']
        for i, opt in enumerate(s['quiz']['options']):
            patch[f"tcontent_s{s['number']}_o{i}"] = opt

    # Local Facts
    for i, f in enumerate(local_facts):
        num = i + 1
        patch[f"lcontent_f{num}_title"] = f['title']
        patch[f"lcontent_f{num}_text"] = f['text']
        patch[f"lcontent_f{num}_q"] = f['q']
        patch[f"lcontent_f{num}_oA"] = f['options']['A']
        patch[f"lcontent_f{num}_oB"] = f['options']['B']
        patch[f"lcontent_f{num}_oC"] = f['options']['C']
        patch[f"lcontent_f{num}_oD"] = f['options']['D']

    # Daily Challenges
    for d in daily_challenges:
        patch[f"dcontent_{d['id']}_q"] = d['q']
        for i, opt in enumerate(d['options']):
            patch[f"dcontent_{d['id']}_o{i}"] = opt
        patch[f"dcontent_{d['id']}_fact"] = d['fact']

    return patch

# I will now manually translate the most important parts or provide a skeleton for the agent to complete.
# Since I am the agent, I will perform the translations.

def translate_patch(patch, lang):
    # This is a placeholder for the actual translation logic.
    # In a real scenario, I would iterate through all keys and translate them.
    # For this task, I will provide the full translated objects.
    pass

# I'll just write the final file directly from Python.
patch_en = generate_patch("en")

# For other languages, I will need to translate the values.
# I will do this in the next step.

with open("patch_en.json", "w") as f:
    json.dump(patch_en, f, indent=2)
