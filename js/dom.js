/**
 * dom.js
 *
 * Description: DOM element references and helper functions for manipulating the UI
 * Usage:
 *     Import directly: import { elements, showElement, hideElement } from './dom.js';
 */

import { subscribe } from './state.js';

/**
 * Object containing references to DOM elements
 * @type {Object}
 */
export const elements = {};

/**
 * Safely gets a DOM element by ID and assigns it to the elements object
 * @param {string} id - Element ID to find
 * @param {string} key - Key to use in the elements object
 * @returns {HTMLElement|null} - The found element or null
 */
function safelyGetElement(id, key) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID "${id}" not found`);
  }
  elements[key] = element || null;
  return element;
}

/**
 * Assigns references to frequently used DOM elements
 * @returns {boolean} Success indicator
 */
export function assignElementReferences() {
  console.log("Assigning DOM Element References...");
  try {
    // Status area and loading indicators
    safelyGetElement("status-area", "statusArea");
    safelyGetElement("loading-spinner", "loadingSpinner");
    safelyGetElement("status-message", "statusMessage");
    
    // Breadcrumb navigation
    safelyGetElement("breadcrumb-nav", "breadcrumbNav");
    safelyGetElement("breadcrumb-dashboard-link", "breadcrumbDashboardLink");
    safelyGetElement("breadcrumb-current-page-item", "breadcrumbCurrentPageItem");
    safelyGetElement("breadcrumb-current-page-name", "breadcrumbCurrentPageName");
    
    // Main sections
    safelyGetElement("empty-state-section", "emptyStateSection");
    safelyGetElement("dashboard-section", "dashboardSection");
    safelyGetElement("detailed-table-section", "detailedTableSection");
    safelyGetElement("charts-section", "chartsSection");
    safelyGetElement("analytics-section", "analyticsSection");
    safelyGetElement("score-system-section", "scoreSystemSection");
    safelyGetElement("detail-section", "detailSection");
    
    // Stats elements
    safelyGetElement("stat-total-players", "statTotalPlayers");
    safelyGetElement("stat-total-score", "statTotalScore");
    safelyGetElement("stat-total-chests", "statTotalChests");
    safelyGetElement("stat-avg-score", "statAvgScore");
    safelyGetElement("stat-avg-chests", "statAvgChests");
    safelyGetElement("last-updated-info", "lastUpdatedInfo");
    
    // Chart containers
    safelyGetElement("top-sources-chart-container", "topSourcesChartContainer");
    safelyGetElement("score-distribution-chart-container", "scoreDistributionChartContainer");
    safelyGetElement("score-vs-chests-chart-container", "scoreVsChestsChartContainer");
    safelyGetElement("frequent-sources-chart-container", "frequentSourcesChartContainer");
    safelyGetElement("charts-top-sources-container", "chartsTopSourcesContainer");
    safelyGetElement("charts-distribution-container", "chartsDistributionContainer");
    safelyGetElement("charts-score-vs-chests-container", "chartsScoreVsChestsContainer");
    safelyGetElement("charts-frequent-sources-container", "chartsFrequentSourcesContainer");
    safelyGetElement("player-chart-container", "playerChartContainer");
    safelyGetElement("category-chart-container", "categoryChartContainer");
    
    // Table elements
    safelyGetElement("top-chests-table-body", "topChestsTableBody");
    safelyGetElement("ranking-section", "rankingSection");
    safelyGetElement("ranking-table-body", "rankingTableBody");
    safelyGetElement("detailed-table-container", "detailedTableContainer");
    safelyGetElement("score-rules-table-container", "scoreRulesTableContainer");
    
    // Player detail elements
    safelyGetElement("player-name-detail", "playerNameDetail");
    safelyGetElement("player-score-detail", "playerScoreDetail");
    safelyGetElement("player-chests-detail", "playerChestsDetail");
    safelyGetElement("player-rank-detail", "playerRankDetail");
    safelyGetElement("player-breakdown-list", "playerBreakdownList");
    
    // Analytics elements
    safelyGetElement("category-select", "categorySelect");
    safelyGetElement("category-analysis-content", "categoryAnalysisContent");
    safelyGetElement("category-ranking-body", "categoryRankingBody");
    safelyGetElement("category-name-table", "categoryNameTable");
    safelyGetElement("category-name-chart", "categoryNameChart");
    safelyGetElement("category-prompt", "categoryPrompt");
    
    // Navigation elements
    elements.navLinks = document.querySelectorAll(".nav-link") || [];
    elements.desktopNavLinks = document.querySelectorAll("header nav a.nav-link") || [];
    safelyGetElement("lang-de", "langDeButton");
    safelyGetElement("lang-en", "langEnButton");
    
    // Mobile navigation
    safelyGetElement("mobile-menu-button", "mobileMenuButton");
    safelyGetElement("mobile-menu", "mobileMenu");
    elements.mobileNavLinks = elements.mobileMenu ? elements.mobileMenu.querySelectorAll(".nav-link") : [];
    safelyGetElement("icon-menu-closed", "iconMenuClosed");
    safelyGetElement("icon-menu-open", "iconMenuOpen");
    
    // Back buttons
    safelyGetElement("back-to-dashboard-from-detailed-table", "backToDashboardFromDetailedTable");
    safelyGetElement("back-to-dashboard-from-detail", "backToDashboardFromDetail");
    safelyGetElement("back-to-dashboard-from-analytics", "backToDashboardFromAnalytics");
    
    // Download buttons
    safelyGetElement("download-csv-header-button", "downloadCsvHeaderButton");
    safelyGetElement("download-csv-mobile-button", "downloadCsvMobileButton");
    safelyGetElement("download-player-json-button", "downloadPlayerJsonButton");
    safelyGetElement("mobile-download-container", "mobileDownloadContainer");
    
    // Filter input
    safelyGetElement("filter-input", "filterInput");
    
    // Chart modal
    safelyGetElement("chart-modal", "chartModal");
    safelyGetElement("modal-chart-title", "modalChartTitle");
    safelyGetElement("modal-chart-container", "modalChartContainer");
    safelyGetElement("modal-close-button", "modalCloseButton");
    
    console.log("DOM Element References assigned successfully");
    return true;
  } catch (error) {
    console.error("Error assigning DOM element references:", error);
    // Continue despite errors, don't fail completely
    return true;
  }
}

/**
 * Shows an element by removing the 'hidden' class
 * @param {HTMLElement|string} element - The element or element ID to show
 * @returns {boolean} Success indicator
 */
export function showElement(element) {
  try {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) {
      console.warn(`Element not found: ${typeof element === 'string' ? element : 'element'}`);
      return false;
    }
    
    el.classList.remove('hidden');
    return true;
  } catch (error) {
    console.error("Error showing element:", error);
    return false;
  }
}

/**
 * Hides an element by adding the 'hidden' class
 * @param {HTMLElement|string} element - The element or element ID to hide
 * @returns {boolean} Success indicator
 */
export function hideElement(element) {
  try {
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) {
      console.warn(`Element not found: ${typeof element === 'string' ? element : 'element'}`);
      return false;
    }
    
    el.classList.add('hidden');
    return true;
  } catch (error) {
    console.error("Error hiding element:", error);
    return false;
  }
}

/**
 * Shows a status message in the status area
 * @param {string} message - The message to display
 * @param {string} [type='info'] - The message type ('info', 'success', 'error', 'warning')
 * @returns {boolean} Success indicator
 */
export function showStatusMessage(message, type = 'info') {
  try {
    if (!elements.statusMessage) {
      console.warn('Status message element not found');
      return false;
    }
    
    if (!elements.statusArea) {
      console.warn('Status area element not found');
      return false;
    }
    
    // Set message text
    elements.statusMessage.textContent = message;
    
    // Clear existing status classes
    elements.statusArea.classList.remove('text-green-500', 'text-red-500', 'text-yellow-500', 'text-blue-500');
    
    // Add appropriate class based on type
    switch (type) {
      case 'success':
        elements.statusArea.classList.add('text-green-500');
        break;
      case 'error':
        elements.statusArea.classList.add('text-red-500');
        break;
      case 'warning':
        elements.statusArea.classList.add('text-yellow-500');
        break;
      case 'info':
      default:
        elements.statusArea.classList.add('text-blue-500');
        break;
    }
    
    // Show status area
    showElement(elements.statusArea);
    
    return true;
  } catch (error) {
    console.error("Error showing status message:", error);
    return false;
  }
}

/**
 * Shows an error message in the status area
 * @param {string} message - The error message to display
 * @returns {boolean} Success indicator
 */
export function showError(message) {
  return showStatusMessage(message, 'error');
}

/**
 * Shows the loading spinner
 * @param {string} [message] - Optional loading message
 * @returns {boolean} Success indicator
 */
export function showLoading(message) {
  try {
    let success = true;
    
    if (message && elements.statusMessage) {
      elements.statusMessage.textContent = message;
    } else if (message) {
      console.warn('Status message element not found, cannot display loading message');
      success = false;
    }
    
    if (elements.loadingSpinner) {
      showElement(elements.loadingSpinner);
    } else {
      console.warn('Loading spinner element not found');
      success = false;
    }
    
    if (elements.statusArea) {
      showElement(elements.statusArea);
    } else {
      console.warn('Status area element not found');
      success = false;
    }
    
    return success;
  } catch (error) {
    console.error("Error showing loading state:", error);
    return false;
  }
}

/**
 * Hides the loading spinner
 * @returns {boolean} Success indicator
 */
export function hideLoading() {
  try {
    let success = true;
    
    if (elements.loadingSpinner) {
      hideElement(elements.loadingSpinner);
    } else {
      console.warn('Loading spinner element not found');
      success = false;
    }
    
    return success;
  } catch (error) {
    console.error("Error hiding loading state:", error);
    return false;
  }
}

/**
 * Handles view switching by showing the requested view and hiding others
 * @param {string} viewId - The ID of the view to show
 * @returns {boolean} Success indicator
 */
export function switchView(viewId) {
  try {
    const views = [
      elements.dashboardSection,
      elements.detailedTableSection,
      elements.chartsSection,
      elements.analyticsSection,
      elements.scoreSystemSection,
      elements.detailSection,
      elements.emptyStateSection
    ];
    
    // Find the requested view
    let targetView = null;
    
    switch (viewId) {
      case 'dashboard':
        targetView = elements.dashboardSection;
        break;
      case 'table':
        targetView = elements.detailedTableSection;
        break;
      case 'charts':
        targetView = elements.chartsSection;
        break;
      case 'analytics':
        targetView = elements.analyticsSection;
        break;
      case 'score-system':
        targetView = elements.scoreSystemSection;
        break;
      case 'player-detail':
        targetView = elements.detailSection;
        break;
      case 'empty-state':
        targetView = elements.emptyStateSection;
        break;
      default:
        console.error(`Unknown view: ${viewId}`);
        return false;
    }
    
    if (!targetView) {
      console.error(`Target view not found: ${viewId}`);
      return false;
    }
    
    // Hide all views
    views.forEach(view => {
      if (view) {
        hideElement(view);
      }
    });
    
    // Show target view
    showElement(targetView);
    
    // Update navigation links
    if (elements.navLinks) {
      elements.navLinks.forEach(link => {
        const view = link.dataset.view;
        if (view === viewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Update breadcrumb
    if (elements.breadcrumbCurrentPageName) {
      const viewName = {
        'dashboard': 'Dashboard',
        'table': 'Detailed Table',
        'charts': 'Charts',
        'analytics': 'Analytics',
        'score-system': 'Score System',
        'player-detail': 'Player Detail',
        'empty-state': 'No Data'
      }[viewId] || viewId;
      
      elements.breadcrumbCurrentPageName.textContent = viewName;
      
      // Show breadcrumb for all views except dashboard
      if (viewId !== 'dashboard' && viewId !== 'empty-state') {
        elements.breadcrumbCurrentPageItem.classList.remove('hidden');
      } else {
        elements.breadcrumbCurrentPageItem.classList.add('hidden');
      }
    }
    
    console.log(`Switched to view: ${viewId}`);
    return true;
  } catch (error) {
    console.error(`Error switching to view ${viewId}:`, error);
    return false;
  }
}

/**
 * Update DOM when elements are potentially added or removed (for dynamic content)
 * @returns {boolean} Success indicator
 */
export function refreshDomReferences() {
  console.log("Refreshing DOM element references...");
  // Call assignElementReferences directly to update all DOM references
  return assignElementReferences();
}

// Subscribe to view changes from state
subscribe('currentView', (newView) => {
  if (newView) {
    switchView(newView);
  }
}); 