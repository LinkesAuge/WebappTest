/**
 * state.js
 *
 * Description: State management module using the pub/sub pattern
 * Usage:
 *     Import directly: import { setState, getState, subscribe } from './state.js';
 */

import { LOCALSTORAGE_DATA_KEY } from './config.js';

// Private state storage
const _state = {};

// Subscriber storage
const _subscribers = {};
const _wildcardSubscribers = [];

// Generate unique subscription IDs
let _nextSubscriptionId = 1;

// Flag to prevent actions before the app is ready
export let isInitialized = false;

/**
 * Default properties that can be set on the state
 * Update this when adding new state properties
 */
const VALID_PROPERTIES = [
  'allPlayersData',     // Raw player data from CSV or localStorage
  'playerData',         // Processed player data for current timeframe
  'displayData',        // Data being displayed (filtered, sorted)
  'scoreRules',         // Rules for scoring
  'weekData',           // Data specific to selected week
  'currentView',        // Current view being displayed
  'sortColumn',         // Current sort column
  'sortDirection',      // Current sort direction (asc/desc)
  'playerFilter',       // Current player name filter
  'selectedPlayer',     // Currently selected player
  'currentLanguage',    // Current UI language
  'dateUpdated',        // Last data update timestamp
  'chartInstances'      // References to chart instances
];

/**
 * Sets a state property value
 * @param {string} property - The property name
 * @param {*} value - The value to set
 * @returns {boolean} Success indicator
 */
export function setState(property, value) {
  // Validate property name
  if (typeof property !== 'string') {
    console.error('Property name must be a string');
    return false;
  }
  
  // Check if property is valid
  if (!VALID_PROPERTIES.includes(property)) {
    console.error(`Property "${property}" does not exist in state module`);
    return false;
  }
  
  // Set the property
  _state[property] = value;
  
  // Log the update
  console.log(`State property "${property}" updated`);
  
  // Notify subscribers
  notifySubscribers(property, value);
  
  return true;
}

/**
 * Gets a state property value
 * @param {string} property - The property name
 * @returns {*} The property value or undefined
 */
export function getState(property) {
  if (typeof property !== 'string') {
    console.error('Property name must be a string');
    return undefined;
  }
  
  return _state[property];
}

/**
 * Subscribe to changes in a state property
 * @param {string|null} property - State property to watch (null for all changes)
 * @param {Function} callback - Function to call when property changes
 * @returns {string} Subscription ID for unsubscribing
 */
export function subscribe(property, callback) {
  if (typeof callback !== 'function') {
    console.error('Callback must be a function');
    return null;
  }
  
  const id = `sub_${_nextSubscriptionId++}`;
  
  // Subscribe to all state changes
  if (property === null || property === undefined) {
    _wildcardSubscribers.push({
      id,
      callback
    });
    return id;
  }
  
  // Check if property is valid
  if (!VALID_PROPERTIES.includes(property)) {
    console.error(`Cannot subscribe to invalid property "${property}"`);
    return null;
  }
  
  // Subscribe to specific property
  if (!_subscribers[property]) {
    _subscribers[property] = [];
  }
  
  _subscribers[property].push({
    id,
    callback
  });
  
  return id;
}

/**
 * Unsubscribe from state changes
 * @param {string} subscriptionId - Subscription ID to remove
 * @returns {boolean} Success indicator
 */
export function unsubscribe(subscriptionId) {
  // Check wildcard subscribers
  let index = _wildcardSubscribers.findIndex(sub => sub.id === subscriptionId);
  if (index !== -1) {
    _wildcardSubscribers.splice(index, 1);
    return true;
  }
  
  // Check property-specific subscribers
  for (const property in _subscribers) {
    index = _subscribers[property].findIndex(sub => sub.id === subscriptionId);
    if (index !== -1) {
      _subscribers[property].splice(index, 1);
      
      // Clean up empty subscriber arrays
      if (_subscribers[property].length === 0) {
        delete _subscribers[property];
      }
      
      return true;
    }
  }
  
  return false;
}

/**
 * Notifies subscribers of state changes
 * @param {string} property - The state property that changed
 * @param {*} newValue - The new value
 * @private
 */
function notifySubscribers(property, newValue) {
  // Get old value for subscribers
  const oldValue = _state[property];
  
  // Notify property-specific subscribers
  if (_subscribers[property]) {
    for (const subscriber of _subscribers[property]) {
      try {
        subscriber.callback(newValue, oldValue, property);
      } catch (error) {
        console.error(`Error in state subscriber for ${property}:`, error);
      }
    }
  }
  
  // Notify wildcard subscribers
  for (const subscriber of _wildcardSubscribers) {
    try {
      subscriber.callback(newValue, oldValue, property);
    } catch (error) {
      console.error('Error in wildcard state subscriber:', error);
    }
  }
}

/**
 * Saves state data to localStorage
 * @returns {boolean} Success indicator
 */
export function saveDataToLocalStorage() {
  try {
    // Prepare data to save
    const dataToSave = {
      allPlayersData: _state.allPlayersData || [],
      scoreRules: _state.scoreRules || [],
      dateUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem(LOCALSTORAGE_DATA_KEY, JSON.stringify(dataToSave));
    
    console.log('Data saved to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
}

/**
 * Loads state data from localStorage
 * @returns {boolean} Success indicator
 */
export function loadDataFromLocalStorage() {
  try {
    // Get data from localStorage
    const storedData = localStorage.getItem(LOCALSTORAGE_DATA_KEY);
    
    if (!storedData) {
      console.log('No data found in localStorage');
      return false;
    }
    
    // Parse stored data
    const parsedData = JSON.parse(storedData);
    
    // Update state with loaded data
    if (parsedData.allPlayersData) {
      setState('allPlayersData', parsedData.allPlayersData);
    }
    
    if (parsedData.scoreRules) {
      setState('scoreRules', parsedData.scoreRules);
    }
    
    if (parsedData.dateUpdated) {
      setState('dateUpdated', parsedData.dateUpdated);
    }
    
    console.log('Data loaded from localStorage');
    return true;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return false;
  }
}

/**
 * Reset the state to its initial values
 */
export function resetState() {
  // Clear all properties
  for (const property in _state) {
    delete _state[property];
  }
  
  // Reset initialization flag
  isInitialized = false;
  
  console.log('State reset');
}

/**
 * Initialize the state module
 * @returns {boolean} Success indicator
 */
export function initState() {
  // Reset the state first
  resetState();
  
  // Try to load data from localStorage
  const loaded = loadDataFromLocalStorage();
  
  // Set default values for properties that don't exist yet
  if (!_state.currentLanguage) {
    setState('currentLanguage', 'de');
  }
  
  if (!_state.sortColumn) {
    setState('sortColumn', 'score');
  }
  
  if (!_state.sortDirection) {
    setState('sortDirection', 'desc');
  }
  
  // Set the initialization flag
  isInitialized = true;
  
  console.log('State module initialized');
  return true;
}

// Export state properties directly for backward compatibility
// This allows accessing them like: import { allPlayersData } from './state.js';
Object.defineProperties(exports, {
  allPlayersData: {
    get: () => _state.allPlayersData,
    enumerable: true
  },
  scoreRules: {
    get: () => _state.scoreRules,
    enumerable: true
  },
  playerData: {
    get: () => _state.playerData,
    enumerable: true
  },
  displayData: {
    get: () => _state.displayData,
    enumerable: true
  },
  currentView: {
    get: () => _state.currentView,
    enumerable: true
  },
  selectedPlayer: {
    get: () => _state.selectedPlayer,
    enumerable: true
  },
  currentLanguage: {
    get: () => _state.currentLanguage,
    enumerable: true
  }
}); 