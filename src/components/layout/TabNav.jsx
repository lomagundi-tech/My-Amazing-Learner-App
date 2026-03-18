const TABS = [
  { id: 0, label: 'Home',       emoji: '🌻' },
  { id: 1, label: 'AI Tutor',   emoji: '🔮' },
  { id: 2, label: 'Activities', emoji: '🧩' },
  { id: 3, label: 'Progress',   emoji: '🌱' },
  { id: 4, label: 'Crafts',     emoji: '🪡' },
  { id: 5, label: 'Rewards',    emoji: '🎖️' },
  { id: 6, label: 'SEN Tools',  emoji: '🌈' },
]

export default function TabNav({ activeTab, onTabChange, mode }) {
  const activeColor = mode === 'child' ? 'var(--coral)' : 'var(--plum)'

  return (
    <nav aria-label="Main navigation" style={styles.nav}>
      <div style={styles.track} className="tab-track">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                ...styles.tab,
                background: isActive ? activeColor : '#fff',
                color: isActive ? '#fff' : 'var(--text-mid)',
                fontWeight: isActive ? 700 : 600,
                boxShadow: isActive ? 'var(--shadow-small)' : '0 2px 8px rgba(61,26,94,0.08)',
              }}
            >
              <span aria-hidden="true" style={styles.emoji}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    borderBottom: '1px solid rgba(61,26,94,0.08)',
    background: 'rgba(255,249,240,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    position: 'sticky',
    top: '76px',
    zIndex: 90,
  },
  track: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    width: 'max-content',
    minWidth: '100%',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '0.875rem',
    transition: 'background 0.2s ease, color 0.2s ease, transform 0.2s ease',
    whiteSpace: 'nowrap',
    minHeight: '44px',
  },
  emoji: {
    fontSize: '1rem',
  },
}
