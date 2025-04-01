/**
 * watch_data_directory.js
 * 
 * Description: Script to watch the data directory for new CSV files and automatically
 * update weeks.json when changes are detected
 * 
 * Usage:
 *    node scripts/watch_data_directory.js
 *    
 * Run this as a background service on your server using pm2 or similar
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar'); // You'll need to install this: npm install chokidar

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data');
const UPDATE_SCRIPT_PATH = path.join(__dirname, 'update_weeks_json.js');
const FILE_PATTERN = /^data_week_\d+\.csv$/;

// Initialize watcher
console.log(`Starting file watcher for ${DATA_DIR}`);
console.log(`Will run ${UPDATE_SCRIPT_PATH} when new CSV files are detected`);

// Create a debounced function to avoid multiple rapid executions
let timeoutId = null;
function runUpdateScript() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  
  timeoutId = setTimeout(() => {
    console.log(`Change detected at ${new Date().toISOString()}`);
    console.log('Running update_weeks_json.js...');
    
    const updateProcess = spawn('node', [UPDATE_SCRIPT_PATH]);
    
    updateProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    updateProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    updateProcess.on('close', (code) => {
      console.log(`update_weeks_json.js process exited with code ${code}`);
    });
    
    timeoutId = null;
  }, 2000); // Wait 2 seconds after the last change to run the script
}

// Setup file watcher
const watcher = chokidar.watch(`${DATA_DIR}/**/*.csv`, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000, // Wait for file size to remain stable for 2 seconds
    pollInterval: 100
  }
});

// Watch for new files, changes, or deletions
watcher
  .on('add', path => {
    if (FILE_PATTERN.test(path.split('/').pop() || path.split('\\').pop())) {
      console.log(`New weekly data file detected: ${path}`);
      runUpdateScript();
    }
  })
  .on('change', path => {
    if (FILE_PATTERN.test(path.split('/').pop() || path.split('\\').pop())) {
      console.log(`Weekly data file changed: ${path}`);
      runUpdateScript();
    }
  })
  .on('unlink', path => {
    if (FILE_PATTERN.test(path.split('/').pop() || path.split('\\').pop())) {
      console.log(`Weekly data file removed: ${path}`);
      runUpdateScript();
    }
  })
  .on('error', error => console.error(`Watcher error: ${error}`));

console.log('File watcher started. Press Ctrl+C to stop.'); 