import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { Close } from './Icons'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]
const DETAIL_FIELDS = ['role', 'scope', 'tools', 'context']

const isEmbed = (url) => url.includes('vimeo.com') || url.includes('youtube.com')

const ProjectModal = ({ project, onClose }) => {
    const { t } = useLanguage()
    const closeButtonRef = useRef(null)

    useEffect(() => {
        if (!project) return

        const previousFocus = document.activeElement
        const previousOverflow = document.body.style.overflow
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }

        document.body.style.overflow = 'hidden'
        document.addEventListener('keydown', handleKeyDown)
        closeButtonRef.current?.focus()

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
            previousFocus?.focus?.({ preventScroll: true })
        }
    }, [project, onClose])

    const isVertical = project?.subcategory === 'short_form'
    const categoryLabel = project
        ? (project.subcategory === 'short_form' ? t.categories.short_form : t.categories.motion)
        : ''

    return createPortal(
        <AnimatePresence>
            {project && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-modal-title"
                >
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

                    <motion.div
                        className={`relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#0E0E10] text-white shadow-2xl lg:flex-row lg:overflow-hidden ${isVertical ? 'lg:w-auto' : ''}`}
                        initial={{ opacity: 0, y: 32, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    >
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label={t.project.close}
                            className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition-colors duration-300 hover:bg-white hover:text-black"
                        >
                            <Close className="h-4 w-4" />
                        </button>

                        {/* Video */}
                        <div className={`flex shrink-0 items-center justify-center bg-black ${isVertical ? '' : 'lg:flex-1'}`}>
                            {isEmbed(project.videoUrl) ? (
                                <iframe
                                    src={`${project.videoUrl}${project.videoUrl.includes('?') ? '&' : '?'}autoplay=1&title=0&byline=0&portrait=0`}
                                    className="aspect-video w-full"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title={project.title}
                                />
                            ) : (
                                <video
                                    key={project.id}
                                    src={project.videoUrl}
                                    poster={project.poster}
                                    autoPlay
                                    controls
                                    playsInline
                                    className={isVertical
                                        ? 'aspect-[9/16] h-[70vh] max-w-full bg-black object-contain lg:h-[90vh]'
                                        : 'aspect-video w-full bg-black object-contain'}
                                />
                            )}
                        </div>

                        {/* Details */}
                        {project.details && (
                            <div className="w-full border-t border-white/10 p-6 md:p-8 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-t-0 xl:w-[400px]">
                                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                                    {categoryLabel} · {project.year}
                                </p>
                                <h2 id="project-modal-title" className="mt-3 pr-10 font-display text-3xl font-bold uppercase leading-none">
                                    {project.title}
                                </h2>

                                <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
                                    {DETAIL_FIELDS.filter((field) => project.details[field]).map((field) => (
                                        <div key={field} className="py-4">
                                            <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#FF7A3D]">{t.project[field]}</dt>
                                            <dd className="mt-1.5 text-sm leading-relaxed text-white/80">{project.details[field]}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default ProjectModal
