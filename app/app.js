/**
 * Main application module
 * 
 * This module integrates all components of the application:
 * - Data loading and processing
 * - DOM management
 * - Internationalization
 * - UI rendering and updates
 * - Event handling
 */

import * as dataLoader from './dataLoader.js';
import * as domManager from './domManager.js';
import * as i18n from './i18n.js';
import * as utils from './utils.js';
import { setupEventListeners } from './eventListeners.js';
import * as tableRenderer from './renderer/tableRenderer.js';
import * as chartRenderer from './renderer/chartRenderer.js';
import * as dashboardRenderer from './renderer/dashboardRenderer.js';
import * as playerDetailRenderer from './renderer/playerDetailRenderer.js';

// State variables
let allPlayersData = [];
let displayData = [];
let allColumnHeaders = [];
let scoreRulesData = [];

// Sort state - will be initialized properly in initializeApp
let dashboardSortState = {
  column: null,
  direction: null
};

const scoreRulesSortState = {
  column: 'Punkte',
  direction: 'desc'
};

/**
 * Initialize the application
 */
async function initializeApp() {
  console.log('Initializing application...');
  
  try {
    // Initialize language settings first
    await i18n.initLanguage();
    
    // Set up cross-module references immediately after i18n init
    utils.setI18n(i18n.getText);  // Pass getText directly
    dataLoader.setUtils({
      setStatus: utils.setStatus,
      showLoading: utils.showLoading,
      hideLoading: utils.hideLoading,
      getText: i18n.getText,
      resetStateAndUI: resetStateAndUI
    });
    i18n.setRenderFunctions(domManager);
    i18n.setUpdateSortIcons(utils.updateSortIcons);
    
    // Initialize sort state with default values
    dashboardSortState = {
      column: utils.CORE_COLUMNS.TOTAL_SCORE,
      direction: 'desc'
    };
    
    // Assign DOM element references first
    const referencesAssigned = domManager.assignElementReferences();
    if (!referencesAssigned) {
      console.error('Failed to assign all DOM references');
      return;
    }
    
    // Ensure all required container elements exist
    domManager.ensureRequiredContainers();
    
    // Now that we have DOM references, we can show the dashboard view
    domManager.showView('dashboard');
    domManager.updateNavLinkActiveState('dashboard');
    
    // Initialize sort icons with the default state
    utils.updateSortIcons(dashboardSortState.column, dashboardSortState.direction, '#ranking-table-container th[data-column]');
    
    // Set up event listeners
    setupEventListeners();
    
    // Try to load data from localStorage first
    const storedData = dataLoader.loadDataFromLocalStorage();
    if (storedData) {
      console.log('Using data from localStorage');
      utils.setStatus(i18n.getText('status.usingLocalData'), 'info', 3000);
      
      // Load fresh data with isFirstInit=true to ensure proper initialization
      await loadAndRenderData(true);
    } else {
      // Load fresh data with isFirstInit=true
      await loadAndRenderData(true);
    }
  } catch (error) {
    console.error('Error during initialization:', error);
    utils.setStatus(i18n.getText('status.error'), 'error');
  }
}

/**
 * Handle navigation between views
 */
function handleViewNavigation(viewName) {
  console.log(`Navigating to view: ${viewName}`);
  
  // If view name is invalid, default to dashboard
  const validViews = [
    'dashboard',
    'detailed-table',
    'charts',
    'analytics',
    'score-system',
    'playerDetails',
    'categoryAnalysis',
    'scoreRules'
  ];
  
  if (!validViews.includes(viewName)) {
    console.warn(`Invalid view name: ${viewName}, defaulting to dashboard`);
    viewName = 'dashboard';
  }
  
  // Update UI for the selected view
  domManager.showView(viewName);
  domManager.updateNavLinkActiveState(viewName);
  
  // Perform view-specific actions
  switch (viewName) {
    case 'score-system':
      if (scoreRulesData.length === 0) {
        dataLoader.loadScoreRulesData(scoreRulesData, utils.sortData, scoreRulesSortState)
          .then(success => {
            if (success) {
              renderScoreRulesTable(scoreRulesData);
            }
          });
      } else {
        renderScoreRulesTable(scoreRulesData);
      }
      break;
      
    case 'analytics':
      if (allPlayersData.length > 0) {
        createCategoryAnalysisView(allPlayersData, allColumnHeaders);
      }
      break;
      
    case 'charts':
      if (allPlayersData.length > 0) {
        dashboardRenderer.renderDashboardCharts(allPlayersData);
      }
      break;
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const body = document.body;
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Handle filtering of data
 */
function handleFilter(filterText) {
  if (!filterText) {
    displayData = [...allPlayersData];
  } else {
    const searchTerm = filterText.toLowerCase();
    displayData = allPlayersData.filter(player => 
      player[utils.CORE_COLUMNS.PLAYER].toLowerCase().includes(searchTerm)
    );
  }
  renderPlayerTable(displayData);
}

/**
 * Handle sorting when a table header is clicked
 */
function handleSortClick(event) {
  const column = event.currentTarget.dataset.column;
  if (!column) return;

  console.log('Handling sort click for column:', column);
  
  if (dashboardSortState.column === column) {
    dashboardSortState.direction = dashboardSortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    dashboardSortState.column = column;
    dashboardSortState.direction = 'desc';
  }
  
  console.log('New sort state:', dashboardSortState);
  
  // Create a copy of displayData to avoid mutation issues
  const sortedData = utils.sortData(
    dashboardSortState.column,
    dashboardSortState.direction,
    true,
    [...displayData],
    dashboardSortState
  );
  
  // Update displayData with sorted results
  displayData.length = 0;
  displayData.push(...sortedData);
  
  renderPlayerTable(displayData);
  utils.updateSortIcons(dashboardSortState.column, dashboardSortState.direction, '#ranking-table-container th[data-column]');
}

/**
 * Load and render data
 * @param {boolean} isFirstInit - Whether this is the first initialization
 * @returns {Promise<void>}
 */
export async function loadAndRenderData(isFirstInit = false) {
  console.log('Loading and rendering data...');
  utils.showLoading(i18n.getText('status.loading'));

  try {
    // Load data
    await dataLoader.loadStaticCsvData(
      allPlayersData,
      displayData,
      allColumnHeaders,
      utils.sortData,
      dashboardSortState,
      saveDataToLocalStorage
    );

    // Update UI state
    domManager.updateHeaderButtonsVisibility(true);
    
    // Render dashboard
    renderDashboard();

    // Always show dashboard view on first init
    if (isFirstInit) {
      domManager.showView('dashboard');
      domManager.updateNavLinkActiveState('dashboard');
      document.body.dataset.initialized = 'true';
    }

    // Update UI text after rendering
    i18n.updateUIText(
      dashboardSortState,
      { column: null, direction: null }, // detailedTableSortState
      { column: null, direction: null }, // scoreRulesSortState
      'dashboard',
      null,
      document.getElementById('category-select')
    );
    
    utils.hideLoading();
  } catch (error) {
    console.error('Error loading data:', error);
    utils.setStatus(i18n.getText('status.error'), 'error');
    utils.hideLoading();
  }
}

/**
 * Render the dashboard
 */
function renderDashboard() {
  console.log('Rendering dashboard...');
  
  // Calculate statistics
  const stats = {
    totalPlayers: allPlayersData.length,
    totalScore: allPlayersData.reduce((sum, p) => sum + p.TOTAL_SCORE, 0),
    totalChests: allPlayersData.reduce((sum, p) => sum + p.CHEST_COUNT, 0),
    avgScore: 0,
    avgChests: 0
  };
  
  stats.avgScore = stats.totalPlayers > 0 ? stats.totalScore / stats.totalPlayers : 0;
  stats.avgChests = stats.totalPlayers > 0 ? stats.totalChests / stats.totalPlayers : 0;
  
  // Update statistics directly
  const playerStatsElement = document.getElementById('stat-total-players');
  if (playerStatsElement) {
    playerStatsElement.textContent = utils.formatNumber(stats.totalPlayers);
  }
  
  const scoreStatsElement = document.getElementById('stat-total-score');
  if (scoreStatsElement) {
    scoreStatsElement.textContent = utils.formatNumber(stats.totalScore);
  }
  
  const chestsStatsElement = document.getElementById('stat-total-chests');
  if (chestsStatsElement) {
    chestsStatsElement.textContent = utils.formatNumber(stats.totalChests);
  }
  
  const avgScoreElement = document.getElementById('stat-avg-score');
  if (avgScoreElement) {
    avgScoreElement.textContent = utils.formatNumber(stats.avgScore, 0);
  }
  
  const avgChestsElement = document.getElementById('stat-avg-chests');
  if (avgChestsElement) {
    avgChestsElement.textContent = utils.formatNumber(stats.avgChests, 0);
  }
  
  // Render top players table
  dashboardRenderer.renderTopPlayersTable(
    document.getElementById('top-chests-table-body'),
    allPlayersData,
    10
  );
  
  // Render main ranking table
  renderPlayerTable(displayData);
  
  // Render charts
  dashboardRenderer.renderDashboardCharts(allPlayersData);
  
  // Show success message
  utils.setStatus(
    i18n.getText('status.success', { 0: allPlayersData.length }),
    'success',
    5000
  );
}

/**
 * Render the player ranking table
 */
function renderPlayerTable(data) {
  console.log('Rendering player table...');
  
  const container = document.getElementById('ranking-table-container');
  if (!container) return;
  
  // Define headers for the table
  const headers = ['RANK', 'PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
  
  // Add rank to each player
  const dataWithRank = data.map((player, index) => ({
    ...player,
    RANK: index + 1
  }));
  
  // Render table using the shared renderer
  tableRenderer.renderDataTable(
    container,
    dataWithRank,
    headers,
    dashboardSortState,
    handleSortClick,
    (event) => {
      const index = parseInt(event.currentTarget.dataset.index);
      const player = data[index];
      if (player) {
        showPlayerDetails(player, index + 1);
      }
    }
  );
}

/**
 * Show player details
 */
function showPlayerDetails(player, rank) {
  console.log('Showing player details:', player.PLAYER);
  // Render player details
  playerDetailRenderer.renderPlayerDetails(player, rank);
  playerDetailRenderer.renderPlayerBreakdown(player, allColumnHeaders);
  playerDetailRenderer.renderPlayerPerformanceChart(player, allPlayersData);
  
  // Show player details view
  domManager.showView('playerDetails');
  domManager.updateNavLinkActiveState('playerDetails');
}

/**
 * Create category analysis view
 */
function createCategoryAnalysisView(data, headers) {
  console.log('Creating category analysis view...');
  
  // Get source columns (columns that start with FROM_)
  const sourceColumns = headers.filter(header => header.startsWith('FROM_'));
  
  // Update category select options
  const categorySelect = document.getElementById('category-select');
  if (!categorySelect) return;
  
  // Clear existing options
  categorySelect.innerHTML = `<option value="" data-i18n-key="analytics.selectCategoryDefault">-- Select Category --</option>`;
  
  // Add source columns as options
  sourceColumns.forEach(column => {
    const sourceName = column.replace('FROM_', '');
    categorySelect.innerHTML += `<option value="${column}">${sourceName}</option>`;
  });
  
  // Add change handler
  categorySelect.addEventListener('change', () => {
    const selectedCategory = categorySelect.value;
    if (selectedCategory) {
      showCategoryAnalysis(selectedCategory, data);
    } else {
      hideCategoryAnalysis();
    }
  });
}

/**
 * Show category analysis
 */
function showCategoryAnalysis(category, data) {
  console.log('Showing category analysis:', category);
  
  // Get players with points in this category
  const playersWithPoints = data.filter(player => player[category] > 0)
    .sort((a, b) => b[category] - a[category]);
  
  // Update category names
  const categoryName = category.replace('FROM_', '');
  document.getElementById('category-name-table').textContent = categoryName;
  document.getElementById('category-name-chart').textContent = categoryName;
  
  // Render ranking table
  const tableBody = document.getElementById('category-ranking-body');
  if (tableBody) {
    tableBody.innerHTML = playersWithPoints.map(player => `
      <tr>
        <td class="px-4 py-2 text-left">${player.PLAYER}</td>
        <td class="px-4 py-2 text-right">${utils.formatNumber(player[category])}</td>
      </tr>
    `).join('');
  }
  
  // Create distribution chart
  const chartContainer = document.getElementById('category-chart-container');
  if (chartContainer) {
    // Calculate distribution data
    const maxScore = Math.max(...data.map(p => p[category]));
    const minScore = Math.min(...data.map(p => p[category]));
    const range = maxScore - minScore;
    const bucketSize = Math.ceil(range / 10); // 10 buckets
    
    const buckets = Array(10).fill(0).map((_, i) => {
      const start = minScore + i * bucketSize;
      const end = start + bucketSize - 1;
      return {
        range: `${utils.formatNumber(start)}-${utils.formatNumber(end)}`,
        count: 0
      };
    });
    
    // Count players in each bucket
    data.forEach(player => {
      const score = player[category];
      const bucketIndex = Math.min(Math.floor((score - minScore) / bucketSize), buckets.length - 1);
      buckets[bucketIndex].count++;
    });
    
    // Create chart
    chartRenderer.createBarChart(
      'category-chart-container',
      [{
        name: utils.getText('table.headerPlayers'),
        data: buckets.map(b => b.count)
      }],
      buckets.map(b => b.range),
      `${categoryName} Distribution`
    );
  }
  
  // Show analysis content
  document.getElementById('category-analysis-content').classList.remove('hidden');
  document.getElementById('category-prompt').classList.add('hidden');
}

/**
 * Hide category analysis
 */
function hideCategoryAnalysis() {
  document.getElementById('category-analysis-content').classList.add('hidden');
  document.getElementById('category-prompt').classList.remove('hidden');
}

/**
 * Render score rules table
 */
function renderScoreRulesTable(rules) {
  console.log('Rendering score rules table...');
  
  const container = document.getElementById('score-rules-table-container');
  if (!container) return;
  
  // Create table
  const headers = ['Typ', 'Level', 'Punkte'];
  tableRenderer.renderDataTable(
    container,
    rules,
    headers,
    scoreRulesSortState,
    handleScoreRulesSortClick
  );
  
  // Show success message
  utils.setStatus(i18n.getText('status.successRules'), 'success', 3000);
}

/**
 * Handle score rules table sort click
 */
function handleScoreRulesSortClick(event) {
  const column = event.currentTarget.dataset.column;
  if (scoreRulesSortState.column === column) {
    scoreRulesSortState.direction = scoreRulesSortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    scoreRulesSortState.column = column;
    scoreRulesSortState.direction = 'desc';
  }
  
  utils.sortData(scoreRulesSortState.column, scoreRulesSortState.direction, true, scoreRulesData, scoreRulesSortState);
  renderScoreRulesTable(scoreRulesData);
  utils.updateSortIcons(scoreRulesSortState.column, scoreRulesSortState.direction, '#score-rules-table-container th[data-column]');
}

/**
 * Save data to localStorage
 * @param {Array} playersData - Array of player data (unused)
 * @param {Array} columnHeaders - Array of column headers (unused)
 * @param {string} lastUpdated - Last updated timestamp
 * @returns {boolean} Success status
 */
function saveDataToLocalStorage(playersData, columnHeaders, lastUpdated) {
  try {
    if (lastUpdated) {
      // Use dataLoader's function to handle both storage and UI update
      dataLoader.saveDataToLocalStorage(null, null, lastUpdated);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Reset state and UI
 */
function resetStateAndUI() {
  // Clear state
  allPlayersData.length = 0;
  displayData.length = 0;
  allColumnHeaders.length = 0;
  scoreRulesData.length = 0;
  
  // Reset sort states
  dashboardSortState.column = utils.CORE_COLUMNS.TOTAL_SCORE;
  dashboardSortState.direction = 'desc';
  scoreRulesSortState.column = 'Punkte';
  scoreRulesSortState.direction = 'desc';
  
  // Reset UI
  domManager.showView('dashboard');
  domManager.updateNavLinkActiveState('dashboard');
  domManager.updateHeaderButtonsVisibility(false);
  
  // Destroy charts
  Object.values(chartRenderer.chartRegistry).forEach(chart => {
    if (chart) {
      chart.destroy();
    }
  });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export all functions needed by other modules
export {
  initializeApp,
  handleViewNavigation,
  handleFilter,
  handleSortClick,
  resetStateAndUI,
  toggleTheme
}; 