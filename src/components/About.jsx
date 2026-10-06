import ScrollReveal from './ScrollReveal'
import SectionHeading from './SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { PROJECTS } from '../data/projects'
import { ArrowUpRight } from './Icons'

const About = ({ onNavigate }) => {
    const { t } = useLanguage()

    const stats = [
        { value: '15+', label: t.about.stats.years },
        { value: String(PROJECTS.length), label: t.about.stats.projects },
        { value: 'EN · ES', label: t.about.stats.languages },
    ]

    const handleContactClick = (event) => {
        event.preventDefault()
        onNavigate?.('contact')
    }

    return (
        <section id="about" className="scroll-mt-16 border-t border-line/10 py-24 md:py-32">
            <div className="container-x">
                <ScrollReveal width="100%">
                    <SectionHeading index="02" label={t.about.label} />
                </ScrollReveal>

                <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
                    {/* Portrait */}
                    <ScrollReveal width="100%" className="lg:col-span-5">
                        <figure>
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-2 bg-[radial-gradient(circle_at_50%_40%,rgb(var(--accent)/0.18),transparent_65%)]">
                                <img
                                    src="/images/profile.png"
                                    alt={t.about.photo_alt}
                                    loading="lazy"
                                    className="h-full w-full object-contain p-8 transition-transform duration-[1200ms] ease-out-expo hover:scale-[1.03] md:p-12"
                                />
                                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
                            </div>
                            <figcaption className="eyebrow mt-4 flex justify-between">
                                <span>Nico Avayú</span>
                                <span>Buenos Aires, AR</span>
                            </figcaption>
                        </figure>
                    </ScrollReveal>

                    {/* Content */}
                    <div className="flex flex-col lg:col-span-7 lg:pt-2">
                        <ScrollReveal width="100%" delay={0.1}>
                            <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.5rem)] font-bold uppercase leading-[0.92] text-fg text-balance">
                                {t.about.headline}
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.15}>
                            <ul className="mt-8 flex flex-wrap gap-2">
                                {t.about.roles.map((role) => (
                                    <li key={role} className="rounded-full border border-line/15 px-3.5 py-1.5 text-sm text-fg">
                                        {role}
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.2}>
                            <div className="mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-muted md:text-xl text-pretty">
                                {t.about.bio.split('\n\n').map((paragraph) => (
                                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                                ))}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.25}>
                            <dl className="mt-12 grid grid-cols-3 border-y border-line/10">
                                {stats.map((stat, index) => (
                                    <div key={stat.label} className={`py-6 ${index > 0 ? 'border-l border-line/10 pl-4 md:pl-6' : 'pr-4'}`}>
                                        <dt className="sr-only">{stat.label}</dt>
                                        <dd>
                                            <span className="block font-display text-2xl font-bold text-fg md:text-4xl">{stat.value}</span>
                                            <span className="mt-2 block text-xs leading-snug text-muted md:text-sm">{stat.label}</span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.3}>
                            <div className="mt-10 flex flex-wrap gap-3">
                                <a href="/cv" className="btn-secondary">
                                    {t.about.cv_button}
                                    <ArrowUpRight className="h-4 w-4" />
                                </a>
                                <a href="/#contact" onClick={handleContactClick} className="btn inline-flex px-3 text-fg">
                                    <span className="link-underline">{t.about.contact_button}</span>
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
