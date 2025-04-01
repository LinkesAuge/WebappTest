/**
 * state.js
 * Contains global state variables and state management functions
 */

import { LOCALSTORAGE_DATA_KEY } from './config.js';

// --- STATE VARIABLES ---
export let allPlayersData = []; // Holds the raw, cleaned data for all players
export let displayData = []; // Holds the data currently being displayed (can be filtered/sorted)
export let allColumnHeaders = []; // Holds all column names from the CSV
export let scoreRules = []; // Holds the data from rules.csv
export let currentLanguage = ''; // Tracks the currently selected language (will be set from config.DEFAULT_LANGUAGE)
export let currentView = 'loading'; // Tracks the currently visible section/view
export let sortState = {
  column: 'TOTAL_SCORE',
  direction: 'desc'
}; // Sort state for the main ranking table
export let detailedTableSortState = {
  column: 'PLAYER',
  direction: 'asc'
}; // Sort state for the detailed data table
export let scoreRulesSortState = {
  column: 'Typ',
  direction: 'asc'
}; // Sort state for the score rules table
export let aggregateStats = {}; // Holds calculated overall statistics
export let currentPlayerData = null; // Holds data for the player being viewed in detail
export let dataLastModifiedTimestamp = null; // Timestamp from the 'Last-Modified' header of data.csv

// --- MULTI-WEEK STATE VARIABLES ---
export let availableWeeks = []; // Holds the list of available weeks
export let mostRecentWeek = null; // Holds the most recent week object
export let currentWeek = null; // Holds the currently selected week
export let currentWeekNumber = null; // Holds the current week number
export let playerData = []; // Holds the current week's player data
export let historicalData = []; // Holds data from all weeks for historical analysis
export let historicalStats = null; // Holds calculated statistics across all weeks

// --- CHART INSTANCES ---
export let chartInstances = {
  player: null,
  category: null,
  topSources: null,
  scoreDistribution: null,
  scoreVsChests: null,
  frequentSources: null,
  modalChart: null,
  // Add keys for charts page instances to avoid conflicts
  topSourcesChartsPage: null,
  scoreDistributionChartsPage: null,
  scoreVsChestsChartsPage: null,
  frequentSourcesChartsPage: null,
  // Add keys for history charts
  scoreTrendChart: null,
  chestsTrendChart: null,
  topPlayersChart: null,
  categoryTrendChart: null,
};

export let isInitialized = false; // Flag to prevent actions before the app is ready

/**
 * Saves application data to localStorage for persistence
 */
export function saveDataToLocalStorage() {
  try {
    const dataToStore = {
      allPlayersData,
      scoreRules,
      dateUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(LOCALSTORAGE_DATA_KEY, JSON.stringify(dataToStore));
    console.log('Application data saved to localStorage');
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

/**
 * Loads application data from localStorage
 * @returns {boolean} Whether data was successfully loaded
 */
export function loadDataFromLocalStorage() {
  try {
    const storedData = localStorage.getItem(LOCALSTORAGE_DATA_KEY);
    
    if (!storedData) {
      console.log('No stored data found in localStorage');
      return false;
    }
    
    const parsedData = JSON.parse(storedData);
    
    if (!parsedData.allPlayersData || !parsedData.scoreRules) {
      console.warn('Stored data is missing required fields');
      return false;
    }
    
    // Update state with stored data
    allPlayersData = parsedData.allPlayersData;
    scoreRules = parsedData.scoreRules;
    
    console.log('Application data loaded from localStorage');
    return true;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return false;
  }
}

/**
 * Resets the application state variables
 */
export function resetState() {
  allPlayersData = [];
  displayData = [];
  allColumnHeaders = [];
  aggregateStats = {};
  currentPlayerData = null;
  
  // Reset chart instances to avoid memory leaks
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      try {
        chartInstances[key].destroy();
      } catch (e) {
        console.warn(`Error destroying chart instance ${key}:`, e);
      }
      chartInstances[key] = null;
    }
  });
}

// Export default state object
export default {
  // State variables
  allPlayersData,
  displayData,
  allColumnHeaders,
  scoreRules,
  currentLanguage,
  currentView,
  sortState,
  detailedTableSortState,
  scoreRulesSortState,
  aggregateStats,
  currentPlayerData,
  dataLastModifiedTimestamp,
  availableWeeks,
  mostRecentWeek,
  currentWeek,
  currentWeekNumber,
  playerData,
  historicalData,
  historicalStats,
  chartInstances,
  isInitialized,
  
  // Methods
  saveDataToLocalStorage,
  loadDataFromLocalStorage,
  resetState
};