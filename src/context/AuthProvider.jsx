import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);  // Start with loading as false
    const [error, setError] = useState('');

    // Create User
    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setError(''); // Clear previous errors
            return userCredential;
        } catch (error) {
            console.error('Error creating user:', error.message);
            setError('Error creating user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Sign In
    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setError('');
            return userCredential;
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError('Error signing in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In
    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            setError('');
            return result;
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
            setError('Error signing in with Google. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update User Profile
    const updateUserProfile = async (profileInfo) => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, profileInfo);
            setUser({ ...user, ...profileInfo });
            setError('');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setError('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Log Out
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);  // Clear user state
            setError('');
        } catch (error) {
            console.error("Error during logout:", error);  // Log full error
            setError('Logout failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Check if user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false); // Make sure to turn off loading after checking auth state
        });

        return () => unsubscribe();  // Cleanup listener on component unmount
    }, []);

    const authInfo = {
        user,
        loading,
        error,
        createUser,
        signIn,
        signInWithGoogle,
        updateUserProfile,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
