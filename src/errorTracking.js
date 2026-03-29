/* ============================================
   Velo — Error Tracking (Sentry)
   ============================================ 
   
   SETUP INSTRUCTIONS:
   1. Go to https://sentry.io and create a free account
   2. Create a new project → select "Browser JavaScript"
   3. Get your DSN (Data Source Name) from Project Settings → Client Keys
   4. Replace the DSN below with your actual Sentry DSN
   ============================================ */

const SENTRY_DSN = 'https://YOUR_KEY@YOUR_ORG.ingest.sentry.io/YOUR_PROJECT_ID'; // ← Replace with your Sentry DSN

let sentryInitialized = false;

/**
 * Initialize Sentry error tracking
 * Uses the lightweight Sentry browser SDK loader
 */
export function initSentry() {
  if (sentryInitialized) return;

  // Don't load Sentry in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Sentry] Skipping in development mode');
    setupFallbackErrorHandler();
    return;
  }

  // Load Sentry SDK from CDN
  const script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/8.0.0/bundle.min.js';
  script.crossOrigin = 'anonymous';
  script.async = true;

  script.onload = () => {
    if (window.Sentry) {
      window.Sentry.init({
        dsn: SENTRY_DSN,
        environment: 'production',
        // Only send 20% of transactions to stay within free tier
        tracesSampleRate: 0.2,
        // Ignore common non-actionable errors
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'ResizeObserver loop completed with undelivered notifications',
          'Non-Error promise rejection captured',
          'Loading chunk',
          'ChunkLoadError'
        ],
        beforeSend(event) {
          // Strip any potential PII from error messages
          return event;
        }
      });
      sentryInitialized = true;
      console.log('[Sentry] Error tracking initialized');
    }
  };

  script.onerror = () => {
    console.warn('[Sentry] Failed to load SDK, using fallback error handler');
    setupFallbackErrorHandler();
  };

  document.head.appendChild(script);
}

/**
 * Fallback error handler when Sentry isn't available
 */
function setupFallbackErrorHandler() {
  window.addEventListener('error', (event) => {
    console.error('[Velo Error]', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      col: event.colno
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Velo Unhandled Promise]', event.reason);
  });
}

/**
 * Manually capture an error
 * @param {Error} error - The error to capture
 * @param {object} context - Additional context
 */
export function captureError(error, context = {}) {
  if (sentryInitialized && window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  } else {
    console.error('[Velo Error]', error, context);
  }
}
