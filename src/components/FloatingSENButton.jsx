import { useState, useEffect } from 'react'
import { getSenActive, toggleSenTool, getSenTooltipShown, setSenTooltipShown } from '../utils/storage'
import { SEN_TOOLS, applyAllActive } from '../utils/senTools'
import { t } from '../utils/i18n'

export default function FloatingSENButton({ activeTab, lang = 'en' }) {
  const [open, setOpen] = useState(false)
  const [activeTools, setActiveTools] = useState(() => getSenActive())
  const [showTooltip, setShowTooltip] = useState(false)

  // Apply persisted tools on mount
  useEffect(() => {
    const saved = getSenActive()
    setActiveTools(saved)
    applyAllActive(saved)

    // First-render tooltip
    if (!getSenTooltipShown()) {
      setShowTooltip(true)
      setSenTooltipShown()
      const t = setTimeout(() => setShowTooltip(false), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  // Read-aloud click delegation
  useEffect(() => {
    if (!activeTools.includes('read_aloud')) return

    function handleClick(e) {
      const el = e.target.closest('p, h1, h2, h3, h4, button, label, [data-speak]')
      if (!el) return
      const text = el.innerText || el.textContent
      if (!text?.trim()) return
      window.speechSynthesis?.cancel()
      const utt = new SpeechSynthesisUtterance(text.trim())
      utt.lang = 'en-GB'
      utt.rate = 0.9
      window.speechSynthesis?.speak(utt)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [activeTools])

  function handleToggle(toolId) {
    const updated = toggleSenTool(toolId)
    setActiveTools(updated)
    const tool = SEN_TOOLS.find((t) => t.id === toolId)
    tool?.apply(updated.includes(toolId))
  }

  // Hide on SEN tab (tab 6)
  if (activeTab === 6) return null

  const anyActive = activeTools.length > 0

  return (
    <>
      {/* Tooltip */}
      {showTooltip && !open && (
        <div style={st.tooltip} role="status" aria-live="polite">
          {t('floating_sen_tooltip', lang)}
        </div>
      )}

      {/* Modal overlay */}
      {open && (
        <div
          style={st.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Tools"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={st.modal}>
            <div style={st.modalHeader}>
              <h2 style={st.modalTitle}>{t('floating_sen_modal_heading', lang)}</h2>
              <button onClick={() => setOpen(false)} style={st.closeBtn} aria-label={t('floating_sen_close', lang)}>✕</button>
            </div>
            <p style={st.modalSub}>{t('floating_sen_modal_sub', lang)}</p>
            <div style={st.toolsGrid}>
              {SEN_TOOLS.map((tool) => {
                const isOn = activeTools.includes(tool.id)
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToggle(tool.id)}
                    aria-pressed={isOn}
                    style={{
                      ...st.toolCard,
                      background: isOn ? 'var(--plum)' : '#f5f0fa',
                      color: isOn ? '#fff' : 'var(--text-dark)',
                      borderColor: isOn ? 'var(--plum)' : 'rgba(107,63,160,0.15)',
                    }}
                  >
                    <span style={st.toolEmoji} aria-hidden="true">{tool.emoji}</span>
                    <span style={st.toolLabel}>{t(`sen_tool_${tool.translationId || tool.id}`, lang)}</span>
                    <span style={{ ...st.toolStatus, color: isOn ? 'rgba(255,255,255,0.8)' : 'var(--text-mid)' }}>
                      {isOn ? t('sen_tool_on', lang) : t('sen_tool_off', lang)}
                    </span>
                    <span style={{ ...st.toolDesc, color: isOn ? 'rgba(255,255,255,0.75)' : 'var(--text-mid)' }}>
                      {t(`sen_tool_${tool.translationId || tool.id}_desc`, lang)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Accessibility Tools"
        title="Accessibility Tools"
        style={{
          ...st.btn,
          boxShadow: anyActive
            ? '0 0 0 3px var(--gold), 0 4px 20px rgba(61,26,94,0.35)'
            : '0 4px 20px rgba(61,26,94,0.35)',
        }}
      >
        ♿
      </button>
    </>
  )
}

const st = {
  btn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF6B6B, #FFB347, #4ECDC4, #6B3FA0)',
    border: '3px solid rgba(255,255,255,0.4)',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    color: '#fff',
  },
  tooltip: {
    position: 'fixed',
    bottom: '84px',
    right: '16px',
    background: 'var(--plum)',
    color: '#fff',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '0.8rem',
    fontWeight: 600,
    fontFamily: "'Nunito', 'Noto Sans', sans-serif",
    zIndex: 501,
    maxWidth: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(61,26,94,0.3)',
    pointerEvents: 'none',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26,10,46,0.6)',
    zIndex: 600,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 0 90px',
  },
  modal: {
    background: '#fff',
    borderRadius: '20px 20px 20px 20px',
    padding: '24px 20px 28px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 -4px 40px rgba(61,26,94,0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  modalTitle: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    color: 'var(--plum)',
    fontSize: '1.2rem',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.1rem',
    color: 'var(--text-mid)',
    cursor: 'pointer',
    padding: '4px 8px',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSub: {
    fontSize: '0.8rem',
    color: 'var(--text-mid)',
    marginBottom: '16px',
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '10px',
  },
  toolCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '2px solid',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'Nunito', 'Noto Sans', sans-serif",
    transition: 'background 0.2s ease, color 0.2s ease',
    minHeight: '44px',
  },
  toolEmoji: { fontSize: '1.4rem' },
  toolLabel: { fontWeight: 700, fontSize: '0.9rem' },
  toolStatus: { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
  toolDesc: { fontSize: '0.75rem', lineHeight: 1.4 },
}
