import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import ArchiveView from './components/ArchiveView'

function App() {
  const [view, setView] = useState({ type: 'home', category: null })

  // Only scroll to top when changing between home and archive types
  useEffect(() => {
    if (view.type === 'archive') {
      window.scrollTo(0, 0)
    }
  }, [view.type])

  const handleViewAll = (category) => {
    setView({ type: 'archive', category })
  }

  const handleBackToHome = (section = null) => {
    setView({ type: 'home', category: null })
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <Layout onLogoClick={handleBackToHome}>
      {view.type === 'home' ? (
        <>
          <ProjectGrid />
          <About />
          <Contact />
        </>
      ) : (
        <ArchiveView
          category={view.category}
          onBack={handleBackToHome}
        />
      )}
    </Layout>
  )
}

export default App
