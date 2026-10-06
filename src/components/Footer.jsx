import { useLanguage } from '../context/LanguageContext'
import { EMAIL, SECTIONS, SOCIAL_LINKS } from '../data/site'
import { ArrowUp, ArrowUpRight } from './Icons'

const Footer = ({ onNavigate }) => {
    const { t } = useLanguage()

    const handleSectionClick = (event, section) => {
        event.preventDefault()
        onNavigate?.(section)
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer id="footer" className="overflow-hidden border-t border-line/10">
            <div className="container-x pt-16 md:pt-20">
                <div className="grid gap-12 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <img src="/images/logo_small.png" alt="" className="h-10 w-auto invert dark:invert-0" />
                        <p className="mt-6 max-w-xs text-base text-muted text-pretty">{t.footer.tagline}</p>
                    </div>

                    <div className="md:col-span-3">
                        <p className="eyebrow">{t.footer.navigate}</p>
                        <ul className="mt-4 space-y-2">
                            {SECTIONS.map((section) => (
                                <li key={section}>
                                    <a href={`/#${section}`} onClick={(event) => handleSectionClick(event, section)} className="link-underline text-fg">
                                        {t.nav[section]}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="/cv" className="link-underline text-fg">{t.nav.cv}</a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <p className="eyebrow">{t.footer.connect}</p>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a href={`mailto:${EMAIL}`} className="link-underline break-all text-fg">{EMAIL}</a>
                            </li>
                            {SOCIAL_LINKS.map((social) => (
                                <li key={social.label}>
                                    <a href={social.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-fg">
                                        <span className="link-underline">{social.label}</span>
                                        <ArrowUpRight className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent-ink" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Oversized wordmark */}
                <p
                    aria-hidden="true"
                    className="mt-16 select-none whitespace-nowrap text-center font-display text-[12.4vw] font-extrabold uppercase leading-[0.8] text-fg/[0.07] min-[1440px]:text-[11.25rem] md:mt-24"
                >
                    Nico Avayú
                </p>

                <div className="flex flex-col gap-4 border-t border-line/10 py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
                    <span>&copy; {new Date().getFullYear()} Nico Avayú. {t.footer.rights}</span>
                    <button type="button" onClick={scrollToTop} className="group inline-flex items-center gap-2 uppercase transition-colors hover:text-fg">
                        {t.footer.back_to_top}
                        <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
