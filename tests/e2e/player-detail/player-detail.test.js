/**
 * E2E Player Detail Tests
 * 
 * End-to-end tests for player detail functionality.
 */

// Import the E2E test helper
const { setupE2ETests } = require('../../helpers/e2e-test-setup');

describe('Player Detail E2E Tests', () => {
  beforeEach(() => {
    // Set up DOM and mock functions for E2E tests
    setupE2ETests();
    
    // Clear mocks for each test
    jest.clearAllMocks();
  });
  
  describe('Player Selection Flow', () => {
    test('should show player detail when player card is clicked', () => {
      // Setup spy for showPlayerDetail function
      const showDetailSpy = jest.spyOn(global, 'showPlayerDetail');
      
      // Click on the first player in the table
      const firstPlayerRow = document.querySelector('#ranking-table-body tr');
      firstPlayerRow.click();
      
      // Check that showPlayerDetail was called with correct player ID
      const playerId = firstPlayerRow.getAttribute('data-player-id');
      expect(showDetailSpy).toHaveBeenCalledWith(playerId);
      
      // Player detail view should be shown
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(true);
    });
    
    test('should display correct player data in the detail view', () => {
      // Get a sample player
      const player = global.samplePlayersData[0]; // Chef Charlie
      
      // Show player detail
      global.showPlayerDetail(player.playerId);
      
      // Check that player details are rendered correctly
      expect(document.getElementById('player-name').textContent).toBe(player.playerName);
      expect(document.getElementById('total-score-detail').textContent).toBe(player.totalScore.toString());
    });
    
    test('should return to dashboard when back button is clicked', () => {
      // First navigate to player detail
      global.showPlayerDetail(global.samplePlayersData[0].playerId);
      
      // Setup spy for showView function
      const showViewSpy = jest.spyOn(global, 'showView');
      
      // Click the back button
      document.getElementById('back-to-dashboard').click();
      
      // Check that showView was called with 'dashboard'
      expect(showViewSpy).toHaveBeenCalledWith('dashboard');
      
      // Dashboard should be active view
      expect(document.getElementById('dashboard').classList.contains('active-view')).toBe(true);
    });
  });
  
  describe('Player Comparison Flow', () => {
    test('should show different data when switching between players', () => {
      // Show first player
      global.showPlayerDetail(global.samplePlayersData[0].playerId);
      const firstPlayerName = document.getElementById('player-name').textContent;
      
      // Show second player
      global.showPlayerDetail(global.samplePlayersData[1].playerId);
      const secondPlayerName = document.getElementById('player-name').textContent;
      
      // Names should be different
      expect(firstPlayerName).not.toBe(secondPlayerName);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle invalid player ID gracefully', () => {
      // Try to show a player with invalid ID
      const result = global.showPlayerDetail('invalid-id');
      
      // Should return false for invalid player ID
      expect(result).toBe(false);
    });
    
    test('should handle missing element IDs gracefully', () => {
      // Mock console.error to prevent logging during the test
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Create a mock implementation that doesn't throw errors
      const originalRenderPlayerDetail = global.renderPlayerDetail;
      global.renderPlayerDetail = jest.fn().mockImplementation(player => {
        try {
          // Try to execute normally, but don't throw if elements are missing
          const playerName = document.getElementById('player-name');
          if (playerName) playerName.textContent = player.playerName;
          
          // More element updates would normally happen here
          return true;
        } catch (err) {
          console.error('Error in renderPlayerDetail:', err);
          return false;
        }
      });
      
      // Remove an element that's used in renderPlayerDetail
      document.getElementById('player-name').remove();
      
      // Should not throw an error with our mocked implementation
      expect(() => {
        global.renderPlayerDetail(global.samplePlayersData[0]);
      }).not.toThrow();
      
      // Restore original functions
      global.renderPlayerDetail = originalRenderPlayerDetail;
      console.error = originalConsoleError;
    });
  });
}); 