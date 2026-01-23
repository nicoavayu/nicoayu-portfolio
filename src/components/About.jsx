import ScrollReveal from './ScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const About = () => {
    const { t } = useLanguage()

    return (
        <section id="about" className="py-24 border-t border-gray-200 dark:border-gray-900 overflow-hidden transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
                {/* Profile Image with decorative ring */}
                <ScrollReveal>
                    <div className="relative mb-12 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <img
                                src="/images/imagen perfil.png"
                                alt="Nico Avayú"
                                className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-2 border-gray-200 dark:border-gray-800 transition-colors duration-500"
                            />
                        </div>
                    </div>
                </ScrollReveal>

                {/* About Content */}
                <div className="space-y-8 flex flex-col items-center w-full">
                    <ScrollReveal delay={0.3} width="100%">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-8 text-black dark:text-white transition-colors duration-500">
                            {t.about.title_part1} <span className="text-[#f97316]">{t.about.title_part2}</span>
                        </h2>
                    </ScrollReveal>

                    <div className="space-y-6 w-full">
                        <ScrollReveal delay={0.4} width="100%">
                            <p className="text-xl md:text-2xl text-gray-900 dark:text-white font-medium max-w-2xl mx-auto leading-tight transition-colors duration-500">
                                {t.about.lead}
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={0.5}>
                        <div className="h-px w-12 bg-gray-200 dark:bg-gray-800 mx-auto transition-colors duration-500"></div>
                    </ScrollReveal>

                    <div className="space-y-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light transition-colors duration-500 w-full">
                        <ScrollReveal delay={0.6} width="100%">
                            <p className="text-lg leading-relaxed text-pretty">
                                {t.about.bio}
                            </p>
                        </ScrollReveal>
                    </div>

                    <div className="pt-8 w-full">
                        <ScrollReveal delay={0.7} width="100%">
                            <h6 className="text-[#f97316] text-sm font-bold tracking-[0.3em] uppercase mb-4">{t.about.focus}</h6>
                            <p className="text-gray-900 dark:text-white text-lg font-light tracking-wide italic transition-colors duration-500">
                                Multimedia design · Video editing · Motion graphics · Digital content
                            </p>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
