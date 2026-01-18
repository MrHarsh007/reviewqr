'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { profileService } from '@/lib/services/profile.service';
import { User } from '@/lib/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LABELS, ERROR_MESSAGES, SUCCESS_MESSAGES, ROUTES } from '@/lib/constants';
import { ExternalLink, Copy, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { BackgroundLines } from '@/components/ui/background-lines';

interface ReviewClientProps {
    uid: string;
    initialData: User | null;
}

export function ReviewClient({ uid, initialData }: ReviewClientProps) {
    const { copy } = useCopyToClipboard();

    const [employee, setEmployee] = useState<User | null>(initialData);
    const [loading, setLoading] = useState(!initialData);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [generatedReview, setGeneratedReview] = useState('');
    const [generating, setGenerating] = useState(false);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    const COOLDOWN_KEY = `cooldown_${uid}`;
    const COOLDOWN_DURATION = 120; // 2 minutes in seconds

    const loadEmployee = useCallback(async () => {
        try {
            const profile = await profileService.getUserProfile(uid);
            setEmployee(profile);
        } catch (error) {
            console.error('Error loading employee:', error);
            toast.error(ERROR_MESSAGES.PROFILE_LOAD_FAILED);
        } finally {
            setLoading(false);
        }
    }, [uid]);

    useEffect(() => {
        if (!initialData) {
            loadEmployee();
        }
    }, [initialData, loadEmployee]);

    useEffect(() => {
        if (employee) {
            document.title = `Review for ${employee.displayName} | ${LABELS.APP_NAME}`;
        }
    }, [employee]);

    // Handle Cooldown Logic
    useEffect(() => {
        const stored = localStorage.getItem(COOLDOWN_KEY);
        if (stored) {
            const expiry = parseInt(stored, 10);
            const now = Math.floor(Date.now() / 1000);
            if (expiry > now) {
                setCooldownRemaining(expiry - now);
            }
        }
    }, [COOLDOWN_KEY]);

    useEffect(() => {
        if (cooldownRemaining > 0) {
            const timer = setInterval(() => {
                setCooldownRemaining((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldownRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleGenerateReview = async () => {
        if (!selectedCategory) {
            toast.error(ERROR_MESSAGES.CATEGORY_REQUIRED);
            return;
        }

        if (!employee) return;

        setGenerating(true);
        try {
            const response = await fetch('/api/generate-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeName: employee.displayName,
                    companyName: employee.companyName,
                    category: selectedCategory,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate review');
            }

            const data = await response.json();
            setGeneratedReview(data.review);
            toast.success(SUCCESS_MESSAGES.REVIEW_GENERATED);
        } catch (error) {
            console.error('Error generating review:', error);
            toast.error(ERROR_MESSAGES.AI_GENERATION_FAILED);
        } finally {
            setGenerating(false);
            // Set cooldown if successful
            const expiry = Math.floor(Date.now() / 1000) + COOLDOWN_DURATION;
            localStorage.setItem(COOLDOWN_KEY, expiry.toString());
            setCooldownRemaining(COOLDOWN_DURATION);
        }
    };

    const handleAddReview = () => {
        if (employee?.location?.externalUrl) {
            window.open(employee.location.externalUrl, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Profile Not Found</CardTitle>
                        <CardDescription>
                            This review page doesn't exist or is no longer available.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/">Go Back Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!employee.location || !employee.location.externalUrl) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Profile Incomplete</CardTitle>
                        <CardDescription>
                            {LABELS.INCOMPLETE_PROFILE}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            The employee needs to configure their review location before you can leave a review.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Header */}
            <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-10 transition-all">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href={ROUTES.HOME} className="flex items-center group">
                        <Logo className="scale-90 transition-transform group-hover:scale-95 origin-left" />
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Background Lines Animation Wrapping Main Content */}
            <BackgroundLines className="py-8" svgOptions={{

                duration: 5
            }}>
                <main className="container mx-auto px-4 max-w-2xl relative z-10">
                    <div className="space-y-6">
                        {/* Employee Card */}
                        <Card>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={employee.photoURL}
                                        alt={employee.displayName}
                                        className="h-20 w-20 rounded-full object-cover border-2 border-primary/10"
                                    />
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold">Review for {employee.displayName}</h1>
                                        <p className="text-muted-foreground font-medium">{employee.companyName}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {employee.yearsOfExperience} years of experience
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Add Review Button */}
                        <Button onClick={handleAddReview} size="lg" className="w-full text-lg h-12 shadow-md">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {LABELS.ADD_REVIEW} on {employee.location.platformName}
                        </Button>

                        {/* Prefilled Reviews */}
                        {employee.prefilledReviews && employee.prefilledReviews.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Suggested Reviews</CardTitle>
                                    <CardDescription>
                                        Choose a review to copy or use as inspiration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {employee.prefilledReviews.map((review, index) => (
                                        <div key={index} className="p-4 border rounded-lg space-y-2 bg-card/50 hover:bg-card transition-colors">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">
                                                    Review {index + 1}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copy(review)}
                                                >
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Copy
                                                </Button>
                                            </div>
                                            <p className="text-sm leading-relaxed">{review}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Generate Review With AI Section */}
                        <Card className="border-primary/20 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Sparkles className="h-5 w-5" />
                                    Generate Review With AI
                                </CardTitle>
                                <CardDescription>
                                    Select a category and let AI write a perfect review for you
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Category Selection */}
                                <div className="space-y-3">
                                    <Label>What would you like to focus on?</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {employee.categories.map((category) => (
                                            <Button
                                                key={category}
                                                variant={selectedCategory === category ? "default" : "outline"}
                                                onClick={() => setSelectedCategory(category)}
                                                className="rounded-full transition-all"
                                                size="sm"
                                            >
                                                {category}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <Button
                                    onClick={handleGenerateReview}
                                    disabled={!selectedCategory || generating || cooldownRemaining > 0}
                                    className="w-full"
                                    size="lg"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : cooldownRemaining > 0 ? (
                                        <>
                                            AI is resting... Try again in {formatTime(cooldownRemaining)}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            {LABELS.GENERATE_WITH_AI}
                                        </>
                                    )}
                                </Button>

                                {/* Generated Review Display */}
                                {generatedReview && (
                                    <div className="space-y-4 pt-4 border-t animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 relative group">
                                            <p className="text-sm leading-relaxed pr-8 italic">
                                                "{generatedReview}"
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copy(generatedReview)}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1"
                                                onClick={() => {
                                                    copy(generatedReview);
                                                    toast.success('Review copied! Now paste it on ' + employee.location?.platformName);
                                                }}
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy Review
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </BackgroundLines>
        </div>
    );
}
