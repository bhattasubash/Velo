/* ============================================
   Velo — Calendar View
   Variant Modern Style
   ============================================ */

import { getAssignments, getUrgency } from '../data/store.js';

const SVGS = {
  left: `<svg class="icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`,
  right: `<svg class="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`
};

export function renderCalendar(container) {
  let currentDate = new Date();

  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">Calendar</h1>
    </header>
    <div class="page-content" style="padding-top: 16px;">
      <div class="calendar-nav">
        <button class="btn-icon-minimal" id="cal-prev" aria-label="Previous month">${SVGS.left}</button>
        <span class="calendar-month-title" id="cal-title" style="letter-spacing: -0.01em;"></span>
        <button class="btn-icon-minimal" id="cal-next" aria-label="Next month">${SVGS.right}</button>
      </div>
      <div class="calendar-grid" id="cal-grid"></div>
      <div class="calendar-detail" id="cal-detail"></div>
    </div>
  `;

  const titleEl = container.querySelector('#cal-title');
  const gridEl = container.querySelector('#cal-grid');
  const detailEl = container.querySelector('#cal-detail');

  container.querySelector('#cal-prev').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMonth();
  });

  container.querySelector('#cal-next').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMonth();
  });

  function renderMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const assignments = getAssignments();

    titleEl.textContent = currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = dayNames.map(d => `<div class="cal-day-header">${d}</div>`).join('');

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-day empty" style="cursor:default;"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

      const dayAssignments = assignments.filter(a => {
        const dl = new Date(a.deadline);
        return dl.getFullYear() === year && dl.getMonth() === month && dl.getDate() === day;
      });

      let dotHtml = '';
      if (dayAssignments.length > 0) {
        dotHtml = '<div class="cal-dot-container">';
        const displayAssignments = dayAssignments.slice(0, 3);
        displayAssignments.forEach(a => {
          let dotClass = 'dot-normal';
          if (a.status === 'completed') {
            dotClass = 'dot-completed';
          } else {
            const urgency = getUrgency(a.deadline);
            if (urgency === 'overdue' || urgency === 'urgent') dotClass = 'dot-urgent';
            else if (urgency === 'soon') dotClass = 'dot-warning';
          }
          dotHtml += `<div class="cal-dot ${dotClass}"></div>`;
        });
        if (dayAssignments.length > 3) {
          dotHtml += `<span style="font-size:8px;line-height:4px;font-weight:bold;color:var(--color-primary-dark);">+</span>`;
        }
        dotHtml += '</div>';
      }

      html += `
        <button class="cal-day ${isToday ? 'today' : ''} ${dayAssignments.length > 0 ? 'has-assignments' : ''}"
                data-date="${dateStr}" data-day="${day}">
          <span class="cal-day-number">${day}</span>
          ${dotHtml}
        </button>
      `;
    }

    gridEl.innerHTML = html;

    gridEl.querySelectorAll('.cal-day[data-date]').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        gridEl.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
        dayEl.classList.add('selected');
        showDayDetail(dayEl.dataset.date, assignments);
      });
    });

    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (today.getFullYear() === year && today.getMonth() === month) {
      showDayDetail(todayStr, assignments);
      const todayEl = gridEl.querySelector(`.cal-day[data-date="${todayStr}"]`);
      if (todayEl) todayEl.classList.add('selected');
    } else {
      detailEl.innerHTML = '';
    }
  }

  function showDayDetail(dateStr, assignments) {
    const dayAssignments = assignments.filter(a => {
      const dl = new Date(a.deadline);
      const aDate = `${dl.getFullYear()}-${String(dl.getMonth() + 1).padStart(2, '0')}-${String(dl.getDate()).padStart(2, '0')}`;
      return aDate === dateStr;
    });

    const displayDate = new Date(dateStr + 'T00:00:00');
    let dateLabel = displayDate.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });

    if (dayAssignments.length === 0) {
      detailEl.innerHTML = `
        <div class="cal-detail-header">
          <h3 style="color:var(--color-text-main); font-weight: 800; letter-spacing: -0.01em;">${dateLabel}</h3>
        </div>
        <div class="empty-state" style="padding: 24px;">
          <p>No assignments pending</p>
        </div>
      `;
      return;
    }

    detailEl.innerHTML = `
      <div class="cal-detail-header" style="margin-bottom: 12px;">
        <h3 style="color:var(--color-text-main); font-weight: 800; letter-spacing: -0.01em;">${dateLabel}</h3>
      </div>
      <div class="cal-detail-list">
        ${dayAssignments.map(a => `
          <div class="cal-detail-item ${a.status === 'completed' ? 'completed' : ''}">
            <div class="cal-detail-dot" style="background: ${a.status === 'completed' ? 'var(--color-success)' : 'var(--color-text-main)'}"></div>
            <div style="flex: 1;">
              <div class="cal-detail-title">${a.title}</div>
              <div class="cal-detail-subject">${a.subject}</div>
            </div>
            <div style="font-size: 13px; font-weight: 600; color: var(--color-text-secondary); font-variant-numeric: tabular-nums;">
              ${new Date(a.deadline).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMonth();
  return null;
}
