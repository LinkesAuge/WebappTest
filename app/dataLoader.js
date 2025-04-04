/**
 * dataLoader.js
 * 
 * Handles loading and processing of CSV data files for the application.
 * This module is responsible for fetching CSV files, parsing them,
 * and transforming the data into the correct format.
 */

// Configuration constants
const CSV_FILE_PATH = "./data/data.csv";
const RULES_CSV_FILE_PATH = "./data/rules.csv";
const LOCALSTORAGE_DATA_KEY = "tbAnalyzerStoredData_Client_v2_Static";
const LOCALSTORAGE_LAST_MODIFIED_KEY = "tbAnalyzerLastModified_Client_v2_Static";

// This will be imported from utils.js later
let setStatus;
let showLoading;
let hideLoading;
let getText;
let resetStateAndUI;

/**
 * Sets references to utility functions from other modules
 * @param {Object} utils - Object containing utility functions
 */
export function setUtils(utils) {
  setStatus = utils.setStatus;
  showLoading = utils.showLoading;
  hideLoading = utils.hideLoading;
  getText = utils.getText;
  resetStateAndUI = utils.resetStateAndUI;
}

/**
 * Format a date string or timestamp into a localized date string
 * @param {Date|string|number} date - Date object, date string, or timestamp
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  try {
    // If input is already a Date object, use it directly
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }

    // Use browser's language or fallback to German
    const locale = navigator.language || 'de-DE';
    
    // Format the date with time in the specified format
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString(locale, { month: 'short' });
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}. ${month}. ${year}, ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return getText('status.dateUnavailable');
  }
}

/**
 * Get the last modified date of the CSV file
 * @returns {Promise<string>} Formatted last modified date or 'Date unavailable' message
 */
async function getFileLastModified() {
  try {
    const response = await fetch(CSV_FILE_PATH, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lastModifiedHeader = response.headers.get('Last-Modified');
    if (!lastModifiedHeader) {
      console.warn('Last-Modified header not present, using current date');
      return formatDate(new Date());
    }

    const lastModifiedDate = new Date(lastModifiedHeader);
    if (isNaN(lastModifiedDate.getTime())) {
      throw new Error('Invalid Last-Modified date');
    }

    return formatDate(lastModifiedDate);
  } catch (error) {
    console.error('Error getting last modified date:', error);
    return getText('status.dateUnavailable');
  }
}

/**
 * Update the timestamp display in the UI
 * @param {string} timestamp - The formatted timestamp to display
 */
function updateTimestampDisplay(timestamp) {
  const lastUpdatedInfo = document.getElementById('last-updated-info');
  if (!lastUpdatedInfo) {
    console.warn('Could not find last-updated-info element');
    return;
  }

  if (timestamp && timestamp !== getText('status.dateUnavailable')) {
    lastUpdatedInfo.textContent = `${getText('status.lastUpdatedLabel')} ${timestamp}`;
    localStorage.setItem(LOCALSTORAGE_LAST_MODIFIED_KEY, timestamp);
    console.log('Updated timestamp display:', timestamp);
  } else {
    lastUpdatedInfo.textContent = getText('status.lastUpdatedUnavailable');
    console.warn('Invalid or unavailable timestamp');
  }
}

/**
 * Load static CSV data from file
 * @param {Array} allPlayersData - Reference to all players data array
 * @param {Array} displayData - Reference to display data array
 * @param {Array} allColumnHeaders - Reference to column headers array
 * @param {Function} sortFunction - Function to sort the data
 * @param {Object} sortState - Current sort state
 * @param {Function} saveFunction - Function to save data to localStorage
 * @returns {Promise<boolean>} Success status
 */
export async function loadStaticCsvData(
  allPlayersData,
  displayData,
  allColumnHeaders,
  sortFunction,
  sortState,
  saveFunction
) {
  console.log('Fetching static CSV:', CSV_FILE_PATH);
  showLoading(getText('status.loading'));

  try {
    // Get and update the last modified date
    const lastModified = await getFileLastModified();
    updateTimestampDisplay(lastModified);
    
    // Fetch the CSV data
    const response = await fetch(CSV_FILE_PATH);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const csvText = await response.text();
    
    // Parse CSV
    Papa.parse(csvText, {
      complete: function(results) {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          setStatus(getText('status.error'), 'error');
          return;
        }

        // Store headers
        allColumnHeaders.length = 0;
        allColumnHeaders.push(...results.data[0]);

        // Clean and process data
        const cleanedData = cleanData(results);
        
        // Update data arrays
        allPlayersData.length = 0;
        displayData.length = 0;
        allPlayersData.push(...cleanedData);
        displayData.push(...cleanedData);

        // Sort data if sort function provided
        if (sortFunction && sortState) {
          sortFunction(sortState.column, sortState.direction, true, displayData, sortState);
        }

        console.log('Static data processed successfully.');
        hideLoading();
        return true;
      },
      error: function(error) {
        console.error('Error parsing CSV:', error);
        setStatus(getText('status.error'), 'error');
        return false;
      }
    });

    return true;
  } catch (error) {
    console.error('Error loading CSV:', error);
    setStatus(getText('status.error'), 'error');
    return false;
  }
}

/**
 * Fetches and parses the scoring rules CSV file.
 * @param {Array} scoreRulesData - Reference to the global score rules data array
 * @param {Function} sortData - Function to sort data
 * @param {Object} scoreRulesSortState - Current sort state for score rules
 * @returns {Promise<boolean>} True if rules loaded successfully, false otherwise.
 */
export async function loadScoreRulesData(scoreRulesData, sortData, scoreRulesSortState) {
  if (scoreRulesData.length > 0) return true; // Already loaded
  console.log(`Fetching score rules CSV: ${RULES_CSV_FILE_PATH}`);

  try {
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(`${RULES_CSV_FILE_PATH}${cacheBuster}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const csvText = await response.text();

    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false, // Parse as strings initially
        complete: (results) => {
          if (results.errors.length > 0 || !results.data) {
            console.error("Score rules CSV parsing errors:", results.errors);
            setStatus(
              getText("status.parseError", { 0: RULES_CSV_FILE_PATH }),
              "error",
              5000
            );
            resolve(false);
            return;
          }
          
          // Clear the array first
          scoreRulesData.length = 0;
          
          // Process and type-cast rules data
          results.data.forEach(row => {
            const rule = {
              Typ: String(row.Typ || "").trim(),
              Level: Number(row.Level) || 0,
              Punkte: Number(row.Punkte) || 0,
            };
            
            // Only add if type exists
            if (rule.Typ) {
              scoreRulesData.push(rule);
            }
          });

          console.log(`Loaded ${scoreRulesData.length} score rules.`);
          // Apply initial sort to rules data
          sortData(
            scoreRulesSortState.column,
            scoreRulesSortState.direction,
            false,
            scoreRulesData
          );
          resolve(true);
        },
        error: (error) => {
          console.error("PapaParse failed for rules CSV:", error);
          setStatus(
            getText("status.parseError", { 0: RULES_CSV_FILE_PATH }),
            "error",
            5000
          );
          resolve(false);
        },
      });
    });
  } catch (error) {
    console.error("Failed to fetch or process rules CSV:", error);
    setStatus(
      getText("status.genericLoadError", { 0: error.message }),
      "error",
      5000
    );
    return false;
  }
}

/**
 * Saves current data to local storage
 * @param {Array} allPlayersData - The players data array (unused)
 * @param {Array} allColumnHeaders - The column headers array (unused)
 * @param {string|null} dataLastModifiedTimestamp - Last modified timestamp
 */
export function saveDataToLocalStorage(allPlayersData, allColumnHeaders, dataLastModifiedTimestamp) {
  try {
    if (dataLastModifiedTimestamp && dataLastModifiedTimestamp !== getText('status.dateUnavailable')) {
      localStorage.setItem(LOCALSTORAGE_LAST_MODIFIED_KEY, dataLastModifiedTimestamp);
      console.log("Last modified timestamp saved to localStorage:", dataLastModifiedTimestamp);
      
      // Update the UI with the timestamp
      const lastUpdatedInfo = document.getElementById('last-updated-info');
      if (lastUpdatedInfo) {
        lastUpdatedInfo.textContent = `${getText('status.lastUpdatedLabel')} ${dataLastModifiedTimestamp}`;
      }
    }
  } catch (e) {
    console.warn("Failed to save timestamp to localStorage:", e);
  }
}

/**
 * Loads metadata from localStorage
 * @returns {string|null} The saved timestamp or null if not available
 */
export function loadDataFromLocalStorage() {
  try {
    return localStorage.getItem(LOCALSTORAGE_LAST_MODIFIED_KEY);
  } catch (e) {
    console.warn("Failed to load timestamp from localStorage:", e);
    return null;
  }
}

/**
 * Clean and process raw CSV data
 * @param {Array} results - Raw CSV parsing results
 * @returns {Array} Cleaned data array
 */
function cleanData(results) {
  console.log('Cleaning data...');
  const cleanedData = [];

  // Process each row
  results.data.forEach((row, index) => {
    if (index === 0) return; // Skip header row

    // Create clean player object
    const cleanPlayer = {};
    
    // Get headers from first row
    const headers = results.data[0];
    
    // Process each column
    headers.forEach((header, colIndex) => {
      const value = row[colIndex];
      
      // Clean and convert the value
      if (header === 'PLAYER') {
        cleanPlayer[header] = String(value || '').trim();
      } else {
        // Convert numeric values, handling commas and whitespace
        const numericValue = Number(String(value || '0').replace(/[,\s]/g, ''));
        cleanPlayer[header] = isNaN(numericValue) ? 0 : numericValue;
      }
    });

    // Ensure core columns exist and are numbers
    if (!cleanPlayer.TOTAL_SCORE) cleanPlayer.TOTAL_SCORE = 0;
    if (!cleanPlayer.CHEST_COUNT) cleanPlayer.CHEST_COUNT = 0;

    // Only add players with valid names
    if (cleanPlayer.PLAYER && cleanPlayer.PLAYER.length > 0) {
      cleanedData.push(cleanPlayer);
    } else {
      console.warn(`Skipping invalid player data at row ${index + 1}`);
    }
  });

  console.log(`Cleaned data rows: ${cleanedData.length}.`);
  return cleanedData;
}

// Export constants that might be needed by other modules
export const constants = {
  CSV_FILE_PATH,
  RULES_CSV_FILE_PATH,
  LOCALSTORAGE_DATA_KEY,
  LOCALSTORAGE_LAST_MODIFIED_KEY
};
