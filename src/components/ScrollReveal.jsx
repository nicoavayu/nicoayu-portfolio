import { motion } from 'framer-motion'

const ScrollReveal = ({ children, width = "fit-content", delay = 0.2, direction = "up" }) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
        },
    }

    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay, ease: [0.17, 0.67, 0.83, 0.67] }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default ScrollReveal
