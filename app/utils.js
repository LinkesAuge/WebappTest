/**
 * utils.js
 * 
 * Contains utility functions used throughout the application.
 * These include formatting, sorting, and generic helper functions.
 */

// Consistent number formatting (using US locale for consistency, display is language-agnostic here)
const NUMERIC_FORMATTER = new Intl.NumberFormat("en-US");

// Core column definitions
const CORE_COLUMNS = {
  PLAYER: "PLAYER",
  TOTAL_SCORE: "TOTAL_SCORE",
  CHEST_COUNT: "CHEST_COUNT"
}; // Non-analyzable columns

// Function references that will be provided by other modules
let getText = (key) => key; // Default implementation

/**
 * Sets the i18n getText function for use in utils
 * @param {Function} i18nGetText - The i18n getText function
 */
export function setI18n(i18nGetText) {
  getText = i18nGetText;
}

/**
 * Sets a status message and optionally clears it after a duration
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('info', 'error', 'success')
 * @param {number} duration - Duration in ms after which to clear the message (0 = don't clear)
 */
export function setStatus(message, type = "info", duration = 0) {
  const statusArea = document.getElementById("status-area");
  const statusMessage = document.getElementById("status-message");
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusArea?.classList.remove("text-red-500", "text-green-500", "text-blue-500");
  if (type === "error") statusArea?.classList.add("text-red-500");
  else if (type === "success") statusArea?.classList.add("text-green-500");
  else if (type === "info") statusArea?.classList.add("text-blue-500");

  if (duration > 0) {
    setTimeout(() => {
      if (statusMessage.textContent === message) {
        statusMessage.textContent = "";
        statusArea?.classList.remove("text-red-500", "text-green-500", "text-blue-500");
      }
    }, duration);
  }
}

/**
 * Shows the loading spinner with an optional message
 * @param {string} message - Optional message to display during loading
 */
export function showLoading(message) {
  const loadingSpinner = document.getElementById("loading-spinner");
  const statusMessage = document.getElementById("status-message");
  
  // Use provided message or get default from i18n
  const displayMessage = message || getText('status.loading');
  
  if (loadingSpinner) loadingSpinner.classList.remove("hidden");
  if (statusMessage && displayMessage) statusMessage.textContent = displayMessage;
}

/**
 * Hides the loading spinner
 */
export function hideLoading() {
  const loadingSpinner = document.getElementById("loading-spinner");
  if (loadingSpinner) loadingSpinner.classList.add("hidden");
}

/**
 * Sorts data based on the specified column and direction
 * @param {string} column - The column to sort by
 * @param {string} direction - The sort direction ('asc' or 'desc')
 * @param {boolean} updateState - Whether to update the state variables
 * @param {Array} dataToSort - The array of data to sort (passed by reference)
 * @param {Object} sortStateRef - Optional reference to a sort state object to update
 * @returns {Array} The sorted data array
 */
export function sortData(column, direction, updateState = true, dataToSort, sortStateRef = null) {
  console.log(`Sorting by ${column} (${direction})`);
  if (!dataToSort || !dataToSort.length) {
    console.warn("No data to sort!");
    return dataToSort;
  }

  // Normalize undefined directions to 'asc'
  if (!direction) direction = "asc";

  // Copy the original direction for state update
  const origDirection = direction;

  // Check if the sorted column is present in the data
  // For player category sorting where not all entries have the category
  const hasSortColumn = dataToSort.length > 0 && typeof dataToSort[0] === 'object' && column in dataToSort[0];
  
  if (!hasSortColumn) {
    console.warn(`Column ${column} not found in data`);
    return dataToSort;
  }

  // Sort with stable algorithm
  dataToSort.sort((a, b) => {
    let aVal, bVal;
    if (column === "PLAYER") {
      // Special case for player name (alphabetic sort)
      // Convert to lowercase strings for case-insensitive comparison
      aVal = String(a[column] || "").toLowerCase();
      bVal = String(b[column] || "").toLowerCase();
      return direction === "asc"
        ? aVal.localeCompare(bVal) // Use locale-aware string comparison
        : bVal.localeCompare(aVal);
    } else if (column === "Typ") {
      // Special case for score rules type (alphabetic sort)
      aVal = String(a[column] || "").toLowerCase();
      bVal = String(b[column] || "").toLowerCase();
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      // Numeric sort for all other columns
      // Handle categories that might be missing from some players
      aVal = hasSortColumn ? Number(a[column] || 0) : 0;
      bVal = hasSortColumn ? Number(b[column] || 0) : 0;
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  // Update sort state if requested
  if (updateState && sortStateRef) {
    sortStateRef.column = column;
    sortStateRef.direction = origDirection;
  }

  return dataToSort;
}

/**
 * Updates sort icons in table headers
 * @param {string} activeColumn - The currently sorted column
 * @param {string} activeDirection - The sort direction ('asc' or 'desc')
 * @param {string} tableHeaderSelector - CSS selector for table headers
 */
export function updateSortIcons(activeColumn, activeDirection, tableHeaderSelector) {
  console.log('Updating sort icons:', { activeColumn, activeDirection, tableHeaderSelector });
  
  const headers = document.querySelectorAll(tableHeaderSelector);
  headers.forEach((header) => {
    const column = header.dataset.column;
    const iconSpan = header.querySelector(".sort-icon");
    if (!iconSpan) return;

    if (column === activeColumn) {
      iconSpan.textContent = activeDirection === "asc" ? "▲" : "▼";
      iconSpan.classList.remove("opacity-50");
      iconSpan.classList.add("opacity-100");
    } else {
      iconSpan.textContent = "▼";
      iconSpan.classList.remove("opacity-100");
      iconSpan.classList.add("opacity-50");
    }
  });
}

/**
 * Gets the value of a CSS variable
 * @param {string} variableName - Name of the CSS variable (without the -- prefix)
 * @param {string} fallbackColor - Fallback color if variable is not found
 * @returns {string} The color value
 */
export function getCssVariableValue(variableName, fallbackColor = "#ffffff") {
  const bodyStyles = window.getComputedStyle(document.body);
  const value = bodyStyles.getPropertyValue(`--${variableName}`).trim();
  return value || fallbackColor;
}

/**
 * Formats a number with thousands separators
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export function formatNumber(num) {
  return NUMERIC_FORMATTER.format(num);
}

/**
 * Triggers a file download
 * @param {string} content - The content to download
 * @param {string} filename - The filename to use
 * @param {string} contentType - The content type
 */
export function triggerDownload(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link to trigger the download
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Filters data based on a search term
 * @param {Array} data - The data array to filter
 * @param {string} searchTerm - The search term to filter by
 * @param {Array} searchColumns - Array of column names to search in
 * @returns {Array} Filtered data array
 */
export function filterData(data, searchTerm, searchColumns) {
  if (!searchTerm || !data || !data.length) return data;
  
  const term = searchTerm.toLowerCase();
  return data.filter(item => {
    return searchColumns.some(column => {
      const value = item[column];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
}

/**
 * Validates data structure against expected schema
 * @param {Object} data - The data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {boolean} True if valid, false otherwise
 */
export function validateData(data, requiredFields) {
  if (!data || typeof data !== 'object') return false;
  
  return requiredFields.every(field => {
    return field in data && data[field] !== null && data[field] !== undefined;
  });
}

/**
 * Calculates percentage and formats it
 * @param {number} value - The value to calculate percentage from
 * @param {number} total - The total value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export function calculatePercentage(value, total, decimals = 1) {
  if (!total) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Normalizes a value between 0 and 1 based on min/max values
 * @param {number} value - The value to normalize
 * @param {number} min - Minimum value in the range
 * @param {number} max - Maximum value in the range
 * @returns {number} Normalized value between 0 and 1
 */
export function normalizeValue(value, min, max) {
  if (min === max) return 0;
  return (value - min) / (max - min);
}

/**
 * Safely accesses nested object properties
 * @param {Object} obj - The object to access
 * @param {string} path - The property path (e.g., 'a.b.c')
 * @param {*} defaultValue - Value to return if path doesn't exist
 * @returns {*} The value at the path or defaultValue
 */
export function getNestedValue(obj, path, defaultValue = null) {
  try {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj);
  } catch (error) {
    console.warn(`Error accessing path ${path}:`, error);
    return defaultValue;
  }
}

/**
 * Handles errors consistently across the application
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 * @param {boolean} showUser - Whether to show error to user
 */
export function handleError(error, context, showUser = true) {
  console.error(`Error in ${context}:`, error);
  
  if (showUser) {
    const message = getText ? 
      getText('errors.generic') : 
      'An error occurred. Please try again.';
    setStatus(message, 'error', 5000);
  }
}

/**
 * Generates a unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export constants for use by other modules
export {
  CORE_COLUMNS,
  NUMERIC_FORMATTER
};
