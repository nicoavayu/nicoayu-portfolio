import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { ArrowUpRight } from './Icons'

const prefersSavingData = () =>
    typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)

const pickSource = (sources) =>
    window.matchMedia('(min-width: 768px)').matches ? sources.desktop : sources.mobile

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const rest = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

const getCueIndex = (cues, time) => {
    let index = 0
    cues.forEach((cue, cueIndex) => {
        if (time >= cue.at) index = cueIndex
    })
    return index
}

const HeroReel = ({ reel, onOpen }) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const progressRef = useRef(null)
    const timecodeRef = useRef(null)
    const [cueIndex, setCueIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [source] = useState(() => pickSource(reel.sources))
    const isInView = useInView(containerRef, { amount: 0.25 })
    const reduceMotion = useReducedMotion()
    const { t, language } = useLanguage()

    const isStatic = reduceMotion || prefersSavingData()
    const cue = reel.cues[cueIndex]
    const { project } = cue

    // Only play while the reel is on screen
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (isInView) video.play().catch(() => {})
        else video.pause()
    }, [isInView, isStatic])

    // Keep progress bar, timecode and shot label in sync with the video
    useEffect(() => {
        const video = videoRef.current
        if (!video || !isInView) return

        let frame
        const tick = () => {
            const time = video.currentTime
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${time / reel.duration})`
            if (timecodeRef.current) timecodeRef.current.textContent = formatTime(time)
            setCueIndex(getCueIndex(reel.cues, time))
            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [isInView, isStatic, reel])

    const handleSeek = (event) => {
        const video = videoRef.current
        if (!video) return
        const rect = event.currentTarget.getBoundingClientRect()
        const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
        video.currentTime = ratio * reel.duration
    }

    return (
        <div
            ref={containerRef}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 sm:aspect-video"
        >
            <img src={reel.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {!isStatic && (
                <video
                    ref={videoRef}
                    src={source}
                    poster={reel.poster}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="auto"
                    onPlaying={() => setIsPlaying(true)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                />
            )}

            {/* Legibility gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/35" />

            {/* Whole frame opens the project currently on screen */}
            <button
                type="button"
                onClick={() => onOpen(project)}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={`${t.hero.reel_watch}: ${project.title}`}
            />

            {/* Top bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 md:p-6">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        {isPlaying && isInView && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    {t.hero.reel_label}
                </span>
                <span className="tabular-nums">
                    <span ref={timecodeRef}>00:00</span> / {formatTime(reel.duration)}
                </span>
            </div>

            {/* Bottom info */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 md:p-6">
                <div className="flex items-end justify-between gap-4">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${cue.at}-${language}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25 }}
                        >
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                                {t.categories.motion} · {project.year}
                            </p>
                            <p className="mt-1.5 font-display text-2xl font-bold uppercase leading-none text-white md:text-4xl">
                                {project.title}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <span className="hidden shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 sm:inline-flex md:translate-y-2 md:opacity-0">
                        {t.hero.reel_watch}
                        <ArrowUpRight className="h-4 w-4" />
                    </span>
                </div>

                {/* Progress with a tick on every cut; click to jump */}
                {!isStatic && (
                    <div
                        role="presentation"
                        onClick={handleSeek}
                        className="pointer-events-auto relative z-20 mt-3 h-6 cursor-pointer md:mt-5"
                    >
                        <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                            <span
                                ref={progressRef}
                                className="absolute inset-0 origin-left bg-accent"
                                style={{ transform: 'scaleX(0)' }}
                            />
                        </span>
                        {reel.cues.slice(1).map((item) => (
                            <span
                                key={item.at}
                                aria-hidden="true"
                                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/50"
                                style={{ left: `${(item.at / reel.duration) * 100}%` }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HeroReel
