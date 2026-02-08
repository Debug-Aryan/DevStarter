export async function apiFetch(path, options = {}) {
    const res = await fetch(path, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    })

    const data = await res
        .json()
        .catch(() => ({ success: false, message: 'Invalid JSON response' }))

    if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`)
    }

    return data
}
