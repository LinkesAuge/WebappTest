/**
 * errorHandler.js
 * 
 * Centralized error handling utility for the TB Chest Analyzer.
 * Provides consistent error handling, logging, and user feedback.
 */

/**
 * ErrorHandler - Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Initialize the error handler
   */
  constructor() {
    this._errors = [];
    this._errorListeners = new Set();
  }
  
  /**
   * Handle application errors
   * @param {Error|string} error - Error object or message
   * @param {string} context - Error context (e.g., 'data-processing', 'chart-rendering')
   * @param {boolean} isFatal - Whether the error is fatal to the application
   * @returns {string} Error ID for tracking
   */
  handleError(error, context, isFatal = false) {
    const errorObj = this._normalizeError(error, context, isFatal);
    
    // Add error to the log
    this._errors.push(errorObj);
    
    // Log to console
    console.error(`[${errorObj.context}] ${errorObj.message}`, errorObj.originalError || '');
    
    // Notify listeners
    this._notifyListeners(errorObj);
    
    // Display UI notification if needed
    if (isFatal) {
      this._showFatalErrorUI(errorObj);
    } else {
      this._showErrorNotification(errorObj);
    }
    
    return errorObj.id;
  }
  
  /**
   * Handle asynchronous errors (for use with promises)
   * @param {Function} fn - Async function to execute
   * @param {string} context - Error context
   * @param {boolean} isFatal - Whether any error is fatal
   * @returns {Function} Wrapped function that handles errors
   */
  async handleAsync(fn, context, isFatal = false) {
    try {
      return await fn();
    } catch (error) {
      this.handleError(error, context, isFatal);
      return null;
    }
  }
  
  /**
   * Global error handler for uncaught exceptions
   * @param {string} message - Error message
   * @param {string} source - Error source
   * @param {number} lineno - Line number where error occurred
   * @param {number} colno - Column number where error occurred
   * @param {Error} error - Error object
   */
  handleGlobalError(message, source, lineno, colno, error) {
    const context = 'global';
    const errorObj = {
      id: this._generateErrorId(),
      message: message,
      context: context,
      timestamp: new Date(),
      isFatal: true,
      originalError: error,
      source: source,
      lineNumber: lineno,
      columnNumber: colno,
      stack: error ? error.stack : null
    };
    
    // Add error to the log
    this._errors.push(errorObj);
    
    // Log to console
    console.error(`Global Error: ${message}`, {
      source,
      lineNumber: lineno,
      columnNumber: colno,
      error
    });
    
    // Notify listeners
    this._notifyListeners(errorObj);
    
    // Show fatal error UI
    this._showFatalErrorUI(errorObj);
  }
  
  /**
   * Subscribe to error events
   * @param {Function} callback - Function to call when an error occurs
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this._errorListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this._errorListeners.delete(callback);
    };
  }
  
  /**
   * Get all logged errors
   * @returns {Array} Array of error objects
   */
  getErrors() {
    return [...this._errors];
  }
  
  /**
   * Clear all logged errors
   */
  clearErrors() {
    this._errors = [];
  }
  
  /**
   * Get errors by context
   * @param {string} context - Error context to filter by
   * @returns {Array} Filtered array of errors
   */
  getErrorsByContext(context) {
    return this._errors.filter(err => err.context === context);
  }
  
  /**
   * Normalize error input into a consistent error object
   * @param {Error|string} error - Error object or message
   * @param {string} context - Error context
   * @param {boolean} isFatal - Whether the error is fatal
   * @returns {Object} Normalized error object
   * @private
   */
  _normalizeError(error, context, isFatal) {
    const errorObj = {
      id: this._generateErrorId(),
      message: typeof error === 'string' ? error : error.message,
      context: context,
      timestamp: new Date(),
      isFatal: isFatal,
      originalError: typeof error !== 'string' ? error : null,
      stack: error instanceof Error ? error.stack : null
    };
    
    return errorObj;
  }
  
  /**
   * Generate a unique error ID
   * @returns {string} Unique error ID
   * @private
   */
  _generateErrorId() {
    return `error-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  /**
   * Notify all error listeners
   * @param {Object} errorObj - Normalized error object
   * @private
   */
  _notifyListeners(errorObj) {
    for (const listener of this._errorListeners) {
      try {
        listener(errorObj);
      } catch (error) {
        console.error('Error in error listener:', error);
      }
    }
  }
  
  /**
   * Show fatal error UI
   * @param {Object} errorObj - Normalized error object
   * @private
   */
  _showFatalErrorUI(errorObj) {
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      const errorHTML = `
        <div class="error-container">
          <h2>Application Error</h2>
          <p>Sorry, something went wrong. Please try refreshing the page.</p>
          <div class="error-details">
            <p><strong>Error:</strong> ${errorObj.message}</p>
            <p><strong>Context:</strong> ${errorObj.context}</p>
            <p><strong>Time:</strong> ${errorObj.timestamp.toLocaleTimeString()}</p>
            ${errorObj.source ? `<p><strong>Source:</strong> ${errorObj.source}</p>` : ''}
            ${errorObj.lineNumber ? `<p><strong>Line:</strong> ${errorObj.lineNumber}</p>` : ''}
          </div>
        </div>
      `;
      appContainer.innerHTML = errorHTML;
    }
  }
  
  /**
   * Show non-fatal error notification
   * @param {Object} errorObj - Normalized error object
   * @private
   */
  _showErrorNotification(errorObj) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification error-notification';
    notificationElement.innerHTML = `
      <div class="notification-content">
        <p class="notification-title">Error</p>
        <p class="notification-message">${errorObj.message}</p>
        <p class="notification-context">${errorObj.context}</p>
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notificationElement.parentNode) {
        notificationElement.classList.add('notification-hiding');
        setTimeout(() => {
          if (notificationElement.parentNode) {
            notificationElement.remove();
          }
        }, 300);
      }
    }, 5000);
    
    notificationContainer.appendChild(notificationElement);
  }
} 