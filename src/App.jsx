import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import ArchiveView from './components/ArchiveView'
import CvView from './components/CvView'

const getCurrentRoute = () => {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path || '/'
}

function App() {
  const [view, setView] = useState({ type: 'home', category: null })
  const [route, setRoute] = useState(getCurrentRoute)

  // Only scroll to top when changing between home and archive types
  useEffect(() => {
    if (view.type === 'archive') {
      window.scrollTo(0, 0)
    }
  }, [view.type])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getCurrentRoute())
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleViewAll = (category) => {
    setView({ type: 'archive', category })
  }

  const handleBackToHome = (section = null) => {
    if (section?.preventDefault) {
      section.preventDefault()
      section = null
    }

    if (getCurrentRoute() !== '/') {
      window.history.pushState({}, '', section ? `/#${section}` : '/')
      setRoute('/')
    }

    setView({ type: 'home', category: null })
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const isCvRoute = route === '/cv'

  return (
    <Layout onLogoClick={handleBackToHome}>
      {isCvRoute ? (
        <CvView />
      ) : view.type === 'home' ? (
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
