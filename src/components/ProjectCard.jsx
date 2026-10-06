import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Play } from './Icons'

const ProjectCard = ({ project, vertical = false, onOpen }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const { t } = useLanguage()
    const { title, year, poster, previewUrl, details } = project

    // Only load the preview video once someone hovers the card
    const showVideo = isHovered || !poster

    const handleMouseLeave = () => {
        setIsHovered(false)
        setIsPlaying(false)
    }

    return (
        <button
            type="button"
            onClick={() => onOpen(project)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group block w-full rounded-xl text-left"
            aria-label={`${t.work.play}: ${title} (${year})`}
        >
            <div className={`relative overflow-hidden rounded-xl bg-surface-2 ${vertical ? 'aspect-[9/16]' : 'aspect-video'}`}>
                {poster && (
                    <img
                        src={poster}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                )}

                {showVideo && (
                    <video
                        src={poster ? previewUrl : `${previewUrl}#t=1`}
                        muted
                        loop
                        playsInline
                        autoPlay={isHovered}
                        preload={poster ? 'auto' : 'metadata'}
                        onPlaying={() => setIsPlaying(true)}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isPlaying || !poster ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className={`pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-2 rounded-full bg-black/55 font-mono uppercase tracking-[0.12em] text-white opacity-0 backdrop-blur-md transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${vertical ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]'}`}>
                    <Play className="h-2.5 w-2.5" />
                    {t.work.play}
                </span>
            </div>

            {vertical ? (
                <div className="mt-3">
                    <h3 className="truncate text-sm font-medium text-fg transition-colors duration-300 group-hover:text-accent-ink">{title}</h3>
                    <p className="mt-0.5 font-mono text-[11px] text-muted">{year}</p>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-display text-lg font-semibold uppercase leading-tight text-fg transition-colors duration-300 group-hover:text-accent-ink md:text-xl">
                            {title}
                        </h3>
                        <span className="shrink-0 font-mono text-xs text-muted">{year}</span>
                    </div>
                    {details?.role && <p className="mt-1 text-sm text-muted">{details.role}</p>}
                </div>
            )}
        </button>
    )
}

export default ProjectCard
