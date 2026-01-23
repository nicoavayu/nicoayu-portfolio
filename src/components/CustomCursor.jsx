import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false)
    const [isPointer, setIsPointer] = useState(false)
    const [cursorText, setCursorText] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 300 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        // Inject CSS to hide default cursor on desktop only
        const style = document.createElement('style')
        style.innerHTML = `
            @media (min-width: 1024px) {
                * {
                    cursor: none !important;
                }
            }
        `
        document.head.appendChild(style)

        return () => {
            document.head.removeChild(style)
        }
    }, [])

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            setIsVisible(true)
        }

        const handleMouseEnter = (e) => {
            const target = e.target
            const isClickable = target.closest('a, button, [role="button"], .cursor-pointer')
            const isProjectCard = target.closest('.project-card-hover')

            if (isProjectCard) {
                setIsHovering(true)
                setCursorText('VIEW')
                setIsPointer(true)
            } else if (isClickable) {
                setIsPointer(true)
                setIsHovering(false)
                setCursorText('')
            } else {
                setIsPointer(false)
                setIsHovering(false)
                setCursorText('')
            }
        }

        const handleMouseLeave = () => {
            setIsVisible(false)
        }

        window.addEventListener('mousemove', moveCursor)
        document.addEventListener('mouseover', handleMouseEnter)
        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            document.removeEventListener('mouseover', handleMouseEnter)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [cursorX, cursorY])

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: isHovering ? 3 : isPointer ? 1.5 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28
                    }}
                >
                    {/* Outer Circle */}
                    <motion.div
                        className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center"
                        animate={{
                            borderColor: isHovering ? '#f97316' : '#ffffff',
                        }}
                    >
                        {/* Inner Dot */}
                        {!isHovering && (
                            <motion.div
                                className="w-1.5 h-1.5 bg-white rounded-full"
                                animate={{
                                    scale: isPointer ? 0 : 1,
                                }}
                            />
                        )}

                        {/* Text for project hover */}
                        {cursorText && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="text-[8px] font-bold tracking-widest text-white absolute"
                            >
                                {cursorText}
                            </motion.span>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Cursor Trail Effect */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 0.3 : 0,
                }}
            >
                <motion.div
                    className="w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-sm"
                    animate={{
                        scale: isHovering ? 2 : isPointer ? 1.2 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                    }}
                />
            </motion.div>
        </>
    )
}

export default CustomCursor
