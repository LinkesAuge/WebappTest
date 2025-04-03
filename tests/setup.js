/**
 * Test setup file
 * 
 * This file runs before each test file and sets up the test environment.
 */

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window.URL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock console methods
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  document.body.innerHTML = '';
});

// Add custom matchers if needed
expect.extend({
  // Example custom matcher
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

/**
 * Jest Setup File
 * This file runs before all tests to set up the testing environment
 */

// Add TextEncoder and TextDecoder to global scope for jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Create a basic DOM implementation first
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});

// Assign DOM globals to the Node.js global scope
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.NodeList = dom.window.NodeList;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.getComputedStyle = dom.window.getComputedStyle;

// Create a proper localStorage mock
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(index => null)
  };
})();

// Set localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      get: jest.fn().mockReturnValue('Thu, 01 Jan 2023 00:00:00 GMT')
    },
    text: () => Promise.resolve('PLAYER,TOTAL_SCORE,CHEST_COUNT\nPlayer1,100,10')
  })
);

// Mock PapaParse (CSV parsing library)
global.Papa = {
  parse: jest.fn((csv, options) => {
    // Default mock implementation for Papa.parse
    if (options && typeof options.complete === 'function') {
      options.complete({
        data: [
          { PLAYER: 'Player1', TOTAL_SCORE: '100', CHEST_COUNT: '10' },
          { PLAYER: 'Player2', TOTAL_SCORE: '200', CHEST_COUNT: '20' }
        ],
        errors: [],
        meta: {
          fields: ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT']
        }
      });
    }
    return null;
  })
};

// Mock ApexCharts
class MockApexCharts {
  constructor(element, options) {
    this.element = element;
    this.options = options;
  }
  
  render() {
    return Promise.resolve();
  }
  
  updateOptions() {
    return Promise.resolve();
  }
  
  updateSeries() {
    return Promise.resolve();
  }
  
  destroy() {
    return Promise.resolve();
  }
}

global.ApexCharts = jest.fn().mockImplementation((element, options) => {
  return new MockApexCharts(element, options);
});

// Mock window.alert
global.alert = jest.fn();

// Mock console methods to reduce test noise
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  
  // Reset localStorage mock storage
  localStorageMock.clear();
});

// Restore console methods after all tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
});

console.log('Jest setup complete with enhanced DOM mocking'); 