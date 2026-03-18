import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

import Header from '../src/components/layout/Header'
import TabNav from '../src/components/layout/TabNav'
import Hero from '../src/components/layout/Hero'
import HomePanel from '../src/components/HomePanel'
import AITutor from '../src/components/AITutor'
import QuizPanel from '../src/components/QuizPanel'
import ProgressPanel from '../src/components/ProgressPanel'
import CraftsPanel from '../src/components/CraftsPanel'
import RewardsPanel from '../src/components/RewardsPanel'
import SENPanel from '../src/components/SENPanel'
import NameModal from '../src/components/NameModal'
import FloatingSENButton from '../src/components/FloatingSENButton'

import {
  getMode, setMode as saveMode,
  getChildName,
  getStars, getBadges,
  updateStreak, getStreak,
  setLastVisit,
} from '../src/utils/storage'

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

  // Hydrate from localStorage on mount (client-side only)
  useEffect(() => {
    const savedMode  = getMode()
    const savedName  = getChildName()
    const savedStars = getStars()
    const savedBadges = getBadges()
    const currentStreak = updateStreak()

    setMode(savedMode)
    setChildName(savedName)
    setStars(savedStars)
    setBadges(savedBadges)
    setStreak(currentStreak)
    setLastVisit()

    if (!savedName) setShowNameModal(true)
    setHydrated(true)
  }, [])

  function handleModeToggle(newMode) {
    setMode(newMode)
    saveMode(newMode)
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
    <HomePanel      key={panelKey} {...sharedProps} childName={childName} stars={stars} streak={streak} onStarsChange={refreshStars} />,
    <AITutor        key={panelKey} {...sharedProps} childName={childName} />,
    <QuizPanel      key={panelKey} {...sharedProps} onStarsChange={refreshStars} onBadgesChange={refreshBadges} />,
    <ProgressPanel  key={panelKey} {...sharedProps} childName={childName} stars={stars} />,
    <CraftsPanel    key={panelKey} {...sharedProps} onBadgesChange={refreshBadges} />,
    <RewardsPanel   key={panelKey} {...sharedProps} stars={stars} badges={badges} />,
    <SENPanel       key={panelKey} {...sharedProps} />,
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
        <Header mode={mode} onToggle={handleModeToggle} />
        <TabNav activeTab={activeTab} onTabChange={handleTabChange} mode={mode} />
        <Hero mode={mode} />
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
