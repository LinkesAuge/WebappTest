/**
 * dataLoading.js
 * Contains functions for loading data from CSV and JSON files
 */

import { CSV_PATH, RULES_PATH, WEEKS_JSON_PATH, DATA_FOLDER_PATH } from './config.js';
import { allPlayersData, scoreRules, availableWeeks } from './state.js';
import { showLoading, hideLoading, showError } from './dom.js';
import { getText } from './i18n.js';
import { getWeekDateRange } from './utils.js';

/**
 * Loads player data from CSV file
 * @returns {Promise<Array>} - Promise resolving to an array of player data objects
 */
export async function loadPlayerData() {
  try {
    showLoading(getText('status.loadingData'));
    
    // Try to fetch the data.csv file
    try {
      const response = await fetch('./data.csv');
      
      if (!response.ok) {
        // If file not found, show empty state and return empty array
        console.warn('data.csv not found. Showing empty state.');
        
        // Show empty state section if it exists
        const emptyStateSection = document.getElementById('empty-state-section');
        if (emptyStateSection) {
          // Hide other sections
          const sections = document.querySelectorAll('main > section');
          sections.forEach(section => section.classList.add('hidden'));
          
          // Show empty state
          emptyStateSection.classList.remove('hidden');
        }
        
        return [];
      }
      
      const csvText = await response.text();
      
      // Parse CSV data
      const parsedData = parseCSV(csvText);
      
      hideLoading();
      return parsedData;
    } catch (error) {
      throw new Error(`HTTP error! Status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error loading player data:', error);
    hideLoading();
    showError(getText('status.dataLoadError', { 0: './data.csv' }));
    
    // Show empty state section if it exists
    const emptyStateSection = document.getElementById('empty-state-section');
    if (emptyStateSection) {
      // Hide other sections
      const sections = document.querySelectorAll('main > section');
      sections.forEach(section => section.classList.add('hidden'));
      
      // Show empty state
      emptyStateSection.classList.remove('hidden');
    }
    
    return [];
  }
}

/**
 * Loads score rules from CSV file
 * @returns {Promise<Object[]>} Array of score rule objects
 */
export async function loadScoreRules() {
  try {
    showLoading(getText('status.loadingRules'));
    
    // Try to fetch rules.csv
    try {
      const response = await fetch('./rules.csv');
      if (!response.ok) {
        console.warn('rules.csv not found. Using empty rules.');
        return [];
      }
      
      const csvText = await response.text();
      const data = parseRulesCSV(csvText);
      
      // Store rules in state
      if (Array.isArray(data)) {
        // Clear existing rules and add new ones
        scoreRules.length = 0;
        data.forEach(rule => scoreRules.push(rule));
      }
      
      console.log('Score rules loaded successfully');
      return data;
    } catch (error) {
      console.warn('Error fetching rules CSV:', error);
      return [];
    }
  } catch (error) {
    console.error('Error loading score rules:', error);
    showError(getText('status.ruleLoadError'));
    return [];
  } finally {
    hideLoading();
  }
}

/**
 * Loads available weeks from JSON file and calculates date ranges based on week numbers
 * @returns {Promise<boolean>} Success status
 */
export async function loadAvailableWeeks() {
  try {
    console.log('Loading available weeks from', WEEKS_JSON_PATH);
    
    // Verify access to the data folder
    try {
      const testResponse = await fetch(DATA_FOLDER_PATH);
      console.log('Data folder access test:', testResponse.ok ? 'Success' : 'Failed', testResponse.status);
    } catch (error) {
      console.warn('Error testing data folder access:', error);
    }
    
    // Try to fetch weeks.json using the configured path
    try {
      console.log('Attempting to fetch weeks.json from:', WEEKS_JSON_PATH);
      const response = await fetch(WEEKS_JSON_PATH);
      console.log('Weeks.json fetch response:', response.status, response.statusText);
      
      if (!response.ok) {
        console.warn(`weeks.json not found at ${WEEKS_JSON_PATH}. Using empty weeks list.`);
        return false;
      }
      
      const text = await response.text();
      console.log('Received text from weeks.json:', text.substring(0, 50) + '...');
      
      let data;
      try {
        data = JSON.parse(text);
        console.log('Successfully parsed weeks.json data:', data);
      } catch (parseError) {
        console.error('Error parsing weeks.json JSON:', parseError);
        return false;
      }
      
      // Store weeks in state with calculated date ranges
      if (Array.isArray(data)) {
        // Clear existing weeks
        availableWeeks.length = 0;
        console.log('Cleared existing weeks, processing', data.length, 'weeks');
        
        // Process each week entry
        data.forEach(week => {
          const weekEntry = { ...week };
          console.log('Processing week entry:', weekEntry);
          
          // Extract week number from file name if possible
          const weekNumber = weekEntry.week;
          console.log('Extracted week number:', weekNumber);
          
          // If startDate and endDate are not already set, calculate them
          if ((!weekEntry.startDate || !weekEntry.endDate) && weekNumber) {
            try {
              // Calculate date range for this week number
              const dateRange = getWeekDateRange(weekNumber);
              console.log('Calculated date range for week', weekNumber, ':', dateRange);
              
              // Update the week entry with calculated dates
              weekEntry.startDate = dateRange.startDate;
              weekEntry.endDate = dateRange.endDate;
            } catch (error) {
              console.warn(`Error calculating date range for week ${weekNumber}:`, error);
            }
          }
          
          // Add the processed week entry to availableWeeks
          availableWeeks.push(weekEntry);
          console.log('Added week entry to availableWeeks. Current length:', availableWeeks.length);
        });
      } else {
        console.warn('Data from weeks.json is not an array:', data);
      }
      
      console.log(`Available weeks loaded successfully: ${availableWeeks.length} weeks`);
      return availableWeeks.length > 0;
    } catch (error) {
      console.warn('Error fetching weeks JSON:', error);
      console.error('Full error details:', error.stack || error);
      return false;
    }
  } catch (error) {
    console.error('Error loading available weeks:', error);
    console.error('Full error stack:', error.stack || error);
    return false;
  }
}

/**
 * Loads data for a specific week
 * @param {string} weekFile - The filename of the week to load
 * @returns {Promise<Object>} Object containing the week's data
 */
export async function loadWeekData(weekFile) {
  try {
    if (!weekFile) {
      console.warn('No week file provided');
      return null;
    }
    
    console.log(`Loading week data from file: ${weekFile}`);
    showLoading(getText('loading_week_data', { week: weekFile }));
    
    // Construct the URL for the week's data file
    let weekUrl;
    if (weekFile.includes('/') || weekFile.includes('\\')) {
      // Full path already provided
      weekUrl = weekFile;
    } else {
      // Construct path using the data folder path
      weekUrl = `${DATA_FOLDER_PATH}/${weekFile}`;
    }

    console.log(`Attempting to fetch week data from: ${weekUrl}`);
    
    try {
      const response = await fetch(weekUrl);
      if (!response.ok) {
        console.warn(`Week data file not found: ${weekUrl} (Status: ${response.status})`);
        return null;
      }
      
      let data;
      
      // Check if this is a CSV or JSON file
      if (weekFile.toLowerCase().endsWith('.csv')) {
        // It's a CSV file, parse it
        const csvText = await response.text();
        const parsedData = parseCSV(csvText);
        
        // Extract week number from filename (e.g., "data_week_12.csv" -> "12")
        const weekMatch = weekFile.match(/data_week_(\d+)\.csv$/i);
        const weekNumber = weekMatch ? weekMatch[1] : null;
        
        // Calculate date range for this week
        let startDate = "", endDate = "";
        if (weekNumber) {
          try {
            const dateRange = getWeekDateRange(weekNumber);
            startDate = dateRange.startDate;
            endDate = dateRange.endDate;
          } catch (error) {
            console.warn(`Error calculating date range for week ${weekNumber}:`, error);
          }
        }
        
        // Convert parsed data to the expected format
        data = {
          weekNumber: weekNumber,
          startDate: startDate,
          endDate: endDate,
          players: parsedData,
          // Calculate totals
          totals: calculateTotals(parsedData)
        };
      } else {
        // It's a JSON file, parse it directly
        data = await response.json();
      }
      
      console.log(`Week data for ${weekFile} loaded successfully:`, data);
      return data;
    } catch (error) {
      console.warn(`Error fetching week data for ${weekFile}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error loading week data for ${weekFile}:`, error);
    return null;
  } finally {
    hideLoading();
  }
}

/**
 * Calculates totals from player data
 * @param {Array} players - Array of player data
 * @returns {Object} Object containing total and average values
 */
function calculateTotals(players) {
  if (!Array.isArray(players) || players.length === 0) {
    return {
      totalScore: 0,
      averageScore: 0,
      totalTimePlayed: 0,
      totalDishes: 0,
      averageRating: 0
    };
  }
  
  try {
    // Calculate sums
    const totalScore = players.reduce((sum, player) => sum + (player.Score || 0), 0);
    const totalTimePlayed = players.reduce((sum, player) => sum + (player.TimePlayed || 0), 0);
    const totalDishes = players.reduce((sum, player) => sum + (player.Dishes || 0), 0);
    const totalRating = players.reduce((sum, player) => sum + (player.Rating || 0), 0);
    
    // Calculate averages
    const averageScore = totalScore / players.length;
    const averageRating = totalRating / players.length;
    
    return {
      totalScore,
      averageScore,
      totalTimePlayed,
      totalDishes,
      averageRating
    };
  } catch (error) {
    console.error('Error calculating totals:', error);
    return {
      totalScore: 0,
      averageScore: 0,
      totalTimePlayed: 0,
      totalDishes: 0,
      averageRating: 0
    };
  }
}

/**
 * Parses CSV text into an array of objects
 * @param {string} csv - The CSV text to parse
 * @returns {Object[]} Array of objects with header keys and row values
 */
function parseCSV(csv) {
  try {
    if (!csv || typeof csv !== 'string') {
      console.error('Invalid CSV input');
      return [];
    }
    
    // Split into rows
    const rows = csv.split(/\r?\n/).filter(row => row.trim());
    if (rows.length === 0) {
      console.warn('CSV has no rows');
      return [];
    }
    
    // Parse headers (first row)
    const headers = rows[0].split(',').map(header => header.trim());
    
    // Parse data rows
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = {};
      const values = rows[i].split(',');
      
      // Skip empty rows
      if (values.length === 1 && !values[0].trim()) {
        continue;
      }
      
      // Map values to headers
      headers.forEach((header, index) => {
        // Convert numeric values to numbers
        const value = values[index] ? values[index].trim() : '';
        rowData[header] = !isNaN(value) && value !== '' ? Number(value) : value;
      });
      
      data.push(rowData);
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

/**
 * Parses rules CSV text into an array of rule objects
 * @param {string} csv - The CSV text to parse
 * @returns {Object[]} Array of rule objects
 */
function parseRulesCSV(csv) {
  try {
    if (!csv || typeof csv !== 'string') {
      console.error('Invalid rules CSV input');
      return [];
    }
    
    // Split into rows
    const rows = csv.split(/\r?\n/).filter(row => row.trim());
    if (rows.length === 0) {
      console.warn('Rules CSV has no rows');
      return [];
    }
    
    // Parse headers (first row)
    const headers = rows[0].split(',').map(header => header.trim());
    
    // Expected headers for rules CSV
    const expectedHeaders = ['Typ', 'Stufe', 'Punkte'];
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      console.warn(`Rules CSV is missing expected headers: ${missingHeaders.join(', ')}`);
    }
    
    // Parse data rows
    const rules = [];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split(',');
      
      // Skip empty rows
      if (values.length === 1 && !values[0].trim()) {
        continue;
      }
      
      const rule = {};
      headers.forEach((header, index) => {
        // Convert numeric values to numbers
        const value = values[index] ? values[index].trim() : '';
        rule[header] = !isNaN(value) && value !== '' ? Number(value) : value;
      });
      
      rules.push(rule);
    }
    
    return rules;
  } catch (error) {
    console.error('Error parsing rules CSV:', error);
    return [];
  }
}

// Export default object with all data loading functions
export default {
  loadPlayerData,
  loadScoreRules,
  loadAvailableWeeks,
  loadWeekData,
  parseCSV,
  parseRulesCSV
}; 