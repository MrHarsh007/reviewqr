// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://bf5f79a4e27174c85ae42e7907356da8@o4510734980481024.ingest.us.sentry.io/4510734994046976",

  // Add optional integrations for additional features
  integrations: [
    // Only enable replay in development or when explicitly needed
    // Replay integration is very heavy and impacts performance
    ...(isProduction ? [] : [Sentry.replayIntegration()]),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      isNameRequired: true,
      autoInject: false,
    }),
  ],

  // Reduce trace sampling in production to minimize performance impact
  // Use 100% in development for better debugging, 10% in production
  tracesSampleRate: isProduction ? 0.1 : 1.0,
  
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // Lower in production to reduce performance overhead
  replaysSessionSampleRate: isProduction ? 0.05 : 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: isProduction ? 0.5 : 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
