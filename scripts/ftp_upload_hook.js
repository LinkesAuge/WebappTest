/**
 * ftp_upload_hook.js
 * 
 * Description: Script to be used as an FTP upload hook
 * This can be configured with FTP servers that support post-upload scripts
 * 
 * Usage:
 *    node ftp_upload_hook.js /path/to/uploaded/file
 */

const path = require('path');
const { spawn } = require('child_process');

// Configuration
const UPDATE_SCRIPT_PATH = path.join(__dirname, 'update_weeks_json.js');
const FILE_PATTERN = /^data_week_\d+\.csv$/;

// Get the uploaded file path from command line arguments
const uploadedFilePath = process.argv[2];

if (!uploadedFilePath) {
  console.error('Error: No file path provided');
  console.error('Usage: node ftp_upload_hook.js /path/to/uploaded/file');
  process.exit(1);
}

// Extract the filename from the path
const filename = path.basename(uploadedFilePath);

// Check if the uploaded file matches our pattern
if (FILE_PATTERN.test(filename)) {
  console.log(`Detected new weekly data file: ${filename}`);
  console.log('Running update_weeks_json.js...');
  
  // Run the update script
  const updateProcess = spawn('node', [UPDATE_SCRIPT_PATH]);
  
  updateProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  updateProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  updateProcess.on('close', (code) => {
    console.log(`update_weeks_json.js process exited with code ${code}`);
    process.exit(code);
  });
} else {
  console.log(`File ${filename} does not match the pattern for weekly data files`);
  console.log('No action taken');
  process.exit(0);
} 