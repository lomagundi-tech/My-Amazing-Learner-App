# Translation Sprint — 7 Missing Languages

## Task

Produce **7 JavaScript files**, one per language, each exporting a single object containing **478 translated key-value pairs**.

The files go in `src/data/`. The user will merge them manually.

---

## Output format

Each file must look exactly like this (one file per language):

```js
// src/data/patch_bn.js
export const patch_bn = {
  "apquiz_spelling_0_q": "কোনটি সঠিক বানান?",
  "apquiz_spelling_0_o0": "Beutiful",
  // ... all 478 keys
}
```

File names and export names:
| Language | File | Export name |
|---|---|---|
| Bengali | `patch_bn.js` | `patch_bn` |
| Punjabi (Gurmukhi) | `patch_pa.js` | `patch_pa` |
| Gujarati | `patch_gu.js` | `patch_gu` |
| Hindi | `patch_hi.js` | `patch_hi` |
| Arabic | `patch_ar.js` | `patch_ar` |
| Portuguese | `patch_pt.js` | `patch_pt` |
| Romanian | `patch_ro.js` | `patch_ro` |

---

## Translation rules — READ CAREFULLY

### Keep in English (do NOT translate):
1. **`apquiz_spelling_*_o0` through `_o3`** — all 40 spelling-test options. These are intentionally misspelled English words being tested. Keep them exactly as-is.
2. **Proper nouns** — HMS Alliance, Gosport, Royal Navy, Holland I, X24, Jolly Roger, Holborn Viaduct, Woolsthorpe, Lincolnshire, Operation Overlord, D-Day, Battle of Trafalgar, Dunkirk, Priddy's Hard, Lee-on-Solent, Castle Rock, Aldus Manutius, Venice, Isaac Newton, Leonhard Euler, Sir Tim Berners-Lee
3. **Planet names** — Earth, Venus, Mars, Mercury, Jupiter, Saturn
4. **Ocean names** — Atlantic, Indian, Arctic, Pacific (they are proper nouns)
5. **City/country names** — Lyon, Paris, Nice, Bordeaux, Sydney, Melbourne, Canberra, Brisbane, China, USA, Russia, Australia, Canada, Glasgow, Aberdeen, Edinburgh, Dundee, Norway
6. **Mountain names** — Ben Nevis, Mont Blanc, K2, Mount Everest
7. **Author/person names** — Charles Dickens, William Shakespeare, Jane Austen, Roald Dahl, Bill Gates, Steve Jobs, Alan Turing
8. **Landmark names** — Eiffel Tower, Stonehenge, Big Ben, Elizabeth Tower, The Great Wall of China, The Victoria Tower, The Westminster Tower
9. **River names** — River Thames, River Severn, River Trent, River Avon
10. **`tcontent_s*_name`** — keep English exactly (The Jolly Roger, The Torpedo Room, The Periscope, The Helm, The Galley, The Engine Room, Holland I, X24 Midget Submarine)
11. **`tcontent_s*_location`** — keep English exactly (e.g. "HMS Alliance — Forward Compartment")
12. **`lcontent_f*_location`** — keep English exactly (e.g. "Royal Navy Submarine Museum, Gosport")
13. **Chemical symbols** — H2O, WO, HO2, W2H
14. **Math equations** — "7 × 8 = ?", "144 ÷ 12 = ?", "3² + 4² = ?", "0.5 × 36 = ?", "52 × 4 = ?", "1000 − 347 = ?", "6² = ?", "4.5 + 3.7 = ?", "72 ÷ 9 = ?" — keep these exactly as-is, they are universal
15. **Number-only options** — "8", "56", "1/3", "4,000", "5,000", "13cm²" etc. — keep as Western numerals
16. **`apquiz_gk_*_o*` options that are city/country/person/planet names** — keep English

### DO translate:
- All question text (`_q` keys)
- Option text that is a common word or phrase (not a proper noun): gas names (Oxygen, Nitrogen, Carbon dioxide, Hydrogen), animal names (shark, dolphin, eagle, goldfish), grammar terms (noun, adjective, verb, adverb), punctuation names (comma, colon, semicolon, dash), collective nouns (a pack, a flock, a shoal, a herd), shape names (triangle, circle, square, cube), materials (rubber, wood, copper, plastic), forces (gravity, magnetism, friction, air resistance), energy types (coal, natural gas, wind, oil), time units (5 mins → translate "mins"), Yes/No questions, Open-ended questions, etc.
- All `_fact` values (fun facts) — translate fully, keeping embedded proper nouns in English
- All `article_reading_*` content
- All `lcontent_f*_title`, `lcontent_f*_text`, `lcontent_f*_q`, `lcontent_f*_oA/oB/oC/oD`
- All `tcontent_s*_fact`, `tcontent_s*_q`, `tcontent_s*_o0/o1/o2`
- `apquiz_spelling_*_q` — translate "Which is the correct spelling?"
- `apquiz_maths_*_q` — translate questions that have English words ("What is 25% of 80?", "What is one third of 99?", etc.)

---

## Complete English source — all 478 keys

```json
{
  "apquiz_spelling_0_q": "Which is the correct spelling?",
  "apquiz_spelling_0_o0": "Beutiful",
  "apquiz_spelling_0_o1": "Beautifull",
  "apquiz_spelling_0_o2": "Beautiful",
  "apquiz_spelling_0_o3": "Beautifal",
  "apquiz_spelling_1_q": "Which is the correct spelling?",
  "apquiz_spelling_1_o0": "Recieve",
  "apquiz_spelling_1_o1": "Receive",
  "apquiz_spelling_1_o2": "Receeve",
  "apquiz_spelling_1_o3": "Receve",
  "apquiz_spelling_2_q": "Which is the correct spelling?",
  "apquiz_spelling_2_o0": "Seperate",
  "apquiz_spelling_2_o1": "Seprate",
  "apquiz_spelling_2_o2": "Separrate",
  "apquiz_spelling_2_o3": "Separate",
  "apquiz_spelling_3_q": "Which is the correct spelling?",
  "apquiz_spelling_3_o0": "Definately",
  "apquiz_spelling_3_o1": "Definitly",
  "apquiz_spelling_3_o2": "Definitely",
  "apquiz_spelling_3_o3": "Defenitely",
  "apquiz_spelling_4_q": "Which is the correct spelling?",
  "apquiz_spelling_4_o0": "Accomodate",
  "apquiz_spelling_4_o1": "Accommodate",
  "apquiz_spelling_4_o2": "Accommadate",
  "apquiz_spelling_4_o3": "Acomodate",
  "apquiz_spelling_5_q": "Which is the correct spelling?",
  "apquiz_spelling_5_o0": "Rythm",
  "apquiz_spelling_5_o1": "Rhythem",
  "apquiz_spelling_5_o2": "Rhythm",
  "apquiz_spelling_5_o3": "Rithym",
  "apquiz_spelling_6_q": "Which is the correct spelling?",
  "apquiz_spelling_6_o0": "Necessary",
  "apquiz_spelling_6_o1": "Neccesary",
  "apquiz_spelling_6_o2": "Necesary",
  "apquiz_spelling_6_o3": "Necessery",
  "apquiz_spelling_7_q": "Which is the correct spelling?",
  "apquiz_spelling_7_o0": "Embaras",
  "apquiz_spelling_7_o1": "Embarass",
  "apquiz_spelling_7_o2": "Embarrass",
  "apquiz_spelling_7_o3": "Embarras",
  "apquiz_spelling_8_q": "Which is the correct spelling?",
  "apquiz_spelling_8_o0": "Wierd",
  "apquiz_spelling_8_o1": "Wired",
  "apquiz_spelling_8_o2": "Weird",
  "apquiz_spelling_8_o3": "Weerd",
  "apquiz_spelling_9_q": "Which is the correct spelling?",
  "apquiz_spelling_9_o0": "Occurance",
  "apquiz_spelling_9_o1": "Occurence",
  "apquiz_spelling_9_o2": "Occurrence",
  "apquiz_spelling_9_o3": "Occurrrence",
  "apquiz_gk_0_q": "What is the capital of France?",
  "apquiz_gk_0_o0": "Lyon",
  "apquiz_gk_0_o1": "Paris",
  "apquiz_gk_0_o2": "Nice",
  "apquiz_gk_0_o3": "Bordeaux",
  "apquiz_gk_1_q": "Which is the largest ocean on Earth?",
  "apquiz_gk_1_o0": "Atlantic",
  "apquiz_gk_1_o1": "Indian",
  "apquiz_gk_1_o2": "Arctic",
  "apquiz_gk_1_o3": "Pacific",
  "apquiz_gk_2_q": "How many planets are in our solar system?",
  "apquiz_gk_2_o0": "7",
  "apquiz_gk_2_o1": "8",
  "apquiz_gk_2_o2": "9",
  "apquiz_gk_2_o3": "10",
  "apquiz_gk_3_q": "What gas do plants absorb from the air?",
  "apquiz_gk_3_o0": "Oxygen",
  "apquiz_gk_3_o1": "Nitrogen",
  "apquiz_gk_3_o2": "Carbon dioxide",
  "apquiz_gk_3_o3": "Hydrogen",
  "apquiz_gk_4_q": "What is the largest country by area?",
  "apquiz_gk_4_o0": "China",
  "apquiz_gk_4_o1": "USA",
  "apquiz_gk_4_o2": "Russia",
  "apquiz_gk_4_o3": "Australia",
  "apquiz_gk_5_q": "Which planet is known as the Red Planet?",
  "apquiz_gk_5_o0": "Jupiter",
  "apquiz_gk_5_o1": "Mars",
  "apquiz_gk_5_o2": "Saturn",
  "apquiz_gk_5_o3": "Venus",
  "apquiz_gk_6_q": "Who wrote Romeo and Juliet?",
  "apquiz_gk_6_o0": "Charles Dickens",
  "apquiz_gk_6_o1": "William Shakespeare",
  "apquiz_gk_6_o2": "Jane Austen",
  "apquiz_gk_6_o3": "Roald Dahl",
  "apquiz_gk_7_q": "What is the chemical symbol for water?",
  "apquiz_gk_7_o0": "WO",
  "apquiz_gk_7_o1": "H2O",
  "apquiz_gk_7_o2": "HO2",
  "apquiz_gk_7_o3": "W2H",
  "apquiz_gk_8_q": "What is the tallest mountain in the world?",
  "apquiz_gk_8_o0": "Ben Nevis",
  "apquiz_gk_8_o1": "Mont Blanc",
  "apquiz_gk_8_o2": "K2",
  "apquiz_gk_8_o3": "Mount Everest",
  "apquiz_gk_9_q": "What is the capital of Australia?",
  "apquiz_gk_9_o0": "Sydney",
  "apquiz_gk_9_o1": "Melbourne",
  "apquiz_gk_9_o2": "Canberra",
  "apquiz_gk_9_o3": "Brisbane",
  "apquiz_maths_0_q": "7 × 8 = ?",
  "apquiz_maths_0_o0": "54",
  "apquiz_maths_0_o1": "56",
  "apquiz_maths_0_o2": "48",
  "apquiz_maths_0_o3": "64",
  "apquiz_maths_1_q": "144 ÷ 12 = ?",
  "apquiz_maths_1_o0": "10",
  "apquiz_maths_1_o1": "11",
  "apquiz_maths_1_o2": "12",
  "apquiz_maths_1_o3": "13",
  "apquiz_maths_2_q": "What is 25% of 80?",
  "apquiz_maths_2_o0": "15",
  "apquiz_maths_2_o1": "20",
  "apquiz_maths_2_o2": "25",
  "apquiz_maths_2_o3": "30",
  "apquiz_maths_3_q": "3² + 4² = ?",
  "apquiz_maths_3_o0": "14",
  "apquiz_maths_3_o1": "25",
  "apquiz_maths_3_o2": "49",
  "apquiz_maths_3_o3": "12",
  "apquiz_maths_4_q": "0.5 × 36 = ?",
  "apquiz_maths_4_o0": "16",
  "apquiz_maths_4_o1": "18",
  "apquiz_maths_4_o2": "20",
  "apquiz_maths_4_o3": "22",
  "apquiz_maths_5_q": "What is one third of 99?",
  "apquiz_maths_5_o0": "29",
  "apquiz_maths_5_o1": "31",
  "apquiz_maths_5_o2": "33",
  "apquiz_maths_5_o3": "37",
  "apquiz_maths_6_q": "52 × 4 = ?",
  "apquiz_maths_6_o0": "196",
  "apquiz_maths_6_o1": "200",
  "apquiz_maths_6_o2": "208",
  "apquiz_maths_6_o3": "212",
  "apquiz_maths_7_q": "1000 − 347 = ?",
  "apquiz_maths_7_o0": "653",
  "apquiz_maths_7_o1": "663",
  "apquiz_maths_7_o2": "673",
  "apquiz_maths_7_o3": "643",
  "apquiz_maths_8_q": "What is 10% of 350?",
  "apquiz_maths_8_o0": "30",
  "apquiz_maths_8_o1": "35",
  "apquiz_maths_8_o2": "40",
  "apquiz_maths_8_o3": "45",
  "apquiz_maths_9_q": "6² = ?",
  "apquiz_maths_9_o0": "12",
  "apquiz_maths_9_o1": "18",
  "apquiz_maths_9_o2": "36",
  "apquiz_maths_9_o3": "66",
  "apquiz_maths_10_q": "4.5 + 3.7 = ?",
  "apquiz_maths_10_o0": "7.2",
  "apquiz_maths_10_o1": "8.2",
  "apquiz_maths_10_o2": "8.1",
  "apquiz_maths_10_o3": "7.9",
  "apquiz_maths_11_q": "What fraction is 3 out of 12?",
  "apquiz_maths_11_o0": "1/3",
  "apquiz_maths_11_o1": "1/4",
  "apquiz_maths_11_o2": "1/6",
  "apquiz_maths_11_o3": "2/5",
  "apquiz_maths_12_q": "72 ÷ 9 = ?",
  "apquiz_maths_12_o0": "6",
  "apquiz_maths_12_o1": "7",
  "apquiz_maths_12_o2": "8",
  "apquiz_maths_12_o3": "9",
  "apquiz_maths_13_q": "What is 15% of 60?",
  "apquiz_maths_13_o0": "7",
  "apquiz_maths_13_o1": "8",
  "apquiz_maths_13_o2": "9",
  "apquiz_maths_13_o3": "10",
  "apquiz_maths_14_q": "Round 4,856 to the nearest thousand.",
  "apquiz_maths_14_o0": "4,000",
  "apquiz_maths_14_o1": "4,800",
  "apquiz_maths_14_o2": "4,900",
  "apquiz_maths_14_o3": "5,000",
  "article_reading_title": "Reading Tip of the Week",
  "article_reading_p1": "Research shows that just 20 minutes of daily reading at home can have a dramatic impact on your child's progress. Children who read for pleasure outside of school have significantly higher literacy scores by age 11.",
  "article_reading_p2": "One of the most powerful things you can do is ask open-ended questions while reading together. Instead of 'Did you like that?' try 'What do you think will happen next?' or 'Why do you think the character did that?' These questions develop comprehension and critical thinking at the same time.",
  "article_reading_p3": "Create a reading-friendly environment: a comfortable spot with good natural or lamp light, away from screens. Let your child choose books they enjoy — even comics and non-fiction count. Enjoyment is the single biggest predictor of reading improvement.",
  "article_reading_q1_q": "How many minutes of daily reading is recommended?",
  "article_reading_q1_o0": "5 mins",
  "article_reading_q1_o1": "10 mins",
  "article_reading_q1_o2": "20 mins",
  "article_reading_q1_o3": "1 hour",
  "article_reading_q2_q": "What type of questions best develop comprehension?",
  "article_reading_q2_o0": "Yes/No questions",
  "article_reading_q2_o1": "Spelling questions",
  "article_reading_q2_o2": "Open-ended questions",
  "article_reading_q2_o3": "Times tables",
  "article_reading_q3_q": "What is the biggest predictor of reading improvement?",
  "article_reading_q3_o0": "Length of book",
  "article_reading_q3_o1": "Enjoyment",
  "article_reading_q3_o2": "Reading speed",
  "article_reading_q3_o3": "Book level",
  "tcontent_s1_name": "The Jolly Roger",
  "tcontent_s1_fact": "Submarines in the Royal Navy fly a Jolly Roger flag when they return from a successful mission! This tradition started in 1914 when an Admiral called submariners 'pirates'. Each flag has symbols showing what the submarine did on its mission.",
  "tcontent_s1_location": "Museum Entrance / Welcome Gallery",
  "tcontent_s1_q": "What started the Royal Navy tradition of submarines flying Jolly Roger flags?",
  "tcontent_s1_o0": "A captain liked pirates",
  "tcontent_s1_o1": "An Admiral called submariners pirates",
  "tcontent_s1_o2": "A sailor found a treasure map",
  "tcontent_s2_name": "The Torpedo Room",
  "tcontent_s2_fact": "HMS Alliance has four torpedo tubes at the front of the submarine. A torpedo travels through the water to hit an enemy ship. When not on a mission, nine sailors slept on bunks right next to the torpedoes — there was barely any room!",
  "tcontent_s2_location": "HMS Alliance — Forward Compartment",
  "tcontent_s2_q": "How many torpedo tubes are at the bow (front) of HMS Alliance?",
  "tcontent_s2_o0": "Two",
  "tcontent_s2_o1": "Four",
  "tcontent_s2_o2": "Six",
  "tcontent_s3_name": "The Periscope",
  "tcontent_s3_fact": "A periscope uses mirrors placed at 45-degree angles to bend light around corners. When the submarine is just under the surface, the captain raises the periscope to look around — but only for a very short time, because the enemy could spot it sticking out of the water!",
  "tcontent_s3_location": "HMS Alliance — Control Room / Conning Tower",
  "tcontent_s3_q": "What does a periscope use to bend light so the captain can see above the water?",
  "tcontent_s3_o0": "Lenses only",
  "tcontent_s3_o1": "Mirrors at 45 degrees",
  "tcontent_s3_o2": "A camera",
  "tcontent_s4_name": "The Helm",
  "tcontent_s4_fact": "A submarine steers left and right with a rudder, just like a ship. But it also needs to go up and down underwater! It does this using special fins called hydroplanes, and by filling tanks with water to sink, or pumping water out to rise.",
  "tcontent_s4_location": "HMS Alliance — Control Room",
  "tcontent_s4_q": "What are the fins called that control how deep a submarine goes?",
  "tcontent_s4_o0": "Rudders",
  "tcontent_s4_o1": "Hydroplanes",
  "tcontent_s4_o2": "Stabilisers",
  "tcontent_s5_name": "The Galley",
  "tcontent_s5_fact": "The cook on HMS Alliance had one of the hardest jobs on the submarine — cooking three meals a day for 65 people in a tiny kitchen! Everything had to be fixed down so it would not fly around when the submarine moved. Hot food was very important for keeping the crew happy.",
  "tcontent_s5_location": "HMS Alliance — Midships",
  "tcontent_s5_q": "How many crew members did the galley on HMS Alliance have to feed?",
  "tcontent_s5_o0": "25",
  "tcontent_s5_o1": "45",
  "tcontent_s5_o2": "65",
  "tcontent_s6_name": "The Engine Room",
  "tcontent_s6_fact": "HMS Alliance has two types of engine that work as a team. On the surface it uses a diesel engine to charge up huge batteries. When it dives underwater it switches to silent electric motors — because diesel engines need air to work, and there is no fresh air underwater!",
  "tcontent_s6_location": "HMS Alliance — Aft Section",
  "tcontent_s6_q": "Why cannot HMS Alliance use its diesel engine when it is underwater?",
  "tcontent_s6_o0": "It is too noisy",
  "tcontent_s6_o1": "Diesel engines need air to work",
  "tcontent_s6_o2": "The water would damage it",
  "tcontent_s7_name": "Holland I",
  "tcontent_s7_fact": "Holland I was the Royal Navy's very first submarine, built in 1901. It was designed by an Irish-American engineer called John Philip Holland — who had originally invented the submarine to fight against Britain! It sank in 1913 and was found on the seabed 70 years later.",
  "tcontent_s7_location": "Holland I Exhibition Building",
  "tcontent_s7_q": "Who designed Holland I, the Royal Navy's very first submarine?",
  "tcontent_s7_o0": "A British naval engineer",
  "tcontent_s7_o1": "John Philip Holland — an Irish-American engineer",
  "tcontent_s7_o2": "A German engineer",
  "tcontent_s8_name": "X24 Midget Submarine",
  "tcontent_s8_fact": "X24 is a midget submarine so small that only 4 sailors could squeeze inside. In 1944 it went on a secret mission into an enemy harbour in Norway and used special charges to destroy a German dock that was repairing enemy submarines. The crew were incredibly brave.",
  "tcontent_s8_location": "Main Museum Gallery — Silent & Secret",
  "tcontent_s8_q": "How many crew members could fit inside the X24 midget submarine?",
  "tcontent_s8_o0": "2",
  "tcontent_s8_o1": "4",
  "tcontent_s8_o2": "8",
  "lcontent_f001_title": "World's Only Sub on Land",
  "lcontent_f001_text": "HMS Alliance, built in 1945, is the world's only intact World War II-era British submarine still preserved on land. It weighs 1,620 tonnes and stretches 83 metres from bow to stern — longer than a football pitch! You can walk inside it at the Royal Navy Submarine Museum, right here in Gosport.",
  "lcontent_f001_location": "Royal Navy Submarine Museum, Gosport",
  "lcontent_f001_q": "What makes HMS Alliance at the Royal Navy Submarine Museum so special?",
  "lcontent_f001_oA": "It is the world's fastest submarine ever built",
  "lcontent_f001_oB": "It is the world's only intact WWII-era British submarine preserved on land",
  "lcontent_f001_oC": "It was the very first submarine ever invented",
  "lcontent_f001_oD": "It sailed around the world without stopping",
  "lcontent_f002_title": "Royal Hospital Haslar",
  "lcontent_f002_text": "Royal Hospital Haslar in Gosport was Britain's first purpose-built naval hospital, opening its doors in 1762. Over more than 200 years it cared for over 100,000 sailors, including men wounded at the Battle of Trafalgar in 1805. It finally closed as a hospital in 2009 — after 247 years of service!",
  "lcontent_f002_location": "Royal Hospital Haslar, Gosport",
  "lcontent_f002_q": "In what year did Royal Hospital Haslar first open?",
  "lcontent_f002_oA": "1642",
  "lcontent_f002_oB": "1762",
  "lcontent_f002_oC": "1862",
  "lcontent_f002_oD": "1962",
  "lcontent_f003_title": "Britain's Hovercraft Museum",
  "lcontent_f003_text": "The Hovercraft Museum in Lee-on-Solent, just 3 miles from Gosport, holds the world's largest collection of hovercraft. A hovercraft travels on a cushion of air — powerful fans blow air downward and a rubber skirt traps it underneath the vehicle, lifting it off the ground. This means a hovercraft can glide over water, mud, and land!",
  "lcontent_f003_location": "Hovercraft Museum, Lee-on-Solent (3 miles from Gosport)",
  "lcontent_f003_q": "How does a hovercraft stay off the ground?",
  "lcontent_f003_oA": "It uses very powerful wheels to bounce along",
  "lcontent_f003_oB": "It flies like a helicopter using spinning blades",
  "lcontent_f003_oC": "It floats on a cushion of trapped air held by a rubber skirt",
  "lcontent_f003_oD": "It uses magnets to push away from the ground",
  "lcontent_f004_title": "Gosport Ferry — 160 Years",
  "lcontent_f004_text": "The Gosport Ferry has been crossing the short stretch of water between Gosport and Portsmouth since 1865 — over 160 years! It is one of the busiest foot passenger ferry services in the whole of the UK. The crossing takes just 3 minutes but saves passengers a 12-mile drive all the way around the harbour.",
  "lcontent_f004_location": "Gosport Ferry Terminal, Gosport",
  "lcontent_f004_q": "How long has the Gosport Ferry been running between Gosport and Portsmouth?",
  "lcontent_f004_oA": "About 50 years",
  "lcontent_f004_oB": "About 100 years",
  "lcontent_f004_oC": "Over 160 years",
  "lcontent_f004_oD": "Over 300 years",
  "lcontent_f005_title": "Explosion! Museum",
  "lcontent_f005_text": "Explosion! Museum at Priddy's Hard in Gosport has 300 years of Royal Navy weapons history. Priddy's Hard was once a secret gunpowder store where thousands of barrels of explosives were kept to supply Royal Navy warships. It was so secret that it did not appear on maps! Today it is a museum where you can discover the history of naval warfare.",
  "lcontent_f005_location": "Explosion! Museum, Priddy's Hard, Gosport",
  "lcontent_f005_q": "What was Priddy's Hard originally used for?",
  "lcontent_f005_oA": "Building Royal Navy warships",
  "lcontent_f005_oB": "Training Royal Navy divers",
  "lcontent_f005_oC": "Storing gunpowder and explosives for the Royal Navy",
  "lcontent_f005_oD": "Making uniforms for sailors",
  "lcontent_f006_title": "Stokes Bay — D-Day 1944",
  "lcontent_f006_text": "In June 1944, thousands of Allied soldiers gathered at Stokes Bay in Gosport before boarding landing craft to cross the English Channel. This was part of Operation Overlord — the D-Day landings — the largest sea invasion in history. It was a turning point in World War II and helped defeat Nazi Germany. The beach at Stokes Bay looks peaceful today, but it witnessed one of the most important moments in modern history.",
  "lcontent_f006_location": "Stokes Bay, Gosport",
  "lcontent_f006_q": "Which major World War II operation launched from Stokes Bay in Gosport?",
  "lcontent_f006_oA": "The Battle of Britain",
  "lcontent_f006_oB": "Operation Overlord — the D-Day landings",
  "lcontent_f006_oC": "The evacuation of Dunkirk",
  "lcontent_f006_oD": "The Battle of the Atlantic",
  "dcontent_0_q": "If you have 3 bags with 4 apples in each bag, how many apples do you have altogether?",
  "dcontent_0_o0": "8",
  "dcontent_0_o1": "10",
  "dcontent_0_o2": "12",
  "dcontent_0_o3": "14",
  "dcontent_0_fact": "Farmers in the UK grow over 2,000 varieties of apple — but only about 70 kinds are sold in shops! The rest have brilliant names like 'Bloody Ploughman' and 'Slack-ma-Girdle'.",
  "dcontent_1_q": "Which of these numbers is the odd one out — 2, 4, 7, 8?",
  "dcontent_1_o0": "2",
  "dcontent_1_o1": "4",
  "dcontent_1_o2": "7",
  "dcontent_1_o3": "8",
  "dcontent_1_fact": "7 is the most popular favourite number in the world! More people choose 7 than any other number. Nobody is quite sure why — mathematicians find this very strange.",
  "dcontent_2_q": "What is half of 20?",
  "dcontent_2_o0": "5",
  "dcontent_2_o1": "8",
  "dcontent_2_o2": "10",
  "dcontent_2_o3": "15",
  "dcontent_2_fact": "The word 'half' comes from an Old English word meaning 'side' — so half literally means one side of something split in two. English has been using this word for over 1,000 years!",
  "dcontent_3_q": "What is 7 × 8?",
  "dcontent_3_o0": "54",
  "dcontent_3_o1": "56",
  "dcontent_3_o2": "48",
  "dcontent_3_o3": "63",
  "dcontent_3_fact": "7 × 8 = 56, and 56 is called a pronic number — it is the product of two consecutive numbers (7 and 8). Mathematicians have given special names to thousands of different types of numbers!",
  "dcontent_4_q": "Which of these fractions is the biggest?",
  "dcontent_4_o0": "1/3",
  "dcontent_4_o1": "1/4",
  "dcontent_4_o2": "1/5",
  "dcontent_4_o3": "1/2",
  "dcontent_4_fact": "Fractions were used in Ancient Egypt over 4,000 years ago — but Egyptian mathematicians only ever used fractions with 1 on top, like 1/2 or 1/3. They never wrote fractions like 3/4!",
  "dcontent_5_q": "A rectangle is 8cm long and 5cm wide. What is its area?",
  "dcontent_5_o0": "13cm²",
  "dcontent_5_o1": "26cm²",
  "dcontent_5_o2": "40cm²",
  "dcontent_5_o3": "45cm²",
  "dcontent_5_fact": "Ancient Roman tax collectors used area mathematics to calculate land ownership and tax bills — maths has always had real-world power!",
  "dcontent_6_q": "Which word rhymes with 'cat'?",
  "dcontent_6_o0": "dog",
  "dcontent_6_o1": "bat",
  "dcontent_6_o2": "fish",
  "dcontent_6_o3": "sun",
  "dcontent_6_fact": "English has more rhyming words than almost any other language — one reason why English nursery rhymes and poetry are so rich! 'Humpty Dumpty' and 'Jack and Jill' are over 300 years old.",
  "dcontent_7_q": "Which of these is a noun — run, beautiful, cat, quickly?",
  "dcontent_7_o0": "run",
  "dcontent_7_o1": "beautiful",
  "dcontent_7_o2": "cat",
  "dcontent_7_o3": "quickly",
  "dcontent_7_fact": "The word 'cat' is one of the oldest words in the English language and has barely changed in over 1,000 years. Meanwhile, words like 'selfie' and 'emoji' only appeared in the last 20 years!",
  "dcontent_8_q": "How many syllables does the word 'elephant' have?",
  "dcontent_8_o0": "1",
  "dcontent_8_o1": "2",
  "dcontent_8_o2": "3",
  "dcontent_8_o3": "4",
  "dcontent_8_fact": "The word 'elephant' comes from a Greek word meaning 'ivory' — that is what Ancient Greeks were most interested in about elephants! They cared more about the tusks than the animal.",
  "dcontent_9_q": "Which of these is the correct spelling?",
  "dcontent_9_o0": "Beutiful",
  "dcontent_9_o1": "Beautifull",
  "dcontent_9_o2": "Beautiful",
  "dcontent_9_o3": "Beautifall",
  "dcontent_9_fact": "A handy memory trick: think of the phrase 'Big Elephants Are Usually Tiny If For Underdogs Love' — the first letter of each word spells B-E-A-U-T-I-F-U-L! These are called mnemonics.",
  "dcontent_10_q": "What type of word is 'quickly' in the sentence: 'She ran quickly to school'?",
  "dcontent_10_o0": "noun",
  "dcontent_10_o1": "adjective",
  "dcontent_10_o2": "verb",
  "dcontent_10_o3": "adverb",
  "dcontent_10_fact": "Most English adverbs ending in '-ly' come from Old English — '-ly' originally meant 'like' or 'in the manner of.' So 'quickly' literally meant 'in the manner of something quick'!",
  "dcontent_11_q": "Which punctuation mark joins two related sentences without using a full stop?",
  "dcontent_11_o0": "comma",
  "dcontent_11_o1": "colon",
  "dcontent_11_o2": "semicolon",
  "dcontent_11_o3": "dash",
  "dcontent_11_fact": "The semicolon was first used in print in Venice in 1494 by the brilliant Italian printer Aldus Manutius — the same man who invented italic typeface and the pocket-sized book!",
  "dcontent_12_q": "Which of the following is a mammal?",
  "dcontent_12_o0": "shark",
  "dcontent_12_o1": "goldfish",
  "dcontent_12_o2": "eagle",
  "dcontent_12_o3": "dolphin",
  "dcontent_12_fact": "Dolphins are so intelligent they have been observed giving each other names — each dolphin has its own unique whistle that acts like a name, and other dolphins use it to get their attention!",
  "dcontent_13_q": "Which planet is closest to the Sun?",
  "dcontent_13_o0": "Earth",
  "dcontent_13_o1": "Venus",
  "dcontent_13_o2": "Mars",
  "dcontent_13_o3": "Mercury",
  "dcontent_13_fact": "Even though Mercury is closest to the Sun, it is NOT the hottest planet — Venus is! Venus has a thick atmosphere that traps heat like a blanket. Mercury has almost no atmosphere at all.",
  "dcontent_14_q": "What do plants breathe in that humans breathe out?",
  "dcontent_14_o0": "oxygen",
  "dcontent_14_o1": "nitrogen",
  "dcontent_14_o2": "carbon dioxide",
  "dcontent_14_o3": "hydrogen",
  "dcontent_14_fact": "Trees are partly made from air! They absorb carbon dioxide and use it to grow their leaves, trunk, and branches — air that was once inside someone's lungs becomes part of a tree!",
  "dcontent_15_q": "Why does ice float on water instead of sinking?",
  "dcontent_15_o0": "It is lighter than liquid water",
  "dcontent_15_o1": "It is heavier than liquid water",
  "dcontent_15_o2": "It has more salt",
  "dcontent_15_o3": "It is magnetic",
  "dcontent_15_fact": "Water is the only common substance where the solid form floats on the liquid — almost everything else sinks when it freezes. This quirk of water is one of the reasons life on Earth can exist!",
  "dcontent_16_q": "Which of these materials is a good conductor of electricity?",
  "dcontent_16_o0": "rubber",
  "dcontent_16_o1": "wood",
  "dcontent_16_o2": "copper",
  "dcontent_16_o3": "plastic",
  "dcontent_16_fact": "Copper helped power the world's first public electricity station — the Holborn Viaduct station in the City of London, which lit up the streets in January 1882!",
  "dcontent_17_q": "What force keeps the Moon in orbit around the Earth?",
  "dcontent_17_o0": "magnetism",
  "dcontent_17_o1": "friction",
  "dcontent_17_o2": "gravity",
  "dcontent_17_o3": "air resistance",
  "dcontent_17_fact": "Isaac Newton developed his theory of gravity after an apple fell in his orchard in Woolsthorpe, Lincolnshire — and the original apple tree still stands today!",
  "dcontent_18_q": "What is the capital city of Scotland?",
  "dcontent_18_o0": "Glasgow",
  "dcontent_18_o1": "Aberdeen",
  "dcontent_18_o2": "Edinburgh",
  "dcontent_18_o3": "Dundee",
  "dcontent_18_fact": "Edinburgh Castle is built on top of an ancient extinct volcano called Castle Rock — the city literally grew around a volcano!",
  "dcontent_19_q": "Which is the longest river in the UK?",
  "dcontent_19_o0": "River Thames",
  "dcontent_19_o1": "River Severn",
  "dcontent_19_o2": "River Trent",
  "dcontent_19_o3": "River Avon",
  "dcontent_19_fact": "The Severn has one of the most dramatic tidal bores in the world — the tide can rise by up to 15 metres in a single day. Surfers actually ride the Severn Bore wave upstream!",
  "dcontent_20_q": "How many countries make up the United Kingdom?",
  "dcontent_20_o0": "2",
  "dcontent_20_o1": "3",
  "dcontent_20_o2": "4",
  "dcontent_20_o3": "5",
  "dcontent_20_fact": "Each of the four nations has its own flower symbol: a rose for England, a daffodil for Wales, a thistle for Scotland, and a shamrock for Northern Ireland.",
  "dcontent_21_q": "Which ocean lies to the west of the United Kingdom?",
  "dcontent_21_o0": "Pacific Ocean",
  "dcontent_21_o1": "Indian Ocean",
  "dcontent_21_o2": "Arctic Ocean",
  "dcontent_21_o3": "Atlantic Ocean",
  "dcontent_21_fact": "The Atlantic Ocean grows about 2.5cm wider every year — roughly the same speed as your fingernails grow. In 100 million years it will be twice as wide!",
  "dcontent_22_q": "Which is the largest country in the world by land area?",
  "dcontent_22_o0": "China",
  "dcontent_22_o1": "USA",
  "dcontent_22_o2": "Canada",
  "dcontent_22_o3": "Russia",
  "dcontent_22_fact": "Russia is so huge it spans 11 different time zones — when it is midnight in one part of Russia, it is already 11am the next day in another part!",
  "dcontent_23_q": "Which of these is a source of renewable energy?",
  "dcontent_23_o0": "coal",
  "dcontent_23_o1": "natural gas",
  "dcontent_23_o2": "wind",
  "dcontent_23_o3": "oil",
  "dcontent_23_fact": "On very windy days, the United Kingdom's wind turbines sometimes generate more electricity than the whole country needs at that moment — the extra power has to be stored or shared with neighbouring countries!",
  "dcontent_24_q": "How many colours are in a rainbow?",
  "dcontent_24_o0": "5",
  "dcontent_24_o1": "6",
  "dcontent_24_o2": "7",
  "dcontent_24_o3": "8",
  "dcontent_24_fact": "Bees can see ultraviolet light — a colour humans cannot see at all! Flowers have hidden patterns and colours in ultraviolet that only bees and some other insects can spot.",
  "dcontent_25_q": "What do you call a group of fish swimming together?",
  "dcontent_25_o0": "a pack",
  "dcontent_25_o1": "a flock",
  "dcontent_25_o2": "a shoal",
  "dcontent_25_o3": "a herd",
  "dcontent_25_fact": "Fish can turn together in a split second because they have a special organ called a lateral line that runs along their body.",
  "dcontent_26_q": "Which is the odd one out: triangle, circle, square, cube?",
  "dcontent_26_o0": "triangle",
  "dcontent_26_o1": "circle",
  "dcontent_26_o2": "square",
  "dcontent_26_o3": "cube",
  "dcontent_26_fact": "For any 3D shape, if you count the faces, add the corners (vertices), then subtract the edges, the answer is always 2. This discovery was made by a Swiss mathematician called Leonhard Euler!",
  "dcontent_27_q": "Who invented the World Wide Web?",
  "dcontent_27_o0": "Bill Gates",
  "dcontent_27_o1": "Steve Jobs",
  "dcontent_27_o2": "Sir Tim Berners-Lee",
  "dcontent_27_o3": "Alan Turing",
  "dcontent_27_fact": "Sir Tim Berners-Lee invented the World Wide Web in 1989 and gave it to the world for free — without his generosity, the internet as we know it today might have been owned by a private company!",
  "dcontent_28_q": "Which is the oldest: the Eiffel Tower, the Great Wall of China, Stonehenge, or Big Ben?",
  "dcontent_28_o0": "The Eiffel Tower",
  "dcontent_28_o1": "The Great Wall of China",
  "dcontent_28_o2": "Stonehenge",
  "dcontent_28_o3": "Big Ben",
  "dcontent_28_fact": "Stonehenge is around 5,000 years old — it was already ancient when the Great Pyramid of Giza was built, and the Romans had not yet been born when its builders finished their work!",
  "dcontent_29_q": "What is the real name of the famous clock tower at the Houses of Parliament in London?",
  "dcontent_29_o0": "Big Ben",
  "dcontent_29_o1": "The Victoria Tower",
  "dcontent_29_o2": "The Elizabeth Tower",
  "dcontent_29_o3": "The Westminster Tower",
  "dcontent_29_fact": "The real 'Big Ben' is not the tower — it is the enormous 13.7 tonne bell inside it! The tower was renamed the Elizabeth Tower in 2012 to honour Queen Elizabeth II's Diamond Jubilee."
}
```

---

## Validation — how to check your output is correct

A translation is REJECTED if any of these are true:

1. **Wrong key count** — each language object must have exactly **478 keys**. Count with:
   ```js
   Object.keys(patch_bn).length // must be 478
   ```

2. **Placeholder pattern detected** — strings like `"bn_Which is the correct spelling?"` or `"pa_How many apples?"` (lang code prefix + English) are fake. Every value must be in the actual target script/language.

3. **Missing script** — Bengali values must be in বাংলা script, Punjabi in ਗੁਰਮੁਖੀ, Gujarati in ગુજરાતી, Hindi in देवनागरी, Arabic in العربية. Any value in Latin script that is NOT a proper noun, number, or equation should be flagged.

4. **Wrong key name** — keys must match the English source exactly (e.g. `apquiz_spelling_0_q` not `apquiz_spelling_0_question`).

5. **Dropped keys** — run a diff of keys against the English source. No key may be missing or added.

---

## Worked example — first 5 keys for each language

Use this to verify your script/direction is correct before producing the full output:

| Key | bn | pa | gu | hi | ar | pt | ro |
|---|---|---|---|---|---|---|---|
| `apquiz_spelling_0_q` | কোনটি সঠিক বানান? | ਸਹੀ ਸਪੈਲਿੰਗ ਕਿਹੜੀ ਹੈ? | સાચી જોડણી કઈ છે? | सही वर्तनी कौन सी है? | ما هو التهجئة الصحيحة؟ | Qual é a ortografia correcta? | Care este ortografia corectă? |
| `apquiz_spelling_0_o0` | Beutiful | Beutiful | Beutiful | Beutiful | Beutiful | Beutiful | Beutiful |
| `apquiz_spelling_0_o1` | Beautifull | Beautifull | Beautifull | Beautifull | Beautifull | Beautifull | Beautifull |
| `apquiz_gk_0_q` | ফ্রান্সের রাজধানী কী? | ਫਰਾਂਸ ਦੀ ਰਾਜਧਾਨੀ ਕੀ ਹੈ? | ફ્રાન્સની રાજધાની શું છે? | फ्रांस की राजधानी क्या है? | ما عاصمة فرنسا؟ | Qual é a capital de França? | Care este capitala Franței? |
| `apquiz_gk_0_o0` | Lyon | Lyon | Lyon | Lyon | Lyon | Lyon | Lyon |

---

## Delivery checklist

- [ ] `src/data/patch_bn.js` — exports `patch_bn`, 478 keys, Bengali script
- [ ] `src/data/patch_pa.js` — exports `patch_pa`, 478 keys, Gurmukhi script
- [ ] `src/data/patch_gu.js` — exports `patch_gu`, 478 keys, Gujarati script
- [ ] `src/data/patch_hi.js` — exports `patch_hi`, 478 keys, Devanagari script
- [ ] `src/data/patch_ar.js` — exports `patch_ar`, 478 keys, Arabic script (RTL language)
- [ ] `src/data/patch_pt.js` — exports `patch_pt`, 478 keys, Portuguese (European)
- [ ] `src/data/patch_ro.js` — exports `patch_ro`, 478 keys, Romanian (include ă â î ș ț where correct)

Each file is standalone. No imports needed. Just the export.
