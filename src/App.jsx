import { useState, useEffect, useCallback } from 'react'
import { MotionConfig } from 'framer-motion'
import Layout from './components/Layout'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import ProjectModal from './components/ProjectModal'
import About from './components/About'
import Contact from './components/Contact'
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

const scrollToSection = (section, behavior = 'smooth') => {
  const element = document.getElementById(section)
  element?.scrollIntoView({ behavior })
  return Boolean(element)
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute)
  const [openProject, setOpenProject] = useState(null)

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

  // Shared links (/work/... or /#section) land on the matching section
  useEffect(() => {
    const section = window.location.hash.slice(1) || (getWorkRoute(getCurrentRoute()) ? 'work' : null)
    if (!section) return

    const timer = setTimeout(() => scrollToSection(section, 'auto'), 60)
    return () => clearTimeout(timer)
  }, [])

  const handleWorkCategoryChange = (category) => {
    const nextRoute = WORK_CATEGORY_ROUTES[category] || WORK_CATEGORY_ROUTES[DEFAULT_WORK_CATEGORY]

    if (getCurrentRoute() !== nextRoute) {
      window.history.pushState({}, '', nextRoute)
      setRoute(nextRoute)
    }
  }

  const handleNavigate = (section = null) => {
    const isCv = getCurrentRoute() === '/cv'

    if (section && !isCv && scrollToSection(section)) return

    if (getCurrentRoute() !== '/') {
      window.history.pushState({}, '', section ? `/#${section}` : '/')
      setRoute('/')
    }

    if (section) {
      setTimeout(() => scrollToSection(section), 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const closeProject = useCallback(() => setOpenProject(null), [])

  const isCvRoute = route === '/cv'
  const activeWorkCategory = getWorkRoute(route)?.category || DEFAULT_WORK_CATEGORY

  return (
    <MotionConfig reducedMotion="user">
      <Layout onNavigate={handleNavigate} showSections={!isCvRoute}>
        {isCvRoute ? (
          <CvView />
        ) : (
          <>
            <Hero onNavigate={handleNavigate} onOpenProject={setOpenProject} />
            <ProjectGrid
              activeCategory={activeWorkCategory}
              onCategoryChange={handleWorkCategoryChange}
              onOpenProject={setOpenProject}
            />
            <About onNavigate={handleNavigate} />
            <Contact />
          </>
        )}
      </Layout>
      <ProjectModal project={openProject} onClose={closeProject} />
    </MotionConfig>
  )
}

export default App
