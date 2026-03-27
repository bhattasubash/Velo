export const FOCUS_DURATION = 25 * 60;
export const BREAK_DURATION = 5 * 60;

export const timerState = {
  isRunning: false,
  isPaused: false,
  mode: 'focus', // 'focus' or 'break'
  assignmentId: null,
  totalSeconds: FOCUS_DURATION,
  remainingSeconds: FOCUS_DURATION,
  elapsedFocusSeconds: 0,
  intervalId: null
};
