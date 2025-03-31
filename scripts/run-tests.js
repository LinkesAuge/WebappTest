#!/usr/bin/env node

/**
 * Test Runner Script for ChefScore Analytics Dashboard
 * 
 * This script automates running tests with proper configuration and setup.
 * It can run specific test types or all tests at once.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  jestConfigPath: path.join(__dirname, '..', 'jest.config.js'),
  setupPath: path.join(__dirname, '..', 'tests', 'helpers', 'setup.js'),
  skipCanvasScript: path.join(__dirname, 'skip-canvas-tests.js')
};

/**
 * Verify Jest is installed and accessible
 */
function verifyJestInstallation() {
  console.log('Verifying Jest installation...\n');
  try {
    execSync('npx jest --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('\nJest is not installed or not accessible.');
    console.error('Run "npm install" to install required dependencies.\n');
    return false;
  }
}

/**
 * Ensure configuration files exist
 */
function ensureConfigFiles() {
  // Check if Jest config exists
  if (!fs.existsSync(CONFIG.jestConfigPath)) {
    console.error(`Jest configuration file not found at: ${CONFIG.jestConfigPath}`);
    return false;
  }
  
  // Check if setup file exists
  if (!fs.existsSync(CONFIG.setupPath)) {
    console.error(`Jest setup file not found at: ${CONFIG.setupPath}`);
    return false;
  }
  
  return true;
}

/**
 * Prepare canvas mocking for chart tests
 */
function prepareCanvasTests() {
  console.log('Preparing canvas mock for chart tests...');
  try {
    execSync(`node ${CONFIG.skipCanvasScript}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Failed to prepare canvas tests:', error.message);
    return false;
  }
}

/**
 * Run the specified tests
 * @param {string} testType - Type of tests to run (unit, integration, e2e, or all)
 * @param {string} [testPath] - Optional specific test path to run
 */
function runTests(testType, testPath) {
  const testTypes = {
    unit: 'tests/unit',
    integration: 'tests/integration',
    e2e: 'tests/e2e',
    all: 'tests'
  };
  
  // Determine test path based on type
  const testDir = testPath || testTypes[testType] || 'tests';
  
  console.log('\n=========================');
  console.log(`    Running ${testType.toUpperCase()} Tests    `);
  console.log('=========================\n');
  
  const command = `npx jest --colors --config=${CONFIG.jestConfigPath} ${testDir}`;
  console.log(`Executing: ${command}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error running tests: ${error.message}`);
    return false;
  }
}

/**
 * Main function to run the test suite
 */
function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';
  const testPath = args[1] || null;
  
  // Validate test type
  if (!['unit', 'integration', 'e2e', 'all'].includes(testType)) {
    console.error(`Invalid test type: ${testType}`);
    console.error('Valid types: unit, integration, e2e, all');
    process.exit(1);
  }
  
  // Run verification steps
  if (!verifyJestInstallation()) {
    process.exit(1);
  }
  
  if (!ensureConfigFiles()) {
    process.exit(1);
  }
  
  // Prepare canvas tests (for chart tests)
  prepareCanvasTests();
  
  // Run the appropriate tests
  const success = runTests(testType, testPath);
  process.exit(success ? 0 : 1);
}

// Execute the main function
main(); 