"use client";

import dynamic from 'next/dynamic';

// Lazy load FeedbackButton to reduce initial bundle size and defer Sentry SDK loading
// Must be in a client component to use ssr: false option
const FeedbackButton = dynamic(() => import("./FeedbackButton"), {
    ssr: false, // Client-side only component
});

export default FeedbackButton;
