/**
 * tableRenderer.js
 *
 * Description: Functions for rendering player data tables
 * Usage:
 *     Import directly: import { renderPlayerTable, renderStatsTable } from './ui-updates/tableRenderer.js';
 */

import { getState, subscribe } from '../state.js';
import { showElement, hideElement } from '../dom.js';

/**
 * Main table rendering function that connects to state management
 * Renders and subscribes to state changes for reactive updates
 * @param {string} containerId - ID of the container element to render into
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} The rendered table element
 */
export function renderTable(containerId, options = {}) {
  try {
    // Get data from state
    const displayData = getState('displayData') || [];
    const sortColumn = getState('sortColumn');
    const sortDirection = getState('sortDirection');
    const playerFilter = getState('playerFilter');
    
    console.log(`Rendering table with ${displayData.length} items, sorted by ${sortColumn} ${sortDirection}`);
    
    // Set up the columns based on data
    const columns = [
      { field: 'rank', label: 'Rank', sortable: true },
      { field: 'name', label: 'Player', sortable: true },
      { field: 'team', label: 'Team', sortable: true },
      { field: 'score', label: 'Score', sortable: true }
    ];
    
    // Combine options with state values
    const renderOptions = {
      ...options,
      sortable: true,
      currentSortColumn: sortColumn,
      currentSortDirection: sortDirection,
      searchTerm: playerFilter
    };
    
    // Render the player table
    const table = renderPlayerTable(displayData, containerId, columns, renderOptions);
    
    // Subscribe to state changes to update the table reactively
    subscribe('displayData', (newData) => {
      console.log('Display data changed, re-rendering table');
      renderTable(containerId, options);
    });
    
    subscribe('sortColumn', (newSortColumn) => {
      console.log(`Sort column changed to ${newSortColumn}, re-rendering table`);
      renderTable(containerId, options);
    });
    
    subscribe('sortDirection', (newSortDirection) => {
      console.log(`Sort direction changed to ${newSortDirection}, re-rendering table`);
      renderTable(containerId, options);
    });
    
    subscribe('playerFilter', (newFilter) => {
      console.log(`Player filter changed to ${newFilter}, re-rendering table`);
      renderTable(containerId, options);
    });
    
    return table;
  } catch (error) {
    console.error('Error rendering reactive table:', error);
    hideElement(containerId);
    return null;
  }
}

/**
 * Render a table of player data
 * @param {Array} players - Player data to render
 * @param {string} containerId - ID of the container element
 * @param {Array} columns - Array of column definitions
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} The rendered table element
 */
export function renderPlayerTable(players, containerId, columns, options = {}) {
  if (!Array.isArray(players) || players.length === 0) {
    console.warn('No player data available for table rendering');
    return null;
  }

  try {
    // Get container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Table container element not found: ${containerId}`);
      return null;
    }

    // Clear previous content
    container.innerHTML = '';

    // Default options
    const defaultOptions = {
      tableClass: 'player-table',
      headerClass: 'player-table-header',
      rowClass: 'player-table-row',
      stripedRows: true,
      highlightTop: 3,
      sortable: true,
      pagination: true,
      pageSize: 10,
      currentPage: 1,
      showSearch: true,
      currentSortColumn: null,
      currentSortDirection: 'asc',
      searchTerm: ''
    };

    // Merge provided options with defaults
    const tableOptions = { ...defaultOptions, ...options };
    
    // Default columns if not provided
    const tableColumns = columns || [
      { field: 'rank', label: 'Rank', sortable: true },
      { field: 'fullName', label: 'Player', sortable: true },
      { field: 'team', label: 'Team', sortable: true },
      { field: 'score', label: 'Score', sortable: true }
    ];

    // Apply filtering from state if searchTerm is provided
    let displayPlayers = players;
    if (tableOptions.searchTerm && tableOptions.searchTerm.trim() !== '') {
      displayPlayers = searchPlayers(players, tableOptions.searchTerm);
    }
    
    // Apply sorting from state if currentSortColumn is provided
    if (tableOptions.currentSortColumn) {
      displayPlayers = sortPlayers(
        displayPlayers, 
        tableOptions.currentSortColumn, 
        tableOptions.currentSortDirection || 'asc'
      );
    }

    // Create table element
    const table = document.createElement('table');
    table.className = tableOptions.tableClass;
    table.id = `${containerId}-table`;

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = tableOptions.headerClass;

    // Add header cells
    tableColumns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.label || column.field;
      
      if (column.sortable && tableOptions.sortable) {
        th.className = 'sortable';
        th.dataset.sort = column.field;
        
        // Add sort indicator if this is the currently sorted column
        if (column.field === tableOptions.currentSortColumn) {
          th.classList.add('sorted');
          th.classList.add(tableOptions.currentSortDirection);
        }
      }
      
      if (column.width) {
        th.style.width = column.width;
      }
      
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    
    // Calculate pagination
    const totalPages = tableOptions.pagination ? 
      Math.ceil(displayPlayers.length / tableOptions.pageSize) : 1;
    
    const startIdx = tableOptions.pagination ? 
      (tableOptions.currentPage - 1) * tableOptions.pageSize : 0;
    
    const endIdx = tableOptions.pagination ? 
      Math.min(startIdx + tableOptions.pageSize, displayPlayers.length) : displayPlayers.length;
    
    // Render rows for current page
    for (let i = startIdx; i < endIdx; i++) {
      const player = displayPlayers[i];
      const row = document.createElement('tr');
      
      // Add row classes
      row.className = tableOptions.rowClass;
      
      if (tableOptions.stripedRows && i % 2 === 1) {
        row.classList.add('striped');
      }
      
      if (tableOptions.highlightTop && player.rank && player.rank <= tableOptions.highlightTop) {
        row.classList.add('highlight-top');
        row.classList.add(`rank-${player.rank}`);
      }
      
      // Add player ID for row selection
      if (player.id) {
        row.dataset.playerId = player.id;
      }
      
      // Add row data cells
      tableColumns.forEach(column => {
        const td = document.createElement('td');
        const value = player[column.field];
        
        // Format cell value
        if (column.formatter) {
          td.innerHTML = column.formatter(value, player);
        } else {
          td.textContent = value !== undefined && value !== null ? value : '';
        }
        
        // Add any custom classes
        if (column.cellClass) {
          td.className = column.cellClass;
        }
        
        row.appendChild(td);
      });
      
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    container.appendChild(table);

    // Add pagination controls if enabled
    if (tableOptions.pagination && totalPages > 1) {
      renderPagination(container, tableOptions.currentPage, totalPages, pageNum => {
        tableOptions.currentPage = pageNum;
        renderPlayerTable(displayPlayers, containerId, tableColumns, tableOptions);
      });
    }

    // Add search box if enabled and no external search term is provided
    if (tableOptions.showSearch && !tableOptions.searchTerm) {
      renderSearchBox(container, searchTerm => {
        tableOptions.searchTerm = searchTerm;
        renderPlayerTable(players, containerId, tableColumns, {
          ...tableOptions,
          currentPage: 1 // Reset to first page on search
        });
      });
    }

    // Show the container
    showElement(containerId);
    
    return table;
  } catch (error) {
    console.error('Error rendering player table:', error);
    hideElement(containerId);
    return null;
  }
}

/**
 * Render stats table for teams or categories
 * @param {Object} stats - Statistics object 
 * @param {string} containerId - ID of the container element
 * @param {Array} columns - Array of column definitions
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} The rendered table element
 */
export function renderStatsTable(stats, containerId, columns, options = {}) {
  if (!stats || Object.keys(stats).length === 0) {
    console.warn('No stats data available for table rendering');
    return null;
  }

  try {
    // Convert stats object to array for rendering
    const statsArray = Object.values(stats);
    
    // Use the player table renderer with the stats array
    return renderPlayerTable(statsArray, containerId, columns, options);
  } catch (error) {
    console.error('Error rendering stats table:', error);
    hideElement(containerId);
    return null;
  }
}

/**
 * Sort players by the specified field and direction
 * @param {Array} players - Player data array
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted player array
 * @private
 */
function sortPlayers(players, field, direction = 'asc') {
  if (!field || !players || !Array.isArray(players)) {
    return players;
  }
  
  try {
    return [...players].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      // Handle undefined or null values
      if (valueA === undefined || valueA === null) return direction === 'asc' ? -1 : 1;
      if (valueB === undefined || valueB === null) return direction === 'asc' ? 1 : -1;
      
      // Sort numerically if both values are numbers
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Sort alphabetically (case insensitive)
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  } catch (error) {
    console.error('Error sorting players:', error);
    return players;
  }
}

/**
 * Render pagination controls
 * @param {HTMLElement} container - Container element
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} callback - Function to call when page changes
 * @private
 */
function renderPagination(container, currentPage, totalPages, callback) {
  try {
    // Create pagination container
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    // Add previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '< Prev';
    prevButton.disabled = currentPage <= 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        callback(currentPage - 1);
      }
    });
    paginationDiv.appendChild(prevButton);
    
    // Add page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page button if needed
    if (startPage > 1) {
      const firstPageButton = document.createElement('button');
      firstPageButton.textContent = '1';
      firstPageButton.addEventListener('click', () => callback(1));
      paginationDiv.appendChild(firstPageButton);
      
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'ellipsis';
        paginationDiv.appendChild(ellipsis);
      }
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => callback(i));
      
      if (i === currentPage) {
        pageButton.className = 'active';
      }
      
      paginationDiv.appendChild(pageButton);
    }
    
    // Add last page button if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.className = 'ellipsis';
        paginationDiv.appendChild(ellipsis);
      }
      
      const lastPageButton = document.createElement('button');
      lastPageButton.textContent = totalPages;
      lastPageButton.addEventListener('click', () => callback(totalPages));
      paginationDiv.appendChild(lastPageButton);
    }
    
    // Add next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next >';
    nextButton.disabled = currentPage >= totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        callback(currentPage + 1);
      }
    });
    paginationDiv.appendChild(nextButton);
    
    container.appendChild(paginationDiv);
  } catch (error) {
    console.error('Error rendering pagination:', error);
  }
}

/**
 * Render search box for filtering players
 * @param {HTMLElement} container - Container element
 * @param {Function} callback - Function to call with search term
 * @private
 */
function renderSearchBox(container, callback) {
  try {
    // Create search container
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-box';
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search players...';
    searchInput.className = 'search-input';
    
    // Debounce search to avoid too many re-renders
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        callback(searchInput.value.trim());
      }, 300);
    });
    
    // Create search button
    const searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.className = 'search-button';
    searchButton.addEventListener('click', () => {
      callback(searchInput.value.trim());
    });
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.className = 'clear-button';
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      callback('');
    });
    
    // Add elements to search div
    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(searchButton);
    searchDiv.appendChild(clearButton);
    
    // Insert search box at the top of the container
    container.insertBefore(searchDiv, container.firstChild);
  } catch (error) {
    console.error('Error rendering search box:', error);
  }
}

/**
 * Search players based on a search term
 * @param {Array} players - Player data array
 * @param {string} term - Search term
 * @returns {Array} Filtered player array
 * @private
 */
function searchPlayers(players, term) {
  if (!term || term.trim() === '') {
    return players;
  }
  
  try {
    const searchTerm = term.toLowerCase();
    
    return players.filter(player => {
      // Search across multiple fields
      return Object.entries(player).some(([key, value]) => {
        // Skip non-string/number values
        if (typeof value !== 'string' && typeof value !== 'number') {
          return false;
        }
        
        // Convert to string and check for match
        return String(value).toLowerCase().includes(searchTerm);
      });
    });
  } catch (error) {
    console.error('Error searching players:', error);
    return players;
  }
}

/**
 * Create a formatted table cell
 * @param {string} value - Cell value
 * @param {string} className - CSS class name
 * @returns {string} HTML for the formatted cell
 */
export function formatTableCell(value, className) {
  return `<span class="${className}">${value}</span>`;
}

/**
 * Format numbers with commas and decimal places
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 0) {
  if (value === undefined || value === null || isNaN(value)) {
    return '';
  }
  
  try {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
} 