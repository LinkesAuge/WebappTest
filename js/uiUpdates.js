/**
 * uiUpdates.js
 * Contains functions for updating the UI with data
 */

import { elements, clearElement, createElement } from './dom.js';
import { displayData, sortState } from './state.js';
import { getText } from './i18n.js';
import { formatNumber } from './utils.js';
import { calculateOverallStats, getTopPlayers } from './dataProcessing.js';
import { renderDashboardCharts } from './charts.js';

/**
 * Updates the dashboard statistics with aggregated data
 */
export function updateDashboardStatistics() {
  try {
    if (!displayData || displayData.length === 0) {
      console.warn('No display data to update dashboard statistics');
      return;
    }
    
    console.log('Updating dashboard statistics...');
    
    // Calculate overall stats
    const stats = calculateOverallStats();
    
    // Update stat elements if they exist
    if (elements.statTotalPlayers) {
      elements.statTotalPlayers.textContent = formatNumber(stats.playerCount);
    }
    
    if (elements.statTotalScore) {
      elements.statTotalScore.textContent = formatNumber(stats.totalScore);
    }
    
    if (elements.statTotalChests) {
      elements.statTotalChests.textContent = formatNumber(stats.totalChests);
    }
    
    if (elements.statAvgScore) {
      elements.statAvgScore.textContent = formatNumber(stats.averageScore);
    }
    
    if (elements.statAvgChests) {
      elements.statAvgChests.textContent = formatNumber(stats.averageChests);
    }
    
    // Update top chests display if it exists
    if (elements.topChestsContainer) {
      updateTopChestsDisplay();
    }
    
    console.log('Dashboard statistics updated successfully');
  } catch (error) {
    console.error('Error updating dashboard statistics:', error);
  }
}

/**
 * Updates the top chests display with top 5 players by chest count
 */
function updateTopChestsDisplay() {
  try {
    if (!elements.topChestsContainer) {
      return;
    }
    
    // Clear previous content
    clearElement(elements.topChestsContainer);
    
    // Get top 5 players by chest count
    const topChestPlayers = getTopPlayers('CHEST_COUNT', 5);
    
    if (!topChestPlayers || topChestPlayers.length === 0) {
      // Show no data message
      elements.topChestsContainer.innerHTML = 
        `<p class="no-data">${getText('table.noData')}</p>`;
      return;
    }
    
    // Create table for top players
    const table = createElement('table', { class: 'top-players-table' });
    
    // Create table header
    const thead = createElement('thead');
    const headerRow = createElement('tr');
    
    // Add header cells
    ['#', getText('table.headerPlayer'), getText('table.headerChests')].forEach(text => {
      const th = createElement('th', null, null, text);
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = createElement('tbody');
    
    // Add rows for each player
    topChestPlayers.forEach((player, index) => {
      const row = createElement('tr');
      
      // Rank column
      const rankCell = createElement('td', null, null, (index + 1).toString());
      row.appendChild(rankCell);
      
      // Player name column
      const nameCell = createElement('td', null, null, player.PLAYER);
      row.appendChild(nameCell);
      
      // Chest count column
      const chestCell = createElement('td', null, null, formatNumber(player.CHEST_COUNT));
      row.appendChild(chestCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    elements.topChestsContainer.appendChild(table);
  } catch (error) {
    console.error('Error updating top chests display:', error);
  }
}

/**
 * Updates the ranking table with current display data
 */
export function updateRankingTable() {
  try {
    if (!elements.rankingTable) {
      console.warn('Ranking table element not found');
      return;
    }
    
    if (!displayData || displayData.length === 0) {
      console.warn('No display data to update ranking table');
      
      // Show no data message in the table
      const tbody = elements.rankingTable.querySelector('tbody');
      if (tbody) {
        clearElement(tbody);
        
        const row = createElement('tr');
        const cell = createElement('td', { 
          colspan: '4',
          class: 'no-data-cell'
        }, null, getText('table.noData'));
        
        row.appendChild(cell);
        tbody.appendChild(row);
      }
      
      return;
    }
    
    console.log('Updating ranking table...');
    
    // Get the table body
    const tbody = elements.rankingTable.querySelector('tbody');
    if (!tbody) {
      console.warn('Ranking table body not found');
      return;
    }
    
    // Clear previous content
    clearElement(tbody);
    
    // Sort the data if sort state is set
    let sortedData = [...displayData];
    if (sortState.column && sortState.direction) {
      sortedData = sortedData.sort((a, b) => {
        const aValue = a[sortState.column] || 0;
        const bValue = b[sortState.column] || 0;
        
        if (sortState.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    // Add rows for each player
    sortedData.forEach(player => {
      const row = createElement('tr');
      
      // Rank column
      const rankCell = createElement('td', null, null, player.rank.toString());
      row.appendChild(rankCell);
      
      // Player name column
      const nameCell = createElement('td', null, ['player-name'], player.PLAYER);
      row.appendChild(nameCell);
      
      // Total score column
      const scoreCell = createElement('td', null, null, formatNumber(player.TOTAL_SCORE));
      row.appendChild(scoreCell);
      
      // Chest count column
      const chestCell = createElement('td', null, null, formatNumber(player.CHEST_COUNT));
      row.appendChild(chestCell);
      
      tbody.appendChild(row);
    });
    
    // Update sort indicators in the table header
    updateSortIndicators();
    
    console.log('Ranking table updated successfully');
  } catch (error) {
    console.error('Error updating ranking table:', error);
  }
}

/**
 * Updates sort indicators in the table headers
 */
function updateSortIndicators() {
  try {
    if (!elements.rankingTable) {
      return;
    }
    
    // Get all sortable headers
    const sortableHeaders = elements.rankingTable.querySelectorAll('th.sortable');
    if (!sortableHeaders) {
      return;
    }
    
    // Remove all sort indicators
    sortableHeaders.forEach(header => {
      header.classList.remove('sort-asc', 'sort-desc');
    });
    
    // If sort state is set, add appropriate indicator
    if (sortState.column && sortState.direction) {
      const currentSortHeader = Array.from(sortableHeaders).find(
        header => header.getAttribute('data-sort') === sortState.column
      );
      
      if (currentSortHeader) {
        currentSortHeader.classList.add(`sort-${sortState.direction}`);
      }
    }
  } catch (error) {
    console.error('Error updating sort indicators:', error);
  }
}

/**
 * Filters the ranking table based on search text
 * @param {string} filterText - The text to filter by
 */
export function filterTable(filterText) {
  try {
    if (!elements.rankingTable) {
      return;
    }
    
    // Get all rows in the table body
    const rows = elements.rankingTable.querySelectorAll('tbody tr');
    if (!rows) {
      return;
    }
    
    if (!filterText) {
      // If no filter text, show all rows
      rows.forEach(row => {
        row.classList.remove('hidden');
      });
      return;
    }
    
    // Filter the rows
    rows.forEach(row => {
      const playerNameCell = row.querySelector('.player-name');
      if (!playerNameCell) {
        row.classList.add('hidden');
        return;
      }
      
      const playerName = playerNameCell.textContent.toLowerCase();
      if (playerName.includes(filterText.toLowerCase())) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  } catch (error) {
    console.error('Error filtering table:', error);
  }
}

/**
 * Updates the detailed data table in the data view
 */
export function updateDetailedDataTable() {
  try {
    if (!elements.dataTable) {
      console.warn('Data table element not found');
      return;
    }
    
    if (!displayData || displayData.length === 0) {
      console.warn('No display data to update detailed table');
      
      // Show no data message in the table
      const tbody = elements.dataTable.querySelector('tbody');
      if (tbody) {
        clearElement(tbody);
        
        const row = createElement('tr');
        const cell = createElement('td', { 
          colspan: '20',
          class: 'no-data-cell'
        }, null, getText('table.noData'));
        
        row.appendChild(cell);
        tbody.appendChild(row);
      }
      
      return;
    }
    
    console.log('Updating detailed data table...');
    
    // Get the table body
    const tbody = elements.dataTable.querySelector('tbody');
    if (!tbody) {
      console.warn('Data table body not found');
      return;
    }
    
    // Clear previous content
    clearElement(tbody);
    
    // Get all column headers to determine which columns to show
    const headerCells = elements.dataTable.querySelectorAll('thead th');
    const columnHeaders = Array.from(headerCells).map(cell => 
      cell.getAttribute('data-column')
    ).filter(Boolean);
    
    // Add rows for each player
    displayData.forEach(player => {
      const row = createElement('tr');
      
      // Add cells for each column
      columnHeaders.forEach(column => {
        const cell = createElement('td');
        
        // Format the cell content based on column type
        if (typeof player[column] === 'number') {
          cell.textContent = formatNumber(player[column]);
        } else {
          cell.textContent = player[column] || '';
        }
        
        row.appendChild(cell);
      });
      
      tbody.appendChild(row);
    });
    
    console.log('Detailed data table updated successfully');
  } catch (error) {
    console.error('Error updating detailed data table:', error);
  }
}

/**
 * Updates the score system table in the score system view
 */
export function updateScoreSystemTable() {
  try {
    if (!elements.scoreSystemTable) {
      console.warn('Score system table element not found');
      return;
    }
    
    if (!scoreRules || scoreRules.length === 0) {
      console.warn('No score rules to update score system table');
      
      // Show no data message in the table
      const tbody = elements.scoreSystemTable.querySelector('tbody');
      if (tbody) {
        clearElement(tbody);
        
        const row = createElement('tr');
        const cell = createElement('td', { 
          colspan: '3',
          class: 'no-data-cell'
        }, null, getText('table.noData'));
        
        row.appendChild(cell);
        tbody.appendChild(row);
      }
      
      return;
    }
    
    console.log('Updating score system table...');
    
    // Get the table body
    const tbody = elements.scoreSystemTable.querySelector('tbody');
    if (!tbody) {
      console.warn('Score system table body not found');
      return;
    }
    
    // Clear previous content
    clearElement(tbody);
    
    // Add rows for each rule
    scoreRules.forEach(rule => {
      const row = createElement('tr');
      
      // Type column
      const typeCell = createElement('td', null, null, rule.Typ);
      row.appendChild(typeCell);
      
      // Level column
      const levelCell = createElement('td', null, null, rule.Stufe.toString());
      row.appendChild(levelCell);
      
      // Points column
      const pointsCell = createElement('td', null, null, formatNumber(rule.Punkte));
      row.appendChild(pointsCell);
      
      tbody.appendChild(row);
    });
    
    console.log('Score system table updated successfully');
  } catch (error) {
    console.error('Error updating score system table:', error);
  }
}

// Export default object with all UI update functions
export default {
  updateDashboardStatistics,
  updateRankingTable,
  filterTable,
  updateDetailedDataTable,
  updateScoreSystemTable,
  renderDashboardCharts
}; 