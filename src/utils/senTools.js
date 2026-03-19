// Shared SEN tool definitions — used by both FloatingSENButton modal and SENPanel
// Each tool has an apply(active) function that immediately affects the app UI

export const SEN_TOOLS = [
  {
    id: 'high_contrast',
    label: 'High Contrast',
    emoji: '🔆',
    bg: '#FFF8E1',
    desc: 'Bold visual mode for visual processing needs. Increases contrast.',
    apply: (active) => {
      document.documentElement.style.setProperty('--cream', active ? '#000' : '#FFF9F0')
      document.documentElement.style.setProperty('--text-dark', active ? '#fff' : '#1A0A2E')
      document.documentElement.style.setProperty('--text-mid', active ? '#eee' : '#4A3060')
    },
  },
  {
    id: 'calm_mode',
    label: 'Calm Mode',
    emoji: '🌿',
    bg: '#E8F5E9',
    desc: 'Reduces animations and visual effects for sensory processing needs.',
    apply: (active) => {
      document.documentElement.style.setProperty('--transition', active ? '0s' : '0.25s ease')
      document.body.classList.toggle('calm-mode', active)
    },
  },
  {
    id: 'large_text',
    label: 'Large Text',
    emoji: '🔡',
    bg: '#E3F2FD',
    desc: 'Increases font size across the whole app for easier reading.',
    apply: (active) => {
      document.documentElement.style.fontSize = active ? '19px' : '16px'
    },
  },
  {
    id: 'read_aloud',
    label: 'Read Aloud',
    emoji: '🔊',
    bg: '#E8F5E9',
    desc: 'Tap any question or text to hear it spoken aloud.',
    apply: (active) => {
      document.body.classList.toggle('read-aloud-mode', active)
      if (!active) window.speechSynthesis?.cancel()
    },
  },
  {
    id: 'extra_time',
    label: 'Extra Time',
    emoji: '⏳',
    bg: '#E3F2FD',
    desc: 'All activities run at your own pace — no rushing.',
    apply: () => {}, // informational for MVP
  },
  {
    id: 'chunked_tasks',
    label: 'Chunked Tasks',
    emoji: '🧩',
    bg: '#F3E5F5',
    desc: 'Activities broken into smaller, manageable steps.',
    apply: () => {}, // informational for MVP
  },
]

export function applyAllActive(activeIds) {
  SEN_TOOLS.forEach((tool) => tool.apply(activeIds.includes(tool.id)))
}
