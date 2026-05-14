import { useState } from 'react'
import { LANGUAGES } from '../data/translations'
import { t } from '../utils/i18n'

export default function LanguageSwitcher({ lang, onLangChange }) {
  const [open, setOpen]         = useState(false)
  const [search, setSearch]     = useState('')
  const [hoveredCode, setHover] = useState(null)

  const current  = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]
  const filtered = LANGUAGES.filter((l) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.label.toLowerCase().includes(q) ||
      l.labelEn.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    )
  })

  function handleSelect(code) {
    onLangChange(code)
    setOpen(false)
    setSearch('')
  }

  function handleOverlayKey(e) {
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <>
      {/* Trigger — shows current flag + code */}
      <button
        onClick={() => setOpen(true)}
        style={s.trigger}
        aria-label={`Language: ${current.label}. Click to change.`}
        title="Change language"
      >
        <span style={s.triggerFlag}>{current.flag}</span>
        <span style={s.triggerCode}>{current.code.toUpperCase()}</span>
        <span style={s.chevron} aria-hidden="true">▾</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          style={s.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={t('lang_choose', lang)}
          onClick={() => setOpen(false)}
          onKeyDown={handleOverlayKey}
        >
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>

            {/* Header — plum→violet gradient matching the app's parent-mode hero */}
            <div style={s.modalHeader}>
              <div style={s.modalTitleRow}>
                <span style={s.modalGlobe} aria-hidden="true">🌍</span>
                <h2 style={s.modalTitle}>{t('lang_choose', lang)}</h2>
              </div>
              <button
                style={s.closeBtn}
                onClick={() => setOpen(false)}
                aria-label={t('common_close', lang)}
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div style={s.searchWrap}>
              <span style={s.searchIcon} aria-hidden="true">🔍</span>
              <input
                style={s.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('lang_search', lang)}
                autoFocus
                aria-label="Search languages"
              />
              {search && (
                <button
                  style={s.clearSearch}
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Language grid */}
            <div style={s.grid} role="listbox" aria-label="Available languages">
              {filtered.length === 0 && (
                <p style={s.noResults}>No languages found</p>
              )}
              {filtered.map((language) => {
                const isActive  = lang === language.code
                const isHovered = hoveredCode === language.code && !isActive
                return (
                  <button
                    key={language.code}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(language.code)}
                    onMouseEnter={() => setHover(language.code)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      ...s.langCard,
                      background:  isActive  ? 'var(--plum)' : '#fff',
                      color:       isActive  ? '#fff'        : 'var(--text-dark)',
                      borderColor: isActive  ? 'var(--plum)' : isHovered ? 'var(--violet)' : 'rgba(61,26,94,0.12)',
                      transform:   isActive  ? 'scale(1.04)' : isHovered ? 'translateY(-3px)' : 'none',
                      boxShadow:   isActive  ? '0 8px 24px rgba(61,26,94,0.32)' : isHovered ? 'var(--shadow-card)' : 'var(--shadow-small)',
                    }}
                  >
                    {isActive && <span style={s.checkmark} aria-hidden="true">✓</span>}
                    <span style={s.flagLg} aria-hidden="true">{language.flag}</span>
                    <span style={s.langName}>{language.label}</span>
                    {language.labelEn && (
                      <span style={{
                        ...s.langEn,
                        color: isActive ? 'rgba(255,255,255,0.75)' : 'var(--text-mid)',
                      }}>
                        {language.labelEn}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      )}
    </>
  )
}

const s = {
  // ── Trigger button ─────────────────────────────────────────────
  trigger: {
    display:      'flex',
    alignItems:   'center',
    gap:          '5px',
    background:   'rgba(255,255,255,0.9)',
    border:       '1.5px solid rgba(61,26,94,0.15)',
    borderRadius: 'var(--radius-pill)',
    padding:      '6px 12px',
    cursor:       'pointer',
    fontFamily:   "'Nunito', sans-serif",
    fontSize:     '0.85rem',
    fontWeight:   700,
    color:        'var(--plum)',
    minHeight:    '44px',
    transition:   'var(--transition)',
    boxShadow:    'var(--shadow-small)',
  },
  triggerFlag: {
    fontSize:   '1.15rem',
    lineHeight: 1,
  },
  triggerCode: {
    letterSpacing: '0.05em',
    color:         'var(--plum)',
  },
  chevron: {
    fontSize:   '0.65rem',
    color:      'var(--text-mid)',
    marginLeft: '1px',
  },

  // ── Modal overlay ──────────────────────────────────────────────
  overlay: {
    position:             'fixed',
    inset:                0,
    background:           'rgba(26,10,46,0.55)',
    backdropFilter:       'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex:               999,
    display:              'flex',
    alignItems:           'center',
    justifyContent:       'center',
    padding:              '16px',
    animation:            'fadeUp 0.35s ease',
  },
  modal: {
    background:    '#fff',
    borderRadius:  'var(--radius-card)',
    width:         '100%',
    maxWidth:      '600px',
    maxHeight:     '82vh',
    display:       'flex',
    flexDirection: 'column',
    overflow:      'hidden',
    boxShadow:     'var(--shadow-card)',
  },

  // ── Modal header — plum→violet (matches parent hero gradient) ───
  modalHeader: {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'space-between',
    padding:         '20px 24px 16px',
    flexShrink:      0,
    background:      'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)',
    borderRadius:    'var(--radius-card) var(--radius-card) 0 0',
  },
  modalTitleRow: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
  modalGlobe: {
    fontSize:  '1.75rem',
    animation: 'spin 8s linear infinite',
  },
  modalTitle: {
    fontFamily: "'Baloo 2', cursive",
    fontWeight: 800,
    fontSize:   '1.25rem',
    color:      '#fff',
    margin:     0,
  },
  closeBtn: {
    background:     'rgba(255,255,255,0.2)',
    border:         'none',
    borderRadius:   '50%',
    width:          '36px',
    height:         '36px',
    cursor:         'pointer',
    fontSize:       '1rem',
    color:          '#fff',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontWeight:     700,
    flexShrink:     0,
    transition:     'var(--transition)',
  },

  // ── Search bar ─────────────────────────────────────────────────
  searchWrap: {
    display:     'flex',
    alignItems:  'center',
    gap:         '10px',
    padding:     '14px 20px',
    borderBottom:'1px solid rgba(61,26,94,0.08)',
    background:  'var(--cream)',
    flexShrink:  0,
  },
  searchIcon: {
    fontSize:   '1.1rem',
    flexShrink: 0,
  },
  searchInput: {
    flex:       1,
    border:     'none',
    background: 'transparent',
    fontFamily: "'Nunito', sans-serif",
    fontSize:   '0.95rem',
    color:      'var(--text-dark)',
    outline:    'none',
  },
  clearSearch: {
    background:     'rgba(61,26,94,0.1)',
    border:         'none',
    borderRadius:   '50%',
    width:          '24px',
    height:         '24px',
    cursor:         'pointer',
    fontSize:       '0.75rem',
    color:          'var(--text-mid)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },

  // ── Language card grid ─────────────────────────────────────────
  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap:                 '10px',
    padding:             '16px 20px',
    overflowY:           'auto',
    WebkitOverflowScrolling: 'touch',
  },
  langCard: {
    position:      'relative',
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '6px',
    padding:       '16px 10px 14px',
    borderRadius:  'var(--radius-card)',
    border:        '2px solid transparent',
    cursor:        'pointer',
    fontFamily:    "'Nunito', sans-serif",
    transition:    'var(--transition)',
    minHeight:     '100px',
  },
  checkmark: {
    position:   'absolute',
    top:        '8px',
    right:      '10px',
    fontSize:   '0.85rem',
    fontWeight: 800,
    color:      'var(--gold)',
  },
  flagLg: {
    fontSize:     '2.25rem',
    lineHeight:   1,
    marginBottom: '2px',
  },
  langName: {
    fontWeight: 700,
    fontSize:   '0.85rem',
    textAlign:  'center',
    lineHeight: 1.2,
  },
  langEn: {
    fontSize:   '0.72rem',
    fontWeight: 500,
    textAlign:  'center',
    lineHeight: 1.2,
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign:  'center',
    color:      'var(--text-mid)',
    fontFamily: "'Nunito', sans-serif",
    padding:    '32px 0',
  },
}
