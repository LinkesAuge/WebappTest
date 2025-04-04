/**
 * Table Renderer Module
 * 
 * Responsible for rendering tables in the application
 */

import * as utils from '../utils.js';
import * as i18n from '../i18n.js';

/**
 * Render a data table with the given data and headers
 * @param {HTMLElement} containerElement - The container to render the table in
 * @param {Array} data - The data to display
 * @param {Array} headers - The column headers
 * @param {Object} sortState - The current sort state
 * @param {Function} sortHandler - Function to handle sort click events
 * @param {Function} rowHandler - Optional function to handle row click events
 * @param {boolean} stickyFirstColumn - Whether to make the first column (PLAYER) sticky (default: false)
 */
export function renderDataTable(containerElement, data, headers, sortState, sortHandler, rowHandler = null, stickyFirstColumn = false) {
  if (!containerElement || !data || !headers || !sortState || !sortHandler) {
    console.error('Missing required parameters for renderDataTable');
    return;
  }

  // Get container ID to assign to tbody for targeting CSS
  const containerId = containerElement.id || '';
  const tbodyId = containerId ? `${containerId}-body` : '';
  
  // Add sticky-table class if using sticky first column
  const tableClass = stickyFirstColumn ? 'min-w-full sticky-table divide-y divide-slate-700/50' : 'min-w-full divide-y divide-slate-700/50';

  // Create table structure
  const tableHtml = `
    <table class="${tableClass}">
      <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
        <tr>${renderTableHeader(headers, sortState, stickyFirstColumn)}</tr>
      </thead>
      <tbody id="${tbodyId}" class="bg-slate-900/20">
        ${renderTableBody(data, headers, rowHandler !== null, stickyFirstColumn)}
      </tbody>
    </table>
  `;

  // Set innerHTML of container
  containerElement.innerHTML = tableHtml;

  // Add event listeners for sorting
  const headerCells = containerElement.querySelectorAll('th[data-column]');
  headerCells.forEach(cell => {
    cell.addEventListener('click', sortHandler);
  });

  // Add event listeners for row clicks if handler provided
  if (rowHandler) {
    const rows = containerElement.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('click', rowHandler);
    });
  }
}

/**
 * Render the table header row
 * @param {Array} headers - The column headers
 * @param {Object} sortState - The current sort state
 * @param {boolean} stickyFirstColumn - Whether to make the first column (PLAYER) sticky
 * @returns {string} The table header HTML
 */
function renderTableHeader(headers, sortState, stickyFirstColumn = false) {
  return headers.map((header, index) => {
    // Consider RANK as a numeric column for alignment
    const isNumeric = header !== 'PLAYER' && header !== 'Typ' && header !== 'Beschreibung';
    const textAlign = isNumeric ? 'text-right' : 'text-left';
    const isSortable = header !== 'Beschreibung';
    const cursor = isSortable ? 'cursor-pointer hover:bg-slate-700 transition-colors duration-150' : '';
    
    // Add specific width for rank column and ensure consistent padding
    const columnWidth = header === 'RANK' ? 'w-16' : '';
    const columnPadding = header === 'RANK' ? 'pr-4 pl-2' : 'px-4'; // Adjust padding for rank column
    
    // Check if this is the player column - be more explicit
    const isPlayerColumn = header === 'PLAYER' || header === utils.CORE_COLUMNS.PLAYER;
    
    // Add sticky class for PLAYER column if enabled - use more forceful CSS
    const stickyClass = (stickyFirstColumn && isPlayerColumn) 
      ? 'sticky-column sticky-header left-0 z-30 bg-slate-800/95' 
      : '';
    
    // Map header to translation key
    let translationKey;
    let displayHeader;
    
    switch(header.toUpperCase()) {
      case 'RANK':
        translationKey = 'table.headerRank';
        break;
      case 'PLAYER':
        translationKey = 'table.headerPlayer';
        break;
      case 'TOTAL_SCORE':
        translationKey = 'table.headerTotalScore';
        break;
      case 'CHEST_COUNT':
        translationKey = 'table.headerChestCount';
        break;
      case 'TYP':
        translationKey = 'scoreSystem.headerTyp';
        break;
      case 'PUNKTE':
        translationKey = 'scoreSystem.headerPunkte';
        break;
      default:
        // Handle source columns with FROM_ prefix
        if (header.startsWith('FROM_')) {
          // Extract the source name without the prefix for display
          const sourceName = header.replace('FROM_', '');
          return `
            <th scope="col" 
                data-column="${header}" 
                class="${columnPadding} py-3 ${textAlign} text-xs font-medium text-primary uppercase tracking-wider ${cursor} ${columnWidth} ${stickyClass}">
              ${sourceName}
              ${isSortable ? `<span class="sort-icon inline-block w-3 ml-1"></span>` : ''}
            </th>
          `;
        }
        // For detailed table headers, use the raw header name instead of translation key
        // This fixes the issue with showing "table.headers.xyz" text
        displayHeader = header;
    }
    
    // Use translation if available, otherwise use display header or original header
    const headerText = displayHeader || i18n.getText(translationKey) || header;
    
    return `
      <th scope="col" 
          data-column="${header}" 
          class="${columnPadding} py-3 ${textAlign} text-xs font-medium text-primary uppercase tracking-wider ${cursor} ${columnWidth} ${stickyClass}">
        ${headerText}
        ${isSortable ? `<span class="sort-icon inline-block w-3 ml-1"></span>` : ''}
      </th>
    `;
  }).join('');
}

/**
 * Render the table body
 * @param {Array} data - The data to display
 * @param {Array} headers - The column headers
 * @param {boolean} clickable - Whether rows should be clickable
 * @param {boolean} stickyFirstColumn - Whether to make the first column (PLAYER) sticky
 * @returns {string} The table body HTML
 */
function renderTableBody(data, headers, clickable, stickyFirstColumn = false) {
  if (!data.length) {
    return `<tr><td colspan="${headers.length}" class="text-center py-6 text-slate-500">${i18n.getText('table.noData')}</td></tr>`;
  }

  return data.map((row, index) => {
    // Add hover effect back to clickable rows
    const hoverEffect = clickable ? 'hover:bg-slate-700/50 cursor-pointer' : '';
    const rowClass = `${hoverEffect} transition-colors duration-150`;
    
    // Apply direct row styling based on index
    const rowStyle = index % 2 === 0 
      ? '' 
      : 'style="background-color: rgba(30, 41, 59, 0.4);"';
    
    return `
      <tr class="${rowClass}" data-index="${index}" ${rowStyle}>
        ${headers.map((header, colIndex) => {
          const value = row[header];
          const isNumeric = header !== 'PLAYER' && header !== 'Typ' && header !== 'Beschreibung';
          const textAlign = isNumeric ? 'text-right' : 'text-left';
          const columnWidth = header === 'RANK' ? 'w-16' : '';
          const columnPadding = header === 'RANK' ? 'pr-4 pl-2' : 'px-4';
          
          // Check if this is the player column - be more explicit to ensure it's correct
          const isPlayerColumn = header === 'PLAYER' || header === utils.CORE_COLUMNS.PLAYER;
          
          // Add sticky class for PLAYER column if enabled - use more forceful CSS classes
          const stickyClass = (stickyFirstColumn && isPlayerColumn) 
            ? 'sticky-column sticky-cell left-0 z-20' 
            : '';
          
          // Add background color to sticky cells based on row index for zebra striping
          let stickyCellBg = '';
          if (stickyFirstColumn && isPlayerColumn) {
            stickyCellBg = index % 2 === 0 
              ? 'bg-slate-900/95' 
              : 'bg-slate-800/95';
          }
          
          // Format the value based on type
          const formattedValue = isNumeric && typeof value === 'number' 
            ? utils.formatNumber(value)
            : value;
          
          // Start with formatted value
          let displayValue = formattedValue;
          
          // Add medal for top three players in the PLAYER column
          if (isPlayerColumn && index < 3) {
            let medalIcon = '';
            if (index === 0) {
              medalIcon = '🥇'; // Gold medal
            } else if (index === 1) {
              medalIcon = '🥈'; // Silver medal
            } else if (index === 2) {
              medalIcon = '🥉'; // Bronze medal
            }
            
            if (medalIcon) {
              displayValue = `<span class="medal-icon">${medalIcon}</span> ${formattedValue}`;
            }
          }
          
          return `<td class="${columnPadding} py-3 whitespace-nowrap ${textAlign} ${columnWidth} ${stickyClass} ${stickyCellBg}">${displayValue}</td>`;
        }).join('')}
      </tr>
    `;
  }).join('');
}
