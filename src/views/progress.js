/* ============================================
   Velo — Progress Tracking View
   Variant Modern Style
   ============================================ */

import {
  getAssignments, getDailyFocusTimes, getTodayFocusTime,
  formatDuration, getSessions
} from '../data/store.js';

export function renderProgress(container) {
  const assignments = getAssignments();
  const dailyTimes = getDailyFocusTimes(7);
  const todayFocus = getTodayFocusTime();

  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const totalFocusAllTime = assignments.reduce((sum, a) => sum + (a.totalFocusTime || 0), 0);

  const maxDaily = Math.max(...dailyTimes.map(d => d.totalSeconds), 1);

  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">Stats</h1>
    </header>
    <div class="page-content" style="padding-top: 16px;">

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value font-mono">${formatDuration(todayFocus)}</div>
          <div class="stat-label">TODAY'S FOCUS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value font-mono">${completedCount}</div>
          <div class="stat-label">COMPLETED TASKS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value font-mono">${pendingCount}</div>
          <div class="stat-label">PENDING TASKS</div>
        </div>
        <div class="stat-card">
          <div class="stat-value font-mono">${formatDuration(totalFocusAllTime)}</div>
          <div class="stat-label">ALL-TIME FOCUS</div>
        </div>
      </div>

      <!-- Daily Focus Chart -->
      <div>
        <div class="progress-section-header">Weekly Focus</div>
        <div class="daily-chart">
          ${dailyTimes.map(d => {
            const heightPercent = maxDaily > 0 ? Math.max((d.totalSeconds / maxDaily) * 100, 4) : 4;
            const isEmpty = d.totalSeconds === 0;
            return `
              <div class="chart-bar-wrap">
                <div class="chart-bar-value" style="opacity: ${isEmpty ? 0.3 : 1}">${isEmpty ? '—' : formatDuration(d.totalSeconds)}</div>
                <div class="chart-bar-track">
                  <div class="chart-bar ${isEmpty ? 'empty' : ''}" style="height: ${heightPercent}%"></div>
                </div>
                <div class="chart-bar-label">${d.dayName}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Per-Assignment Time -->
      <div style="margin-bottom: 24px;">
        <div class="progress-section-header">Time Per Task</div>
        ${assignments.length === 0 ? `
          <div class="empty-state card" style="text-align:center;">
            <p>No Data Available</p>
          </div>
        ` : `
          <div class="assignment-progress-list">
            ${assignments
              .filter(a => (a.totalFocusTime || 0) > 0)
              .sort((a, b) => (b.totalFocusTime || 0) - (a.totalFocusTime || 0))
              .map(a => {
                const maxFocus = Math.max(...assignments.map(x => x.totalFocusTime || 0), 1);
                const widthPercent = Math.max(((a.totalFocusTime || 0) / maxFocus) * 100, 2);
                return `
                  <div class="progress-row">
                    <div class="progress-row-header">
                      <span class="progress-title">${a.title}</span>
                      <span class="progress-time">${formatDuration(a.totalFocusTime || 0)}</span>
                    </div>
                    <div class="progress-bar-track">
                      <div class="progress-bar ${a.status === 'completed' ? 'completed' : ''}" style="width: ${widthPercent}%"></div>
                    </div>
                  </div>
                `;
              }).join('') || '<div class="empty-state" style="padding: 24px;">NO SESSIONS LOGGED</div>'}
          </div>
        `}
      </div>

      <!-- More Section -->
      <div class="more-section" style="margin-bottom: 32px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05);">
        <h3 style="font-size: 14px; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase;">More</h3>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
          <li><a href="https://forms.gle/GbQysnTp6RpJMZqK9" target="_blank" style="display: block; padding: 12px 16px; background: var(--color-card-bg); border-radius: var(--radius-sm); color: var(--color-text-main); text-decoration: none; box-shadow: var(--shadow-sm);">Give Feedback</a></li>
          <li><a href="/privacy.html" style="display: block; padding: 12px 16px; background: var(--color-card-bg); border-radius: var(--radius-sm); color: var(--color-text-main); text-decoration: none; box-shadow: var(--shadow-sm);">Privacy Policy</a></li>
          <li><a href="/terms.html" style="display: block; padding: 12px 16px; background: var(--color-card-bg); border-radius: var(--radius-sm); color: var(--color-text-main); text-decoration: none; box-shadow: var(--shadow-sm);">Terms of Service</a></li>
        </ul>
      </div>

    </div>
  `;

  return null;
}
