/**
 * main.js
 *
 * Description: Main entry point for the modular application.
 *              Initializes the application and orchestrates module loading.
 * Usage:
 *     Loaded in index.html via <script type="module" src="js/main.js"></script>
 */

// Import modules
import * as config from './config.js';
import * as utils from './utils.js';

// Flag to prevent actions before the app is ready
let isInitialized = false;

/**
 * Application initialization
 */
function init() {
  try {
    console.log('Initializing modular application...');
    
    // Log initialization for verification
    console.log('Loaded modules:');
    console.log('- config.js', { 
      constants: { 
        CSV_PATH: config.CSV_PATH,
        RULES_PATH: config.RULES_PATH,
        DEFAULT_LANGUAGE: config.DEFAULT_LANGUAGE
      }
    });
    console.log('- utils.js loaded with functions:', 
      Object.keys(utils).filter(key => typeof utils[key] === 'function')
    );
    
    // Set initialization flag
    isInitialized = true;
    console.log('Application initialization completed successfully.');
    
    // Note: For now, we're not actually initializing any functionality.
    // The original script.js is still loading and doing all the work.
    // This serves as a proof of concept that our modules are loading correctly.
    
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

/**
 * Handle DOMContentLoaded event
 */
function onDOMContentLoaded() {
  init();
}

// Add event listener for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
  // DOM is already ready, call the handler directly
  onDOMContentLoaded();
}

// Export for testing
export { init, isInitialized }; 