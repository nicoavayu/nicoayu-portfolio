import { motion } from 'framer-motion'
import HeroReel from './HeroReel'
import { useLanguage } from '../context/LanguageContext'
import { HERO_REEL, CLIENTS } from '../data/projects'
import { CV_PDF_PATH } from '../data/site'
import { ArrowDown, Download } from './Icons'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: EASE_OUT_EXPO } }),
}

const lineReveal = {
    hidden: { y: '110%' },
    visible: (delay = 0) => ({ y: 0, transition: { duration: 1.1, delay, ease: EASE_OUT_EXPO } }),
}

const Hero = ({ onNavigate, onOpenProject }) => {
    const { t } = useLanguage()

    const handleSectionLink = (event, section) => {
        event.preventDefault()
        onNavigate(section)
    }

    return (
        <section id="top" className="pt-28 md:pt-36">
            <div className="container-x">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.1}
                    className="eyebrow flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
                >
                    <span className="flex items-center gap-2.5 text-fg">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                        {t.hero.role}
                    </span>
                    <span className="hidden sm:inline">{t.hero.location}</span>
                </motion.div>

                <h1 className="mt-8 font-display text-[clamp(2.4rem,5.3vw,5rem)] font-extrabold uppercase leading-[0.92] md:mt-10">
                    {[t.hero.title_line1, t.hero.title_line2].map((line, lineIndex) => (
                        <span key={lineIndex} className="block overflow-hidden pb-[0.08em]">
                            <motion.span
                                className={`block text-balance ${lineIndex === 1 ? 'text-muted' : 'text-fg'}`}
                                initial="hidden"
                                animate="visible"
                                variants={lineReveal}
                                custom={0.15 + lineIndex * 0.12}
                            >
                                {line}
                                {lineIndex === 1 && <span className="text-accent">.</span>}
                            </motion.span>
                        </span>
                    ))}
                </h1>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={0.45}
                    className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end"
                >
                    <p className="max-w-xl text-base leading-relaxed text-muted md:text-lg lg:col-span-6 text-pretty">
                        {t.hero.lead}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end">
                        <a href="/#work" onClick={(event) => handleSectionLink(event, 'work')} className="btn-primary">
                            {t.hero.primary_cta}
                            <ArrowDown className="h-4 w-4" />
                        </a>
                        <a href="/#contact" onClick={(event) => handleSectionLink(event, 'contact')} className="btn-secondary">
                            {t.hero.secondary_cta}
                        </a>
                        <a
                            href={CV_PDF_PATH}
                            download
                            className="inline-flex h-12 items-center gap-2 px-3 text-sm font-medium text-fg"
                        >
                            <Download className="h-4 w-4" />
                            <span className="link-underline">{t.hero.cv_cta}</span>
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.55, ease: EASE_OUT_EXPO }}
                    className="mt-12 md:mt-16"
                >
                    <HeroReel clips={HERO_REEL} onOpen={onOpenProject} />
                </motion.div>
            </div>

            {/* Clients */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="container-x mt-12 pb-20 md:mt-16 md:pb-28"
            >
                <div className="flex items-center gap-8 border-y border-line/10 py-6">
                    <span className="eyebrow hidden shrink-0 md:block">{t.hero.clients}</span>
                    <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                        <ul className="flex w-max animate-marquee">
                            {[...CLIENTS, ...CLIENTS].map((client, clientIndex) => (
                                <li
                                    key={`${client}-${clientIndex}`}
                                    aria-hidden={clientIndex >= CLIENTS.length ? 'true' : undefined}
                                    className="flex items-center gap-8 pr-8 font-display text-lg font-semibold uppercase text-muted md:text-2xl"
                                >
                                    {client}
                                    <span className="text-xs text-accent" aria-hidden="true">✦</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default Hero
