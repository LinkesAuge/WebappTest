/**
 * listeners/index.js
 *
 * Description: Central export point for all listener modules
 * Usage:
 *     Import directly: import { initializeAllListeners } from './listeners/index.js';
 */

import { initializeTableListeners, cleanupTableListeners } from './tableListeners.js';

// Track initialization state
let listenersInitialized = false;

/**
 * Initialize all event listeners across the application
 */
export function initializeAllListeners() {
  if (listenersInitialized) {
    console.warn('Event listeners already initialized');
    return;
  }
  
  // Initialize table listeners
  initializeTableListeners();
  
  // Set initialization flag
  listenersInitialized = true;
  console.log('All event listeners initialized');
}

/**
 * Clean up all event listeners to prevent memory leaks
 */
export function cleanupAllListeners() {
  // Clean up table listeners
  cleanupTableListeners();
  
  // Reset initialization flag
  listenersInitialized = false;
  console.log('All event listeners cleaned up');
}

// Re-export individual listener initializers
export { 
  initializeTableListeners,
  cleanupTableListeners 
}; 