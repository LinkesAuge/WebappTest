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
 */
export function renderDataTable(containerElement, data, headers, sortState, sortHandler, rowHandler = null) {
  if (!containerElement || !data || !headers || !sortState || !sortHandler) {
    console.error('Missing required parameters for renderDataTable');
    return;
  }

  // Get container ID to assign to tbody for targeting CSS
  const containerId = containerElement.id || '';
  const tbodyId = containerId ? `${containerId}-body` : '';

  // Create table structure
  const tableHtml = `
    <table class="min-w-full divide-y divide-slate-700/50">
      <thead class="bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10">
        <tr>${renderTableHeader(headers, sortState)}</tr>
      </thead>
      <tbody id="${tbodyId}" class="bg-slate-900/20">
        ${renderTableBody(data, headers, rowHandler !== null)}
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
 * @returns {string} The table header HTML
 */
function renderTableHeader(headers, sortState) {
  return headers.map(header => {
    // Consider RANK as a numeric column for alignment
    const isNumeric = header !== 'PLAYER' && header !== 'Typ' && header !== 'Beschreibung';
    const textAlign = isNumeric ? 'text-right' : 'text-left';
    const isSortable = header !== 'Beschreibung';
    const cursor = isSortable ? 'cursor-pointer hover:bg-slate-700 transition-colors duration-150' : '';
    
    // Add specific width for rank column and ensure consistent padding
    const columnWidth = header === 'RANK' ? 'w-16' : '';
    const columnPadding = header === 'RANK' ? 'pr-4 pl-2' : 'px-4'; // Adjust padding for rank column
    
    // Map header to translation key
    let translationKey;
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
        translationKey = `table.headers.${header.toLowerCase()}`;
    }
    
    const translatedHeader = i18n.getText(translationKey) || header;
    
    return `
      <th scope="col" 
          data-column="${header}" 
          class="${columnPadding} py-3 ${textAlign} text-xs font-medium text-primary uppercase tracking-wider ${cursor} ${columnWidth}">
        ${translatedHeader}
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
 * @returns {string} The table body HTML
 */
function renderTableBody(data, headers, clickable) {
  if (!data.length) {
    return `<tr><td colspan="${headers.length}" class="text-center py-6 text-slate-500">No data available</td></tr>`;
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
        ${headers.map(header => {
          const value = row[header];
          const isNumeric = header !== 'PLAYER' && header !== 'Typ' && header !== 'Beschreibung';
          const textAlign = isNumeric ? 'text-right' : 'text-left';
          const columnWidth = header === 'RANK' ? 'w-16' : '';
          const columnPadding = header === 'RANK' ? 'pr-4 pl-2' : 'px-4';
          const formattedValue = isNumeric && typeof value === 'number' 
            ? utils.formatNumber(value)
            : value;
          
          return `<td class="${columnPadding} py-3 whitespace-nowrap ${textAlign} ${columnWidth}">${formattedValue}</td>`;
        }).join('')}
      </tr>
    `;
  }).join('');
}
