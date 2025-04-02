/**
 * charts.js
 *
 * Description: Main chart module that exports all chart functions
 * Usage:
 *     Import directly: import { initializeCharts, renderTopSourcesChart } from './charts/charts.js';
 */

// Import and re-export chart configuration
export { getChartBaseOptions, getCssVariableValue } from './chartConfig.js';

// Import and re-export chart utilities
export { 
  createChart, 
  updateChart, 
  destroyChart, 
  destroyAllCharts,
  getChartInstance
} from './chartUtils.js';

// Import and re-export source charts
export { 
  renderTopSourcesChart,
  renderScoreDistributionChart
} from './sourceCharts.js';

// Import and re-export correlation charts
export { renderScoreVsChestsChart } from './correlationCharts.js';

// Import and re-export player charts
export { renderPlayerChart } from './playerCharts.js';

// Import dependencies
import { getState, subscribe } from '../state.js';
import { getText } from '../i18n.js';
import { createChart, destroyAllCharts } from './chartUtils.js';
import { renderTopSourcesChart, renderScoreDistributionChart } from './sourceCharts.js';
import { renderScoreVsChestsChart } from './correlationCharts.js';
import { renderPlayerChart } from './playerCharts.js';

// Chart container IDs
const CHART_CONTAINERS = {
  topSources: 'top-sources-chart-container',
  scoreDistribution: 'score-distribution-chart-container',
  scoreVsChests: 'score-vs-chests-chart-container',
  playerChart: 'player-chart-container'
};

// Chart subscription IDs
const chartSubscriptions = [];

/**
 * Initialize all dashboard charts
 */
export function initializeCharts() {
  try {
    console.log('Initializing charts...');
    
    // Clear any existing charts
    destroyAllCharts();
    
    // Clear any existing subscriptions
    chartSubscriptions.forEach(subscriptionId => {
      if (subscriptionId) {
        try {
          unsubscribe(subscriptionId);
        } catch (e) {
          console.warn(`Error unsubscribing from ${subscriptionId}:`, e);
        }
      }
    });
    chartSubscriptions.length = 0;
    
    // Render the dashboard charts
    console.log('Rendering dashboard charts...');
    
    renderTopSourcesChart(CHART_CONTAINERS.topSources);
    renderScoreDistributionChart(CHART_CONTAINERS.scoreDistribution);
    renderScoreVsChestsChart(CHART_CONTAINERS.scoreVsChests);
    
    // Don't automatically render player chart - wait for player selection
    
    console.log('Charts initialized successfully.');
  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

/**
 * Clean up all charts and subscriptions
 */
export function cleanupCharts() {
  try {
    console.log('Cleaning up charts...');
    
    // Destroy all chart instances
    destroyAllCharts();
    
    // Clear any existing subscriptions
    chartSubscriptions.forEach(subscriptionId => {
      if (subscriptionId) {
        try {
          unsubscribe(subscriptionId);
        } catch (e) {
          console.warn(`Error unsubscribing from ${subscriptionId}:`, e);
        }
      }
    });
    chartSubscriptions.length = 0;
    
    console.log('Chart cleanup complete.');
  } catch (error) {
    console.error('Error cleaning up charts:', error);
  }
}

/**
 * Register a chart subscription
 * @param {string} subscriptionId - The subscription ID returned by subscribe()
 * @private
 */
function registerSubscription(subscriptionId) {
  if (subscriptionId) {
    chartSubscriptions.push(subscriptionId);
  }
}

/**
 * Unsubscribe from a state subscription
 * @param {string} subscriptionId - The subscription ID to unsubscribe
 * @private
 */
function unsubscribe(subscriptionId) {
  // This is a placeholder - the actual implementation would depend on the state management system
  console.log(`Unsubscribing from ${subscriptionId}`);
  // In a real implementation, this would call the state module's unsubscribe function
}

/**
 * Render player chart for the selected player
 * @param {string} playerId - The ID of the player to display
 * @returns {Object|null} The chart instance or null on error
 */
export function renderPlayerChartById(playerId) {
  try {
    if (!playerId) {
      console.warn('No player ID provided for player chart');
      return null;
    }
    
    // Get player data from state
    const playerData = getState('playerData') || [];
    const player = playerData.find(p => p.id === playerId);
    
    if (!player) {
      console.warn(`Player with ID ${playerId} not found`);
      return null;
    }
    
    return renderPlayerChart(player, CHART_CONTAINERS.playerChart);
  } catch (error) {
    console.error(`Error rendering player chart for ID ${playerId}:`, error);
    return null;
  }
} 