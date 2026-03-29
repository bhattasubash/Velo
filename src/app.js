/* ============================================
   Velo — App Shell & Router
   Variant Modern UI updates
   ============================================ */

import { renderAssignments } from './views/assignments.js';
import { renderCalendar } from './views/calendar.js';
import { renderTimer } from './views/timer.js';
import { renderProgress } from './views/progress.js';
import { renderFocusMode } from './views/focus.js';

// ─── Route Config (Clean SVGs) ───
const ICONS = {
  // Check square for tasks
  tasks: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  // Calendar
  calendar: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  // Play circle for focus
  timer: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  // Stats
  stats: `<svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
};

const ROUTES = {
  '#/': { render: renderAssignments, label: 'Tasks', icon: ICONS.tasks, showNav: true },
  '#/calendar': { render: renderCalendar, label: 'Calendar', icon: ICONS.calendar, showNav: true },
  '#/timer': { render: renderTimer, label: 'Focus', icon: ICONS.timer, showNav: true },
  '#/progress': { render: renderProgress, label: 'Stats', icon: ICONS.stats, showNav: true },
  '#/focus': { render: renderFocusMode, label: 'Focus Mode', icon: '', showNav: false }
};

let currentCleanup = null;
let deferredPrompt = null;

export function initApp() {
  const app = document.getElementById('app');

  // ─── PWA Install Banner ───
  const installBanner = document.createElement('div');
  installBanner.id = 'pwa-install-banner';
  installBanner.className = 'pwa-install-banner hidden';
  installBanner.innerHTML = `
    <div class="pwa-install-inner">
      <img src="/icon-192.png" alt="Velo" class="pwa-install-icon" />
      <div class="pwa-install-text">
        <strong>Install Velo</strong>
        <span>Use it like a native app</span>
      </div>
      <button class="btn btn-primary pwa-install-btn" id="btn-pwa-install">Install</button>
      <button class="pwa-install-dismiss" id="btn-pwa-dismiss" aria-label="Dismiss">&times;</button>
    </div>
  `;
  app.appendChild(installBanner);

  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.remove('hidden');
  });

  // Hide if already installed (standalone)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installBanner.classList.add('hidden');
  }

  installBanner.querySelector('#btn-pwa-install').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBanner.classList.add('hidden');
  });

  installBanner.querySelector('#btn-pwa-dismiss').addEventListener('click', () => {
    installBanner.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    installBanner.classList.add('hidden');
    deferredPrompt = null;
  });

  // ─── App Shell ───
  const content = document.createElement('main');
  content.id = 'view-content';
  content.className = 'view-container';
  app.appendChild(content);

  const nav = createNav();
  app.appendChild(nav);

  // ─── Floating Feedback Button ───
  const floatingFeedback = document.createElement('a');
  floatingFeedback.href = 'https://forms.gle/GbQysnTp6RpJMZqK9';
  floatingFeedback.target = '_blank';
  floatingFeedback.className = 'floating-feedback-btn';
  floatingFeedback.innerHTML = 'Feedback';
  app.appendChild(floatingFeedback);

  window.addEventListener('hashchange', () => handleRoute());

  if (!window.location.hash || !ROUTES[window.location.hash]) {
    window.location.hash = '#/';
  } else {
    handleRoute();
  }
}

export function navigate(hash) {
  window.location.hash = hash;
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const route = ROUTES[hash];
  if (!route) {
    window.location.hash = '#/';
    return;
  }

  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const content = document.getElementById('view-content');
  content.innerHTML = '';
  
  // Soft fade transition
  content.style.opacity = '0';
  content.style.transform = 'scale(0.98)';
  setTimeout(() => {
    content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    content.style.opacity = '1';
    content.style.transform = 'scale(1)';
  }, 10);

  currentCleanup = route.render(content);

  // Toggle bottom nav visibility based on route config
  const navWrap = document.querySelector('.bottom-nav');
  if (navWrap) {
    navWrap.style.display = route.showNav ? 'flex' : 'none';
  }

  updateNavActive(hash);
}

function createNav() {
  const navWrap = document.createElement('nav');
  navWrap.className = 'bottom-nav';
  
  const navInner = document.createElement('div');
  navInner.className = 'nav-inner';
  navWrap.appendChild(navInner);

  for (const [hash, route] of Object.entries(ROUTES)) {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.route = hash;
    btn.setAttribute('aria-label', route.label);
    btn.innerHTML = route.icon;
    btn.addEventListener('click', () => navigate(hash));
    navInner.appendChild(btn);
  }

  return navWrap;
}

function updateNavActive(activeHash) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    const isActive = btn.dataset.route === activeHash;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}
