/**
 * utils.js
 *
 * Description: Utility functions for the application
 * Usage:
 *     Import directly: import { formatNumber, formatDateRange } from './utils.js';
 */

/**
 * Formats a date range for display
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @param {string} [locale='de'] - The locale for formatting
 * @returns {string} Formatted date range string
 */
export function formatDateRange(startDate, endDate, locale = 'de') {
  try {
    if (!(startDate instanceof Date) || !(endDate instanceof Date) || 
        isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid Date Range';
    }
    
    let dateOptions = {};
    let separator = ' - ';
    
    // Format based on locale
    if (locale === 'de') {
      dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    } else {
      dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    }
    
    const startFormatted = startDate.toLocaleDateString(locale, dateOptions);
    const endFormatted = endDate.toLocaleDateString(locale, dateOptions);
    
    return `${startFormatted}${separator}${endFormatted}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'Invalid Date Range';
  }
}

/**
 * Triggers a file download in the browser
 * @param {string} content - The file content
 * @param {string} fileName - The file name
 * @param {string} [mimeType='text/csv'] - The MIME type
 * @returns {boolean} Success indicator
 */
export function triggerDownload(content, fileName, mimeType = 'text/csv') {
  try {
    // Create a Blob from the content
    const blob = new Blob([content], { type: mimeType });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Add the link to the document
    document.body.appendChild(link);
    
    // Make sure it was actually added to the DOM before clicking
    if (!document.body.contains(link)) {
      console.error('Failed to append download link to document body');
      return false;
    }
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    setTimeout(() => {
      // Remove the link from the document after a short delay
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error triggering download:', error);
    return false;
  }
}

/**
 * Formats a number with thousand separators
 * @param {number} num - The number to format
 * @param {string} [locale='de'] - The locale for formatting
 * @returns {string} Formatted number
 */
export function formatNumber(num, locale = 'de') {
  try {
    if (isNaN(Number(num))) {
      return 'NaN';
    }
    
    const formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US');
    return formatter.format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(num);
  }
}

/**
 * Creates a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
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
 * Creates a throttled function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  let lastArgs;
  let lastThis;
  let lastCallTime = 0;
  
  return function executedFunction(...args) {
    // Store reference to this and args
    lastArgs = args;
    lastThis = this;
    
    // If it's the first call or we're outside the limit, execute immediately
    const now = Date.now();
    if (!inThrottle) {
      func.apply(lastThis, lastArgs);
      lastCallTime = now;
      inThrottle = true;
    } else {
      // Check if we've waited long enough since the last call
      if (now - lastCallTime >= limit) {
        func.apply(lastThis, lastArgs);
        lastCallTime = now;
      } else {
        // Set up a future call when the limit is reached
        clearTimeout(inThrottle);
        inThrottle = setTimeout(() => {
          func.apply(lastThis, lastArgs);
          lastCallTime = Date.now();
        }, limit - (now - lastCallTime));
      }
    }
  };
}

/**
 * Safely adds an event listener with error handling
 * @param {HTMLElement} element - The DOM element
 * @param {string} eventType - The event type
 * @param {Function} handler - The event handler
 * @param {Object} [options] - Event listener options
 */
export function safeAddListener(element, eventType, handler, options) {
  try {
    if (!element || !eventType || typeof handler !== 'function') {
      return;
    }
    
    element.addEventListener(eventType, handler, options);
  } catch (error) {
    console.error(`Error adding ${eventType} listener:`, error);
  }
} 