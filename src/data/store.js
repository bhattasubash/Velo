/* ============================================
   Velo — Data Store (localStorage)
   Handles all CRUD + validation + sanitization
   ============================================ */

/**
 * Sanitize a string to prevent XSS attacks.
 * Escapes HTML special characters.
 */
export function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/**
 * Generate a simple unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ─── Storage Helpers ───

function getItem(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Assignment CRUD ───

const ASSIGNMENTS_KEY = 'studysync_assignments';
const SESSIONS_KEY = 'studysync_sessions';

/**
 * Get all assignments, sorted by deadline (earliest first)
 */
export function getAssignments() {
  return (getItem(ASSIGNMENTS_KEY) || []).sort(
    (a, b) => new Date(a.deadline) - new Date(b.deadline)
  );
}

/**
 * Get a single assignment by ID
 */
export function getAssignment(id) {
  const assignments = getItem(ASSIGNMENTS_KEY) || [];
  return assignments.find(a => a.id === id) || null;
}

/**
 * Validate assignment data before saving.
 * Returns { valid: boolean, errors: string[] }
 */
function validateAssignment(data) {
  const errors = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (data.title && data.title.trim().length > 100) {
    errors.push('Title must be 100 characters or fewer');
  }
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  }
  if (data.subject && data.subject.trim().length > 50) {
    errors.push('Subject must be 50 characters or fewer');
  }
  if (!data.deadline) {
    errors.push('Deadline is required');
  } else {
    const deadlineDate = new Date(data.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push('Invalid deadline date');
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Add a new assignment. Returns the created assignment or throws on validation error.
 */
export function addAssignment(data) {
  const validation = validateAssignment(data);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  const assignment = {
    id: generateId(),
    title: escapeHTML(data.title.trim()),
    subject: escapeHTML(data.subject.trim()),
    deadline: new Date(data.deadline).toISOString(),
    status: 'pending',
    totalFocusTime: 0,
    createdAt: new Date().toISOString()
  };

  const assignments = getItem(ASSIGNMENTS_KEY) || [];
  assignments.push(assignment);
  setItem(ASSIGNMENTS_KEY, assignments);
  return assignment;
}

/**
 * Update an existing assignment
 */
export function updateAssignment(id, updates) {
  const assignments = getItem(ASSIGNMENTS_KEY) || [];
  const index = assignments.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Assignment not found');

  // Only allow specific fields to be updated
  const allowed = ['status', 'totalFocusTime', 'title', 'subject', 'deadline'];
  for (const key of Object.keys(updates)) {
    if (allowed.includes(key)) {
      if (key === 'title' || key === 'subject') {
        assignments[index][key] = escapeHTML(String(updates[key]).trim());
      } else {
        assignments[index][key] = updates[key];
      }
    }
  }

  setItem(ASSIGNMENTS_KEY, assignments);
  return assignments[index];
}

/**
 * Delete an assignment and its focus sessions
 */
export function deleteAssignment(id) {
  let assignments = getItem(ASSIGNMENTS_KEY) || [];
  assignments = assignments.filter(a => a.id !== id);
  setItem(ASSIGNMENTS_KEY, assignments);

  // Also delete related sessions
  let sessions = getItem(SESSIONS_KEY) || [];
  sessions = sessions.filter(s => s.assignmentId !== id);
  setItem(SESSIONS_KEY, sessions);
}

/**
 * Toggle assignment completion status
 */
export function toggleAssignment(id) {
  const assignments = getItem(ASSIGNMENTS_KEY) || [];
  const assignment = assignments.find(a => a.id === id);
  if (!assignment) throw new Error('Assignment not found');

  assignment.status = assignment.status === 'completed' ? 'pending' : 'completed';
  setItem(ASSIGNMENTS_KEY, assignments);
  return assignment;
}

// ─── Focus Session CRUD ───

/**
 * Get all focus sessions
 */
export function getSessions() {
  return (getItem(SESSIONS_KEY) || []).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}

/**
 * Add a focus session and update the assignment's totalFocusTime
 */
export function addSession(assignmentId, duration) {
  if (!assignmentId || typeof duration !== 'number' || duration <= 0) {
    throw new Error('Invalid session data');
  }

  const session = {
    id: generateId(),
    assignmentId,
    duration, // in seconds
    timestamp: new Date().toISOString()
  };

  const sessions = getItem(SESSIONS_KEY) || [];
  sessions.push(session);
  setItem(SESSIONS_KEY, sessions);

  // Update assignment totalFocusTime
  const assignments = getItem(ASSIGNMENTS_KEY) || [];
  const assignment = assignments.find(a => a.id === assignmentId);
  if (assignment) {
    assignment.totalFocusTime = (assignment.totalFocusTime || 0) + duration;
    setItem(ASSIGNMENTS_KEY, assignments);
  }

  return session;
}

/**
 * Get sessions for a specific assignment
 */
export function getSessionsByAssignment(assignmentId) {
  return getSessions().filter(s => s.assignmentId === assignmentId);
}

/**
 * Get total focus time for today (in seconds)
 */
export function getTodayFocusTime() {
  const today = new Date().toDateString();
  return getSessions()
    .filter(s => new Date(s.timestamp).toDateString() === today)
    .reduce((total, s) => total + s.duration, 0);
}

/**
 * Get daily focus times for the last N days
 * Returns array of { date: string, totalSeconds: number }
 */
export function getDailyFocusTimes(days = 7) {
  const sessions = getSessions();
  const result = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    const totalSeconds = sessions
      .filter(s => new Date(s.timestamp).toDateString() === dateStr)
      .reduce((total, s) => total + s.duration, 0);

    result.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en', { weekday: 'short' }),
      totalSeconds
    });
  }

  return result.reverse();
}

/**
 * Calculate the current daily learning streak
 */
export function getCurrentStreak() {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  // Get unique local dates of all sessions
  const uniqueDates = Array.from(new Set(sessions.map(s => {
    const d = new Date(s.timestamp);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  })));
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

  // If the last session wasn't today or yesterday, streak is broken
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(uniqueDates[0]); // Start counting backwards from the most recent day

  for (let i = 0; i < uniqueDates.length; i++) {
    const dStr = uniqueDates[i];
    const expectedStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    
    if (dStr === expectedStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
    } else {
      break;
    }
  }

  return streak;
}

// ─── Utility: Deadline urgency ───

/**
 * Get urgency level for a deadline: 'overdue', 'urgent', 'soon', 'normal'
 */
export function getUrgency(deadline) {
  const now = new Date();
  const dl = new Date(deadline);
  const hoursLeft = (dl - now) / (1000 * 60 * 60);

  if (hoursLeft < 0) return 'overdue';
  if (hoursLeft < 24) return 'urgent';
  if (hoursLeft < 72) return 'soon';
  return 'normal';
}

/**
 * Format seconds into a human-readable string (e.g. "1h 25m")
 */
export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (hrs > 0) return `${hrs}h ${remainMins}m`;
  return `${mins}m`;
}

/**
 * Format a deadline date for display
 */
export function formatDeadline(deadline) {
  const dl = new Date(deadline);
  const now = new Date();
  const diffMs = dl - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    const agoHours = Math.abs(Math.floor(diffHours));
    if (agoHours < 24) return `${agoHours}h overdue`;
    return `${Math.floor(agoHours / 24)}d overdue`;
  }
  if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}min left`;
  if (diffHours < 24) return `${Math.floor(diffHours)}h left`;
  if (diffHours < 48) return 'Tomorrow';

  return dl.toLocaleDateString('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
