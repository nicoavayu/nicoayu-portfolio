import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PageLoader = () => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading time - adjust as needed
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[200] bg-white dark:bg-black flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Animated Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="relative"
                        >
                            {/* Pulsing glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="absolute -inset-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full blur-xl"
                            />

                            {/* Logo */}
                            <div className="relative">
                                <img
                                    src="/images/logo_small.png"
                                    alt="Loading..."
                                    className="w-20 h-20 md:w-24 md:h-24 object-contain dark:invert-0 invert"
                                />
                            </div>
                        </motion.div>

                        {/* Loading text */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm md:text-base font-light tracking-[0.3em] uppercase text-black dark:text-white">
                                    NICO AVAYÚ
                                </span>
                            </div>

                            {/* Animated dots */}
                            <div className="flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: 'easeInOut'
                                        }}
                                        className="w-2 h-2 rounded-full bg-[#f97316]"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PageLoader
