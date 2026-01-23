import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import ScrollReveal from './ScrollReveal'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const Contact = () => {
    const form = useRef()
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { t } = useLanguage()
    const { theme } = useTheme()

    const sendEmail = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Debug log as requested
        console.log(Object.fromEntries(new FormData(form.current).entries()));

        // EmailJS Credentials - placeholders for user to fill
        const SERVICE_ID = "service_e0m0c0k"
        const TEMPLATE_ID = "template_vbf6itl"
        const PUBLIC_KEY = "_x11r4pjKMNAdHpT6"

        if (SERVICE_ID === "YOUR_SERVICE_ID") {
            setStatus({ type: 'error', message: t.contact.status.config })
            setIsSubmitting(false)
            return
        }

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
            .then((result) => {
                setStatus({ type: 'success', message: t.contact.status.success })
                form.current.reset()
            }, (error) => {
                setStatus({ type: 'error', message: t.contact.status.error })
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    return (
        <section id="contact" className="py-24 border-t border-gray-200 dark:border-gray-900 transition-colors duration-500">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:items-center lg:grid-cols-2 gap-16">
                    {/* Left Side: Bold Title & Info */}
                    <div className="space-y-12">
                        <ScrollReveal>
                            <div className="space-y-4">
                                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-none text-black dark:text-white transition-colors duration-500">
                                    {t.contact.title_part1} <br />
                                    <span className="text-[#f97316]">{t.contact.title_part2}</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light max-w-md transition-colors duration-500">
                                    {t.contact.lead}
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="space-y-6 text-black dark:text-white transition-colors duration-500">
                            <ScrollReveal delay={0.3}>
                                <div>
                                    <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#f97316] mb-2">{t.contact.labels.email}</h4>
                                    <a href="mailto:nicolasavayu@gmail.com" className="text-2xl md:text-3xl font-light hover:text-[#f97316] transition-colors duration-300">
                                        nicolasavayu@gmail.com
                                    </a>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.4}>
                                <div>
                                    <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#f97316] mb-2">{t.contact.labels.location}</h4>
                                    <p className="text-2xl md:text-3xl font-light">{t.contact.location_value}</p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.5}>
                                <div className="pt-4">
                                    <h4 className="text-xs font-bold tracking-[0.3em] uppercase text-[#f97316] mb-4">{t.contact.labels.social}</h4>
                                    <div className="flex gap-10 -ml-10">
                                        {['linkedin', 'behance', 'instagram'].map((platform) => (
                                            <a
                                                key={platform}
                                                href={platform === 'linkedin' ? "https://www.linkedin.com/in/nicolas-avayu-01036515/" : platform === 'behance' ? "https://www.behance.net/nicoavayu" : "https://www.instagram.com/nico_avayu/"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="h-12 md:h-16 transition-all duration-300 hover:scale-110 hover:[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(346deg)_brightness(98%)_contrast(97%)]"
                                            >
                                                <img
                                                    src={`/images/${platform}.png`}
                                                    alt={platform}
                                                    className="h-full w-auto object-contain dark:invert-0 light:invert"
                                                    style={{ filter: theme === 'light' ? 'invert(1)' : 'none' }}
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* Right Side: Minimal Form */}
                    <ScrollReveal direction="left" delay={0.4}>
                        <form
                            ref={form}
                            onSubmit={sendEmail}
                            className="space-y-8 bg-black/[0.03] dark:bg-gray-900/30 p-8 md:p-12 rounded-2xl backdrop-blur-sm border border-black/5 dark:border-white/5 transition-colors duration-500"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{t.contact.labels.name}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-[#f97316] transition-colors duration-300 text-lg font-light text-black dark:text-white"
                                        placeholder={t.contact.placeholders.name}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{t.contact.labels.email}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-[#f97316] transition-colors duration-300 text-lg font-light text-black dark:text-white"
                                        placeholder={t.contact.placeholders.email}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{t.contact.labels.subject}</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-[#f97316] transition-colors duration-300 text-lg font-light text-black dark:text-white"
                                    placeholder={t.contact.placeholders.subject}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{t.contact.labels.message}</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    required
                                    className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-[#f97316] transition-colors duration-300 text-lg font-light resize-none text-black dark:text-white"
                                    placeholder={t.contact.placeholders.message}
                                ></textarea>
                            </div>

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`group flex items-center gap-4 text-xs font-bold tracking-[0.3em] uppercase text-black dark:text-white hover:text-[#f97316] transition-colors duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    <span>{isSubmitting ? t.contact.button.sending : t.contact.button.send}</span>
                                    <div className="w-12 h-px bg-black dark:bg-white group-hover:bg-[#f97316] transition-colors duration-300 group-hover:w-16"></div>
                                </button>

                                {status.message && (
                                    <p className={`text-[10px] font-bold tracking-widest uppercase ${status.type === 'error' ? 'text-red-500' : 'text-[#f97316]'
                                        }`}>
                                        {status.message}
                                    </p>
                                )}
                            </div>
                        </form>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}

export default Contact
