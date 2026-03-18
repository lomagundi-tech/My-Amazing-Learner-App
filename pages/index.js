import { useState, useEffect } from 'react'
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

const PANELS = [HomePanel, AITutor, QuizPanel, ProgressPanel, CraftsPanel, RewardsPanel, SENPanel]

export default function App() {
  const [mode, setMode] = useState('parent')
  const [activeTab, setActiveTab] = useState(0)
  const [panelKey, setPanelKey] = useState(0) // forces re-mount for fadeUp animation

  // Restore last-used mode from localStorage on first load
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('mal_mode')
      if (savedMode === 'parent' || savedMode === 'child') setMode(savedMode)
    } catch {}
  }, [])

  function handleModeToggle(newMode) {
    setMode(newMode)
    try { localStorage.setItem('mal_mode', newMode) } catch {}
  }

  function handleTabChange(tabIndex) {
    setActiveTab(tabIndex)
    setPanelKey((k) => k + 1) // re-trigger fadeUp
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ActivePanel = PANELS[activeTab]

  return (
    <>
      <Head>
        <title>My Amazing Learner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3D1A5E" />
      </Head>

      {/* Animated blob background */}
      <div className="blob-container" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Sticky header */}
      <Header mode={mode} onToggle={handleModeToggle} />

      {/* Sticky tab nav */}
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} mode={mode} />

      {/* Hero banner */}
      <Hero mode={mode} />

      {/* Main content */}
      <main>
        <div className="container">
          <ActivePanel
            key={panelKey}
            mode={mode}
            onTabChange={handleTabChange}
          />
        </div>
      </main>
    </>
  )
}
