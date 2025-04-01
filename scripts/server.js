/**
 * server.js
 * 
 * Description: Simple Node.js server that:
 * 1. Serves the web application
 * 2. Watches for new data files and updates weeks.json automatically
 * 3. Provides an API endpoint for manual updates
 * 
 * Usage:
 *    node scripts/server.js
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

// Configuration
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, '..', 'data');
const UPDATE_SCRIPT_PATH = path.join(__dirname, 'update_weeks_json.js');
const FILE_PATTERN = /^data_week_\d+\.csv$/;

// Create Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// API endpoint for manual updates
app.get('/api/update-weeks', (req, res) => {
  console.log('Manual update requested via API');
  
  const updateProcess = spawn('node', [UPDATE_SCRIPT_PATH]);
  let output = '';
  let errorOutput = '';
  
  updateProcess.stdout.on('data', (data) => {
    output += data.toString();
    console.log(`stdout: ${data}`);
  });
  
  updateProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
    console.error(`stderr: ${data}`);
  });
  
  updateProcess.on('close', (code) => {
    console.log(`update_weeks_json.js process exited with code ${code}`);
    if (code === 0) {
      res.json({ 
        success: true, 
        message: 'weeks.json updated successfully', 
        details: output 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error updating weeks.json', 
        details: errorOutput 
      });
    }
  });
});

// Create a debounced function for the update script
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
  }, 2000); // Wait 2 seconds after the last change
}

// Setup file watcher
console.log(`Starting file watcher for ${DATA_DIR}`);
const watcher = chokidar.watch(`${DATA_DIR}/**/*.csv`, {
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000, // Wait for file size to remain stable
    pollInterval: 100
  }
});

// Watch for new files, changes, or deletions
watcher
  .on('add', filePath => {
    const filename = path.basename(filePath);
    if (FILE_PATTERN.test(filename)) {
      console.log(`New weekly data file detected: ${filename}`);
      runUpdateScript();
    }
  })
  .on('change', filePath => {
    const filename = path.basename(filePath);
    if (FILE_PATTERN.test(filename)) {
      console.log(`Weekly data file changed: ${filename}`);
      runUpdateScript();
    }
  })
  .on('unlink', filePath => {
    const filename = path.basename(filePath);
    if (FILE_PATTERN.test(filename)) {
      console.log(`Weekly data file removed: ${filename}`);
      runUpdateScript();
    }
  })
  .on('error', error => console.error(`Watcher error: ${error}`));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`File watcher active for ${DATA_DIR}`);
  console.log('Press Ctrl+C to stop the server');
}); 