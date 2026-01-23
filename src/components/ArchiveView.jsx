import ProjectCard from './ProjectCard'
import { PROJECTS } from './ProjectGrid'
import ScrollReveal from './ScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const ArchiveView = ({ category, onBack }) => {
    const { t } = useLanguage()
    const projects = PROJECTS.filter(p => category === 'all' ? true : p.subcategory === category)

    // Title and Subtitle based on category
    let title = t.work.title
    let subtitle = t.work.subtitle

    if (category === 'motion') {
        title = t.categories.motion
    } else if (category === 'short_form') {
        title = t.categories.short_form
    } else if (category === 'digital') {
        title = t.categories.digital
    }

    const aspectRatio = category === 'motion' ? 'aspect-[4/3]' : 'aspect-[9/16]'

    return (
        <div className="pb-20 pt-10">
            {/* Header */}
            <ScrollReveal width="100%">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-black dark:text-white mb-4 transition-colors duration-500">
                            {title}
                        </h2>
                        <p className="text-gray-500 text-xs tracking-widest uppercase font-light transition-colors duration-500">{subtitle}</p>
                    </div>

                    <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#f97316]">
                        {projects.length} {t.work.projects_total}
                    </div>
                </div>
            </ScrollReveal>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
                {projects.map((project, index) => (
                    <ScrollReveal key={project.id} delay={index * 0.05} width="100%">
                        <ProjectCard
                            {...project}
                            aspectRatio={aspectRatio}
                        />
                    </ScrollReveal>
                ))}
            </div>

            {/* Footer Navigation */}
            <ScrollReveal width="100%" delay={0.2}>
                <div className="mt-32 pt-20 border-t border-black/5 dark:border-white/5 flex justify-center transition-colors duration-500">
                    <button
                        onClick={onBack}
                        className="px-10 py-4 border border-black/10 dark:border-white/10 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500 text-black dark:text-white"
                    >
                        {t.work.back}
                    </button>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default ArchiveView
