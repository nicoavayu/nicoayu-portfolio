import ScrollReveal from './ScrollReveal'
import { useLanguage } from '../context/LanguageContext'

const CV_PDF_PATH = '/Nicoavayu_cv.pdf'

const CvView = () => {
    const { t } = useLanguage()

    return (
        <section className="pt-10 pb-20">
            <ScrollReveal width="100%">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-10">
                    <div className="max-w-3xl">
                        <p className="text-xs md:text-sm text-[#f97316] font-bold tracking-[0.35em] uppercase mb-4">
                            {t.cv.eyebrow}
                        </p>
                        <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-none text-black dark:text-white transition-colors duration-500">
                            {t.cv.title_part1} <span className="text-[#f97316]">{t.cv.title_part2}</span>
                        </h1>
                        <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg md:text-xl font-light transition-colors duration-500">
                            {t.cv.lead}
                        </p>
                    </div>

                    <a
                        href={CV_PDF_PATH}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-4 px-8 py-4 border border-black/10 dark:border-white/10 text-[10px] font-bold tracking-[0.35em] uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500 text-black dark:text-white"
                    >
                        <span>{t.cv.open_pdf}</span>
                        <span className="h-px w-10 bg-current transition-all duration-300 group-hover:w-14"></span>
                    </a>
                </div>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={0.15}>
                <div className="relative overflow-hidden rounded-[2rem] border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] shadow-2xl transition-colors duration-500">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f97316] via-[#ea580c] to-[#f97316]"></div>
                    <object
                        data={`${CV_PDF_PATH}#view=FitH`}
                        type="application/pdf"
                        className="h-[72vh] min-h-[520px] w-full"
                        aria-label={t.cv.pdf_label}
                    >
                        <div className="flex min-h-[520px] flex-col items-center justify-center gap-6 p-10 text-center">
                            <p className="max-w-xl text-lg font-light text-gray-600 dark:text-gray-400">
                                {t.cv.fallback}
                            </p>
                            <a
                                href={CV_PDF_PATH}
                                className="px-8 py-4 border border-black/10 dark:border-white/10 text-[10px] font-bold tracking-[0.35em] uppercase hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all duration-500 text-black dark:text-white"
                            >
                                {t.cv.open_pdf}
                            </a>
                        </div>
                    </object>
                </div>
            </ScrollReveal>
        </section>
    )
}

export default CvView
