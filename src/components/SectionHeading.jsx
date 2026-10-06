const SectionHeading = ({ index, label, aside }) => (
    <div className="flex items-center justify-between gap-6 eyebrow">
        <span className="flex items-center gap-3">
            <span className="text-accent-ink">{index}</span>
            <span className="h-px w-8 bg-line/20" aria-hidden="true" />
            <span>{label}</span>
        </span>
        {aside && <span className="hidden sm:block">{aside}</span>}
    </div>
)

export default SectionHeading
