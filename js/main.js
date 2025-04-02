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
import * as state from './state.js';
import * as dom from './dom.js';
import * as i18n from './i18n.js';
import { initializeDataLoading } from './data-loading/csvLoader.js';
import { processData } from './data-processing/dataProcessing.js';
import { renderTable } from './ui-updates/tableRenderer.js';
import { initializeAllListeners, cleanupAllListeners } from './listeners/index.js';

// Flag to prevent actions before the app is ready
let isInitialized = false;

/**
 * Application initialization
 */
async function init() {
  try {
    console.log('Initializing modular application...');
    
    // Initialize core modules
    dom.initializeDom();
    state.initState();
    await i18n.initLanguage();
    
    // Show loading indicator
    dom.showLoading('Initializing application...');
    
    // Initialize data
    const dataLoaded = await initializeDataLoading();
    if (!dataLoaded) {
      throw new Error('Failed to load application data');
    }
    
    // Process data
    const allPlayersData = state.getState('allPlayersData');
    if (allPlayersData && allPlayersData.length > 0) {
      const processedData = processData(allPlayersData);
      state.setState('playerData', processedData);
      state.setState('displayData', processedData); // Initial display data
      
      // Set initial sort state
      state.setState('sortColumn', 'score');
      state.setState('sortDirection', 'desc');
    } else {
      console.warn('No player data available to process');
    }
    
    // Initialize UI components with reactive table
    renderTable('player-table-container');
    
    // Initialize event listeners
    initializeAllListeners();
    
    // Set up window unload handler for cleanup
    window.addEventListener('beforeunload', () => {
      cleanupAllListeners();
    });
    
    // Set initialization flag
    isInitialized = true;
    dom.hideLoading();
    console.log('Application initialization completed successfully.');
    
    // Note: For now, we're not actually initializing all functionality.
    // The original script.js is still loading and doing some of the work.
    // This serves as a progressive implementation of our modular approach.
    
  } catch (error) {
    dom.hideLoading();
    dom.showError(`Error initializing application: ${error.message}`, true);
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