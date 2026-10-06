const Icon = ({ children, className = 'h-4 w-4', strokeWidth = 1.75 }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        {children}
    </svg>
)

export const ArrowUpRight = (props) => (
    <Icon {...props}><path d="M7 17 17 7M8 7h9v9" /></Icon>
)

export const ArrowDown = (props) => (
    <Icon {...props}><path d="M12 5v14M5 12l7 7 7-7" /></Icon>
)

export const ArrowUp = (props) => (
    <Icon {...props}><path d="M12 19V5M5 12l7-7 7 7" /></Icon>
)

export const ArrowRight = (props) => (
    <Icon {...props}><path d="M5 12h14M12 5l7 7-7 7" /></Icon>
)

export const Download = (props) => (
    <Icon {...props}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></Icon>
)

export const Close = (props) => (
    <Icon {...props}><path d="M6 6l12 12M18 6 6 18" /></Icon>
)

export const Copy = (props) => (
    <Icon {...props}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></Icon>
)

export const Check = (props) => (
    <Icon {...props}><path d="m5 12 5 5 9-10" /></Icon>
)

export const Sun = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Icon>
)

export const Moon = (props) => (
    <Icon {...props}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></Icon>
)

export const Play = ({ className = 'h-3 w-3' }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
)
