/**
 * config.js
 * Contains application constants, file paths, and configuration values
 */

// File paths
export const CSV_PATH = './data.csv';
export const RULES_PATH = './rules.csv';
export const DATA_FOLDER_PATH = './data';
export const WEEKS_JSON_PATH = './data/weeks.json';
export const WEEK_FILE_PATTERN = 'data_week_';
export const DEFAULT_CSV_FILE_PATH = './data.csv';

// Application settings
export const DEFAULT_LANGUAGE = 'de';
export const LANG_STORAGE_KEY = 'tbAnalyzerLanguage';
export const LOCALSTORAGE_DATA_KEY = 'tbAnalyzerStoredData_Client_v2_Static';

// Column configuration
export const CORE_COLUMNS = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT']; // Non-analyzable columns

// Chart colors and configuration will be added here in the future

// Formatting helpers
export const NUMERIC_FORMATTER = new Intl.NumberFormat('en-US');

// Export default configuration object
export default {
  CSV_PATH,
  RULES_PATH,
  DATA_FOLDER_PATH,
  WEEKS_JSON_PATH,
  WEEK_FILE_PATTERN,
  DEFAULT_CSV_FILE_PATH,
  DEFAULT_LANGUAGE,
  LANG_STORAGE_KEY,
  LOCALSTORAGE_DATA_KEY,
  CORE_COLUMNS,
  NUMERIC_FORMATTER
}; 