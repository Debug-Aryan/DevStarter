import { useState, useEffect } from 'react'

function App() {
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/health')
            .then(res => res.json())
            .then(data => setMessage(data.message))
            .catch(() => setMessage('Backend not connected'))
    }, [])

    return (
        <div className="container" style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>__PROJECT_NAME__</h1>
            <p>__PROJECT_DESCRIPTION__</p>

            <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Backend Status</h2>
                <p>{message}</p>
            </div>

            <p style={{ marginTop: '2rem', color: '#666' }}>
                Edit <code>client/src/App.tsx</code> to get started.
            </p>
        </div>
    )
}

export default App
