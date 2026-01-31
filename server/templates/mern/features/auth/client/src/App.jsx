import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function Home() {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to __PROJECT_NAME__</h1>
            {user ? (
                <div>
                    <p>Hello, {user.name}!</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <p>Please <Link to="/login">Login</Link></p>
            )}
        </div>
    );
}

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
                    <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                    {/* Add other links */}
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* Example private route
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
