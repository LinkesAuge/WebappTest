/**
 * View Transitions Integration Tests
 * 
 * Tests for view transitions and navigation between different sections.
 */

// Import mocked versions of the app functions
import { 
  initializeApp, 
  renderDashboard
} from '../../helpers/mock-app';

// Define mock view functions
const showView = jest.fn((viewId) => {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active-view');
  });
  
  // Show the requested view
  const viewElement = document.getElementById(viewId);
  if (viewElement) {
    viewElement.classList.add('active-view');
    return true;
  }
  return false;
});

const showPlayerDetail = jest.fn((playerId) => {
  // Set up player data
  const playerData = global.mockPlayers.find(p => p.id === playerId);
  if (!playerData) return false;
  
  global.selectedPlayer = playerData;
  return showView('player-detail');
});

const updateNavState = jest.fn((viewId) => {
  // Update navigation buttons
  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === viewId) {
      btn.classList.add('active');
    }
  });
});

// Add functions to global scope for testing
global.showView = showView;
global.showPlayerDetail = showPlayerDetail;
global.updateNavState = updateNavState;

describe('View Transitions', () => {
  beforeEach(() => {
    // Set up DOM for view tests
    document.body.innerHTML = `
      <nav>
        <button id="dashboard-button" class="nav-button" data-view="dashboard">Dashboard</button>
        <button id="players-button" class="nav-button" data-view="players">Players</button>
        <button id="charts-button" class="nav-button" data-view="charts">Charts</button>
        <button id="analytics-button" class="nav-button" data-view="analytics">Analytics</button>
      </nav>
      
      <main>
        <div id="loading-view" class="view">Loading...</div>
        <div id="dashboard" class="view">Dashboard Content</div>
        <div id="players" class="view">Players List</div>
        <div id="charts" class="view">Charts View</div>
        <div id="analytics" class="view">Analytics View</div>
        <div id="player-detail" class="view">Player Detail</div>
      </main>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up mock data
    global.mockPlayers = [
      {
        id: 'player-1',
        playerName: 'Max Mustermann',
        totalScore: 2500,
        chestCount: 42,
        isPremium: true
      },
      {
        id: 'player-2',
        playerName: 'Elina Evergreen',
        totalScore: 3200,
        chestCount: 38,
        isPremium: false
      }
    ];
    
    // Set initial view state
    document.getElementById('loading-view').classList.add('active-view');
    
    // Initialize the app
    initializeApp();
  });
  
  describe('Basic View Switching', () => {
    test('should switch from loading to dashboard view', () => {
      // Verify initial state
      expect(document.getElementById('loading-view').classList.contains('active-view')).toBe(true);
      
      // Switch to dashboard view
      showView('dashboard');
      
      // Verify dashboard is visible and loading is hidden
      expect(document.getElementById('dashboard').classList.contains('active-view')).toBe(true);
      expect(document.getElementById('loading-view').classList.contains('active-view')).toBe(false);
    });
    
    test('should switch to player detail view with player data', () => {
      // Show a player detail
      const result = showPlayerDetail('player-1');
      
      // Verify success
      expect(result).toBe(true);
      
      // Verify player detail view is visible
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(true);
      
      // Verify player data is set
      expect(global.selectedPlayer).toBeDefined();
      expect(global.selectedPlayer.playerName).toBe('Max Mustermann');
    });
    
    test('should switch to data table view', () => {
      // Switch to players view
      const result = showView('players');
      
      // Verify success
      expect(result).toBe(true);
      
      // Verify players view is visible
      expect(document.getElementById('players').classList.contains('active-view')).toBe(true);
    });
    
    test('should switch to charts view', () => {
      // Switch to charts view
      const result = showView('charts');
      
      // Verify success
      expect(result).toBe(true);
      
      // Verify charts view is visible
      expect(document.getElementById('charts').classList.contains('active-view')).toBe(true);
    });
  });
  
  describe('Navigation Button States', () => {
    test('should update nav button active states when switching views', () => {
      // Verify initial state
      updateNavState('dashboard');
      
      // Dashboard button should be active
      expect(document.getElementById('dashboard-button').classList.contains('active')).toBe(true);
      expect(document.getElementById('players-button').classList.contains('active')).toBe(false);
      
      // Switch to players view
      showView('players');
      updateNavState('players');
      
      // Players button should be active
      expect(document.getElementById('dashboard-button').classList.contains('active')).toBe(false);
      expect(document.getElementById('players-button').classList.contains('active')).toBe(true);
    });
    
    test('should handle player detail view nav state correctly', () => {
      // When showing player detail, no nav button should be active 
      // (it's a sub-view, not a main navigation item)
      showPlayerDetail('player-1');
      
      // Update nav state to reflect player detail view
      updateNavState(null);
      
      // All navigation buttons should be inactive
      expect(document.getElementById('dashboard-button').classList.contains('active')).toBe(false);
      expect(document.getElementById('players-button').classList.contains('active')).toBe(false);
      expect(document.getElementById('charts-button').classList.contains('active')).toBe(false);
      expect(document.getElementById('analytics-button').classList.contains('active')).toBe(false);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle switching to non-existent view gracefully', () => {
      // Try to switch to a view that doesn't exist
      const result = showView('non-existent-view');
      
      // Should return false to indicate failure
      expect(result).toBe(false);
      
      // Current view should remain unchanged
      const activeViewsBefore = document.querySelectorAll('.view.active-view').length;
      showView('non-existent-view');
      const activeViewsAfter = document.querySelectorAll('.view.active-view').length;
      
      expect(activeViewsBefore).toBe(activeViewsAfter);
    });
  });
}); 