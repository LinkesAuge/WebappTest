/**
 * Jest Setup
 * 
 * This file is run before each test file to set up the environment.
 */

// Import jest-dom additions
import '@testing-library/jest-dom';

// Set up proper mock for localStorage
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

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    return Object.keys(this.store)[index] || null;
  }
}

// Add spies for localStorage methods
const localStorageMock = new LocalStorageMock();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Create spies for tracking localStorage calls
jest.spyOn(localStorageMock, 'getItem');
jest.spyOn(localStorageMock, 'setItem');
jest.spyOn(localStorageMock, 'removeItem');
jest.spyOn(localStorageMock, 'clear');

// Mock for document.title
Object.defineProperty(document, 'title', {
  writable: true,
  value: 'Chef Score Analytics'
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
  getDatasetMeta: jest.fn(() => ({ hidden: null })),
  config: {
    type: 'pie',
    data: {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [{
        data: [10, 20, 30],
        label: 'Test Dataset'
      }]
    },
    options: {}
  }
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
  document.title = 'Chef Score Analytics';
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
// Mock Canvas getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  canvas: document.createElement('canvas'),
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn()
}));
