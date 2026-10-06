import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import ScrollReveal from './ScrollReveal'
import SectionHeading from './SectionHeading'
import { useLanguage } from '../context/LanguageContext'
import { EMAIL, SOCIAL_LINKS } from '../data/site'
import { ArrowRight, ArrowUpRight, Check, Copy } from './Icons'

const SERVICE_ID = "service_e0m0c0k"
const TEMPLATE_ID = "template_vbf6itl"
const PUBLIC_KEY = "_x11r4pjKMNAdHpT6"

const inputClasses = "w-full border-b border-line/15 bg-transparent py-3 text-base text-fg placeholder:text-muted/60 transition-colors duration-300 focus:border-accent focus:outline-none focus-visible:ring-0 md:text-lg"

const Field = ({ id, label, children }) => (
    <div className="space-y-1">
        <label htmlFor={id} className="eyebrow">{label}</label>
        {children}
    </div>
)

const useBuenosAiresTime = (language) => {
    const format = () => new Intl.DateTimeFormat(language === 'es' ? 'es-AR' : 'en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: language !== 'es',
    }).format(new Date())

    const [time, setTime] = useState(format)

    useEffect(() => {
        setTime(format())
        const interval = setInterval(() => setTime(format()), 30000)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language])

    return time
}

const Contact = () => {
    const form = useRef()
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [copied, setCopied] = useState(false)
    const { t, language } = useLanguage()
    const localTime = useBuenosAiresTime(language)

    const sendEmail = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus({ type: '', message: '' })

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
            .then(() => {
                setStatus({ type: 'success', message: t.contact.status.success })
                form.current.reset()
            }, () => {
                setStatus({ type: 'error', message: t.contact.status.error })
            })
            .finally(() => {
                setIsSubmitting(false)
            })
    }

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            window.location.href = `mailto:${EMAIL}`
        }
    }

    return (
        <section id="contact" className="scroll-mt-16 border-t border-line/10 py-24 md:py-32">
            <div className="container-x">
                <ScrollReveal width="100%">
                    <SectionHeading index="03" label={t.contact.label} />
                    <h2 className="mt-10 font-display text-[clamp(2.5rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.86] text-fg">
                        {t.contact.title_part1}
                        <br />
                        <span className="text-accent">{t.contact.title_part2}</span>
                    </h2>
                </ScrollReveal>

                <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-16">
                    {/* Info */}
                    <div className="space-y-10 lg:col-span-5">
                        <ScrollReveal width="100%" delay={0.1}>
                            <p className="max-w-md text-lg leading-relaxed text-muted md:text-xl text-pretty">{t.contact.lead}</p>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.15}>
                            <p className="eyebrow">{t.contact.labels.email}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <a href={`mailto:${EMAIL}`} className="break-all font-display text-xl font-semibold text-fg transition-colors duration-300 hover:text-accent-ink md:text-2xl">
                                    {EMAIL}
                                </a>
                                <button
                                    type="button"
                                    onClick={copyEmail}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line/15 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:border-fg hover:text-fg"
                                    aria-live="polite"
                                >
                                    {copied ? <Check className="h-3.5 w-3.5 text-accent-ink" /> : <Copy className="h-3.5 w-3.5" />}
                                    {copied ? t.contact.copied : t.contact.copy}
                                </button>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.2}>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="eyebrow">{t.contact.labels.location}</p>
                                    <p className="mt-2 text-base text-fg md:text-lg">{t.contact.location_value}</p>
                                </div>
                                <div>
                                    <p className="eyebrow">{t.contact.local_time}</p>
                                    <p className="mt-2 whitespace-nowrap font-mono text-base text-fg md:text-lg">{localTime} <span className="text-muted">GMT-3</span></p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal width="100%" delay={0.25}>
                            <p className="eyebrow">{t.contact.labels.social}</p>
                            <ul className="mt-3 border-t border-line/10">
                                {SOCIAL_LINKS.map((social) => (
                                    <li key={social.label} className="border-b border-line/10">
                                        <a
                                            href={social.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group flex items-center justify-between py-4 text-base text-fg md:text-lg"
                                        >
                                            {social.label}
                                            <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>

                    {/* Form */}
                    <ScrollReveal width="100%" delay={0.15} className="lg:col-span-7">
                        <form
                            ref={form}
                            onSubmit={sendEmail}
                            className="space-y-8 rounded-2xl border border-line/10 bg-surface p-6 sm:p-8 md:p-12"
                        >
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <Field id="contact-name" label={t.contact.labels.name}>
                                    <input id="contact-name" type="text" name="name" autoComplete="name" required className={inputClasses} placeholder={t.contact.placeholders.name} />
                                </Field>
                                <Field id="contact-email" label={t.contact.labels.email}>
                                    <input id="contact-email" type="email" name="email" autoComplete="email" required className={inputClasses} placeholder={t.contact.placeholders.email} />
                                </Field>
                            </div>

                            <Field id="contact-subject" label={t.contact.labels.subject}>
                                <input id="contact-subject" type="text" name="subject" required className={inputClasses} placeholder={t.contact.placeholders.subject} />
                            </Field>

                            <Field id="contact-message" label={t.contact.labels.message}>
                                <textarea id="contact-message" rows="5" name="message" required className={`${inputClasses} resize-none`} placeholder={t.contact.placeholders.message} />
                            </Field>

                            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className={`text-sm ${status.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-accent-ink'}`}
                                >
                                    {status.message}
                                </p>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary group shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? t.contact.button.sending : t.contact.button.send}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </form>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    )
}

export default Contact
