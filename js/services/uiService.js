/**
 * uiService.js
 * 
 * Service for handling UI operations in the TB Chest Analyzer.
 * Manages UI updates, element creation, and interaction handling.
 */

/**
 * UIService - Handles UI operations
 */
export class UIService {
  /**
   * Initialize the UI service
   * @param {Object} languageService - Language service instance
   * @param {Object} stateManager - State manager instance
   * @param {Object} errorHandler - Error handler instance
   */
  constructor(languageService, stateManager, errorHandler) {
    this._languageService = languageService;
    this._stateManager = stateManager;
    this._errorHandler = errorHandler;
    
    // Cache DOM elements
    this._elements = {
      appContainer: document.getElementById('app-container'),
      loadingSpinner: document.getElementById('loading-spinner'),
      navButtons: document.querySelectorAll('.nav-button'),
      viewContainers: document.querySelectorAll('.view-container'),
      notificationContainer: document.getElementById('notification-container'),
      filterInputs: document.querySelectorAll('.filter-input'),
      searchInput: document.getElementById('player-search')
    };
    
    // Set up UI event handlers
    this._setupEventHandlers();
    
    // Subscribe to state changes
    this._setupStateSubscriptions();
  }
  
  /**
   * Show a specific view
   * @param {string} viewId - ID of the view to show
   */
  showView(viewId) {
    try {
      // Hide all views
      this._elements.viewContainers.forEach(container => {
        container.classList.add('hidden');
      });
      
      // Show selected view
      const selectedView = document.getElementById(`view-${viewId}`);
      if (!selectedView) {
        throw new Error(`View not found: ${viewId}`);
      }
      
      selectedView.classList.remove('hidden');
      
      // Update active nav button
      this._elements.navButtons.forEach(button => {
        const buttonViewId = button.getAttribute('data-view');
        if (buttonViewId === viewId) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
      
      // Update state
      this._stateManager.setState('currentView', viewId);
      
      // Update URL if needed
      this._updateUrl(viewId);
    } catch (error) {
      this._errorHandler.handleError(error, 'view-navigation');
    }
  }
  
  /**
   * Show loading spinner
   * @param {boolean} show - Whether to show or hide the spinner
   */
  showLoading(show = true) {
    if (this._elements.loadingSpinner) {
      if (show) {
        this._elements.loadingSpinner.classList.remove('hidden');
      } else {
        this._elements.loadingSpinner.classList.add('hidden');
      }
    }
    
    this._stateManager.setState('isLoading', show);
  }
  
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
   * @param {number} duration - Duration in milliseconds
   */
  showNotification(message, type = 'info', duration = 5000) {
    try {
      const container = this._elements.notificationContainer;
      if (!container) return;
      
      // Create notification element
      const notificationElement = document.createElement('div');
      notificationElement.className = `notification notification-${type}`;
      
      // Add content
      notificationElement.innerHTML = `
        <div class="notification-content">
          <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close">&times;</button>
      `;
      
      // Add close button functionality
      const closeButton = notificationElement.querySelector('.notification-close');
      closeButton.addEventListener('click', () => {
        notificationElement.classList.add('notification-hiding');
        setTimeout(() => {
          notificationElement.remove();
        }, 300);
      });
      
      // Auto-remove after duration
      setTimeout(() => {
        if (notificationElement.parentNode) {
          notificationElement.classList.add('notification-hiding');
          setTimeout(() => {
            if (notificationElement.parentNode) {
              notificationElement.remove();
            }
          }, 300);
        }
      }, duration);
      
      // Add to container
      container.appendChild(notificationElement);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
  
  /**
   * Show a modal dialog
   * @param {string} title - Modal title
   * @param {string} content - Modal content HTML
   * @param {Array} buttons - Array of button configs {label, action, type}
   */
  showModal(title, content, buttons = []) {
    try {
      // Create modal element
      const modalElement = document.createElement('div');
      modalElement.className = 'modal';
      
      // Create modal content
      modalElement.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
            <h2>${title}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            ${this._createModalButtons(buttons)}
          </div>
        </div>
      `;
      
      // Add close button functionality
      const closeButton = modalElement.querySelector('.modal-close');
      closeButton.addEventListener('click', () => {
        this._closeModal(modalElement);
      });
      
      // Add button event listeners
      buttons.forEach((button, index) => {
        const buttonElement = modalElement.querySelector(`#modal-button-${index}`);
        buttonElement.addEventListener('click', () => {
          if (button.action) {
            button.action();
          }
          if (button.closeModal !== false) {
            this._closeModal(modalElement);
          }
        });
      });
      
      // Add click outside to close
      modalElement.addEventListener('click', (event) => {
        if (event.target === modalElement) {
          this._closeModal(modalElement);
        }
      });
      
      // Add to DOM
      document.body.appendChild(modalElement);
      
      // Update state
      this._stateManager.setState('isModalOpen', true);
      
      // Return the modal element for direct manipulation
      return modalElement;
    } catch (error) {
      this._errorHandler.handleError(error, 'modal-display');
      return null;
    }
  }
  
  /**
   * Create a table from data
   * @param {Array} data - Array of objects
   * @param {Array} columns - Column definitions [{key, label, renderer}]
   * @param {Object} options - Table options
   * @returns {HTMLElement} Table element
   */
  createTable(data, columns, options = {}) {
    try {
      // Create table element
      const tableElement = document.createElement('table');
      tableElement.className = options.className || 'data-table';
      
      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.label || this._languageService.translate(`tables.${column.key}`);
        
        // Add sorting functionality if enabled
        if (options.sortable && column.sortable !== false) {
          th.classList.add('sortable');
          th.addEventListener('click', () => {
            this._handleTableSort(tableElement, column.key);
          });
        }
        
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      tableElement.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      
      // Add data rows
      data.forEach(item => {
        const row = document.createElement('tr');
        
        // Add click handler for row
        if (options.onRowClick) {
          row.classList.add('clickable');
          row.addEventListener('click', () => {
            options.onRowClick(item);
          });
        }
        
        // Add cells
        columns.forEach(column => {
          const cell = document.createElement('td');
          
          // Use renderer if provided
          if (column.renderer) {
            const content = column.renderer(item[column.key], item);
            if (typeof content === 'string') {
              cell.innerHTML = content;
            } else if (content instanceof HTMLElement) {
              cell.appendChild(content);
            }
          } else {
            cell.textContent = item[column.key];
          }
          
          row.appendChild(cell);
        });
        
        tbody.appendChild(row);
      });
      
      tableElement.appendChild(tbody);
      
      // Add no data message if needed
      if (data.length === 0 && options.noDataMessage) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = columns.length;
        noDataCell.className = 'no-data-message';
        noDataCell.textContent = options.noDataMessage;
        noDataRow.appendChild(noDataCell);
        tbody.appendChild(noDataRow);
      }
      
      return tableElement;
    } catch (error) {
      this._errorHandler.handleError(error, 'table-creation');
      
      // Return a simple error message element
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = this._languageService.translate('errors.tableCreation');
      return errorElement;
    }
  }
  
  /**
   * Create action buttons for a table row
   * @param {Array} actions - Action configs [{label, icon, handler, type}]
   * @param {Object} item - Data item
   * @returns {HTMLElement} Action buttons container
   */
  createActionButtons(actions, item) {
    const container = document.createElement('div');
    container.className = 'action-buttons';
    
    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = `action-button ${action.type || 'default'}`;
      button.title = action.label || this._languageService.translate(`actions.${action.action}`);
      
      // Add icon if provided
      if (action.icon) {
        const icon = document.createElement('img');
        icon.src = `icons/${action.icon}.png`;
        icon.alt = button.title;
        icon.className = 'action-icon';
        button.appendChild(icon);
      } else {
        button.textContent = button.title;
      }
      
      // Add click handler
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent row click
        if (action.handler) {
          action.handler(item);
        }
      });
      
      container.appendChild(button);
    });
    
    return container;
  }
  
  /**
   * Update element with translated text
   * @param {HTMLElement} element - Element to update
   * @param {string} key - Translation key
   * @param {Object} params - Translation parameters
   */
  updateElementText(element, key, params = {}) {
    if (!element) return;
    
    const translation = this._languageService.translate(key, params);
    
    // Check if we should update HTML or text content
    if (element.hasAttribute('data-i18n-html')) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
  }
  
  /**
   * Add filtering UI for tables
   * @param {HTMLElement} container - Container for filters
   * @param {Object} options - Filter options
   * @param {Function} onFilter - Filter callback
   * @returns {HTMLElement} Filter container
   */
  createFilterUI(container, options, onFilter) {
    try {
      const filterContainer = document.createElement('div');
      filterContainer.className = 'filter-container';
      
      // Add search input if needed
      if (options.enableSearch) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchLabel = document.createElement('label');
        searchLabel.textContent = this._languageService.translate('filters.search');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'search-input';
        searchInput.placeholder = this._languageService.translate('filters.search');
        
        // Add search functionality
        searchInput.addEventListener('input', () => {
          const value = searchInput.value;
          this._stateManager.setState('filters.playerSearch', value);
          if (onFilter) {
            onFilter();
          }
        });
        
        searchContainer.appendChild(searchLabel);
        searchContainer.appendChild(searchInput);
        filterContainer.appendChild(searchContainer);
      }
      
      // Add dropdowns for server and alliance if needed
      if (options.enableServerFilter) {
        const serverSelect = this._createFilterSelect(
          'server',
          this._languageService.translate('filters.server'),
          options.servers || [],
          (value) => {
            this._stateManager.setState('filters.selectedServer', value);
            if (onFilter) {
              onFilter();
            }
          }
        );
        filterContainer.appendChild(serverSelect);
      }
      
      if (options.enableAllianceFilter) {
        const allianceSelect = this._createFilterSelect(
          'alliance',
          this._languageService.translate('filters.alliance'),
          options.alliances || [],
          (value) => {
            this._stateManager.setState('filters.selectedAlliance', value);
            if (onFilter) {
              onFilter();
            }
          }
        );
        filterContainer.appendChild(allianceSelect);
      }
      
      // Add reset button
      const resetButton = document.createElement('button');
      resetButton.className = 'filter-reset';
      resetButton.textContent = this._languageService.translate('filters.reset');
      resetButton.addEventListener('click', () => {
        // Reset all filters
        this._stateManager.setState('filters', {
          dateRange: null,
          playerSearch: '',
          selectedServer: null,
          selectedAlliance: null
        });
        
        // Reset UI
        const searchInput = filterContainer.querySelector('.search-input');
        if (searchInput) {
          searchInput.value = '';
        }
        
        const selects = filterContainer.querySelectorAll('select');
        selects.forEach(select => {
          select.value = '';
        });
        
        if (onFilter) {
          onFilter();
        }
      });
      
      filterContainer.appendChild(resetButton);
      container.appendChild(filterContainer);
      
      return filterContainer;
    } catch (error) {
      this._errorHandler.handleError(error, 'filter-ui-creation');
      return document.createElement('div');
    }
  }
  
  /**
   * Set up event handlers for UI elements
   * @private
   */
  _setupEventHandlers() {
    // Navigation button clicks
    this._elements.navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const viewId = button.getAttribute('data-view');
        if (viewId) {
          this.showView(viewId);
        }
      });
    });
    
    // Search input
    if (this._elements.searchInput) {
      this._elements.searchInput.addEventListener('input', () => {
        this._stateManager.setState('filters.playerSearch', this._elements.searchInput.value);
      });
    }
    
    // Filter inputs
    this._elements.filterInputs.forEach(input => {
      input.addEventListener('change', () => {
        const filterKey = input.getAttribute('data-filter');
        if (filterKey) {
          const value = input.type === 'checkbox' ? input.checked : input.value;
          this._stateManager.setState(`filters.${filterKey}`, value);
        }
      });
    });
  }
  
  /**
   * Set up subscriptions to state changes
   * @private
   */
  _setupStateSubscriptions() {
    // Loading state
    this._stateManager.subscribe('isLoading', (isLoading) => {
      this.showLoading(isLoading);
    });
    
    // View state
    this._stateManager.subscribe('currentView', (currentView) => {
      this.showView(currentView);
    });
    
    // Language changes
    this._languageService.onLanguageChanged(() => {
      this._updateAllTranslations();
    });
  }
  
  /**
   * Update URL based on view
   * @param {string} viewId - View ID
   * @private
   */
  _updateUrl(viewId) {
    // Update URL without page reload
    history.pushState(
      { view: viewId },
      document.title,
      `#${viewId}`
    );
  }
  
  /**
   * Close a modal dialog
   * @param {HTMLElement} modalElement - Modal element
   * @private
   */
  _closeModal(modalElement) {
    if (!modalElement) return;
    
    // Add closing animation
    modalElement.classList.add('closing');
    
    // Remove after animation
    setTimeout(() => {
      modalElement.remove();
      
      // Update state
      this._stateManager.setState('isModalOpen', false);
      this._stateManager.setState('activeModal', null);
    }, 300);
  }
  
  /**
   * Create buttons for modal dialog
   * @param {Array} buttons - Button configs
   * @returns {string} Button HTML
   * @private
   */
  _createModalButtons(buttons) {
    if (!buttons || buttons.length === 0) {
      return `<button id="modal-button-0" class="modal-button default">
        ${this._languageService.translate('actions.close')}
      </button>`;
    }
    
    return buttons.map((button, index) => {
      const type = button.type || 'default';
      const label = button.label || this._languageService.translate(`actions.${button.action || 'close'}`);
      
      return `<button id="modal-button-${index}" class="modal-button ${type}">
        ${label}
      </button>`;
    }).join('');
  }
  
  /**
   * Create a select dropdown for filters
   * @param {string} key - Filter key
   * @param {string} label - Label text
   * @param {Array} options - Select options
   * @param {Function} onChange - Change handler
   * @returns {HTMLElement} Select container
   * @private
   */
  _createFilterSelect(key, label, options, onChange) {
    const container = document.createElement('div');
    container.className = 'filter-select-container';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    labelElement.setAttribute('for', `select-${key}`);
    
    const select = document.createElement('select');
    select.id = `select-${key}`;
    select.className = 'filter-select';
    select.setAttribute('data-filter', key);
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = this._languageService.translate('filters.all');
    select.appendChild(defaultOption);
    
    // Add options
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      select.appendChild(optionElement);
    });
    
    // Add change handler
    select.addEventListener('change', () => {
      const value = select.value || null; // Empty string becomes null
      if (onChange) {
        onChange(value);
      }
    });
    
    container.appendChild(labelElement);
    container.appendChild(select);
    
    return container;
  }
  
  /**
   * Handle table sorting
   * @param {HTMLElement} table - Table element
   * @param {string} columnKey - Column key to sort by
   * @private
   */
  _handleTableSort(table, columnKey) {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Get current sort direction
    const th = thead.querySelector(`th:nth-child(${Array.from(thead.querySelectorAll('th')).findIndex(h => h.textContent.includes(columnKey)) + 1})`);
    const currentDirection = th.getAttribute('data-sort-direction') || 'none';
    
    // Calculate new direction
    let newDirection = 'asc';
    if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else if (currentDirection === 'desc') {
      newDirection = 'none';
    }
    
    // Clear all sort indicators
    thead.querySelectorAll('th').forEach(h => {
      h.removeAttribute('data-sort-direction');
      h.classList.remove('sorted-asc', 'sorted-desc');
    });
    
    // Sort rows
    if (newDirection !== 'none') {
      // Set new sort indicator
      th.setAttribute('data-sort-direction', newDirection);
      th.classList.add(`sorted-${newDirection}`);
      
      // Sort rows
      rows.sort((a, b) => {
        const aValue = a.cells[Array.from(thead.querySelectorAll('th')).findIndex(h => h.textContent.includes(columnKey))].textContent;
        const bValue = b.cells[Array.from(thead.querySelectorAll('th')).findIndex(h => h.textContent.includes(columnKey))].textContent;
        
        // Try numeric comparison
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Fall back to string comparison
        return newDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      });
    }
    
    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
  }
  
  /**
   * Update all translations in the UI
   * @private
   */
  _updateAllTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      this.updateElementText(element, key);
    });
  }
} 