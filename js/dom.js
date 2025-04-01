/**
 * dom.js
 * Contains DOM element references and helper functions for DOM manipulation
 */

// DOM element references
export const elements = {
  // Main container references
  mainContainer: null,
  loadingSpinner: null,
  statusMessage: null,
  statusArea: null,
  
  // Navigation
  navigation: null,
  navLinks: null,
  mobileMenuButton: null,
  mobileMenu: null,
  
  // Views/sections
  dashboardSection: null,
  detailedTableSection: null,
  chartsSection: null,
  analyticsSection: null,
  scoreSystemSection: null,
  historySection: null,
  detailSection: null,
  emptyStateSection: null,
  
  // Dashboard elements
  statTotalPlayers: null,
  statTotalScore: null,
  statTotalChests: null,
  statAvgScore: null,
  statAvgChests: null,
  rankingSection: null,
  rankingTableBody: null,
  filterInput: null,
  topChestsTableBody: null,
  
  // Charts elements
  topSourcesChartContainer: null,
  scoreDistributionChartContainer: null,
  scoreVsChestsChartContainer: null,
  frequentSourcesChartContainer: null,
  
  // Analytics elements
  categorySelect: null,
  categoryAnalysisContent: null,
  categoryChartContainer: null,
  categoryRankingBody: null,
  
  // Detail section elements
  playerNameDetail: null,
  playerRankDetail: null,
  playerScoreDetail: null,
  playerChestsDetail: null,
  playerBreakdownList: null,
  playerChartContainer: null,
  
  // History view elements
  historyContent: null,
  historyLoadingIndicator: null,
  weeklyTotalsTable: null,
  scoreTrendChart: null,
  chestsTrendChart: null,
  topPlayersChart: null,
  categoryTrendChart: null,
  
  // Language switcher
  langDeButton: null,
  langEnButton: null,
  
  // Action buttons
  downloadCsvHeaderButton: null,
  downloadCsvMobileButton: null,
  
  // Week selector
  weekSelector: null,
  mobileWeekSelector: null,
  prevWeekBtn: null,
  nextWeekBtn: null,
  latestWeekIndicator: null,
  
  // Modal elements
  chartModal: null,
  modalChartTitle: null,
  modalCloseButton: null,
  modalChartContainer: null
};

/**
 * Initializes all DOM element references
 * Should be called after the DOM is loaded
 */
export function assignElementReferences() {
  try {
    // Main container references
    elements.mainContainer = document.querySelector('main');
    elements.loadingSpinner = document.getElementById('loading-spinner');
    elements.statusMessage = document.getElementById('status-message');
    elements.statusArea = document.getElementById('status-area');
    
    // Navigation
    elements.navigation = document.querySelector('header nav');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.mobileMenuButton = document.getElementById('mobile-menu-button');
    elements.mobileMenu = document.getElementById('mobile-menu');
    
    // Views/sections
    elements.dashboardSection = document.getElementById('dashboard-section');
    elements.detailedTableSection = document.getElementById('detailed-table-section');
    elements.chartsSection = document.getElementById('charts-section');
    elements.analyticsSection = document.getElementById('analytics-section');
    elements.scoreSystemSection = document.getElementById('score-system-section');
    elements.historySection = document.getElementById('history-section');
    elements.detailSection = document.getElementById('detail-section');
    elements.emptyStateSection = document.getElementById('empty-state-section');
    
    // Dashboard elements
    elements.statTotalPlayers = document.getElementById('stat-total-players');
    elements.statTotalScore = document.getElementById('stat-total-score');
    elements.statTotalChests = document.getElementById('stat-total-chests');
    elements.statAvgScore = document.getElementById('stat-avg-score');
    elements.statAvgChests = document.getElementById('stat-avg-chests');
    elements.rankingSection = document.getElementById('ranking-section');
    elements.rankingTableBody = document.getElementById('ranking-table-body');
    elements.filterInput = document.getElementById('filter-input');
    elements.topChestsTableBody = document.getElementById('top-chests-table-body');
    
    // Charts elements
    elements.topSourcesChartContainer = document.getElementById('top-sources-chart-container');
    elements.scoreDistributionChartContainer = document.getElementById('score-distribution-chart-container');
    elements.scoreVsChestsChartContainer = document.getElementById('score-vs-chests-chart-container');
    elements.frequentSourcesChartContainer = document.getElementById('frequent-sources-chart-container');
    
    // Analytics elements
    elements.categorySelect = document.getElementById('category-select');
    elements.categoryAnalysisContent = document.getElementById('category-analysis-content');
    elements.categoryChartContainer = document.getElementById('category-chart-container');
    elements.categoryRankingBody = document.getElementById('category-ranking-body');
    
    // Detail section elements
    elements.playerNameDetail = document.getElementById('player-name-detail');
    elements.playerRankDetail = document.getElementById('player-rank-detail');
    elements.playerScoreDetail = document.getElementById('player-score-detail');
    elements.playerChestsDetail = document.getElementById('player-chests-detail');
    elements.playerBreakdownList = document.getElementById('player-breakdown-list');
    elements.playerChartContainer = document.getElementById('player-chart-container');
    
    // History view elements
    elements.historyContent = document.getElementById('history-content');
    elements.historyLoadingIndicator = document.getElementById('history-loading-indicator');
    elements.weeklyTotalsTable = document.getElementById('weekly-totals-table');
    elements.scoreTrendChart = document.getElementById('score-trend-chart');
    elements.chestsTrendChart = document.getElementById('chests-trend-chart');
    elements.topPlayersChart = document.getElementById('top-players-chart');
    elements.categoryTrendChart = document.getElementById('category-trend-chart');
    
    // Language switcher
    elements.langDeButton = document.getElementById('lang-de');
    elements.langEnButton = document.getElementById('lang-en');
    
    // Action buttons
    elements.downloadCsvHeaderButton = document.getElementById('download-csv-header-button');
    elements.downloadCsvMobileButton = document.getElementById('download-csv-mobile-button');
    
    // Week selector
    elements.weekSelector = document.getElementById('weekSelector');
    elements.mobileWeekSelector = document.getElementById('mobileWeekSelector');
    elements.prevWeekBtn = document.getElementById('prevWeekBtn');
    elements.nextWeekBtn = document.getElementById('nextWeekBtn');
    elements.latestWeekIndicator = document.getElementById('latestWeekIndicator');
    
    // Modal elements
    elements.chartModal = document.getElementById('chart-modal');
    elements.modalChartTitle = document.getElementById('modal-chart-title');
    elements.modalCloseButton = document.getElementById('modal-close-button');
    elements.modalChartContainer = document.getElementById('modal-chart-container');
    
    console.log('DOM element references assigned successfully');
    return true;
  } catch (error) {
    console.error('Error assigning DOM element references:', error);
    return false;
  }
}

/**
 * Shows a specific view/section and hides all others
 * @param {string} viewId - The ID of the view to show
 */
export function showView(viewId) {
  try {
    // Map the view ID to the actual section element ID
    const sectionMap = {
      'dashboard': 'dashboard-section',
      'dashboard-view': 'dashboard-section',
      'detailed-table': 'detailed-table-section',
      'charts': 'charts-section',
      'analytics': 'analytics-section',
      'score-system': 'score-system-section',
      'history': 'history-section',
      'detail': 'detail-section'
    };
    
    // Get the actual section ID
    const sectionId = sectionMap[viewId] || viewId;
    
    // Get all view elements
    const views = [
      elements.dashboardSection,
      elements.detailedTableSection,
      elements.chartsSection,
      elements.analyticsSection,
      elements.scoreSystemSection,
      elements.historySection,
      elements.detailSection,
      elements.emptyStateSection
    ];
    
    // Hide all views
    views.forEach(view => {
      if (view) {
        view.classList.add('hidden');
      }
    });
    
    // Show the requested view
    const viewToShow = document.getElementById(sectionId);
    if (viewToShow) {
      viewToShow.classList.remove('hidden');
    } else {
      console.error(`View with ID "${sectionId}" not found`);
    }
    
    // Update navigation active state
    updateNavigationActiveState(viewId);
  } catch (error) {
    console.error(`Error showing view "${viewId}":`, error);
  }
}

/**
 * Updates the active state of navigation items
 * @param {string} viewId - The ID of the active view
 */
export function updateNavigationActiveState(viewId) {
  try {
    if (!elements.navLinks) {
      return;
    }
    
    // Remove active class from all nav items
    elements.navLinks.forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to the current nav item (desktop and mobile)
    const desktopNavItem = document.querySelector(`.nav-link[data-view="${viewId}"]`);
    const mobileNavItem = document.querySelector(`#mobile-nav-${viewId}`);
    
    if (desktopNavItem) {
      desktopNavItem.classList.add('active');
    }
    
    if (mobileNavItem) {
      mobileNavItem.classList.add('active');
    }
  } catch (error) {
    console.error('Error updating navigation active state:', error);
  }
}

/**
 * Shows the loading overlay with an optional custom message
 * @param {string} message - The message to display (optional)
 */
export function showLoading(message = null) {
  try {
    if (!elements.statusArea || !elements.loadingSpinner || !elements.statusMessage) {
      console.warn('Loading overlay elements not found');
      return;
    }
    
    if (message) {
      elements.statusMessage.textContent = message;
    }
    
    elements.loadingSpinner.classList.remove('hidden');
  } catch (error) {
    console.error('Error showing loading overlay:', error);
  }
}

/**
 * Hides the loading overlay
 */
export function hideLoading() {
  try {
    if (!elements.loadingSpinner) {
      console.warn('Loading overlay element not found');
      return;
    }
    
    elements.loadingSpinner.classList.add('hidden');
  } catch (error) {
    console.error('Error hiding loading overlay:', error);
  }
}

/**
 * Shows an error message in the status area
 * @param {string} message - The error message to display
 * @param {number} duration - How long to show the error in ms (optional, default 5000ms)
 */
export function showError(message, duration = 5000) {
  try {
    if (!elements.statusMessage) {
      console.warn('Status message element not found');
      return;
    }
    
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.add('text-red-500');
    
    if (duration > 0) {
      setTimeout(() => {
        hideError();
      }, duration);
    }
  } catch (error) {
    console.error('Error showing error message:', error);
  }
}

/**
 * Hides the error message
 */
export function hideError() {
  try {
    if (!elements.statusMessage) {
      console.warn('Status message element not found');
      return;
    }
    
    elements.statusMessage.textContent = '';
    elements.statusMessage.classList.remove('text-red-500');
  } catch (error) {
    console.error('Error hiding error message:', error);
  }
}

/**
 * Shows the modal with content
 * @param {HTMLElement|string} content - The content to display in the modal (HTML element or string)
 */
export function showModal(content) {
  try {
    if (!elements.modal || !elements.modalContent) {
      console.warn('Modal elements not found');
      return;
    }
    
    // Clear previous content
    elements.modalContent.innerHTML = '';
    
    // Add new content
    if (typeof content === 'string') {
      elements.modalContent.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      elements.modalContent.appendChild(content);
    } else {
      console.warn('Invalid content type for modal');
      return;
    }
    
    // Show modal
    elements.modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  } catch (error) {
    console.error('Error showing modal:', error);
  }
}

/**
 * Hides the modal
 */
export function hideModal() {
  try {
    if (!elements.modal) {
      console.warn('Modal element not found');
      return;
    }
    
    elements.modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  } catch (error) {
    console.error('Error hiding modal:', error);
  }
}

/**
 * Creates an HTML element with optional attributes, classes, and content
 * @param {string} tagName - The HTML tag name
 * @param {Object} attributes - Object containing attribute key-value pairs
 * @param {string|string[]} classes - CSS class or array of classes to add
 * @param {string|HTMLElement} content - Text content or child element
 * @returns {HTMLElement} The created HTML element
 */
export function createElement(tagName, attributes = {}, classes = [], content = null) {
  try {
    const element = document.createElement(tagName);
    
    // Add attributes
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value);
    }
    
    // Add classes
    if (typeof classes === 'string') {
      element.classList.add(classes);
    } else if (Array.isArray(classes)) {
      element.classList.add(...classes);
    }
    
    // Add content
    if (content !== null) {
      if (typeof content === 'string') {
        element.textContent = content;
      } else if (content instanceof HTMLElement) {
        element.appendChild(content);
      }
    }
    
    return element;
  } catch (error) {
    console.error('Error creating element:', error);
    return document.createElement(tagName);
  }
}

/**
 * Clears all child elements from a parent element
 * @param {HTMLElement} element - The element to clear
 */
export function clearElement(element) {
  try {
    if (!element) {
      console.warn('Cannot clear null or undefined element');
      return;
    }
    
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  } catch (error) {
    console.error('Error clearing element:', error);
  }
}

// Export default object with all DOM functions
export default {
  elements,
  assignElementReferences,
  showView,
  updateNavigationActiveState,
  showLoading,
  hideLoading,
  showError,
  hideError,
  showModal,
  hideModal,
  createElement,
  clearElement
}; 