import { useLanguage } from '../context/LanguageContext'

const Footer = ({ onLogoClick }) => {
    const { t } = useLanguage()

    return (
        <footer id="footer" className="py-12 px-6 border-t border-gray-200 dark:border-gray-900 mt-20 transition-colors duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                <div className="flex gap-4">
                    <a href="#work" onClick={onLogoClick} className="hover:text-black dark:hover:text-white transition-all duration-300 uppercase">{t.nav.work}</a>
                    <a href="#about" onClick={onLogoClick} className="hover:text-black dark:hover:text-white transition-all duration-300 uppercase">{t.nav.about}</a>
                    <a href="#contact" onClick={onLogoClick} className="hover:text-black dark:hover:text-white transition-all duration-300 uppercase">{t.nav.contact}</a>
                </div>
                <div className="font-light tracking-widest transition-colors duration-500">
                    &copy; {new Date().getFullYear()} NICO AVAYÚ. {t.footer.rights}
                </div>
            </div>
        </footer>
    )
}

export default Footer
