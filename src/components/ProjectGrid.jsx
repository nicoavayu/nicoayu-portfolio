import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import ScrollReveal from './ScrollReveal'
import SectionHeading from './SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { getProjectsByCategory, YEAR_RANGE } from '../data/projects'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]
const CATEGORIES = ['motion', 'short_form']

const ProjectGrid = ({ activeCategory = 'motion', onCategoryChange, onOpenProject }) => {
    const { t } = useLanguage()
    const projects = getProjectsByCategory(activeCategory)
    const isShortForm = activeCategory === 'short_form'

    return (
        <section id="work" className="scroll-mt-16 border-t border-line/10 py-24 md:py-32">
            <div className="container-x">
                <ScrollReveal width="100%">
                    <SectionHeading index="01" label={t.work.label} aside={`${YEAR_RANGE.from} — ${YEAR_RANGE.to}`} />

                    <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="font-display text-[clamp(2rem,6vw,5.5rem)] font-bold uppercase leading-[0.9] text-fg text-balance">
                                {t.work.title}
                            </h2>
                            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg text-pretty">
                                {t.work.intro[activeCategory]}
                            </p>
                        </div>

                        {/* Category filter */}
                        <div role="tablist" aria-label={t.work.filter_label} className="inline-flex self-start rounded-full border border-line/15 p-1 lg:self-auto">
                            {CATEGORIES.map((category) => {
                                const isActive = category === activeCategory
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => !isActive && onCategoryChange?.(category)}
                                        className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-300 sm:px-5 ${isActive ? 'text-bg' : 'text-muted hover:text-fg'}`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="categoryPill"
                                                className="absolute inset-0 rounded-full bg-fg"
                                                transition={{ type: 'spring', stiffness: 450, damping: 38 }}
                                            />
                                        )}
                                        <span className="relative">{t.categories[category]}</span>
                                        <span className="relative font-mono text-[11px] opacity-60">
                                            {String(getProjectsByCategory(category).length).padStart(2, '0')}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </ScrollReveal>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeCategory}
                        role="tabpanel"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                        className={`mt-14 grid md:mt-20 ${isShortForm
                            ? 'grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                            : 'grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3'}`}
                    >
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.8, delay: (index % (isShortForm ? 5 : 3)) * 0.06, ease: EASE_OUT_EXPO }}
                            >
                                <ProjectCard project={project} vertical={isShortForm} onOpen={onOpenProject} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default ProjectGrid
