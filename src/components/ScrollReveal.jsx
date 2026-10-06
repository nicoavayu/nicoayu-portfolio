import { motion } from 'framer-motion'

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

const OFFSETS = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: 28 },
    right: { x: -28 },
}

const ScrollReveal = ({ children, width = "fit-content", delay = 0, direction = "up", className = "" }) => {
    return (
        <motion.div
            className={className}
            style={{ width }}
            initial={{ opacity: 0, ...OFFSETS[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay, ease: EASE_OUT_EXPO }}
        >
            {children}
        </motion.div>
    )
}

export default ScrollReveal
