/**
 * Event Listeners Module
 * 
 * Centralizes all event handling for the application
 */

import * as app from './app.js';
import * as utils from './utils.js';
import * as i18n from './i18n.js';
import * as domManager from './domManager.js';
import * as dataLoader from './dataLoader.js';
import * as chartRenderer from './renderer/chartRenderer.js';
import { renderTopSourcesInModal, renderScoreDistributionInModal, renderScoreVsChestsInModal, renderFrequentSourcesInModal } from './domManager.js';

// Imported DOM references
const { elements, collections } = domManager;

/**
 * Setup all event listeners
 */
export function initEventListeners() {
  console.log('Setting up event listeners...');
  
  // Setup navigation links
  setupNavigationListeners();
  
  // Setup language switchers
  setupLanguageSwitchers();
  
  // Setup chart expansion
  setupChartExpansionListeners();
  
  // Setup filter input
  setupFilterInputListener();
  
  // Setup table sorting
  setupTableSortingListeners();
  
  // Setup table row click for player details
  setupTableRowClickListeners();
  
  // Setup download buttons
  setupDownloadButtonListeners();
  
  // Setup mobile menu
  setupMobileMenuListeners();
  
  // Setup category select
  setupCategorySelectListener();
  
  // Set up detailed table view event listeners
  setupDetailedTableViewListeners();
  
  // Note: Week selector initialization is handled in app.js since it requires async operations
  // to get available weeks and determine the latest week
}

/**
 * Setup navigation links
 */
function setupNavigationListeners() {
  // Desktop navigation links
  const desktopNavLinks = document.querySelectorAll('nav a.nav-link');
  desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      app.handleViewNavigation(view);
    });
  });
  
  // Mobile navigation links
  const mobileNavLinks = document.querySelectorAll('#mobile-menu a.nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      app.handleViewNavigation(view);
      domManager.toggleMobileMenu(); // Close menu after navigation
    });
  });
  
  // Back to dashboard buttons
  const backButtons = document.querySelectorAll('[id^="back-to-dashboard"]');
  backButtons.forEach(button => {
    button.addEventListener('click', () => {
      app.handleViewNavigation('dashboard');
    });
  });
  
  // Breadcrumb dashboard link
  const breadcrumbDashboardLink = document.getElementById('breadcrumb-dashboard-link');
  if (breadcrumbDashboardLink) {
    breadcrumbDashboardLink.addEventListener('click', (e) => {
      e.preventDefault();
      app.handleViewNavigation('dashboard');
    });
  }
}

/**
 * Setup language switchers
 */
function setupLanguageSwitchers() {
  // Setup desktop language switchers
  const langDeButton = document.getElementById('lang-de');
  if (langDeButton) {
    langDeButton.addEventListener('click', () => {
      i18n.setLanguage('de');
    });
  }
  
  const langEnButton = document.getElementById('lang-en');
  if (langEnButton) {
    langEnButton.addEventListener('click', () => {
      i18n.setLanguage('en');
    });
  }
  
  // Setup mobile language switchers
  const mobileLangDeButton = document.getElementById('mobile-lang-de');
  if (mobileLangDeButton) {
    mobileLangDeButton.addEventListener('click', () => {
      i18n.setLanguage('de');
    });
  }
  
  const mobileLangEnButton = document.getElementById('mobile-lang-en');
  if (mobileLangEnButton) {
    mobileLangEnButton.addEventListener('click', () => {
      i18n.setLanguage('en');
    });
  }
}

/**
 * Setup chart expansion listeners
 */
function setupChartExpansionListeners() {
  const expandButtons = document.querySelectorAll('[data-chart-type]');
  expandButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const chartType = button.dataset.chartType;
      if (!chartType) return;
      
      console.log(`Expanding chart: ${chartType}`); // Debug logging
      
      // Get modal elements
      const chartModal = document.getElementById('chart-modal');
      const modalChartContainer = document.getElementById('modal-chart-container');
      const modalChartTitle = document.getElementById('modal-chart-title');
      
      if (!chartModal || !modalChartContainer || !modalChartTitle) {
        console.error('Missing modal elements');
        return;
      }
      
      // Set modal title based on chart type
      let titleKey;
      switch (chartType) {
        case 'topChests':
          titleKey = 'dashboard.topChestsTitle';
          break;
        case 'topSources':
          titleKey = 'dashboard.chartTopSourcesTitle';
          break;
        case 'scoreDistribution':
          titleKey = 'dashboard.chartScoreDistTitle';
          break;
        case 'scoreVsChests':
          titleKey = 'dashboard.chartScoreVsChestsTitle';
          break;
        case 'frequentSources':
          titleKey = 'dashboard.chartFreqSourcesTitle';
          break;
        default:
          titleKey = 'dashboard.chartTitle';
      }
      modalChartTitle.textContent = i18n.getText(titleKey);
      
      // Show modal
      chartModal.classList.remove('hidden');
      
      // Clear previous chart
      modalChartContainer.innerHTML = '';
      
      // Clean up any existing chart to prevent conflicts
      if (chartRenderer.chartRegistry.modalChart) {
        chartRenderer.chartRegistry.modalChart.destroy();
        delete chartRenderer.chartRegistry.modalChart;
      }
      
      // Directly render the appropriate chart based on type
      switch (chartType) {
        case 'topChests':
          console.log('Rendering Top Chests chart in modal');
          domManager.renderTopChestsInModal(modalChartContainer);
          break;
        case 'topSources':
          console.log('Rendering Top Sources chart in modal');
          domManager.renderTopSourcesInModal(modalChartContainer);
          break;
        case 'scoreDistribution':
          console.log('Rendering Score Distribution chart in modal');
          domManager.renderScoreDistributionInModal(modalChartContainer);
          break;
        case 'scoreVsChests':
          console.log('Rendering Score vs Chests chart in modal');
          domManager.renderScoreVsChestsInModal(modalChartContainer);
          break;
        case 'frequentSources':
          console.log('Rendering Frequent Sources chart in modal');
          domManager.renderFrequentSourcesInModal(modalChartContainer);
          break;
        default:
          console.error(`Unknown chart type: ${chartType}`);
          modalChartContainer.innerHTML = '<div class="text-center text-red-500">Unknown chart type</div>';
      }
    });
  });
  
  // Close modal with close button
  const modalCloseButton = document.getElementById('modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', () => {
      const chartModal = document.getElementById('chart-modal');
      if (chartModal) {
        chartModal.classList.add('hidden');
        
        // Clean up chart
        if (chartRenderer.chartRegistry.modalChart) {
          chartRenderer.chartRegistry.modalChart.destroy();
          delete chartRenderer.chartRegistry.modalChart;
        }
      }
    });
  }
  
  // Close modal when clicking outside
  const chartModal = document.getElementById('chart-modal');
  if (chartModal) {
    chartModal.addEventListener('click', (e) => {
      if (e.target === chartModal) {
        chartModal.classList.add('hidden');
        
        // Clean up chart
        if (chartRenderer.chartRegistry.modalChart) {
          chartRenderer.chartRegistry.modalChart.destroy();
          delete chartRenderer.chartRegistry.modalChart;
        }
      }
    });
  }
  
  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const chartModal = document.getElementById('chart-modal');
      if (chartModal && !chartModal.classList.contains('hidden')) {
        chartModal.classList.add('hidden');
        
        // Clean up chart
        if (chartRenderer.chartRegistry.modalChart) {
          chartRenderer.chartRegistry.modalChart.destroy();
          delete chartRenderer.chartRegistry.modalChart;
        }
      }
    }
  });
}

/**
 * Setup filter input listener
 */
function setupFilterInputListener() {
  const filterInput = document.getElementById('filter-input');
  if (filterInput) {
    filterInput.addEventListener('input', (e) => {
      app.handleFilter(e.target.value);
    });
    
    // Clear button for filter
    filterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        filterInput.value = '';
        app.handleFilter('');
      }
    });
  }
}

/**
 * Setup table sorting listeners
 */
function setupTableSortingListeners() {
  // Dashboard ranking table
  const rankingTableHeaders = document.querySelectorAll('#ranking-section th[data-column]');
  rankingTableHeaders.forEach(header => {
    header.addEventListener('click', app.handleSortClick);
  });
}

/**
 * Setup table row click listeners for player details
 */
function setupTableRowClickListeners() {
  // Will be handled after table is rendered
  // See app.renderPlayerTable for implementation
}

/**
 * Setup download buttons
 */
function setupDownloadButtonListeners() {
  // Header CSV download button
  const headerDownloadButton = document.getElementById('download-csv-header-button');
  if (headerDownloadButton) {
    headerDownloadButton.addEventListener('click', app.downloadCsv);
  }
  
  // Mobile CSV download button
  const mobileDownloadButton = document.getElementById('download-csv-mobile-button');
  if (mobileDownloadButton) {
    mobileDownloadButton.addEventListener('click', app.downloadCsv);
  }
  
  // Player JSON download button
  const playerJsonButton = document.getElementById('download-player-json-button');
  if (playerJsonButton) {
    playerJsonButton.addEventListener('click', () => {
      app.downloadPlayerJson();
    });
  }
}

/**
 * Setup mobile menu listeners
 */
function setupMobileMenuListeners() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', domManager.toggleMobileMenu);
  }
}

/**
 * Setup category select listener
 */
function setupCategorySelectListener() {
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    categorySelect.addEventListener('change', app.handleCategorySelect);
  }
}

/**
 * Set up detailed table view event listeners
 */
function setupDetailedTableViewListeners() {
  // Back to dashboard button
  const backButton = document.getElementById('back-to-dashboard-from-detailed-table');
  if (backButton) {
    backButton.addEventListener('click', () => {
      domManager.showView('dashboard');
      domManager.updateNavLinkActiveState('dashboard');
    });
  }
  
  // Add MutationObserver to detect when the detailed table is rendered
  const detailedTableContainer = document.getElementById('detailed-table-container');
  if (detailedTableContainer) {
    // Create a mutation observer to watch for changes to the container
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if a table was added
          const tableAdded = Array.from(mutation.addedNodes).some(node => 
            node.nodeName === 'TABLE' || 
            (node.nodeType === Node.ELEMENT_NODE && node.querySelector('table'))
          );
          
          if (tableAdded) {
            // Table has been added - apply sticky column styles
            applyDetailedTableStickyColumn();
          }
        }
      });
    });
    
    // Start observing
    observer.observe(detailedTableContainer, { childList: true, subtree: true });
  }
}

/**
 * Apply sticky column styles to the detailed table
 * This function directly manipulates the DOM to ensure the PLAYER column is sticky
 */
export function applyDetailedTableStickyColumn() {
  console.log('Applying sticky column to detailed table...');
  
  // Find the table within the container
  const container = document.getElementById('detailed-table-container');
  if (!container) {
    console.error('Table container not found');
    return;
  }
  
  const table = container.querySelector('table');
  if (!table) {
    console.error('Table element not found');
    return;
  }
  
  // Ensure container has necessary styles for sticky columns to work
  container.style.overflow = 'auto';
  container.style.position = 'relative';
  container.style.maxWidth = '100%';
  
  // Make sure table has the right classes
  table.classList.add('sticky-table');
  table.style.borderCollapse = 'separate';
  table.style.borderSpacing = '0';
  
  // Find the player column index
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) {
    console.error('Table header row not found');
    return;
  }
  
  const headerCells = headerRow.querySelectorAll('th');
  let playerColumnIndex = -1;
  
  headerCells.forEach((cell, index) => {
    const columnName = cell.dataset.column;
    if (columnName === 'PLAYER') {
      playerColumnIndex = index;
      
      // Apply sticky column class and styles forcefully
      cell.classList.add('sticky-column');
      
      // Apply inline styles for maximum compatibility
      cell.style.position = 'sticky';
      cell.style.left = '0';
      cell.style.zIndex = '1000';
      cell.style.backgroundColor = '#1e293b';
      cell.style.boxShadow = '2px 0 5px rgba(0, 0, 0, 0.3)';
    }
  });
  
  if (playerColumnIndex === -1) {
    console.error('PLAYER column not found in table headers');
    return;
  }
  
  console.log(`Found PLAYER column at index ${playerColumnIndex}`);
  
  // Add sticky styles to all cells in the player column
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    if (cells.length > playerColumnIndex) {
      const cell = cells[playerColumnIndex];
      
      // Add sticky class and inline styles for maximum compatibility
      cell.classList.add('sticky-column');
      
      // Apply inline styles directly
      cell.style.position = 'sticky';
      cell.style.left = '0';
      cell.style.zIndex = '999';
      
      // Set background color based on row index for zebra striping - ensure full opacity
      if (rowIndex % 2 === 0) {
        cell.style.backgroundColor = '#0f172a'; // Dark background for even rows (fully opaque)
      } else {
        cell.style.backgroundColor = '#1e293b'; // Lighter background for odd rows (fully opaque)
      }
      
      // Add shadow for visual separation
      cell.style.boxShadow = '2px 0 5px rgba(0, 0, 0, 0.3)';
    }
  });
  
  console.log('Sticky column applied successfully!');
  
  // Ensure proper override of any problematic styles
  const style = document.createElement('style');
  style.textContent = `
    #detailed-table-container th.sticky-column,
    #detailed-table-container td.sticky-column {
      position: sticky !important;
      left: 0 !important;
      z-index: 999 !important;
    }
    
    #detailed-table-container thead th.sticky-column {
      z-index: 1000 !important;
    }
  `;
  
  // Remove any previous style element we might have added
  const previousStyle = document.getElementById('sticky-column-styles');
  if (previousStyle) {
    previousStyle.remove();
  }
  
  // Add ID to the style element for potential future removal
  style.id = 'sticky-column-styles';
  document.head.appendChild(style);
}
