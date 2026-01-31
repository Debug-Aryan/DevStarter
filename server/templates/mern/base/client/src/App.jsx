import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to __PROJECT_NAME__</h1>
            <p>Built with MERN Stack</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
