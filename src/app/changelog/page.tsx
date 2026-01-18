'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { BackgroundLines } from '@/components/ui/background-lines';

export default function ChangeLogPage() {
    const versions = [
        {
            version: 'v:1',
            status: 'Current',
            date: 'January 2026',
            description: 'Initial launch with core AI-powered review features.',
            features: [
                'AI Review Generation with domain-specific categories',
                '2-minute generation cooldown for system stability',
                'Personalized QR Code generation (Poster & Basic)',
                'Real-time Dashboard for profile management',
                'Google Maps & External URL location integration',
                'Dynamic Dark/Light mode support',
            ]
        },
        {
            version: 'v:2',
            status: 'Planned',
            date: 'Coming Soon',
            description: 'Enhancing visual identity and location precision.',
            features: [
                'Google Map Integration (Interactive map component)',
                'Profile Photo Update (Custom photo uploads)',
                'Enhanced QR Code customization',
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <BackgroundLines className="w-full min-h-screen">

                <div className="relative z-10">
                    {/* Header */}
                    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-20">
                        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                            <Link href={ROUTES.DASHBOARD} className="flex items-center group">
                                <Logo className="scale-90 transition-transform group-hover:scale-95 origin-left" />
                            </Link>
                            <Link href={ROUTES.DASHBOARD}>
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </header>

                    <main className="container mx-auto px-4 py-12 max-w-4xl">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl font-bold tracking-tight mb-4">Roadmap & Change Log</h1>
                            <p className="text-muted-foreground text-lg">
                                Track the evolution of Review QR and see what's coming next.
                            </p>
                        </div>

                        <div className="space-y-12">
                            {versions.map((v, idx) => (
                                <div key={v.version} className="relative">
                                    {/* Vertical line for timeline */}
                                    {idx !== versions.length - 1 && (
                                        <div className="absolute left-[21px] top-[42px] bottom-[-48px] w-px bg-border" />
                                    )}

                                    <div className="flex gap-6">
                                        <div className={`h-11 w-11 rounded-full border flex items-center justify-center bg-background shrink-0 ${v.status === 'Current' ? 'border-primary ring-4 ring-primary/10' : 'border-muted-foreground/30'
                                            }`}>
                                            {v.status === 'Current' ? (
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                            ) : (
                                                <Clock className="h-6 w-6 text-muted-foreground" />
                                            )}
                                        </div>

                                        <Card className="flex-1">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-2xl">{v.version}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2">
                                                        {v.date}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={v.status === 'Current' ? 'default' : 'secondary'}>
                                                    {v.status}
                                                </Badge>
                                            </CardHeader>
                                            <CardContent className="pt-4">
                                                <p className="font-medium mb-4">{v.description}</p>
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {v.features.map((feature, fIdx) => (
                                                        <li key={fIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                            <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${v.status === 'Current' ? 'bg-primary' : 'bg-muted-foreground/40'
                                                                }`} />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </BackgroundLines>
        </div >
    );
}
