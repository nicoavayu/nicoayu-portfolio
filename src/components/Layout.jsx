import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, onNavigate, showSections }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
            >
                Skip to content
            </a>
            <Header onNavigate={onNavigate} showSections={showSections} />
            <main id="main" className="flex-grow">
                {children}
            </main>
            <Footer onNavigate={onNavigate} />
        </div>
    )
}

export default Layout
