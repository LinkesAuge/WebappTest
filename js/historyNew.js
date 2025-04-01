/**
 * historyNew.js
 * Handles historical data loading and visualization
 * This is a simplified replacement for history.js with corrected syntax
 */

import { elements, showView, showLoading, hideLoading, showError, createElement, clearElement } from './dom.js';
import { loadAvailableWeeks, loadWeekData } from './dataLoading.js';
import { getText } from './i18n.js';
import { formatDateRange, getWeekDateRange } from './utils.js';
import { renderDashboardCharts } from './charts.js';
import * as state from './state.js';
import * as uiUpdates from './uiUpdates.js';
import * as charts from './charts.js';
import { availableWeeks, historicalData, currentWeek } from './state.js';

// Track chart instances to properly destroy and recreate them
export const chartInstances = {
  scoreTrend: null,
  chestsTrend: null,
  topPlayers: null,
  categoryTrend: null
};

// Stores calculated stats from historical data
export let historicalStats = null;

/**
 * Formats a number for display
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat().format(Math.round(num));
}

/**
 * Initializes weekly data by loading available weeks
 * @returns {Promise<boolean>} Success status
 */
export async function initializeWeeklyData() {
  try {
    console.log('Initializing weekly data...');
    
    // First check that availableWeeks is properly initialized
    console.log('availableWeeks before loading:', availableWeeks);
    
    // First, load available weeks
    const weeksLoaded = await loadAvailableWeeks();
    console.log('Weeks loaded status:', weeksLoaded);
    console.log('availableWeeks after loading:', availableWeeks);
    
    // Check if we have available weeks
    if (!weeksLoaded || !availableWeeks || availableWeeks.length === 0) {
      console.warn('No available weeks found');
      
      if (elements.weekSelector) {
        // Clear and disable week selector
        elements.weekSelector.innerHTML = '';
        
        // Add a placeholder option
        const option = document.createElement('option');
        option.value = '';
        option.textContent = getText('weekSelector.noWeeks');
        option.disabled = true;
        option.selected = true;
        elements.weekSelector.appendChild(option);
        elements.weekSelector.disabled = true;
      }
      
      // Show error message
      showError(getText('no_weeks_found'));
      return false;
    }
    
    // Determine the latest week
    const latestWeek = determineLatestWeek(availableWeeks);
    console.log('Latest week determined:', latestWeek);
    
    // Initialize currentWeek with a proper object
    console.log('currentWeek before initialization:', currentWeek);
    if (!currentWeek) {
      // Use a non-global object creation to ensure we're modifying the exported variable
      window.currentWeek = {};
      // Also set the module export
      state.currentWeek = window.currentWeek;
    }
    console.log('currentWeek after initialization:', currentWeek);
    
    // Update the week selector (if it exists)
    populateWeekSelector();
    console.log('Week selector populated');
    
    // Select the latest week if no week is currently selected
    if (latestWeek) {
      console.log(`Setting latest week: ${latestWeek.week}`);
      
      // Update current week in state
      try {
        // Make sure we're using the module variable
        if (currentWeek && typeof currentWeek === 'object') {
          currentWeek.id = latestWeek.week;
          
          // Load and set data for this week
          if (latestWeek.file) {
            console.log(`Loading week data from file: ${latestWeek.file}`);
            const weekData = await loadWeekData(latestWeek.file);
            if (weekData) {
              currentWeek.data = weekData;
              // Update UI with the data
              updateUIWithWeekData(weekData);
              console.log('UI updated with week data');
            } else {
              console.error(`Failed to load data for week ${latestWeek.week}`);
            }
          }
          
          // Change the week selector value if it exists
          const weekSelector = document.getElementById('weekSelector');
          if (weekSelector) {
            // Log current options for debugging
            console.log('Available options in weekSelector:', 
              [...weekSelector.options].map(opt => ({ value: opt.value, text: opt.text })));
            
            // Set the value for the correct week
            weekSelector.value = latestWeek.week;
            console.log(`Set weekSelector value to ${latestWeek.week}`);
            
            // Trigger a change event on the selector
            const event = new Event('change', { bubbles: true });
            weekSelector.dispatchEvent(event);
            console.log('Change event dispatched on weekSelector');
          } else {
            console.warn('weekSelector element not found');
          }
        } else {
          console.error('currentWeek is not a valid object:', currentWeek);
        }
      } catch (error) {
        console.error(`Error setting latest week: ${error.message}`);
      }
    } else {
      console.warn('No latest week found');
    }
    
    console.log('Weekly data initialized successfully');
    return true;
  } catch (error) {
    console.error(`Error initializing weekly data: ${error}`);
    return false;
  }
}

/**
 * Determines the latest week from available weeks
 * @param {Array} weeks - Array of week objects
 * @returns {Object|null} The latest week, or null if no weeks found
 */
export function determineLatestWeek(weeks) {
  try {
    if (!weeks || !Array.isArray(weeks) || weeks.length === 0) {
      console.warn('No weeks provided to determineLatestWeek');
      return null;
    }
    
    console.log(`Determining latest week from ${weeks.length} weeks...`);
    
    // Try to sort by end date first (most reliable)
    if (weeks[0].endDate) {
      const sortedByDate = [...weeks].sort((a, b) => {
        if (!a.endDate) return 1;  // a goes after b if a has no end date
        if (!b.endDate) return -1; // a goes before b if b has no end date
        
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        
        if (isNaN(dateA.getTime())) return 1;  // a goes after b if a has invalid date
        if (isNaN(dateB.getTime())) return -1; // a goes before b if b has invalid date
        
        return dateB - dateA; // Sort in descending order (newest first)
      });
      
      console.log(`Latest week by date: ${sortedByDate[0].week}`);
      return sortedByDate[0];
    }
    
    // Try to sort by week number if no dates available
    const sortedByNumber = [...weeks].sort((a, b) => {
      // Extract week numbers and compare
      const numA = parseInt(a.week, 10);
      const numB = parseInt(b.week, 10);
      
      if (isNaN(numA)) return 1;  // a goes after b if a has no number
      if (isNaN(numB)) return -1; // a goes before b if b has no number
      
      return numB - numA; // Sort in descending order (highest first)
    });
    
    console.log(`Latest week by number: ${sortedByNumber[0].week}`);
    return sortedByNumber[0];
  } catch (error) {
    console.error('Error determining latest week:', error);
    
    // Fallback to first week if we can't determine
    if (weeks && weeks.length > 0) {
      return weeks[0];
    }
    
    return null;
  }
}

/**
 * Populates the week selector dropdown with available weeks
 */
export function populateWeekSelector() {
  try {
    if (!elements.weekSelector) {
      console.warn('Week selector element not found');
      return;
    }
    
    if (!availableWeeks || !Array.isArray(availableWeeks) || availableWeeks.length === 0) {
      console.warn('No available weeks to populate selector with');
      
      // Clear and disable the selector
      elements.weekSelector.innerHTML = '';
      
      // Add a placeholder option
      const option = document.createElement('option');
      option.value = '';
      option.textContent = getText('weekSelector.noWeeks');
      option.disabled = true;
      option.selected = true;
      elements.weekSelector.appendChild(option);
      elements.weekSelector.disabled = true;
      
      return;
    }
    
    // Clear existing options
    elements.weekSelector.innerHTML = '';
    elements.weekSelector.disabled = false;
    
    // Sort weeks in descending order (latest first) for the selector
    const sortedWeeks = [...availableWeeks].sort((a, b) => {
      const weekA = parseInt(a.week || a.id, 10);
      const weekB = parseInt(b.week || b.id, 10);
      
      if (isNaN(weekA) || isNaN(weekB)) {
        // If not numeric, sort by string
        return String(b.week || b.id).localeCompare(String(a.week || a.id));
      }
      
      return weekB - weekA;
    });
    
    // Add option for each week
    sortedWeeks.forEach(week => {
      // Get week number and date range
      const weekId = week.week || week.id;
      let dateRangeText = '';
      
      if (week.startDate && week.endDate) {
        // Use existing date range
        const startDate = new Date(week.startDate);
        const endDate = new Date(week.endDate);
        dateRangeText = formatDateRange(startDate, endDate);
      } else if (weekId) {
        // Calculate date range from week number
        try {
          const dateRange = getWeekDateRange(weekId);
          dateRangeText = formatDateRange(dateRange.startDate, dateRange.endDate);
        } catch (error) {
          console.warn(`Error formatting date range for week ${weekId}:`, error);
          dateRangeText = `Week ${weekId}`;
        }
      } else {
        dateRangeText = 'Unknown week';
      }
      
      // Create the option element
      const option = document.createElement('option');
      option.value = weekId;
      option.textContent = `${getText('weekSelector.week')} ${weekId} (${dateRangeText})`;
      
      // Add the option to the selector
      elements.weekSelector.appendChild(option);
    });
    
    console.log(`Week selector populated with ${sortedWeeks.length} weeks`);
  } catch (error) {
    console.error('Error populating week selector:', error);
  }
}

/**
 * Updates the UI with week data
 * @param {Object} weekData - The data for the current week
 */
export function updateUIWithWeekData(weekData) {
  try {
    if (!weekData) {
      console.warn('No week data to update UI with');
      return;
    }
    
    console.log('Updating UI with week data:', weekData);
    
    // Extract player data based on data format
    let playerData = [];
    
    // Handle different possible formats from CSV or JSON
    if (Array.isArray(weekData)) {
      // Direct array of players
      playerData = weekData;
    } else if (weekData.players && Array.isArray(weekData.players)) {
      // Object with players array (CSV format)
      playerData = weekData.players;
    } else if (weekData.data && Array.isArray(weekData.data)) {
      // Object with data array (JSON format)
      playerData = weekData.data;
    }
    
    // Clear existing state data
    state.displayData = [];
    state.allPlayersData = [];
    
    // Copy player data to state
    if (Array.isArray(playerData)) {
      state.allPlayersData = [...playerData];
      state.displayData = [...playerData];
      
      // Update UI components
      uiUpdates.updateDashboardStatistics();
      uiUpdates.updateRankingTable();
      charts.renderDashboardCharts();
      
      // Dispatch an event that other modules can listen for
      document.dispatchEvent(new CustomEvent('weekDataUpdated', { 
        detail: weekData 
      }));
      
      console.log('UI updated successfully with week data');
    } else {
      console.warn('Invalid player data format:', playerData);
    }
  } catch (error) {
    console.error('Error updating UI with week data:', error);
  }
}

/**
 * Loads historical data from all available weeks
 * @returns {Promise<boolean>} Success status
 */
export async function loadHistoricalData() {
  try {
    console.log('Loading historical data...');
    
    // Ensure we have weeks available
    if (!availableWeeks || !Array.isArray(availableWeeks) || availableWeeks.length === 0) {
      console.warn('No available weeks for historical data');
      return false;
    }
    
    // Clear previous historical data
    historicalData.length = 0;
    
    // Process each week
    for (const week of availableWeeks) {
      try {
        // Make sure we have a proper week id and file
        const weekId = week.id || week.week;
        const weekFile = week.file;
        
        if (!weekId || !weekFile) {
          console.warn('Week missing ID or file, skipping:', week);
          continue;
        }
        
        // Attempt to load the week data
        const weekData = await loadWeekData(weekFile);
        
        if (!weekData) {
          console.warn(`No data loaded for week ${weekId}`);
          continue;
        }
        
        // Create a week entry for historical data
        const weekEntry = {
          weekNumber: weekId,
          weekStart: week.startDate || new Date().toISOString(),
          weekEnd: week.endDate || new Date().toISOString(),
          playerCount: 0,
          totalScore: 0,
          totalChests: 0,
          averageScore: 0,
          mostCommonSource: { name: 'Unknown', count: 0 }
        };
        
        // Add to historical data array
        historicalData.push(weekEntry);
      } catch (error) {
        console.error(`Error processing week ${week.week}:`, error);
      }
    }
    
    console.log(`Historical data loaded for ${historicalData.length} weeks`);
    return historicalData.length > 0;
  } catch (error) {
    console.error('Error loading historical data:', error);
    return false;
  }
}

/**
 * Switches to a different week and loads its data
 * @param {string} weekId - The week ID to switch to
 * @returns {Promise<boolean>} - Whether the switch was successful
 */
export async function switchWeek(weekId) {
  try {
    console.log(`Switching to week ${weekId}`);
    
    // Find the week info in availableWeeks
    const weekInfo = availableWeeks.find(week => week.week === weekId);
    if (!weekInfo) {
      console.error(`Week ${weekId} not found in available weeks`);
      return false;
    }
    
    // Show loading indicator
    showLoading(getText('loading_week_data', { week: weekId }));
    
    // Load the week data
    const weekData = await loadWeekData(weekInfo.file);
    if (!weekData) {
      console.error(`Failed to load data for week ${weekId}`);
      hideLoading();
      showError(getText('error_loading_week', { week: weekId }));
      return false;
    }
    
    // Update current week in state
    currentWeek.id = weekId;
    currentWeek.data = weekData;
    
    // Update UI with the week data
    updateUIWithWeekData(weekData);
    
    // Update UI elements to reflect current week
    const latestWeekIndicator = document.getElementById('latestWeekIndicator');
    if (latestWeekIndicator) {
      // Show 'Latest' indicator only if this is the most recent week
      const isLatestWeek = determineLatestWeek(availableWeeks)?.week === weekId;
      latestWeekIndicator.classList.toggle('hidden', !isLatestWeek);
    }
    
    // Sync mobile selector if it exists
    const mobileWeekSelector = document.getElementById('mobileWeekSelector');
    if (mobileWeekSelector) {
      mobileWeekSelector.value = weekId;
    }
    
    // Hide loading indicator
    hideLoading();
    
    console.log(`Successfully switched to week ${weekId}`);
    return true;
  } catch (error) {
    console.error(`Error switching week: ${error}`);
    hideLoading();
    showError(getText('error_switching_week'));
    return false;
  }
}

// Export all functions
export default {
  initializeWeeklyData,
  determineLatestWeek,
  populateWeekSelector,
  updateUIWithWeekData,
  loadHistoricalData,
  chartInstances,
  historicalStats
}; 