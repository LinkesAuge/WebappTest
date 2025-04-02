/**
 * csvLoader.js
 *
 * Description: Functions for loading and parsing CSV data
 * Usage:
 *     Import directly: import { loadCsvData, parseCsvText } from './data-loading/csvLoader.js';
 */

import { setState } from '../state.js';
import { showLoading, hideLoading, showError } from '../dom.js';

/**
 * Loads CSV data from the specified path
 * @param {string} path - The CSV file path
 * @returns {Promise<Array>} Promise resolving to parsed CSV data
 */
export async function loadCsvData(path) {
  try {
    showLoading(`Loading data from ${path}...`);
    
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to load CSV data: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    const parsedData = parseCsvText(csvText);
    
    hideLoading();
    return parsedData;
  } catch (error) {
    hideLoading();
    showError(`Error loading CSV data: ${error.message}`, true);
    return [];
  }
}

/**
 * Loads score rules data
 * @returns {Promise<Array>} Promise resolving to parsed rules data
 */
export async function loadScoreRulesData() {
  try {
    // This would typically load from a separate rules file
    // For now, we'll use a hardcoded basic structure
    const rulesData = [
      { category: 'default', points: 1, name: 'Default Score' },
      { category: 'bonus', points: 5, name: 'Bonus Score' },
      { category: 'chest', points: 10, name: 'Chest Points' }
    ];
    
    setState('scoreRules', rulesData);
    return rulesData;
  } catch (error) {
    showError(`Error loading score rules: ${error.message}`, true);
    return [];
  }
}

/**
 * Parses CSV text into an array of objects
 * @param {string} csvText - The CSV text content
 * @returns {Array} Parsed CSV data
 */
export function parseCsvText(csvText) {
  if (!csvText) {
    console.error('No CSV text provided to parse');
    return [];
  }

  // Split the text into lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 2) {
    console.error('CSV data has too few lines (no header or data)');
    return [];
  }
  
  // Extract headers (first line)
  const headers = parseCSVLine(lines[0]);
  const numFields = headers.length;
  
  // Parse each line of data
  return lines.slice(1).map((line, index) => {
    // Parse values considering quotes
    const values = parseCSVLine(line);
    
    // Check if the number of values matches the number of headers
    if (values.length !== numFields) {
      console.warn(`Line ${index + 2} has incorrect number of values (expected ${numFields}, got ${values.length}). Attempting to fix...`);
      
      if (values.length < numFields) {
        // Add empty values if needed
        const missing = numFields - values.length;
        for (let i = 0; i < missing; i++) {
          values.push('');
        }
        console.warn(`Added ${missing} empty values to line ${index + 2}`);
      } else {
        // Truncate extra values
        values.splice(numFields);
        console.warn(`Truncated extra values from line ${index + 2}`);
      }
    }
    
    // Create object with header keys and row values
    const rowData = {};
    headers.forEach((header, i) => {
      const value = values[i] || '';
      
      // Try to convert numeric values to actual numbers
      if (value !== '' && !isNaN(value)) {
        const num = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
        rowData[header] = num;
      } else {
        rowData[header] = value;
      }
    });
    
    return rowData;
  });
}

/**
 * Helper function to parse CSV line considering quotes
 * @param {string} line - A single line from the CSV
 * @returns {string[]} Array of field values
 * @private
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      // Add to current field
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  // Clean up quotes in each field
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.substring(1, field.length - 1);
    }
    return field;
  });
}

/**
 * Initializes data loading for the application
 * @returns {Promise<boolean>} Promise resolving to success indicator
 */
export async function initializeDataLoading() {
  try {
    // First try to load cached data from localStorage
    const loadedFromStorage = await loadFromLocalStorage();
    
    if (loadedFromStorage) {
      console.log('Data loaded from local storage successfully');
      return true;
    }
    
    // If no cached data, load from CSV
    console.log('No cached data found, loading from CSV');
    return await loadFreshData();
  } catch (error) {
    showError(`Error initializing data: ${error.message}`, true);
    return false;
  }
}

/**
 * Attempts to load data from localStorage
 * @returns {Promise<boolean>} Success indicator
 * @private
 */
async function loadFromLocalStorage() {
  try {
    // This would be implemented with state.js functionality
    console.log('Checking for cached data in localStorage');
    return false; // For now, always load fresh data
  } catch (error) {
    console.warn('Error loading from localStorage:', error);
    return false;
  }
}

/**
 * Loads fresh data from CSV sources
 * @returns {Promise<boolean>} Success indicator
 * @private
 */
async function loadFreshData() {
  try {
    // This would load from CSV_PATH defined in config.js
    // const data = await loadCsvData(config.CSV_PATH);
    // setState('playerData', data);
    
    // Also load rules
    await loadScoreRulesData();
    
    return true;
  } catch (error) {
    showError(`Error loading fresh data: ${error.message}`, true);
    return false;
  }
} 