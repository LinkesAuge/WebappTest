/**
 * Test script to check weeks loading functionality
 * Run with: node tests/test-load-weeks.js
 */

// Mock window and document objects for testing
global.window = {
  currentWeek: {}
};

global.document = {
  getElementById: () => {
    return {
      innerHTML: '',
      options: [],
      value: '',
      disabled: false,
      appendChild: () => {},
      dispatchEvent: () => {}
    };
  },
  createElement: () => {
    return {
      textContent: '',
      value: '',
      disabled: false,
      selected: false
    };
  },
  dispatchEvent: () => {}
};

// Mock fetch API
global.fetch = async (url) => {
  console.log(`Fetching: ${url}`);
  
  // For weeks.json
  if (url.includes('weeks.json')) {
    const mockData = [
      { week: '12', file: 'data_week_12.csv' },
      { week: '13', file: 'data_week_13.csv' },
      { week: '14', file: 'data_week_14.csv' },
      { week: '15', file: 'data_week_15.csv' }
    ];
    
    return {
      ok: true,
      text: async () => JSON.stringify(mockData),
      json: async () => mockData
    };
  }
  
  // For week data files
  if (url.includes('data_week_')) {
    const mockPlayerData = [
      { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 5 },
      { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 10 }
    ];
    
    return {
      ok: true,
      text: async () => JSON.stringify(mockPlayerData)
    };
  }
  
  // Default response for unknown URLs
  return {
    ok: false,
    status: 404,
    statusText: 'Not Found'
  };
};

// Mock console methods for better output
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

console.log = (...args) => {
  originalLog('\x1b[32m[LOG]\x1b[0m', ...args);
};

console.warn = (...args) => {
  originalWarn('\x1b[33m[WARN]\x1b[0m', ...args);
};

console.error = (...args) => {
  originalError('\x1b[31m[ERROR]\x1b[0m', ...args);
};

// Mock other required functions
global.showLoading = () => {};
global.hideLoading = () => {};
global.showError = () => {};
global.getText = (key) => key;

// Import necessary modules
const fs = require('fs');
const path = require('path');

// Dynamically import ES modules
async function runTest() {
  try {
    console.log('Starting weeks loading test...');
    
    // Create a custom loader for ES modules
    const { loadWeeks, loadWeekData } = await import('../js/dataLoading.js');
    const { initializeWeeklyData } = await import('../js/historyNew.js');
    
    // Test loading available weeks
    console.log('Testing loadAvailableWeeks() function...');
    const weeksLoaded = await loadWeeks();
    
    if (weeksLoaded) {
      console.log('Weeks loaded successfully');
    } else {
      console.error('Failed to load weeks');
    }
    
    // Test initializing weekly data
    console.log('Testing initializeWeeklyData() function...');
    const initialized = await initializeWeeklyData();
    
    if (initialized) {
      console.log('Weekly data initialized successfully');
    } else {
      console.error('Failed to initialize weekly data');
    }
    
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

runTest().catch(console.error); 