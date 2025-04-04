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
import { initEventListeners, applyDetailedTableStickyColumn } from './eventListeners.js';
import * as tableRenderer from './renderer/tableRenderer.js';
import * as chartRenderer from './renderer/chartRenderer.js';
import * as dashboardRenderer from './renderer/dashboardRenderer.js';
import * as playerDetailRenderer from './renderer/playerDetailRenderer.js';
import * as analyticsRenderer from './renderer/analyticsRenderer.js';

// State variables
let allPlayersData = [];
let displayData = [];
let allColumnHeaders = [];
let scoreRulesData = [];

// Sort state - will be initialized properly in initializeApp
let dashboardSortState = {
  column: 'TOTAL_SCORE',
  direction: 'desc'
};

const detailedTableSortState = {
  column: 'TOTAL_SCORE',
  direction: 'desc'
};

const scoreRulesSortState = {
  column: 'Typ',
  direction: 'asc'
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
    initEventListeners();
    
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

    // Add window resize listener for handling responsive changes
    let isMobile = window.innerWidth <= 640;
    window.addEventListener('resize', utils.debounce(() => {
      const newIsMobile = window.innerWidth <= 640;
      // Only re-render if we've crossed the mobile threshold
      if (isMobile !== newIsMobile) {
        isMobile = newIsMobile;
        
        // Get the current view to determine what to re-render
        const currentView = getCurrentView();
        
        if (currentView === 'dashboard' && displayData.length > 0) {
          // Re-render the dashboard table if we're on the dashboard
          renderPlayerTable(displayData);
        } else if (currentView === 'detailed-table') {
          // Re-render the detailed table if we're on that view
          renderDetailedDataTable();
          
          // Apply sticky column for detailed table
          setTimeout(() => {
            applyDetailedTableStickyColumn();
          }, 200);
        }
      }
    }, 250)); // 250ms debounce to avoid excessive re-renders
  } catch (error) {
    console.error('Error during initialization:', error);
    utils.setStatus(i18n.getText('status.error'), 'error');
  }
}

/**
 * Handle view navigation
 * @param {string} viewName - Name of the view to show
 */
function handleViewNavigation(viewName) {
  if (!viewName) return;
  
  console.log('Navigating to view:', viewName);
  
  // Show the appropriate section
  domManager.showView(viewName);
  
  // Update active nav state
  domManager.updateNavLinkActiveState(viewName);
  
  // Handle specific view logic
  switch (viewName) {
    case 'dashboard':
      // Apply any specific dashboard initializations
      break;
      
    case 'detailed-table':
      // Render the detailed data table
      renderDetailedDataTable();
      
      // Try to apply sticky column logic after a small delay to ensure DOM is ready
      setTimeout(() => {
        // Use the imported function
        applyDetailedTableStickyColumn();
      }, 100);
      break;
      
    case 'charts':
      // Initialize charts in the charts section
      initializeChartsSection();
      break;
      
    case 'analytics':
      // Analytics initialization
      if (allPlayersData.length > 0) {
        // First create Clan Analysis 
        createClanAnalysisView(allPlayersData);
        // Then create Category Analysis
        createCategoryAnalysisView(allPlayersData);
      }
      break;
      
    case 'score-system':
      // Render score rules table if not already done
      if (scoreRulesData.length > 0) {
        renderScoreRulesTable(scoreRulesData);
      } else {
        // Score rules not loaded yet, load them
        dataLoader.loadScoreRulesData(scoreRulesData, utils.sortData, scoreRulesSortState)
          .then(success => {
            if (success) {
              renderScoreRulesTable(scoreRulesData);
            }
          })
          .catch(error => {
            console.error('Error loading score rules:', error);
            utils.setStatus(i18n.getText('status.errorRules'), 'error');
          });
      }
      break;
      
    case 'playerDetails':
      // Player details handled elsewhere through showPlayerDetails function
      break;
      
    default:
      console.warn('Unknown view name:', viewName);
      break;
  }

  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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
  
  // Note: We deliberately don't update domManager's playerDataRef here
  // as the charts should always show the complete dataset regardless of filtering
  
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

    // Share player data with domManager for modal charts
    domManager.setPlayerData(allPlayersData);

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
  
  // Render top players chart instead of table
  dashboardRenderer.renderTopPlayersChart(
    'top-chests-chart-container',
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
  
  // Check if we're on mobile (screen width <= 640px)
  const isMobile = window.innerWidth <= 640;
  
  // For mobile, limit to 20 rows initially
  let displayData = data;
  let showMoreNeeded = false;
  
  if (isMobile && data.length > 20) {
    displayData = data.slice(0, 20);
    showMoreNeeded = true;
  }
  
  // Add rank to each player
  const dataWithRank = displayData.map((player, index) => ({
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
      const player = displayData[index];
      if (player) {
        showPlayerDetails(player, index + 1);
      }
    }
  );
  
  // If on mobile and we have more data to show, add a "Show More" button
  if (showMoreNeeded) {
    // Check if a "Show More" button already exists
    let showMoreButton = container.querySelector('.show-more-button');
    
    if (!showMoreButton) {
      // Create and add the "Show More" button with inline styles
      showMoreButton = document.createElement('button');
      showMoreButton.textContent = i18n.getText('table.showMore') || 'Show All Players';
      showMoreButton.id = 'show-more-ranking';
      
      // Apply inline styles directly for maximum compatibility
      Object.assign(showMoreButton.style, {
        display: 'block',
        width: '80%',
        margin: '0.5rem auto',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        color: '#0f172a',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: '4px',
        border: '1px solid #f59e0b',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease'
      });
      
      // Add a few backup classes for any additional styling
      showMoreButton.className = 'show-more-button btn btn-amber';
      
      // Adjust for mobile if needed
      if (window.innerWidth <= 640) {
        Object.assign(showMoreButton.style, {
          width: '90%',
          padding: '0.4rem 0.75rem',
          fontSize: '0.7rem',
          margin: '0.4rem auto'
        });
      }
      
      // Add even smaller screen adjustments
      if (window.innerWidth <= 360) {
        Object.assign(showMoreButton.style, {
          width: '85%',
          padding: '0.3rem 0.5rem',
          fontSize: '0.65rem',
          margin: '0.3rem auto'
        });
      }
      
      container.appendChild(showMoreButton);
      
      // Add hover effect through event listeners
      showMoreButton.addEventListener('mouseover', () => {
        showMoreButton.style.backgroundColor = 'rgba(245, 158, 11, 0.9)';
        showMoreButton.style.transform = 'translateY(-1px)';
        showMoreButton.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.4)';
      });
      
      showMoreButton.addEventListener('mouseout', () => {
        showMoreButton.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
        showMoreButton.style.transform = 'none';
        showMoreButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
      });
      
      showMoreButton.addEventListener('mousedown', () => {
        showMoreButton.style.transform = 'translateY(1px)';
        showMoreButton.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
      });
      
      showMoreButton.addEventListener('mouseup', () => {
        showMoreButton.style.transform = 'translateY(-1px)';
        showMoreButton.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.4)';
      });
      
      // Add click event listener to the button
      showMoreButton.addEventListener('click', () => {
        // Re-render the table with all data
        const fullDataWithRank = data.map((player, index) => ({
          ...player,
          RANK: index + 1
        }));
        
        tableRenderer.renderDataTable(
          container,
          fullDataWithRank,
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
        
        // Remove the "Show More" button
        showMoreButton.remove();
      });
    }
  }
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
 * Initialize charts in the charts section
 */
function initializeChartsSection() {
  console.log('Initializing charts section...');
  
  if (!allPlayersData || allPlayersData.length === 0) {
    console.error('No data available for charts');
    return;
  }
  
  // Replace chart container IDs with the IDs in the charts section
  const originalIdMapping = {
    'top-sources-chart-container': 'charts-top-sources-container',
    'score-distribution-chart-container': 'charts-distribution-container',
    'score-vs-chests-chart-container': 'charts-score-vs-chests-container',
    'frequent-sources-chart-container': 'charts-frequent-sources-container'
  };
  
  // Temporarily replace element IDs for rendering
  const originalElements = {};
  
  try {
    // Save original elements and replace them with charts-section elements
    for (const [originalId, chartsId] of Object.entries(originalIdMapping)) {
      const originalElement = document.getElementById(originalId);
      const chartsElement = document.getElementById(chartsId);
      
      if (originalElement && chartsElement) {
        // Save original
        originalElements[originalId] = originalElement;
        
        // Replace element ID temporarily
        originalElement.id = 'temp-storage-' + originalId;
        chartsElement.id = originalId;
      }
    }
    
    // Now render charts with dashboardRenderer functions
    // This will target our charts-section elements that now have the dashboard IDs
    dashboardRenderer.renderDashboardCharts(allPlayersData);
    
  } finally {
    // Restore original element IDs
    for (const [originalId, chartsId] of Object.entries(originalIdMapping)) {
      const tempElement = document.getElementById('temp-storage-' + originalId);
      const currentChartsElement = document.getElementById(originalId);
      
      if (tempElement && currentChartsElement) {
        // Restore original element ID
        tempElement.id = originalId;
        currentChartsElement.id = chartsId;
      }
    }
  }
  
  // Force a resize event to ensure charts are properly rendered
  // This is especially important for charts in containers that were initially hidden
  setTimeout(() => {
    console.log('Triggering resize event for charts section');
    
    // First trigger a resize event
    if (window.dispatchEvent) {
      window.dispatchEvent(new Event('resize'));
    }
    
    // Then update all registered charts
    if (chartRenderer.chartRegistry) {
      Object.values(chartRenderer.chartRegistry).forEach(chart => {
        if (chart && typeof chart.update === 'function') {
          try {
            chart.update();
          } catch (error) {
            console.error('Error updating chart:', error);
          }
        }
      });
    }
    
    // Set a second resize trigger after a longer delay to ensure everything is rendered
    setTimeout(() => {
      if (window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 200);
  }, 100);
}

/**
 * Create Category Analysis View
 * Displays source analysis charts
 */
function createCategoryAnalysisView(data) {
  console.log('Creating category analysis view');
  
  // Render source importance as treemap
  analyticsRenderer.renderSourceImportance('source-importance-container', data);
  
  // Render all sources by score
  analyticsRenderer.renderAllSourcesByScore('all-sources-container', data);
  
  // Render top sources with player contributions
  analyticsRenderer.renderTop10SourcesWithPlayers('top-sources-players-container', data);
}

/**
 * Create Clan Analysis View
 * Displays clan-related analytics charts
 */
function createClanAnalysisView(data) {
  console.log('Creating clan analysis view');
  
  // Calculate clan metrics for use in multiple charts
  const clanMetrics = analyticsRenderer.calculateClanMetrics(data);
  
  // Update clan summary statistics
  document.getElementById('clan-total-players').textContent = utils.formatNumber(clanMetrics.totalPlayers);
  document.getElementById('clan-total-score').textContent = utils.formatNumber(clanMetrics.totalScore);
  document.getElementById('clan-average-score').textContent = utils.formatNumber(clanMetrics.averageScore);
  document.getElementById('clan-total-chests').textContent = utils.formatNumber(clanMetrics.totalChests);
  
  // Render clan composition chart
  analyticsRenderer.renderClanComposition('clan-composition-container', data);
  
  // Render contribution curve chart
  analyticsRenderer.renderContributionCurve('contribution-curve-container', data);
}

/**
 * Enhanced category analysis with advanced visualizations
 */
function enhancedCategoryAnalysis(category, data) {
  console.log('Showing enhanced category analysis:', category);
  
  // First show the basic category analysis (existing functionality)
  showCategoryAnalysis(category, data);
  
  // Then show the advanced analyses
  analyticsRenderer.renderCategoryAnalysis(category, data);
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
  const categoryName = category.startsWith('FROM_') ? category.replace('FROM_', '') : category;
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
    // Calculate distribution data - safely handle Math.max/min to avoid spread operator issues
    let maxScore = 0;
    let minScore = Number.MAX_SAFE_INTEGER;
    
    for (let i = 0; i < data.length; i++) {
      const score = data[i][category] || 0;
      if (score > maxScore) maxScore = score;
      if (score < minScore) minScore = score;
    }
    
    // If all scores are 0, adjust minScore
    if (minScore === Number.MAX_SAFE_INTEGER) minScore = 0;
    
    const range = maxScore - minScore;
    const bucketSize = range > 0 ? Math.ceil(range / 10) : 1; // 10 buckets, handle case where all values are the same
    
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
      const score = player[category] || 0;
      if (range > 0) {
        const bucketIndex = Math.min(Math.floor((score - minScore) / bucketSize), buckets.length - 1);
        if (bucketIndex >= 0 && bucketIndex < buckets.length) {
          buckets[bucketIndex].count++;
        }
      } else {
        // All values are the same, put them in the first bucket
        buckets[0].count++;
      }
    });
    
    // Create chart
    chartRenderer.createBarChart(
      'category-chart-container',
      [{
        name: i18n.getText('table.headerPlayers'),
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
 * Hide category analysis - update to hide advanced analysis too
 */
function hideCategoryAnalysis() {
  document.getElementById('category-analysis-content').classList.add('hidden');
  document.getElementById('category-advanced-analysis').classList.add('hidden');
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
  
  // Reset player data reference in domManager
  domManager.setPlayerData([]);
  
  // Reset sort states
  dashboardSortState.column = utils.CORE_COLUMNS.TOTAL_SCORE;
  dashboardSortState.direction = 'desc';
  scoreRulesSortState.column = 'Typ';
  scoreRulesSortState.direction = 'asc';
  
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

/**
 * Render detailed data table
 */
function renderDetailedDataTable() {
  console.log('Rendering detailed data table...');
  
  const container = document.getElementById('detailed-table-container');
  if (!container) return;
  
  // Get all column headers
  const headers = allColumnHeaders;
  
  // Initialize sort state if not already done
  if (!detailedTableSortState.column) {
    detailedTableSortState.column = utils.CORE_COLUMNS.TOTAL_SCORE;
    detailedTableSortState.direction = 'desc';
  }
  
  // Sort the data
  const sortedData = utils.sortData(
    detailedTableSortState.column,
    detailedTableSortState.direction,
    true,
    [...allPlayersData],
    detailedTableSortState
  );
  
  // Check if we're on mobile (screen width <= 640px)
  const isMobile = window.innerWidth <= 640;
  
  // For mobile, limit to 20 rows initially
  let displayData = sortedData;
  let showMoreNeeded = false;
  
  if (isMobile && sortedData.length > 20) {
    displayData = sortedData.slice(0, 20);
    showMoreNeeded = true;
  }
  
  // Render table using the shared renderer
  tableRenderer.renderDataTable(
    container,
    displayData,
    headers,
    detailedTableSortState,
    handleDetailedTableSortClick,
    null, // No row handler for detailed table
    true  // Enable sticky first column for detailed table
  );
  
  // Update sort icons
  utils.updateSortIcons(
    detailedTableSortState.column,
    detailedTableSortState.direction,
    '#detailed-table-container th[data-column]'
  );
  
  // Apply sticky column styles with a delay to ensure DOM is ready
  setTimeout(() => {
    console.log('Applying sticky column styling after table render');
    applyDetailedTableStickyColumn();
    
    // Apply a second time after a longer delay to ensure it sticks
    setTimeout(() => {
      console.log('Re-applying sticky column styling to ensure it works');
      applyDetailedTableStickyColumn();
    }, 300);
  }, 100);
  
  // If on mobile and we have more data to show, add a "Show More" button
  if (showMoreNeeded) {
    // Check if a "Show More" button already exists
    let showMoreButton = container.querySelector('.show-more-button');
    
    if (!showMoreButton) {
      // Create and add the "Show More" button with inline styles
      showMoreButton = document.createElement('button');
      showMoreButton.textContent = i18n.getText('table.showMore') || 'Show All Players';
      showMoreButton.id = 'show-more-ranking';
      
      // Apply inline styles directly for maximum compatibility
      Object.assign(showMoreButton.style, {
        display: 'block',
        width: '80%',
        margin: '0.5rem auto',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        color: '#0f172a',
        fontSize: '0.75rem',
        fontWeight: '600',
        borderRadius: '4px',
        border: '1px solid #f59e0b',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease'
      });
      
      // Add a few backup classes for any additional styling
      showMoreButton.className = 'show-more-button btn btn-amber';
      
      // Adjust for mobile if needed
      if (window.innerWidth <= 640) {
        Object.assign(showMoreButton.style, {
          width: '90%',
          padding: '0.4rem 0.75rem',
          fontSize: '0.7rem',
          margin: '0.4rem auto'
        });
      }
      
      // Add even smaller screen adjustments
      if (window.innerWidth <= 360) {
        Object.assign(showMoreButton.style, {
          width: '85%',
          padding: '0.3rem 0.5rem',
          fontSize: '0.65rem',
          margin: '0.3rem auto'
        });
      }
      
      container.appendChild(showMoreButton);
      
      // Add hover effect through event listeners
      showMoreButton.addEventListener('mouseover', () => {
        showMoreButton.style.backgroundColor = 'rgba(245, 158, 11, 0.9)';
        showMoreButton.style.transform = 'translateY(-1px)';
        showMoreButton.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.4)';
      });
      
      showMoreButton.addEventListener('mouseout', () => {
        showMoreButton.style.backgroundColor = 'rgba(245, 158, 11, 0.8)';
        showMoreButton.style.transform = 'none';
        showMoreButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
      });
      
      showMoreButton.addEventListener('mousedown', () => {
        showMoreButton.style.transform = 'translateY(1px)';
        showMoreButton.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
      });
      
      showMoreButton.addEventListener('mouseup', () => {
        showMoreButton.style.transform = 'translateY(-1px)';
        showMoreButton.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.4)';
      });
      
      // Add click event listener to the button
      showMoreButton.addEventListener('click', () => {
        // Re-render the table with all data
        tableRenderer.renderDataTable(
          container,
          sortedData,
          headers,
          detailedTableSortState,
          handleDetailedTableSortClick,
          null, // No row handler for detailed table
          true  // Keep sticky first column when showing all data
        );
        
        // Update sort icons
        utils.updateSortIcons(
          detailedTableSortState.column,
          detailedTableSortState.direction,
          '#detailed-table-container th[data-column]'
        );
        
        // Apply sticky column again after showing all data
        setTimeout(() => {
          applyDetailedTableStickyColumn();
        }, 100);
        
        // Remove the "Show More" button
        showMoreButton.remove();
      });
    }
  }
}

/**
 * Handle sorting for detailed table
 */
function handleDetailedTableSortClick(event) {
  const column = event.currentTarget.dataset.column;
  if (!column) return;
  
  console.log('Handling detailed table sort click for column:', column);
  
  if (detailedTableSortState.column === column) {
    detailedTableSortState.direction = detailedTableSortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    detailedTableSortState.column = column;
    detailedTableSortState.direction = 'desc';
  }
  
  // Re-render the detailed table
  renderDetailedDataTable();
}

/**
 * Get the current view based on which section is visible
 * @returns {string} The current view name
 */
function getCurrentView() {
  const sections = {
    'dashboard': document.getElementById('dashboard-section'),
    'detailed-table': document.getElementById('detailed-table-section'),
    'charts': document.getElementById('charts-section'),
    'analytics': document.getElementById('analytics-section'),
    'score-system': document.getElementById('score-system-section'),
    'playerDetails': document.getElementById('detail-section')
  };
  
  for (const [view, element] of Object.entries(sections)) {
    if (element && !element.classList.contains('hidden')) {
      return view;
    }
  }
  
  return 'dashboard'; // Default to dashboard if no view is visible
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