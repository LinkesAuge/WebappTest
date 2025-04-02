/**
 * Tests for the DOM module
 */
import { JSDOM } from 'jsdom';

// Initialize JSDOM before importing DOM module
const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <div id="status-area">
    <div id="loading-spinner" class="hidden"></div>
    <span id="status-message"></span>
  </div>
  
  <nav id="breadcrumb-nav">
    <a id="breadcrumb-dashboard-link" href="#">Dashboard</a>
    <span id="breadcrumb-current-page-item" class="hidden">
      <span id="breadcrumb-current-page-name">Current Page</span>
    </span>
  </nav>
  
  <section id="empty-state-section" class="hidden">Empty State</section>
  <section id="dashboard-section" class="hidden">Dashboard</section>
  <section id="detailed-table-section" class="hidden">Detailed Table</section>
  <section id="charts-section" class="hidden">Charts</section>
  <section id="analytics-section" class="hidden">Analytics</section>
  <section id="score-system-section" class="hidden">Score System</section>
  <section id="detail-section" class="hidden">Detail</section>
  
  <div id="stat-total-players"></div>
  <div id="stat-total-score"></div>
  <div id="stat-total-chests"></div>
  <div id="stat-avg-score"></div>
  <div id="stat-avg-chests"></div>
  <div id="last-updated-info"></div>
  
  <header>
    <nav>
      <a class="nav-link" data-view="dashboard" href="#">Dashboard</a>
      <a class="nav-link" data-view="table" href="#">Table</a>
      <a class="nav-link" data-view="charts" href="#">Charts</a>
    </nav>
  </header>
  
  <button id="mobile-menu-button">
    <span id="icon-menu-closed">Open</span>
    <span id="icon-menu-open" class="hidden">Close</span>
  </button>
  <div id="mobile-menu" class="hidden">
    <a class="nav-link" data-view="dashboard" href="#">Dashboard</a>
  </div>
  
  <div id="chart-modal" class="hidden">
    <h2 id="modal-chart-title"></h2>
    <div id="modal-chart-container"></div>
    <button id="modal-close-button">Close</button>
  </div>
</body>
</html>`);

// Set up DOM globals
global.window = dom.window;
global.document = dom.window.document;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;
global.Node = dom.window.Node;
global.NodeList = dom.window.NodeList;

// Mock console
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock the state module
jest.mock('../js/state.js', () => ({
  subscribe: jest.fn((key, callback) => {
    return true;
  })
}));

// Import DOM module after setting up JSDOM
import * as domModule from '../js/dom.js';

describe('DOM Module', () => {
  beforeEach(() => {
    // Reset console mocks
    console.log.mockClear();
    console.error.mockClear();
    console.warn.mockClear();
    
    // Reset DOM elements visibility to default state
    const sections = ['empty-state-section', 'dashboard-section', 'detailed-table-section', 
      'charts-section', 'analytics-section', 'score-system-section', 'detail-section'];
    
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    
    // Safely reset status area classes
    const statusArea = document.getElementById('status-area');
    if (statusArea) {
      statusArea.classList.remove(
        'text-green-500', 'text-red-500', 'text-yellow-500', 'text-blue-500'
      );
    }
    
    // Reset the elements object
    for (const key in domModule.elements) {
      delete domModule.elements[key];
    }
    
    // Re-create the DOM if it was modified in previous tests
    if (!document.getElementById('status-area')) {
      document.body.innerHTML = `
        <div id="status-area">
          <div id="loading-spinner" class="hidden"></div>
          <span id="status-message"></span>
        </div>
        
        <nav id="breadcrumb-nav">
          <a id="breadcrumb-dashboard-link" href="#">Dashboard</a>
          <span id="breadcrumb-current-page-item" class="hidden">
            <span id="breadcrumb-current-page-name">Current Page</span>
          </span>
        </nav>
        
        <section id="empty-state-section" class="hidden">Empty State</section>
        <section id="dashboard-section" class="hidden">Dashboard</section>
        <section id="detailed-table-section" class="hidden">Detailed Table</section>
        <section id="charts-section" class="hidden">Charts</section>
        <section id="analytics-section" class="hidden">Analytics</section>
        <section id="score-system-section" class="hidden">Score System</section>
        <section id="detail-section" class="hidden">Detail</section>
        
        <div id="stat-total-players"></div>
        <div id="stat-total-score"></div>
        <div id="stat-total-chests"></div>
        <div id="stat-avg-score"></div>
        <div id="stat-avg-chests"></div>
        <div id="last-updated-info"></div>
        
        <header>
          <nav>
            <a class="nav-link" data-view="dashboard" href="#">Dashboard</a>
            <a class="nav-link" data-view="table" href="#">Table</a>
            <a class="nav-link" data-view="charts" href="#">Charts</a>
          </nav>
        </header>
        
        <button id="mobile-menu-button">
          <span id="icon-menu-closed">Open</span>
          <span id="icon-menu-open" class="hidden">Close</span>
        </button>
        <div id="mobile-menu" class="hidden">
          <a class="nav-link" data-view="dashboard" href="#">Dashboard</a>
        </div>
        
        <div id="chart-modal" class="hidden">
          <h2 id="modal-chart-title"></h2>
          <div id="modal-chart-container"></div>
          <button id="modal-close-button">Close</button>
        </div>
      `;
    }
  });
  
  describe('assignElementReferences', () => {
    it('should assign references to DOM elements', () => {
      const result = domModule.assignElementReferences();
      
      expect(result).toBe(true);
      expect(domModule.elements.statusArea).toBe(document.getElementById('status-area'));
      expect(domModule.elements.loadingSpinner).toBe(document.getElementById('loading-spinner'));
      expect(domModule.elements.dashboardSection).toBe(document.getElementById('dashboard-section'));
      expect(console.log).toHaveBeenCalledWith("Assigning DOM Element References...");
      expect(console.log).toHaveBeenCalledWith("DOM Element References assigned successfully");
    });
    
    it('should handle errors when elements are missing', () => {
      // Temporarily remove an important element
      const statusArea = document.getElementById('status-area');
      const parent = statusArea.parentNode;
      parent.removeChild(statusArea);
      
      const result = domModule.assignElementReferences();
      
      expect(result).toBe(true); // Function should return true despite missing elements
      expect(domModule.elements.statusArea).toBeNull(); // Now it should be null instead of undefined
      expect(console.warn).toHaveBeenCalledWith('Element with ID "status-area" not found'); // Warning should be logged
      
      // Try to access the missing element through a function that uses it
      console.warn.mockClear(); // Clear previous warnings
      const showResult = domModule.showStatusMessage('Test');
      expect(showResult).toBe(false);
      
      // Check for any status-related warning
      const warnCalls = console.warn.mock.calls;
      const anyStatusWarning = warnCalls.some(call => 
        call[0] && typeof call[0] === 'string' && (
          call[0].toLowerCase().includes('status') || 
          call[0].toLowerCase().includes('element not found')
        )
      );
      expect(anyStatusWarning).toBe(true);
      
      // Restore the element for other tests
      parent.appendChild(statusArea);
    });
    
    it('should handle missing non-critical elements gracefully', () => {
      // The test DOM is missing many of the elements referenced in the module
      const result = domModule.assignElementReferences();
      
      // Function should complete successfully even with missing elements
      expect(result).toBe(true);
      
      // Critical elements should be found
      expect(domModule.elements.statusArea).not.toBeNull();
      expect(domModule.elements.dashboardSection).not.toBeNull();
      
      // Non-critical missing elements should be null and have warnings logged
      expect(domModule.elements.topSourcesChartContainer).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/Element with ID ".*" not found/));
    });
  });
  
  describe('showElement and hideElement', () => {
    beforeEach(() => {
      domModule.assignElementReferences();
    });
    
    it('should show an element by removing the hidden class', () => {
      const element = document.getElementById('dashboard-section');
      element.classList.add('hidden');
      
      const result = domModule.showElement(element);
      
      expect(result).toBe(true);
      expect(element.classList.contains('hidden')).toBe(false);
    });
    
    it('should show an element by ID', () => {
      const elementId = 'charts-section';
      const element = document.getElementById(elementId);
      element.classList.add('hidden');
      
      const result = domModule.showElement(elementId);
      
      expect(result).toBe(true);
      expect(element.classList.contains('hidden')).toBe(false);
    });
    
    it('should hide an element by adding the hidden class', () => {
      const element = document.getElementById('dashboard-section');
      element.classList.remove('hidden');
      
      const result = domModule.hideElement(element);
      
      expect(result).toBe(true);
      expect(element.classList.contains('hidden')).toBe(true);
    });
    
    it('should hide an element by ID', () => {
      const elementId = 'charts-section';
      const element = document.getElementById(elementId);
      element.classList.remove('hidden');
      
      const result = domModule.hideElement(elementId);
      
      expect(result).toBe(true);
      expect(element.classList.contains('hidden')).toBe(true);
    });
    
    it('should handle non-existent elements gracefully', () => {
      const result = domModule.showElement('non-existent-id');
      
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalled();
    });
  });
  
  describe('showStatusMessage', () => {
    beforeEach(() => {
      domModule.assignElementReferences();
    });
    
    it('should set the message text and show status area', () => {
      const message = 'Test status message';
      const statusArea = document.getElementById('status-area');
      const statusMessage = document.getElementById('status-message');
      statusArea.classList.add('hidden');
      
      const result = domModule.showStatusMessage(message);
      
      expect(result).toBe(true);
      expect(statusMessage.textContent).toBe(message);
      expect(statusArea.classList.contains('hidden')).toBe(false);
      expect(statusArea.classList.contains('text-blue-500')).toBe(true);
    });
    
    it('should apply different color classes based on message type', () => {
      const statusArea = document.getElementById('status-area');
      
      // Test success type
      domModule.showStatusMessage('Success message', 'success');
      expect(statusArea.classList.contains('text-green-500')).toBe(true);
      
      // Test error type
      domModule.showStatusMessage('Error message', 'error');
      expect(statusArea.classList.contains('text-green-500')).toBe(false);
      expect(statusArea.classList.contains('text-red-500')).toBe(true);
      
      // Test warning type
      domModule.showStatusMessage('Warning message', 'warning');
      expect(statusArea.classList.contains('text-red-500')).toBe(false);
      expect(statusArea.classList.contains('text-yellow-500')).toBe(true);
    });
  });
  
  describe('showLoading and hideLoading', () => {
    beforeEach(() => {
      domModule.assignElementReferences();
    });
    
    it('should show the loading spinner and status area', () => {
      const spinner = document.getElementById('loading-spinner');
      const statusArea = document.getElementById('status-area');
      spinner.classList.add('hidden');
      statusArea.classList.add('hidden');
      
      const result = domModule.showLoading();
      
      expect(result).toBe(true);
      expect(spinner.classList.contains('hidden')).toBe(false);
      expect(statusArea.classList.contains('hidden')).toBe(false);
    });
    
    it('should set status message when provided', () => {
      const message = 'Loading data...';
      const statusMessage = document.getElementById('status-message');
      
      domModule.showLoading(message);
      
      expect(statusMessage.textContent).toBe(message);
    });
    
    it('should handle missing elements gracefully', () => {
      // Temporarily remove the loading spinner
      const spinner = document.getElementById('loading-spinner');
      const parent = spinner.parentNode;
      parent.removeChild(spinner);
      
      // Re-assign element references
      domModule.assignElementReferences();
      
      // Function should still work but return false since spinner is missing
      const result = domModule.showLoading('Loading test');
      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalled();
      
      // Restore for other tests
      parent.appendChild(spinner);
    });
  });
  
  describe('switchView', () => {
    beforeEach(() => {
      domModule.assignElementReferences();
      
      // Hide all sections
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.classList.add('hidden');
      });
      
      // Reset active class on nav links
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
      });
    });
    
    it('should show the target view and hide others', () => {
      const dashboardSection = document.getElementById('dashboard-section');
      const chartsSection = document.getElementById('charts-section');
      const tableSection = document.getElementById('detailed-table-section');
      
      // Switch to dashboard view
      const result = domModule.switchView('dashboard');
      
      expect(result).toBe(true);
      expect(dashboardSection.classList.contains('hidden')).toBe(false);
      expect(chartsSection.classList.contains('hidden')).toBe(true);
      expect(tableSection.classList.contains('hidden')).toBe(true);
    });
    
    it('should update the active class on navigation links', () => {
      const dashboardLink = document.querySelector('[data-view="dashboard"]');
      const tableLink = document.querySelector('[data-view="table"]');
      
      domModule.switchView('table');
      
      expect(dashboardLink.classList.contains('active')).toBe(false);
      expect(tableLink.classList.contains('active')).toBe(true);
    });
    
    it('should update the breadcrumb text', () => {
      const breadcrumbName = document.getElementById('breadcrumb-current-page-name');
      const breadcrumbItem = document.getElementById('breadcrumb-current-page-item');
      
      // Test with a non-dashboard view
      domModule.switchView('charts');
      
      expect(breadcrumbName.textContent).toBe('Charts');
      expect(breadcrumbItem.classList.contains('hidden')).toBe(false);
      
      // Test with dashboard view (should hide breadcrumb current item)
      domModule.switchView('dashboard');
      
      expect(breadcrumbItem.classList.contains('hidden')).toBe(true);
    });
    
    it('should handle unknown view IDs gracefully', () => {
      const result = domModule.switchView('unknown-view');
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('refreshDomReferences', () => {
    it('should call assignElementReferences', () => {
      // Need to test that refreshDomReferences calls assignElementReferences
      
      // Since both functions are exported from the same module and refreshDomReferences
      // directly calls assignElementReferences, we should test the behavior instead
      
      // Clear console mocks
      console.log.mockClear();
      
      // Call the function
      const result = domModule.refreshDomReferences();
      
      // Verify it logged the refresh message
      expect(console.log).toHaveBeenCalledWith("Refreshing DOM element references...");
      
      // Verify it also called assignElementReferences by checking that its logs were made
      expect(console.log).toHaveBeenCalledWith("Assigning DOM Element References...");
      expect(console.log).toHaveBeenCalledWith("DOM Element References assigned successfully");
      
      // Verify the return result is what we expect from assignElementReferences
      expect(result).toBe(true);
    });
  });
}); 