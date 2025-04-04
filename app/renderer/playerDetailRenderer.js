/**
 * Player Detail Renderer Module
 * 
 * Responsible for rendering player detail components
 */

import * as utils from '../utils.js';
import * as chartRenderer from './chartRenderer.js';
import * as i18n from '../i18n.js';

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
  if (!breakdownContainer || !player || !allHeaders) {
    console.error('Missing required elements for player breakdown');
    if (breakdownContainer) {
      breakdownContainer.innerHTML = '<p class="text-red-500">Error: Could not load player data</p>';
    }
    return;
  }
  
  try {
    // Get source columns (columns that start with FROM_)
    const sourceColumns = allHeaders.filter(header => header.startsWith('FROM_'));
    
    // If no source columns found, try to get all non-core columns as fallback
    let allSourceData = [];
    
    if (sourceColumns.length > 0) {
      // Create array of source data objects with name and value from FROM_ columns
      allSourceData = sourceColumns.map(column => {
        return {
          name: column.replace('FROM_', ''),
          value: Number(player[column] || 0)
        };
      });
    } else {
      // Fallback: Use non-core columns as sources
      const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'RANK'];
      const otherColumns = Object.keys(player)
        .filter(key => !coreColumns.includes(key) && key !== '' && !['undefined', 'null'].includes(key));
      
      allSourceData = otherColumns.map(column => {
        return {
          name: column,
          value: Number(player[column] || 0)
        };
      });
    }
    
    // Filter out zero values
    const sourceData = allSourceData.filter(source => source.value > 0);
    
    // If no source data with values, show message
    if (sourceData.length === 0) {
      breakdownContainer.innerHTML = '<p class="text-slate-500">No source data available for this player</p>';
      return;
    }
    
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
  } catch (error) {
    console.error('Error rendering player breakdown:', error);
    breakdownContainer.innerHTML = '<p class="text-red-500">Error rendering score breakdown</p>';
  }
}

/**
 * Render player radar chart
 * @param {Object} player - Player data
 * @param {Array} allPlayers - All player data for comparison
 */
export function renderPlayerPerformanceChart(player, allPlayers) {
  const chartContainer = document.getElementById('player-chart-container');
  if (!chartContainer || !player || !allPlayers || !Array.isArray(allPlayers) || allPlayers.length === 0) {
    console.error('Missing required elements for player performance chart');
    if (chartContainer) {
      chartContainer.innerHTML = '<p class="text-center text-red-500">Error: Could not load performance data</p>';
    }
    return;
  }
  
  try {
    // Find source columns (columns that start with FROM_)
    let sourceColumns = Object.keys(player)
      .filter(key => key.startsWith('FROM_'));
    
    // If no FROM_ columns, use non-core columns as fallback
    if (sourceColumns.length === 0) {
      const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'RANK'];
      sourceColumns = Object.keys(player)
        .filter(key => !coreColumns.includes(key) && key !== '' && !['undefined', 'null'].includes(key));
    }
    
    // If still no source columns, show error
    if (sourceColumns.length === 0) {
      chartContainer.innerHTML = '<p class="text-center text-slate-500">No category data available for this player</p>';
      return;
    }
    
    // Get values for each source from this player
    const sourcesWithValues = sourceColumns.map(column => {
      return {
        column: column,
        displayName: column.startsWith('FROM_') ? column.replace('FROM_', '') : column,
        value: Number(player[column] || 0)
      };
    });
    
    // Filter out zero values
    const nonZeroSources = sourcesWithValues.filter(source => source.value > 0);
    
    // If no non-zero sources, show message
    if (nonZeroSources.length === 0) {
      chartContainer.innerHTML = '<p class="text-center text-slate-500">No category data with values available</p>';
      return;
    }
    
    // Sort by value (descending) and take top 8 categories to prevent overlap
    const topSources = nonZeroSources
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    
    // Prepare player values series only
    const playerValues = topSources.map(source => source.value);
    
    // Get category names for display
    const categories = topSources.map(s => s.displayName);
    
    // Use the chartRenderer to create the radar chart with single series
    chartRenderer.createRadarChart(
      'player-chart-container',
      [
        {
          name: player.PLAYER,
          data: playerValues
        }
      ],
      categories,
      '' // Empty title to avoid redundancy
    );
  } catch (error) {
    console.error('Error rendering player performance chart:', error);
    chartContainer.innerHTML = '<p class="text-center text-red-500">Error rendering performance chart</p>';
  }
}
