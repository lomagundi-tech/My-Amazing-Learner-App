export default function ModeToggle({ mode, onToggle }) {
  return (
    <div style={styles.wrapper} role="group" aria-label="Switch between Parent and Child mode">
      <button
        onClick={() => onToggle('parent')}
        aria-pressed={mode === 'parent'}
        style={{
          ...styles.btn,
          background: mode === 'parent' ? 'var(--plum)' : 'transparent',
          color: mode === 'parent' ? '#fff' : 'var(--text-mid)',
          fontWeight: mode === 'parent' ? 700 : 600,
        }}
      >
        <span aria-hidden="true">👨‍👩‍👧</span> Parent
      </button>
      <button
        onClick={() => onToggle('child')}
        aria-pressed={mode === 'child'}
        style={{
          ...styles.btn,
          background: mode === 'child' ? 'var(--coral)' : 'transparent',
          color: mode === 'child' ? '#fff' : 'var(--text-mid)',
          fontWeight: mode === 'child' ? 700 : 600,
        }}
      >
        <span aria-hidden="true">⭐</span> Child
      </button>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: 'var(--radius-pill)',
    padding: '4px',
    boxShadow: 'var(--shadow-small)',
    gap: '2px',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontFamily: "'Nunito', sans-serif",
    transition: 'background 0.25s ease, color 0.25s ease',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
}
