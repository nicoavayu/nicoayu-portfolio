import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ProjectGrid from './components/ProjectGrid'
import About from './components/About'
import Contact from './components/Contact'
import ArchiveView from './components/ArchiveView'
import CvView from './components/CvView'

const DEFAULT_WORK_CATEGORY = 'motion'

const WORK_CATEGORY_ROUTES = {
  motion: '/work/motion-graphics',
  short_form: '/work/short-form-ads',
}

const WORK_ROUTE_CATEGORIES = Object.entries(WORK_CATEGORY_ROUTES).reduce((routes, [category, path]) => {
  routes[path] = category
  return routes
}, {})

const getWorkRoute = (path) => {
  if (path !== '/work' && !path.startsWith('/work/')) return null

  const category = WORK_ROUTE_CATEGORIES[path] || DEFAULT_WORK_CATEGORY
  return {
    category,
    canonicalPath: WORK_CATEGORY_ROUTES[category],
  }
}

const normalizePath = (path) => {
  const normalizedPath = path.replace(/\/+$/, '')
  return normalizedPath || '/'
}

const getCanonicalRoute = (path) => {
  const normalizedPath = normalizePath(path)
  return getWorkRoute(normalizedPath)?.canonicalPath || normalizedPath
}

const getCurrentRoute = () => getCanonicalRoute(window.location.pathname)

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
    const currentPath = normalizePath(window.location.pathname)
    const canonicalPath = getCanonicalRoute(currentPath)

    if (canonicalPath !== currentPath) {
      window.history.replaceState({}, '', canonicalPath)
    }

    const handlePopState = () => {
      const nextPath = normalizePath(window.location.pathname)
      const canonicalNextPath = getCanonicalRoute(nextPath)

      if (canonicalNextPath !== nextPath) {
        window.history.replaceState({}, '', canonicalNextPath)
      }

      setRoute(canonicalNextPath)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleWorkCategoryChange = (category) => {
    const nextRoute = WORK_CATEGORY_ROUTES[category] || WORK_CATEGORY_ROUTES[DEFAULT_WORK_CATEGORY]

    setView({ type: 'home', category: null })
    if (getCurrentRoute() !== nextRoute) {
      window.history.pushState({}, '', nextRoute)
      setRoute(nextRoute)
    }
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
  const workRoute = getWorkRoute(route)
  const activeWorkCategory = workRoute?.category || DEFAULT_WORK_CATEGORY

  return (
    <Layout onLogoClick={handleBackToHome}>
      {isCvRoute ? (
        <CvView />
      ) : view.type === 'home' || workRoute ? (
        <>
          <ProjectGrid
            activeCategory={activeWorkCategory}
            onCategoryChange={handleWorkCategoryChange}
          />
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
