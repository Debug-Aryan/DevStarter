export default function Loader({ label = 'Loading' }) {
    return (
        <span className="inline-flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-slate-300/40 border-t-slate-900" />
            <span className="text-sm">{label}…</span>
        </span>
    )
}
