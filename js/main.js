/**
 * main.js
 * Application entry point
 */

// Import modules
import config from './config.js';
import * as utils from './utils.js';
import * as state from './state.js';
import * as i18n from './i18n.js';
import * as dom from './dom.js';
import * as listeners from './listeners.js';
import * as dataLoading from './dataLoading.js';
import * as dataProcessing from './dataProcessing.js';
import * as uiUpdates from './uiUpdates.js';
import * as charts from './charts.js';
import { initializeWeeklyData } from './historyNew.js';

/**
 * Initializes the application
 */
async function initializeApp() {
  try {
    console.log('Initializing application...');
    
    // Initialize DOM element references
    const domInitialized = dom.assignElementReferences();
    if (!domInitialized) {
      console.error('Failed to initialize DOM references');
      return;
    }
    
    // Set initial language
    const userLanguage = i18n.getLanguagePreference();
    i18n.setLanguage(userLanguage);
    
    // Add event listeners
    listeners.setupEventListeners();
    
    // Try to load data from localStorage first
    const restoredData = state.loadDataFromLocalStorage();
    
    if (restoredData) {
      console.log('Data restored from localStorage');
      
      // Update UI with restored data
      uiUpdates.updateDashboardStatistics();
      uiUpdates.updateRankingTable();
      charts.renderDashboardCharts();
      
      // Hide loading overlay
      dom.hideLoading();
    } else {
      // Show loading message
      dom.showLoading(i18n.getText('status.loading'));
      
      // Load data from files
      try {
        await dataLoading.loadScoreRules();
        await dataLoading.loadPlayerData();
        
        // Process the loaded data
        dataProcessing.processPlayerData();
        
        // First load available weeks
        let weeksLoaded = await dataLoading.loadAvailableWeeks();
        console.log(`Available weeks loaded: ${weeksLoaded}`);
        
        // If weeks failed to load, add hardcoded fallback data
        if (!weeksLoaded || !state.availableWeeks || state.availableWeeks.length === 0) {
          console.warn('Failed to load weeks.json, using hardcoded fallback data');
          // Create fallback weeks data directly and ensure we initialize the array if it doesn't exist
          if (!state.availableWeeks) {
            state.availableWeeks = [];
          }
          
          // Clear array and add hardcoded data
          state.availableWeeks.length = 0;
          state.availableWeeks.push(
            { week: '12', file: 'data_week_12.csv' },
            { week: '13', file: 'data_week_13.csv' },
            { week: '14', file: 'data_week_14.csv' },
            { week: '15', file: 'data_week_15.csv' }
          );
          
          // Calculate date ranges for fallback data
          state.availableWeeks.forEach(week => {
            try {
              if (week.week) {
                const dateRange = utils.getWeekDateRange(week.week);
                week.startDate = dateRange.startDate;
                week.endDate = dateRange.endDate;
              }
            } catch (error) {
              console.warn(`Error calculating date range for week ${week.week}:`, error);
            }
          });
          
          console.log('Created fallback weeks data:', state.availableWeeks);
          weeksLoaded = true;
        }
        
        // Then initialize weekly data system to load the current/active week
        const weeklyDataInitialized = await initializeWeeklyData();
        console.log(`Weekly data system initialized: ${weeklyDataInitialized}`);
        
        // Update UI with fresh data
        uiUpdates.updateDashboardStatistics();
        uiUpdates.updateRankingTable();
        charts.renderDashboardCharts();
        
        // Save data to localStorage
        state.saveDataToLocalStorage();
        
        // Hide loading overlay
        dom.hideLoading();
        
        // Show success message
        dom.showError(i18n.getText('status.dataLoaded'), 3000);
      } catch (error) {
        console.error('Error loading data:', error);
        dom.hideLoading();
        dom.showError(i18n.getText('status.dataLoadError', { 0: 'data files' }));
      }
    }
    
    // Show initial view (dashboard)
    dom.showView('dashboard');
    
    console.log('Application initialized successfully');
    
    // Don't try to assign to state.isInitialized if it's a read-only property
    try {
      state.isInitialized = true;
    } catch (error) {
      console.warn('Could not set initialization state:', error);
    }
  } catch (error) {
    console.error('Error initializing application:', error);
    dom.hideLoading();
    dom.showError('An error occurred during application initialization.');
  }
}

/**
 * Refreshes the current view
 */
export function refreshCurrentView() {
  // Get the current view
  const currentView = getCurrentView();
  
  // Refresh based on the current view
  if (currentView) {
    dom.showView(currentView);
    
    // Update content based on view type
    switch (currentView) {
      case 'dashboard':
        uiUpdates.updateDashboardStatistics();
        uiUpdates.updateRankingTable();
        charts.renderDashboardCharts();
        break;
      case 'detailed-table':
        uiUpdates.updateDetailedDataTable();
        break;
      case 'charts':
        charts.renderDashboardCharts();
        break;
      case 'score-system':
        uiUpdates.updateScoreSystemTable();
        break;
      case 'history':
        // Update history view content when implemented
        break;
      default:
        console.warn(`No refresh handler for view: ${currentView}`);
    }
  } else {
    // Fallback to dashboard
    dom.showView('dashboard');
  }
}

/**
 * Gets the current active view
 * @returns {string|null} The current view name or null if none found
 */
export function getCurrentView() {
  // Check which view is currently visible
  const sectionIdToViewMap = {
    'dashboard-section': 'dashboard',
    'detailed-table-section': 'detailed-table',
    'charts-section': 'charts',
    'analytics-section': 'analytics',
    'score-system-section': 'score-system',
    'history-section': 'history',
    'detail-section': 'detail'
  };
  
  // Check each section
  for (const [sectionId, viewId] of Object.entries(sectionIdToViewMap)) {
    const section = document.getElementById(sectionId);
    if (section && !section.classList.contains('hidden')) {
      return viewId;
    }
  }
  
  // No view is currently active
  return null;
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export the initialization function (can be useful for testing or manual initialization)
export { initializeApp };

// Export default object with main functions
export default {
  initializeApp,
  refreshCurrentView,
  getCurrentView
}; 