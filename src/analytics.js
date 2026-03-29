/* ============================================
   Velo — Analytics Module (Google Analytics GA4)
   ============================================ 
   
   SETUP INSTRUCTIONS:
   1. Go to https://analytics.google.com
   2. Create a new GA4 property for Velo
   3. Get your Measurement ID (format: G-XXXXXXXXXX)
   4. Replace 'G-XXXXXXXXXX' below with your actual ID
   ============================================ */

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← Replace with your GA4 Measurement ID

let analyticsInitialized = false;

/**
 * Initialize Google Analytics GA4
 * Only loads if user has accepted analytics cookies
 */
export function initAnalytics() {
  if (analyticsInitialized) return;
  
  // Check if user has consented to analytics
  const consent = localStorage.getItem('velo_cookie_consent');
  if (consent !== 'accepted') return;

  // Don't load analytics in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Analytics] Skipping GA in development mode');
    return;
  }

  // Load Google Analytics gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      // Anonymize IPs for privacy
      anonymize_ip: true,
      // Disable advertising features (not needed)
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    analyticsInitialized = true;
    console.log('[Analytics] Google Analytics initialized');
  };
}

/**
 * Track a custom event
 * @param {string} eventName - Event name (e.g., 'start_focus', 'complete_session')
 * @param {object} params - Optional parameters
 */
export function trackEvent(eventName, params = {}) {
  if (!analyticsInitialized || !window.gtag) return;
  window.gtag('event', eventName, params);
}

/**
 * Track a page view (for SPA hash-based routing)
 * @param {string} pagePath - The page path (e.g., '#/timer')
 */
export function trackPageView(pagePath) {
  if (!analyticsInitialized || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: document.title
  });
}
