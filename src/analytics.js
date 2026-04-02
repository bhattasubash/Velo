/* ============================================
   Velo — Advanced Analytics Engine (GA4)
   ============================================ */

/**
 * Initialize analytics and set up initial state.
 * Called after user consent is granted or verified.
 */
export function initAnalytics() {
  if (typeof window.gtag === 'function') {
    // Analytics is handled via index.html scripts, but we can verify it's loaded
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Analytics] 🟢 Analytics Initialized (Consent Accepted)');
    }
  }
}

/**
 * Core event tracking utility.
 * Prevents errors if Adblockers block the GA tracking script,
 * but securely pushes robust product data when available.
 * 
 * @param {string} eventName - Standardized event name
 * @param {object} params - Dictionary of event parameters
 */
export function trackEvent(eventName, params = {}) {
  // Graceful degradation: always ensure window.gtag won't crash the app
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    
    // Dev logging if running locally
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[Analytics] 📊 Event Fired: ${eventName}`, params);
    }
  } else {
    // If blocked or not loaded yet
    console.warn(`[Analytics Blocked] 🚫 Missed Event: ${eventName}`, params);
  }
}

