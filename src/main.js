/* ============================================
   Velo — Entry Point
   ============================================ */

import './styles/variables.css';
import './styles/base.css';
import './styles/views.css';
import './styles/cookieConsent.css';
import { initApp } from './app.js';

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();

  // Lazy-load production enhancements (analytics, error tracking, cookie consent)
  // These are non-critical and should never block the app from rendering
  try {
    import('./cookieConsent.js').then(({ initCookieConsent }) => {
      initCookieConsent();
    }).catch(() => {});

    import('./errorTracking.js').then(({ initSentry }) => {
      initSentry();
    }).catch(() => {});

    import('./analytics.js').then(({ trackPageView, trackEvent }) => {
      trackPageView(window.location.hash || '#/');
      trackEvent('app_open');

      // Track SPA route changes
      window.addEventListener('hashchange', () => {
        trackPageView(window.location.hash || '#/');
      });
    }).catch(() => {});
  } catch (e) {
    // Never let production enhancements break the app
    console.warn('[Velo] Non-critical module failed to load:', e);
  }
});
