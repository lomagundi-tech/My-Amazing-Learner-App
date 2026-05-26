// All content approved by My Amazing Learner Ltd — SRS v3.1, May 2026.
// DO NOT MODIFY content without client sign-off.
// QR tokens updated per v3.1 Addendum — must match plaques encoded by Lomagundi Technologies.

export const TRAIL_ID = 'hms-alliance-gosport'

export const TRAIL_META = {
  id: TRAIL_ID,
  name: 'HMS Alliance Trail',
  venue: 'Royal Navy Submarine Museum, Gosport',
  stopCount: 8,
  estimatedMinutes: '45–60',
  rewardThreshold: 8,
  rewardDescription: '10% off your gift shop purchase',
  rewardMinSpend: '£5',
  totalStars: 120,
  quizBonusTotalStars: 80,
  fullCompletionBadgeId: 'explorer_full',
}

export const QR_TOKENS = {
  1: 'a7x9k2',
  2: 'b3m8p1',
  3: 'c6n4r7',
  4: 'd2q5t9',
  5: 'e8w1v3',
  6: 'f4y7u6',
  7: 'g9z2s5',
  8: 'h1j618',
}

// Sparky's opening riddle — leads to Stop 1
export const OPENING_RIDDLE = {
  text: 'I am where every HMS Alliance adventure begins! Find the big welcome entrance and look for the flag with the skull and crossbones. Your very first clue is waiting there — can you find it?',
  hint: 'Museum Entrance / Welcome Gallery',
}

export const STOPS = [
  {
    number: 1,
    name: 'The Jolly Roger',
    location: 'Museum Entrance / Welcome Gallery',
    token: QR_TOKENS[1],
    stars: 10,
    quizBonusStars: 10,
    curriculumLink: 'KS2 History',
    fact: 'Submarines in the Royal Navy fly a Jolly Roger flag when they return from a successful mission! This tradition started in 1914 when an Admiral called submariners "pirates." Each flag has symbols that show what the submarine did on its mission.',
    riddle: {
      text: 'Now head inside the submarine! Go all the way to the sharp, pointy front — called the bow. Look for four big metal tubes pointing forward. Nine sailors used to sleep right next to them! Find the code there.',
      hint: 'HMS Alliance — Forward Compartment (Torpedo Room)',
    },
    sparky_explanation: "Sparky says: An Admiral called submariners 'pirates' back in 1914 — so submariners decided to have fun with it and started flying the Jolly Roger flag to celebrate every successful mission!",
    quiz: {
      question: 'What started the Royal Navy tradition of submarines flying Jolly Roger flags?',
      options: [
        'A captain liked pirates',
        'An Admiral called submariners pirates',
        'A sailor found a treasure map',
      ],
      correctIndex: 1,
    },
  },
  {
    number: 2,
    name: 'The Torpedo Room',
    location: 'HMS Alliance — Forward Compartment',
    token: QR_TOKENS[2],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 Design Technology',
    fact: 'HMS Alliance has four torpedo tubes at the front of the submarine. A torpedo travels through the water to hit an enemy ship. When not on a mission, nine sailors slept on bunks right next to the torpedoes — there was barely any room!',
    riddle: {
      text: 'Walk back towards the middle of the submarine and look UP for a tall metal tube that pokes through the ceiling. It is the eye of the submarine! The captain used it to spy above the waves. Find the code near the periscope.',
      hint: 'HMS Alliance — Control Room / Conning Tower',
    },
    sparky_explanation: "Sparky says: HMS Alliance has four torpedo tubes at her bow — and nine sailors had to sleep right next to them on incredibly cramped bunks with barely any room to move!",
    quiz: {
      question: 'How many torpedo tubes are at the bow (front) of HMS Alliance?',
      options: ['Two', 'Four', 'Six'],
      correctIndex: 1,
    },
  },
  {
    number: 3,
    name: 'The Periscope',
    location: 'HMS Alliance — Control Room / Conning Tower',
    token: QR_TOKENS[3],
    stars: 20,
    quizBonusStars: 10,
    curriculumLink: 'KS2 Science: Light',
    fact: 'A periscope uses mirrors placed at 45-degree angles to bend light around corners. When the submarine is just under the surface, the captain raises the periscope to look around — but only for a very short time, because the enemy could spot it sticking out of the water!',
    riddle: {
      text: 'You are still in the heart of the Control Room — look around for a big steering wheel, just like on a ship. This is where the captain steered left and right. Find the code at the helm!',
      hint: 'HMS Alliance — Control Room (Helm)',
    },
    sparky_explanation: "Sparky says: A periscope uses mirrors placed at 45-degree angles — light bounces off one mirror at the top, travels down the tube, then bounces off another mirror to reach the captain's eye!",
    quiz: {
      question: 'What does a periscope use to bend light so the captain can see above the water?',
      options: ['Lenses only', 'Mirrors at 45 degrees', 'A camera'],
      correctIndex: 1,
    },
  },
  {
    number: 4,
    name: 'The Helm',
    location: 'HMS Alliance — Control Room',
    token: QR_TOKENS[4],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 Science: Forces',
    fact: 'A submarine steers left and right with a rudder, just like a ship. But it also needs to go up and down underwater! It does this using special fins called hydroplanes, and by filling tanks with water to sink, or pumping water out to rise.',
    riddle: {
      text: 'Follow your nose — can you smell something cooking? Head towards the middle of the submarine. Sixty-five hungry sailors needed feeding every single day! Find the tiny kitchen called the galley.',
      hint: 'HMS Alliance — Midships (Galley)',
    },
    sparky_explanation: "Sparky says: Hydroplanes are special fins on the outside of the submarine — when they tilt they push the sub up or down through the water, a bit like the fins on a fish swimming deeper or shallower!",
    quiz: {
      question: 'What are the fins called that control how deep a submarine goes?',
      options: ['Rudders', 'Hydroplanes', 'Stabilisers'],
      correctIndex: 1,
    },
  },
  {
    number: 5,
    name: 'The Galley',
    location: 'HMS Alliance — Midships',
    token: QR_TOKENS[5],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 History',
    fact: 'The cook on HMS Alliance had one of the hardest jobs on the submarine — cooking three meals a day for 65 people in a tiny kitchen! Everything had to be fixed down so it would not fly around when the submarine moved. Hot food was very important for keeping the crew happy.',
    riddle: {
      text: 'Head towards the back of the submarine — called the aft end. Listen out for the sound of powerful engines! One uses diesel, one uses electricity. Find the code in the engine room.',
      hint: 'HMS Alliance — Aft Section (Engine Room)',
    },
    sparky_explanation: "Sparky says: The tiny galley on HMS Alliance had to feed 65 crew members every single day — three meals a day in a kitchen barely bigger than a wardrobe, with everything bolted down so it could not fly around!",
    quiz: {
      question: 'How many crew members did the galley on HMS Alliance have to feed?',
      options: ['25', '45', '65'],
      correctIndex: 2,
    },
  },
  {
    number: 6,
    name: 'The Engine Room',
    location: 'HMS Alliance — Aft Section',
    token: QR_TOKENS[6],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 Science',
    fact: 'HMS Alliance has two types of engine that work as a team. On the surface it uses a diesel engine to charge up huge batteries. When it dives underwater it switches to silent electric motors — because diesel engines need air to work, and there is no fresh air underwater!',
    riddle: {
      text: 'Step OFF the submarine and look for a separate building nearby! Inside is the very first submarine the Royal Navy ever had — built way back in 1901. Find Holland I and look for the code.',
      hint: 'Holland I Exhibition Building',
    },
    sparky_explanation: "Sparky says: Diesel engines burn fuel to make power, but burning always needs oxygen from the air — and there is no fresh air when you are deep underwater, so HMS Alliance switches to quiet electric motors instead!",
    quiz: {
      question: 'Why cannot HMS Alliance use its diesel engine when it is underwater?',
      options: ['It is too noisy', 'Diesel engines need air to work', 'The water would damage it'],
      correctIndex: 1,
    },
  },
  {
    number: 7,
    name: 'Holland I',
    location: 'Holland I Exhibition Building',
    token: QR_TOKENS[7],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 History: Inventors',
    fact: "Holland I was the Royal Navy's very first submarine, built in 1901. It was designed by an Irish-American engineer called John Philip Holland — who had originally invented the submarine to fight against Britain! It sank in 1913 and was found on the seabed 70 years later.",
    riddle: {
      text: 'Head back into the main museum building and search for the Silent & Secret gallery. Inside you will find the tiniest submarine of all — so small that only four crew members could squeeze inside! Find the very last code there.',
      hint: 'Main Museum Gallery — Silent & Secret',
    },
    sparky_explanation: "Sparky says: John Philip Holland was an Irish-American engineer who originally invented the submarine to fight against Britain — but the Royal Navy liked his design so much that they bought it and named it after him!",
    quiz: {
      question: "Who designed Holland I, the Royal Navy's very first submarine?",
      options: [
        'A British naval engineer',
        'John Philip Holland — an Irish-American engineer',
        'A German engineer',
      ],
      correctIndex: 1,
    },
  },
  {
    number: 8,
    name: 'X24 Midget Submarine',
    location: 'Main Museum Gallery — Silent & Secret',
    token: QR_TOKENS[8],
    stars: 15,
    quizBonusStars: 10,
    curriculumLink: 'KS2 History: World War II',
    fact: 'X24 is a midget submarine so small that only 4 sailors could squeeze inside. In 1944 it went on a secret mission into an enemy harbour in Norway and used special charges to destroy a German dock that was repairing enemy submarines. The crew were incredibly brave.',
    riddle: null,
    sparky_explanation: "Sparky says: The X24 midget submarine was so incredibly tiny that only 4 brave sailors could squeeze inside — imagine spending days in a space barely bigger than a large family car on a secret mission!",
    quiz: {
      question: 'How many crew members could fit inside the X24 midget submarine?',
      options: ['2', '4', '8'],
      correctIndex: 1,
    },
  },
]

// Fast token → stop number lookup for QR validation
export const TOKEN_TO_STOP = Object.fromEntries(STOPS.map((s) => [s.token, s.number]))
