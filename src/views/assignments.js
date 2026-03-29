/* ============================================
   Velo — Assignments View
   Variant Modern Tracking Style
   ============================================ */

import { getAssignments, addAssignment, toggleAssignment, deleteAssignment,
  getUrgency, formatDeadline, formatDuration
} from '../data/store.js';
import { navigate } from '../app.js';

let hasShownAutoStart = false;

const SVGS = {
  check: `<svg class="icon" viewBox="0 0 24 24" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
  plus: `<svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  play: `<svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  emptyList: `<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
};

export function renderAssignments(container) {
  const allAssignments = getAssignments();
  const todayDueCount = allAssignments.filter(a => {
    if (a.status !== 'pending') return false;
    const dl = new Date(a.deadline);
    const today = new Date();
    return dl.getDate() === today.getDate() && 
           dl.getMonth() === today.getMonth() && 
           dl.getFullYear() === today.getFullYear();
  }).length;

  container.innerHTML = `
    <header class="page-header" style="flex-direction: column; align-items: stretch; gap: 16px; padding-bottom: 8px;">
      <div class="assignments-header-top" style="align-items: center;">
        <h1 class="page-title">Tracker</h1>
        <button class="btn btn-primary btn-sm" id="btn-start-focus-main" style="border-radius: var(--radius-pill);">
          Start Focus
        </button>
      </div>

      <div class="quick-add-container">
        <input type="text" class="quick-add-input" id="quick-add-input" placeholder="+ Add assignment..." autocomplete="off" />
      </div>

      <div class="today-section" style="flex-wrap: wrap;">
        <h2 class="today-title">Today</h2>
        <span class="today-count">${todayDueCount > 0 ? `${todayDueCount} tasks due today` : 'No tasks due'}</span>
        <div class="time-suggestion anim-fade-up" style="flex-basis: 100%; margin-top: 8px; font-size: 13px; color: var(--color-primary-dark); font-weight: 600;">
          ${getTimeSuggestion()}
        </div>
      </div>
    </header>
    
    <div class="page-content">
      <div class="assignments-filter">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="pending">Pending</button>
        <button class="filter-btn" data-filter="completed">Done</button>
      </div>
      <div id="assignment-list" class="assignment-list"></div>
    </div>
  `;

  let currentFilter = 'all';

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderList();
    });
  });

  const btnStartFocusMain = container.querySelector('#btn-start-focus-main');
  if (btnStartFocusMain) {
    btnStartFocusMain.addEventListener('click', () => navigate('#/timer'));
  }

  const quickAddInput = container.querySelector('#quick-add-input');
  if (quickAddInput) {
    quickAddInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && quickAddInput.value.trim()) {
        const title = quickAddInput.value.trim();
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 0, 0);
        
        try {
          addAssignment({
            title,
            subject: 'General',
            deadline: tomorrow.toISOString()
          });
          renderAssignments(container);
        } catch (err) {
          console.error('Failed to add assignment', err);
        }
      }
    });
  }

  function renderList() {
    const listEl = container.querySelector('#assignment-list');
    let assignments = getAssignments();

    if (currentFilter === 'pending') {
      assignments = assignments.filter(a => a.status === 'pending');
    } else if (currentFilter === 'completed') {
      assignments = assignments.filter(a => a.status === 'completed');
    }

    if (assignments.length === 0 && currentFilter === 'all') {
      listEl.innerHTML = `
        <div class="empty-state-new">
          <h2 class="empty-title">Start your study session</h2>
          <p class="empty-subtitle">No tasks yet.</p>
          <p class="empty-text">Add your first assignment and start focusing.</p>
          <div class="empty-actions">
            <button class="btn btn-secondary" id="btn-empty-add">Add Assignment</button>
            <button class="btn btn-primary" id="btn-empty-focus">Start Focus</button>
          </div>
        </div>
      `;
      
      const btnEmptyAdd = listEl.querySelector('#btn-empty-add');
      if (btnEmptyAdd) {
        btnEmptyAdd.addEventListener('click', () => showAddModal(container, () => renderAssignments(container)));
      }
      const btnEmptyFocus = listEl.querySelector('#btn-empty-focus');
      if (btnEmptyFocus) {
        btnEmptyFocus.addEventListener('click', () => navigate('#/timer'));
      }
      return;
    }

    if (assignments.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="padding: 80px 20px;">
          ${SVGS.emptyList}
          <p>${currentFilter === 'completed' ? 'NO COMPLETED TASKS' : 'ALL CAUGHT UP'}</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = assignments.map(a => {
      const urgency = getUrgency(a.deadline);
      const isCompleted = a.status === 'completed';
      return `
        <div class="card assignment-card ${isCompleted ? 'completed' : ''}" data-id="${a.id}">
          <div class="assignment-top">
            <button class="check-btn ${isCompleted ? 'checked' : ''}" data-action="toggle" data-id="${a.id}" aria-label="Toggle completion">
              ${isCompleted ? SVGS.check : ''}
            </button>
            <div class="assignment-info">
              <h3 class="assignment-title ${isCompleted ? 'line-through' : ''}">${a.title}</h3>
              <div class="assignment-meta">
                <span class="assignment-meta-text">${a.subject}</span>
              </div>
            </div>
            
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
               <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--color-text-main);">${isCompleted ? formatDuration(a.totalFocusTime || 0) : formatDeadline(a.deadline)}</span>
               ${!isCompleted ? `<div class="cal-dot ${urgencyDotClass(urgency)}"></div>` : ''}
            </div>
          </div>

          ${!isCompleted ? `
            <div class="assignment-bottom">
              <span class="focus-time font-mono">
                ${formatDuration(a.totalFocusTime || 0)}
              </span>
              <div class="assignment-actions">
                <button class="btn btn-icon-minimal" style="color:var(--color-primary-dark);" data-action="focus" data-id="${a.id}">
                  ${SVGS.play}
                </button>
                <button class="btn btn-icon-minimal" data-action="delete" data-id="${a.id}" aria-label="Delete">
                  ${SVGS.trash}
                </button>
              </div>
            </div>
          ` : `
            <div class="assignment-bottom" style="border-top: none; padding-top: 0; justify-content: flex-end;">
                <button class="btn btn-icon-minimal" data-action="delete" data-id="${a.id}" aria-label="Delete">
                  ${SVGS.trash}
                </button>
            </div>
          `}
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'toggle') {
          toggleAssignment(id);
          renderAssignments(container);
        } else if (action === 'delete') {
          if (confirm('Delete this task?')) {
            deleteAssignment(id);
            renderAssignments(container);
          }
        } else if (action === 'focus') {
          sessionStorage.setItem('studysync_focus_assignment', id);
          navigate('#/timer');
        }
      });
    });
  }

  renderList();

  // ─── Auto Start Flow Logic ───
  let cleanupAutoStart = () => {};
  
  // We use a module-level variable 'hasShownAutoStart' to ensure we only show it once per web-app load
  if (!hasShownAutoStart) {
    let activityTimer = null;

    const showAutoStartPopup = () => {
      // Don't show if the user already navigated away
      if (!document.body.contains(container)) return;
      
      hasShownAutoStart = true;
      cleanupListeners();
      
      const popup = document.createElement('div');
      popup.className = 'auto-start-popup';
      popup.innerHTML = `
        <div class="auto-start-inner">
          <p>Start a 25 min session?</p>
          <div class="auto-start-actions">
            <button class="btn btn-secondary btn-sm" id="btn-autostart-no">Not now</button>
            <button class="btn btn-primary btn-sm" id="btn-autostart-yes">Start</button>
          </div>
        </div>
      `;
      document.body.appendChild(popup);
      
      // Delay to allow DOM attachment before fade-in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => popup.classList.add('visible'));
      });
      
      popup.querySelector('#btn-autostart-no').addEventListener('click', () => {
        popup.classList.remove('visible');
        setTimeout(() => popup.remove(), 400);
      });
      
      popup.querySelector('#btn-autostart-yes').addEventListener('click', () => {
        popup.classList.remove('visible');
        setTimeout(() => {
          popup.remove();
          navigate('#/focus'); // Jumps straight into active session
        }, 300);
      });
    };

    const resetActivityTimer = () => {
      if (activityTimer) clearTimeout(activityTimer);
      activityTimer = setTimeout(showAutoStartPopup, 5000);
    };

    const cleanupListeners = () => {
      if (activityTimer) clearTimeout(activityTimer);
      window.removeEventListener('mousemove', resetActivityTimer);
      window.removeEventListener('keydown', resetActivityTimer);
      window.removeEventListener('touchstart', resetActivityTimer);
    };

    window.addEventListener('mousemove', resetActivityTimer, { passive: true });
    window.addEventListener('keydown', resetActivityTimer, { passive: true });
    window.addEventListener('touchstart', resetActivityTimer, { passive: true });
    
    resetActivityTimer();
    cleanupAutoStart = cleanupListeners;
  }

  return () => {
    cleanupAutoStart();
  };
}

function urgencyDotClass(urgency) {
  switch (urgency) {
    case 'overdue': return 'dot-urgent';
    case 'urgent': return 'dot-urgent';
    case 'soon': return 'dot-warning';
    default: return 'dot-normal';
  }
}

function showAddModal(container, onAdd) {
  if (document.querySelector('.modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <h2 style="margin-bottom: 24px;">New Task</h2>
      <form id="add-assignment-form" class="flex flex-col gap-4" novalidate>
        <div class="input-group">
          <label for="input-title">Task Name</label>
          <input type="text" class="input" id="input-title" placeholder="What are you working on?" maxlength="100" autocomplete="off" required />
        </div>
        <div class="input-group">
          <label for="input-subject">Course</label>
          <input type="text" class="input" id="input-subject" placeholder="Class or category" maxlength="50" autocomplete="off" required />
        </div>
        <div class="input-group">
          <label for="input-deadline">Deadline</label>
          <input type="datetime-local" class="input" id="input-deadline" required />
        </div>
        <div id="form-error" class="form-error" style="display:none; margin-top: 8px;"></div>
        <div class="flex gap-2" style="margin-top: 16px;">
          <button type="button" class="btn btn-secondary btn-block btn-lg" id="btn-cancel-add">Cancel</button>
          <button type="submit" class="btn btn-primary btn-block btn-lg">Save</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 0, 0);
  const deadlineInput = overlay.querySelector('#input-deadline');
  deadlineInput.value = formatDateForInput(tomorrow);

  setTimeout(() => overlay.querySelector('#input-title').focus(), 150);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.querySelector('#btn-cancel-add').addEventListener('click', closeModal);

  overlay.querySelector('#add-assignment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = overlay.querySelector('#form-error');

    try {
      addAssignment({
        title: overlay.querySelector('#input-title').value,
        subject: overlay.querySelector('#input-subject').value,
        deadline: overlay.querySelector('#input-deadline').value
      });
      closeModal();
      onAdd();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  });

  function closeModal() {
    overlay.style.animation = 'none';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 250);
  }
}

function formatDateForInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

function getTimeSuggestion() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good time to start your first session';
  if (hour < 17) return 'You have some time now — start a quick session';
  if (hour < 22) return 'One last session before you wrap up?';
  return 'You have 20 min? Start a quick session';
}
