import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Custom hook for Firebase auth

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false); // For Google login
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Regular Expression for email validation
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Password validation
    const isValidPassword = (password) => password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email.');
            setLoading(false);
            return;
        }
        if (!isValidPassword(password)) {
            setError('Password must be at least 8 characters.');
            setLoading(false);
            return;
        }

        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (error) {
            setError(getFirebaseErrorMessage(error.code) || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');

        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            setError(getFirebaseErrorMessage(error.code) || 'An unexpected error occurred.');
        } finally {
            setGoogleLoading(false);
        }
    };

    // Firebase error messages mapping
    const getFirebaseErrorMessage = (code) => {
        switch (code) {
            case 'auth/invalid-email':
                return 'Invalid email format.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            default:
                return 'Error. Please try again later.';
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 sm:text-sm"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Google Login Button */}
                <div className="mt-6">
                    <button
                        onClick={handleGoogleLogin}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        disabled={googleLoading}
                    >
                        {googleLoading ? 'Logging in with Google...' : 'Login with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
