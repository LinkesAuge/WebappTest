/**
 * update_weeks_json.js
 * 
 * Description: Script to automatically update weeks.json by scanning for data_week_*.csv files
 * Usage:
 *    node scripts/update_weeks_json.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data');
const WEEKS_JSON_PATH = path.join(DATA_DIR, 'weeks.json');
const FILE_PATTERN = /^data_week_(\d+)\.csv$/;

/**
 * Get the date range for a week number
 * This uses a simplified approach - in a real app, you might need more sophisticated week calculation
 * 
 * @param {number} weekNumber - The week number
 * @returns {Object} - Object containing start_date and end_date
 */
function getDateRangeForWeek(weekNumber) {
  // This is a placeholder implementation
  // In reality, you'd want to use a proper date library (like date-fns or moment.js)
  // to accurately calculate ISO week dates
  
  // For this example, we'll just use a simple offset from a known date
  const baseDate = new Date(2023, 0, 1); // Jan 1, 2023
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const millisecondsPerWeek = 7 * millisecondsPerDay;
  
  // Calculate start of the week (starting from week 1)
  const weekOffset = (weekNumber - 1) * millisecondsPerWeek;
  const weekStart = new Date(baseDate.getTime() + weekOffset);
  const weekEnd = new Date(weekStart.getTime() + millisecondsPerWeek - millisecondsPerDay);
  
  // Format dates as YYYY-MM-DD
  return {
    start_date: weekStart.toISOString().split('T')[0],
    end_date: weekEnd.toISOString().split('T')[0]
  };
}

/**
 * Extracts week number from filename
 * 
 * @param {string} filename - Filename to check
 * @returns {number|null} - Week number or null if not matching pattern
 */
function extractWeekNumber(filename) {
  const match = filename.match(FILE_PATTERN);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Get file modification time to determine most recent file
 * 
 * @param {string} filepath - Path to file
 * @returns {number} - Modification time in milliseconds
 */
async function getFileModTime(filepath) {
  const fileStats = await stat(filepath);
  return fileStats.mtimeMs;
}

/**
 * Main function to update weeks.json
 */
async function updateWeeksJson() {
  try {
    console.log('Starting weeks.json update script...');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      console.log(`Creating data directory at ${DATA_DIR}`);
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Read all files in the data directory
    const files = await readdir(DATA_DIR);
    
    // Filter for data_week files and extract week numbers
    const weekFiles = [];
    let mostRecentFile = null;
    let mostRecentTime = 0;
    
    for (const file of files) {
      if (FILE_PATTERN.test(file)) {
        const weekNumber = extractWeekNumber(file);
        if (weekNumber) {
          const filePath = path.join(DATA_DIR, file);
          const modTime = await getFileModTime(filePath);
          
          weekFiles.push({
            week: weekNumber,
            file: file,
            modTime: modTime
          });
          
          // Keep track of most recent file
          if (modTime > mostRecentTime) {
            mostRecentTime = modTime;
            mostRecentFile = file;
          }
        }
      }
    }
    
    // Sort by week number (descending)
    weekFiles.sort((a, b) => b.week - a.week);
    
    // Load existing weeks.json if it exists
    let existingWeeks = { weeks: [] };
    if (fs.existsSync(WEEKS_JSON_PATH)) {
      try {
        const jsonData = await readFile(WEEKS_JSON_PATH, 'utf8');
        existingWeeks = JSON.parse(jsonData);
      } catch (err) {
        console.warn(`Error reading existing weeks.json: ${err.message}. Creating new file.`);
      }
    }
    
    // Get existing week numbers
    const existingWeekNumbers = new Set(existingWeeks.weeks.map(week => week.week));
    
    // Create or update week entries
    for (const weekFile of weekFiles) {
      if (!existingWeekNumbers.has(weekFile.week)) {
        // This is a new week entry
        const { start_date, end_date } = getDateRangeForWeek(weekFile.week);
        
        existingWeeks.weeks.push({
          week: weekFile.week,
          start_date,
          end_date,
          file: weekFile.file,
          is_current: weekFile.file === mostRecentFile
        });
      }
    }
    
    // Make sure only one week is marked as current (the most recent one)
    existingWeeks.weeks.forEach(week => {
      week.is_current = week.file === mostRecentFile;
    });
    
    // Sort weeks by week number (descending)
    existingWeeks.weeks.sort((a, b) => b.week - a.week);
    
    // Write updated weeks.json
    await writeFile(
      WEEKS_JSON_PATH, 
      JSON.stringify(existingWeeks, null, 2), 
      'utf8'
    );
    
    console.log(`Successfully updated ${WEEKS_JSON_PATH}`);
    console.log(`Found ${weekFiles.length} week files, most recent: Week ${extractWeekNumber(mostRecentFile)}`);
    
  } catch (err) {
    console.error('Error updating weeks.json:', err);
    process.exit(1);
  }
}

// Run the main function
updateWeeksJson(); 