import { useState } from 'react'
import { CRAFTS } from '../data/craftsData'
import { getCraftsCompleted, toggleCraft, earnBadge } from '../utils/storage'
import { launchConfetti } from '../utils/confetti'
import { t } from '../utils/i18n'

export default function CraftsPanel({ mode, onBadgesChange, lang = 'en' }) {
  const [completed, setCompleted] = useState(() => getCraftsCompleted())
  const isChild = mode === 'child'

  function handleToggle(id) {
    const updated = toggleCraft(id)
    setCompleted(updated)
    if (updated.length >= 6) {
      if (earnBadge('craft_master')) {
        launchConfetti()
        onBadgesChange()
      }
    }
  }

  return (
    <div className="panel-enter" style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            {isChild ? t('craft_title_child', lang) : t('craft_title_parent', lang)}
          </h2>
          <p style={styles.sub}>
            {isChild
              ? t('craft_sub_child', lang)
              : t('craft_sub_parent', lang)}
          </p>
        </div>
        <div style={styles.counter}>
          <span style={styles.counterText}>{completed.length}/6</span>
          <span style={styles.counterLabel}>completed</span>
        </div>
      </div>

      {/* Cards grid */}
      <div style={styles.grid}>
        {CRAFTS.map((craft) => {
          const isDone = completed.includes(craft.id)
          return (
            <div
              key={craft.id}
              style={{
                ...styles.card,
                background: `linear-gradient(135deg, ${craft.gradient[0]}, ${craft.gradient[1]})`,
                opacity: isDone ? 0.85 : 1,
              }}
            >
              {isDone && <div style={styles.doneOverlay}>{t('craft_done_overlay', lang)}</div>}
              <div style={styles.cardAge}>{craft.ages}</div>
              <h3 style={styles.cardTitle}>{t(`craft_${craft.id}_title`, lang)}</h3>
              <p style={styles.cardDesc}>{t(`craft_${craft.id}_desc`, lang)}</p>
              <div style={styles.cardActions}>
                <a
                  href={craft.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.shopBtn}
                  aria-label={`${isChild ? 'Get the kit' : 'Shop this resource'}: ${craft.title}`}
                >
                  {isChild ? t('craft_shop_cta_child', lang) : t('craft_shop_cta_parent', lang)}
                </a>
                <button
                  onClick={() => handleToggle(craft.id)}
                  style={{
                    ...styles.checkBtn,
                    background: isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                  }}
                  aria-label={isDone ? `Unmark ${craft.title} as done` : `Mark ${craft.title} as done`}
                  aria-pressed={isDone}
                >
                  {isDone ? '✅' : '⬜'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {completed.length === 6 && (
        <div style={styles.allDone}>
          {t('craft_all_done', lang)}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 0' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' },
  title: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--plum)', fontSize: '1.5rem', marginBottom: '6px' },
  sub: { color: 'var(--text-mid)', fontSize: '0.95rem', maxWidth: '560px' },
  counter: {
    background: 'var(--gold)', borderRadius: 'var(--radius-pill)',
    padding: '10px 20px', textAlign: 'center', flexShrink: 0,
  },
  counterText: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: 'var(--text-dark)', fontSize: '1.5rem', display: 'block' },
  counterLabel: { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-mid)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' },
  card: {
    borderRadius: 'var(--radius-card)', padding: '20px',
    position: 'relative', overflow: 'hidden',
    boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.25s ease',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  doneOverlay: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'rgba(255,255,255,0.9)', borderRadius: '20px',
    padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#1a6b67',
  },
  cardAge: {
    display: 'inline-block', background: 'rgba(255,255,255,0.3)',
    borderRadius: '20px', padding: '3px 10px',
    fontSize: '0.75rem', fontWeight: 700, color: '#fff', alignSelf: 'flex-start',
  },
  cardTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#fff', fontSize: '1.1rem' },
  cardDesc: { color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', lineHeight: 1.5, flex: 1 },
  cardActions: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' },
  shopBtn: {
    flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 'var(--radius-pill)', color: '#fff', fontFamily: "'Nunito', 'Noto Sans', sans-serif",
    fontWeight: 700, fontSize: '0.8rem', textAlign: 'center',
    display: 'block', minHeight: '44px', lineHeight: '24px',
  },
  checkBtn: {
    width: '44px', height: '44px', borderRadius: '12px', border: 'none',
    cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s ease', flexShrink: 0,
  },
  allDone: {
    background: 'linear-gradient(135deg, var(--gold), #FFD93D)',
    borderRadius: 'var(--radius-card)', padding: '20px 24px',
    fontFamily: "'Baloo 2', cursive", fontWeight: 700,
    color: 'var(--text-dark)', fontSize: '1.1rem', textAlign: 'center',
  },
}
