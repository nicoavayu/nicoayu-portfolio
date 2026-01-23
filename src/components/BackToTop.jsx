import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 400px
            if (window.scrollY > 400) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 group"
                    aria-label="Back to top"
                >
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>

                        {/* Button */}
                        <div className="relative w-12 h-12 md:w-14 md:h-14 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <svg
                                className="w-6 h-6 text-white dark:text-black group-hover:text-[#f97316] dark:group-hover:text-[#f97316] transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </div>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default BackToTop
