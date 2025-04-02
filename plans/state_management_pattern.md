# State Management Pattern

This document describes the state management pattern to be implemented in the refactored application. The pattern follows a simple pub/sub (publisher/subscriber) approach to manage application state and notify components when state changes occur.

## Core Principles

1. **Single Source of Truth**: All application state is stored in a central state object
2. **Read-Only State**: State is accessed through getter methods
3. **Controlled Updates**: State is modified only through setter methods
4. **Change Notifications**: Subscribers are notified when state they care about changes
5. **Serializable**: State can be easily saved to and loaded from storage

## State Structure

The state will be structured as a simple JavaScript object with hierarchical organization:

```javascript
const state = {
  // Application settings
  settings: {
    language: 'de',
    theme: 'dark',
    debug: false
  },
  
  // Data
  data: {
    allPlayersData: [],
    scoreRules: [],
    filteredData: [],
    sortField: 'score',
    sortDirection: 'desc'
  },
  
  // UI state
  ui: {
    currentView: 'dashboard',
    selectedPlayer: null,
    selectedCategory: null,
    showDownloadButtons: false
  },
  
  // Chart state
  charts: {
    instances: {},
    expandedChart: null
  }
};
```

## Pub/Sub Implementation

The state module will implement a publish/subscribe pattern to notify components when state changes:

```javascript
// Private state container
const _state = {};

// Subscriber storage
const _subscribers = {};
const _wildcardSubscribers = [];

// Generate unique subscription IDs
let _nextSubscriptionId = 1;

/**
 * Gets a value from the state
 * @param {string} key - Dot notation path to state value
 * @returns {*} The state value or undefined
 */
export function getState(key) {
  if (!key) return { ..._state }; // Return copy of entire state
  
  // Handle dot notation (e.g., 'settings.language')
  const parts = key.split('.');
  let value = _state;
  
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  
  // Return a copy for objects/arrays to prevent direct mutation
  if (typeof value === 'object' && value !== null) {
    return Array.isArray(value) ? [...value] : { ...value };
  }
  
  return value;
}

/**
 * Sets a value in the state
 * @param {string} key - Dot notation path to state value
 * @param {*} value - The value to set
 * @returns {boolean} Success indicator
 */
export function setState(key, value) {
  if (!key) return false;
  
  // Handle dot notation for nested paths
  const parts = key.split('.');
  const lastPart = parts.pop();
  let current = _state;
  
  // Navigate to the appropriate nesting level
  for (const part of parts) {
    if (current[part] === undefined) {
      current[part] = {};
    } else if (typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  // Only update and notify if value actually changed
  const oldValue = current[lastPart];
  const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(value);
  
  if (hasChanged) {
    // Set the new value
    current[lastPart] = value;
    
    // Notify subscribers
    notifySubscribers(key, value, oldValue);
    
    return true;
  }
  
  return false;
}

/**
 * Subscribe to changes in state
 * @param {string|null} key - State key to watch (null for all changes)
 * @param {Function} callback - Function to call when state changes
 * @returns {string} Subscription ID for unsubscribing
 */
export function subscribe(key, callback) {
  if (typeof callback !== 'function') {
    return null;
  }
  
  const id = `sub_${_nextSubscriptionId++}`;
  
  // Subscribe to all state changes
  if (key === null || key === undefined) {
    _wildcardSubscribers.push({
      id,
      callback
    });
    return id;
  }
  
  // Subscribe to specific key
  if (!_subscribers[key]) {
    _subscribers[key] = [];
  }
  
  _subscribers[key].push({
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
  
  // Check key-specific subscribers
  for (const key in _subscribers) {
    index = _subscribers[key].findIndex(sub => sub.id === subscriptionId);
    if (index !== -1) {
      _subscribers[key].splice(index, 1);
      
      // Clean up empty subscriber arrays
      if (_subscribers[key].length === 0) {
        delete _subscribers[key];
      }
      
      return true;
    }
  }
  
  return false;
}

/**
 * Notifies subscribers of state changes
 * @param {string} key - The state key that changed
 * @param {*} newValue - The new value
 * @param {*} oldValue - The previous value
 * @private
 */
function notifySubscribers(key, newValue, oldValue) {
  // Notify exact key subscribers
  if (_subscribers[key]) {
    for (const subscriber of _subscribers[key]) {
      try {
        subscriber.callback(newValue, oldValue, key);
      } catch (error) {
        console.error(`Error in state subscriber for ${key}:`, error);
      }
    }
  }
  
  // Notify parent key subscribers
  // E.g., if 'settings.language' changes, notify 'settings' subscribers
  const parts = key.split('.');
  while (parts.length > 1) {
    parts.pop();
    const parentKey = parts.join('.');
    
    if (_subscribers[parentKey]) {
      const parentValue = getState(parentKey);
      for (const subscriber of _subscribers[parentKey]) {
        try {
          subscriber.callback(parentValue, null, parentKey);
        } catch (error) {
          console.error(`Error in state subscriber for ${parentKey}:`, error);
        }
      }
    }
  }
  
  // Notify wildcard subscribers
  for (const subscriber of _wildcardSubscribers) {
    try {
      subscriber.callback(newValue, oldValue, key);
    } catch (error) {
      console.error(`Error in wildcard state subscriber:`, error);
    }
  }
}

/**
 * Creates a default state structure
 * @returns {Object} The default state
 */
export function createDefaultState() {
  // Define default state
  const defaultState = {
    settings: {
      language: 'de',
      theme: 'dark',
      debug: false
    },
    data: {
      allPlayersData: [],
      scoreRules: [],
      filteredData: [],
      sortField: 'score',
      sortDirection: 'desc'
    },
    ui: {
      currentView: 'dashboard',
      selectedPlayer: null,
      selectedCategory: null,
      showDownloadButtons: false
    },
    charts: {
      instances: {},
      expandedChart: null
    }
  };
  
  // Initialize state with defaults
  for (const key in defaultState) {
    setState(key, defaultState[key]);
  }
  
  return { ..._state };
}

/**
 * Saves state to localStorage
 * @param {string[]} [keys] - Specific keys to save (saves all if omitted)
 * @returns {boolean} Success indicator
 */
export function saveStateToStorage(keys) {
  try {
    const toSave = {};
    
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      // Save entire state
      Object.assign(toSave, _state);
      
      // Don't save chart instances or other non-serializable data
      if (toSave.charts && toSave.charts.instances) {
        delete toSave.charts.instances;
      }
    } else {
      // Save only specified keys
      for (const key of keys) {
        const value = getState(key);
        
        if (value !== undefined) {
          // Handle dot notation for nested keys
          const parts = key.split('.');
          let current = toSave;
          
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            current[part] = current[part] || {};
            current = current[part];
          }
          
          current[parts[parts.length - 1]] = value;
        }
      }
    }
    
    localStorage.setItem('appState', JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('Error saving state to storage:', error);
    return false;
  }
}

/**
 * Loads state from localStorage
 * @param {string[]} [keys] - Specific keys to load (loads all if omitted)
 * @returns {boolean} Success indicator
 */
export function loadStateFromStorage(keys) {
  try {
    const stored = localStorage.getItem('appState');
    
    if (!stored) return false;
    
    const storedState = JSON.parse(stored);
    
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      // Load entire state
      for (const key in storedState) {
        setState(key, storedState[key]);
      }
    } else {
      // Load only specified keys
      for (const key of keys) {
        const parts = key.split('.');
        let value = storedState;
        
        // Navigate to the appropriate nesting level
        for (const part of parts) {
          if (value === undefined || value === null) break;
          value = value[part];
        }
        
        if (value !== undefined) {
          setState(key, value);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error loading state from storage:', error);
    return false;
  }
}

/**
 * Enables debug mode for state changes
 * @param {boolean} enabled - Whether debug mode is enabled
 */
export function setStateDebug(enabled) {
  const debug = !!enabled;
  
  if (debug) {
    // Subscribe to all state changes and log them
    subscribe(null, (newValue, oldValue, key) => {
      console.group(`State Change: ${key}`);
      console.log('Previous:', oldValue);
      console.log('Current:', newValue);
      console.trace('Stack trace');
      console.groupEnd();
    });
  } else {
    // We'd need to store the subscription ID to remove it
    // For simplicity, we're not implementing this here
  }
  
  setState('settings.debug', debug);
}
```

## Using State in Modules

Here are examples of how to use the state management system in various modules:

### In i18n.js

```javascript
import { getState, setState, subscribe } from './state.js';

// Get the current language
export function getLanguage() {
  return getState('settings.language') || 'de';
}

// Set the language and update DOM
export function setLanguage(langCode) {
  if (langCode !== 'de' && langCode !== 'en') {
    return false;
  }
  
  setState('settings.language', langCode);
  updateDomTextContent();
  return true;
}

// Subscribe to language changes
subscribe('settings.language', (newLang) => {
  // Update all text content when language changes
  updateDomTextContent();
});
```

### In charts.js

```javascript
import { getState, setState, subscribe } from './state.js';

// Chart instances
let chartInstances = {};

// Initialize charts
export function initializeCharts() {
  // Store chart instances in state for reference
  setState('charts.instances', chartInstances);
  
  // Listen for data changes to update charts
  subscribe('data.allPlayersData', (newData) => {
    updateAllCharts(newData);
  });
}

export function createTopSourcesChart(containerId, data) {
  // Create chart...
  
  // Store instance reference
  chartInstances.topSources = chart;
  setState('charts.instances', chartInstances);
  
  return chart;
}
```

### In listeners.js

```javascript
import { getState, setState, subscribe } from './state.js';

// Setup listeners
export function setupNavigationListeners() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.dataset.view;
      
      // Update state instead of directly changing UI
      setState('ui.currentView', viewName);
    });
  });
}

// State-driven approach to UI updates
subscribe('ui.currentView', (newView) => {
  // Handle view change here or let uiUpdates handle it
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === newView);
  });
});
```

## Benefits of This Approach

1. **Centralized Logic**: All state management logic is in one place
2. **Decoupled Components**: Modules communicate through state, not direct references
3. **Predictable Updates**: All state changes go through a controlled interface
4. **Easy Debugging**: State changes can be logged and monitored
5. **Persistence**: State can be easily saved and loaded
6. **Testability**: State operations can be tested in isolation

## Implementation Plan

1. Create the state.js module with the pub/sub implementation
2. Identify key state variables from the existing script.js
3. Create a logical structure for the state object
4. Migrate state access to the new pattern gradually
5. Update event handlers to use setState instead of direct manipulation
6. Add state subscriptions for reactive UI updates
7. Implement localStorage integration for persistent state

## Debugging State

During development, you can enable state debugging with:

```javascript
import { setStateDebug } from './state.js';

// Enable debug mode
setStateDebug(true);
```

This will log all state changes to the console with stack traces, making it easier to track down issues. 