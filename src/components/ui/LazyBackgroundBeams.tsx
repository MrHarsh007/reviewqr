"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Lazy load the background animation component to prevent it from blocking LCP
// This heavy component with complex animations should only load after critical content
const BackgroundBeamsWithCollision = dynamic(
    () => import('./background-beams-with-collision').then(mod => ({ default: mod.BackgroundBeamsWithCollision })),
    {
        ssr: false, // Don't render on server - it's a pure client-side visual effect
        loading: () => null, // No loading state needed - the content renders immediately with a simple background
    }
);

interface LazyBackgroundBeamsProps {
    children: ReactNode;
    className?: string;
}

/**
 * Lazy-loaded wrapper for BackgroundBeamsWithCollision
 * Improves LCP by deferring the heavy animation component until after initial render
 */
export function LazyBackgroundBeams({ children, className }: LazyBackgroundBeamsProps) {
    return (
        <div className={className}>
            <BackgroundBeamsWithCollision className="min-h-screen">
                {children}
            </BackgroundBeamsWithCollision>
        </div>
    );
}
