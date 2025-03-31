#!/usr/bin/env node

/**
 * run-tests.js
 * 
 * Description: A utility script to run tests for the ChefScore Analytics Dashboard
 * Usage: 
 *   node scripts/run-tests.js [options]
 *   
 * Options:
 *   --unit             Run only unit tests
 *   --integration      Run only integration tests
 *   --e2e              Run only end-to-end tests
 *   --all              Run all tests (default)
 *   --coverage         Generate coverage report
 *   --watch            Run tests in watch mode
 *   --verbose          Show detailed test output
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Print a formatted message to the console
 */
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Print a header with the test type being run
 */
function printHeader(text) {
  const line = '='.repeat(text.length + 8);
  console.log('\n');
  log(line, colors.cyan);
  log(`    ${text}    `, colors.cyan + colors.bright);
  log(line, colors.cyan);
  console.log('\n');
}

/**
 * Verify that Jest is installed properly
 */
function verifyJestInstallation() {
  try {
    log('Verifying Jest installation...', colors.dim);
    execSync('npx jest --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    log('Jest not found. Installing dependencies...', colors.yellow);
    try {
      execSync('npm install --save-dev jest @testing-library/jest-dom', { stdio: 'inherit' });
      return true;
    } catch (installError) {
      log('Failed to install Jest. Please run: npm install --save-dev jest @testing-library/jest-dom', colors.red);
      return false;
    }
  }
}

/**
 * Ensure that the Jest configuration exists
 */
function ensureJestConfig() {
  const jestConfigPath = path.join(process.cwd(), 'jest.config.js');
  
  if (!fs.existsSync(jestConfigPath)) {
    log('Creating Jest configuration file...', colors.yellow);
    
    const configContent = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.js'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'js/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true
};`;
    
    fs.writeFileSync(jestConfigPath, configContent);
    log('Jest configuration created.', colors.green);
  }
  
  const setupPath = path.join(process.cwd(), 'tests', 'helpers', 'setup.js');
  if (!fs.existsSync(setupPath)) {
    log('Creating Jest setup file...', colors.yellow);
    
    // Create directory if it doesn't exist
    const setupDir = path.dirname(setupPath);
    if (!fs.existsSync(setupDir)) {
      fs.mkdirSync(setupDir, { recursive: true });
    }
    
    const setupContent = `// Jest setup file
const { JSDOM } = require('jsdom');

// Set up a DOM environment for tests that need it
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
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

// Add custom jest matchers
require('@testing-library/jest-dom');
`;
    
    fs.writeFileSync(setupPath, setupContent);
    log('Jest setup file created.', colors.green);
  }
}

/**
 * Run the specified tests with Jest
 */
function runTests(options) {
  const testTypes = {
    unit: options.unit,
    integration: options.integration,
    e2e: options.e2e,
    all: options.all || (!options.unit && !options.integration && !options.e2e)
  };
  
  const jestArgs = [];
  
  // Configure test pattern based on options
  if (testTypes.all) {
    printHeader('Running All Tests');
  } else {
    const patterns = [];
    if (testTypes.unit) {
      printHeader('Running Unit Tests');
      patterns.push('tests/unit');
    }
    if (testTypes.integration) {
      printHeader('Running Integration Tests');
      patterns.push('tests/integration');
    }
    if (testTypes.e2e) {
      printHeader('Running End-to-End Tests');
      patterns.push('tests/e2e');
    }
    
    if (patterns.length > 0) {
      jestArgs.push(patterns.join('|'));
    }
  }
  
  // Add coverage if requested
  if (options.coverage) {
    jestArgs.push('--coverage');
  }
  
  // Add watch mode if requested
  if (options.watch) {
    jestArgs.push('--watch');
  }
  
  // Add verbose mode if requested
  if (options.verbose) {
    jestArgs.push('--verbose');
  } else {
    // Make the output prettier by default
    jestArgs.push('--colors');
  }
  
  // Build the command
  const command = `npx jest ${jestArgs.join(' ')}`;
  
  try {
    log(`Executing: ${command}`, colors.dim);
    console.log('\n');
    execSync(command, { stdio: 'inherit' });
    
    log('\nTests completed successfully! 🎉', colors.green + colors.bright);
    return true;
  } catch (error) {
    log('\nSome tests failed. Please check the output above for details.', colors.red);
    return false;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    unit: args.includes('--unit'),
    integration: args.includes('--integration'),
    e2e: args.includes('--e2e'),
    all: args.includes('--all'),
    coverage: args.includes('--coverage'),
    watch: args.includes('--watch'),
    verbose: args.includes('--verbose')
  };
}

/**
 * Display script usage information
 */
function printUsage() {
  log('\nChefScore Analytics Dashboard Test Runner', colors.bright);
  log('\nUsage:', colors.yellow);
  log('  node scripts/run-tests.js [options]');
  
  log('\nOptions:', colors.yellow);
  log('  --unit             Run only unit tests');
  log('  --integration      Run only integration tests');
  log('  --e2e              Run only end-to-end tests');
  log('  --all              Run all tests (default)');
  log('  --coverage         Generate coverage report');
  log('  --watch            Run tests in watch mode');
  log('  --verbose          Show detailed test output');
  
  log('\nExamples:', colors.yellow);
  log('  node scripts/run-tests.js --unit                  # Run only unit tests');
  log('  node scripts/run-tests.js --coverage              # Run all tests with coverage');
  log('  node scripts/run-tests.js --unit --integration    # Run unit and integration tests');
  console.log('\n');
}

/**
 * Main function to run the script
 */
function main() {
  const options = parseArgs();
  
  // Show usage if --help or -h is provided
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage();
    return;
  }
  
  // Verify Jest installation
  if (!verifyJestInstallation()) {
    return;
  }
  
  // Ensure Jest configuration exists
  ensureJestConfig();
  
  // Run the tests
  runTests(options);
}

// Execute the main function
main(); 