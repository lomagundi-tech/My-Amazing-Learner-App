import { BADGES } from '../data/badgesData'
import { t } from '../utils/i18n'

const BADGE_KEY_MAP = {
  explorer_full: 'full_explorer',
}

export default function RewardsPanel({ mode, badges, stars, lang = 'en' }) {
  const earnedIds = badges ?? []
  const badgeTotal = BADGES.length

  return (
    <div className="panel-enter" style={styles.wrapper}>
      {/* Star counter */}
      <div style={styles.starCard}>
        <span style={styles.starEmoji} aria-hidden="true">⭐</span>
        <div>
          <div style={styles.starNumber}>{stars}</div>
          <div style={styles.starLabel}>{t('rewards_star_label', lang)}</div>
        </div>
        {stars >= 5 && (
          <div style={styles.milestone}>
            {stars >= 20 ? t('rewards_milestone_champion', lang) : stars >= 10 ? t('rewards_milestone_collector', lang) : t('rewards_milestone_keep_going', lang)}
          </div>
        )}
      </div>

      {/* Badges */}
      <div>
        <h2 style={styles.sectionTitle}>
          {t('rewards_badge_heading', lang)} <span style={styles.badgeCount}>{earnedIds.length}/{badgeTotal}</span>
        </h2>
        <div style={styles.grid}>
          {BADGES.map((badge) => {
            const earned = earnedIds.includes(badge.id)
            return (
              <div
                key={badge.id}
                style={{
                  ...styles.badgeCard,
                  filter: earned ? 'none' : 'grayscale(1)',
                  opacity: earned ? 1 : 0.55,
                }}
                title={`${earned ? t('rewards_badge_earned_prefix', lang) : t('rewards_badge_locked_prefix', lang)} ${t(`badge_${BADGE_KEY_MAP[badge.id] || badge.id}_unlock`, lang)}`}
              >
                <span style={styles.badgeEmoji} aria-hidden="true">
                  {earned ? badge.emoji : '🔒'}
                </span>
                <span style={styles.badgeLabel}>{t(`badge_${BADGE_KEY_MAP[badge.id] || badge.id}_label`, lang)}</span>
                {!earned && (
                  <span style={styles.badgeHint}>{t(`badge_${BADGE_KEY_MAP[badge.id] || badge.id}_unlock`, lang)}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Parent view note */}
      {mode === 'parent' && (
        <div style={styles.parentNote}>
          <strong>🦉</strong> {t('rewards_parent_note', lang)}
          {earnedIds.length < badgeTotal && (
            <> {t('rewards_badges_remaining', lang).replace('{n}', badgeTotal - earnedIds.length)}</>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 0' },
  starCard: {
    background: 'linear-gradient(135deg, var(--gold) 0%, #FFD93D 100%)',
    borderRadius: 'var(--radius-card)', padding: '28px 24px',
    display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
    boxShadow: 'var(--shadow-card)',
  },
  starEmoji: { fontSize: '3.5rem' },
  starNumber: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '3rem', color: 'var(--text-dark)', lineHeight: 1 },
  starLabel: { fontWeight: 700, color: 'var(--text-mid)', fontSize: '0.875rem' },
  milestone: {
    marginLeft: 'auto', background: 'rgba(255,255,255,0.5)',
    borderRadius: 'var(--radius-pill)', padding: '8px 20px',
    fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--text-dark)', fontSize: '1rem',
  },
  sectionTitle: {
    fontFamily: "'Baloo 2', cursive", fontWeight: 800,
    color: 'var(--plum)', fontSize: '1.4rem', marginBottom: '16px',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  badgeCount: {
    background: 'var(--violet)', color: '#fff',
    fontSize: '0.75rem', fontFamily: "'Nunito', sans-serif",
    padding: '4px 12px', borderRadius: 'var(--radius-pill)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '14px',
  },
  badgeCard: {
    background: '#fff', borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-small)', padding: '20px 16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    textAlign: 'center', transition: 'transform 0.2s ease',
  },
  badgeEmoji: { fontSize: '2.25rem' },
  badgeLabel: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.875rem' },
  badgeHint: { fontSize: '0.7rem', color: 'var(--text-mid)', lineHeight: 1.4 },
  parentNote: {
    background: 'rgba(107,63,160,0.06)', borderRadius: 'var(--radius-card)',
    padding: '16px 20px', fontSize: '0.875rem', color: 'var(--text-mid)',
    border: '1px solid rgba(107,63,160,0.12)', lineHeight: 1.7,
  },
}
