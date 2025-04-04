/**
 * Dashboard Renderer Module
 * 
 * Responsible for rendering dashboard components
 */

import * as utils from '../utils.js';
import * as chartRenderer from './chartRenderer.js';
import * as tableRenderer from './tableRenderer.js';
import * as i18n from '../i18n.js';

/**
 * Render dashboard statistics
 * @param {HTMLElement} container - Stats container element
 * @param {Object} stats - Statistics to render
 */
export function renderStats(container, stats) {
  if (!container || !stats) return;
  
  // Update the stats elements with statistics
  if (stats.totalPlayers) {
    const playerStatsElement = document.getElementById('stat-total-players');
    if (playerStatsElement) {
      playerStatsElement.textContent = utils.formatNumber(stats.totalPlayers);
    }
  }
  
  if (stats.totalScore) {
    const scoreStatsElement = document.getElementById('stat-total-score');
    if (scoreStatsElement) {
      scoreStatsElement.textContent = utils.formatNumber(stats.totalScore);
    }
  }
  
  if (stats.totalChests) {
    const chestsStatsElement = document.getElementById('stat-total-chests');
    if (chestsStatsElement) {
      chestsStatsElement.textContent = utils.formatNumber(stats.totalChests);
    }
  }
  
  if (stats.avgScore) {
    const avgScoreElement = document.getElementById('stat-avg-score');
    if (avgScoreElement) {
      avgScoreElement.textContent = utils.formatNumber(stats.avgScore, 0);
    }
  }
  
  if (stats.avgChests) {
    const avgChestsElement = document.getElementById('stat-avg-chests');
    if (avgChestsElement) {
      avgChestsElement.textContent = utils.formatNumber(stats.avgChests, 0);
    }
  }
}

/**
 * Render top players by chest count
 * @param {HTMLElement} container - Container element
 * @param {Array} data - Player data
 * @param {number} limit - Number of top players to show
 */
export function renderTopPlayersTable(container, data, limit = 5) {
  if (!container || !data || !Array.isArray(data)) return;
  
  // Sort data by chest count in descending order
  const sortedData = [...data].sort((a, b) => b.CHEST_COUNT - a.CHEST_COUNT).slice(0, limit);
  
  // Create table HTML
  const tableHTML = `
    <table class="min-w-full text-sm">
      <thead class="sticky top-0 bg-slate-800/75 backdrop-blur-sm z-10">
        <tr>
          <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">Player</th>
          <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">Chests</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-700/50">
        ${sortedData.map(player => `
          <tr>
            <td class="px-3 py-2 whitespace-nowrap text-left">${player.PLAYER}</td>
            <td class="px-3 py-2 whitespace-nowrap text-right">${utils.formatNumber(player.CHEST_COUNT)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Set container HTML
  container.innerHTML = tableHTML;
}

/**
 * Render the main dashboard charts
 * @param {Array} data - Player data
 */
export function renderDashboardCharts(data) {
  if (!data || !Array.isArray(data) || data.length === 0) return;
  
  // Render top sources chart
  renderTopSourcesChart(data);
  
  // Render score distribution chart
  renderScoreDistributionChart(data);
  
  // Render score vs chests chart
  renderScoreVsChestsChart(data);
  
  // Render frequent sources chart
  renderFrequentSourcesChart(data);
}

/**
 * Get sources data from player data
 * @param {Array} data - Player data
 * @returns {Object} Object with sources data
 */
function getSourcesData(data) {
  // Detect column headers that could be source columns
  // They should not be core columns (PLAYER, TOTAL_SCORE, CHEST_COUNT, RANK, etc.)
  const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'RANK'];
  const sourceColumns = Object.keys(data[0])
    .filter(key => !coreColumns.includes(key) && key !== '' && key !== undefined);
  
  console.log('Source columns detected:', sourceColumns);
  
  const sourceTotals = {};
  
  sourceColumns.forEach(column => {
    // Use the original column name for the source
    const sourceName = column;
    sourceTotals[sourceName] = data.reduce((sum, player) => {
      return sum + (Number(player[column]) || 0);
    }, 0);
  });
  
  // Sort sources by total score (descending)
  const sortedSources = Object.entries(sourceTotals)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  
  return {
    names: Object.keys(sortedSources),
    values: Object.values(sortedSources)
  };
}

/**
 * Render top sources chart
 * @param {Array} data - Player data
 */
function renderTopSourcesChart(data) {
  const container = document.getElementById('top-sources-chart-container');
  if (!container) return;
  
  const sourcesData = getSourcesData(data);
  
  // Limit to top 10 sources
  const top10Names = sourcesData.names.slice(0, 10);
  const top10Values = sourcesData.values.slice(0, 10);
  
  // Create chart
  chartRenderer.createDonutChart(
    'top-sources-chart-container',
    top10Values,
    top10Names,
    i18n.getText('dashboard.chartTopSourcesTitle')
  );
}

/**
 * Render score distribution chart
 * @param {Array} data - Player data
 */
function renderScoreDistributionChart(data) {
  const container = document.getElementById('score-distribution-chart-container');
  if (!container) return;
  
  // Calculate score ranges and counts
  const maxScore = Math.max(...data.map(player => player.TOTAL_SCORE));
  const minScore = Math.min(...data.map(player => player.TOTAL_SCORE));
  const range = maxScore - minScore;
  const bucketSize = Math.ceil(range / 5); // 5 buckets
  
  const buckets = Array(5).fill(0).map((_, i) => {
    const start = minScore + i * bucketSize;
    const end = start + bucketSize - 1;
    return {
      range: `${utils.formatNumber(start)}-${utils.formatNumber(end)}`,
      count: 0
    };
  });
  
  // Count players in each bucket
  data.forEach(player => {
    const score = player.TOTAL_SCORE;
    const bucketIndex = Math.min(Math.floor((score - minScore) / bucketSize), buckets.length - 1);
    buckets[bucketIndex].count++;
  });
  
  // Create chart data
  const categories = buckets.map(bucket => bucket.range);
  const series = [{
    name: i18n.getText('table.headerPlayers'),
    data: buckets.map(bucket => bucket.count)
  }];
  
  // Create chart
  chartRenderer.createBarChart(
    'score-distribution-chart-container',
    series,
    categories,
    i18n.getText('dashboard.chartScoreDistTitle')
  );
}

/**
 * Render score vs chests chart
 * @param {Array} data - Player data
 */
function renderScoreVsChestsChart(data) {
  const container = document.getElementById('score-vs-chests-chart-container');
  if (!container) return;
  
  // Create scatter data
  const scatterData = data.map(player => {
    return [player.CHEST_COUNT, player.TOTAL_SCORE];
  });
  
  // Create chart
  chartRenderer.createScatterChart(
    'score-vs-chests-chart-container',
    scatterData,
    i18n.getText('dashboard.chartScoreVsChestsTitle'),
    i18n.getText('table.headerChests'),
    i18n.getText('table.headerTotalScore')
  );
}

/**
 * Render frequent sources chart
 * @param {Array} data - Player data
 */
function renderFrequentSourcesChart(data) {
  const container = document.getElementById('frequent-sources-chart-container');
  if (!container) return;
  
  // Get source columns (exclude core columns)
  const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'RANK'];
  const sourceColumns = Object.keys(data[0])
    .filter(key => !coreColumns.includes(key) && key !== '' && key !== undefined);
  
  // Count how many players have a non-zero value for each source
  const sourceFrequency = {};
  
  sourceColumns.forEach(column => {
    // Use the original column name for the source
    const sourceName = column;
    sourceFrequency[sourceName] = data.filter(player => player[column] > 0).length;
  });
  
  // Sort by frequency
  const sortedSources = Object.entries(sourceFrequency)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});
  
  // Limit to top 10 sources
  const top10Keys = Object.keys(sortedSources).slice(0, 10);
  const top10Values = Object.values(sortedSources).slice(0, 10);
  
  // Create chart
  chartRenderer.createBarChart(
    'frequent-sources-chart-container',
    [{
      name: i18n.getText('table.headerPlayers'),
      data: top10Values
    }],
    top10Keys,
    i18n.getText('dashboard.chartFreqSourcesTitle')
  );
}
