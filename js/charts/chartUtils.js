/**
 * chartUtils.js
 *
 * Description: Utility functions for chart management
 * Usage:
 *     Import directly: import { createChart, destroyChart } from './charts/chartUtils.js';
 */

import { showElement, hideElement } from '../dom.js';

// Store chart instances for proper management
const chartInstances = {};

/**
 * Create a new ApexCharts instance and render it
 * @param {string} containerId - ID of the container element
 * @param {Object} options - ApexCharts options
 * @param {string} [instanceKey] - Optional key to store the chart instance (defaults to containerId)
 * @returns {Object|null} The ApexCharts instance or null on error
 */
export function createChart(containerId, options, instanceKey = null) {
  const chartKey = instanceKey || containerId;
  
  try {
    // Get container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Chart container element not found: ${containerId}`);
      return null;
    }
    
    // Clear container and show loading spinner
    container.innerHTML = '<div class="spinner mx-auto my-8"></div>';
    
    // Check if there's an existing chart instance
    if (chartInstances[chartKey]) {
      try {
        chartInstances[chartKey].destroy();
        console.log(`Destroyed previous chart instance: ${chartKey}`);
      } catch (e) {
        console.warn(`Error destroying previous chart ${chartKey}:`, e);
      }
      chartInstances[chartKey] = null;
    }
    
    // Create new chart instance
    const chart = new ApexCharts(container, options);
    
    // Render the chart
    try {
      chart.render();
      
      // Store the chart instance for later reference
      chartInstances[chartKey] = chart;
      
      // Remove spinner after rendering
      container.querySelector('.spinner')?.remove();
      
      // Show the container
      showElement(containerId);
      
      return chart;
    } catch (renderError) {
      console.error(`Error rendering chart in #${containerId}:`, renderError);
      
      // Show error message
      container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">Error rendering chart</p>`;
      
      return null;
    }
  } catch (error) {
    console.error(`Error creating chart in #${containerId}:`, error);
    hideElement(containerId);
    return null;
  }
}

/**
 * Get a chart instance by its key
 * @param {string} instanceKey - The key used when creating the chart
 * @returns {Object|null} The chart instance or null if not found
 */
export function getChartInstance(instanceKey) {
  return chartInstances[instanceKey] || null;
}

/**
 * Update an existing chart with new options or series data
 * @param {string} instanceKey - The key used when creating the chart
 * @param {Object} [newOptions] - New options to apply
 * @param {Array} [newSeries] - New series data
 * @param {boolean} [animate=true] - Whether to animate the changes
 * @returns {boolean} True if update was successful
 */
export function updateChart(instanceKey, newOptions = null, newSeries = null, animate = true) {
  try {
    const chart = getChartInstance(instanceKey);
    if (!chart) {
      console.error(`Chart instance not found: ${instanceKey}`);
      return false;
    }
    
    // Update options if provided
    if (newOptions) {
      chart.updateOptions(newOptions, true, animate);
    }
    
    // Update series if provided
    if (newSeries) {
      chart.updateSeries(newSeries, animate);
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating chart ${instanceKey}:`, error);
    return false;
  }
}

/**
 * Destroy a chart instance and remove it from storage
 * @param {string} instanceKey - The key used when creating the chart
 * @returns {boolean} True if destruction was successful
 */
export function destroyChart(instanceKey) {
  try {
    const chart = getChartInstance(instanceKey);
    if (!chart) {
      console.error(`Chart instance not found: ${instanceKey}`);
      return false;
    }
    
    // Destroy the chart
    chart.destroy();
    
    // Remove from storage
    chartInstances[instanceKey] = null;
    
    return true;
  } catch (error) {
    console.error(`Error destroying chart ${instanceKey}:`, error);
    return false;
  }
}

/**
 * Destroy all chart instances
 */
export function destroyAllCharts() {
  try {
    Object.keys(chartInstances).forEach(key => {
      if (chartInstances[key]) {
        try {
          chartInstances[key].destroy();
        } catch (e) {
          console.warn(`Error destroying chart ${key}:`, e);
        }
        chartInstances[key] = null;
      }
    });
    
    console.log('All chart instances destroyed');
  } catch (error) {
    console.error('Error destroying all charts:', error);
  }
} 