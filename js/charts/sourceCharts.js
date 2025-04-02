/**
 * sourceCharts.js
 *
 * Description: Chart rendering for source-related visualizations
 * Usage:
 *     Import directly: import { renderTopSourcesChart } from './charts/sourceCharts.js';
 */

import { getState, subscribe } from '../state.js';
import { getChartBaseOptions } from './chartConfig.js';
import { createChart, destroyChart } from './chartUtils.js';
import { getText } from '../i18n.js';

/**
 * Render the 'Top Sources by Score' donut chart
 * @param {string} containerId - The ID of the container element
 * @param {string} [instanceKey] - Optional key for the chart instance
 * @returns {Object|null} The chart instance or null on error
 */
export function renderTopSourcesChart(containerId, instanceKey = null) {
  try {
    console.log(`Rendering top sources chart in #${containerId}`);
    
    // Use unique key for chart instance
    const chartKey = instanceKey || 'topSources';
    
    // Get player data from state
    const playerData = getState('playerData') || [];
    
    // Aggregate scores by category
    const categoryScores = {};
    playerData.forEach((player) => {
      Object.entries(player).forEach(([key, value]) => {
        // Skip core columns and non-numeric values
        if (
          !['id', 'name', 'score', 'rank', 'team'].includes(key) && 
          typeof value === 'number' && 
          value > 0
        ) {
          categoryScores[key] = (categoryScores[key] || 0) + value;
        }
      });
    });
    
    // Sort categories by score and prepare data for chart
    const sortedCategories = Object.entries(categoryScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
    
    const topN = 7; // Number of top categories to show individually
    const topCategoriesData = sortedCategories.slice(0, topN);
    const otherScore = sortedCategories
      .slice(topN)
      .reduce((sum, [, score]) => sum + score, 0);
    
    let chartLabels = topCategoriesData.map(
      ([key]) => key.replace(/_/g, " ") // Make labels readable
    );
    let chartSeries = topCategoriesData.map(([, score]) => score);
    
    // Add "Others" category if necessary
    if (otherScore > 0) {
      chartLabels.push(getText("charts.othersCategory") || "Others");
      chartSeries.push(otherScore);
    }
    
    console.log("TopSourcesChart Data:", {
      labels: chartLabels,
      series: chartSeries,
    });
    
    // Get base options and customize for donut chart
    const baseOptions = getChartBaseOptions();
    const options = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'donut',
        height: containerId.includes('modal') ? 350 : 280, // Adjust height based on context
      },
      series: chartSeries,
      labels: chartLabels,
      plotOptions: {
        pie: {
          donut: {
            size: '75%', // Increase donut size to create more space in center
            labels: {
              show: true,
              total: {
                show: true,
                label: getText("table.headerTotalScore") || "Total Score",
                fontSize: '12px',
                fontWeight: 600,
                offsetY: -35, // Move total label significantly higher
                formatter: (w) => {
                  if (!w || !w.globals || !w.globals.seriesTotals) return "0";
                  return new Intl.NumberFormat().format(
                    w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                  );
                },
              },
              value: {
                fontSize: '18px',
                fontWeight: 600,
                offsetY: -3, // Adjust value position
                formatter: (val) => new Intl.NumberFormat().format(val),
              },
              name: {
                offsetY: 30, // Move names further down
                fontSize: '12px', // Smaller font for category name
              },
            },
          },
        },
      },
      legend: {
        ...baseOptions.legend,
        position: 'bottom',
        horizontalAlign: 'center',
        formatter: function (seriesName, opts) {
          const maxLength = 18; // Adjust max length as needed
          return seriesName.length > maxLength
            ? seriesName.substring(0, maxLength - 1) + "…"
            : seriesName;
        },
      },
      tooltip: {
        ...baseOptions.tooltip,
        y: {
          formatter: (value) => new Intl.NumberFormat().format(value),
        },
      },
      // Remove axis settings for pie/donut charts
      xaxis: undefined,
      yaxis: undefined,
    };
    
    // Create and render the chart
    const chart = createChart(containerId, options, chartKey);
    
    // Subscribe to player data changes
    subscribe('playerData', (newData) => {
      console.log('Player data changed, updating top sources chart');
      renderTopSourcesChart(containerId, chartKey);
    });
    
    return chart;
  } catch (error) {
    console.error(`Error rendering top sources chart:`, error);
    return null;
  }
}

/**
 * Render score distribution chart
 * @param {string} containerId - The ID of the container element
 * @param {string} [instanceKey] - Optional key for the chart instance
 * @returns {Object|null} The chart instance or null on error
 */
export function renderScoreDistributionChart(containerId, instanceKey = null) {
  try {
    console.log(`Rendering score distribution chart in #${containerId}`);
    
    // Use unique key for chart instance
    const chartKey = instanceKey || 'scoreDistribution';
    
    // Get display data from state
    const displayData = getState('displayData') || [];
    
    if (displayData.length === 0) {
      console.warn('No display data available for score distribution chart');
      return null;
    }
    
    // Define score ranges for the distribution
    const ranges = [
      { min: 0, max: 500, label: '0-500' },
      { min: 501, max: 1000, label: '501-1000' },
      { min: 1001, max: 1500, label: '1001-1500' },
      { min: 1501, max: 2000, label: '1501-2000' },
      { min: 2001, max: Infinity, label: '2000+' }
    ];
    
    // Count players in each score range
    const distribution = ranges.map(range => {
      return {
        range: range.label,
        count: displayData.filter(player => 
          player.score >= range.min && player.score <= range.max
        ).length
      };
    });
    
    // Format data for ApexCharts
    const chartLabels = distribution.map(item => item.range);
    const chartSeries = [{
      name: getText('charts.players') || 'Players',
      data: distribution.map(item => item.count)
    }];
    
    // Get base options and customize for bar chart
    const baseOptions = getChartBaseOptions();
    const options = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'bar',
        height: containerId.includes('modal') ? 350 : 280,
      },
      series: chartSeries,
      xaxis: {
        ...baseOptions.xaxis,
        categories: chartLabels,
        title: {
          ...baseOptions.xaxis?.title,
          text: getText('charts.scoreRanges') || 'Score Ranges',
        }
      },
      yaxis: {
        ...baseOptions.yaxis,
        title: {
          ...baseOptions.yaxis?.title,
          text: getText('charts.playerCount') || 'Player Count',
        },
        // Use integer formatter for player count
        labels: {
          ...baseOptions.yaxis?.labels,
          formatter: (val) => Math.round(val)
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          columnWidth: '70%',
          distributed: false,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val > 0 ? val : '',
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      tooltip: {
        ...baseOptions.tooltip,
        y: {
          formatter: (value) => Math.round(value),
          title: {
            formatter: (seriesName) => seriesName,
          },
        },
      },
    };
    
    // Create and render the chart
    const chart = createChart(containerId, options, chartKey);
    
    // Subscribe to display data changes
    subscribe('displayData', (newData) => {
      console.log('Display data changed, updating score distribution chart');
      renderScoreDistributionChart(containerId, chartKey);
    });
    
    return chart;
  } catch (error) {
    console.error(`Error rendering score distribution chart:`, error);
    return null;
  }
} 