import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const ProjectCard = ({ title, category, image, previewUrl, videoUrl, aspectRatio = "aspect-[4/3]", poster, compact = false }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isVideoLoading, setIsVideoLoading] = useState(true)
    const videoRef = useRef(null)
    const { t } = useLanguage()

    // Map hardcoded category strings to translation keys
    const categoryMap = {
        '3D & Motion graphics': t.categories['3d_motion'],
        'Motion Graphics': t.categories.motion,
        'App Showcase': t.categories.app_showcase,
        'Video Edition': t.categories.video_edition,
        'Social Media Ad': t.categories.short_form,
        'Short-Form Ads': t.categories.short_form,
        'Digital Campaigns': t.categories.short_form
    }

    const translatedCategory = categoryMap[category] || category

    const handleMouseEnter = () => {
        setIsHovered(true)
        if (videoRef.current) {
            videoRef.current.play().catch(err => console.log("Video play failed:", err))
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.load() // Forces the poster to show again
        }
    }

    const toggleModal = (e) => {
        if (e) e.preventDefault()
        const newState = !isModalOpen
        setIsModalOpen(newState)
        if (newState) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }

    return (
        <>
            <motion.div
                className="group cursor-pointer relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={toggleModal}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Image/Video Container with Aspect Ratio */}
                <div className={`${aspectRatio} overflow-hidden bg-gray-100 dark:bg-gray-900 w-full relative rounded-sm`}>
                    {/* Loading Skeleton */}
                    <AnimatePresence>
                        {isVideoLoading && (
                            <motion.div
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
                            >
                                <motion.div
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Video Thumbnail / Preview */}
                    {previewUrl && (
                        <motion.video
                            ref={videoRef}
                            src={poster ? previewUrl : `${previewUrl}#t=0.001`}
                            poster={poster}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            onLoadedData={() => setIsVideoLoading(false)}
                            className="absolute inset-0 w-full h-full object-cover"
                            animate={{
                                scale: isHovered ? 1.08 : 1,
                                filter: isHovered ? 'brightness(1.1)' : 'brightness(0.9)'
                            }}
                            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                        />
                    )}

                    {/* Overlay Gradient for better text readability and depth */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        animate={{ opacity: isHovered ? 0.3 : 0.6 }}
                        transition={{ duration: 0.4 }}
                    />

                    {/* Play Icon Overlay (visible on hover) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            className={`${compact ? 'w-10 h-10' : 'w-16 h-16'} rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                scale: isHovered ? 1 : 0.5
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                        >
                            <svg viewBox="0 0 24 24" className={`${compact ? 'w-5 h-5' : 'w-8 h-8'} fill-white dark:fill-white ml-1`}>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* Content Below */}
                <div className={`${compact ? 'mt-2 px-1' : 'mt-4'} flex flex-col items-center text-center`}>
                    <motion.h3
                        className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium tracking-[0.2em] uppercase transition-colors text-black dark:text-white`}
                        animate={{ color: isHovered ? '#f97316' : undefined }}
                        transition={{ duration: 0.3 }}
                    >
                        {title}
                    </motion.h3>
                    <span className={`${compact ? 'text-[8px] mt-1' : 'text-xs mt-2'} text-gray-400 dark:text-gray-500 font-light tracking-wide uppercase transition-colors duration-500`}>
                        {translatedCategory}
                    </span>
                </div>
            </motion.div>

            {/* Video Modal */}
            <AnimatePresence>
                {isModalOpen && videoUrl && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/95 backdrop-blur-sm cursor-pointer"
                            onClick={toggleModal}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            className={`relative w-full z-10 ${aspectRatio === "aspect-[9/16]"
                                ? "max-w-[400px] aspect-[9/16] h-[85vh]"
                                : "max-w-6xl aspect-video"
                                } bg-black shadow-2xl rounded-sm overflow-hidden`}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                        >
                            {/* Close Button */}
                            <motion.button
                                onClick={toggleModal}
                                className="absolute -top-12 right-0 text-white hover:text-[#f97316] transition-colors duration-300 flex items-center gap-2 group z-20"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>

                            {/* Video Content (Iframe or Local Video) */}
                            {videoUrl.includes('vimeo.com') || videoUrl.includes('youtube.com') ? (
                                <iframe
                                    src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&title=0&byline=0&portrait=0`}
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={videoUrl}
                                    autoPlay
                                    controls
                                    className="w-full h-full"
                                ></video>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ProjectCard
