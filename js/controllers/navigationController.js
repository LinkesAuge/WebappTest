/**
 * navigationController.js
 * 
 * Controller for handling navigation in the TB Chest Analyzer.
 * Manages view switching, navigation state, and related UI.
 */

/**
 * NavigationController - Handles application navigation
 */
export class NavigationController {
  /**
   * Initialize the navigation controller
   * @param {Object} uiService - UI service instance
   * @param {Object} stateManager - State manager instance
   */
  constructor(uiService, stateManager) {
    this._uiService = uiService;
    this._stateManager = stateManager;
    
    // Navigation history
    this._navigationHistory = [];
    this._currentHistoryIndex = -1;
  }
  
  /**
   * Initialize the navigation controller
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing navigation controller...');
      
      // Set up navigation elements
      this._setupNavigation();
      
      // Subscribe to view changes
      this._stateManager.subscribe('currentView', (viewId) => {
        this._handleViewChange(viewId);
      });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize navigation controller:', error);
      return false;
    }
  }
  
  /**
   * Navigate to a specific view
   * @param {string} viewId - ID of the view to navigate to
   * @param {boolean} addToHistory - Whether to add this navigation to history
   */
  navigateTo(viewId, addToHistory = true) {
    try {
      // Validate the view ID
      const validViews = ['overview', 'players', 'analytics', 'charts', 'score', 'settings'];
      if (!validViews.includes(viewId)) {
        throw new Error(`Invalid view ID: ${viewId}`);
      }
      
      // Update the view
      this._uiService.showView(viewId);
      
      // Add to navigation history if specified
      if (addToHistory) {
        this._addToHistory(viewId);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
  
  /**
   * Navigate back in history
   * @returns {boolean} Success status
   */
  navigateBack() {
    if (this._currentHistoryIndex <= 0) {
      return false;
    }
    
    this._currentHistoryIndex--;
    const previousView = this._navigationHistory[this._currentHistoryIndex];
    this.navigateTo(previousView, false);
    
    return true;
  }
  
  /**
   * Navigate forward in history
   * @returns {boolean} Success status
   */
  navigateForward() {
    if (this._currentHistoryIndex >= this._navigationHistory.length - 1) {
      return false;
    }
    
    this._currentHistoryIndex++;
    const nextView = this._navigationHistory[this._currentHistoryIndex];
    this.navigateTo(nextView, false);
    
    return true;
  }
  
  /**
   * Check if back navigation is available
   * @returns {boolean} Whether back navigation is available
   */
  canNavigateBack() {
    return this._currentHistoryIndex > 0;
  }
  
  /**
   * Check if forward navigation is available
   * @returns {boolean} Whether forward navigation is available
   */
  canNavigateForward() {
    return this._currentHistoryIndex < this._navigationHistory.length - 1;
  }
  
  /**
   * Set up navigation elements
   * @private
   */
  _setupNavigation() {
    // Find navigation elements
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Add click handlers
    navButtons.forEach(button => {
      const viewId = button.getAttribute('data-view');
      if (viewId) {
        // Note: we don't add click handlers here as they are handled by the UIService
        // This ensures we don't have duplicate handlers
      }
    });
    
    // Add back/forward button handlers if they exist
    const backButton = document.getElementById('nav-back');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.navigateBack();
      });
    }
    
    const forwardButton = document.getElementById('nav-forward');
    if (forwardButton) {
      forwardButton.addEventListener('click', () => {
        this.navigateForward();
      });
    }
  }
  
  /**
   * Add a view to navigation history
   * @param {string} viewId - View ID to add
   * @private
   */
  _addToHistory(viewId) {
    // If we're not at the end of the history, truncate the forward history
    if (this._currentHistoryIndex < this._navigationHistory.length - 1) {
      this._navigationHistory = this._navigationHistory.slice(0, this._currentHistoryIndex + 1);
    }
    
    // Add the new view to history
    this._navigationHistory.push(viewId);
    this._currentHistoryIndex = this._navigationHistory.length - 1;
    
    // Update UI
    this._updateNavigationButtons();
  }
  
  /**
   * Handle view change events
   * @param {string} viewId - ID of the new view
   * @private
   */
  _handleViewChange(viewId) {
    // Update navigation UI
    this._updateActiveNavButton(viewId);
    
    // Update page title
    document.title = `TB Chest Analyzer - ${this._getViewTitle(viewId)}`;
  }
  
  /**
   * Update the active navigation button
   * @param {string} viewId - Active view ID
   * @private
   */
  _updateActiveNavButton(viewId) {
    // Find all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Update active state
    navButtons.forEach(button => {
      const buttonViewId = button.getAttribute('data-view');
      if (buttonViewId === viewId) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'page');
      } else {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
      }
    });
  }
  
  /**
   * Update navigation back/forward buttons
   * @private
   */
  _updateNavigationButtons() {
    const backButton = document.getElementById('nav-back');
    const forwardButton = document.getElementById('nav-forward');
    
    if (backButton) {
      backButton.disabled = !this.canNavigateBack();
    }
    
    if (forwardButton) {
      forwardButton.disabled = !this.canNavigateForward();
    }
  }
  
  /**
   * Get the title for a view
   * @param {string} viewId - View ID
   * @returns {string} View title
   * @private
   */
  _getViewTitle(viewId) {
    const titles = {
      'overview': 'Overview',
      'players': 'Players',
      'analytics': 'Analytics',
      'charts': 'Charts',
      'score': 'Score System',
      'settings': 'Settings'
    };
    
    return titles[viewId] || 'Unknown';
  }
} 