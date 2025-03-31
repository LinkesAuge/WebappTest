/**
 * E2E Player Detail Flow Tests
 * 
 * End-to-end tests for player detail view navigation and functionality.
 */

// Import the E2E test helper
const { setupE2ETests } = require('../../helpers/e2e-test-setup');

describe('Player Detail Flow', () => {
  beforeEach(() => {
    // Set up DOM and mock functions for E2E tests
    setupE2ETests();
    
    // Clear mocks for each test
    jest.clearAllMocks();
  });
  
  describe('Dashboard to Player Detail Navigation', () => {
    test('should navigate to player detail when clicking on a player in the ranking table', () => {
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
      expect(document.getElementById('dashboard').classList.contains('active-view')).toBe(false);
    });
  });
  
  describe('Player Detail Rendering', () => {
    test('should render player detail view with correct player information', () => {
      // Get a sample player
      const player = global.samplePlayersData[0]; // Chef Charlie
      
      // Show player detail
      global.showPlayerDetail(player.playerId);
      
      // Check that player details are rendered correctly
      expect(document.getElementById('player-name').textContent).toBe(player.playerName);
      expect(document.getElementById('player-rank').textContent).toContain('1'); // Rank
      expect(document.getElementById('total-score-detail').textContent).toBe(player.totalScore.toString());
      expect(document.getElementById('chests-opened-detail').textContent).toBe(player.chestsOpened.toString());
    });
    
    test('should display player skill breakdown in the detail view', () => {
      // Get a sample player
      const player = global.samplePlayersData[0]; // Chef Charlie
      
      // Show player detail
      global.showPlayerDetail(player.playerId);
      
      // Check that skills are displayed
      const skillsContainer = document.getElementById('skills-container');
      expect(skillsContainer.innerHTML).toContain('cooking');
      expect(skillsContainer.innerHTML).toContain('presentation');
      expect(skillsContainer.innerHTML).toContain('speed');
      expect(skillsContainer.innerHTML).toContain('creativity');
      
      // Check that skill values are displayed correctly
      expect(skillsContainer.innerHTML).toContain(`${player.skills.cooking}%`);
      expect(skillsContainer.innerHTML).toContain(`${player.skills.presentation}%`);
      expect(skillsContainer.innerHTML).toContain(`${player.skills.speed}%`);
      expect(skillsContainer.innerHTML).toContain(`${player.skills.creativity}%`);
    });
  });
  
  describe('Navigation Back to Dashboard', () => {
    test('should navigate back to dashboard when clicking the back button', () => {
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
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(false);
    });
  });
  
  describe('Premium Status Indication', () => {
    test('should indicate premium status for premium players', () => {
      // Find a premium player
      const premiumPlayer = global.samplePlayersData.find(p => p.isPremium);
      
      // Show premium player detail
      global.showPlayerDetail(premiumPlayer.playerId);
      
      // Premium badge should be visible
      const premiumBadge = document.getElementById('premium-badge');
      expect(premiumBadge.style.display).toBe('inline-block');
    });
    
    test('should not indicate premium status for non-premium players', () => {
      // Find a non-premium player
      const nonPremiumPlayer = global.samplePlayersData.find(p => !p.isPremium);
      
      // Show non-premium player detail
      global.showPlayerDetail(nonPremiumPlayer.playerId);
      
      // Premium badge should be hidden
      const premiumBadge = document.getElementById('premium-badge');
      expect(premiumBadge.style.display).toBe('none');
    });
  });
  
  describe('Download Functionality', () => {
    test('should include a download button for player data', () => {
      // Navigate to player detail
      global.showPlayerDetail(global.samplePlayersData[0].playerId);
      
      // Download button should exist
      const downloadButton = document.getElementById('download-data');
      expect(downloadButton).toBeTruthy();
      
      // Mock console log
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Click download button
      downloadButton.click();
      
      // Should trigger download functionality (in our mock, it logs to console)
      expect(consoleLogSpy).toHaveBeenCalledWith('Downloading player data...');
      
      // Restore console.log
      consoleLogSpy.mockRestore();
    });
  });
}); 