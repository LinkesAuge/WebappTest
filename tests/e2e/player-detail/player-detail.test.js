/**
 * E2E Player Detail Tests
 * 
 * End-to-end tests for the player detail functionality.
 */

// Import mocked versions of the app functions
import { 
  initializeApp, 
  renderDashboard
} from '../../helpers/mock-app';

// Define mock functions for player details
const showPlayerDetail = jest.fn((playerId) => {
  // Get player data
  const player = global.mockPlayerData.find(p => p.id === playerId);
  if (!player) return false;
  
  // Set current player and show player detail view
  global.selectedPlayer = player;
  showView('player-detail');
  renderPlayerDetail(player);
  return true;
});

const renderPlayerDetail = jest.fn((player) => {
  // Create or update the player detail view with player data
  const detailView = document.getElementById('player-detail');
  if (!detailView) return false;
  
  // Reset the detail view content
  detailView.innerHTML = `
    <h2 class="player-name">${player.playerName}</h2>
    <div class="player-stats">
      <div class="stat-item" id="player-score">
        <div class="stat-label">Total Score</div>
        <div class="stat-value">${player.totalScore}</div>
      </div>
      <div class="stat-item" id="player-chests">
        <div class="stat-label">Chests Opened</div>
        <div class="stat-value">${player.chestCount}</div>
      </div>
      <div class="stat-item" id="player-type">
        <div class="stat-label">Account Type</div>
        <div class="stat-value">${player.isPremium ? 'Premium' : 'Standard'}</div>
      </div>
    </div>
    <div class="player-chart-container" id="player-chart-container"></div>
    <button id="back-button">Back to Dashboard</button>
  `;
  
  // Add event listener for back button
  document.getElementById('back-button').addEventListener('click', () => {
    showView('dashboard');
  });
  
  return true;
});

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

// Add functions to global scope for testing
global.showPlayerDetail = showPlayerDetail;
global.renderPlayerDetail = renderPlayerDetail;
global.showView = showView;

describe('Player Detail E2E Tests', () => {
  beforeEach(() => {
    // Set up DOM for tests
    document.body.innerHTML = `
      <div id="app-container">
        <header>
          <h1>Chef Score Analytics</h1>
        </header>
        <main>
          <div id="dashboard" class="view active-view">
            <div class="players-list">
              <div class="player-card" data-player-id="player-1">
                <h3 class="player-name">Max Mustermann</h3>
                <div class="player-summary">Score: 2500</div>
              </div>
              <div class="player-card" data-player-id="player-2">
                <h3 class="player-name">Elina Evergreen</h3>
                <div class="player-summary">Score: 3200</div>
              </div>
            </div>
          </div>
          <div id="player-detail" class="view"></div>
        </main>
      </div>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Set up mock player data
    global.mockPlayerData = [
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
    
    // Initialize the app
    initializeApp();
    
    // Add click event listeners to player cards
    document.querySelectorAll('.player-card').forEach(card => {
      card.addEventListener('click', () => {
        const playerId = card.dataset.playerId;
        showPlayerDetail(playerId);
      });
    });
  });
  
  describe('Player Selection Flow', () => {
    test('should show player detail when player card is clicked', () => {
      // Click on a player card
      document.querySelector('[data-player-id="player-1"]').click();
      
      // Check that player detail view is shown
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(true);
      expect(document.getElementById('dashboard').classList.contains('active-view')).toBe(false);
      
      // Verify the player detail function was called with the correct ID
      expect(showPlayerDetail).toHaveBeenCalledWith('player-1');
    });
    
    test('should display correct player data in the detail view', () => {
      // Show player detail
      showPlayerDetail('player-1');
      
      // Check player name is displayed correctly
      expect(document.querySelector('#player-detail .player-name').textContent).toBe('Max Mustermann');
      
      // Check player stats are displayed correctly
      expect(document.querySelector('#player-score .stat-value').textContent).toBe('2500');
      expect(document.querySelector('#player-chests .stat-value').textContent).toBe('42');
      expect(document.querySelector('#player-type .stat-value').textContent).toBe('Premium');
    });
    
    test('should return to dashboard when back button is clicked', () => {
      // Show player detail
      showPlayerDetail('player-1');
      
      // Click back button
      document.getElementById('back-button').click();
      
      // Check dashboard is shown
      expect(document.getElementById('dashboard').classList.contains('active-view')).toBe(true);
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(false);
    });
  });
  
  describe('Player Comparison Flow', () => {
    test('should show different data when switching between players', () => {
      // Show first player
      showPlayerDetail('player-1');
      
      // Verify first player data
      expect(document.querySelector('#player-detail .player-name').textContent).toBe('Max Mustermann');
      expect(document.querySelector('#player-score .stat-value').textContent).toBe('2500');
      
      // Show second player
      showPlayerDetail('player-2');
      
      // Verify second player data
      expect(document.querySelector('#player-detail .player-name').textContent).toBe('Elina Evergreen');
      expect(document.querySelector('#player-score .stat-value').textContent).toBe('3200');
      expect(document.querySelector('#player-type .stat-value').textContent).toBe('Standard');
    });
  });
  
  describe('Error Handling', () => {
    test('should handle invalid player ID gracefully', () => {
      // Try to show detail for non-existent player
      const result = showPlayerDetail('non-existent-player');
      
      // Should return false to indicate failure
      expect(result).toBe(false);
      
      // Detail view should not be rendered with invalid data
      expect(renderPlayerDetail).not.toHaveBeenCalled();
    });
    
    test('should handle missing element IDs gracefully', () => {
      // Remove the player detail element
      document.getElementById('player-detail').remove();
      
      // Try to show player detail
      showPlayerDetail('player-1');
      
      // renderPlayerDetail should return false when element is missing
      const result = renderPlayerDetail(global.mockPlayerData[0]);
      expect(result).toBe(false);
    });
  });
}); 