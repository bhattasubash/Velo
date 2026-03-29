/* ============================================
   Velo — Cookie Consent Banner
   Minimal, non-intrusive cookie consent
   ============================================ */

import { initAnalytics } from './analytics.js';

/**
 * Initialize the cookie consent banner.
 * Shows only if user hasn't already made a choice.
 */
export function initCookieConsent() {
  const consent = localStorage.getItem('velo_cookie_consent');
  
  // If already consented, just init analytics
  if (consent === 'accepted') {
    initAnalytics();
    return;
  }

  // If already declined, do nothing
  if (consent === 'declined') return;

  // Create and inject the banner
  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.innerHTML = `
    <div class="cookie-consent-inner">
      <p class="cookie-consent-text">
        We use cookies for anonymous analytics to improve Velo. No personal data is collected.
        <a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
      </p>
      <div class="cookie-consent-actions">
        <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>
        <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // Animate in
  requestAnimationFrame(() => {
    banner.classList.add('visible');
  });

  // Accept
  banner.querySelector('#cookie-accept').addEventListener('click', () => {
    localStorage.setItem('velo_cookie_consent', 'accepted');
    hideBanner(banner);
    initAnalytics();
  });

  // Decline
  banner.querySelector('#cookie-decline').addEventListener('click', () => {
    localStorage.setItem('velo_cookie_consent', 'declined');
    hideBanner(banner);
  });
}

function hideBanner(banner) {
  banner.classList.remove('visible');
  setTimeout(() => banner.remove(), 300);
}
