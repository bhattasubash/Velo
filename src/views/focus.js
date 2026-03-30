/* ============================================
   Velo — Focus Mode View (Risograph Style)
   ============================================ */

import { getAssignments, addSession, getAssignment, formatDuration, getCurrentStreak } from '../data/store.js';
import { navigate } from '../app.js';
import { timerState, FOCUS_DURATION, BREAK_DURATION } from '../data/timerStore.js';
import { trackEvent } from '../analytics.js';
import { ARTICLES } from '../data/articlesList.js';

let currentKeydownHandler = null;

const originalTitle = document.title;

const SVGS = {
  pause: `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  play: `<svg class="icon icon-play" viewBox="0 0 24 24" style="margin-left:2px;"><path d="M8 5v14l11-7z" /></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
};

export function renderFocusMode(container) {
  // Add risograph full-screen class to body to override app constraints
  document.body.classList.add('focus-mode-active');
  const appEl = document.getElementById('app');
  if (appEl) appEl.classList.add('focus-mode-active');

  // Recover any preselected assignment from timer handoff
  const preSelected = sessionStorage.getItem('studysync_focus_assignment');
  if (preSelected && !timerState.isRunning) {
    timerState.assignmentId = preSelected;
    sessionStorage.removeItem('studysync_focus_assignment');
  }

  let currentTaskName = "Unlinked Session";
  if (timerState.assignmentId) {
    const a = getAssignment(timerState.assignmentId);
    if (a) currentTaskName = a.title;
  }

  // Ensure timer is auto-started when entering this mode if not already running
  if (!timerState.isRunning) {
    startTimer(container);
  }

  const isFocus = timerState.mode === 'focus';
  const modeLabel = isFocus ? 'Focus Block' : 'Short Break';
  const motivateText = isFocus ? 'Stay immersed. You got this.' : 'Breathe. Stretch. Relax.';

  container.innerHTML = `
    <div class="focus-fullscreen-container">
      
      <!-- Top Bar -->
      <div class="focus-top-bar">
        <div class="focus-brand">Velo</div>
        <button class="focus-btn-exit" id="btn-focus-exit">
          <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          Exit
        </button>
      </div>

      <!-- Center Huge Timer -->
      <div class="focus-center-content">
        <div class="focus-mode-label">${modeLabel}</div>
        <div class="focus-huge-timer font-mono" id="focus-display">
          ${formatTime(timerState.remainingSeconds)}
        </div>
        <div class="focus-task-name">${currentTaskName}</div>
        <div class="focus-motivate-text">${motivateText}</div>
      </div>

      <!-- Bottom Controls -->
      <div class="focus-bottom-controls">
        <button class="focus-btn focus-btn-secondary" id="btn-focus-toggle">
          ${timerState.isPaused ? SVGS.play : SVGS.pause}
          <span>${timerState.isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        <button class="focus-btn focus-btn-primary" id="btn-focus-complete">
          ${SVGS.check}
          <span>Complete Session</span>
        </button>
      </div>

      <!-- Noise Overlay -->
      <div class="focus-noise-overlay"></div>
    </div>
  `;

  // --- Event Listeners ---
  container.querySelector('#btn-focus-exit').addEventListener('click', () => handleExit(container));
  container.querySelector('#btn-focus-toggle').addEventListener('click', () => toggleTimer(container));
  
  const completeBtn = container.querySelector('#btn-focus-complete');
  completeBtn.addEventListener('click', () => {
    // End session, log time, and drop back to assignments
    finishSessionAndExit(container);
  });

  // --- Keyboard Shortcuts ---
  if (currentKeydownHandler) {
    window.removeEventListener('keydown', currentKeydownHandler);
  }
  
  currentKeydownHandler = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      toggleTimer(container);
    } else if (e.code === 'Escape') {
      e.preventDefault();
      handleExit(container);
    }
  };
  window.addEventListener('keydown', currentKeydownHandler);

  // --- Tick Engine Sync ---
  if (timerState.isRunning && !timerState.isPaused) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = setInterval(() => tick(container), 1000);
  }

  // --- Cleanup on unmount ---
  return () => {
    if (currentKeydownHandler) {
      window.removeEventListener('keydown', currentKeydownHandler);
      currentKeydownHandler = null;
    }
    document.body.classList.remove('focus-mode-active');
    if (appEl) appEl.classList.remove('focus-mode-active');
    document.title = originalTitle;
    
    // Let the timer run in the background if it's active
    if (timerState.intervalId && !timerState.isRunning) {
      clearInterval(timerState.intervalId);
    }
  };
}

// ─── Timer Logic ───

function startTimer(container) {
  if (timerState.isRunning && timerState.intervalId) return; // Already running

  timerState.isRunning = true;
  timerState.isPaused = false;
  timerState.mode = 'focus';
  timerState.totalSeconds = FOCUS_DURATION;
  timerState.remainingSeconds = FOCUS_DURATION;
  timerState.elapsedFocusSeconds = 0;

  timerState.intervalId = setInterval(() => tick(container), 1000);
  updateTitle();
  trackEvent('session_started', { duration: FOCUS_DURATION / 60, trigger: 'focus_mode_init' });
}

function toggleTimer(container) {
  if (timerState.isPaused) {
    timerState.isPaused = false;
    timerState.intervalId = setInterval(() => tick(container), 1000);
  } else {
    timerState.isPaused = true;
    clearInterval(timerState.intervalId);
  }
  renderFocusMode(container); // re-render for button states
}

function finishSessionAndExit(container) {
  clearInterval(timerState.intervalId);
  const secondsFocused = timerState.elapsedFocusSeconds;
  
  if (secondsFocused > 0 && timerState.assignmentId) {
    try { addSession(timerState.assignmentId, secondsFocused); } catch (e) {}
  }
  
  // Format seconds to text exactly as requested: "You focused for [X] seconds"
  // For larger values, we'll format it nicely:
  let timeString = `${secondsFocused} seconds`;
  if (secondsFocused >= 60) {
    const mins = Math.floor(secondsFocused / 60);
    const secs = secondsFocused % 60;
    timeString = `${mins} minute${mins !== 1 ? 's' : ''}${secs > 0 ? ` and ${secs} second${secs !== 1 ? 's' : ''}` : ''}`;
  }

  const streak = getCurrentStreak();
  const suggestion = [...ARTICLES].sort(() => 0.5 - Math.random())[0];

  // Render minimal session complete screen
  container.innerHTML = `
    <div class="focus-fullscreen-container" style="justify-content: center; align-items: center; background: var(--color-bg); padding: 24px;">
      <div style="text-align: center; max-width: 400px;">
        <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 12px; font-family: var(--font-sans); display: flex; align-items: center; justify-content: center; gap: 8px;">
           <span class="anim-pop-check" style="color: var(--color-success);">${SVGS.check}</span>
           Session Complete
        </h2>
        <div style="font-size: 18px; color: var(--color-text-secondary); margin-bottom: 16px; font-weight: 500;">
          You focused for ${timeString}
        </div>
        
        ${streak > 0 ? `<div class="anim-fade-up" style="font-size: 15px; font-weight: 700; color: #ff9500; margin-bottom: 24px; text-transform: uppercase;">🔥 ${streak} day streak</div>` : '<div style="margin-bottom: 24px;"></div>'}
        
        <a href="/learn/${suggestion.slug}/" style="display: flex; flex-direction: column; background: rgba(0,0,0,0.03); border-radius: 8px; padding: 12px 16px; margin-bottom: 40px; text-decoration: none; text-align: left; transition: transform 0.2s;">
          <div style="font-size: 11px; font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase; margin-bottom: 4px;">Improve more</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--color-text-main);">${suggestion.title} <span style="color: var(--color-text-secondary);">→</span></div>
        </a>

        <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
          <button class="btn btn-primary btn-lg" id="btn-session-done" style="width: 100%;">Done</button>
          <a href="https://forms.gle/GbQysnTp6RpJMZqK9" id="btn-feedback" target="_blank" class="btn btn-secondary btn-lg" style="width: 100%; text-decoration: none;">Give Feedback</a>
        </div>
      </div>
    </div>
  `;

  if (streak > 0) {
    trackEvent('streak_viewed', { streak_days: streak });
  }

  const doneBtn = container.querySelector('#btn-session-done');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      const taskObj = timerState.assignmentId ? getAssignment(timerState.assignmentId) : null;
      trackEvent('session_completed', { 
        duration_completed: secondsFocused / 60, 
        task_name: taskObj ? taskObj.title : 'Unlinked Session',
        type: 'manual_exit'
      });
      resetTimerState();
      navigate('#/'); // go home
    });
  }

  const feedbackBtn = container.querySelector('#btn-feedback');
  if (feedbackBtn) {
    feedbackBtn.addEventListener('click', () => {
      trackEvent('feedback_clicked', { location: 'end_screen' });
    });
  }
}

function handleExit(container) {
  // Just leave it running in background and return to standard views
  // The standard Timer view will pick up the running state
  navigate('#/timer');
}

function resetTimerState() {
  timerState.isRunning = false;
  timerState.isPaused = false;
  timerState.mode = 'focus';
  timerState.totalSeconds = FOCUS_DURATION;
  timerState.remainingSeconds = FOCUS_DURATION;
  timerState.elapsedFocusSeconds = 0;
  if (timerState.intervalId) clearInterval(timerState.intervalId);
  timerState.intervalId = null;
  document.title = originalTitle;
}

function tick(container) {
  if (timerState.remainingSeconds <= 0) {
    clearInterval(timerState.intervalId);

    if (timerState.mode === 'focus') {
      if (timerState.assignmentId) {
        try { addSession(timerState.assignmentId, FOCUS_DURATION); } catch(e) {}
      }
      playNotification();
      const taskObj = timerState.assignmentId ? getAssignment(timerState.assignmentId) : null;
      trackEvent('session_completed', { 
        duration_completed: FOCUS_DURATION / 60, 
        task_name: taskObj ? taskObj.title : 'Unlinked Session',
        type: 'auto_completed'
      });
      timerState.mode = 'break';
      timerState.totalSeconds = BREAK_DURATION;
      timerState.remainingSeconds = BREAK_DURATION;
      timerState.elapsedFocusSeconds = 0;
      timerState.intervalId = setInterval(() => tick(container), 1000);
      if (container.isConnected) renderFocusMode(container);
      return;
    } else {
      playNotification();
      timerState.mode = 'focus';
      timerState.totalSeconds = FOCUS_DURATION;
      timerState.remainingSeconds = FOCUS_DURATION;
      timerState.elapsedFocusSeconds = 0;
      timerState.intervalId = setInterval(() => tick(container), 1000);
      if (container.isConnected) renderFocusMode(container);
      return;
    }
  }

  timerState.remainingSeconds--;
  if (timerState.mode === 'focus') timerState.elapsedFocusSeconds++;

  updateTitle();

  const displayEl = document.getElementById('focus-display');
  if (displayEl) displayEl.textContent = formatTime(timerState.remainingSeconds);
}

function updateTitle() {
  const timeStr = formatTime(timerState.remainingSeconds);
  const taskStr = timerState.assignmentId ? getAssignment(timerState.assignmentId)?.title || 'Focus' : 'Focus';
  document.title = `${timeStr} - ${taskStr}`;
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
