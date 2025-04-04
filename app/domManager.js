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
  iconMenuOpen: null
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
 * Assigns references to frequently used DOM elements to variables.
 * This improves performance by avoiding repeated querySelector calls.
 * @returns {boolean} True if all references were assigned successfully
 */
export function assignElementReferences() {
  console.log("Assigning DOM Element References...");
  try {
    // Status elements
    elements.statusArea = document.getElementById("status-area");
    elements.loadingSpinner = document.getElementById("loading-spinner");
    elements.statusMessage = document.getElementById("status-message");
    
    // Header and navigation
    elements.downloadCsvHeaderButton = document.getElementById("download-csv-header-button");
    elements.breadcrumbNav = document.getElementById("breadcrumb-nav");
    elements.breadcrumbDashboardLink = document.getElementById("breadcrumb-dashboard-link");
    elements.breadcrumbCurrentPageItem = document.getElementById("breadcrumb-current-page-item");
    elements.breadcrumbCurrentPageName = document.getElementById("breadcrumb-current-page-name");
    
    // Main sections
    elements.emptyStateSection = document.getElementById("empty-state-section");
    elements.dashboardSection = document.getElementById("dashboard-section");
    elements.detailedTableSection = document.getElementById("detailed-table-section");
    elements.chartsSection = document.getElementById("charts-section");
    elements.analyticsSection = document.getElementById("analytics-section");
    elements.scoreSystemSection = document.getElementById("score-system-section");
    elements.detailSection = document.getElementById("detail-section");
    
    // Statistics and info
    elements.statTotalPlayers = document.getElementById("stat-total-players");
    elements.statTotalScore = document.getElementById("stat-total-score");
    elements.statTotalChests = document.getElementById("stat-total-chests");
    elements.statAvgScore = document.getElementById("stat-avg-score");
    elements.statAvgChests = document.getElementById("stat-avg-chests");
    elements.lastUpdatedInfo = document.getElementById("last-updated-info");
    
    // Chart containers
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
    
    // Tables and filters
    elements.rankingTableBody = document.getElementById("ranking-table-body");
    elements.topChestsTableBody = document.getElementById("top-chests-table-body");
    elements.detailedTableContainer = document.getElementById("detailed-table-container");
    elements.filterInput = document.getElementById("filter-input");
    
    // Player details
    elements.playerNameDetail = document.getElementById("player-name-detail");
    elements.playerRankDetail = document.getElementById("player-rank-detail");
    elements.playerScoreDetail = document.getElementById("player-score-detail");
    elements.playerChestsDetail = document.getElementById("player-chests-detail");
    elements.playerBreakdownList = document.getElementById("player-breakdown-list");
    
    // Category analysis
    elements.categorySelect = document.getElementById("category-select");
    elements.categoryAnalysisContent = document.getElementById("category-analysis-content");
    elements.categoryPrompt = document.getElementById("category-prompt");
    elements.categoryRankingBody = document.getElementById("category-ranking-body");
    elements.categoryNameTable = document.getElementById("category-name-table");
    elements.categoryNameChart = document.getElementById("category-name-chart");
    
    // Score rules
    elements.scoreRulesTableContainer = document.getElementById("score-rules-table-container");
    
    // Modal
    elements.chartModal = document.getElementById("chart-modal");
    elements.modalChartTitle = document.getElementById("modal-chart-title");
    elements.modalCloseButton = document.getElementById("modal-close-button");
    
    // Mobile elements
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

    console.log("DOM Element References assigned.");
    return true; // Return true to indicate successful assignment
  } catch (error) {
    console.error("Error assigning DOM element references:", error);
    if (elements.statusMessage)
      elements.statusMessage.textContent = "Critical error: UI elements missing.";
    if (elements.statusArea) elements.statusArea.classList.add("text-red-500");
    return false; // Return false to indicate failure
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
      pageName = 'Detailed Data';
      break;
    case 'charts':
      pageName = 'Charts';
      break;
    case 'analytics':
      pageName = 'Analytics';
      break;
    case 'score-system':
      pageName = 'Score System';
      break;
    case 'playerDetails':
      pageName = 'Player Details';
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
 * Render the Top10 by Chest Count table in the modal
 * @param {HTMLElement} container - The container element to render the table in
 */
function renderTopChestsInModal(container) {
  try {
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
      return;
    }
    
    // Sort data by chest count
    const sortedData = [...playerDataRef]
      .sort((a, b) => b.CHEST_COUNT - a.CHEST_COUNT)
      .slice(0, 10); // Show exactly top 10 players
    
    // Create table HTML
    const tableHTML = `
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="sticky top-0 bg-slate-800/75 backdrop-blur-sm z-10">
            <tr>
              <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-primary uppercase tracking-wider">${i18n.getText('table.headerPlayer')}</th>
              <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-primary uppercase tracking-wider">${i18n.getText('table.headerChests')}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            ${sortedData.map(player => `
              <tr class="hover:bg-slate-700/30">
                <td class="px-3 py-2 whitespace-nowrap text-left">${player.PLAYER}</td>
                <td class="px-3 py-2 whitespace-nowrap text-right">${utils.formatNumber(player.CHEST_COUNT)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    // Set table HTML
    container.innerHTML = tableHTML;
  } catch (error) {
    console.error('Error rendering top chests table in modal:', error);
    container.innerHTML = '<div class="text-center text-red-500">Error rendering table</div>';
  }
}

/**
 * Render the Top Sources chart in the modal
 * @param {HTMLElement} container - The container element to render the chart in
 */
export function renderTopSourcesInModal(container = elements.modalChartContainer) {
  try {
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
      return;
    }

    const { names, values } = getSourcesDataForCharts(playerDataRef);

    // Show exactly top 10 sources, consistent with dashboard
    const topNames = names.slice(0, 10);
    const topValues = values.slice(0, 10);

    // Render the chart
    const chart = chartRenderer.createDonutChart(
      'modal-chart-container',
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
    if (!playerDataRef || !Array.isArray(playerDataRef) || playerDataRef.length === 0) {
      container.innerHTML = '<div class="text-center text-slate-500">No data available</div>';
      return;
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

    // Create chart
    const chart = chartRenderer.createBarChart(
      'modal-chart-container',
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

    // Create chart
    const chart = chartRenderer.createScatterChart(
      'modal-chart-container',
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
    
    // Create chart
    const chart = chartRenderer.createBarChart(
      'modal-chart-container',
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

// Export element references and collections
export { elements, collections };
