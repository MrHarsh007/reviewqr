'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { profileService } from '@/lib/services/profile.service';
import { User } from '@/lib/types/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LABELS } from '@/lib/constants';
import { LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { QRCodeDisplay } from '@/components/dashboard/QRCodeDisplay';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Logo } from '@/components/ui/Logo';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { LazyBackgroundBeams } from "@/components/ui/LazyBackgroundBeams";

export default function DashboardPage() {
    const { user, signOut } = useAuth();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showProfileForm, setShowProfileForm] = useState(false);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        try {
            const profile = await profileService.getUserProfile(user.uid);
            setUserProfile(profile);

            // Show profile form if profile is incomplete
            if (!profile || !profile.companyName || !profile.yearsOfExperience) {
                setShowProfileForm(true);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSaved = (profile: User) => {
        setUserProfile(profile);
        setShowProfileForm(false);
        toast.success('Profile saved successfully!');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                {/* Header */}
                <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-all">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href={ROUTES.HOME} className="flex items-center group">
                            <Logo className="scale-90 transition-transform group-hover:scale-95 origin-left" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Link href="/changelog">
                                <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                                    V:1.0
                                </Badge>
                            </Link>
                            <ThemeToggle />
                            <Button variant="ghost" size="sm" onClick={signOut}>
                                <LogOut className="h-4 w-4 mr-2" />
                                {LABELS.SIGN_OUT}
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative">
                    <LazyBackgroundBeams className="py-12">
                        <div className="container mx-auto px-4 relative z-20">
                            {/* <div className="text-center mb-12">
                                <p className="text-sm md:text-base uppercase tracking-[0.2em] text-muted-foreground mb-2">
                                    welcome to the
                                </p>
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white font-sans tracking-tight">
                                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                                        <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                                            <span className="">Review QR</span>
                                        </div>
                                        <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                                            <span className="">Review QR</span>
                                        </div>
                                    </div>
                                </h2>
                            </div> */}

                            {loading ? (
                                <div className="flex items-center justify-center min-h-[400px]">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : showProfileForm || !userProfile ? (
                                <div className="max-w-2xl mx-auto">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Complete Your Profile</CardTitle>
                                            <CardDescription>
                                                Fill in your details to generate your personalized QR code
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ProfileForm
                                                user={user!}
                                                existingProfile={userProfile}
                                                onSave={handleProfileSaved}
                                                onCancel={userProfile ? () => setShowProfileForm(false) : undefined}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Profile Section */}
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Your Profile</CardTitle>
                                                <CardDescription>Manage your employee information</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={userProfile.photoURL}
                                                        alt={userProfile.displayName}
                                                        className="h-16 w-16 rounded-full"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{userProfile.displayName}</h3>
                                                        <p className="text-sm text-muted-foreground">{userProfile.companyName}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {userProfile.yearsOfExperience} years of experience
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => setShowProfileForm(true)}
                                                >
                                                    Edit Profile
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        {userProfile.location && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Review Location</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    {userProfile.location.type === 'google_maps' ? (
                                                        <div>
                                                            <p className="font-medium">{userProfile.location.placeName}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {userProfile.location.placeAddress}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <p className="font-medium">{userProfile.location.platformName}</p>
                                                            <a
                                                                href={userProfile.location.externalUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-primary hover:underline"
                                                            >
                                                                {userProfile.location.externalUrl}
                                                            </a>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )}

                                        {userProfile.categories && userProfile.categories.length > 0 && (
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>Review Categories</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {userProfile.categories.map((category, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                                                            >
                                                                {category}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Your Review Link</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex-1 p-2 bg-muted rounded border text-sm break-all font-mono">
                                                        {`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review/${userProfile.uid}`}
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/review/${userProfile.uid}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast.success('Link copied to clipboard');
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="h-4 w-4"
                                                        >
                                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                        </svg>
                                                        <span className="sr-only">Copy link</span>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* QR Code Section */}
                                    <div>
                                        <QRCodeDisplay userProfile={userProfile} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </LazyBackgroundBeams>
                </main>
            </div>
        </ProtectedRoute>
    );
}
