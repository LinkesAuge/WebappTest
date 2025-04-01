/**
 * listeners.js
 * Contains event listeners and handler functions
 */

import { elements, showView, hideModal } from './dom.js';
import { setLanguage } from './i18n.js';
import * as state from './state.js';
import { filterTable } from './uiUpdates.js';
import { switchWeek } from './historyNew.js';
import { renderPlayerDetails } from './dataProcessing.js';
import { triggerDownload } from './utils.js';

/**
 * Sets up all event listeners for the application
 */
export function setupEventListeners() {
  try {
    console.log('Setting up event listeners...');
    
    // Navigation event listeners
    setupNavigationListeners();
    
    // Language switcher event listeners
    setupLanguageSwitcherListeners();
    
    // Table sorting event listeners
    setupTableSortingListeners();
    
    // Player search filtering
    setupFilteringListeners();
    
    // Player detail view event listeners
    setupPlayerDetailsListeners();
    
    // Week selector event listeners
    setupWeekSelectorNavigation();
    
    // Modal event listeners
    setupModalListeners();
    
    // Download button event listeners
    setupDownloadButtonListeners();
    
    // Add data refresh button listener if needed
    // setupRefreshButtonListeners();
    
    console.log('Event listeners setup complete');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

/**
 * Sets up navigation event listeners
 */
function setupNavigationListeners() {
  try {
    // Get all nav links with the nav-link class
    const navItems = document.querySelectorAll('.nav-link');
    
    if (!navItems || navItems.length === 0) {
      console.warn('Navigation items not found');
      return;
    }
    
    navItems.forEach(item => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        
        const viewId = item.getAttribute('data-view');
        if (viewId) {
          // Update state - use state module to access currentView
          state.currentView = viewId;
          
          // Show the selected view
          showView(viewId);
        }
      });
    });
    
    console.log('Navigation listeners set up successfully');
  } catch (error) {
    console.error('Error setting up navigation listeners:', error);
  }
}

/**
 * Sets up language switcher event listeners
 */
function setupLanguageSwitcherListeners() {
  try {
    if (!elements.langDeButton || !elements.langEnButton) {
      console.warn('Language switcher buttons not found');
      return;
    }
    
    elements.langDeButton.addEventListener('click', (event) => {
      event.preventDefault();
      setLanguage('de');
    });
    
    elements.langEnButton.addEventListener('click', (event) => {
      event.preventDefault();
      setLanguage('en');
    });
  } catch (error) {
    console.error('Error setting up language switcher listeners:', error);
  }
}

/**
 * Sets up table sorting event listeners
 */
function setupTableSortingListeners() {
  try {
    const rankingTable = document.querySelector('#ranking-table');
    
    if (!rankingTable) {
      console.warn('Ranking table not found');
      return;
    }
    
    // Get the header row of the ranking table
    const headerRow = rankingTable.querySelector('thead tr');
    if (!headerRow) {
      console.warn('Ranking table header row not found');
      return;
    }
    
    // Add click event listeners to sortable headers
    const sortableHeaders = headerRow.querySelectorAll('th.sortable');
    sortableHeaders.forEach(header => {
      header.addEventListener('click', () => {
        // Get the column to sort by
        const column = header.getAttribute('data-sort');
        if (!column) return;
        
        // Update sort state
        if (state.sortState.column === column) {
          // Same column, toggle direction
          state.sortState.direction = state.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
          // New column, default to descending for numerical columns
          const defaultDirection = ['PLAYER'].includes(column) ? 'asc' : 'desc';
          state.sortState.column = column;
          state.sortState.direction = defaultDirection;
        }
        
        // Re-render the table with new sort
        document.dispatchEvent(new CustomEvent('updateRankingTable'));
      });
    });
    
    console.log('Table sorting listeners set up successfully');
  } catch (error) {
    console.error('Error setting up table sorting listeners:', error);
  }
}

/**
 * Sets up filtering event listeners
 */
function setupFilteringListeners() {
  try {
    const playerFilter = document.getElementById('filter-input');
    
    if (!playerFilter) {
      console.warn('Player filter input not found');
      return;
    }
    
    // Add input event listener for real-time filtering
    playerFilter.addEventListener('input', (event) => {
      const filterText = event.target.value.trim().toLowerCase();
      filterTable(filterText);
    });
    
    console.log('Filtering listeners set up successfully');
  } catch (error) {
    console.error('Error setting up filtering listeners:', error);
  }
}

/**
 * Sets up player details event listeners
 */
function setupPlayerDetailsListeners() {
  try {
    const rankingTable = document.querySelector('#ranking-table');
    const playerDetailsCloseBtn = document.getElementById('close-player-details');
    const playerDetailsContainer = document.getElementById('player-details-container');
    
    if (!rankingTable || !playerDetailsCloseBtn || !playerDetailsContainer) {
      console.warn('Required elements for player details not found');
      return;
    }
    
    // Add click event listeners to player names in the ranking table
    rankingTable.addEventListener('click', (event) => {
      // Check if the clicked element is a player name
      if (event.target.classList.contains('player-name')) {
        const playerName = event.target.textContent.trim();
        if (playerName) {
          renderPlayerDetails(playerName);
        }
      }
    });
    
    // Add close button event listener
    playerDetailsCloseBtn.addEventListener('click', () => {
      if (playerDetailsContainer) {
        playerDetailsContainer.classList.add('hidden');
      }
    });
    
    console.log('Player details listeners set up successfully');
  } catch (error) {
    console.error('Error setting up player details listeners:', error);
  }
}

/**
 * Sets up week selector navigation listeners
 */
function setupWeekSelectorNavigation() {
  try {
    const weekSelector = document.getElementById('weekSelector');
    const mobileWeekSelector = document.getElementById('mobileWeekSelector');
    const prevWeekBtn = document.getElementById('prevWeekBtn');
    const nextWeekBtn = document.getElementById('nextWeekBtn');
    
    if (!weekSelector) {
      console.warn('Week selector not found');
      return;
    }
    
    // Handle selector change
    weekSelector.addEventListener('change', async (event) => {
      try {
        // Get the selected week ID
        const selectedWeekId = event.target.value;
        
        if (!selectedWeekId) {
          console.warn('No week selected');
          return;
        }
        
        console.log(`Week changed to: ${selectedWeekId}`);
        
        // Call switchWeek function directly from historyNew.js
        await switchWeek(selectedWeekId);
      } catch (error) {
        console.error(`Error handling week change: ${error.message}`);
      }
    });
    
    // Handle mobile selector change if it exists
    if (mobileWeekSelector) {
      mobileWeekSelector.addEventListener('change', async (event) => {
        try {
          // Keep the desktop selector in sync
          weekSelector.value = event.target.value;
          
          // Get the selected week ID
          const selectedWeekId = event.target.value;
          
          if (!selectedWeekId) {
            console.warn('No week selected in mobile selector');
            return;
          }
          
          console.log(`Week changed to: ${selectedWeekId} (mobile)`);
          
          // Call switchWeek function directly from historyNew.js
          await switchWeek(selectedWeekId);
        } catch (error) {
          console.error(`Error handling mobile week change: ${error.message}`);
        }
      });
    }
    
    // Handle navigation buttons
    if (prevWeekBtn) {
      prevWeekBtn.addEventListener('click', () => {
        const currentIndex = weekSelector.selectedIndex;
        if (currentIndex > 0) {
          weekSelector.selectedIndex = currentIndex - 1;
          weekSelector.dispatchEvent(new Event('change'));
        }
      });
    }
    
    if (nextWeekBtn) {
      nextWeekBtn.addEventListener('click', () => {
        const currentIndex = weekSelector.selectedIndex;
        if (currentIndex < weekSelector.options.length - 1) {
          weekSelector.selectedIndex = currentIndex + 1;
          weekSelector.dispatchEvent(new Event('change'));
        }
      });
    }
    
    console.log('Week selector navigation listeners set up');
  } catch (error) {
    console.error('Error setting up week selector navigation listeners:', error);
  }
}

/**
 * Sets up modal event listeners
 */
function setupModalListeners() {
  try {
    const modal = document.getElementById('chart-modal');
    const modalCloseBtn = document.getElementById('modal-close-button');
    
    if (!modal || !modalCloseBtn) {
      console.warn('Modal elements not found');
      return;
    }
    
    // Modal close button
    modalCloseBtn.addEventListener('click', () => {
      hideModal();
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        hideModal();
      }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        hideModal();
      }
    });
    
    console.log('Modal listeners set up successfully');
  } catch (error) {
    console.error('Error setting up modal listeners:', error);
  }
}

/**
 * Sets up download button event listeners
 */
function setupDownloadButtonListeners() {
  try {
    const downloadCsvBtn = document.getElementById('download-csv-header-button');
    const downloadCsvMobileBtn = document.getElementById('download-csv-mobile-button');
    
    if (!downloadCsvBtn && !downloadCsvMobileBtn) {
      console.warn('Download CSV button not found');
      return;
    }
    
    const setupButton = (button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Generate CSV content
        document.dispatchEvent(new CustomEvent('generateAndDownloadCSV'));
      });
    };
    
    if (downloadCsvBtn) {
      setupButton(downloadCsvBtn);
    }
    
    if (downloadCsvMobileBtn) {
      setupButton(downloadCsvMobileBtn);
    }
    
    console.log('Download button listeners set up successfully');
  } catch (error) {
    console.error('Error setting up download button listeners:', error);
  }
}

/**
 * Sets up data refresh button event listeners
 * This is optional and can be activated when needed
 */
function setupRefreshButtonListeners() {
  try {
    const refreshButton = document.getElementById('refresh-data-btn');
    if (!refreshButton) {
      console.warn('Refresh button not found');
      return;
    }
    
    refreshButton.addEventListener('click', async (event) => {
      event.preventDefault();
      
      // Reset state
      state.resetState();
      
      // Reload data
      document.dispatchEvent(new CustomEvent('reloadData'));
    });
  } catch (error) {
    console.error('Error setting up refresh button listeners:', error);
  }
}

// Export default object with all listener functions
export default {
  setupEventListeners,
  setupNavigationListeners,
  setupLanguageSwitcherListeners,
  setupTableSortingListeners,
  setupFilteringListeners,
  setupPlayerDetailsListeners,
  setupWeekSelectorNavigation,
  setupModalListeners,
  setupDownloadButtonListeners,
  setupRefreshButtonListeners
}; 