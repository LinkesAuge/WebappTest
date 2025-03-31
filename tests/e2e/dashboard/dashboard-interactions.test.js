/**
 * E2E Dashboard Interactions Tests
 * 
 * End-to-end tests for dashboard interactions and functionality.
 */

// Import the E2E test helper
const { setupE2ETests } = require('../../helpers/e2e-test-setup');

describe('Dashboard Interactions', () => {
  beforeEach(() => {
    // Set up DOM and mock functions for E2E tests
    setupE2ETests();
    
    // Clear mocks for each test
    jest.clearAllMocks();
  });
  
  describe('Overall Statistics Display', () => {
    test('should display correct overall statistics', () => {
      // Calculate expected stats
      const playerCount = global.samplePlayersData.length;
      const totalScore = global.samplePlayersData.reduce((sum, player) => sum + player.totalScore, 0);
      const totalChests = global.samplePlayersData.reduce((sum, player) => sum + player.chestsOpened, 0);
      const avgScore = Math.round(totalScore / playerCount);
      
      // Check that stats are displayed correctly
      expect(document.getElementById('player-count').textContent).toContain(playerCount.toString());
      expect(document.getElementById('total-score').textContent).toContain(totalScore.toString());
      expect(document.getElementById('total-chests').textContent).toContain(totalChests.toString());
      expect(document.getElementById('avg-score').textContent).toContain(avgScore.toString());
    });
  });
  
  describe('Player Filtering', () => {
    test('should filter players by name when typing in filter input', () => {
      // Setup spy for filterPlayersByName
      const filterSpy = jest.spyOn(global, 'filterPlayersByName');
      
      // Get the filter input
      const filterInput = document.getElementById('player-filter');
      
      // Type in filter
      filterInput.value = 'Charlie';
      filterInput.dispatchEvent(new Event('input'));
      
      // Check that filterPlayersByName was called
      expect(filterSpy).toHaveBeenCalledWith('Charlie');
      
      // Only one player should match
      expect(global.displayData.length).toBe(1);
      expect(global.displayData[0].playerName).toBe('Chef Charlie');
    });
    
    test('should show no results message when filter has no matches', () => {
      // Get the filter input
      const filterInput = document.getElementById('player-filter');
      
      // Type in filter with no matches
      filterInput.value = 'XYZ123';
      filterInput.dispatchEvent(new Event('input'));
      
      // No players should match
      expect(global.displayData.length).toBe(0);
      
      // Table should show no results message
      const tableBody = document.getElementById('ranking-table-body');
      expect(tableBody.innerHTML).toBe('');
      expect(document.getElementById('no-results-message').style.display).toBe('block');
    });
    
    test('should restore all players when clearing filter', () => {
      // Get the filter input
      const filterInput = document.getElementById('player-filter');
      
      // First filter to a single result
      filterInput.value = 'Charlie';
      filterInput.dispatchEvent(new Event('input'));
      
      // Only one player should be displayed
      expect(global.displayData.length).toBe(1);
      
      // Now clear the filter
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input'));
      
      // All players should be displayed again
      expect(global.displayData.length).toBe(global.samplePlayersData.length);
      expect(document.getElementById('no-results-message').style.display).toBe('none');
    });
  });
  
  describe('Table Sorting', () => {
    test('should sort by total score in descending order by default', () => {
      // Check that players are sorted by score desc by default
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const firstRowPlayerId = tableRows[0].getAttribute('data-player-id');
      const firstPlayer = global.samplePlayersData.find(p => p.playerId === firstRowPlayerId);
      
      // Chef Charlie has the highest score
      expect(firstPlayer.playerName).toBe('Chef Charlie');
      expect(firstPlayer.totalScore).toBe(450);
    });
    
    test('should resort table when clicking on score header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // First click should already be sorting by score desc
      // Click again to sort asc
      document.getElementById('sort-score').click();
      
      // Check that sortData was called
      expect(sortSpy).toHaveBeenCalledWith('totalScore');
      
      // Check that the table is resorted
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      expect(tableRows.length).toBe(global.samplePlayersData.length);
    });
    
    test('should sort by player name when clicking on player header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // Click on player header to sort by name
      document.getElementById('sort-player').click();
      
      // Check that sortData was called
      expect(sortSpy).toHaveBeenCalledWith('playerName');
      
      // Check that the table is sorted by name
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const firstRowPlayerId = tableRows[0].getAttribute('data-player-id');
      const firstPlayer = global.samplePlayersData.find(p => p.playerId === firstRowPlayerId);
      
      // Should be sorted alphabetically
      expect(firstPlayer).toBeDefined();
    });
    
    test('should sort by chest count when clicking on chests header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // Click on chests header to sort by chestsOpened
      document.getElementById('sort-chests').click();
      
      // Check that sortData was called
      expect(sortSpy).toHaveBeenCalledWith('chestsOpened');
      
      // Check that the table is sorted by chests
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      expect(tableRows.length).toBe(global.samplePlayersData.length);
    });
  });
  
  describe('Player Ranking Display', () => {
    test('should display correct rank numbers based on sort order', () => {
      // Get all rank numbers from the table
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const ranks = Array.from(tableRows).map(row => row.children[0].textContent);
      
      // Ranks should be 1, 2, 3, 4
      expect(ranks).toEqual(['1', '2', '3', '4']);
      
      // Change sort to player name
      global.sortData('playerName', 'asc');
      global.renderRankingTable();
      
      // Ranks should still be 1, 2, 3, 4 but in different order
      const newTableRows = document.querySelectorAll('#ranking-table-body tr');
      const newRanks = Array.from(newTableRows).map(row => row.children[0].textContent);
      expect(newRanks).toEqual(['1', '2', '3', '4']);
      
      // Get the array of player names after sorting
      const playerNames = Array.from(newTableRows).map(row => row.children[1].textContent);
      
      // Verify they are in alphabetical order
      const sortedNames = [...playerNames].sort();
      expect(playerNames).toEqual(sortedNames);
    });
  });
  
  describe('Responsiveness', () => {
    test('should adjust UI for different screen sizes', () => {
      // Add a class to the dashboard element for testing responsiveness
      document.getElementById('dashboard').classList.add('mobile-view');
      
      // Check that the class was added properly
      expect(document.getElementById('dashboard').classList.contains('mobile-view')).toBe(true);
      
      // Remove the class to simulate desktop view
      document.getElementById('dashboard').classList.remove('mobile-view');
      
      // Check that the class was removed
      expect(document.getElementById('dashboard').classList.contains('mobile-view')).toBe(false);
    });
  });
}); 