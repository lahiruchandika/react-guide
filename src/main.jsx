/**
 * main.jsx - the entry point of the application.
 * ----------------------------------------------------------------------------
 * 1. Find the <div id="root"> in index.html
 * 2. Create a React root on it
 * 3. Render <App /> inside <StrictMode>
 *
 * StrictMode is a development helper: it renders components twice and runs
 * effects twice (mount -> unmount -> mount) to help you find bugs such as a
 * missing cleanup function. It has no effect in the production build.
 * ----------------------------------------------------------------------------
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/app/App';

// Global styles: design tokens (colors, spacing) first, then base element styles.
import '@/styles/variables.css';
import '@/styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
