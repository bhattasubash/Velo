/* ============================================
   Velo — Learn View
   ============================================ */

import { ARTICLES } from '../data/articlesList.js';
import { trackEvent } from '../analytics.js';

export function renderLearn(container) {
  // Sort articles into clusters
  const clusters = {};
  ARTICLES.forEach(a => {
    if (!clusters[a.cluster]) clusters[a.cluster] = [];
    clusters[a.cluster].push(a);
  });

  // Basic HTML structure
  container.innerHTML = `
    <header class="page-header" style="flex-direction: column; align-items: stretch; gap: 16px; padding-bottom: 8px;">
      <div class="assignments-header-top" style="align-items: center;">
        <h1 class="page-title">Learn</h1>
      </div>
      <p style="color: var(--color-text-secondary); font-size: 15px; font-weight: 500; margin-top: -8px;">
        Evidence-based techniques to improve focus and build lasting study habits.
      </p>
    </header>
    
    <div class="page-content" style="padding-top: 16px;">
      <div id="learn-clusters" style="display: flex; flex-direction: column; gap: 40px; padding-bottom: 40px;">
      </div>
    </div>
  `;

  const clustersContainer = container.querySelector('#learn-clusters');

  // Define display order
  const order = ['The Starting Problem', 'Focus & Distractions', 'Habit & Consistency'];
  
  order.forEach(clusterName => {
    const list = clusters[clusterName];
    if (!list || list.length === 0) return;

    const section = document.createElement('section');
    
    let emoji = '📖';
    if(clusterName === 'The Starting Problem') emoji = '🚀';
    if(clusterName === 'Focus & Distractions') emoji = '⏱';
    if(clusterName === 'Habit & Consistency') emoji = '🧠';

    section.innerHTML = `
      <h2 style="font-size: 20px; font-weight: 800; color: var(--color-text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
        ${emoji} ${clusterName}
      </h2>
      <div class="learn-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${list.map(a => `
          <a href="/learn/${a.slug}/" class="card learn-card" data-slug="${a.slug}" style="text-decoration: none; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s, box-shadow 0.2s; position: relative;">
            <div style="width: 100%; height: 140px; border-radius: 8px; overflow: hidden; background: #eee;">
              <img src="${a.heroImage}" alt="${a.title}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-primary-dark); margin-bottom: 6px;">
                ${a.readTime} MIN READ
              </div>
              <h3 style="font-size: 16px; font-weight: 700; color: var(--color-text-main); line-height: 1.3; margin-bottom: 6px;">
                ${a.title}
              </h3>
              <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                ${a.desc}
              </p>
            </div>
          </a>
        `).join('')}
      </div>
    `;
    clustersContainer.appendChild(section);
  });

  // Track clicks natively
  container.querySelectorAll('.learn-card').forEach(card => {
    card.addEventListener('click', (e) => {
      trackEvent('article_clicked', { slug: card.dataset.slug, source: 'learn_hub' });
    });
  });

  return () => {
    // cleanup if needed
  };
}
