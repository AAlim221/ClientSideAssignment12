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
    const [loading, setLoading] = useState(true);  // Start with loading as true
    const [error, setError] = useState('');

    const createUser = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);  // Store the created user in state
            return userCredential;
        } catch (error) {
            console.error('Error creating user:', error.message);
            setError(error.message);
            throw new Error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);  // Store the signed-in user in state
            return userCredential;
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError(error.message);
            throw new Error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);  // Store the Google signed-in user in state
            return result;
        } catch (error) {
            console.error('Error signing in with Google:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = async (profileInfo) => {
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, profileInfo);
            setUser({ ...user, ...profileInfo });  // Update user state with new profile info
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null); // Explicitly set user to null after sign out
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);  // Update the user state with the current user
            setLoading(false);  // Set loading to false after auth state is updated
            console.log('user in the auth state change', currentUser);  // Optional debug log
        });

        return () => {
            unSubscribe();  // Cleanup on component unmount
        };
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
