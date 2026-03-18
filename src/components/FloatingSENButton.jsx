export default function FloatingSENButton({ activeTab, onTabChange }) {
  if (activeTab === 6) return null

  return (
    <button
      onClick={() => onTabChange(6)}
      aria-label="Open Accessibility Tools"
      title="Accessibility Tools"
      style={styles.btn}
    >
      🌈
    </button>
  )
}

const styles = {
  btn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'var(--plum)',
    border: '3px solid rgba(255,255,255,0.3)',
    boxShadow: '0 4px 20px rgba(61,26,94,0.35)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
}
