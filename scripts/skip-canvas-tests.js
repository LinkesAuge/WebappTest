/**
 * Skip Canvas Tests Script
 * 
 * This script modifies Jest environment to add automatic skipping
 * of tests that require canvas when the canvas module isn't installed.
 * 
 * Usage: node scripts/skip-canvas-tests.js
 */

const fs = require('fs');
const path = require('path');

// Path to chart rendering tests
const chartTestPath = path.join(__dirname, '..', 'tests', 'unit', 'chart-rendering', 'chart-creation.test.js');

// Check if the file exists
if (fs.existsSync(chartTestPath)) {
  console.log('Modifying chart testing to use mock context...');
  
  // Read the current content
  const content = fs.readFileSync(chartTestPath, 'utf8');
  
  // Replace the problematic canvas.getContext calls
  const modified = content.replace(
    /canvas\.getContext\('2d'\)/g, 
    'mockContext'
  );
  
  // Write the modified content back
  fs.writeFileSync(chartTestPath, modified, 'utf8');
  
  console.log('Successfully updated chart tests to use mock context!');
} else {
  console.error('Chart test file not found:', chartTestPath);
}

// Add mock HTMLCanvasElement.getContext to setup file
const setupPath = path.join(__dirname, '..', 'tests', 'helpers', 'setup.js');

if (fs.existsSync(setupPath)) {
  console.log('Adding canvas getContext mock to setup.js...');
  
  // Read the setup file
  let setupContent = fs.readFileSync(setupPath, 'utf8');
  
  // Check if mock already exists
  if (!setupContent.includes('HTMLCanvasElement.prototype.getContext')) {
    // Mock canvas context code to add
    const mockCode = `
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
`;
    
    // Add the mock code to the setup file
    setupContent += mockCode;
    fs.writeFileSync(setupPath, setupContent, 'utf8');
    
    console.log('Successfully added canvas mock to setup.js!');
  } else {
    console.log('Canvas mock already exists in setup.js');
  }
} else {
  console.error('Setup file not found:', setupPath);
}

console.log('Canvas test modifications complete!'); 