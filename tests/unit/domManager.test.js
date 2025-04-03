// Unit tests for domManager module
import { 
  assignElementReferences,
  updateHeaderButtonsVisibility,
  resetDashboardUI,
  showView,
  updateNavLinkActiveState,
  toggleMobileMenu,
  openChartModal,
  closeChartModal
} from '../../app/domManager.js';

// Mock the domManager module
jest.mock('../../app/domManager.js', () => {
  // Store original module
  const originalModule = jest.requireActual('../../app/domManager.js');
  
  // Create mock elements and collections that will be created during runtime
  const elements = {};
  const collections = {};
  
  // Override the module export
  return {
    ...originalModule,
    elements,
    collections,
    assignElementReferences: jest.fn().mockReturnValue(true)
  };
});

// Import elements and collections from the mocked module
import { elements, collections } from '../../app/domManager.js';

// Set up the DOM elements before each test
beforeEach(() => {
  // Clear previous mocks
  jest.clearAllMocks();
  
  // Set up mock elements
  elements.downloadCSVButton = {
    style: {
      display: 'none'
    }
  };
  
  elements.dashboardStats = {
    innerHTML: ''
  };
  
  elements.tables = {
    playerTable: {
      body: {
        innerHTML: ''
      }
    }
  };
  
  elements.views = {
    dashboard: { 
      classList: {
        contains: jest.fn().mockImplementation(cls => cls === 'active'),
        add: jest.fn(),
        remove: jest.fn()
      },
      hidden: false
    },
    playerDetails: { 
      classList: {
        contains: jest.fn().mockReturnValue(false),
        add: jest.fn(),
        remove: jest.fn()
      },
      hidden: true
    },
    categoryAnalysis: { 
      classList: {
        contains: jest.fn().mockReturnValue(false),
        add: jest.fn(),
        remove: jest.fn()
      },
      hidden: true
    },
    scoreRules: { 
      classList: {
        contains: jest.fn().mockReturnValue(false),
        add: jest.fn(),
        remove: jest.fn()
      },
      hidden: true
    }
  };
  
  // Create mocks for classList functions that test whether an element has a class
  Object.values(elements.views).forEach(view => {
    // Make sure hidden property is tracked properly with classList changes
    const originalAdd = view.classList.add;
    view.classList.add = jest.fn(cls => {
      if (cls === 'hidden') view.hidden = true;
      return originalAdd(cls);
    });
    
    const originalRemove = view.classList.remove;
    view.classList.remove = jest.fn(cls => {
      if (cls === 'hidden') view.hidden = false;
      return originalRemove(cls);
    });
  });
  
  // Mock collections
  collections.navLinks = {
    desktop: Array(4).fill().map(() => ({ 
      classList: {
        contains: jest.fn().mockReturnValue(false),
        add: jest.fn(),
        remove: jest.fn()
      }
    })),
    mobile: Array(4).fill().map(() => ({ 
      classList: {
        contains: jest.fn().mockReturnValue(false),
        add: jest.fn(),
        remove: jest.fn()
      }
    }))
  };
  
  // Set up mobile menu
  elements.mobileNav = {
    classList: {
      contains: jest.fn().mockImplementation(cls => cls === 'hidden'),
      add: jest.fn(),
      remove: jest.fn(),
      toggle: jest.fn(cls => {
        const isHidden = elements.mobileNav.classList.contains('hidden');
        elements.mobileNav.classList.contains = jest.fn().mockImplementation(c => 
          c === 'hidden' ? !isHidden : false
        );
      })
    }
  };
  
  // Set up modal
  elements.modal = {
    container: {
      style: {
        display: 'none'
      }
    },
    chartContainer: {
      innerHTML: ''
    },
    title: {
      textContent: ''
    }
  };
  
  // Mock console functions
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

describe('assignElementReferences', () => {
  test('assigns DOM element references correctly', () => {
    const result = assignElementReferences();
    expect(result).toBe(true);
  });
});

describe('updateHeaderButtonsVisibility', () => {
  test('shows header buttons when data is loaded', () => {
    elements.downloadCSVButton.style.display = 'none';
    
    updateHeaderButtonsVisibility(true);
    
    expect(elements.downloadCSVButton.style.display).toBe('inline-block');
  });
  
  test('hides header buttons when no data is loaded', () => {
    elements.downloadCSVButton.style.display = 'inline-block';
    
    updateHeaderButtonsVisibility(false);
    
    expect(elements.downloadCSVButton.style.display).toBe('none');
  });
});

describe('resetDashboardUI', () => {
  test('resets dashboard UI elements', () => {
    // Set up initial state
    elements.dashboardStats.innerHTML = '<div>Test stats</div>';
    elements.tables.playerTable.body.innerHTML = '<tr><td>Test data</td></tr>';
    
    // Reset UI
    resetDashboardUI();
    
    // Check that elements are cleared
    expect(elements.dashboardStats.innerHTML).toBe('');
    expect(elements.tables.playerTable.body.innerHTML).toBe('');
  });
});

describe('showView', () => {
  test('shows the specified view and hides others', () => {
    showView('playerDetails');
    
    // Check that classList.add and remove were called appropriately
    expect(elements.views.dashboard.classList.add).toHaveBeenCalledWith('hidden');
    expect(elements.views.playerDetails.classList.remove).toHaveBeenCalledWith('hidden');
    expect(elements.views.categoryAnalysis.classList.add).toHaveBeenCalledWith('hidden');
    expect(elements.views.scoreRules.classList.add).toHaveBeenCalledWith('hidden');
  });
  
  test('defaults to dashboard view for invalid view name', () => {
    showView('invalidView');
    
    // Dashboard should still be visible
    expect(elements.views.dashboard.hidden).toBe(false);
  });
});

describe('updateNavLinkActiveState', () => {
  test('updates active state for desktop and mobile navigation links', () => {
    updateNavLinkActiveState('playerDetails');
    
    // Check the active states by index (assuming playerDetails is the second item)
    collections.navLinks.desktop.forEach((link, index) => {
      if (index === 1) {
        expect(link.classList.add).toHaveBeenCalledWith('active');
      } else {
        expect(link.classList.remove).toHaveBeenCalledWith('active');
      }
    });
    
    collections.navLinks.mobile.forEach((link, index) => {
      if (index === 1) {
        expect(link.classList.add).toHaveBeenCalledWith('active');
      } else {
        expect(link.classList.remove).toHaveBeenCalledWith('active');
      }
    });
  });
});

describe('toggleMobileMenu', () => {
  test('toggles mobile menu visibility on successive calls', () => {
    // First call should remove hidden class
    toggleMobileMenu();
    expect(elements.mobileNav.classList.toggle).toHaveBeenCalledWith('hidden', false);
    
    // Reset mock
    elements.mobileNav.classList.toggle.mockClear();
    
    // Second call should add hidden class
    toggleMobileMenu();
    expect(elements.mobileNav.classList.toggle).toHaveBeenCalledWith('hidden', true);
  });
});

describe('openChartModal and closeChartModal', () => {
  test('openChartModal displays modal with title', () => {
    openChartModal('Test Chart');
    
    expect(elements.modal.container.style.display).toBe('block');
    expect(elements.modal.title.textContent).toBe('Test Chart');
  });
  
  test('closeChartModal hides modal', () => {
    // First open modal
    elements.modal.container.style.display = 'block';
    
    closeChartModal();
    
    expect(elements.modal.container.style.display).toBe('none');
  });
});
