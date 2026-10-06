import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { SECTIONS, EMAIL, SOCIAL_LINKS } from '../data/site'
import { ArrowUpRight, Moon, Sun } from './Icons'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    const { t } = useLanguage()

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={t.nav.theme}
            title={t.nav.theme}
            className="grid h-9 w-9 place-items-center rounded-full border border-line/15 text-fg transition-colors duration-300 hover:border-fg"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
                    transition={{ duration: 0.25 }}
                >
                    {theme === 'dark' ? <Sun /> : <Moon />}
                </motion.span>
            </AnimatePresence>
        </button>
    )
}

const LanguageSwitch = () => {
    const { language, setLanguage, t } = useLanguage()

    return (
        <div role="group" aria-label={t.nav.language} className="flex h-9 items-center rounded-full border border-line/15 p-1 font-mono text-[11px]">
            {['en', 'es'].map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    className={`relative h-full rounded-full px-2.5 uppercase transition-colors duration-300 ${language === code ? 'text-bg' : 'text-muted hover:text-fg'}`}
                >
                    {language === code && (
                        <motion.span
                            layoutId="languagePill"
                            className="absolute inset-0 rounded-full bg-fg"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                    )}
                    <span className="relative">{code}</span>
                </button>
            ))}
        </div>
    )
}

const Header = ({ onNavigate, showSections = true }) => {
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState(null)
    const { t } = useLanguage()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24)
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Highlight the nav item for the section currently in view
    useEffect(() => {
        if (!showSections) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id)
                })
            },
            { rootMargin: '-45% 0px -50% 0px' }
        )

        SECTIONS.forEach((id) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [showSections])

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isMenuOpen])

    const handleNavClick = (event, section) => {
        event.preventDefault()
        setIsMenuOpen(false)
        onNavigate?.(section)
    }

    const currentSection = showSections ? activeSection : null

    const navItems = SECTIONS.map((section, index) => ({
        id: section,
        href: `/#${section}`,
        label: t.nav[section],
        index: String(index + 1).padStart(2, '0'),
    }))

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <div
                className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled || isMenuOpen
                    ? 'border-line/10 bg-bg/80 backdrop-blur-xl'
                    : 'border-transparent bg-transparent'
                    }`}
            >
                <div className={`container-x relative flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled || isMenuOpen ? 'h-16' : 'h-16 md:h-20'}`}>
                    {/* Logo */}
                    <a
                        href="/"
                        onClick={(event) => handleNavClick(event, null)}
                        className="group flex items-center gap-3"
                        aria-label="Nico Avayú — Home"
                    >
                        <img
                            src="/images/logo_small.png"
                            alt=""
                            className="h-8 w-auto invert transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] dark:invert-0"
                        />
                        <span className="font-display text-[15px] font-semibold uppercase tracking-[0.02em] text-fg">
                            Nico Avayú
                        </span>
                    </a>

                    {/* Desktop nav */}
                    <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 lg:flex" aria-label="Primary">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.href}
                                onClick={(event) => handleNavClick(event, item.id)}
                                aria-current={currentSection === item.id ? 'true' : undefined}
                                className={`group relative flex items-baseline gap-1.5 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${currentSection === item.id ? 'text-fg' : 'text-muted hover:text-fg'}`}
                            >
                                <span className="font-mono text-[10px] text-accent-ink">{item.index}</span>
                                {item.label}
                                {currentSection === item.id && (
                                    <motion.span
                                        layoutId="navIndicator"
                                        className="absolute inset-x-4 -bottom-0.5 h-px bg-fg"
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}
                            </a>
                        ))}
                        <a
                            href="/cv"
                            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-fg"
                        >
                            {t.nav.cv}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                    </nav>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 lg:flex">
                            <LanguageSwitch />
                            <ThemeToggle />
                        </div>
                        <a
                            href="/#contact"
                            onClick={(event) => handleNavClick(event, 'contact')}
                            className="hidden h-9 items-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-transform duration-300 hover:scale-[1.03] md:inline-flex"
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                            </span>
                            {t.nav.cta}
                        </a>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(open => !open)}
                            className="flex h-9 items-center gap-2 rounded-full border border-line/15 px-4 text-sm text-fg lg:hidden"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMenuOpen ? t.nav.close : t.nav.menu}
                            <span className="relative block h-2.5 w-3.5" aria-hidden="true">
                                <motion.span
                                    animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                                    className="absolute left-0 top-0 block h-px w-full bg-current"
                                />
                                <motion.span
                                    animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                                    className="absolute bottom-0 left-0 block h-px w-full bg-current"
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col overflow-y-auto bg-bg lg:hidden"
                    >
                        <nav className="container-x flex flex-col pt-8" aria-label="Mobile">
                            {[...navItems, { id: 'cv', href: '/cv', label: t.nav.cv, index: '04' }].map((item, index) => (
                                <motion.a
                                    key={item.id}
                                    href={item.href}
                                    onClick={item.id === 'cv' ? () => setIsMenuOpen(false) : (event) => handleNavClick(event, item.id)}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 + index * 0.06, duration: 0.6, ease: EASE_OUT_EXPO }}
                                    className="flex items-baseline justify-between border-b border-line/10 py-5 font-display text-4xl font-bold uppercase text-fg sm:text-5xl"
                                >
                                    {item.label}
                                    <span className="font-mono text-xs font-normal text-accent-ink">{item.index}</span>
                                </motion.a>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="container-x mt-auto flex flex-col gap-6 pb-10 pt-12"
                        >
                            <a href={`mailto:${EMAIL}`} className="text-lg text-fg">{EMAIL}</a>
                            <div className="flex gap-5">
                                {SOCIAL_LINKS.map((social) => (
                                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-muted">
                                        {social.label} <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <LanguageSwitch />
                                <ThemeToggle />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
