import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

import Header from '../src/components/layout/Header'
import TabNav from '../src/components/layout/TabNav'
import Hero from '../src/components/layout/Hero'
import HomePanel from '../src/components/HomePanel'
import AITutor from '../src/components/AITutor'
import QuizPanel from '../src/components/QuizPanel'
import ParentActivitiesPanel from '../src/components/ParentActivitiesPanel'
import ProgressPanel from '../src/components/ProgressPanel'
import CraftsPanel from '../src/components/CraftsPanel'
import RewardsPanel from '../src/components/RewardsPanel'
import SENPanel from '../src/components/SENPanel'
import AdventurePanel from '../src/components/AdventurePanel'
import MyAreaPanel from '../src/components/MyAreaPanel'
import NameModal from '../src/components/NameModal'
import FloatingSENButton from '../src/components/FloatingSENButton'

import {
  getMode, setMode as saveMode,
  getLanguage, setLanguage as saveLanguage,
  getChildName,
  getStars, getBadges,
  updateStreak, getStreak,
  earnBadge,
  setLastVisit,
  getDeviceId,
} from '../src/utils/storage'
import { LANGUAGES } from '../src/data/translations'

export default function App() {
  const [mode, setMode]         = useState('parent')
  const [activeTab, setActiveTab] = useState(0)
  const [panelKey, setPanelKey] = useState(0)
  const [childName, setChildName] = useState('')
  const [stars, setStars]       = useState(0)
  const [badges, setBadges]     = useState([])
  const [streak, setStreak]     = useState(0)
  const [showNameModal, setShowNameModal] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [lang, setLang] = useState('en')

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    const savedMode  = getMode()
    const savedName  = getChildName()
    const savedStars = getStars()
    const savedBadges = getBadges()
    const currentStreak = updateStreak()
    const savedLang = getLanguage()
    const savedLangData = LANGUAGES.find((l) => l.code === savedLang)

    // Streak milestone badge awards (check each time streak updates on load)
    if (currentStreak >= 7)  earnBadge('week_warrior')
    if (currentStreak >= 14) earnBadge('fortnight_champ')
    if (currentStreak >= 30) earnBadge('amazing_month')

    setMode(savedMode)
    setChildName(savedName)
    setStars(savedStars)
    setBadges(getBadges()) // re-read after potential badge awards
    setStreak(currentStreak)
    setDeviceId(getDeviceId())
    setLang(savedLang)
    document.documentElement.dir = savedLangData?.dir || 'ltr'
    document.documentElement.lang = savedLang
    setLastVisit()

    if (!savedName) setShowNameModal(true)
    setHydrated(true)
  }, [])

  function handleModeToggle(newMode) {
    setMode(newMode)
    saveMode(newMode)
  }

  function handleLangChange(code) {
    setLang(code)
    saveLanguage(code)
    const langData = LANGUAGES.find((l) => l.code === code)
    document.documentElement.dir = langData?.dir || 'ltr'
    document.documentElement.lang = code
  }

  function handleTabChange(tabIndex) {
    setActiveTab(tabIndex)
    setPanelKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNameSave(name) {
    setChildName(name)
    setShowNameModal(false)
  }

  const refreshStars  = useCallback(() => setStars(getStars()), [])
  const refreshBadges = useCallback(() => setBadges(getBadges()), [])

  if (!hydrated) return null // prevent SSR/localStorage mismatch

  const sharedProps = { mode, onTabChange: handleTabChange }

  const panels = [
    <HomePanel      key={panelKey} {...sharedProps} lang={lang} onModeSwitch={handleModeToggle} onEditName={() => setShowNameModal(true)} childName={childName} stars={stars} streak={streak} onStarsChange={refreshStars} />,
    <AITutor        key={panelKey} {...sharedProps} lang={lang} childName={childName} />,
    mode === 'parent'
      ? <ParentActivitiesPanel key={panelKey} lang={lang} childName={childName} />
      : <QuizPanel key={panelKey} {...sharedProps} lang={lang} onStarsChange={refreshStars} onBadgesChange={refreshBadges} />,
    <ProgressPanel  key={panelKey} {...sharedProps} lang={lang} childName={childName} stars={stars} />,
    <CraftsPanel    key={panelKey} {...sharedProps} lang={lang} onBadgesChange={refreshBadges} />,
    <RewardsPanel   key={panelKey} {...sharedProps} lang={lang} stars={stars} badges={badges} />,
    <SENPanel         key={panelKey} {...sharedProps} lang={lang} />,
    <AdventurePanel   key={panelKey} lang={lang} childName={childName} deviceId={deviceId} onStarsChange={refreshStars} onBadgesChange={refreshBadges} />,
    <MyAreaPanel      key={panelKey} lang={lang} childName={childName} onStarsChange={refreshStars} onBadgesChange={refreshBadges} />,
  ]

  return (
    <>
      <Head>
        <title>My Amazing Learner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3D1A5E" />
        <style>{`
          @media print {
            .no-print { display: none !important; }
            #print-report { display: block !important; }
            body { background: white; }
          }
        `}</style>
      </Head>

      {/* Blob background */}
      <div className="blob-container no-print" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Name modal — first visit */}
      {showNameModal && <NameModal onSave={handleNameSave} />}

      <div className="no-print">
        <Header
          mode={mode}
          onToggle={handleModeToggle}
          streak={streak}
          lang={lang}
          onLangChange={handleLangChange}
        />
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} mode={mode} lang={lang} />
        <Hero mode={mode} lang={lang} />
      </div>

      <main>
        <div className="container">
          {panels[activeTab]}
        </div>
      </main>

      <FloatingSENButton activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  )
}
