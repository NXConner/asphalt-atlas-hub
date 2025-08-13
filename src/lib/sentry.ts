import * as Sentry from "@sentry/react"


export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration()
      ],
      environment: import.meta.env.VITE_APP_ENV || 'production',
      tracesSampleRate: 0.1,
      beforeSend(event) {
        // Filter out common noise
        if (event.exception) {
          const error = event.exception.values?.[0]
          if (error?.value?.includes('Network Error') ||
              error?.value?.includes('ChunkLoadError')) {
            return null
          }
        }
        return event
      }
    })
  }
}

export const captureError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('error_context', context)
      }
      Sentry.captureException(error)
    })
  } else {
    console.error('Error captured:', error, context)
  }
}

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level)
  } else {
    console.log(`[${level}] ${message}`)
  }
}