#!/usr/bin/env node

/**
 * ci.js
 * 
 * Description: Continuous Integration script for the ChefScore Analytics Dashboard
 * Usage: node scripts/ci.js
 * 
 * This script:
 * 1. Verifies the codebase formatting
 * 2. Runs all tests (unit, integration, e2e)
 * 3. Generates code coverage reports
 * 4. Performs basic HTML validation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Configure thresholds
const COVERAGE_THRESHOLD = 95; // 95% minimum coverage

// Store results to display at the end
const results = {
  linting: { passed: false, message: '' },
  tests: { passed: false, message: '' },
  coverage: { passed: false, message: '' },
  htmlValidation: { passed: false, message: '' },
};

// Helper functions
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, options = {}) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || error.message,
      error 
    };
  }
}

function printSection(title) {
  const separator = '='.repeat(title.length + 10);
  console.log('\n');
  log(separator, colors.blue);
  log(`     ${title}     `, colors.blue + colors.bright);
  log(separator, colors.blue);
  console.log('');
}

function printSummary() {
  printSection('CI Results Summary');
  
  // Create a table of results
  const table = [
    ['Task', 'Status', 'Details'],
    ['-----', '------', '-------'],
    ['Linting', results.linting.passed ? '✅ PASS' : '❌ FAIL', results.linting.message],
    ['Tests', results.tests.passed ? '✅ PASS' : '❌ FAIL', results.tests.message],
    ['Coverage', results.coverage.passed ? '✅ PASS' : '❌ FAIL', results.coverage.message],
    ['HTML Validation', results.htmlValidation.passed ? '✅ PASS' : '❌ FAIL', results.htmlValidation.message]
  ];
  
  // Find the maximum width for each column
  const colWidths = [0, 0, 0];
  for (const row of table) {
    for (let i = 0; i < row.length; i++) {
      colWidths[i] = Math.max(colWidths[i], row[i].length);
    }
  }
  
  // Print the table
  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    let line = '';
    
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      const padding = ' '.repeat(colWidths[j] - cell.length + 2);
      
      // Apply colors conditionally
      let cellText = cell;
      if (j === 1 && cell.includes('PASS')) {
        cellText = colors.green + cell + colors.reset;
      } else if (j === 1 && cell.includes('FAIL')) {
        cellText = colors.red + cell + colors.reset;
      } else if (i <= 1) { // Headers
        cellText = colors.cyan + cell + colors.reset;
      }
      
      line += cellText + padding;
    }
    
    console.log(line);
  }
  
  // Final result
  const allPassed = Object.values(results).every(result => result.passed);
  console.log('\n');
  if (allPassed) {
    log('✅ CI PASSED: All checks completed successfully!', colors.green + colors.bright);
  } else {
    log('❌ CI FAILED: Some checks did not pass. See details above.', colors.red + colors.bright);
    process.exit(1);
  }
}

// Main functions
async function runLinting() {
  printSection('Running Linter');
  
  // Create an ESLint config if it doesn't exist
  const eslintConfigPath = path.join(process.cwd(), '.eslintrc.js');
  if (!fs.existsSync(eslintConfigPath)) {
    log('ESLint config not found. Creating a basic configuration...', colors.yellow);
    const eslintConfig = `module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
};`;
    fs.writeFileSync(eslintConfigPath, eslintConfig);
  }
  
  // Check if eslint is installed, if not, install it
  const installResult = runCommand('npm list eslint', { silent: true });
  if (!installResult.success || installResult.output.includes('(empty)')) {
    log('Installing ESLint...', colors.yellow);
    const npmInstall = runCommand('npm install --save-dev eslint', { silent: true });
    if (!npmInstall.success) {
      results.linting = { 
        passed: false, 
        message: 'Failed to install ESLint' 
      };
      return;
    }
  }
  
  // Run ESLint
  log('Running ESLint...', colors.dim);
  const lintCommand = 'npx eslint . --ext .js --ignore-pattern "node_modules/" --ignore-pattern "coverage/"';
  const lintResult = runCommand(lintCommand, { silent: true });
  
  if (lintResult.success) {
    log('Linting passed!', colors.green);
    results.linting = { 
      passed: true, 
      message: 'No linting errors found' 
    };
  } else {
    log('Linting failed with the following issues:', colors.red);
    console.log(lintResult.output);
    results.linting = { 
      passed: false, 
      message: 'Linting errors found' 
    };
  }
}

async function runTests() {
  printSection('Running Tests');
  
  // Run all tests
  log('Running all tests...', colors.dim);
  const testCommand = 'node scripts/run-tests.js --all';
  const testResult = runCommand(testCommand);
  
  if (testResult.success) {
    log('All tests passed!', colors.green);
    results.tests = { 
      passed: true, 
      message: 'All tests passed successfully' 
    };
  } else {
    results.tests = { 
      passed: false, 
      message: 'Some tests failed' 
    };
  }
}

async function generateCoverage() {
  printSection('Checking Code Coverage');
  
  // Run tests with coverage
  log('Generating coverage report...', colors.dim);
  const coverageCommand = 'npx jest --coverage';
  const coverageResult = runCommand(coverageCommand, { silent: true });
  
  if (!coverageResult.success) {
    results.coverage = { 
      passed: false, 
      message: 'Failed to generate coverage report' 
    };
    return;
  }
  
  // Parse coverage results
  try {
    const coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (!fs.existsSync(coverageSummaryPath)) {
      results.coverage = { 
        passed: false, 
        message: 'Coverage report not generated' 
      };
      return;
    }
    
    const coverageSummary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const totalCoverage = coverageSummary.total.statements.pct;
    
    if (totalCoverage >= COVERAGE_THRESHOLD) {
      log(`Coverage: ${totalCoverage}% (threshold: ${COVERAGE_THRESHOLD}%)`, colors.green);
      results.coverage = { 
        passed: true, 
        message: `${totalCoverage}% coverage (threshold: ${COVERAGE_THRESHOLD}%)` 
      };
    } else {
      log(`Coverage too low: ${totalCoverage}% (threshold: ${COVERAGE_THRESHOLD}%)`, colors.red);
      log('Please add more tests to improve coverage.', colors.yellow);
      results.coverage = { 
        passed: false, 
        message: `${totalCoverage}% coverage (below threshold: ${COVERAGE_THRESHOLD}%)` 
      };
    }
  } catch (error) {
    log(`Error parsing coverage report: ${error.message}`, colors.red);
    results.coverage = { 
      passed: false, 
      message: 'Error parsing coverage report' 
    };
  }
}

async function validateHtml() {
  printSection('HTML Validation');
  
  const htmlFiles = [];
  const indexHtmlPath = path.join(process.cwd(), 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    htmlFiles.push(indexHtmlPath);
  }
  
  if (htmlFiles.length === 0) {
    results.htmlValidation = { 
      passed: true, 
      message: 'No HTML files to validate' 
    };
    return;
  }
  
  // Basic HTML validation (could be improved with a proper validator)
  let allValid = true;
  const issues = [];
  
  for (const htmlFile of htmlFiles) {
    log(`Validating ${path.basename(htmlFile)}...`, colors.dim);
    try {
      const content = fs.readFileSync(htmlFile, 'utf8');
      
      // Check for common issues
      const validation = {
        hasDocType: content.toLowerCase().includes('<!doctype html>'),
        hasHtmlTag: /<html[^>]*>/.test(content),
        hasHeadTag: /<head[^>]*>/.test(content),
        hasBodyTag: /<body[^>]*>/.test(content),
        hasTitleTag: /<title[^>]*>.+<\/title>/.test(content),
        hasUnclosedTags: /<([a-z]+)[^>]*>[^<]*$/.test(content)
      };
      
      if (!validation.hasDocType) {
        issues.push(`${path.basename(htmlFile)}: Missing <!DOCTYPE html>`);
        allValid = false;
      }
      
      if (!validation.hasHtmlTag) {
        issues.push(`${path.basename(htmlFile)}: Missing <html> tag`);
        allValid = false;
      }
      
      if (!validation.hasHeadTag) {
        issues.push(`${path.basename(htmlFile)}: Missing <head> tag`);
        allValid = false;
      }
      
      if (!validation.hasBodyTag) {
        issues.push(`${path.basename(htmlFile)}: Missing <body> tag`);
        allValid = false;
      }
      
      if (!validation.hasTitleTag) {
        issues.push(`${path.basename(htmlFile)}: Missing <title> tag`);
        allValid = false;
      }
      
      if (validation.hasUnclosedTags) {
        issues.push(`${path.basename(htmlFile)}: Detected potentially unclosed tags`);
        allValid = false;
      }
    } catch (error) {
      issues.push(`${path.basename(htmlFile)}: ${error.message}`);
      allValid = false;
    }
  }
  
  if (allValid) {
    log('HTML validation passed!', colors.green);
    results.htmlValidation = { 
      passed: true, 
      message: 'All HTML files are valid' 
    };
  } else {
    log('HTML validation failed with the following issues:', colors.red);
    issues.forEach(issue => log(`- ${issue}`, colors.red));
    results.htmlValidation = { 
      passed: false, 
      message: `${issues.length} validation issues found` 
    };
  }
}

// Main execution
async function main() {
  log('🚀 Starting CI process for ChefScore Analytics Dashboard', colors.bright);
  
  try {
    // Run checks in sequence
    await runLinting();
    await runTests();
    await generateCoverage();
    await validateHtml();
    
    // Print summary
    printSummary();
    
  } catch (error) {
    log(`CI process failed with error: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// Run the main function
main(); 