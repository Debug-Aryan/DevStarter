export default function ErrorMessage({ message }) {
    if (!message) return null

    return (
        <div className="rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {message}
        </div>
    )
}
