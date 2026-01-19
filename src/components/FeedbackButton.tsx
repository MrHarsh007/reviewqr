"use client";

import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/nextjs";
import { Megaphone } from "lucide-react";

export default function FeedbackButton() {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Ensure the feedback integration is loaded and the button exists
        const feedback = Sentry.getFeedback();

        if (feedback && buttonRef.current) {
            // Attach the feedback widget to our custom button
            // This will handle the click event automatically
            const cleanup = feedback.attachTo(buttonRef.current, {
                formTitle: "Report a Bug",
            });

            return () => {
                // Cleanup if necessary (Sentry SDK handles this mostly, but good practice if the SDK supports detaching)
                // Note: checking SDK version for detach capability might be needed in strict environments, 
                // but typically attachTo returns a cleanup function or we just leave it.
                // Sentry's attachTo returning a cleanup function is a common pattern in their JS SDKs.
                if (typeof cleanup === 'function') {
                    cleanup();
                }
            };
        }
    }, []);

    return (
        <button
            ref={buttonRef}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Give Feedback"
        >
            <Megaphone className="h-6 w-6" />
        </button>
    );
}
