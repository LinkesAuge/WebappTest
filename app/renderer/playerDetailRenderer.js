/**
 * Player Detail Renderer Module
 * 
 * Responsible for rendering player detail components
 */

import * as utils from '../utils.js';
import * as chartRenderer from './chartRenderer.js';

/**
 * Render player basic details
 * @param {Object} player - Player data
 * @param {number} rank - Player rank
 */
export function renderPlayerDetails(player, rank) {
  if (!player) return;
  
  // Set player name
  const nameElement = document.getElementById('player-name-detail');
  if (nameElement) {
    nameElement.textContent = player.PLAYER;
  }
  
  // Set player rank
  const rankElement = document.getElementById('player-rank-detail');
  if (rankElement) {
    rankElement.textContent = `#${rank}`;
  }
  
  // Set player score
  const scoreElement = document.getElementById('player-score-detail');
  if (scoreElement) {
    scoreElement.textContent = utils.formatNumber(player.TOTAL_SCORE);
  }
  
  // Set player chest count
  const chestsElement = document.getElementById('player-chests-detail');
  if (chestsElement) {
    chestsElement.textContent = utils.formatNumber(player.CHEST_COUNT);
  }
}

/**
 * Render player score breakdown
 * @param {Object} player - Player data
 * @param {Array} allHeaders - All data headers
 */
export function renderPlayerBreakdown(player, allHeaders) {
  const breakdownContainer = document.getElementById('player-breakdown-list');
  if (!breakdownContainer || !player || !allHeaders) return;
  
  // Get source columns (columns that start with FROM_)
  const sourceColumns = allHeaders.filter(header => header.startsWith('FROM_'));
  
  // Create array of source data objects with name and value
  const sourceData = sourceColumns.map(column => {
    return {
      name: column.replace('FROM_', ''),
      value: player[column] || 0
    };
  });
  
  // Sort by value (descending)
  sourceData.sort((a, b) => b.value - a.value);
  
  // Calculate total score from sources for percentage calculation
  const totalSourceScore = sourceData.reduce((sum, source) => sum + source.value, 0);
  
  // Create breakdown HTML
  const breakdownHTML = sourceData.map(source => {
    const percentage = totalSourceScore > 0 
      ? Math.round((source.value / totalSourceScore) * 100) 
      : 0;
    
    const barWidth = `${percentage}%`;
    
    return `
      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <span class="font-medium">${source.name}</span>
          <span>${utils.formatNumber(source.value)} (${percentage}%)</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2">
          <div class="bg-primary h-2 rounded-full" style="width: ${barWidth}"></div>
        </div>
      </div>
    `;
  }).join('');
  
  // Set container content
  breakdownContainer.innerHTML = breakdownHTML;
}

/**
 * Render player radar chart
 * @param {Object} player - Player data
 * @param {Array} allPlayers - All player data for comparison
 */
export function renderPlayerPerformanceChart(player, allPlayers) {
  if (!player || !allPlayers || !Array.isArray(allPlayers) || allPlayers.length === 0) return;
  
  const chartContainer = document.getElementById('player-chart-container');
  if (!chartContainer) return;
  
  // Find source columns (columns that start with FROM_)
  const sourceColumns = Object.keys(player)
    .filter(key => key.startsWith('FROM_'));
  
  // If no source columns, return
  if (sourceColumns.length === 0) return;
  
  // Calculate max value for each source across all players
  const maxValues = {};
  sourceColumns.forEach(column => {
    maxValues[column] = Math.max(...allPlayers.map(p => p[column] || 0));
  });
  
  // Create normalized values (percentage of max) for the radar chart
  const categories = sourceColumns.map(column => column.replace('FROM_', ''));
  const playerValues = sourceColumns.map(column => {
    // Calculate percentage of max value (0-100)
    const value = player[column] || 0;
    const max = maxValues[column] || 1; // Avoid division by zero
    return Math.round((value / max) * 100);
  });
  
  // Create chart configuration
  const options = {
    ...chartRenderer.getBaseChartOptions(),
    series: [{
      name: player.PLAYER,
      data: playerValues
    }],
    chart: {
      height: 300,
      type: 'radar',
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      max: 100,
      tickAmount: 5
    },
    fill: {
      opacity: 0.5
    },
    title: {
      text: 'Player Performance by Category (%)',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    }
  };
  
  // Create chart
  const chart = new ApexCharts(chartContainer, options);
  chartRenderer.chartRegistry['player-chart'] = chart;
  chart.render();
}
