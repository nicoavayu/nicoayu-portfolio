import ScrollReveal from './ScrollReveal'
import { useLanguage } from '../context/LanguageContext'
import { CV_PDF_PATH } from '../data/site'
import { ArrowUpRight, Download } from './Icons'

const CvView = () => {
    const { t } = useLanguage()

    return (
        <section className="container-x pb-24 pt-28 md:pt-36">
            <ScrollReveal width="100%">
                <div className="mb-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end md:mb-14">
                    <div className="max-w-3xl">
                        <p className="eyebrow flex items-center gap-2.5 text-fg">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                            {t.cv.eyebrow}
                        </p>
                        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.86] text-fg">
                            {t.cv.title_part1} <span className="text-accent">{t.cv.title_part2}</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl text-pretty">
                            {t.cv.lead}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <a href={CV_PDF_PATH} download className="btn-primary">
                            {t.cv.download}
                            <Download className="h-4 w-4" />
                        </a>
                        <a href={CV_PDF_PATH} target="_blank" rel="noreferrer" className="btn-secondary">
                            {t.cv.open_pdf}
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-line/10 bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
                    <object
                        data={`${CV_PDF_PATH}#view=FitH`}
                        type="application/pdf"
                        className="h-[78vh] min-h-[520px] w-full"
                        aria-label={t.cv.pdf_label}
                    >
                        <div className="flex min-h-[520px] flex-col items-center justify-center gap-6 p-10 text-center">
                            <p className="max-w-xl text-lg text-muted">
                                {t.cv.fallback}
                            </p>
                            <a href={CV_PDF_PATH} className="btn-secondary">
                                {t.cv.open_pdf}
                                <ArrowUpRight className="h-4 w-4" />
                            </a>
                        </div>
                    </object>
                </div>
            </ScrollReveal>
        </section>
    )
}

export default CvView
