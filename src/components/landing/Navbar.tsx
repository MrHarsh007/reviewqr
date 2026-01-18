'use client';

import { Button } from '@/components/ui/button';
import { LABELS, ROUTES } from '@/lib/constants';
import { QrCode } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { signInWithGoogle, user } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSignIn = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
        } catch (error: any) {
            console.error('Sign in error:', error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign in cancelled');
            } else {
                toast.error('Failed to sign in with Google');
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
                scrolled
                    ? 'bg-background/80 backdrop-blur-md border-border py-3'
                    : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link href={ROUTES.HOME} className="flex items-center group">
                        <Logo className="transition-transform group-hover:scale-105" />
                    </Link>
                    <Link href="/changelog">
                        <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                            V:1.0
                        </Badge>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
                    <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</Link>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {!user ? (
                        <Button
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                            className="px-6"
                        >
                            {isSigningIn ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Sign In
                        </Button>
                    ) : (
                        <Button asChild className="px-6">
                            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
