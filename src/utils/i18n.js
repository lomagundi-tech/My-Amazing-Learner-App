import { TRANSLATIONS } from '../data/translations'

// t('key', lang) → translated string, falls back to English, then the raw key.
export function t(key, lang = 'en') {
  const l = lang || 'en'
  return (TRANSLATIONS[l]?.[key]) ?? (TRANSLATIONS.en?.[key]) ?? key
}
