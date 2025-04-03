/**
 * Event Listeners Module
 * 
 * Centralizes all event handling for the application
 */

import * as app from './app.js';
import * as utils from './utils.js';
import * as i18n from './i18n.js';
import * as domManager from './domManager.js';

/**
 * Setup all event listeners
 */
export function setupEventListeners() {
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
  const langDe = document.getElementById('lang-de');
  const langEn = document.getElementById('lang-en');
  
  if (langDe) {
    langDe.addEventListener('click', () => {
      i18n.setLanguage('de');
      langDe.classList.add('bg-amber-900/30');
      langEn.classList.remove('bg-amber-900/30');
    });
  }
  
  if (langEn) {
    langEn.addEventListener('click', () => {
      i18n.setLanguage('en');
      langEn.classList.add('bg-amber-900/30');
      langDe.classList.remove('bg-amber-900/30');
    });
  }
}

/**
 * Setup chart expansion listeners
 */
function setupChartExpansionListeners() {
  const expandButtons = document.querySelectorAll('[data-chart-type]');
  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const chartType = button.getAttribute('data-chart-type');
      domManager.openChartModal(chartType);
    });
  });
  
  const modalCloseButton = document.getElementById('modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', domManager.closeChartModal);
  }
  
  // Close modal when clicking outside
  const chartModal = document.getElementById('chart-modal');
  if (chartModal) {
    chartModal.addEventListener('click', (e) => {
      if (e.target === chartModal) {
        domManager.closeChartModal();
      }
    });
  }
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
