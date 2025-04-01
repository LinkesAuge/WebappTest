/**
 * Test script to check syntax of history.js
 * Run with: node tests/test-history-syntax.js
 */

// Try to load the history module
try {
  const history = require('../js/history.js');
  console.log('History module loaded successfully. No syntax errors detected.');
  
  // Check if the initializeWeeklyData function exists
  if (typeof history.initializeWeeklyData === 'function') {
    console.log('initializeWeeklyData function exists.');
  } else {
    console.error('initializeWeeklyData function does not exist in the module.');
  }
} catch (error) {
  console.error('Error loading history module. Syntax error detected:');
  console.error(error);
  
  // Extract the syntax error location from the error message
  const match = error.message.match(/in (.+\.js):(\d+):(\d+)/);
  if (match) {
    const [, file, line, column] = match;
    console.error(`Error at ${file} line ${line} column ${column}`);
  }
} 