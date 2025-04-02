/**
 * correlationCharts.js
 *
 * Description: Chart rendering for correlation charts (scatter plots)
 * Usage:
 *     Import directly: import { renderScoreVsChestsChart } from './charts/correlationCharts.js';
 */

import { getState, subscribe } from '../state.js';
import { getChartBaseOptions } from './chartConfig.js';
import { createChart, destroyChart } from './chartUtils.js';
import { getText } from '../i18n.js';

/**
 * Render a scatter chart showing correlation between score and chests
 * @param {string} containerId - The ID of the container element
 * @param {string} [instanceKey] - Optional key for the chart instance
 * @returns {Object|null} The chart instance or null on error
 */
export function renderScoreVsChestsChart(containerId, instanceKey = null) {
  try {
    console.log(`Rendering score vs chests chart in #${containerId}`);
    
    // Use unique key for chart instance
    const chartKey = instanceKey || 'scoreVsChests';
    
    // Get player data from state
    const playerData = getState('playerData') || [];
    
    if (playerData.length === 0) {
      console.warn('No player data available for score vs chests chart');
      return null;
    }
    
    // Prepare data for scatter chart
    const chartData = playerData
      .filter(player => 
        // Only include players with both score and chests data
        player.score !== undefined && 
        player.chests !== undefined && 
        player.score > 0
      )
      .map(player => ({
        x: player.chests || 0,
        y: player.score || 0,
        name: player.name,
        team: player.team,
        playerId: player.id
      }));
    
    // Format data for ApexCharts
    const chartSeries = [{
      name: getText('charts.players') || 'Players',
      data: chartData
    }];
    
    // Calculate trend line
    const trendLineData = calculateTrendLine(chartData);
    
    // Add trend line series if there's enough data
    if (trendLineData && trendLineData.length >= 2) {
      chartSeries.push({
        name: getText('charts.trendLine') || 'Trend Line',
        type: 'line',
        data: trendLineData,
        color: '#ff9800',
        dashArray: 5,
        markers: {
          size: 0
        }
      });
    }
    
    // Get base options and customize for scatter chart
    const baseOptions = getChartBaseOptions();
    const options = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'scatter',
        height: containerId.includes('modal') ? 450 : 300,
        zoom: {
          enabled: true,
          type: 'xy'
        }
      },
      series: chartSeries,
      xaxis: {
        ...baseOptions.xaxis,
        tickAmount: 5,
        title: {
          ...baseOptions.xaxis?.title,
          text: getText('charts.chestsCount') || 'Chests Collected',
        }
      },
      yaxis: {
        ...baseOptions.yaxis,
        tickAmount: 5, 
        title: {
          ...baseOptions.yaxis?.title,
          text: getText('charts.playerScore') || 'Player Score',
        }
      },
      markers: {
        size: 5,
        hover: {
          size: 7,
          sizeOffset: 3
        }
      },
      tooltip: {
        ...baseOptions.tooltip,
        shared: false,
        intersect: true,
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          // Only customize tooltip for scatter points (not trend line)
          if (seriesIndex !== 0) return '';
          
          const point = chartData[dataPointIndex];
          if (!point) return '';
          
          return `
            <div class="apexcharts-tooltip-custom">
              <div><strong>${point.name || 'Player'}</strong></div>
              <div>${getText('table.headerTeam') || 'Team'}: ${point.team || 'N/A'}</div>
              <div>${getText('table.headerScore') || 'Score'}: ${new Intl.NumberFormat().format(point.y)}</div>
              <div>${getText('charts.chestsCount') || 'Chests'}: ${new Intl.NumberFormat().format(point.x)}</div>
            </div>
          `;
        }
      },
      legend: {
        position: 'top',
      }
    };
    
    // Create and render the chart
    const chart = createChart(containerId, options, chartKey);
    
    // Subscribe to player data changes
    subscribe('playerData', (newData) => {
      console.log('Player data changed, updating score vs chests chart');
      renderScoreVsChestsChart(containerId, chartKey);
    });
    
    return chart;
  } catch (error) {
    console.error(`Error rendering score vs chests chart:`, error);
    return null;
  }
}

/**
 * Calculate a simple linear regression trend line for scatter data
 * @param {Array} data - Array of {x, y} points
 * @returns {Array|null} Array of trend line points or null if insufficient data
 * @private
 */
function calculateTrendLine(data) {
  try {
    if (!data || data.length < 3) return null;
    
    // Extract x and y values
    const x = data.map(point => point.x);
    const y = data.map(point => point.y);
    
    // Calculate means
    const n = data.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    // Calculate slope and intercept
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += (x[i] - meanX) * (x[i] - meanX);
    }
    
    // Avoid division by zero
    if (denominator === 0) return null;
    
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Find min and max x values
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    
    // Create trend line points
    return [
      { x: minX, y: minX * slope + intercept },
      { x: maxX, y: maxX * slope + intercept }
    ];
  } catch (error) {
    console.error('Error calculating trend line:', error);
    return null;
  }
} 