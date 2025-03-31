/**
 * Jest Setup
 * 
 * This file is run before each test file to set up the environment.
 */

// Import jest-dom additions
import '@testing-library/jest-dom';

// Set up mock for localStorage
const localStorageMock = (() => {
  let store = {};
  
  return {
    getItem: jest.fn((key) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn((index) => null)
  };
})();

// Add localStorage to global
global.localStorage = localStorageMock;

// Mock for document.title
Object.defineProperty(document, 'title', {
  writable: true,
  value: ''
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('mock data'),
    ok: true,
    status: 200,
    headers: new Map([['last-modified', new Date().toUTCString()]])
  })
);

// Set up global Chart mock (for chart.js)
global.Chart = jest.fn().mockImplementation(() => ({
  update: jest.fn(),
  destroy: jest.fn(),
  getDatasetMeta: jest.fn(() => ({ hidden: null }))
}));

// Mock matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  document.body.innerHTML = '';
  document.title = '';
});

// Mock window.alert
global.alert = jest.fn();

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