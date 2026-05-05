import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button
            onClick={toggleTheme}
            className="relative w-12 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center px-1 transition-colors duration-300 group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                layout
                initial={false}
                animate={{
                    x: theme === 'dark' ? 24 : 0,
                    backgroundColor: theme === 'dark' ? '#f97316' : '#94a3b8'
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
            >
                {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-black">
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                )}
            </motion.div>
        </button>
    )
}

const Header = ({ onLogoClick }) => {
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { language, setLanguage, t } = useLanguage()
    const { theme, toggleTheme } = useTheme()
    const sectionNavItems = ['work', 'about', 'contact']

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (e) => {
        const href = e.currentTarget.getAttribute('href')
        if (href && href.startsWith('#')) {
            e.preventDefault()
            const section = href.substring(1)

            // Close mobile menu if open
            setIsMenuOpen(false)

            // Smooth scroll to section with offset for fixed header
            const element = document.getElementById(section)
            if (element) {
                const headerOffset = 100
                const elementPosition = element.getBoundingClientRect().top
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                })
            } else {
                // If section doesn't exist, trigger onLogoClick
                onLogoClick?.(section)
            }
        }
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md py-2 shadow-xl'
                : 'bg-transparent py-6'
                }`}
        >
            <div className={`flex items-center justify-between pl-6 md:pl-12 pr-6 md:pr-12 max-w-[1920px] mx-auto transition-all duration-500 ${scrolled ? 'min-h-[60px] md:min-h-[70px]' : 'min-h-[100px] md:min-h-[120px]'
                }`}>

                {/* Left: Desktop Nav / Mobile Placeholder */}
                <div className="w-12 lg:w-[420px] flex items-center">
                    <nav className="hidden lg:flex justify-between text-[10px] font-bold tracking-[0.2em] uppercase z-10 w-full">
                        {sectionNavItems.map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item}`}
                                onClick={handleNavClick}
                                className="hover:text-[#f97316] transition-colors duration-300 text-black dark:text-white whitespace-nowrap"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                {t.nav[item]}
                            </motion.a>
                        ))}
                        <motion.a
                            href="/cv"
                            className="hover:text-[#f97316] transition-colors duration-300 text-black dark:text-white whitespace-nowrap"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            {t.nav.cv}
                        </motion.a>
                    </nav>
                </div>

                {/* Center: Logo */}
                <div className="flex-1 flex justify-center">
                    <motion.a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onLogoClick?.() }}
                        className="group flex items-center gap-3 md:gap-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <motion.img
                            src="/images/logo_small.png"
                            alt="NIXON"
                            className={`w-auto object-contain transition-all duration-500 ${scrolled ? 'h-8 md:h-10' : 'h-12 md:h-16'} ${theme === 'dark' ? 'invert-0' : 'invert'}`}
                            whileHover={{
                                filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(346deg) brightness(98%) contrast(97%)'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className={`flex flex-col justify-center transition-all duration-500 ${scrolled ? 'gap-0' : 'gap-0.5'}`}>
                            <motion.span
                                className={`font-light tracking-[0.3em] uppercase text-black dark:text-white transition-all duration-500 ${scrolled ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'}`}
                                whileHover={{ color: '#f97316' }}
                                transition={{ duration: 0.3 }}
                            >
                                NICO
                            </motion.span>
                            <motion.span
                                className={`font-light tracking-[0.3em] uppercase text-black dark:text-white transition-all duration-500 ${scrolled ? 'text-[10px] md:text-xs' : 'text-xs md:text-sm'}`}
                                whileHover={{ color: '#f97316' }}
                                transition={{ duration: 0.3 }}
                            >
                                AVAYÚ
                            </motion.span>
                        </div>
                    </motion.a>
                </div>

                {/* Right: Desktop Controls / Mobile Hamburger */}
                <div className="w-12 lg:w-[420px] flex items-center justify-end">
                    {/* Desktop Controls */}
                    <div className={`hidden lg:flex flex-col items-end justify-center w-full transition-all duration-500 ${scrolled ? 'gap-1' : 'gap-2 pt-1'}`}>
                        {/* Refined Language Toggle */}
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <motion.button
                                    onClick={() => setLanguage('en')}
                                    className={`text-sm font-bold transition-all duration-300 ${language === 'en' ? 'text-[#f97316]' : 'opacity-30 hover:opacity-100 text-black dark:text-white'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    EN
                                </motion.button>
                                <span className="text-gray-400 dark:text-gray-600 font-light mx-1">|</span>
                                <motion.button
                                    onClick={() => setLanguage('es')}
                                    className={`text-sm font-bold transition-all duration-300 ${language === 'es' ? 'text-[#f97316]' : 'opacity-30 hover:opacity-100 text-black dark:text-white'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    ES
                                </motion.button>
                            </div>
                        </div>

                        {/* Theme Toggle Switch */}
                        <div className="flex justify-end w-full">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        </div>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden z-50 p-2 text-black dark:text-white"
                        aria-label="Toggle Menu"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between">
                            <motion.span
                                animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current block origin-left"
                            />
                            <motion.span
                                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-full h-0.5 bg-current block"
                            />
                            <motion.span
                                animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                                className="w-full h-0.5 bg-current block origin-left"
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white dark:bg-black z-40 flex flex-col items-center justify-center lg:hidden"
                    >
                        <nav className="flex flex-col items-center gap-8 mb-12">
                            {sectionNavItems.map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item}`}
                                    onClick={handleNavClick}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className="text-2xl font-black tracking-widest uppercase text-black dark:text-white hover:text-[#f97316] transition-colors"
                                >
                                    {t.nav[item]}
                                </motion.a>
                            ))}
                            <motion.a
                                href="/cv"
                                onClick={() => setIsMenuOpen(false)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-black tracking-widest uppercase text-black dark:text-white hover:text-[#f97316] transition-colors"
                            >
                                {t.nav.cv}
                            </motion.a>
                        </nav>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center gap-6 border-t border-black/10 dark:border-white/10 pt-12 w-64"
                        >
                            <div className="flex items-center gap-8">
                                <motion.button
                                    onClick={() => setLanguage('en')}
                                    className={`text-xl font-bold transition-all ${language === 'en' ? 'text-[#f97316] scale-110' : 'opacity-30 text-black dark:text-white'}`}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    EN
                                </motion.button>
                                <span className="text-gray-400 px-2">|</span>
                                <motion.button
                                    onClick={() => setLanguage('es')}
                                    className={`text-xl font-bold transition-all ${language === 'es' ? 'text-[#f97316] scale-110' : 'opacity-30 text-black dark:text-white'}`}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    ES
                                </motion.button>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Theme</span>
                                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Header
