import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en'
    })

    useEffect(() => {
        localStorage.setItem('language', language)
    }, [language])

    const t = translations[language]

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'es' : 'en')
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
