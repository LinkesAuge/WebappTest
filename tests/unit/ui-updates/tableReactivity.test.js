/**
 * Unit tests for UI-State reactivity with table rendering
 */

import { renderTable, renderPlayerTable } from '../../../js/ui-updates/tableRenderer.js';
import { setState, getState, subscribe } from '../../../js/state.js';
import { showElement, hideElement } from '../../../js/dom.js';

// Mock dependencies
jest.mock('../../../js/state.js');
jest.mock('../../../js/dom.js');

describe('Table Reactivity Tests', () => {
  
  // Mock DOM elements and document methods
  let mockContainer;
  let mockTable;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock DOM elements
    mockTable = {
      id: 'player-table',
      innerHTML: '',
      appendChild: jest.fn(),
      querySelector: jest.fn().mockReturnValue({
        appendChild: jest.fn()
      })
    };
    
    mockContainer = {
      id: 'table-container',
      innerHTML: '',
      appendChild: jest.fn(),
      insertBefore: jest.fn(),
      firstChild: null
    };
    
    // Mock document methods
    document.getElementById = jest.fn().mockImplementation((id) => {
      if (id === 'table-container') return mockContainer;
      return null;
    });
    
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'table') return mockTable;
      if (tag === 'thead') return { appendChild: jest.fn() };
      if (tag === 'tbody') return { appendChild: jest.fn() };
      if (tag === 'tr') return { 
        appendChild: jest.fn(),
        classList: { add: jest.fn() },
        className: ''
      };
      if (tag === 'th') return { 
        appendChild: jest.fn(),
        classList: { add: jest.fn(), remove: jest.fn() },
        dataset: {},
        addEventListener: jest.fn(),
        textContent: ''
      };
      if (tag === 'td') return { 
        appendChild: jest.fn(),
        textContent: '',
        innerHTML: ''
      };
      if (tag === 'div') return {
        appendChild: jest.fn(),
        className: ''
      };
      if (tag === 'button') return {
        addEventListener: jest.fn(),
        textContent: '',
        disabled: false
      };
      if (tag === 'input') return {
        addEventListener: jest.fn(),
        type: '',
        placeholder: '',
        className: '',
        value: ''
      };
      
      return { appendChild: jest.fn() };
    });
    
    // Set up initial state
    const mockData = [
      { id: 1, name: 'Player 1', score: 100 },
      { id: 2, name: 'Player 2', score: 75 }
    ];
    
    getState.mockImplementation((key) => {
      if (key === 'displayData') return mockData;
      if (key === 'sortColumn') return 'name';
      if (key === 'sortDirection') return 'asc';
      if (key === 'playerFilter') return '';
      return null;
    });
  });
  
  test('renderTable should subscribe to state changes', () => {
    // Mock the subscribe function to capture the callback
    let capturedCallback;
    subscribe.mockImplementation((property, callback) => {
      if (property === 'displayData') {
        capturedCallback = callback;
      }
      return 'sub_id_123';
    });
    
    // Call the renderTable function
    renderTable('table-container');
    
    // Verify subscription was created for displayData
    expect(subscribe).toHaveBeenCalledWith('displayData', expect.any(Function));
    
    // Update display data
    const newData = [
      { id: 3, name: 'Player 3', score: 90 }
    ];
    getState.mockReturnValue(newData);
    
    // Call the captured callback to simulate state change
    capturedCallback(newData);
    
    // Verify container was cleared and re-rendered
    expect(mockContainer.innerHTML).toBe('');
  });
  
  test('renderTable should re-render when sortColumn state changes', () => {
    // Mock subscriptions
    const subscriptions = {};
    subscribe.mockImplementation((property, callback) => {
      subscriptions[property] = callback;
      return `sub_id_${property}`;
    });
    
    // Call renderTable
    renderTable('table-container');
    
    // Verify subscriptions
    expect(subscribe).toHaveBeenCalledWith('displayData', expect.any(Function));
    expect(subscribe).toHaveBeenCalledWith('sortColumn', expect.any(Function));
    expect(subscribe).toHaveBeenCalledWith('sortDirection', expect.any(Function));
    
    // Change sort column
    getState.mockImplementation((key) => {
      if (key === 'sortColumn') return 'score'; // Changed from 'name'
      if (key === 'sortDirection') return 'asc';
      return null;
    });
    
    // Call the callback for sortColumn to simulate state change
    subscriptions['sortColumn']('score');
    
    // Verify table was re-rendered
    expect(mockContainer.innerHTML).toBe('');
  });
  
  test('renderTable should re-render when playerFilter state changes', () => {
    // Mock subscriptions
    const subscriptions = {};
    subscribe.mockImplementation((property, callback) => {
      subscriptions[property] = callback;
      return `sub_id_${property}`;
    });
    
    // Call renderTable
    renderTable('table-container');
    
    // Verify subscriptions
    expect(subscribe).toHaveBeenCalledWith('playerFilter', expect.any(Function));
    
    // Change player filter
    getState.mockImplementation((key) => {
      if (key === 'playerFilter') return 'Player 1';
      return null;
    });
    
    // Call the callback for playerFilter to simulate state change
    subscriptions['playerFilter']('Player 1');
    
    // Verify container was cleared and table re-rendered
    expect(mockContainer.innerHTML).toBe('');
  });
  
  test('renderTable should handle errors gracefully', () => {
    // Setup getState to throw an error
    getState.mockImplementation(() => {
      throw new Error('Test error');
    });
    
    // Call renderTable
    renderTable('table-container');
    
    // Verify error handling
    expect(hideElement).toHaveBeenCalledWith('table-container');
  });
}); 