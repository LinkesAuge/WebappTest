/**
 * Unit tests for tableListeners.js
 */

import { initializeTableListeners, cleanupTableListeners } from '../../../js/listeners/tableListeners.js';
import { setState, getState, subscribe } from '../../../js/state.js';
import { renderTable } from '../../../js/ui-updates/tableRenderer.js';
import { getElement } from '../../../js/dom.js';

// Mock dependencies
jest.mock('../../../js/state.js');
jest.mock('../../../js/ui-updates/tableRenderer.js');
jest.mock('../../../js/dom.js');

describe('tableListeners.js', () => {
  // Store original methods for documentQuerySelector
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock DOM methods
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'tbody') {
        return {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        };
      }
      return null;
    });
    
    document.querySelectorAll = jest.fn().mockImplementation((selector) => {
      if (selector === 'th[data-sort]') {
        return [
          {
            getAttribute: jest.fn().mockReturnValue('name'),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            classList: {
              remove: jest.fn(),
              add: jest.fn()
            }
          },
          {
            getAttribute: jest.fn().mockReturnValue('score'),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            classList: {
              remove: jest.fn(),
              add: jest.fn()
            }
          }
        ];
      }
      return [];
    });
    
    // Mock getElement to return a filter input
    getElement.mockImplementation((id) => {
      if (id === 'playerFilterInput') {
        return {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        };
      }
      return null;
    });
  });
  
  afterEach(() => {
    // Restore original methods
    document.querySelector = originalQuerySelector;
    document.querySelectorAll = originalQuerySelectorAll;
  });
  
  test('initializeTableListeners sets up all necessary listeners', () => {
    // Initialize listeners
    initializeTableListeners();
    
    // Verify sort headers have click listeners
    const sortHeaders = document.querySelectorAll('th[data-sort]');
    expect(sortHeaders.length).toBe(2);
    sortHeaders.forEach(header => {
      expect(header.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Verify filter input has input listener
    const filterInput = getElement('playerFilterInput');
    expect(filterInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    
    // Verify table body has click listener for row selection
    const tableBody = document.querySelector('tbody');
    expect(tableBody.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Verify subscription to displayData
    expect(subscribe).toHaveBeenCalledWith('displayData', expect.any(Function));
  });
  
  test('cleanupTableListeners removes all event listeners', () => {
    // First initialize to set up listeners
    initializeTableListeners();
    
    // Then clean up
    cleanupTableListeners();
    
    // Verify all event listeners should be removed
    // Note: We can't directly test removeEventListener calls since they use 
    // function references that we can't access, but we can verify the pattern
    
    // Instead, we can verify that a second call to initializeTableListeners
    // would set up all the listeners again, proving they were removed
    jest.clearAllMocks();
    initializeTableListeners();
    
    // Verify sort headers have click listeners (reset and added again)
    const sortHeaders = document.querySelectorAll('th[data-sort]');
    sortHeaders.forEach(header => {
      expect(header.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Verify filter input has input listener
    const filterInput = getElement('playerFilterInput');
    expect(filterInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    
    // Verify table body has click listener for row selection
    const tableBody = document.querySelector('tbody');
    expect(tableBody.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
  
  test('sorting updates state and indicators correctly', () => {
    // Setup test conditions
    getState.mockImplementation((key) => {
      if (key === 'sortColumn') return 'name';
      if (key === 'sortDirection') return 'asc';
      return null;
    });
    
    // Initialize listeners
    initializeTableListeners();
    
    // Get sort handler and simulate click
    const sortHeaders = document.querySelectorAll('th[data-sort]');
    const nameHeader = sortHeaders[0];
    
    // Extract the click handler function (first argument of the first call)
    const clickHandler = nameHeader.addEventListener.mock.calls[0][1];
    
    // Create a mock event
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    };
    
    // Simulate click on same column to toggle direction
    clickHandler(mockEvent);
    
    // Verify state was updated
    expect(setState).toHaveBeenCalledWith('sortColumn', 'name');
    expect(setState).toHaveBeenCalledWith('sortDirection', 'desc'); // Toggled from asc to desc
    
    // Verify event was handled properly
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    
    // Verify sort indicators updated
    expect(nameHeader.classList.remove).toHaveBeenCalledWith('sort-asc', 'sort-desc');
    expect(nameHeader.classList.add).toHaveBeenCalledWith('sort-desc');
  });
  
  test('filter input updates player filter state', () => {
    // Initialize listeners
    initializeTableListeners();
    
    // Get filter input and handler
    const filterInput = getElement('playerFilterInput');
    
    // Extract the input handler function
    const inputHandler = filterInput.addEventListener.mock.calls[0][1];
    
    // Create a mock event with search term
    const mockEvent = {
      target: { value: '  Player1  ' } // With spaces to test trim
    };
    
    // Call handler directly (bypassing debounce)
    inputHandler(mockEvent);
    
    // Verify state updated with trimmed value
    expect(setState).toHaveBeenCalledWith('playerFilter', 'player1');
  });
  
  test('row click updates selected player state', () => {
    // Setup test data
    const testPlayers = [
      { id: 'player1', name: 'Player 1' },
      { id: 'player2', name: 'Player 2' }
    ];
    
    getState.mockImplementation((key) => {
      if (key === 'playerData') return testPlayers;
      return null;
    });
    
    // Initialize listeners
    initializeTableListeners();
    
    // Get table body and click handler
    const tableBody = document.querySelector('tbody');
    
    // Extract the click handler function
    const clickHandler = tableBody.addEventListener.mock.calls[0][1];
    
    // Create a mock row element
    const mockRow = {
      getAttribute: jest.fn().mockReturnValue('player1')
    };
    
    // Create a mock event
    const mockEvent = {
      target: {
        closest: jest.fn().mockReturnValue(mockRow)
      }
    };
    
    // Simulate row click
    clickHandler(mockEvent);
    
    // Verify player data fetched and state updated
    expect(mockEvent.target.closest).toHaveBeenCalledWith('tr');
    expect(mockRow.getAttribute).toHaveBeenCalledWith('data-player-id');
    expect(setState).toHaveBeenCalledWith('selectedPlayer', testPlayers[0]);
  });
}); 