import { useState } from 'react'
import { MARKET_STATS, MARKET_GAPS } from '../data/marketData'
import { getTodaysChallenge } from '../data/dailyChallenges'
import { getStars, setStars, hasAnsweredTodaysChallenge, setDailyChallengedDate, clearAll } from '../utils/storage'
import ComingSoonModal from './ComingSoonModal'
import { t } from '../utils/i18n'

export default function HomePanel({ mode, onTabChange, onModeSwitch, onEditName, childName, stars, streak, onStarsChange, lang = 'en' }) {
  const isChild = mode === 'child'
  return (
    <div className="panel-enter">
      {isChild
        ? <ChildHome lang={lang} onTabChange={onTabChange} childName={childName} stars={stars} streak={streak} onStarsChange={onStarsChange} />
        : <ParentHome lang={lang} onTabChange={onTabChange} onModeSwitch={onModeSwitch} onEditName={onEditName} childName={childName} stars={stars} streak={streak} onStarsChange={onStarsChange} />
      }
    </div>
  )
}

const DC_SUBJECT_KEYS = {
  'Maths': 'quiz_subject_maths',
  'English': 'quiz_subject_english',
  'Science': 'quiz_subject_science',
  'Geography': 'myarea_cat_geography',
  'General Knowledge': 'quiz_subject_general',
}

/* ── Daily Challenge ────────────────────────────────────────── */
function DailyChallenge({ mode, onStarsChange, lang = 'en' }) {
  const challenge = getTodaysChallenge()
  const correctAnswer = challenge.options[challenge.correctIndex]
  const [selected, setSelected] = useState(null)
  const [answered] = useState(() => hasAnsweredTodaysChallenge())
  const isChild = mode === 'child'

  function pick(opt) {
    if (selected || answered) return
    setSelected(opt)
    setDailyChallengedDate()
    if (opt === correctAnswer) {
      // +2 stars for correct daily challenge answer (bonus for difficulty per spec)
      setStars(getStars() + 2)
      onStarsChange()
    }
  }

  const correct = selected === correctAnswer
  const subjectLabel = DC_SUBJECT_KEYS[challenge.subject]
    ? t(DC_SUBJECT_KEYS[challenge.subject], lang)
    : challenge.subject

  return (
    <div style={dc.card}>
      <div style={dc.badge}>{t('daily_challenge_title', lang)} — {subjectLabel}</div>
      <p style={dc.question}>{challenge.question}</p>

      {answered && !selected ? (
        <p style={dc.done}>{t('daily_challenge_answered', lang)}</p>
      ) : (
        <div style={dc.opts}>
          {challenge.options.map((opt) => {
            let bg = 'rgba(255,255,255,0.6)'
            if (selected) {
              if (opt === correctAnswer) bg = 'rgba(78,205,196,0.3)'
              else if (opt === selected) bg = 'rgba(255,107,107,0.3)'
            }
            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                disabled={!!selected}
                style={{ ...dc.optBtn, background: bg }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {selected && (
        <>
          <p style={{ ...dc.result, color: correct ? '#1a6b67' : '#b22222' }}>
            {correct
              ? (isChild ? t('daily_challenge_correct_child', lang) : t('daily_challenge_correct_parent', lang))
              : (isChild
                  ? t('daily_challenge_wrong_child', lang).replace('{answer}', correctAnswer)
                  : t('daily_challenge_wrong_parent', lang).replace('{answer}', correctAnswer))}
          </p>
          <div style={dc.funFact}>
            <span style={dc.funFactIcon} aria-hidden="true">💡</span>
            <div>
              <p style={{ ...dc.funFactText, fontWeight: 700, marginBottom: '4px' }}>{t('daily_challenge_fun_fact', lang)}</p>
              <p style={dc.funFactText}>{challenge.funFact}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Pricing ─────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    period: 'forever',
    periodKey: 'pricing_free_period',
    colour: 'var(--mint)',
    features: [
      'pricing_free_f1',
      'pricing_free_f2',
      'pricing_free_f3',
      'pricing_free_f4',
      'pricing_free_f5',
      'pricing_free_f6',
    ],
    ctaKey: 'pricing_free_cta',
    ctaStyle: 'outline',
  },
  {
    id: 'amazing',
    name: 'AMAZING',
    price: '£4.99',
    period: '/mo  ·  or £39.99/yr',
    periodKey: 'pricing_amazing_period',
    colour: 'var(--violet)',
    recommended: true,
    features: [
      'pricing_amazing_f1',
      'pricing_amazing_f2',
      'pricing_amazing_f3',
      'pricing_amazing_f4',
      'pricing_amazing_f5',
      'pricing_amazing_f6',
    ],
    ctaKey: 'pricing_amazing_cta',
    ctaStyle: 'primary',
  },
  {
    id: 'family',
    name: 'AMAZING Family',
    price: '£7.99',
    period: '/mo  ·  or £59.99/yr',
    periodKey: 'pricing_family_period',
    colour: 'var(--gold)',
    features: [
      'pricing_family_f1',
      'pricing_family_f2',
      'pricing_family_f3',
      'pricing_family_f4',
      'pricing_family_f5',
    ],
    ctaKey: 'pricing_family_cta',
    ctaStyle: 'gold',
  },
]

function PricingSection({ onTabChange, onModeSwitch, lang = 'en' }) {
  const [modalTier, setModalTier] = useState(null)

  function handleCta(plan) {
    if (plan.id === 'free') {
      onModeSwitch('child') // switch to child mode first, per spec
      onTabChange(2)        // then go to Activities tab
    } else {
      setModalTier(plan.name)
    }
  }

  return (
    <div>
      {modalTier && <ComingSoonModal lang={lang} tier={modalTier} onClose={() => setModalTier(null)} />}
      <h3 style={{ ...s.sectionTitle, color: 'var(--plum)' }}>{t('pricing_title', lang)}</h3>
      <p style={{ ...s.intro, marginBottom: '20px' }}>{t('pricing_intro', lang)}</p>
      <div style={p.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="card"
            style={{
              ...p.card,
              borderTop: `4px solid ${plan.colour}`,
              ...(plan.recommended ? p.cardRecommended : {}),
            }}
          >
            {plan.recommended && (
              <div style={p.recommendedBadge}>{t('pricing_recommended', lang)}</div>
            )}
            <h4 style={{ ...p.planName, color: plan.colour === 'var(--gold)' ? '#b8860b' : plan.colour }}>
              {plan.name}
            </h4>
            <div style={p.priceRow}>
              <span style={p.priceNum}>{plan.price}</span>
              <span style={p.pricePeriod}>{t(plan.periodKey, lang)}</span>
            </div>
            <ul style={p.featureList}>
              {plan.features.map((f) => (
                <li key={f} style={p.featureItem}>
                  <span style={{ color: plan.colour === 'var(--gold)' ? '#b8860b' : plan.colour }} aria-hidden="true">✓</span>
                  {t(f, lang)}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCta(plan)}
              className={plan.ctaStyle === 'primary' ? 'btn btn-primary' : plan.ctaStyle === 'gold' ? 'btn btn-gold' : 'btn btn-outline'}
              style={p.ctaBtn}
            >
              {t(plan.ctaKey, lang)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Parent Home ────────────────────────────────────────────── */
function ParentHome({ onTabChange, onModeSwitch, onEditName, childName, stars, streak, onStarsChange, lang = 'en' }) {
  const name = childName || 'your learner'
  const [confirmClear, setConfirmClear] = useState(false)

  function handleClearData() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearAll()
    window.location.reload()
  }

  return (
    <div style={s.section}>
      {/* Welcome + streak */}
      <div style={s.welcomeCard}>
        {childName && (
          <div style={s.profileRow}>
            <span style={s.profileLabel}>Editing profile for: <strong>{childName}</strong></span>
            <button onClick={onEditName} style={s.editNameBtn}>{t('parent_edit_name', lang)}</button>
          </div>
        )}
        <div style={s.welcomeTop}>
          <div>
            <h2 style={{ ...s.heading, color: 'var(--plum)' }}>
              {t('parent_welcome_back', lang)}{childName ? `, ${childName}'s parent` : ''}! 🦉
            </h2>
            <p style={s.intro}>
              Track {name}&apos;s learning, chat with Sparky, and explore activities matched to their level.
            </p>
          </div>
          {streak > 0 && (
            <div style={s.streakBadge}>
              <span style={s.streakFlame}>🔥</span>
              <span style={s.streakNum}>{streak}</span>
              <span style={s.streakLabel}>day streak</span>
            </div>
          )}
        </div>
        <div style={s.quickStats}>
          <div style={s.statPill}>⭐ {stars} stars earned</div>
          <button className="btn btn-primary" onClick={() => onTabChange(1)} style={{ fontSize: '0.875rem' }}>
            {t('parent_open_sparky', lang)}
          </button>
        </div>
      </div>

      {/* Daily challenge */}
      <DailyChallenge lang={lang} mode="parent" onStarsChange={onStarsChange} />

      {/* Market Stats */}
      <div>
        <h3 style={{ ...s.sectionTitle, color: 'var(--plum)' }}>{t('parent_market_heading', lang)}</h3>
        <div style={s.statsGrid}>
          {MARKET_STATS.map((stat) => (
            <div key={stat.id} className="card" style={{ ...s.statCard, borderTop: `4px solid ${stat.colour}` }}>
              <div style={{ ...s.statValue, color: stat.colour }}>{stat.value}</div>
              <div style={s.statLabel}>{t('market_stat_' + stat.id + '_label', lang)}</div>
              <div style={s.statSub}>{t('market_stat_' + stat.id + '_sub', lang)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Gaps */}
      <div>
        <h3 style={{ ...s.sectionTitle, color: 'var(--plum)' }}>{t('parent_gaps_heading', lang)}</h3>
        <div style={s.gapsGrid}>
          {MARKET_GAPS.map((gap) => (
            <div key={gap.id} className="card" style={{ ...s.gapCard, borderLeft: `4px solid ${gap.colour}` }}>
              <span style={{ ...s.gapTag, background: gap.colour }}>{t('market_gap_' + gap.id + '_tag', lang)}</span>
              <h4 style={s.gapTitle}>{t('market_gap_' + gap.id + '_title', lang)}</h4>
              <p style={s.gapDesc}>{t('market_gap_' + gap.id + '_desc', lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <PricingSection lang={lang} onTabChange={onTabChange} onModeSwitch={onModeSwitch} />

      {/* Shop Banner */}
      <div style={s.shopBanner}>
        <div>
          <h3 style={s.shopHeading}>{t('parent_shop_heading', lang)}</h3>
          <p style={s.shopDesc}>{t('parent_shop_desc', lang)}</p>
        </div>
        <a href="https://myamazinglearner.co.uk" target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ flexShrink: 0 }}>
          {t('parent_shop_cta', lang)}
        </a>
      </div>

      {/* GDPR — Clear My Data */}
      <div style={s.gdprCard}>
        <div>
          <p style={s.gdprTitle}>{t('parent_gdpr_title', lang)}</p>
          <p style={s.gdprDesc}>{t('parent_gdpr_desc', lang)}</p>
        </div>
        {confirmClear ? (
          <div style={s.gdprConfirmRow}>
            <span style={s.gdprConfirmText}>{t('parent_clear_confirm', lang)}</span>
            <button onClick={handleClearData} style={{ ...s.gdprBtn, background: 'var(--coral)', color: '#fff' }}>
              {t('parent_clear_yes', lang)}
            </button>
            <button onClick={() => setConfirmClear(false)} style={s.gdprBtn}>
              {t('parent_clear_cancel', lang)}
            </button>
          </div>
        ) : (
          <button onClick={handleClearData} style={s.gdprBtn}>
            {t('parent_clear_button', lang)}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Child Home ─────────────────────────────────────────────── */
function ChildHome({ onTabChange, childName, stars, streak, onStarsChange, lang = 'en' }) {
  const greeting = childName ? `Hi ${childName}!` : 'Hi there!'
  const activities = [
    { labelKey: 'child_activity_sparky', tab: 1, bg: 'var(--violet)', descKey: 'child_activity_sparky_desc' },
    { labelKey: 'child_activity_quiz', tab: 2, bg: 'var(--coral)', descKey: 'child_activity_quiz_desc' },
    { labelKey: 'child_activity_progress', tab: 3, bg: 'var(--mint)', descKey: 'child_activity_progress_desc' },
    { labelKey: 'child_activity_craft', tab: 4, bg: 'var(--gold)', descKey: 'child_activity_craft_desc' },
    { labelKey: 'child_activity_rewards', tab: 5, bg: 'var(--plum)', descKey: 'child_activity_rewards_desc' },
    { labelKey: 'child_activity_sen', tab: 6, bg: 'var(--sky)', descKey: 'child_activity_sen_desc' },
  ]

  return (
    <div style={s.section}>
      <div style={s.childWelcome}>
        <span style={s.childEmoji} aria-hidden="true">🦄</span>
        <h2 style={{ ...s.heading, color: 'var(--coral)' }}>{greeting} {t('child_ready_headline', lang)}</h2>
        <div style={s.childStats}>
          {stars > 0 && <span style={s.statPill}>⭐ {stars} stars</span>}
          {streak > 1 && <span style={{ ...s.statPill, background: 'var(--coral)' }}>🔥 {streak} day streak!</span>}
        </div>
      </div>

      {/* Daily challenge */}
      <DailyChallenge lang={lang} mode="child" onStarsChange={onStarsChange} />

      <div style={s.activitiesGrid}>
        {activities.map((act) => (
          <button
            key={act.tab}
            onClick={() => onTabChange(act.tab)}
            style={{ ...s.activityCard, background: act.bg }}
            aria-label={t(act.labelKey, lang)}
          >
            <span style={s.activityLabel}>{t(act.labelKey, lang)}</span>
            <span style={s.activityDesc}>{t(act.descKey, lang)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Styles ─────────────────────────────────────────────────── */
const s = {
  section: { display: 'flex', flexDirection: 'column', gap: '32px', padding: '32px 0' },
  welcomeCard: { background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '28px 32px' },
  welcomeTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' },
  heading: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '8px' },
  intro: { color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '560px' },
  streakBadge: {
    background: 'linear-gradient(135deg, #FF6B6B, #FFB347)',
    borderRadius: 'var(--radius-card)', padding: '12px 16px', textAlign: 'center',
    flexShrink: 0, minWidth: '80px',
  },
  streakFlame: { fontSize: '1.5rem', display: 'block' },
  streakNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, color: '#fff', fontSize: '1.75rem', display: 'block', lineHeight: 1 },
  streakLabel: { fontSize: '0.65rem', color: 'rgba(255,255,255,0.9)', fontWeight: 700, textTransform: 'uppercase' },
  quickStats: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  statPill: {
    background: 'rgba(255,179,71,0.15)', color: 'var(--text-dark)',
    padding: '6px 14px', borderRadius: 'var(--radius-pill)',
    fontWeight: 700, fontSize: '0.875rem', fontFamily: "'Nunito', sans-serif",
  },
  sectionTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', marginBottom: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' },
  statCard: { textAlign: 'center' },
  statValue: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px' },
  statLabel: { fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dark)', marginBottom: '2px' },
  statSub: { fontSize: '0.75rem', color: 'var(--text-mid)' },
  gapsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' },
  gapCard: { display: 'flex', flexDirection: 'column', gap: '8px' },
  gapTag: { display: 'inline-block', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-start' },
  gapTitle: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-dark)' },
  gapDesc: { fontSize: '0.825rem', color: 'var(--text-mid)', lineHeight: 1.6 },
  shopBanner: {
    background: 'linear-gradient(135deg, var(--plum) 0%, var(--violet) 100%)',
    borderRadius: 'var(--radius-card)', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap',
  },
  shopHeading: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#fff', fontSize: '1.15rem', marginBottom: '6px' },
  shopDesc: { color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', maxWidth: '480px' },
  childWelcome: { textAlign: 'center', padding: '8px 0' },
  childEmoji: { fontSize: '3.5rem', display: 'block', marginBottom: '12px' },
  childStats: { display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '12px' },
  activitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' },
  activityCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
    padding: '24px 16px', borderRadius: 'var(--radius-card)', border: 'none', cursor: 'pointer',
    color: '#fff', minHeight: '110px', boxShadow: 'var(--shadow-card)',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease', fontFamily: "'Nunito', sans-serif",
  },
  activityLabel: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem' },
  activityDesc: { fontSize: '0.8rem', opacity: 0.9 },
  profileRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '12px', paddingBottom: '12px',
    borderBottom: '1px solid rgba(61,26,94,0.08)',
  },
  profileLabel: { fontSize: '0.8rem', color: 'var(--text-mid)' },
  editNameBtn: {
    background: 'transparent', border: 'none',
    color: 'var(--violet)', fontSize: '0.8rem', fontWeight: 700,
    cursor: 'pointer', textDecoration: 'underline',
    padding: '4px 0', minHeight: '44px', fontFamily: "'Nunito', sans-serif",
  },
  gdprCard: {
    background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-small)',
    padding: '20px 24px', border: '1px solid rgba(0,0,0,0.07)',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  gdprTitle: { fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' },
  gdprDesc: { fontSize: '0.8rem', color: 'var(--text-mid)', lineHeight: 1.6 },
  gdprBtn: {
    background: 'transparent', border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '8px', padding: '8px 16px',
    fontSize: '0.8rem', color: 'var(--text-mid)', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 600, minHeight: '36px',
    alignSelf: 'flex-start',
  },
  gdprConfirmRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  gdprConfirmText: { fontSize: '0.8rem', color: 'var(--coral)', fontWeight: 700 },
}

const p = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
  card: { display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', padding: '28px 24px 24px' },
  cardRecommended: {
    boxShadow: '0 0 0 2px var(--violet), var(--shadow-card)',
    transform: 'translateY(-4px)',
  },
  recommendedBadge: {
    position: 'absolute', top: '-1px', right: '20px',
    background: 'var(--violet)', color: '#fff',
    fontSize: '0.65rem', fontWeight: 700, padding: '4px 10px',
    borderRadius: '0 0 8px 8px', letterSpacing: '0.03em',
  },
  planName: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' },
  priceNum: { fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2rem', color: 'var(--text-dark)' },
  pricePeriod: { fontSize: '0.75rem', color: 'var(--text-mid)', lineHeight: 1.4 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  featureItem: { display: 'flex', gap: '8px', fontSize: '0.875rem', color: 'var(--text-dark)', alignItems: 'flex-start', lineHeight: 1.4 },
  ctaBtn: { width: '100%', minHeight: '48px', fontSize: '0.95rem', marginTop: 'auto' },
}

const dc = {
  card: {
    background: 'linear-gradient(135deg, #fff 0%, #f8f0ff 100%)',
    borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-small)',
    padding: '24px 28px', border: '2px solid rgba(107,63,160,0.12)',
  },
  iconWrap: {
    fontSize: '3.5rem', textAlign: 'center', margin: '8px 0 12px',
    lineHeight: 1,
  },
  badge: {
    display: 'inline-block', background: 'var(--violet)', color: '#fff',
    fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px',
    borderRadius: 'var(--radius-pill)', marginBottom: '12px', letterSpacing: '0.04em',
  },
  question: { fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: 'var(--plum)', fontSize: '1.1rem', marginBottom: '16px' },
  opts: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  optBtn: {
    padding: '10px 20px', borderRadius: 'var(--radius-pill)',
    border: '2px solid rgba(107,63,160,0.15)', cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.9rem',
    transition: 'background 0.2s ease', minHeight: '44px',
  },
  result: { marginTop: '12px', fontWeight: 700, fontSize: '0.95rem' },
  done: { color: 'var(--text-mid)', fontSize: '0.9rem', fontStyle: 'italic' },
  funFact: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    marginTop: '14px', padding: '12px 14px',
    background: 'rgba(78,205,196,0.12)', borderRadius: '12px',
    border: '1px solid rgba(78,205,196,0.3)',
  },
  funFactIcon: { fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' },
  funFactText: { fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: 1.6, margin: 0 },
}
