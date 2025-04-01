/**
 * charts.js
 * Contains functions for creating and updating charts
 */

import { elements, clearElement, showError } from './dom.js';
import { displayData, chartInstances } from './state.js';
import { getText } from './i18n.js';
import { getAllChestTypes } from './dataProcessing.js';

// Default chart options
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 4
    }
  }
};

// Chart color palette
const chartColors = [
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 205, 86, 0.8)',
  'rgba(201, 203, 207, 0.8)',
  'rgba(255, 99, 71, 0.8)',
  'rgba(50, 205, 50, 0.8)',
  'rgba(138, 43, 226, 0.8)'
];

/**
 * Renders all dashboard charts
 */
export function renderDashboardCharts() {
  try {
    console.log('Rendering dashboard charts...');
    
    if (!displayData || displayData.length === 0) {
      console.warn('No display data to render charts');
      return;
    }
    
    // Render the top sources chart
    renderTopSourcesChart();
    
    // Render the score distribution chart
    renderScoreDistributionChart();
    
    // Render the score vs chests scatter chart
    renderScoreVsChestsChart();
    
    // Render the most frequent sources chart
    renderFrequentSourcesChart();
    
    console.log('Dashboard charts rendered successfully');
  } catch (error) {
    console.error('Error rendering dashboard charts:', error);
    showError(getText('status.chartError'));
  }
}

/**
 * Renders the top sources by score chart
 */
function renderTopSourcesChart() {
  try {
    if (!elements.chartTopSourcesContainer) {
      console.warn('Top sources chart container not found');
      return;
    }
    
    // Get all chest types
    const chestTypes = getAllChestTypes();
    
    if (!chestTypes || chestTypes.length === 0) {
      elements.chartTopSourcesContainer.innerHTML = 
        `<p class="no-data">${getText('table.noData')}</p>`;
      return;
    }
    
    // Calculate total score for each chest type
    const chestScores = {};
    
    displayData.forEach(player => {
      chestTypes.forEach(chestType => {
        if (player[chestType] && player[chestType] > 0) {
          // Get score for this chest type from the player's breakdown
          const score = (player.scoreBreakdown && player.scoreBreakdown[chestType]) 
            ? player.scoreBreakdown[chestType].score 
            : 0;
          
          if (score > 0) {
            if (!chestScores[chestType]) {
              chestScores[chestType] = 0;
            }
            chestScores[chestType] += score;
          }
        }
      });
    });
    
    // Sort chest types by score descending
    const sortedChestTypes = Object.keys(chestScores).sort((a, b) => 
      chestScores[b] - chestScores[a]
    );
    
    // Take top 10 and combine the rest as "Others"
    let labels = [];
    let data = [];
    let colors = [];
    
    if (sortedChestTypes.length <= 10) {
      // If 10 or fewer, show all
      labels = sortedChestTypes.map(formatChestTypeForDisplay);
      data = sortedChestTypes.map(type => chestScores[type]);
      colors = chartColors.slice(0, sortedChestTypes.length);
    } else {
      // If more than 10, show top 9 and combine the rest as "Others"
      const top9 = sortedChestTypes.slice(0, 9);
      const others = sortedChestTypes.slice(9);
      
      labels = top9.map(formatChestTypeForDisplay);
      data = top9.map(type => chestScores[type]);
      
      // Calculate total for "Others"
      const othersTotal = others.reduce((total, type) => total + chestScores[type], 0);
      
      // Add "Others" to labels and data
      labels.push(getText('charts.othersCategory'));
      data.push(othersTotal);
      
      // Set colors
      colors = chartColors.slice(0, 10);
    }
    
    // Clear the container and create a canvas
    clearElement(elements.chartTopSourcesContainer);
    const canvas = document.createElement('canvas');
    elements.chartTopSourcesContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstances.topSources) {
      chartInstances.topSources.destroy();
    }
    
    // Create new chart
    chartInstances.topSources = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }]
      },
      options: {
        ...defaultChartOptions,
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: getText('dashboard.chartTopSourcesTitle')
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering top sources chart:', error);
    
    if (elements.chartTopSourcesContainer) {
      elements.chartTopSourcesContainer.innerHTML = 
        `<p class="error">${getText('status.chartError')}</p>`;
    }
  }
}

/**
 * Renders the score distribution chart
 */
function renderScoreDistributionChart() {
  try {
    if (!elements.chartScoreDistContainer) {
      console.warn('Score distribution chart container not found');
      return;
    }
    
    if (!displayData || displayData.length === 0) {
      elements.chartScoreDistContainer.innerHTML = 
        `<p class="no-data">${getText('table.noData')}</p>`;
      return;
    }
    
    // Calculate distribution ranges
    const scores = displayData.map(player => player.TOTAL_SCORE);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    // Create bins for histogram
    const binCount = 8; // Number of bins
    const binSize = Math.ceil((maxScore - minScore) / binCount);
    
    const bins = Array(binCount).fill(0);
    const binLabels = [];
    
    // Create bin labels
    for (let i = 0; i < binCount; i++) {
      const start = minScore + (i * binSize);
      const end = start + binSize - 1;
      binLabels.push(`${start}-${end}`);
    }
    
    // Count scores in each bin
    scores.forEach(score => {
      // Find which bin the score belongs in
      const binIndex = Math.min(
        Math.floor((score - minScore) / binSize),
        binCount - 1 // Ensure we don't go out of bounds
      );
      bins[binIndex]++;
    });
    
    // Clear the container and create a canvas
    clearElement(elements.chartScoreDistContainer);
    const canvas = document.createElement('canvas');
    elements.chartScoreDistContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstances.scoreDist) {
      chartInstances.scoreDist.destroy();
    }
    
    // Create new chart
    chartInstances.scoreDist = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: binLabels,
        datasets: [{
          label: getText('table.headerTotalScore'),
          data: bins,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Player Count'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Score Range'
            }
          }
        },
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: getText('dashboard.chartScoreDistTitle')
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering score distribution chart:', error);
    
    if (elements.chartScoreDistContainer) {
      elements.chartScoreDistContainer.innerHTML = 
        `<p class="error">${getText('status.chartError')}</p>`;
    }
  }
}

/**
 * Renders the score vs chests scatter chart
 */
function renderScoreVsChestsChart() {
  try {
    if (!elements.chartScoreVsChestsContainer) {
      console.warn('Score vs chests chart container not found');
      return;
    }
    
    if (!displayData || displayData.length === 0) {
      elements.chartScoreVsChestsContainer.innerHTML = 
        `<p class="no-data">${getText('table.noData')}</p>`;
      return;
    }
    
    // Prepare scatter data
    const scatterData = displayData.map(player => ({
      x: player.CHEST_COUNT,
      y: player.TOTAL_SCORE,
      label: player.PLAYER
    }));
    
    // Clear the container and create a canvas
    clearElement(elements.chartScoreVsChestsContainer);
    const canvas = document.createElement('canvas');
    elements.chartScoreVsChestsContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstances.scoreVsChests) {
      chartInstances.scoreVsChests.destroy();
    }
    
    // Create new chart
    chartInstances.scoreVsChests = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Players',
          data: scatterData,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          x: {
            title: {
              display: true,
              text: getText('table.headerChestCount')
            },
            beginAtZero: true
          },
          y: {
            title: {
              display: true,
              text: getText('table.headerTotalScore')
            },
            beginAtZero: true
          }
        },
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: getText('dashboard.chartScoreVsChestsTitle')
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const point = scatterData[context.dataIndex];
                return `${point.label}: ${point.y} points, ${point.x} chests`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering score vs chests chart:', error);
    
    if (elements.chartScoreVsChestsContainer) {
      elements.chartScoreVsChestsContainer.innerHTML = 
        `<p class="error">${getText('status.chartError')}</p>`;
    }
  }
}

/**
 * Renders the most frequent sources chart
 */
function renderFrequentSourcesChart() {
  try {
    if (!elements.chartFreqSourcesContainer) {
      console.warn('Frequent sources chart container not found');
      return;
    }
    
    // Get all chest types
    const chestTypes = getAllChestTypes();
    
    if (!chestTypes || chestTypes.length === 0) {
      elements.chartFreqSourcesContainer.innerHTML = 
        `<p class="no-data">${getText('table.noData')}</p>`;
      return;
    }
    
    // Calculate total count for each chest type
    const chestCounts = {};
    
    displayData.forEach(player => {
      chestTypes.forEach(chestType => {
        if (player[chestType] && player[chestType] > 0) {
          if (!chestCounts[chestType]) {
            chestCounts[chestType] = 0;
          }
          chestCounts[chestType] += player[chestType];
        }
      });
    });
    
    // Sort chest types by count descending
    const sortedChestTypes = Object.keys(chestCounts).sort((a, b) => 
      chestCounts[b] - chestCounts[a]
    );
    
    // Take top 10 and combine the rest as "Others"
    let labels = [];
    let data = [];
    let colors = [];
    
    if (sortedChestTypes.length <= 10) {
      // If 10 or fewer, show all
      labels = sortedChestTypes.map(formatChestTypeForDisplay);
      data = sortedChestTypes.map(type => chestCounts[type]);
      colors = chartColors.slice(0, sortedChestTypes.length);
    } else {
      // If more than 10, show top 9 and combine the rest as "Others"
      const top9 = sortedChestTypes.slice(0, 9);
      const others = sortedChestTypes.slice(9);
      
      labels = top9.map(formatChestTypeForDisplay);
      data = top9.map(type => chestCounts[type]);
      
      // Calculate total for "Others"
      const othersTotal = others.reduce((total, type) => total + chestCounts[type], 0);
      
      // Add "Others" to labels and data
      labels.push(getText('charts.othersCategory'));
      data.push(othersTotal);
      
      // Set colors
      colors = chartColors.slice(0, 10);
    }
    
    // Clear the container and create a canvas
    clearElement(elements.chartFreqSourcesContainer);
    const canvas = document.createElement('canvas');
    elements.chartFreqSourcesContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstances.freqSources) {
      chartInstances.freqSources.destroy();
    }
    
    // Create new chart
    chartInstances.freqSources = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1
        }]
      },
      options: {
        ...defaultChartOptions,
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: getText('dashboard.chartFreqSourcesTitle')
          }
        }
      }
    });
  } catch (error) {
    console.error('Error rendering frequent sources chart:', error);
    
    if (elements.chartFreqSourcesContainer) {
      elements.chartFreqSourcesContainer.innerHTML = 
        `<p class="error">${getText('status.chartError')}</p>`;
    }
  }
}

/**
 * Renders a player radar chart
 * @param {Object} player - The player data object
 * @param {HTMLElement} container - The container to render the chart in
 */
export function renderPlayerRadarChart(player, container) {
  try {
    if (!player || !container) {
      console.warn('Missing player data or container for radar chart');
      return;
    }
    
    // Get this player's chest types and scores
    const chestTypes = [];
    const chestScores = [];
    
    // Safety check that scoreBreakdown exists
    if (!player.scoreBreakdown || Object.keys(player.scoreBreakdown).length === 0) {
      container.innerHTML = `<p class="no-data">${getText('charts.notEnoughDataRadar')}</p>`;
      return;
    }
    
    // Get top 5 chest types by score
    Object.entries(player.scoreBreakdown)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 5)
      .forEach(([type, data]) => {
        chestTypes.push(formatChestTypeForDisplay(type));
        chestScores.push(data.score);
      });
    
    // Need at least 3 categories for a radar chart
    if (chestTypes.length < 3) {
      container.innerHTML = `<p class="no-data">${getText('charts.notEnoughDataRadar')}</p>`;
      return;
    }
    
    // Clear the container and create a canvas
    clearElement(container);
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    
    // Create new chart
    const radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chestTypes,
        datasets: [{
          label: player.PLAYER,
          data: chestScores,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 3
        }]
      },
      options: {
        ...defaultChartOptions,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            beginAtZero: true
          }
        },
        plugins: {
          ...defaultChartOptions.plugins,
          title: {
            display: true,
            text: getText('playerDetail.performanceTitle')
          }
        }
      }
    });
    
    // Store the chart instance in the player data for cleanup later
    player.radarChart = radarChart;
    
    return radarChart;
  } catch (error) {
    console.error('Error rendering player radar chart:', error);
    
    if (container) {
      container.innerHTML = `<p class="error">${getText('status.chartError')}</p>`;
    }
    
    return null;
  }
}

/**
 * Formats a chest type string for display
 * @param {string} chestType - The raw chest type from data
 * @returns {string} Formatted chest type for display
 */
function formatChestTypeForDisplay(chestType) {
  try {
    if (!chestType) return '';
    
    // Replace underscores with spaces
    let formatted = chestType.replace(/_/g, ' ');
    
    // Capitalize first letter of each word
    formatted = formatted.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    
    // Replace "Kein" with "Level 0"
    formatted = formatted.replace(/ Kein$/i, ' Level 0');
    
    return formatted;
  } catch (error) {
    console.error('Error formatting chest type:', error);
    return chestType;
  }
}

/**
 * Destroys all chart instances to prevent memory leaks
 */
export function destroyAllCharts() {
  try {
    Object.values(chartInstances).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    
    // Reset chart instances
    Object.keys(chartInstances).forEach(key => {
      chartInstances[key] = null;
    });
    
    console.log('All charts destroyed');
  } catch (error) {
    console.error('Error destroying charts:', error);
  }
}

// Export default object with all chart functions
export default {
  renderDashboardCharts,
  renderPlayerRadarChart,
  destroyAllCharts
}; 