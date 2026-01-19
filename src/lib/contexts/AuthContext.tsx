'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User as FirebaseUser,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    browserPopupRedirectResolver,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            // Use browserPopupRedirectResolver to defer iframe loading until sign-in is clicked
            // This prevents Firebase from loading auth iframes on page load
            const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
            if (result.user) {
                router.push(ROUTES.DASHBOARD);
            }
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            // Re-throw the error so specific components can handle UI states
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            router.push(ROUTES.HOME);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
