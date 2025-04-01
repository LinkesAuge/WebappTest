/**
 * history.js
 * Handles historical data loading and visualization
 */

import { elements, showView, showLoading, hideLoading, showError, createElement, clearElement } from './dom.js';
import { loadAvailableWeeks, loadWeekData } from './dataLoading.js';
import { getText } from './i18n.js';
import { formatDateRange } from './utils.js';
import { renderDashboardCharts } from './charts.js';
import { availableWeeks, historicalData, currentWeek } from './state.js';

// Track chart instances to properly destroy and recreate them
export const chartInstances = {
  scoreTrend: null,
  chestsTrend: null,
  topPlayers: null,
  categoryTrend: null
};

// Stores calculated stats from historical data
export let historicalStats = null;

/**
 * Renders the history view
 */
export function renderHistoryView() {
  try {
    console.log('Rendering history view...');
    renderHistoryViewContent();
  } catch (error) {
    console.error('Error rendering history view:', error);
  }
}

/**
 * Renders the history view content
 */
export function renderHistoryViewContent() {
  try {
    updateHistorySummary();
  } catch (error) {
    console.error('Error rendering history content:', error);
  }
}

/**
 * Updates the history summary
 */
export function updateHistorySummary() {
  try {
    if (!historicalStats) {
      console.warn('No historical stats available');
      return;
    }
    
    renderWeeklyTotalsTable(historicalStats.weeklyTotals);
  } catch (error) {
    console.error('Error updating history summary:', error);
  }
}

/**
 * Renders the weekly totals table with summary data for each week
 */
export function renderWeeklyTotalsTable() {
  try {
    console.log('Rendering weekly totals table...');
    
    if (!elements.weeklyTotalsTable) {
      console.error('Weekly totals table element not found');
      return;
    }
    
    // Clear the table first
    clearElement(elements.weeklyTotalsTable);
    
    // Check if we have historical data
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      elements.weeklyTotalsTable.innerHTML = `
        <table class="min-w-full divide-y divide-slate-700">
          <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekHeader">Week</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekNumber">#</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.playerCount">Players</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.chestCount">Chests</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.scoreTotal">Total Score</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.avgScore">Avg Score</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.topSource">Top Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center py-4 text-slate-500">
                ${getText('history.noWeeklyData')}
              </td>
            </tr>
          </tbody>
        </table>
      `;
      console.warn('No historical data available for weekly totals table');
      return;
    }
    
    // Sort weeks in descending order (newest first)
    const sortedWeeks = [...historicalData].sort((a, b) => {
      return new Date(b.weekEnd) - new Date(a.weekEnd);
    });
    
    // Create table with header
    let tableHTML = `
      <table class="min-w-full divide-y divide-slate-700">
        <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekHeader">Week</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekNumber">#</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.playerCount">Players</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.chestCount">Chests</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.scoreTotal">Total Score</th>
            <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.avgScore">Avg Score</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.topSource">Top Source</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    // Create a row for each week
    sortedWeeks.forEach(week => {
      const { 
        weekStart, 
        weekEnd, 
        weekNumber,
        playerCount = 0,
        totalChests = 0,
        totalScore = 0,
        averageScore = 0,
        mostCommonSource = { name: '-', count: 0 }
      } = week;
      
      const startDate = new Date(weekStart);
      const endDate = new Date(weekEnd);
      
      // Format date range (e.g., "Apr 10-16, 2023")
      const formattedDateRange = formatDateRange(startDate, endDate);
      
      // Create row HTML
      tableHTML += `
        <tr class="border-b border-slate-700/50 hover:bg-slate-800/50">
          <td class="py-3 px-3">${formattedDateRange}</td>
          <td class="py-3 px-3 text-right">${weekNumber}</td>
          <td class="py-3 px-3 text-right">${formatNumber(playerCount)}</td>
          <td class="py-3 px-3 text-right">${formatNumber(totalChests)}</td>
          <td class="py-3 px-3 text-right">${formatNumber(totalScore)}</td>
          <td class="py-3 px-3 text-right">${formatNumber(averageScore)}</td>
          <td class="py-3 px-3">${mostCommonSource?.name || '-'} (${formatNumber(mostCommonSource?.count || 0)})</td>
        </tr>
      `;
    });
    
    // Close table
    tableHTML += `
        </tbody>
      </table>
    `;
    
    // If no rows were generated, show "no data" message
    if (sortedWeeks.length === 0) {
      tableHTML = `
        <table class="min-w-full divide-y divide-slate-700">
          <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekHeader">Week</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekNumber">#</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.playerCount">Players</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.chestCount">Chests</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.scoreTotal">Total Score</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.avgScore">Avg Score</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.topSource">Top Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center py-4 text-slate-500">
                ${getText('history.noWeeklyData')}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
    
    // Update the table with the generated content
    elements.weeklyTotalsTable.innerHTML = tableHTML;
    console.log(`Rendered weekly totals table with ${sortedWeeks.length} weeks`);
  } catch (error) {
    console.error('Error rendering weekly totals table:', error);
    
    if (elements.weeklyTotalsTable) {
      elements.weeklyTotalsTable.innerHTML = `
        <table class="min-w-full divide-y divide-slate-700">
          <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekHeader">Week</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekNumber">#</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.playerCount">Players</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.chestCount">Chests</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.scoreTotal">Total Score</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.avgScore">Avg Score</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.topSource">Top Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center py-4 text-slate-500">
                ${getText('error.dataRendering')}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
  }
}

/**
 * Renders a chart showing score trends across weeks
 */
export function renderScoreTrendChart() {
  try {
    console.log('Rendering score trend chart...');
    
    if (!elements.scoreTrendChartContainer) {
      console.error('Score trend chart container not found');
      return;
    }
    
    // Clear previous chart
    clearElement(elements.scoreTrendChartContainer);
    
    // Destroy previous chart instance if it exists
    if (chartInstances.scoreTrend) {
      chartInstances.scoreTrend.destroy();
      chartInstances.scoreTrend = null;
    }
    
    // Check if we have data
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      elements.scoreTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.noTrendData')}</p>`;
      console.warn('No historical data available for score trend chart');
      return;
    }
    
    // We need at least two weeks to show a trend
    if (historicalData.length < 2) {
      elements.scoreTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.notEnoughData')}</p>`;
      console.warn('Not enough historical data points for trend chart');
      return;
    }
    
    // Sort weeks chronologically (oldest to newest)
    const sortedWeeks = [...historicalData].sort((a, b) => {
      return new Date(a.weekStart) - new Date(b.weekStart);
    });
    
    // Extract data for the chart
    const labels = sortedWeeks.map(week => {
      const startDate = new Date(week.weekStart);
      const endDate = new Date(week.weekEnd);
      return formatDateRange(startDate, endDate);
    });
    
    const totalScores = sortedWeeks.map(week => week.totalScore || 0);
    const averageScores = sortedWeeks.map(week => week.averageScore || 0);
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    elements.scoreTrendChartContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    chartInstances.scoreTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: getText('history.totalScore'),
            data: totalScores,
            borderColor: 'rgba(59, 130, 246, 1)', // blue-500
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.2,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: getText('history.averageScore'),
            data: averageScores,
            borderColor: 'rgba(20, 184, 166, 1)', // teal-500
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
            borderWidth: 2,
            tension: 0.2,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: getText('history.week')
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: getText('history.totalScore')
            },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: getText('history.averageScore')
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
    
    console.log('Score trend chart rendered successfully');
  } catch (error) {
    console.error('Error rendering score trend chart:', error);
    
    if (elements.scoreTrendChartContainer) {
      elements.scoreTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('error.chartRendering')}</p>`;
    }
  }
}

/**
 * Renders a chart showing chest trends across weeks
 */
export function renderChestsTrendChart() {
  try {
    console.log('Rendering chests trend chart...');
    
    if (!elements.chestsTrendChartContainer) {
      console.error('Chests trend chart container not found');
      return;
    }
    
    // Clear previous chart
    clearElement(elements.chestsTrendChartContainer);
    
    // Destroy previous chart instance if it exists
    if (chartInstances.chestsTrend) {
      chartInstances.chestsTrend.destroy();
      chartInstances.chestsTrend = null;
    }
    
    // Check if we have data
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      elements.chestsTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.noTrendData')}</p>`;
      console.warn('No historical data available for chests trend chart');
      return;
    }
    
    // We need at least two weeks to show a trend
    if (historicalData.length < 2) {
      elements.chestsTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.notEnoughData')}</p>`;
      console.warn('Not enough historical data points for trend chart');
      return;
    }
    
    // Sort weeks chronologically (oldest to newest)
    const sortedWeeks = [...historicalData].sort((a, b) => {
      return new Date(a.weekStart) - new Date(b.weekStart);
    });
    
    // Extract data for the chart
    const labels = sortedWeeks.map(week => {
      const startDate = new Date(week.weekStart);
      const endDate = new Date(week.weekEnd);
      return formatDateRange(startDate, endDate);
    });
    
    const totalChests = sortedWeeks.map(week => week.totalChests || 0);
    const playersCount = sortedWeeks.map(week => week.playerCount || 0);
    const averageChests = sortedWeeks.map(week => {
      if (week.playerCount && week.playerCount > 0 && week.totalChests) {
        return week.totalChests / week.playerCount;
      }
      return 0;
    });
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    elements.chestsTrendChartContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    chartInstances.chestsTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: getText('history.totalChests'),
            data: totalChests,
            borderColor: 'rgba(234, 88, 12, 1)', // orange-600
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
            borderWidth: 2,
            tension: 0.2,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: getText('history.averageChests'),
            data: averageChests,
            borderColor: 'rgba(217, 119, 6, 1)', // amber-600
            backgroundColor: 'rgba(217, 119, 6, 0.1)',
            borderWidth: 2,
            tension: 0.2,
            fill: true,
            yAxisID: 'y1'
          },
          {
            label: getText('history.playerCount'),
            data: playersCount,
            borderColor: 'rgba(139, 92, 246, 1)', // violet-500
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            tension: 0.2,
            fill: true,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: getText('history.week')
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: getText('history.totalChests')
            },
            beginAtZero: true
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: getText('history.averageChests')
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          },
          y2: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: getText('history.playerCount')
            },
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
    
    console.log('Chests trend chart rendered successfully');
  } catch (error) {
    console.error('Error rendering chests trend chart:', error);
    
    if (elements.chestsTrendChartContainer) {
      elements.chestsTrendChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('error.chartRendering')}</p>`;
    }
  }
}

/**
 * Renders a chart showing top players performance across weeks
 */
export function renderTopPlayersChart() {
  try {
    console.log('Rendering top players chart...');
    
    if (!elements.topPlayersChartContainer) {
      console.error('Top players chart container not found');
      return;
    }
    
    // Clear previous chart
    clearElement(elements.topPlayersChartContainer);
    
    // Destroy previous chart instance if it exists
    if (chartInstances.topPlayers) {
      chartInstances.topPlayers.destroy();
      chartInstances.topPlayers = null;
    }
    
    // Check if we have data
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      elements.topPlayersChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.noTrendData')}</p>`;
      console.warn('No historical data available for top players chart');
      return;
    }
    
    // Find the top 5 players consistently appearing across weeks
    const playerFrequency = {};
    const playerScores = {};
    
    // Count player occurrences and track scores across weeks
    historicalData.forEach(week => {
      if (week.topPlayers && Array.isArray(week.topPlayers)) {
        week.topPlayers.forEach(player => {
          if (player.name) {
            // Count appearances
            playerFrequency[player.name] = (playerFrequency[player.name] || 0) + 1;
            
            // Track scores (as an array of scores per week)
            if (!playerScores[player.name]) {
              playerScores[player.name] = [];
            }
            playerScores[player.name].push({
              week: formatDateRange(new Date(week.weekStart), new Date(week.weekEnd)),
              score: player.score || 0
            });
          }
        });
      }
    });
    
    // Convert to array and sort by frequency, then by average score
    const players = Object.keys(playerFrequency)
      .map(name => {
        const scores = playerScores[name] || [];
        const totalScore = scores.reduce((sum, entry) => sum + entry.score, 0);
        const avgScore = scores.length > 0 ? totalScore / scores.length : 0;
        
        return {
          name,
          frequency: playerFrequency[name],
          avgScore,
          scores
        };
      })
      .sort((a, b) => {
        // First by frequency
        if (b.frequency !== a.frequency) {
          return b.frequency - a.frequency;
        }
        // Then by average score
        return b.avgScore - a.avgScore;
      })
      .slice(0, 5); // Take top 5
    
    // If no players found, show message
    if (players.length === 0) {
      elements.topPlayersChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('history.noPlayerData')}</p>`;
      console.warn('No player data found for top players chart');
      return;
    }
    
    // Sort all weeks chronologically
    const sortedWeeks = [...historicalData].sort((a, b) => {
      return new Date(a.weekStart) - new Date(b.weekStart);
    });
    
    // Get all week labels
    const weekLabels = sortedWeeks.map(week => 
      formatDateRange(new Date(week.weekStart), new Date(week.weekEnd))
    );
    
    // Create datasets for each player
    const datasets = players.map((player, index) => {
      // Generate color based on index
      const hue = (index * 60) % 360; // Space colors evenly around the color wheel
      const color = `hsl(${hue}, 70%, 50%)`;
      const backgroundColor = `hsla(${hue}, 70%, 50%, 0.2)`;
      
      // Create data array with scores for each week
      const data = weekLabels.map(weekLabel => {
        const scoreEntry = player.scores.find(s => s.week === weekLabel);
        return scoreEntry ? scoreEntry.score : null; // null will create a gap in the line
      });
      
      return {
        label: player.name,
        data,
        borderColor: color,
        backgroundColor,
        borderWidth: 2,
        tension: 0.2,
        spanGaps: true, // Connect points even if there are gaps
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    elements.topPlayersChartContainer.appendChild(canvas);
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    chartInstances.topPlayers = new Chart(ctx, {
      type: 'line',
      data: {
        labels: weekLabels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              usePointStyle: true
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              },
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${formatNumber(value)}`;
              },
              footer: function(tooltipItems) {
                const player = players.find(p => p.name === tooltipItems[0].dataset.label);
                if (player) {
                  return getText('history.appearances') + ': ' + player.frequency;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: getText('history.week')
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            title: {
              display: true,
              text: getText('history.score')
            },
            beginAtZero: true
          }
        }
      }
    });
    
    console.log(`Top players chart rendered with ${players.length} players`);
  } catch (error) {
    console.error('Error rendering top players chart:', error);
    
    if (elements.topPlayersChartContainer) {
      elements.topPlayersChartContainer.innerHTML = 
        `<p class="text-slate-500 text-center py-8">${getText('error.chartRendering')}</p>`;
    }
  }
}

/**
 * Renders the category trend chart
 * @param {Object} categoryTrends - The category trends data
 */
export function renderCategoryTrendChart(categoryTrends) {
  try {
    console.log('Rendering category trend chart...');
    
    // Check if container element exists
    const chartContainer = elements.categoryTrendChartContainer;
    if (!chartContainer) {
      console.error('Category trend chart container not found');
      return;
    }
    
    // Get category dropdown
    const categorySelect = elements.trendCategorySelect;
    
    // Clear previous chart (if any)
    chartContainer.innerHTML = '';
    
    // Chart instance reference for proper cleanup
    if (chartInstances.categoryTrend) {
      try {
        chartInstances.categoryTrend.destroy();
      } catch (error) {
        console.warn('Error destroying previous category trend chart:', error);
      }
      chartInstances.categoryTrend = null;
    }
    
    // Check if we have data to display
    if (!categoryTrends || Object.keys(categoryTrends).length === 0) {
      console.warn('No category trends data available');
      chartContainer.innerHTML = `<p class="text-slate-500 text-center py-8">${getText('history.noCategoryData')}</p>`;
      
      // Disable category dropdown
      if (categorySelect) {
        categorySelect.innerHTML = `<option value="" disabled selected>${getText('history.noCategories')}</option>`;
        categorySelect.disabled = true;
      }
      
      return;
    }
    
    // Get all categories
    const categories = Object.keys(categoryTrends);
    
    // If no categories, show message
    if (categories.length === 0) {
      console.warn('No categories found for trend chart');
      chartContainer.innerHTML = `<p class="text-slate-500 text-center py-8">${getText('history.noCategories')}</p>`;
      
      // Disable category dropdown
      if (categorySelect) {
        categorySelect.innerHTML = `<option value="" disabled selected>${getText('history.noCategories')}</option>`;
        categorySelect.disabled = true;
      }
      
      return;
    }
    
    // Populate category dropdown
    if (categorySelect) {
      categorySelect.innerHTML = '';
      categorySelect.disabled = false;
      
      // Add options for each category
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.replace(/_/g, ' '); // Format for display
        categorySelect.appendChild(option);
      });
      
      // Set up change handler if not already
      if (!categorySelect.dataset.handlerAttached) {
        categorySelect.addEventListener('change', (event) => {
          const selectedCategory = event.target.value;
          if (selectedCategory) {
            renderCategoryTrendChart(categoryTrends);
          }
        });
        categorySelect.dataset.handlerAttached = 'true';
      }
    }
    
    // Get selected category (or first category if none selected)
    const selectedCategory = categorySelect ? categorySelect.value : categories[0];
    
    // If no category selected, prompt user
    if (!selectedCategory) {
      chartContainer.innerHTML = `<p class="text-slate-500 text-center py-8">${getText('history.selectCategory')}</p>`;
      return;
    }
    
    // Get data for the selected category
    const categoryData = categoryTrends[selectedCategory];
    
    // Check if we have data for this category
    if (!categoryData || !categoryData.weeks || Object.keys(categoryData.weeks).length === 0) {
      console.warn(`No data for selected category: ${selectedCategory}`);
      chartContainer.innerHTML = `<p class="text-slate-500 text-center py-8">${getText('history.noCategoryData')}</p>`;
      return;
    }
    
    // Get weeks
    const weeks = Object.keys(categoryData.weeks);
    
    // Sort weeks chronologically
    weeks.sort((a, b) => {
      // Try to extract numbers from week names
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      // Fallback to string comparison
      return a.localeCompare(b);
    });
    
    // Format labels as "Week X" or using date range if available
    const labels = weeks.map(week => {
      if (categoryData.dateRanges && categoryData.dateRanges[week]) {
        const { start, end } = categoryData.dateRanges[week];
        if (start && end) {
          return formatDateRange(start, end);
        }
      }
      return `Week ${week}`;
    });
    
    // Get total scores for each week
    const totalScores = weeks.map(week => categoryData.weeks[week].totalScore || 0);
    
    // Get average scores for each week
    const avgScores = weeks.map(week => categoryData.weeks[week].averageScore || 0);
    
    // Get frequency for each week (how many players had this category)
    const frequency = weeks.map(week => categoryData.weeks[week].frequency || 0);
    
    // Get percentage for each week (what % of players had this category)
    const percentage = weeks.map(week => {
      const freq = categoryData.weeks[week].frequency || 0;
      const total = categoryData.weeks[week].totalPlayers || 1; // Avoid division by zero
      return (freq / total) * 100;
    });
    
    // Create canvas for chart
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    
    // Get the chart context
    const ctx = canvas.getContext('2d');
    
    // Set up chart configuration
    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: getText('history.categoryTotalScore'),
            data: totalScores,
            backgroundColor: 'rgba(249, 115, 22, 0.2)', // orange with transparency
            borderColor: 'rgba(249, 115, 22, 1)', // solid orange
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y-total',
            fill: false
          },
          {
            label: getText('history.categoryAvgScore'),
            data: avgScores,
            backgroundColor: 'rgba(56, 189, 248, 0.2)', // blue with transparency
            borderColor: 'rgba(56, 189, 248, 1)', // solid blue
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y-average',
            fill: false
          },
          {
            label: getText('history.categoryFrequency'),
            data: frequency,
            backgroundColor: 'rgba(139, 92, 246, 0.2)', // purple with transparency
            borderColor: 'rgba(139, 92, 246, 1)', // solid purple
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y-frequency',
            fill: false
          },
          {
            label: getText('history.categoryPercentage'),
            data: percentage,
            backgroundColor: 'rgba(34, 197, 94, 0.2)', // green with transparency
            borderColor: 'rgba(34, 197, 94, 1)', // solid green
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y-percentage',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
          title: {
            display: true,
            text: `${getText('history.categoryTrendTitle')}: ${selectedCategory.replace(/_/g, ' ')}`,
            color: 'rgba(255, 255, 255, 0.87)',
            font: {
              size: 16
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.87)'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                
                if (context.datasetIndex === 3) { // Percentage dataset
                  return `${label}: ${value.toFixed(1)}%`;
                }
                return `${label}: ${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          },
          'y-total': {
            type: 'linear',
            position: 'left',
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(249, 115, 22, 1)',
              callback: function(value) {
                return value.toLocaleString();
              }
            },
            title: {
              display: true,
              text: getText('history.totalScore'),
              color: 'rgba(249, 115, 22, 1)'
            }
          },
          'y-average': {
            type: 'linear',
            position: 'right',
            display: false, // Hidden by default
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(56, 189, 248, 1)',
              callback: function(value) {
                return value.toLocaleString();
              }
            },
            title: {
              display: true,
              text: getText('history.avgScore'),
              color: 'rgba(56, 189, 248, 1)'
            }
          },
          'y-frequency': {
            type: 'linear',
            position: 'right',
            display: true,
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(139, 92, 246, 1)',
              callback: function(value) {
                return value.toLocaleString();
              }
            },
            title: {
              display: true,
              text: getText('history.frequency'),
              color: 'rgba(139, 92, 246, 1)'
            }
          },
          'y-percentage': {
            type: 'linear',
            position: 'right',
            display: false, // Hidden by default
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(34, 197, 94, 1)',
              callback: function(value) {
                return `${value.toFixed(1)}%`;
              }
            },
            title: {
              display: true,
              text: getText('history.percentage'),
              color: 'rgba(34, 197, 94, 1)'
            },
            min: 0,
            max: 100
          }
        }
      }
    };
    
    // Create the chart
    chartInstances.categoryTrend = new Chart(ctx, chartConfig);
    
    console.log(`Category trend chart rendered for ${selectedCategory}`);
  } catch (error) {
    console.error('Error rendering category trend chart:', error);
    
    // Display error message in container
    if (elements.categoryTrendChartContainer) {
      elements.categoryTrendChartContainer.innerHTML = `<p class="text-red-500 text-center py-8">${getText('history.chartError')}</p>`;
    }
  }
}

/**
 * Populates the week selector
 */
export function populateWeekSelector() {
  try {
    console.log('Populating week selector...');
    
    // Check if the week selector element exists - FIXED: use weekSelector not weekSelect
    const weekSelect = document.getElementById('weekSelector');
    if (!weekSelect) {
      console.error('Week selector element not found');
      return;
    }
    
    // Get navigation buttons
    const prevWeekBtn = elements.prevWeekBtn;
    const nextWeekBtn = elements.nextWeekBtn;
    const latestWeekIndicator = elements.latestWeekIndicator;
    
    // Clear previous options
    weekSelect.innerHTML = '';
    
    // Check if there are available weeks
    if (!availableWeeks || availableWeeks.length === 0) {
      // Add a placeholder option
      const option = document.createElement('option');
      option.value = '';
      option.textContent = getText('weekSelector.noWeeks');
      option.disabled = true;
      option.selected = true;
      weekSelect.appendChild(option);
      
      // Disable navigation buttons
      if (prevWeekBtn) prevWeekBtn.disabled = true;
      if (nextWeekBtn) nextWeekBtn.disabled = true;
      if (latestWeekIndicator) latestWeekIndicator.classList.add('hidden');
      
      return;
    }
    
    // Create options for each week
    const fragment = document.createDocumentFragment();
    
    // Sort weeks by their week number or date (descending)
    const sortedWeeks = [...availableWeeks].sort((a, b) => {
      // Try to sort by week number first
      const weekA = parseInt(a.week, 10);
      const weekB = parseInt(b.week, 10);
      
      // If both are valid numbers, compare them
      if (!isNaN(weekA) && !isNaN(weekB)) {
        return weekB - weekA; // Descending order (most recent first)
      }
      
      // Fall back to comparing end dates if available
      if (a.endDate && b.endDate) {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          return dateB - dateA; // Descending order (most recent first)
        }
      }
      
      // As a last resort, compare the week strings
      return String(b.week).localeCompare(String(a.week));
    });
    
    // Create options for each week
    sortedWeeks.forEach(week => {
      const option = document.createElement('option');
      option.value = week.week;
      
      // Format the date range for display
      let dateRangeText = '';
      if (week.startDate && week.endDate) {
        dateRangeText = formatDateRange(week.startDate, week.endDate);
      }
      
      // Format the option text as "Week X (Apr 10-16, 2023)"
      option.textContent = dateRangeText 
        ? `${getText('weekSelector.week')} ${week.week} (${dateRangeText})` 
        : `${getText('weekSelector.week')} ${week.week}`;
      
      // Mark this option as selected if it matches the current week
      if (currentWeek && currentWeek.id === week.week) {
        option.selected = true;
      }
      
      fragment.appendChild(option);
    });
    
    // Add the options to the select element
    weekSelect.appendChild(fragment);

    // Also populate the mobile week selector if it exists
    const mobileWeekSelect = document.getElementById('mobileWeekSelector');
    if (mobileWeekSelect) {
      // Clone the options to the mobile selector
      mobileWeekSelect.innerHTML = weekSelect.innerHTML;
    }
    
    // Handle navigation button states
    updateWeekSelectorNavigation();
    
    console.log('Week selector populated successfully');
  } catch (error) {
    console.error('Error populating week selector:', error);
  }
}

/**
 * Updates the week selector navigation buttons based on the current selection
 */
function updateWeekSelectorNavigation() {
  try {
    const weekSelect = document.getElementById('weekSelector');
    const prevWeekBtn = document.getElementById('prevWeekBtn');
    const nextWeekBtn = document.getElementById('nextWeekBtn');
    const latestWeekIndicator = document.getElementById('latestWeekIndicator');
    
    if (!weekSelect || !prevWeekBtn || !nextWeekBtn) {
      console.warn('Week selector navigation elements not found');
      return;
    }
    
    // Get the selected index and option count
    const selectedIndex = weekSelect.selectedIndex;
    const optionCount = weekSelect.options.length;
    
    console.log(`Week selector navigation: index ${selectedIndex}, count ${optionCount}`);
    
    // Enable/disable previous button
    prevWeekBtn.disabled = selectedIndex <= 0;
    prevWeekBtn.classList.toggle('opacity-50', selectedIndex <= 0);
    
    // Enable/disable next button
    nextWeekBtn.disabled = selectedIndex >= optionCount - 1;
    nextWeekBtn.classList.toggle('opacity-50', selectedIndex >= optionCount - 1);
    
    // Show/hide latest indicator if this is the most recent week
    if (latestWeekIndicator) {
      if (selectedIndex === 0) {
        latestWeekIndicator.classList.remove('hidden');
      } else {
        latestWeekIndicator.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error updating week selector navigation:', error);
  }
}

/**
 * Handles week change events
 * @param {Event} event - The change event
 */
export async function handleWeekChange(event) {
  try {
    // Get the selected week ID
    const selectedWeekId = event.target.value;
    
    if (!selectedWeekId) {
      console.warn('No week selected');
      return;
    }
    
    console.log(`Week changed to: ${selectedWeekId}`);
    
    // Find the selected week in available weeks
    const selectedWeek = availableWeeks.find(week => week.week === selectedWeekId);
    if (!selectedWeek) {
      console.error(`Selected week ${selectedWeekId} not found in available weeks`);
      return;
    }
    
    // Show loading indicator
    showLoading(getText('weekSelector.loading', { week: selectedWeekId }));
    
    try {
      // Load the selected week's data
      const weekData = await loadWeekData(selectedWeek);
      
      if (!weekData || weekData.length === 0) {
        console.warn(`No data available for week ${selectedWeekId}`);
        showError(getText('weekSelector.noData', { week: selectedWeekId }));
        return;
      }
      
      // Update current week state
      currentWeek.id = selectedWeek.week;
      currentWeek.data = weekData;
      currentWeek.dateRange = {
        start: selectedWeek.startDate,
        end: selectedWeek.endDate
      };
      
      // Update the UI with the new data
      document.dispatchEvent(new CustomEvent('weekChanged', { 
        detail: { 
          week: selectedWeek, 
          data: weekData 
        } 
      }));
      
      // Update navigation button states
      updateWeekSelectorNavigation();
      
      console.log(`Successfully loaded data for week ${selectedWeekId}`);
    } catch (error) {
      console.error(`Error loading data for week ${selectedWeekId}:`, error);
      showError(getText('weekSelector.loadError', { week: selectedWeekId }));
    } finally {
      // Hide loading indicator
      hideLoading();
    }
  } catch (error) {
    console.error('Error handling week change:', error);
    hideLoading();
    showError(getText('status.error'));
  }
}

/**
 * Initializes the weekly data system, loading weeks and historical data
 * @returns {Promise<boolean>} - Whether initialization was successful
 */
export async function initWeeklyDataSystem() {
  try {
    console.log('Initializing weekly data system...');
    
    // First try to load weeks data
    const weeksDataLoaded = await initializeWeeklyData();
    
    if (!weeksDataLoaded) {
      console.warn('Failed to load weeks data, historical view may be limited');
    }
    
    // Load historical data for available weeks
    const historicalDataLoaded = await loadHistoricalData();
    
    if (!historicalDataLoaded) {
      console.warn('Failed to load historical data');
      
      // Show message in UI
      if (elements.historicalViewContainer) {
        elements.historicalViewContainer.innerHTML = `
          <div class="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded my-4">
            <p>${getText('error.historicalDataLoad')}</p>
          </div>
        `;
      }
      return false;
    }
    
    // Initialize the historical view with loaded data
    initializeHistoricalView();
    
    // Set up handlers for the week selector
    if (elements.weekSelector) {
      elements.weekSelector.addEventListener('change', handleWeekChange);
    }
    
    // Add tab event listeners if needed
    if (elements.analyticsViewTabs) {
      const tabs = elements.analyticsViewTabs.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', handleAnalyticsTabChange);
      });
    }
    
    console.log('Weekly data system initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing weekly data system:', error);
    
    // Show error message in UI
    if (elements.historicalViewContainer) {
      elements.historicalViewContainer.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          <p>${getText('error.weeklyDataSystem')}</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
    return false;
  }
}

/**
 * Handles switching between analytics view tabs
 * @param {Event} event - The click event
 */
function handleAnalyticsTabChange(event) {
  try {
    const clickedTab = event.currentTarget;
    if (!clickedTab) return;
    
    // Get the target view ID from the tab's data attribute
    const targetView = clickedTab.dataset.view;
    if (!targetView) return;
    
    // Get all tabs and content sections
    const tabs = elements.analyticsViewTabs.querySelectorAll('.tab');
    const contentViews = document.querySelectorAll('.analytics-view-content');
    
    // Deactivate all tabs and hide all content
    tabs.forEach(tab => tab.classList.remove('active'));
    contentViews.forEach(content => content.classList.add('hidden'));
    
    // Activate clicked tab
    clickedTab.classList.add('active');
    
    // Show target content
    const targetContent = document.getElementById(targetView);
    if (targetContent) {
      targetContent.classList.remove('hidden');
    }
    
    console.log(`Switched to analytics tab: ${targetView}`);
  } catch (error) {
    console.error('Error handling analytics tab change:', error);
  }
}

/**
 * Resets the analytics view by destroying charts and clearing containers
 */
export function resetAnalyticsView() {
  try {
    console.log('Resetting analytics view...');
    
    // Destroy any existing chart instances
    Object.keys(chartInstances).forEach(key => {
      if (chartInstances[key]) {
        chartInstances[key].destroy();
        chartInstances[key] = null;
      }
    });
    
    // Clear chart containers
    const containers = [
      elements.scoreTrendChartContainer,
      elements.chestsTrendChartContainer,
      elements.topPlayersChartContainer,
      elements.categoryTrendChartContainer,
      elements.weeklyTotalsTable
    ];
    
    containers.forEach(container => {
      if (container) {
        clearElement(container);
      }
    });
    
    console.log('Analytics view reset successfully');
  } catch (error) {
    console.error('Error resetting analytics view:', error);
  }
}

/**
 * Initializes weekly data by loading available weeks
 * @returns {Promise<boolean>} Success status
 */
export async function initializeWeeklyData() {
  try {
    console.log('Initializing weekly data...');
    
    // First, load available weeks
    const weeksLoaded = await loadAvailableWeeks();
    
    // Check if we have available weeks
    if (!weeksLoaded || !availableWeeks || availableWeeks.length === 0) {
      console.warn('No available weeks found');
      
      if (elements.weekSelector) {
        // Clear and disable week selector
        elements.weekSelector.innerHTML = '';
        
        // Add a placeholder option
        const option = document.createElement('option');
        option.value = '';
        option.textContent = getText('weekSelector.noWeeks');
        option.disabled = true;
        option.selected = true;
        elements.weekSelector.appendChild(option);
        elements.weekSelector.disabled = true;
      }
      
      // Show error message
      showError(getText('no_weeks_found'));
      return false;
    }
    
    // Determine the latest week
    const latestWeek = determineLatestWeek(availableWeeks);
    
    // Initialize currentWeek if it doesn't exist or ensure it's an object
    if (!currentWeek) {
      console.log('Creating currentWeek object');
      // Use the exported variable instead of creating a new global
      currentWeek = {};
    }
    
    // Update the week selector (if it exists)
    populateWeekSelector();
    
    // Select the latest week if no week is currently selected
    if (latestWeek) {
      console.log(`Setting latest week: ${latestWeek.week}`);
      
      // Update current week in state
      try {
        currentWeek.id = latestWeek.week;
        
        // Load and set data for this week
        if (latestWeek.file) {
          const weekData = await loadWeekData(latestWeek.file);
          if (weekData) {
            currentWeek.data = weekData;
            // Update UI with the data
            updateUIWithWeekData(weekData);
          }
        }
        
        // Change the week selector value if it exists
        const weekSelector = document.getElementById('weekSelector');
        if (weekSelector) {
          weekSelector.value = latestWeek.week;
          
          // Trigger a change event on the selector
          const event = new Event('change');
          weekSelector.dispatchEvent(event);
        }
      } catch (error) {
        console.error(`Error setting latest week: ${error.message}`);
      }
    }
    
    console.log('Weekly data initialized successfully');
    return true;
  } catch (error) {
    console.error(`Error initializing weekly data: ${error}`);
    return false;
  }
}

/**
 * Determines the latest week from available weeks
 * @param {Array} weeks - Array of week objects
 * @returns {Object|null} The latest week, or null if no weeks found
 */
export function determineLatestWeek(weeks) {
  try {
    if (!weeks || !Array.isArray(weeks) || weeks.length === 0) {
      console.warn('No weeks provided to determineLatestWeek');
      return null;
    }
    
    console.log(`Determining latest week from ${weeks.length} weeks...`);
    
    // Try to sort by end date first (most reliable)
    if (weeks[0].endDate) {
      const sortedByDate = [...weeks].sort((a, b) => {
        if (!a.endDate) return 1;  // a goes after b if a has no end date
        if (!b.endDate) return -1; // a goes before b if b has no end date
        
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        
        if (isNaN(dateA.getTime())) return 1;  // a goes after b if a has invalid date
        if (isNaN(dateB.getTime())) return -1; // a goes before b if b has invalid date
        
        return dateB - dateA; // Sort in descending order (newest first)
      });
      
      console.log(`Latest week by date: ${sortedByDate[0].week}`);
      return sortedByDate[0];
    }
    
    // Try to sort by week number if no dates available
    const sortedByNumber = [...weeks].sort((a, b) => {
      // Extract week numbers and compare
      const numA = parseInt(a.week, 10);
      const numB = parseInt(b.week, 10);
      
      if (isNaN(numA)) return 1;  // a goes after b if a has no number
      if (isNaN(numB)) return -1; // a goes before b if b has no number
      
      return numB - numA; // Sort in descending order (highest first)
    });
    
    console.log(`Latest week by number: ${sortedByNumber[0].week}`);
    return sortedByNumber[0];
  } catch (error) {
    console.error('Error determining latest week:', error);
    
    // Fallback to first week if we can't determine
    if (weeks && weeks.length > 0) {
      return weeks[0];
    }
    
    return null;
  }
}

/**
 * Switches to a different week
 * @param {string} weekId - The ID of the week to switch to
 * @returns {Promise<boolean>} Success status
 */
export async function switchWeek(weekId) {
  try {
    console.log(`Switching to week ${weekId}...`);
    
    if (!weekId) {
      console.warn('No week ID provided');
      return false;
    }
    
    // Find the week in available weeks
    const weekInfo = availableWeeks.find(week => week.id === weekId || week.week === weekId);
    if (!weekInfo) {
      console.warn(`Week ${weekId} not found in available weeks`);
      return false;
    }
    
    // Make sure the week info has a file property
    if (!weekInfo.file) {
      console.warn(`Week ${weekId} has no file property`);
      return false;
    }
    
    // Show loading
    showLoading(getText('loading_week_data', { week: weekId }));
    
    // Load week data using the file property
    const weekData = await loadWeekData(weekInfo.file);
    
    if (!weekData) {
      console.error(`Failed to load data for week ${weekId}`);
      showError(getText('error.week_data_load', { week: weekId }));
      return false;
    }
    
    // Initialize currentWeek if it doesn't exist
    if (!currentWeek) {
      window.currentWeek = {};
    }
    
    // Update current week (with null checks)
    if (typeof currentWeek === 'object' && currentWeek !== null) {
      currentWeek.id = weekId;
      currentWeek.data = weekData;
      currentWeek.dateRange = {
        start: weekInfo.startDate,
        end: weekInfo.endDate
      };
      
      // Update UI with week data
      updateUIWithWeekData(weekData);
      
      console.log(`Successfully switched to week ${weekId}`);
      return true;
    } else {
      console.error('currentWeek is not initialized or not an object');
      return false;
    }
  } catch (error) {
    console.error(`Error switching to week ${weekId}:`, error);
    showError(getText('error.week_switch', { week: weekId }));
    return false;
  } finally {
    hideLoading();
  }
}

/**
 * Updates the UI with week data
 * @param {Object} weekData - The data for the current week
 */
function updateUIWithWeekData(weekData) {
  try {
    if (!weekData) {
      console.warn('No week data to update UI with');
      return;
    }
    
    console.log('Updating UI with week data:', weekData);
    
    // Find the dashboard related elements
    const statTotalPlayers = document.getElementById('stat-total-players');
    const statTotalScore = document.getElementById('stat-total-score');
    const statTotalChests = document.getElementById('stat-total-chests');
    const statAvgScore = document.getElementById('stat-avg-score');
    const statAvgChests = document.getElementById('stat-avg-chests');
    const rankingTableBody = document.getElementById('ranking-table-body');
    
    // Extract player data based on data format
    let playerData = [];
    let totals = {
      totalPlayers: 0,
      totalScore: 0,
      totalChests: 0,
      avgScore: 0,
      avgChests: 0
    };
    
    // Handle different possible formats from CSV or JSON
    if (Array.isArray(weekData)) {
      // Direct array of players
      playerData = weekData;
      totals.totalPlayers = playerData.length;
    } else if (weekData.players && Array.isArray(weekData.players)) {
      // Object with players array (CSV format)
      playerData = weekData.players;
      totals.totalPlayers = playerData.length;
      
      // Use pre-calculated totals if available
      if (weekData.totals) {
        totals = {
          ...totals,
          ...weekData.totals
        };
      }
    } else if (weekData.data && Array.isArray(weekData.data)) {
      // Object with data array (JSON format)
      playerData = weekData.data;
      totals.totalPlayers = playerData.length;
    }
    
    // Calculate totals if not already provided
    if (!totals.totalScore || !totals.totalChests) {
      // Find score and chest properties based on data format
      let scoreProperty = 'score';
      let chestProperty = 'chests';
      
      if (playerData.length > 0) {
        // Determine score property name based on data
        if (playerData[0].TOTAL_SCORE !== undefined) {
          scoreProperty = 'TOTAL_SCORE';
        } else if (playerData[0].Score !== undefined) {
          scoreProperty = 'Score';
        }
        
        // Determine chest property name based on data
        if (playerData[0].CHEST_COUNT !== undefined) {
          chestProperty = 'CHEST_COUNT';
        } else if (playerData[0].Chests !== undefined) {
          chestProperty = 'Chests';
        }
      }
      
      // Calculate totals
      totals.totalScore = playerData.reduce((sum, player) => sum + (player[scoreProperty] || 0), 0);
      totals.totalChests = playerData.reduce((sum, player) => sum + (player[chestProperty] || 0), 0);
      
      // Calculate averages
      totals.avgScore = totals.totalPlayers > 0 ? Math.round(totals.totalScore / totals.totalPlayers) : 0;
      totals.avgChests = totals.totalPlayers > 0 ? Math.round(totals.totalChests / totals.totalPlayers * 10) / 10 : 0;
    }
    
    // Update the dashboard statistics if elements exist
    if (statTotalPlayers) statTotalPlayers.textContent = totals.totalPlayers.toString();
    if (statTotalScore) statTotalScore.textContent = totals.totalScore.toLocaleString();
    if (statTotalChests) statTotalChests.textContent = totals.totalChests.toLocaleString();
    if (statAvgScore) statAvgScore.textContent = typeof totals.avgScore === 'number' ? 
      totals.avgScore.toLocaleString() : totals.avgScore;
    if (statAvgChests) statAvgChests.textContent = typeof totals.avgChests === 'number' ? 
      totals.avgChests.toLocaleString() : totals.avgChests;
    
    // Update the ranking table if it exists
    if (rankingTableBody) {
      // Clear previous data
      while (rankingTableBody.firstChild) {
        rankingTableBody.removeChild(rankingTableBody.firstChild);
      }
      
      // Clone and sort players by score (descending)
      const sortedPlayers = [...playerData].sort((a, b) => {
        // First try TOTAL_SCORE
        if (a.TOTAL_SCORE !== undefined && b.TOTAL_SCORE !== undefined) {
          return b.TOTAL_SCORE - a.TOTAL_SCORE;
        }
        
        // Then try Score
        if (a.Score !== undefined && b.Score !== undefined) {
          return b.Score - a.Score;
        }
        
        // Then try lowercase score
        if (a.score !== undefined && b.score !== undefined) {
          return b.score - a.score;
        }
        
        // If mixed properties, use a fallback approach
        const scoreA = a.TOTAL_SCORE || a.Score || a.score || 0;
        const scoreB = b.TOTAL_SCORE || b.Score || b.score || 0;
        return scoreB - scoreA;
      });
      
      // Add player rows
      sortedPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // Find player properties based on data format
        const playerName = player.PLAYER || player.Player || player.Name || player.name || 'Unknown';
        const playerScore = player.TOTAL_SCORE || player.Score || player.score || 0;
        const playerChests = player.CHEST_COUNT || player.Chests || player.chests || 0;
        
        // Add cells
        row.innerHTML = `
          <td class="py-2 text-center">${index + 1}</td>
          <td class="py-2"><span class="player-name cursor-pointer hover:text-primary">${playerName}</span></td>
          <td class="py-2 text-right">${playerScore.toLocaleString()}</td>
          <td class="py-2 text-right">${playerChests.toLocaleString()}</td>
        `;
        
        rankingTableBody.appendChild(row);
      });
    }
    
    // Update history stats if the container exists
    const historyStatsContainer = document.getElementById('history-stats-container');
    if (historyStatsContainer) {
      updateHistoryStats(weekData);
    }
    
    // Update chart data
    renderDashboardCharts();
    
    // Dispatch an event that other modules can listen for
    document.dispatchEvent(new CustomEvent('weekDataUpdated', { detail: weekData }));
    
    console.log('UI updated with week data');
  } catch (error) {
    console.error('Error updating UI with week data:', error);
  }
}

/**
 * Updates history statistics display with week data
 * @param {Object} weekData - The data for the week
 */
function updateHistoryStats(weekData) {
  try {
    if (!elements.historyStatsContainer || !weekData) {
      return;
    }
    
    // Clear container
    clearElement(elements.historyStatsContainer);
    
    // Example stats to show
    const stats = calculateHistoricalStats(weekData);
    
    // Create table for stats
    const table = createElement('table', { class: 'stats-table' });
    const tbody = createElement('tbody');
    
    // Add rows for each stat
    Object.entries(stats).forEach(([key, value]) => {
      const row = createElement('tr');
      
      // Stat label
      const labelCell = createElement('td', { class: 'stat-label' }, null, getText(`history.${key}`));
      row.appendChild(labelCell);
      
      // Stat value
      const valueCell = createElement('td', { class: 'stat-value' }, null, value.toString());
      row.appendChild(valueCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    elements.historyStatsContainer.appendChild(table);
  } catch (error) {
    console.error('Error updating history stats:', error);
  }
}

/**
 * Calculates statistics for historical data
 * @param {Object} weekData - The data for the week
 * @returns {Object} The calculated statistics
 */
function calculateHistoricalStats(weekData) {
  try {
    // These are example calculations - adjust based on actual data structure
    const playerCount = weekData.players ? weekData.players.length : 0;
    const totalPoints = weekData.totalPoints || 0;
    const totalChests = weekData.totalChests || 0;
    
    const averagePointsPerPlayer = playerCount > 0 ? totalPoints / playerCount : 0;
    const averageChestsPerPlayer = playerCount > 0 ? totalChests / playerCount : 0;
    
    return {
      totalPlayers: playerCount,
      totalPoints: totalPoints,
      totalChests: totalChests,
      avgPointsPerPlayer: averagePointsPerPlayer.toFixed(2),
      avgChestsPerPlayer: averageChestsPerPlayer.toFixed(2)
    };
  } catch (error) {
    console.error('Error calculating history stats:', error);
    return {};
  }
}

/**
 * Loads all available historical data for trend analysis
 * @returns {Promise<boolean>} Success status
 */
export async function loadHistoricalData() {
  try {
    console.log('Loading all historical data...');
    
    // Ensure historicalData is initialized as an array
    if (!Array.isArray(historicalData)) {
      console.warn('historicalData was not an array, initializing it');
      // Since we're importing from state.js, we should be able to modify it directly
      historicalData.length = 0;
    }
    
    // Show the history loading indicator if it exists
    if (elements.historyLoadingIndicator) {
      elements.historyLoadingIndicator.classList.remove('hidden');
    }
    
    if (elements.historyContent) {
      elements.historyContent.classList.add('hidden');
    }
    
    // Make sure we have available weeks
    if (!availableWeeks || !Array.isArray(availableWeeks) || availableWeeks.length === 0) {
      console.warn('No available weeks found, attempting to load weeks.json');
      
      try {
        await loadAvailableWeeks();
      } catch (error) {
        console.error('Error loading available weeks:', error);
      }
      
      // If still no weeks, create fallback data
      if (!availableWeeks || !Array.isArray(availableWeeks) || availableWeeks.length === 0) {
        console.warn('Creating fallback weeks array');
        
        // If availableWeeks is not an array, reinitialize it
        if (!Array.isArray(availableWeeks)) {
          console.warn('Reinitializing availableWeeks as an array');
          // Using the imported variable directly
          availableWeeks = [];
        }
        
        // Add fallback data directly
        const fallbackWeeks = [
          { week: '12', file: 'data_week_12.csv' },
          { week: '13', file: 'data_week_13.csv' },
          { week: '14', file: 'data_week_14.csv' },
          { week: '15', file: 'data_week_15.csv' }
        ];
        
        // Add to availableWeeks
        fallbackWeeks.forEach(week => {
          availableWeeks.push(week);
        });
        
        console.log('Created fallback weeks data:', availableWeeks);
      }
    }
    
    if (!availableWeeks || availableWeeks.length === 0) {
      console.warn('No available weeks to load historical data');
      
      // Hide loading indicator and show content
      if (elements.historyLoadingIndicator) {
        elements.historyLoadingIndicator.classList.add('hidden');
      }
      
      if (elements.historyContent) {
        elements.historyContent.classList.remove('hidden');
      }
      
      return false;
    }
    
    // Use the standard loading overlay for other operations
    showLoading(getText('history.loading'));
    
    // Clear previous historical data
    historicalData.length = 0;
    
    // Load data for each week
    for (const week of availableWeeks) {
      try {
        // Make sure we have a proper week id and file
        const weekId = week.id || week.week;
        const weekFile = week.file;
        
        if (!weekId) {
          console.warn('Week without ID found, skipping:', week);
          continue;
        }
        
        if (!weekFile) {
          console.warn('Week without file property found, skipping:', week);
          continue;
        }
        
        // Use the file property to load the data
        const weekData = await loadWeekData(weekFile);
        
        if (weekData && (weekData.data || weekData.players || Array.isArray(weekData))) {
          // Process the data for this week
          const weekInfo = {
            id: weekId,
            number: week.number || week.week || weekId,
            startDate: week.startDate,
            endDate: week.endDate,
            dateRange: week.dateRange
          };
          
          // Handle different possible formats of week data
          let playerData;
          if (Array.isArray(weekData)) {
            playerData = weekData;
          } else if (weekData.players) {
            // CSV format converted to our structure
            playerData = weekData.players;
          } else {
            // JSON format
            playerData = weekData.data || [];
          }
          
          // Calculate stats for this week
          const weekStats = calculateWeekStats(playerData, weekInfo);
          
          // Add to historical data array
          historicalData.push(weekStats);
        } else {
          console.warn(`No data found for week ${weekId}`);
        }
      } catch (error) {
        console.error(`Error loading data for week ${week.id || week.week}:`, error);
        // Continue loading other weeks even if one fails
      }
    }
    
    console.log(`Loaded historical data for ${historicalData.length} weeks`);
    hideLoading();
    
    // Initialize historical view if we're on that page
    initializeHistoricalView();
    
    return historicalData.length > 0;
  } catch (error) {
    console.error('Error loading all historical data:', error);
    hideLoading();
    
    // Hide loading indicator and show content with error
    if (elements.historyLoadingIndicator) {
      elements.historyLoadingIndicator.classList.add('hidden');
    }
    
    if (elements.historyContent) {
      elements.historyContent.classList.remove('hidden');
      elements.historyContent.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          <p>${getText('error.historicalDataLoad')}</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
    
    return false;
  }
}

/**
 * Calculate statistics for a specific week's data
 * @param {Array} weekData - The player data for the week
 * @param {Object} weekInfo - Information about the week
 * @returns {Object} Week statistics
 */
function calculateWeekStats(weekData, weekInfo) {
  try {
    const playerCount = weekData.length;
    let totalScore = 0;
    let totalChests = 0;
    const sources = {};
    
    // Calculate totals
    weekData.forEach(player => {
      totalScore += player.TOTAL_SCORE || 0;
      totalChests += player.CHEST_COUNT || 0;
      
      // Count sources
      if (player.SOURCES && Array.isArray(player.SOURCES)) {
        player.SOURCES.forEach(source => {
          sources[source.SOURCE] = (sources[source.SOURCE] || 0) + 1;
        });
      }
    });
    
    // Find most common source
    let mostCommonSource = { name: '-', count: 0 };
    Object.entries(sources).forEach(([name, count]) => {
      if (count > mostCommonSource.count) {
        mostCommonSource = { name, count };
      }
    });
    
    // Calculate averages
    const averageScore = playerCount > 0 ? totalScore / playerCount : 0;
    const averageChests = playerCount > 0 ? totalChests / playerCount : 0;
    
    return {
      weekId: weekInfo.id,
      weekNumber: weekInfo.number,
      weekStart: weekInfo.startDate,
      weekEnd: weekInfo.endDate,
      dateRange: weekInfo.dateRange,
      playerCount,
      totalScore,
      totalChests,
      averageScore,
      averageChests,
      mostCommonSource,
      data: weekData
    };
  } catch (error) {
    console.error('Error calculating week stats:', error);
    return {
      weekId: weekInfo.id,
      weekNumber: weekInfo.number,
      weekStart: weekInfo.startDate,
      weekEnd: weekInfo.endDate,
      dateRange: weekInfo.dateRange,
      playerCount: 0,
      totalScore: 0,
      totalChests: 0,
      averageScore: 0,
      averageChests: 0,
      mostCommonSource: { name: '-', count: 0 },
      data: []
    };
  }
}

/**
 * Updates UI with all historical data
 */
function updateHistoricalUI() {
  try {
    if (!historicalData || historicalData.length === 0) {
      console.warn('No historical data to update UI');
      
      // Show no data message
      if (elements.historyChartsContainer) {
        elements.historyChartsContainer.innerHTML = 
          `<p class="no-data">${getText('history.noHistorical')}</p>`;
      }
      
      return;
    }
    
    // Update historical charts and visualizations
    // Implementation will depend on what historical views are needed
    
    console.log('Historical UI updated');
  } catch (error) {
    console.error('Error updating historical UI:', error);
  }
}

/**
 * Initializes the historical data view with all charts and tables
 */
export function initializeHistoricalView() {
  try {
    console.log('Initializing historical data view...');
    
    if (!historicalData || !Array.isArray(historicalData) || historicalData.length === 0) {
      console.warn('No historical data available for historical view');
      
      // Show no data message in all containers
      const containers = [
        elements.weeklyTotalsTable,
        elements.scoreTrendChartContainer,
        elements.chestsTrendChartContainer,
        elements.topPlayersChartContainer,
        elements.categoryTrendChartContainer
      ];
      
      containers.forEach(container => {
        if (container) {
          clearElement(container);
          if (container === elements.weeklyTotalsTable) {
            container.innerHTML = `
              <table class="min-w-full divide-y divide-slate-700">
                <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekHeader">Week</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.weekNumber">#</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.playerCount">Players</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.chestCount">Chests</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.scoreTotal">Total Score</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.avgScore">Avg Score</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider" data-i18n-key="history.topSource">Top Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="7" class="text-center py-4 text-slate-500">
                      ${getText('history.noWeeklyData')}
                    </td>
                  </tr>
                </tbody>
              </table>
            `;
          } else {
            container.innerHTML = `<p class="text-slate-500 text-center py-8">${getText('history.noData')}</p>`;
          }
        }
      });
      
      // Hide loading indicator and show content
      if (elements.historyLoadingIndicator) {
        elements.historyLoadingIndicator.classList.add('hidden');
      }
      
      if (elements.historyContent) {
        elements.historyContent.classList.remove('hidden');
      }
      
      return;
    }
    
    // Hide loading indicator and show content
    if (elements.historyLoadingIndicator) {
      elements.historyLoadingIndicator.classList.add('hidden');
    }
    
    if (elements.historyContent) {
      elements.historyContent.classList.remove('hidden');
    }
    
    // Reset any previous view components
    resetAnalyticsView();
    
    // Render weekly totals table
    renderWeeklyTotalsTable();
    
    // Render trend charts if containers exist
    if (elements.scoreTrendChartContainer) {
      renderScoreTrendChart();
    }
    
    if (elements.chestsTrendChartContainer) {
      renderChestsTrendChart();
    }
    
    if (elements.topPlayersChartContainer) {
      renderTopPlayersChart();
    }
    
    // Handle category trends chart
    if (elements.categoryTrendChartContainer) {
      if (historicalData.some(week => week.categoryTrends && Object.keys(week.categoryTrends).length > 0)) {
        renderCategoryTrendChart();
      } else {
        // Show no category data message
        clearElement(elements.categoryTrendChartContainer);
        elements.categoryTrendChartContainer.innerHTML = 
          `<p class="text-slate-500 text-center py-8">${getText('history.noCategoryData')}</p>`;
      }
    }
    
    // Disable category selector if it exists
    if (elements.trendCategorySelect) {
      if (!historicalData.some(week => week.categoryTrends && Object.keys(week.categoryTrends).length > 0)) {
        elements.trendCategorySelect.innerHTML = `<option value="" disabled selected>${getText('history.selectCategory')}</option>`;
        elements.trendCategorySelect.disabled = true;
      }
    }
    
    console.log('Historical data view initialized successfully');
    
    // Add event listeners for tabs if they exist
    if (elements.weeklyTabs) {
      const tabs = elements.weeklyTabs.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', handleWeeklyTabChange);
      });
    }
  } catch (error) {
    console.error('Error initializing historical data view:', error);
    
    // Show error message to user
    if (elements.historyContent) {
      elements.historyContent.classList.remove('hidden');
      elements.historyContent.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
          <p>${getText('error.historicalView')}</p>
          <p class="text-sm mt-2">${error.message}</p>
        </div>
      `;
    }
    
    // Hide loading indicator
    if (elements.historyLoadingIndicator) {
      elements.historyLoadingIndicator.classList.add('hidden');
    }
  }
}

/**
 * Handles switching between tabs in the weekly analytics view
 * @param {Event} event - The click event
 */
function handleWeeklyTabChange(event) {
  try {
    const clickedTab = event.currentTarget;
    if (!clickedTab) return;
    
    // Get all tabs and content sections
    const tabs = elements.weeklyTabs.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    // Get the target content ID from the tab's data attribute
    const targetId = clickedTab.dataset.target;
    if (!targetId) return;
    
    // Deactivate all tabs and hide all content
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.add('hidden'));
    
    // Activate clicked tab
    clickedTab.classList.add('active');
    
    // Show target content
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.remove('hidden');
    }
    
    console.log(`Switched to tab: ${targetId}`);
  } catch (error) {
    console.error('Error handling tab change:', error);
  }
}

/**
 * Formats a number with thousands separator
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString();
}

// Export all functions from this module
export default {
  initWeeklyDataSystem,
  handleWeekChange,
  initializeWeeklyData,
  populateWeekSelector,
  renderWeeklyTotalsTable,
  renderScoreTrendChart,
  renderChestsTrendChart,
  renderTopPlayersChart,
  renderCategoryTrendChart,
  loadHistoricalData,
  calculateHistoricalStats,
  resetAnalyticsView,
  initializeHistoricalView,
  determineLatestWeek,
  switchWeek
};
