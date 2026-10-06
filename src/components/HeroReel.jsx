import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { ArrowUpRight } from './Icons'

const CLIP_DURATION_MS = 5000

const prefersSavingData = () =>
    typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)

const ReelClip = ({ clip, playVideo, isPaused }) => {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (isPaused) video.pause()
        else video.play().catch(() => {})
    }, [isPaused])

    return (
        <>
            <img src={clip.poster} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover" />
            {playVideo && (
                <video
                    ref={videoRef}
                    src={`${clip.previewUrl}#t=${clip.start}`}
                    muted
                    autoPlay
                    playsInline
                    preload="auto"
                    onPlaying={() => setIsPlaying(true)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                />
            )}
        </>
    )
}

const HeroReel = ({ clips, onOpen }) => {
    const [index, setIndex] = useState(0)
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { amount: 0.25 })
    const reduceMotion = useReducedMotion()
    const { t, language } = useLanguage()

    const isStatic = reduceMotion || prefersSavingData()
    const isRunning = isInView && !isStatic
    const clip = clips[index]
    const categoryLabel = clip.subcategory === 'short_form' ? t.categories.short_form : t.categories.motion

    // Advance to the next clip while the reel is on screen
    useEffect(() => {
        if (!isRunning) return
        const timer = setTimeout(() => setIndex((current) => (current + 1) % clips.length), CLIP_DURATION_MS)
        return () => clearTimeout(timer)
    }, [index, isRunning, clips.length])

    // Warm up the next poster so the crossfade never shows an empty frame
    useEffect(() => {
        const next = clips[(index + 1) % clips.length]
        if (next?.poster) new Image().src = next.poster
    }, [index, clips])

    return (
        <div
            ref={containerRef}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 sm:aspect-video lg:aspect-[2.2/1]"
        >
            <AnimatePresence initial={false}>
                <motion.div
                    key={clip.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: 'easeInOut' }}
                >
                    <ReelClip clip={clip} playVideo={!isStatic} isPaused={!isInView} />
                </motion.div>
            </AnimatePresence>

            {/* Legibility gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

            {/* Whole frame opens the current project */}
            <button
                type="button"
                onClick={() => onOpen(clip)}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={`${t.hero.reel_watch}: ${clip.title}`}
            />

            {/* Top bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 md:p-6">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        {isRunning && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    {t.hero.reel_label}
                </span>
                <span>
                    {String(index + 1).padStart(2, '0')} / {String(clips.length).padStart(2, '0')}
                </span>
            </div>

            {/* Bottom info */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:p-6">
                <div className="flex items-end justify-between gap-4">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${clip.id}-${language}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.45 }}
                        >
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                                {categoryLabel} · {clip.year}
                            </p>
                            <p className="mt-1.5 font-display text-2xl font-bold uppercase leading-none text-white md:text-4xl">
                                {clip.title}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 sm:inline-flex md:translate-y-2 md:opacity-0">
                        {t.hero.reel_watch}
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>

                {/* Progress segments */}
                <div className="pointer-events-auto relative z-20 mt-4 flex gap-1.5 md:mt-6">
                    {clips.map((item, itemIndex) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setIndex(itemIndex)}
                            aria-label={`${t.hero.reel_go_to} ${itemIndex + 1}: ${item.title}`}
                            aria-current={itemIndex === index ? 'true' : undefined}
                            className="group/segment flex-1 py-2"
                        >
                            <span className="relative block h-[2px] overflow-hidden rounded-full bg-white/25 transition-colors group-hover/segment:bg-white/45">
                                {itemIndex < index && <span className="absolute inset-0 bg-white" />}
                                {itemIndex === index && (
                                    <motion.span
                                        key={`${index}-${isRunning}`}
                                        className="absolute inset-0 origin-left bg-accent"
                                        initial={{ scaleX: isRunning ? 0 : 1 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: isRunning ? CLIP_DURATION_MS / 1000 : 0, ease: 'linear' }}
                                    />
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HeroReel
