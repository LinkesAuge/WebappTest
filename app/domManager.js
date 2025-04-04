/**
 * domManager.js
 * 
 * Manages DOM element references and basic UI operations.
 * This module caches references to frequently-used DOM elements
 * to avoid repeated querySelector calls.
 */

import * as i18n from './i18n.js';
import * as chartRenderer from './renderer/chartRenderer.js';
import * as utils from './utils.js';

// Reference to player data
let playerDataRef = [];

/**
 * Export playerDataRef for debugging
 */
export { playerDataRef };

/**
 * Set player data reference
 * @param {Array} data - The player data array
 */
export function setPlayerData(data) {
  playerDataRef = data;
}

// DOM element references - will be populated in assignElementReferences
let elements = {
  // Status elements
  statusArea: null,
  loadingSpinner: null,
  statusMessage: null,
  
  // Header and navigation
  downloadCsvHeaderButton: null,
  breadcrumbNav: null,
  breadcrumbDashboardLink: null,
  breadcrumbCurrentPageItem: null,
  breadcrumbCurrentPageName: null,
  
  // Week Selector
  weekSelectorButton: null,
  currentWeekDisplay: null,
  weekCalendar: null,
  mobileWeekSelectorButton: null,
  mobileCurrentWeekDisplay: null,
  mobileWeekCalendar: null,
  
  // Main sections
  emptyStateSection: null,
  dashboardSection: null,
  detailedTableSection: null,
  chartsSection: null,
  analyticsSection: null,
  scoreSystemSection: null,
  detailSection: null,
  
  // Statistics and info
  statTotalPlayers: null,
  statTotalScore: null,
  statTotalChests: null,
  statAvgScore: null,
  statAvgChests: null,
  lastUpdatedInfo: null,
  
  // Chart containers
  topSourcesChartContainer: null,
  scoreDistributionChartContainer: null,
  scoreVsChestsChartContainer: null,
  frequentSourcesChartContainer: null,
  chartsTopSourcesContainer: null,
  chartsDistributionContainer: null,
  chartsScoreVsChestsContainer: null,
  chartsFrequentSourcesContainer: null,
  categoryChartContainer: null,
  playerChartContainer: null,
  modalChartContainer: null,
  
  // Tables and filters
  rankingTableBody: null,
  topChestsTableBody: null,
  detailedTableContainer: null,
  filterInput: null,
  
  // Player details
  playerNameDetail: null,
  playerRankDetail: null,
  playerScoreDetail: null,
  playerChestsDetail: null,
  playerBreakdownList: null,
  
  // Category analysis
  categorySelect: null,
  categoryAnalysisContent: null,
  categoryPrompt: null,
  categoryRankingBody: null,
  categoryNameTable: null,
  categoryNameChart: null,
  
  // Score rules
  scoreRulesTableContainer: null,
  
  // Modal
  chartModal: null,
  modalChartTitle: null,
  modalCloseButton: null,
  
  // Mobile elements
  mobileMenu: null,
  mobileMenuButton: null,
  mobileDownloadContainer: null,
  downloadCsvMobileButton: null,
  iconMenuClosed: null,
  iconMenuOpen: null,
  
  // Additional elements
  langButtons: null
};

// Additional element collections
let collections = {
  desktopNavLinks: [],
  mobileNavLinks: [],
  expandChartButtons: [],
  backToDashboardButtons: [],
  languageSwitchers: []
};

/**
 * Assign references to all required DOM elements
 * @returns {boolean} True if all required elements were found
 */
export function assignElementReferences() {
  console.log("Assigning DOM element references...");
  
  try {
    // Status elements
    elements.statusArea = document.getElementById("status-area");
    elements.loadingSpinner = document.getElementById("loading-spinner");
    elements.statusMessage = document.getElementById("status-message");
    
    // Header Controls and Week Selector elements
    elements.weekSelectorButton = document.getElementById('week-selector-button');
    elements.weekCalendar = document.getElementById('week-calendar');
    elements.currentWeekDisplay = {
      date: document.getElementById('current-week-display-date'),
      week: document.getElementById('current-week-display-week')
    };
    
    // Mobile elements - these might not exist if we're on desktop or if mobile layout changes
    elements.mobileWeekSelectorButton = document.getElementById('mobile-week-selector-button');
    elements.mobileWeekCalendar = document.getElementById('mobile-week-calendar');
    elements.mobileCurrentWeekDisplay = {
      date: document.getElementById('mobile-current-week-display-date'),
      week: document.getElementById('mobile-current-week-display-week')
    };
    
    console.log('Week selector elements found:', {
      weekSelectorButton: !!elements.weekSelectorButton,
      mobileWeekSelectorButton: !!elements.mobileWeekSelectorButton,
      weekCalendar: !!elements.weekCalendar,
      mobileWeekCalendar: !!elements.mobileWeekCalendar,
      currentWeekDisplay: elements.currentWeekDisplay.week,
      mobileCurrentWeekDisplay: elements.mobileCurrentWeekDisplay.week
    });
    
    // Header and navigation
    elements.downloadCsvHeaderButton = document.getElementById("download-csv-header-button");
    elements.breadcrumbNav = document.getElementById("breadcrumb-nav");
    elements.breadcrumbDashboardLink = document.getElementById("breadcrumb-dashboard-link");
    elements.breadcrumbCurrentPageItem = document.getElementById("breadcrumb-current-page-item");
    elements.breadcrumbCurrentPageName = document.getElementById("breadcrumb-current-page-name");
    elements.langButtons = document.querySelectorAll(".lang-button");
    
    // Main sections
    elements.emptyStateSection = document.getElementById("empty-state-section");
    elements.dashboardSection = document.getElementById("dashboard-section");
    elements.detailedTableSection = document.getElementById("detailed-table-section");
    elements.chartsSection = document.getElementById("charts-section");
    elements.analyticsSection = document.getElementById("analytics-section");
    elements.scoreSystemSection = document.getElementById("score-system-section");
    elements.detailSection = document.getElementById("detail-section");
    elements.statTotalPlayers = document.getElementById("stat-total-players");
    elements.statTotalScore = document.getElementById("stat-total-score");
    elements.statTotalChests = document.getElementById("stat-total-chests");
    elements.statAvgScore = document.getElementById("stat-avg-score");
    elements.statAvgChests = document.getElementById("stat-avg-chests");
    elements.lastUpdatedInfo = document.getElementById("last-updated-info");
    elements.topSourcesChartContainer = document.getElementById("top-sources-chart-container");
    elements.scoreDistributionChartContainer = document.getElementById("score-distribution-chart-container");
    elements.scoreVsChestsChartContainer = document.getElementById("score-vs-chests-chart-container");
    elements.frequentSourcesChartContainer = document.getElementById("frequent-sources-chart-container");
    elements.chartsTopSourcesContainer = document.getElementById("charts-top-sources-container");
    elements.chartsDistributionContainer = document.getElementById("charts-distribution-container");
    elements.chartsScoreVsChestsContainer = document.getElementById("charts-score-vs-chests-container");
    elements.chartsFrequentSourcesContainer = document.getElementById("charts-frequent-sources-container");
    elements.categoryChartContainer = document.getElementById("category-chart-container");
    elements.playerChartContainer = document.getElementById("player-chart-container");
    elements.modalChartContainer = document.getElementById("modal-chart-container");
    elements.rankingTableBody = document.getElementById("ranking-table-body");
    elements.topChestsTableBody = document.getElementById("top-chests-table-body");
    elements.detailedTableContainer = document.getElementById("detailed-table-container");
    elements.filterInput = document.getElementById("filter-input");
    elements.playerNameDetail = document.getElementById("player-name-detail");
    elements.playerRankDetail = document.getElementById("player-rank-detail");
    elements.playerScoreDetail = document.getElementById("player-score-detail");
    elements.playerChestsDetail = document.getElementById("player-chests-detail");
    elements.playerBreakdownList = document.getElementById("player-breakdown-list");
    elements.categorySelect = document.getElementById("category-select");
    elements.categoryAnalysisContent = document.getElementById("category-analysis-content");
    elements.categoryPrompt = document.getElementById("category-prompt");
    elements.categoryRankingBody = document.getElementById("category-ranking-body");
    elements.categoryNameTable = document.getElementById("category-name-table");
    elements.categoryNameChart = document.getElementById("category-name-chart");
    elements.scoreRulesTableContainer = document.getElementById("score-rules-table-container");
    elements.chartModal = document.getElementById("chart-modal");
    elements.modalChartTitle = document.getElementById("modal-chart-title");
    elements.modalCloseButton = document.getElementById("modal-close-button");
    elements.mobileMenu = document.getElementById("mobile-menu");
    elements.mobileMenuButton = document.getElementById("mobile-menu-button");
    elements.mobileDownloadContainer = document.getElementById("mobile-download-container");
    elements.downloadCsvMobileButton = document.getElementById("download-csv-mobile-button");
    elements.iconMenuClosed = document.getElementById("icon-menu-closed");
    elements.iconMenuOpen = document.getElementById("icon-menu-open");
    
    // Collect element groups
    collections.desktopNavLinks = document.querySelectorAll("header nav .nav-link");
    collections.mobileNavLinks = document.querySelectorAll("#mobile-menu .nav-link");
    collections.expandChartButtons = document.querySelectorAll("[data-chart-type]");
    collections.backToDashboardButtons = [
      document.getElementById("back-to-dashboard-from-detailed-table"),
      document.getElementById("back-to-dashboard-from-analytics"),
      document.getElementById("back-to-dashboard-from-detail")
    ].filter(Boolean); // Filter out any null elements
    collections.languageSwitchers = [
      document.getElementById("lang-de"),
      document.getElementById("lang-en")
    ].filter(Boolean);

    // Log missing elements
    const missingElements = [];

    // Desktop elements - these are critical
    if (!elements.weekSelectorButton) missingElements.push('weekSelectorButton');
    if (!elements.weekCalendar) missingElements.push('weekCalendar');
    if (!elements.currentWeekDisplay.date) missingElements.push('currentWeekDisplayDate');
    if (!elements.currentWeekDisplay.week) missingElements.push('currentWeekDisplayWeek');

    // Mobile elements - not critical for basic functionality
    // Other elements that might be missing but aren't displayed initially
    if (!elements.mobileWeekSelectorButton) missingElements.push('mobileWeekSelectorButton');
    if (!elements.mobileWeekCalendar) missingElements.push('mobileWeekCalendar');
    if (!elements.mobileCurrentWeekDisplay?.date) missingElements.push('mobileCurrentWeekDisplayDate');
    if (!elements.mobileCurrentWeekDisplay?.week) missingElements.push('mobileCurrentWeekDisplayWeek');
    // ... (other non-critical elements)

    if (missingElements.length > 0) {
      console.warn('Missing DOM elements:', missingElements);
      
      // Check for critical desktop elements only
      const criticalDesktopMissing = ['weekSelectorButton', 'weekCalendar', 
        'currentWeekDisplayDate', 'currentWeekDisplayWeek'].some(el => missingElements.includes(el));
        
      if (criticalDesktopMissing) {
        console.error('Critical week selector elements are missing. Week selector may not function properly.');
      } else {
        console.log('Mobile week selector elements missing, but desktop elements are available. This is normal when mobile view is not shown.');
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error assigning DOM element references:", error);
    return false;
  }
}

/**
 * Show a specific view
 * @param {string} viewName - The name of the view to show
 */
export function showView(viewName) {
  console.log(`Showing view: ${viewName}`);
  
  // Hide all sections - with null checks
  if (elements.emptyStateSection) elements.emptyStateSection.classList.add('hidden');
  if (elements.dashboardSection) elements.dashboardSection.classList.add('hidden');
  if (elements.detailedTableSection) elements.detailedTableSection.classList.add('hidden');
  if (elements.chartsSection) elements.chartsSection.classList.add('hidden');
  if (elements.analyticsSection) elements.analyticsSection.classList.add('hidden');
  if (elements.scoreSystemSection) elements.scoreSystemSection.classList.add('hidden');
  if (elements.detailSection) elements.detailSection.classList.add('hidden');
  
  // Show selected section - with null checks
  switch (viewName) {
    case 'dashboard':
      if (elements.dashboardSection) elements.dashboardSection.classList.remove('hidden');
      break;
    case 'detailed-table':
      if (elements.detailedTableSection) elements.detailedTableSection.classList.remove('hidden');
      break;
    case 'charts':
      if (elements.chartsSection) elements.chartsSection.classList.remove('hidden');
      break;
    case 'analytics':
      if (elements.analyticsSection) elements.analyticsSection.classList.remove('hidden');
      break;
    case 'score-system':
      if (elements.scoreSystemSection) elements.scoreSystemSection.classList.remove('hidden');
      break;
    case 'playerDetails':
      if (elements.detailSection) elements.detailSection.classList.remove('hidden');
      break;
    default:
      if (elements.emptyStateSection) elements.emptyStateSection.classList.remove('hidden');
  }
  
  // Update breadcrumb
  updateBreadcrumb(viewName);
}

/**
 * Update breadcrumb navigation
 * @param {string} viewName - The name of the current view
 */
function updateBreadcrumb(viewName) {
  // Check if breadcrumb element exists
  if (!elements.breadcrumbNav) {
    console.warn('Breadcrumb navigation element not found');
    return;
  }
  
  if (viewName === 'dashboard') {
    elements.breadcrumbNav.classList.add('hidden');
    return;
  }
  
  elements.breadcrumbNav.classList.remove('hidden');
  
  // Set current page name
  let pageName = '';
  switch (viewName) {
    case 'detailed-table':
      pageName = i18n.getText('page.detailedTable');
      break;
    case 'charts':
      pageName = i18n.getText('page.charts');
      break;
    case 'analytics':
      pageName = i18n.getText('page.analytics');
      break;
    case 'score-system':
      pageName = i18n.getText('page.scoreSystem');
      break;
    case 'playerDetails':
      pageName = i18n.getText('page.playerDetails');
      break;
  }
  
  // Check if breadcrumb current page name element exists
  if (elements.breadcrumbCurrentPageName) {
    elements.breadcrumbCurrentPageName.textContent = pageName;
  }
}

/**
 * Update active state of navigation links
 * @param {string} viewName - The name of the active view
 */
export function updateNavLinkActiveState(viewName) {
  // Desktop nav links
  if (collections.desktopNavLinks && collections.desktopNavLinks.length > 0) {
    collections.desktopNavLinks.forEach(link => {
      if (link && link.classList) {
        if (link.dataset.view === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  
  // Mobile nav links
  if (collections.mobileNavLinks && collections.mobileNavLinks.length > 0) {
    collections.mobileNavLinks.forEach(link => {
      if (link && link.classList) {
        if (link.dataset.view === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
}

/**
 * Update visibility of header buttons based on data availability
 * @param {boolean} dataAvailable - Whether data is available
 */
export function updateHeaderButtonsVisibility(dataAvailable) {
  // Update download button visibility
  if (elements.downloadCsvHeaderButton) {
    elements.downloadCsvHeaderButton.disabled = !dataAvailable;
    elements.downloadCsvHeaderButton.classList.toggle('opacity-50', !dataAvailable);
    elements.downloadCsvHeaderButton.classList.toggle('cursor-not-allowed', !dataAvailable);
  }
  
  // Update mobile download button visibility
  if (elements.downloadCsvMobileButton) {
    elements.downloadCsvMobileButton.disabled = !dataAvailable;
  }
}

/**
 * Toggle mobile menu visibility
 */
export function toggleMobileMenu() {
  elements.mobileMenu.classList.toggle('hidden');
  elements.iconMenuClosed.classList.toggle('hidden');
  elements.iconMenuOpen.classList.toggle('hidden');
}

/**
 * Open chart modal
 * @param {string} chartType - The type of chart to show in modal
 * @param {Event} event - The click event (optional)
 */
export function openChartModal(chartType, event) {
  elements.chartModal.classList.remove('hidden');
  
  // Set modal title
  let title = '';
  switch (chartType) {
    case 'topChests':
      title = i18n.getText('dashboard.topChestsTitle');
      break;
    case 'topSources':
      title = i18n.getText('dashboard.chartTopSourcesTitle');
      break;
    case 'scoreDistribution':
      title = i18n.getText('dashboard.chartScoreDistTitle');
      break;
    case 'scoreVsChests':
      title = i18n.getText('dashboard.chartScoreVsChestsTitle');
      break;
    case 'frequentSources':
      title = i18n.getText('dashboard.chartFreqSourcesTitle');
      break;
  }
  elements.modalChartTitle.textContent = title;
  
  // Render chart in modal
  const modalChartContainer = document.getElementById('modal-chart-container');
  if (!modalChartContainer) return;
  
  // Clear previous chart
  modalChartContainer.innerHTML = '';

  // Clear any existing chart in the registry
  if (chartRenderer.chartRegistry.modalChart) {
    chartRenderer.chartRegistry.modalChart.destroy();
    delete chartRenderer.chartRegistry.modalChart;
  }
  
  // Render appropriate chart
  switch (chartType) {
    case 'topChests':
      renderTopChestsInModal(modalChartContainer);
      break;
    case 'topSources':
      renderTopSourcesInModal(modalChartContainer);
      break;
    case 'scoreDistribution':
      renderScoreDistributionInModal(modalChartContainer);
      break;
    case 'scoreVsChests':
      renderScoreVsChestsInModal(modalChartContainer);
      break;
    case 'frequentSources':
      renderFrequentSourcesInModal(modalChartContainer);
      break;
  }
}

/**
 * Render the Top Chests chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderTopChestsInModal(container = elements.modalChartContainer) {
  try {
    console.log('renderTopChestsInModal - Player data status:', {
      exists: !!playerDataRef,
      isArray: Array.isArray(playerDataRef),
      length: playerDataRef ? playerDataRef.length : 0
    });
    
    // If player data is not available, try to get it from the app's global variables
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      // Try to check if the window.allPlayersData is available as a fallback
      if (window.allPlayersData && window.allPlayersData.length > 0) {
        console.log('Using fallback from window.allPlayersData');
        playerDataRef = window.allPlayersData;
      } else {
        container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
        return;
      }
    }
    
    // Prepare data for charts
    const topPlayers = playerDataRef
      .sort((a, b) => Number(b.CHEST_COUNT) - Number(a.CHEST_COUNT))
      .slice(0, 10);
    
    const labels = topPlayers.map(player => player.PLAYER);
    const data = topPlayers.map(player => Number(player.CHEST_COUNT));
    
    // Render the chart
    const chart = chartRenderer.createBarChart(
      container,
      [{
        name: i18n.getText('table.headerChests'),
        data
      }],
      labels,
      i18n.getText('dashboard.chartTopChestsTitle')
    );
    
    // Store the chart in the registry
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering top chests chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

/**
 * Render the Top Sources chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderTopSourcesInModal(container = elements.modalChartContainer) {
  try {
    console.log('renderTopSourcesInModal - Player data status:', {
      exists: !!playerDataRef,
      isArray: Array.isArray(playerDataRef),
      length: playerDataRef ? playerDataRef.length : 0
    });
    
    // If player data is not available, try to get it from the app's global variables
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      // Try to check if the window.allPlayersData is available as a fallback
      if (window.allPlayersData && window.allPlayersData.length > 0) {
        console.log('Using fallback from window.allPlayersData');
        playerDataRef = window.allPlayersData;
      } else {
        container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
        return;
      }
    }

    const { names, values } = getSourcesDataForCharts(playerDataRef);

    // Show exactly top 10 sources, consistent with dashboard
    const topNames = names.slice(0, 10);
    const topValues = values.slice(0, 10);

    // Render the chart - pass container element directly instead of ID
    const chart = chartRenderer.createDonutChart(
      container,
      topValues,
      topNames,
      i18n.getText('dashboard.chartTopSourcesTitle')
    );

    // Store the chart with a consistent key
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering top sources chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

/**
 * Render the Score Distribution chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderScoreDistributionInModal(container = elements.modalChartContainer) {
  try {
    console.log('renderScoreDistributionInModal - Player data status:', {
      exists: !!playerDataRef,
      isArray: Array.isArray(playerDataRef),
      length: playerDataRef ? playerDataRef.length : 0
    });
    
    // If player data is not available, try to get it from the app's global variables
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      // Try to check if the window.allPlayersData is available as a fallback
      if (window.allPlayersData && window.allPlayersData.length > 0) {
        console.log('Using fallback from window.allPlayersData');
        playerDataRef = window.allPlayersData;
      } else {
        container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
        return;
      }
    }

    const data = playerDataRef;

    // Define score brackets
    const bracketSize = 500;
    const min = 0; // We always want to start at 0 for score
    // Find the max score (ceiling to the next bracketSize multiple)
    const maxScore = Math.max(...data.map(player => Number(player.TOTAL_SCORE) || 0));
    const max = Math.ceil(maxScore / bracketSize) * bracketSize;

    // Create empty brackets (start at 0 to max, step by bracketSize)
    const brackets = {};
    for (let i = min; i < max; i += bracketSize) {
      const bracketLabel = `${utils.formatNumber(i)}-${utils.formatNumber(i + bracketSize - 1)}`;
      brackets[bracketLabel] = 0;
    }

    // Count players in each bracket
    data.forEach(player => {
      const score = Number(player.TOTAL_SCORE) || 0;
      const bracketIndex = Math.floor(score / bracketSize);
      const bracketStart = bracketIndex * bracketSize;
      const bracketLabel = `${utils.formatNumber(bracketStart)}-${utils.formatNumber(bracketStart + bracketSize - 1)}`;
      
      if (brackets[bracketLabel] !== undefined) {
        brackets[bracketLabel]++;
      }
    });

    // Prepare chart data
    const categories = Object.keys(brackets);
    const seriesData = Object.values(brackets);

    // Create chart - pass container element directly instead of ID
    const chart = chartRenderer.createBarChart(
      container,
      [{
        name: i18n.getText('table.headerPlayers'),
        data: seriesData
      }],
      categories,
      i18n.getText('dashboard.chartScoreDistTitle')
    );

    // Store the chart with a consistent key
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering score distribution chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

/**
 * Render the Score vs Chests chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderScoreVsChestsInModal(container = elements.modalChartContainer) {
  try {
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
      return;
    }

    const data = playerDataRef;

    // Prepare data for scatter plot
    const scatterData = data.map(player => [
      Number(player.CHEST_COUNT) || 0,
      Number(player.TOTAL_SCORE) || 0,
      player.PLAYER
    ]);

    // Create chart - pass container element directly instead of ID
    const chart = chartRenderer.createScatterChart(
      container,
      scatterData,
      i18n.getText('dashboard.chartScoreVsChestsTitle'),
      i18n.getText('table.headerChests'),
      i18n.getText('dashboard.totalScore')
    );

    // Store the chart with a consistent key
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering score vs chests chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

/**
 * Render the Frequent Sources chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderFrequentSourcesInModal(container = elements.modalChartContainer) {
  try {
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
      return;
    }
    
    const data = playerDataRef;
    
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
    
    // Show exactly top 10 sources, consistent with dashboard
    const topKeys = Object.keys(sortedSources).slice(0, 10);
    const topValues = Object.values(sortedSources).slice(0, 10);
    
    // Create chart - pass container element directly instead of ID
    const chart = chartRenderer.createBarChart(
      container,
      [{
        name: i18n.getText('table.headerPlayers'),
        data: topValues
      }],
      topKeys,
      i18n.getText('dashboard.chartFreqSourcesTitle')
    );
    
    // Store the chart with a consistent key
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering frequent sources chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

/**
 * Helper function to get sources data from player data for charts
 * @param {Array} data - Player data
 * @returns {Object} Object with sources data names and values
 */
function getSourcesDataForCharts(data) {
  // Detect column headers that could be source columns
  // They should not be core columns (PLAYER, TOTAL_SCORE, CHEST_COUNT, RANK, etc.)
  const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'RANK'];
  const sourceColumns = Object.keys(data[0])
    .filter(key => !coreColumns.includes(key) && key !== '' && key !== undefined);
  
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
 * Close chart modal
 */
export function closeChartModal() {
  elements.chartModal.classList.add('hidden');
  
  // Clean up the chart to prevent memory leaks and conflicts
  if (chartRenderer.chartRegistry.modalChart) {
    chartRenderer.chartRegistry.modalChart.destroy();
    delete chartRenderer.chartRegistry.modalChart;
  }
}

/**
 * Resets the dashboard UI elements to their default state
 */
export function resetDashboardUI() {
  // Reset stats
  if (elements.statTotalPlayers) elements.statTotalPlayers.textContent = "-";
  if (elements.statTotalScore) elements.statTotalScore.textContent = "-";
  if (elements.statTotalChests) elements.statTotalChests.textContent = "-";
  if (elements.statAvgScore) elements.statAvgScore.textContent = "-";
  if (elements.statAvgChests) elements.statAvgChests.textContent = "-";
  
  // Reset ranking table
  if (elements.rankingTableBody) {
    elements.rankingTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-slate-500">No data loaded.</td></tr>`;
  }
  
  // Reset top chests table
  if (elements.topChestsTableBody) {
    elements.topChestsTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500 text-xs">Loading...</td></tr>`;
  }
  
  // Reset last updated
  if (elements.lastUpdatedInfo) elements.lastUpdatedInfo.textContent = "";
}

/**
 * Update the last updated timestamp display
 * @param {string} timestamp - The formatted timestamp to display
 * @param {Function} getText - Function to get translated text
 */
export function updateLastUpdatedTimestamp(timestamp, getText) {
  if (!elements.lastUpdatedInfo) {
    console.error('Last updated info element not found');
    return;
  }

  try {
    if (!timestamp || timestamp === getText('status.dateUnavailable')) {
      elements.lastUpdatedInfo.textContent = getText('status.lastUpdatedUnavailable');
      return;
    }

    // Format: "Last Updated: [timestamp]"
    const label = getText('status.lastUpdatedLabel');
    elements.lastUpdatedInfo.textContent = `${label} ${timestamp}`;
    
    // Add appropriate styling
    elements.lastUpdatedInfo.classList.remove('text-red-500');
    elements.lastUpdatedInfo.classList.add('text-slate-600');
  } catch (error) {
    console.error('Error updating timestamp:', error);
    elements.lastUpdatedInfo.textContent = getText('status.lastUpdatedUnavailable');
    elements.lastUpdatedInfo.classList.add('text-red-500');
  }
}

/**
 * Ensures that required container elements exist in the DOM
 * This is useful for dynamically created elements that may not exist on page load
 */
export function ensureRequiredContainers() {
  // Check and create ranking table body if it doesn't exist
  const rankingTableContainer = document.getElementById('ranking-table-container');
  if (rankingTableContainer) {
    let rankingTableBody = document.getElementById('ranking-table-body');
    
    if (!rankingTableBody) {
      console.log('Creating ranking-table-body element');
      
      // First check if there's already a table in the container
      let existingTable = rankingTableContainer.querySelector('table');
      
      if (!existingTable) {
        // Create the table structure if it doesn't exist
        rankingTableContainer.innerHTML = `
          <table class="min-w-full divide-y divide-slate-700/50">
            <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th data-column="RANK" class="pr-4 pl-2 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150 w-16">Rank<span class="sort-icon inline-block w-3 ml-1"></span></th>
                <th data-column="PLAYER" class="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150">Player<span class="sort-icon inline-block w-3 ml-1"></span></th>
                <th data-column="TOTAL_SCORE" class="px-4 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150">Total Score<span class="sort-icon inline-block w-3 ml-1"></span></th>
                <th data-column="CHEST_COUNT" class="px-4 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150">Chest Count<span class="sort-icon inline-block w-3 ml-1"></span></th>
              </tr>
            </thead>
            <tbody id="ranking-table-body" class="bg-slate-900/20">
              <tr><td colspan="4" class="text-center py-12 text-slate-500">No data loaded.</td></tr>
            </tbody>
          </table>
        `;
      } else {
        // If table exists but tbody doesn't, add an id to the existing tbody
        const existingTbody = existingTable.querySelector('tbody');
        if (existingTbody) {
          existingTbody.id = 'ranking-table-body';
        } else {
          // If no tbody exists, create one
          const tbody = document.createElement('tbody');
          tbody.id = 'ranking-table-body';
          tbody.className = 'bg-slate-900/20';
          tbody.innerHTML = '<tr><td colspan="4" class="text-center py-12 text-slate-500">No data loaded.</td></tr>';
          existingTable.appendChild(tbody);
        }
      }
      
      // Update the elements reference
      elements.rankingTableBody = document.getElementById('ranking-table-body');
    }
  }
  
  // Similar checks can be added for other dynamically created elements
}

/**
 * Update the week selector display with the selected week
 * @param {number} weekNumber - The selected week number
 * @param {string} dateRange - The formatted date range string
 * @returns {boolean} Success status
 */
export function updateWeekSelectorDisplay(weekNumber, dateRange) {
  console.log(`Updating week selector display: Week ${weekNumber}, Range: ${dateRange}`);
  
  try {
    // Format week number text using i18n
    const weekText = i18n.getText('week.weekNumber', [weekNumber]);
    
    // Update desktop week selector
    const weekDisplayDate = document.getElementById('current-week-display-date');
    const weekDisplayWeek = document.getElementById('current-week-display-week');
    
    if (weekDisplayDate) {
      weekDisplayDate.textContent = dateRange || '';
    }
    
    if (weekDisplayWeek) {
      weekDisplayWeek.textContent = weekText || '';
    }
    
    // Update mobile week selector if it exists
    const mobileWeekDisplayDate = document.getElementById('mobile-current-week-display-date');
    const mobileWeekDisplayWeek = document.getElementById('mobile-current-week-display-week');
    
    if (mobileWeekDisplayDate) {
      mobileWeekDisplayDate.textContent = dateRange || '';
    }
    
    if (mobileWeekDisplayWeek) {
      mobileWeekDisplayWeek.textContent = weekText || '';
    }
    
    console.log('Week selector display updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating week selector display:', error);
    return false;
  }
}

/**
 * Initialize the week selector UI component
 * @param {Array<number>} availableWeeks - Array of available week numbers
 * @param {number} selectedWeek - Currently selected week number
 * @param {Function} onWeekSelect - Callback function when a week is selected
 */
export function initializeWeekSelector(availableWeeks, selectedWeek, onWeekSelect) {
  console.log('DOM: Initializing week selector with:', { availableWeeks, selectedWeek });
  
  // Log all elements to see what's missing
  console.log('DOM: Week calendar element:', elements.weekCalendar);
  console.log('DOM: Mobile week calendar element:', elements.mobileWeekCalendar);
  console.log('DOM: Current week display:', elements.currentWeekDisplay);
  console.log('DOM: Mobile current week display:', elements.mobileCurrentWeekDisplay);
  
  // Try to get the elements if they're not in our cache
  if (!elements.weekCalendar) {
    console.log('DOM: Week calendar element not found. Searching DOM directly:', document.getElementById('week-calendar'));
    elements.weekCalendar = document.getElementById('week-calendar');
  }
  
  // Check if desktop calendar exists - only this is required
  if (!elements.weekCalendar || !elements.weekSelectorButton) {
    console.error('Cannot initialize week selector: Required desktop elements not found');
    return;
  }
  
  try {
    // Check if Flatpickr is available
    if (typeof flatpickr !== 'function') {
      console.error('Flatpickr library not found. Make sure it is properly loaded.');
      return;
    }
    
    // Initialize desktop calendar
    console.log('Initializing desktop week calendar...');
    
    // Get all available dates for the available weeks
    const enabledDates = [];
    const currentYear = new Date().getFullYear();
    
    // For each available week, add all days of that week to enabled dates
    availableWeeks.forEach(weekNum => {
      // Get the date range for this week
      const weekRange = utils.getWeekDateRange(weekNum, currentYear);
      const startDate = new Date(weekRange.startDate);
      const endDate = new Date(weekRange.endDate);
      
      console.log(`Adding week ${weekNum} dates from ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      // Add all days between start and end (inclusive)
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        enabledDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Configure the flatpickr instance with week numbers
    const fpConfig = {
      inline: false,
      weekNumbers: true,
      dateFormat: "d.m.Y",
      locale: { firstDayOfWeek: 1 }, // Start weeks on Monday
      enable: enabledDates,
      disableMobile: "true",
      static: true,
      onChange: (selectedDates) => {
        if (selectedDates && selectedDates.length > 0) {
          // Find which week the selected date belongs to
          const selectedDate = selectedDates[0];
          
          // Get week number using the ISO week numbering
          const weekNumber = getISOWeek(selectedDate);
          
          console.log(`Date selected: ${selectedDate.toLocaleDateString()}, Week: ${weekNumber}`);
          
          if (availableWeeks.includes(weekNumber)) {
            onWeekSelect(weekNumber);
          } else {
            console.warn(`Selected week ${weekNumber} is not in available weeks:`, availableWeeks);
          }
        }
      }
    };
    
    // Initialize desktop calendar
    const desktopCalendar = flatpickr(elements.weekCalendar, fpConfig);
    console.log('Desktop calendar initialized successfully');
    
    // Set up click handler for the desktop calendar button
    elements.weekSelectorButton.addEventListener('click', function() {
      console.log('Week selector button clicked, opening calendar');
      desktopCalendar.open();
    });
  
    // Initialize mobile calendar only if elements exist
    if (elements.mobileWeekCalendar && elements.mobileWeekSelectorButton) {
      console.log('Initializing mobile week calendar...');
      const mobileCalendar = flatpickr(elements.mobileWeekCalendar, fpConfig);
      console.log('Mobile calendar initialized successfully');
      
      // Set up click handler for the mobile calendar button
      elements.mobileWeekSelectorButton.addEventListener('click', function() {
        mobileCalendar.open();
      });
    } else {
      console.log('Mobile week selector elements not found, skipping mobile calendar initialization');
    }
    
    console.log('Week selector initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing week selector:', error);
    return false;
  }
}

// Helper function to get ISO week number
function getISOWeek(date) {
  // Create a copy of the date to avoid modifying the original
  const d = new Date(date.getTime());
  
  // Set to nearest Thursday (considering Monday as first day of week)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  
  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);
  
  // Calculate full weeks to nearest Thursday
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  
  console.log(`getISOWeek calculation: date=${date.toISOString()}, weekNum=${weekNum}`);
  return weekNum;
}

/**
 * Render the Top Scores chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderTopScoresInModal(container = elements.modalChartContainer) {
  try {
    console.log('renderTopScoresInModal - Player data status:', {
      exists: !!playerDataRef,
      isArray: Array.isArray(playerDataRef),
      length: playerDataRef ? playerDataRef.length : 0
    });
    
    // If player data is not available, try to get it from the app's global variables
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      // Try to check if the window.allPlayersData is available as a fallback
      if (window.allPlayersData && window.allPlayersData.length > 0) {
        console.log('Using fallback from window.allPlayersData');
        playerDataRef = window.allPlayersData;
      } else {
        container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
        return;
      }
    }
    
    // Sort data by total score
    const topPlayers = [...playerDataRef]
      .sort((a, b) => Number(b.TOTAL_SCORE) - Number(a.TOTAL_SCORE))
      .slice(0, 10); // Show exactly top 10 players
    
    // Prepare data for chart
    const labels = topPlayers.map(player => player.PLAYER);
    const data = topPlayers.map(player => Number(player.TOTAL_SCORE));
    
    // Create chart
    const chart = chartRenderer.createBarChart(
      container,
      [{
        name: i18n.getText('table.headerScore'),
        data
      }],
      labels,
      i18n.getText('dashboard.chartTopScoresTitle')
    );
    
    // Store the chart in the registry
    chartRenderer.chartRegistry.modalChart = chart;
  } catch (error) {
    console.error('Error rendering top scores chart in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering chart</div>';
  }
}

// Export element references and collections
export { elements, collections };
