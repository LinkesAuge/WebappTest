/**
 * tableListeners.js
 *
 * Description: Event listeners for table interactions (sorting, filtering, row selection)
 * Usage:
 *     Import directly: import { initializeTableListeners } from './listeners/tableListeners.js';
 */

import { setState, getState, subscribe } from '../state.js';
import { renderTable } from '../ui-updates/tableRenderer.js';
import { getElement } from '../dom.js';
import { debounce } from '../utils.js';

// Track active listeners for cleanup
const activeListeners = [];

/**
 * Initialize all table-related event listeners
 */
export function initializeTableListeners() {
  setupSortingListeners();
  setupFilteringListeners();
  setupRowSelectionListeners();
  
  // Subscribe to state changes that should update the table
  subscribe('displayData', () => {
    renderTable(getState('displayData'));
  });
  
  console.log('Table listeners initialized');
}

/**
 * Remove all event listeners to prevent memory leaks
 */
export function cleanupTableListeners() {
  activeListeners.forEach(({ element, eventType, listener }) => {
    element.removeEventListener(eventType, listener);
  });
  
  activeListeners.length = 0;
  console.log('Table listeners cleaned up');
}

/**
 * Set up table header sorting event listeners
 */
function setupSortingListeners() {
  const tableHeaders = document.querySelectorAll('th[data-sort]');
  
  tableHeaders.forEach(header => {
    const sortColumn = header.getAttribute('data-sort');
    
    const handleSort = (event) => {
      const currentSortColumn = getState('sortColumn') || '';
      const currentSortDirection = getState('sortDirection') || 'asc';
      
      // Toggle direction if same column, otherwise default to ascending
      const newDirection = 
        (sortColumn === currentSortColumn) 
          ? (currentSortDirection === 'asc' ? 'desc' : 'asc')
          : 'asc';
      
      // Update state
      setState('sortColumn', sortColumn);
      setState('sortDirection', newDirection);
      
      // Update display
      updateSortIndicators(sortColumn, newDirection);
      
      // Stop event propagation
      event.preventDefault();
      event.stopPropagation();
    };
    
    // Add event listener
    header.addEventListener('click', handleSort);
    
    // Track for cleanup
    activeListeners.push({
      element: header,
      eventType: 'click',
      listener: handleSort
    });
  });
}

/**
 * Set up player name filtering event listeners
 */
function setupFilteringListeners() {
  const filterInput = getElement('playerFilterInput');
  
  if (!filterInput) {
    console.warn('Player filter input element not found');
    return;
  }
  
  // Debounce the input to avoid excessive updates
  const handleFilterChange = debounce((event) => {
    const filterValue = event.target.value.trim().toLowerCase();
    setState('playerFilter', filterValue);
  }, 300);
  
  // Add event listener
  filterInput.addEventListener('input', handleFilterChange);
  
  // Track for cleanup
  activeListeners.push({
    element: filterInput,
    eventType: 'input',
    listener: handleFilterChange
  });
}

/**
 * Set up row selection event listeners
 */
function setupRowSelectionListeners() {
  // Delegate events to the table body since rows may be dynamically created
  const tableBody = document.querySelector('tbody');
  
  if (!tableBody) {
    console.warn('Table body element not found');
    return;
  }
  
  const handleRowClick = (event) => {
    const row = event.target.closest('tr');
    if (!row) return;
    
    const playerId = row.getAttribute('data-player-id');
    if (!playerId) return;
    
    // Find the player data
    const allPlayers = getState('playerData') || [];
    const selectedPlayer = allPlayers.find(player => player.id === playerId);
    
    if (selectedPlayer) {
      setState('selectedPlayer', selectedPlayer);
    }
  };
  
  // Add event listener
  tableBody.addEventListener('click', handleRowClick);
  
  // Track for cleanup
  activeListeners.push({
    element: tableBody,
    eventType: 'click',
    listener: handleRowClick
  });
}

/**
 * Update sort direction indicators in the table headers
 * @param {string} sortColumn - The column to mark as sorted
 * @param {string} direction - The sort direction ('asc' or 'desc')
 */
function updateSortIndicators(sortColumn, direction) {
  const tableHeaders = document.querySelectorAll('th[data-sort]');
  
  tableHeaders.forEach(header => {
    // Remove any existing indicators
    header.classList.remove('sort-asc', 'sort-desc');
    
    // Add indicator to the active sort column
    const headerColumn = header.getAttribute('data-sort');
    if (headerColumn === sortColumn) {
      header.classList.add(`sort-${direction}`);
    }
  });
} 