import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const prefersSavingData = () =>
    typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData)

const pickSource = (sources) =>
    window.matchMedia('(min-width: 768px)').matches ? sources.desktop : sources.mobile

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const rest = Math.floor(seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

const HeroReel = ({ reel }) => {
    const containerRef = useRef(null)
    const videoRef = useRef(null)
    const progressRef = useRef(null)
    const timecodeRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [source] = useState(() => pickSource(reel.sources))
    const isInView = useInView(containerRef, { amount: 0.25 })
    const reduceMotion = useReducedMotion()
    const { t } = useLanguage()

    const isStatic = reduceMotion || prefersSavingData()

    // Only play while the reel is on screen
    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        if (isInView) video.play().catch(() => {})
        else video.pause()
    }, [isInView, isStatic])

    // Keep progress bar and timecode in sync with the video
    useEffect(() => {
        const video = videoRef.current
        if (!video || !isInView) return

        let frame
        const tick = () => {
            if (video.duration) {
                if (progressRef.current) progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`
                if (timecodeRef.current) timecodeRef.current.textContent = formatTime(video.currentTime)
            }
            frame = requestAnimationFrame(tick)
        }

        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [isInView, isStatic])

    const handleSeek = (event) => {
        const video = videoRef.current
        if (!video?.duration) return
        const rect = event.currentTarget.getBoundingClientRect()
        const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
        video.currentTime = ratio * video.duration
    }

    return (
        <div
            ref={containerRef}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 sm:aspect-video"
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
                    onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                    onPlaying={() => setIsPlaying(true)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                />
            )}

            {/* Legibility gradients */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/35" />

            {/* Top bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 font-mono text-[11px] uppercase tracking-[0.16em] text-white/85 md:p-6">
                <span className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        {isPlaying && isInView && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    {t.hero.reel_label}
                </span>
                {duration > 0 && (
                    <span className="tabular-nums">
                        <span ref={timecodeRef}>00:00</span> / {formatTime(duration)}
                    </span>
                )}
            </div>

            {/* Progress; click to jump */}
            {!isStatic && (
                <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6">
                    <div role="presentation" onClick={handleSeek} className="relative h-6 cursor-pointer">
                        <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                            <span
                                ref={progressRef}
                                className="absolute inset-0 origin-left bg-accent"
                                style={{ transform: 'scaleX(0)' }}
                            />
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeroReel
