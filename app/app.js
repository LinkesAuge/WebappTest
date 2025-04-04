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
// PapaParse is loaded via script tag in index.html
// Using global Papa object instead of import

// Use dataLoader's getWeekDateRange function
const { getAvailableWeeks, getLatestWeek, getWeekDateRange } = dataLoader;

// State variables
let allPlayersData = [];
let displayData = [];
let allColumnHeaders = [];
let scoreRulesData = [];
let currentWeek = null; // Current selected week number
let availableWeeks = []; // Array of available weeks

// Expose allPlayersData to window for chart rendering fallback
window.allPlayersData = allPlayersData;

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
  column: 'Punkte',
  direction: 'desc'
};

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    console.log('Initializing app...');
    
    // Initialize DOM elements first
    domManager.assignElementReferences();
    
    // Set initial status
    utils.setStatus(i18n.getText('status.initializing') || 'Initializing...');
    utils.showLoading();

    // Make dataLoader available globally for date formatting in i18n.js
    window.dataLoader = dataLoader;
    window.utils = utils;
    
    // Set all utility references for other modules
    setReferences();
    
    // Setup event listeners
    initEventListeners();
    
    // Show default view
    domManager.showView('dashboard');
    
    // Initialize language
    const userLang = localStorage.getItem('tbAnalyzerLanguage') || 'de';
    i18n.setLanguage(userLang);
    document.querySelector(`#lang-${userLang}`)?.classList.add('text-primary', 'font-semibold');
    
    // Check for available week files first
    console.log('Fetching available weeks...');
    const availableWeeks = await dataLoader.getAvailableWeeks();
    console.log('Available weeks found:', availableWeeks);
    
    // Determine which week to show
    console.log('Determining latest week...');
    let currentWeek = null;
    
    if (availableWeeks.length > 0) {
      // Get the latest available week
      currentWeek = Math.max(...availableWeeks);
      console.log('Latest week determined:', currentWeek);
      
      // Get the date range for display
      console.log('Getting week date range for current week...');
      const weekRange = utils.getWeekDateRange(currentWeek);
      console.log('Week range:', weekRange);
      
      // Update week display information immediately before loading data
      // This ensures the date is shown correctly on first load
      const weekSelectorBtn = document.getElementById('week-selector-button');
      const currentWeekDisplayDate = document.getElementById('current-week-display-date');
      const currentWeekDisplayWeek = document.getElementById('current-week-display-week');
      
      // Update desktop date selector
      if (currentWeekDisplayDate) {
        currentWeekDisplayDate.textContent = weekRange.formattedRange;
      }
      if (currentWeekDisplayWeek) {
        currentWeekDisplayWeek.textContent = weekRange.weekText;
        // Update the data-i18n-replacements attribute with the current week number
        currentWeekDisplayWeek.setAttribute('data-i18n-replacements', JSON.stringify({"0": currentWeek.toString()}));
      }
      
      // Verify that the selectors were updated
      console.log('Week selector values set immediately:', {
        date: currentWeekDisplayDate?.textContent,
        week: currentWeekDisplayWeek?.textContent
      });
      
      // Initialize the calendar and week selector
      console.log('Initializing calendar...');
      domManager.initializeWeekSelector(
        availableWeeks, 
        currentWeek, 
        handleWeekSelection
      );
      
      // Also ensure the display text is fully updated
      console.log('Updating week selector display...');
      domManager.updateWeekSelectorDisplay(currentWeek, weekRange.formattedRange);
      
      console.log('Week selector initialization complete');
      
      // Load data for the selected week
      await loadAndRenderData(true, currentWeek);
    } else {
      console.warn('No weeks available, falling back to standard data file');
      // If no week files found, use the standard data.csv
      await loadAndRenderData(true);
    }
    
    // Everything is ready
    utils.setStatus(i18n.getText('status.ready') || 'Ready', 'success');
    utils.hideLoading();
    
    // Show the download button only if data is loaded
    domManager.updateHeaderButtonsVisibility(true);
    
    return true;
  } catch (error) {
    console.error('Error during app initialization:', error);
    utils.setStatus((i18n.getText('status.initError') || 'Initialization error') + ': ' + error.message, 'error');
    utils.hideLoading();
    return false;
  }
}

/**
 * Handle the selection of a different week
 * @param {number} weekNumber - The selected week number
 */
async function handleWeekSelection(weekNumber) {
  try {
    console.log(`Week ${weekNumber} selected`);
    
    // Get the current view before loading new data
    const currentView = getCurrentView();
    console.log('Current active view:', currentView);
    
    // Show loading state
    utils.showLoading(i18n.getText('status.loading'));
    
    // Get the week date range for display
    const weekRange = utils.getWeekDateRange(weekNumber);
    console.log('Selected week range:', weekRange);
    
    // Update UI to show the selected week
    domManager.updateWeekSelectorDisplay(weekNumber, weekRange.formattedRange);
    
    // Load data for the selected week
    await loadAndRenderData(false, weekNumber);
    
    // Update the current week global variable
    currentWeek = weekNumber;
    
    // Make sure we update the current view with new data
    refreshCurrentView(currentView);
    
    // Hide loading state
    utils.hideLoading();
    utils.setStatus(i18n.getText('status.ready') || 'Ready', 'success');
    
    return true;
  } catch (error) {
    console.error('Error handling week selection:', error);
    utils.setStatus(i18n.getText('status.weekSelectError', [error.message]), 'error');
    utils.hideLoading();
    return false;
  }
}

/**
 * Refresh the current view with new data
 * @param {string} viewName - The view to refresh
 */
function refreshCurrentView(viewName) {
  console.log('Refreshing view:', viewName);
  
  switch (viewName) {
    case 'dashboard':
      renderDashboard();
      renderPlayerTable(displayData);
      break;
      
    case 'detailed-table':
      renderDetailedDataTable();
      setTimeout(() => {
        applyDetailedTableStickyColumn();
      }, 100);
      break;
      
    case 'charts':
      initializeChartsSection();
      break;
      
    case 'analytics':
      if (allPlayersData.length > 0) {
        createClanAnalysisView(allPlayersData);
        createCategoryAnalysisView(allPlayersData);
      }
      break;
      
    case 'score-system':
      if (scoreRulesData.length > 0) {
        renderScoreRulesTable(scoreRulesData);
      }
      break;
      
    case 'playerDetails':
      // Since player details view depends on a specific player,
      // we should redirect back to dashboard when changing weeks
      handleViewNavigation('dashboard');
      break;
      
    default:
      console.warn('Unknown view name:', viewName);
      break;
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
 * Load and render data for the application
 * @param {boolean} isFirstInit - Whether this is the first initialization
 * @param {number} [weekNumber] - Optional week number to load data for
 * @returns {Promise<boolean>} True if data was loaded successfully
 */
async function loadAndRenderData(isFirstInit = false, weekNumber = null) {
  console.log(`Loading data: isFirstInit=${isFirstInit}, weekNumber=${weekNumber}`);
  
  try {
    utils.setStatus(i18n.getText('status.loading'));
    utils.showLoading();
    
    // Clear previous data
    allPlayersData.length = 0;
    displayData.length = 0;
    allColumnHeaders.length = 0;
    
    // Load data from the CSV file
    const dataLoaded = await dataLoader.loadStaticCsvData(
      allPlayersData,
      displayData,
      allColumnHeaders,
      utils.sortData,
      dashboardSortState,
      dataLoader.saveDataToLocalStorage,
      weekNumber
    );
    
    if (!dataLoaded || allPlayersData.length === 0) {
      console.error('Failed to load data');
      utils.setStatus(i18n.getText('status.dataLoadError'), 'error');
      document.getElementById('empty-state-section').classList.remove('hidden');
      utils.hideLoading();
      return false;
    }
    
    // Set player data reference in domManager for charts access
    domManager.setPlayerData(allPlayersData);
    
    // If it's first initialization, render the dashboard view
    if (isFirstInit) {
      renderDashboard();
      renderPlayerTable(displayData);
    }
    // Else, if changing weeks, we'll let the calling function handle view updates
    
    // Update the header buttons to show download options
    domManager.updateHeaderButtonsVisibility(true);
    
    utils.hideLoading();
    utils.setStatus(i18n.getText('status.dataLoaded'), 'success', 3000);
    
    return true;
  } catch (error) {
    console.error('Error loading data:', error);
    utils.setStatus(i18n.getText('status.error', { 0: error.message }), 'error');
    utils.hideLoading();
    return false;
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

// Public exports 
export {
  initializeApp,
  handleViewNavigation,
  handleFilter,
  handleSortClick,
  resetStateAndUI,
  toggleTheme,
  downloadCsv,
  downloadPlayerJson,
  getCurrentWeek,
  loadAndRenderData
};

/**
 * Set references to utils functions for other modules
 */
function setReferences() {
  utils.setI18n(i18n.getText);
  dataLoader.setUtils({
    setStatus: utils.setStatus,
    showLoading: utils.showLoading,
    hideLoading: utils.hideLoading,
    getText: i18n.getText,
    resetStateAndUI: resetStateAndUI
  });
  i18n.setRenderFunctions(domManager);
  i18n.setUpdateSortIcons(utils.updateSortIcons);
}

/**
 * Get the currently selected week
 * @returns {number|null} The current week number or null if no week is selected
 */
function getCurrentWeek() {
  return currentWeek;
}

/**
 * Download the current players data as a CSV file
 * @returns {void}
 */
function downloadCsv() {
  console.log('Downloading CSV...');
  
  if (!allPlayersData || allPlayersData.length === 0) {
    utils.setStatus(i18n.getText('status.noDataToDownload'), 'error', 3000);
    return;
  }
  
  try {
    // Get the current week number for the filename
    const weekNum = getCurrentWeek();
    
    // Always include week number in filename, fallback to 'unknown' if not available
    const filename = `clan-data-week-${weekNum || 'unknown'}.csv`;
    
    // Prepare data for conversion, making a copy to avoid modifying the original
    const dataToExport = JSON.parse(JSON.stringify(allPlayersData));
    
    // Convert to CSV using PapaParse
    const csvContent = Papa.unparse({
      fields: allColumnHeaders,
      data: dataToExport
    });
    
    // Trigger the download
    utils.triggerDownload(csvContent, filename, 'text/csv;charset=utf-8;');
    
    utils.setStatus(i18n.getText('status.csvDownloaded'), 'success', 3000);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    utils.setStatus(i18n.getText('status.errorDownloading'), 'error', 3000);
  }
}

/**
 * Download player details as JSON
 * Used when viewing individual player details
 */
function downloadPlayerJson() {
  console.log('Downloading player details as JSON...');
  
  // Get the currently displayed player data
  const playerName = document.getElementById('player-name-detail')?.textContent;
  const playerRank = document.getElementById('player-rank-detail')?.textContent;
  const playerScore = document.getElementById('player-score-detail')?.textContent;
  const playerChests = document.getElementById('player-chests-detail')?.textContent;
  
  if (!playerName || playerName === '[Player Name]') {
    utils.setStatus(i18n.getText('status.noDataToDownload'), 'error', 3000);
    return;
  }
  
  try {
    // Find the full player data in allPlayersData
    const playerData = allPlayersData.find(player => player[0] === playerName);
    
    if (!playerData) {
      utils.setStatus(i18n.getText('status.playerNotFound'), 'error', 3000);
      return;
    }
    
    // Create a structured player object with column headers
    const playerObject = {};
    
    // Add the basic player info
    playerObject.name = playerName;
    playerObject.rank = playerRank;
    playerObject.totalScore = playerScore;
    playerObject.totalChests = playerChests;
    
    // Add all columns from the data
    allColumnHeaders.forEach((header, index) => {
      playerObject[header] = playerData[index];
    });
    
    // Get detailed breakdown if available
    const breakdownList = document.getElementById('player-breakdown-list');
    if (breakdownList) {
      const breakdownItems = Array.from(breakdownList.querySelectorAll('p'));
      const breakdown = [];
      
      breakdownItems.forEach(item => {
        const text = item.textContent.trim();
        if (text && !text.includes('Loading')) {
          const parts = text.split(':');
          if (parts.length >= 2) {
            const source = parts[0].trim();
            const value = parts[1].trim();
            breakdown.push({ source, value });
          }
        }
      });
      
      if (breakdown.length > 0) {
        playerObject.breakdown = breakdown;
      }
    }
    
    // Create filename
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const safePlayerName = playerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `player-${safePlayerName}-${dateString}.json`;
    
    // Convert to JSON and download
    const jsonContent = JSON.stringify(playerObject, null, 2);
    utils.triggerDownload(jsonContent, filename, 'application/json');
    
    utils.setStatus(i18n.getText('status.jsonDownloaded') || 'Player data downloaded', 'success', 3000);
  } catch (error) {
    console.error('Error downloading player JSON:', error);
    utils.setStatus(i18n.getText('status.errorDownloading'), 'error', 3000);
  }
} 