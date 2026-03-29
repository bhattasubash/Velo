/* ============================================
   Velo — Focus Timer (Animated Variant UI)
   ============================================ */

import { getAssignments, addSession, getAssignment, formatDuration } from '../data/store.js';
import { timerState, FOCUS_DURATION, BREAK_DURATION } from '../data/timerStore.js';
import { navigate } from '../app.js';
import { trackEvent } from '../analytics.js';

const SVGS = {
  play: `<svg class="icon icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>`,
  pause: `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  stop: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>`
};

export function renderTimer(container) {
  const preSelected = sessionStorage.getItem('studysync_focus_assignment');
  if (preSelected && !timerState.isRunning) {
    timerState.assignmentId = preSelected;
    sessionStorage.removeItem('studysync_focus_assignment');
  }

  const assignments = getAssignments().filter(a => a.status === 'pending');
  let currentTaskName = "Unlinked Session";
  if (timerState.assignmentId) {
    const a = getAssignment(timerState.assignmentId);
    if (a) currentTaskName = a.title;
  }

  container.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">Focus</h1>
    </header>
    <div class="page-content" style="padding-top: 16px;">
      
      <!-- Hero Animated Section -->
      <div class="timer-hero-section">
        <div class="animated-graphic-container ${timerState.isRunning && !timerState.isPaused ? '' : 'breathing-paused'}">
          <div class="petal"></div>
          <div class="petal"></div>
          <div class="petal"></div>
          <div class="petal"></div>
          <div class="petal"></div>
          <div class="petal"></div>
          
          <button class="black-center-btn" id="btn-timer-main" aria-label="Toggle Timer">
            ${timerState.isRunning && !timerState.isPaused ? SVGS.pause : SVGS.play}
          </button>
        </div>

        <div class="timer-huge-display font-mono" id="timer-display">
          ${formatTime(timerState.remainingSeconds)}
        </div>
        <h2 class="timer-current-task">${currentTaskName}</h2>
        <p class="timer-status-desc">
          ${timerState.isRunning 
            ? (timerState.isPaused ? 'Session paused. Tap to resume.' : `Focus session active. Block lasts ${FOCUS_DURATION/60}m.`) 
            : 'Ready to focus. Tap the play button to start.'}
        </p>

        ${timerState.isRunning ? `
          <button class="btn btn-ghost mt-4" id="btn-timer-stop" style="color:var(--color-danger); font-size: 14px;">
            End Session Early
          </button>
        ` : ''}
      </div>

      <!-- Task Linking -->
      ${!timerState.isRunning ? `
        <div class="timer-setup-section">
          <h3 class="timer-setup-header">Up Next</h3>
          <div class="timer-link-card">
            <label>LINK TASK</label>
            <select id="timer-assignment-select">
              <option value="">— Select a task to focus on —</option>
              ${assignments.map(a => `
                <option value="${a.id}" ${a.id === timerState.assignmentId ? 'selected' : ''}>${a.title}</option>
              `).join('')}
            </select>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // Attach Listeners
  const selectEl = container.querySelector('#timer-assignment-select');
  if (selectEl) {
    selectEl.addEventListener('change', () => {
      timerState.assignmentId = selectEl.value || null;
      // Re-render softly to update title
      renderTimer(container);
    });
  }

  container.querySelector('#btn-timer-main').addEventListener('click', () => {
    if (!timerState.isRunning) {
      trackEvent('start_focus_clicked', { source: 'timer_preview', task_name: currentTaskName });
      // Instead of starting in place, navigate to the immersive focus mode
      navigate('#/focus');
    } else if (timerState.isPaused) {
      resumeTimer(container);
    } else {
      pauseTimer(container);
    }
  });

  const stopBtn = container.querySelector('#btn-timer-stop');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => stopTimer(container));
  }

  // Ensure timer ticks if active
  if (timerState.isRunning && !timerState.isPaused) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = setInterval(() => tick(container), 1000);
  }

  return () => {
    if (timerState.intervalId && !timerState.isRunning) {
      clearInterval(timerState.intervalId);
    }
  };
}

function startTimer(container) {
  timerState.isRunning = true;
  timerState.isPaused = false;
  timerState.mode = 'focus';
  timerState.totalSeconds = FOCUS_DURATION;
  timerState.remainingSeconds = FOCUS_DURATION;
  timerState.elapsedFocusSeconds = 0;

  timerState.intervalId = setInterval(() => tick(container), 1000);
  renderTimer(container);
}

function pauseTimer(container) {
  timerState.isPaused = true;
  clearInterval(timerState.intervalId);
  renderTimer(container);
}

function resumeTimer(container) {
  timerState.isPaused = false;
  timerState.intervalId = setInterval(() => tick(container), 1000);
  renderTimer(container);
}

function stopTimer(container) {
  clearInterval(timerState.intervalId);

  const time_spent_mins = timerState.elapsedFocusSeconds / 60;
  const percent_completed = (timerState.elapsedFocusSeconds / timerState.totalSeconds) * 100;

  if (timerState.mode === 'focus' && timerState.elapsedFocusSeconds > 0) {
    trackEvent('session_abandoned', { 
      time_spent: Math.round(time_spent_mins * 10) / 10, 
      percent_completed: Math.round(percent_completed) 
    });
  }

  if (timerState.elapsedFocusSeconds > 0 && timerState.assignmentId) {
    try { addSession(timerState.assignmentId, timerState.elapsedFocusSeconds); } catch (e) {}
  }

  timerState.isRunning = false;
  timerState.isPaused = false;
  timerState.mode = 'focus';
  timerState.totalSeconds = FOCUS_DURATION;
  timerState.remainingSeconds = FOCUS_DURATION;
  timerState.elapsedFocusSeconds = 0;
  timerState.intervalId = null;

  renderTimer(container);
}

function tick(container) {
  if (timerState.remainingSeconds <= 0) {
    clearInterval(timerState.intervalId);

    if (timerState.mode === 'focus') {
      if (timerState.assignmentId) {
        try { addSession(timerState.assignmentId, FOCUS_DURATION); } catch(e) {}
      }
      playNotification();
      timerState.mode = 'break';
      timerState.totalSeconds = BREAK_DURATION;
      timerState.remainingSeconds = BREAK_DURATION;
      timerState.elapsedFocusSeconds = 0;
      timerState.intervalId = setInterval(() => tick(container), 1000);
      if (container.isConnected) renderTimer(container);
      return;
    } else {
      playNotification();
      timerState.mode = 'focus';
      timerState.totalSeconds = FOCUS_DURATION;
      timerState.remainingSeconds = FOCUS_DURATION;
      timerState.elapsedFocusSeconds = 0;
      timerState.intervalId = setInterval(() => tick(container), 1000);
      if (container.isConnected) renderTimer(container);
      return;
    }
  }

  timerState.remainingSeconds--;
  if (timerState.mode === 'focus') timerState.elapsedFocusSeconds++;

  const displayEl = document.getElementById('timer-display');
  if (displayEl) displayEl.textContent = formatTime(timerState.remainingSeconds);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playNotification() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}
