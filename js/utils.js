/**
 * utils.js
 * Contains generic helper functions not tied to specific application features
 */

import { NUMERIC_FORMATTER } from './config.js';

/**
 * Triggers a file download with the given content
 * @param {string} content - The content to download
 * @param {string} filename - The name of the file
 * @param {string} contentType - The content type/MIME type
 */
export function triggerDownload(content, filename, contentType) {
  try {
    const blob = new Blob([content], { type: contentType });
    const link = document.createElement("a");

    // Use createObjectURL for broader browser compatibility
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);

    // Append link, click, and remove
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);

    console.log(`Download triggered for: ${filename}`);
  } catch (error) {
    console.error("Error triggering download:", error);
    // Error handling will be updated when setStatus is implemented
  }
}

/**
 * Formats a date range for display in the UI
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Format: Apr 10-16, 2023
    const startMonth = start.toLocaleString('en', { month: 'short' });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();
    
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } catch (error) {
    console.warn("Error formatting date range:", error);
    return "";
  }
}

/**
 * Formats a number using the numeric formatter
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  return NUMERIC_FORMATTER.format(value);
}

/**
 * Calculates the start and end date for a given calendar week in the current year
 * @param {number|string} weekNumber - The calendar week number (1-53)
 * @returns {Object} Object containing startDate and endDate as ISO strings
 */
export function getWeekDateRange(weekNumber) {
  try {
    // Parse week number as integer
    const week = parseInt(weekNumber, 10);
    if (isNaN(week) || week < 1 || week > 53) {
      throw new Error(`Invalid week number: ${weekNumber}`);
    }

    const currentYear = new Date().getFullYear();
    
    // Get the first day of the year
    const firstDayOfYear = new Date(currentYear, 0, 1);
    
    // Get day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = firstDayOfYear.getDay();
    
    // Calculate days to add to get to first Monday (ISO week starts on Monday)
    // If first day is Sunday (0), add 1 day; if it's Monday (1), add 0 days, etc.
    const daysToFirstMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    
    // First Monday of the year (start of week 1)
    const firstMonday = new Date(currentYear, 0, 1 + daysToFirstMonday);
    
    // Calculate start date (Monday) of the requested week
    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    // Calculate end date (Sunday) of the requested week
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return {
      startDate: startDate.toISOString().split('T')[0],  // YYYY-MM-DD format
      endDate: endDate.toISOString().split('T')[0]       // YYYY-MM-DD format
    };
  } catch (error) {
    console.warn(`Error calculating date range for week ${weekNumber}:`, error);
    return {
      startDate: "",
      endDate: ""
    };
  }
}

// More utility functions will be added here

// Export default object with all utility functions
export default {
  triggerDownload,
  formatDateRange,
  formatNumber,
  getWeekDateRange
}; 