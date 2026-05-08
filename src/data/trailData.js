// All content approved by My Amazing Learner Ltd — SRS v2, April 2026.
// DO NOT MODIFY content without client sign-off.
// QR tokens below MUST match what Lomagundi Technologies encodes on the physical plaques.
// ⚠️ Share QR_TOKENS with LTL before plaques are printed.

export const TRAIL_ID = 'hms-alliance-gosport'

export const TRAIL_META = {
  id: TRAIL_ID,
  name: 'HMS Alliance Trail',
  venue: 'Royal Navy Submarine Museum, Gosport',
  stopCount: 8,
  estimatedMinutes: '45–60',
  rewardThreshold: 6,
  rewardDescription: '10% off your gift shop purchase',
  rewardMinSpend: '£5',
  totalStars: 120,
  fullCompletionBadgeId: 'explorer_full',
}

export const QR_TOKENS = {
  1: 'jlr1k9m',
  2: 'trp2x4b',
  3: 'prs3q7v',
  4: 'hlm4w2n',
  5: 'gly5r8c',
  6: 'eng6d5p',
  7: 'hld7t3f',
  8: 'x248a6s',
}

export const STOPS = [
  {
    number: 1,
    name: 'The Jolly Roger',
    location: 'Museum Entrance / Welcome Gallery',
    token: QR_TOKENS[1],
    stars: 10,
    curriculumLink: 'KS2 History',
    fact: 'Submarines in the Royal Navy fly a Jolly Roger flag when they return from a successful mission! This tradition started in 1914 when an Admiral called submariners "pirates." Each flag has symbols that show what the submarine did on its mission.',
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
    curriculumLink: 'KS2 Design Technology',
    fact: 'HMS Alliance has four torpedo tubes at the front of the submarine. A torpedo travels through the water to hit an enemy ship. When not on a mission, nine sailors slept on bunks right next to the torpedoes — there was barely any room!',
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
    curriculumLink: 'KS2 Science: Light',
    fact: 'A periscope uses mirrors placed at 45-degree angles to bend light around corners. When the submarine is just under the surface, the captain raises the periscope to look around — but only for a very short time, because the enemy could spot it sticking out of the water!',
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
    curriculumLink: 'KS2 Science: Forces',
    fact: 'A submarine steers left and right with a rudder, just like a ship. But it also needs to go up and down underwater! It does this using special fins called hydroplanes, and by filling tanks with water to sink, or pumping water out to rise.',
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
    curriculumLink: 'KS2 History',
    fact: 'The cook on HMS Alliance had one of the hardest jobs on the submarine — cooking three meals a day for 65 people in a tiny kitchen! Everything had to be fixed down so it would not fly around when the submarine moved. Hot food was very important for keeping the crew happy.',
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
    curriculumLink: 'KS2 Science',
    fact: 'HMS Alliance has two types of engine that work as a team. On the surface it uses a diesel engine to charge up huge batteries. When it dives underwater it switches to silent electric motors — because diesel engines need air to work, and there is no fresh air underwater!',
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
    curriculumLink: 'KS2 History: Inventors',
    fact: "Holland I was the Royal Navy's very first submarine, built in 1901. It was designed by an Irish-American engineer called John Philip Holland — who had originally invented the submarine to fight against Britain! It sank in 1913 and was found on the seabed 70 years later.",
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
    curriculumLink: 'KS2 History: World War II',
    fact: 'X24 is a midget submarine so small that only 4 sailors could squeeze inside. In 1944 it went on a secret mission into an enemy harbour in Norway and used special charges to destroy a German dock that was repairing enemy submarines. The crew were incredibly brave.',
    quiz: {
      question: 'How many crew members could fit inside the X24 midget submarine?',
      options: ['2', '4', '8'],
      correctIndex: 1,
    },
  },
]

// Fast token → stop number lookup for QR validation
export const TOKEN_TO_STOP = Object.fromEntries(STOPS.map((s) => [s.token, s.number]))
