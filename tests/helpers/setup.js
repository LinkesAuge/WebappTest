/**
 * Jest Setup
 * 
 * This file is run before each test file to set up the environment.
 */

// Jest setup file
const { TextEncoder, TextDecoder } = require('util');

// Fix for TextEncoder/TextDecoder 
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Global mocks
global.localStorage = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Function mocks
global.parseCsvData = jest.fn(() => ({
  data: [],
  meta: { fields: [] },
  errors: []
}));

global.processPlayerData = jest.fn(() => []);

global.calculateStats = jest.fn(() => ({
  playerCount: 0,
  averageScore: 0,
  topSources: []
}));

// i18n function mocks
global.getLanguagePreference = jest.fn(() => 'en');
global.setLanguage = jest.fn();
global.getText = jest.fn(key => key);
global.updateUIText = jest.fn();

// Chart rendering function mocks
global.renderTopSourcesChart = jest.fn(() => ({}));
global.renderScoreDistributionChart = jest.fn(() => ({}));
global.renderScoreVsChestsChart = jest.fn(() => ({}));
global.renderPlayerChart = jest.fn(() => ({}));

// Canvas context mock
global.mockContext = {
  canvas: {}, // Simplified mock
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
};

// Mock for Chart.js
jest.mock('chart.js', () => ({
  Chart: class {
    constructor() {
      return {
        destroy: jest.fn(),
        update: jest.fn()
      };
    }
  }
}));

// Global mocks and setup
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
);

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

// Add custom jest matchers
require('@testing-library/jest-dom');

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
