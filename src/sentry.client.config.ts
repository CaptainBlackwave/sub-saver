import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  enabled: process.env.NODE_ENV === "production",
  
  tracesSampleRate: 1.0,
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  environment: process.env.NODE_ENV,
  
  beforeSend(event) {
    if (process.env.NODE_ENV === "development") {
      console.log("Sentry event:", event);
      return null;
    }
    return event;
  },
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
