/**
 * Jest setup file for ChefScore Analytics Dashboard
 * 
 * This file is run before each test and sets up the testing environment
 */

// Import Jest DOM utilities to enhance the DOM testing capabilities
import '@testing-library/jest-dom';

// Create a mock for localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Set up local storage mock
global.localStorage = new LocalStorageMock();

// Mock window.alert
global.alert = jest.fn();

// Mock window.matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Mock chart.js
jest.mock('chart.js', () => {
  return {
    Chart: jest.fn().mockImplementation(() => ({
      update: jest.fn(),
      destroy: jest.fn(),
    })),
    registerables: [],
    register: jest.fn(),
  };
});

// Mock console methods for testing logs
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Set up a mock DOM environment
document.body.innerHTML = `
<div id="app">
  <div id="dashboard" class="view active-view"></div>
  <div id="player-detail" class="view"></div>
  <div id="charts" class="view"></div>
  <div id="analytics" class="view"></div>
</div>
`;

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
); 