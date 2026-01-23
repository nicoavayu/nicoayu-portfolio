import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, onLogoClick }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500">
            <Header onLogoClick={onLogoClick} />
            <main className="flex-grow pt-32 px-4 md:px-12 max-w-[1920px] mx-auto w-full">
                {children}
            </main>
            <Footer onLogoClick={onLogoClick} />
        </div>
    )
}

export default Layout
