/* ============================================
   Velo — Entry Point
   ============================================ */

import './styles/variables.css';
import './styles/base.css';
import './styles/views.css';
import { initApp } from './app.js';

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
