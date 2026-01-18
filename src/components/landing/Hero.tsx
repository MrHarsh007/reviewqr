'use client';

import { Button } from '@/components/ui/button';
import { LABELS, ROUTES } from '@/lib/constants';
import { Sparkles, Zap, ChevronRight, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { toast } from 'sonner';

export function Hero() {
    const { signInWithGoogle, user } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsSigningIn(true);
            await signInWithGoogle();
        } catch (error: any) {
            console.error('Sign in error:', error);
            if (error.code.includes('auth/popup-closed-by-user')) {
                toast.error('Sign in cancelled');
            } else {
                toast.error('Failed to sign in with Google');
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white border-transparent animate-ai-gradient mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 transition-all cursor-default shadow-lg shadow-purple-500/20">
                    <Sparkles className="h-4 w-4" />
                    <span>AI-Powered Review Generation is Here</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                        {LABELS.TAGLINE.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <br />
                    {LABELS.TAGLINE.split(' ').slice(2).join(' ')}
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    Generate personalized QR codes that help customers create quality reviews with AI assistance,
                    and seamlessly redirect them to your preferred review platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 py-4 border-2"
                        asChild
                    >
                        <Link href="#how-it-works">
                            How it Works
                            <ChevronRight className="ml-1 h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    {!user ? (
                        <Button
                            size="lg"
                            className="text-lg px-8 py-4 group shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all min-w-[200px] border-2 border-transparent"
                            onClick={handleSignIn}
                            disabled={isSigningIn}
                        >
                            {isSigningIn ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                            )}
                            {LABELS.GET_STARTED}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="text-lg px-8 py-4 group shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all min-w-[200px] border-2 border-transparent"
                            asChild
                        >
                            <Link href={ROUTES.DASHBOARD}>
                                Go to Dashboard
                                <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    )}

                </div>

                {/* Social Proof Placeholder */}
                <div className="mt-20 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-700">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">Trusted by 500+ users</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
