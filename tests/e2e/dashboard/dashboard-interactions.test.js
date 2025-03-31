/**
 * dashboard-interactions.test.js
 * 
 * End-to-end tests for dashboard interactions in the ChefScore Analytics Dashboard
 */

// Import functionality from main script
const { 
  initializeApp,
  renderDashboard,
  filterPlayersByName,
  sortData
} = require('../../../script.js');

describe('Dashboard Interactions', () => {
  // Sample processed player data for testing
  const samplePlayersData = [
    {
      playerId: '1001',
      playerName: 'Chef Alex',
      totalScore: 980,
      chestsOpened: 45,
      level: 10
    },
    {
      playerId: '1002',
      playerName: 'Chef Bailey',
      totalScore: 820,
      chestsOpened: 32,
      level: 8
    },
    {
      playerId: '1003',
      playerName: 'Chef Charlie',
      totalScore: 1050,
      chestsOpened: 51,
      level: 11
    },
    {
      playerId: '1004',
      playerName: 'Chef Dakota',
      totalScore: 760,
      chestsOpened: 28,
      level: 7
    }
  ];

  beforeEach(() => {
    // Setup dashboard DOM for end-to-end testing
    document.body.innerHTML = `
      <div id="app">
        <div id="dashboard" class="view active-view">
          <div id="overall-stats-section">
            <div class="stat-box" id="player-count"></div>
            <div class="stat-box" id="total-score"></div>
            <div class="stat-box" id="total-chests"></div>
            <div class="stat-box" id="avg-score"></div>
            <div class="stat-box" id="avg-chests"></div>
          </div>
          
          <div id="ranking-section">
            <h2 id="ranking-title">Overall Ranking</h2>
            <div id="filter-container">
              <input type="text" id="player-filter" placeholder="Filter by Player Name...">
            </div>
            <div id="ranking-table-container">
              <table id="ranking-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th id="sort-player" class="sortable">Player</th>
                    <th id="sort-score" class="sortable">Total Score</th>
                    <th id="sort-chests" class="sortable">Chests</th>
                  </tr>
                </thead>
                <tbody id="ranking-table-body"></tbody>
              </table>
            </div>
          </div>
          
          <div id="charts-section">
            <div id="top-sources-chart-container"></div>
            <div id="score-distribution-chart-container"></div>
            <div id="score-vs-chests-chart-container"></div>
          </div>
        </div>
      </div>
    `;
    
    // Reset mocks and state
    jest.clearAllMocks();
    
    // Set up global state
    global.allPlayersData = samplePlayersData;
    global.displayData = [...samplePlayersData];
    global.sortState = { column: 'totalScore', direction: 'desc' };
    global.currentView = 'dashboard';
    
    // Initialize app and render dashboard
    initializeApp();
    renderDashboard();
  });

  describe('Overall Statistics Display', () => {
    test('should display correct overall statistics', () => {
      // Calculate expected values
      const playerCount = samplePlayersData.length;
      const totalScore = samplePlayersData.reduce((sum, player) => sum + player.totalScore, 0);
      const totalChests = samplePlayersData.reduce((sum, player) => sum + player.chestsOpened, 0);
      const avgScore = totalScore / playerCount;
      const avgChests = totalChests / playerCount;
      
      // Check that stats are displayed correctly
      expect(document.getElementById('player-count').textContent).toContain(playerCount.toString());
      expect(document.getElementById('total-score').textContent).toContain(totalScore.toString());
      expect(document.getElementById('total-chests').textContent).toContain(totalChests.toString());
      expect(document.getElementById('avg-score').textContent).toContain(Math.round(avgScore).toString());
      expect(document.getElementById('avg-chests').textContent).toContain(Math.round(avgChests).toString());
    });
  });

  describe('Player Filtering', () => {
    test('should filter players by name when typing in filter input', () => {
      // Setup spy for filterPlayersByName
      const filterSpy = jest.spyOn(global, 'filterPlayersByName');
      
      // Get the filter input
      const filterInput = document.getElementById('player-filter');
      
      // Simulate typing "Ch" in the filter input
      filterInput.value = 'Ch';
      filterInput.dispatchEvent(new Event('input'));
      
      // Should call filterPlayersByName with correct filter
      expect(filterSpy).toHaveBeenCalledWith(samplePlayersData, 'Ch');
      
      // Only players with "Ch" in their name should be displayed
      const filteredPlayers = global.displayData;
      expect(filteredPlayers.length).toBe(2); // Chef Charlie and Chef Alex
      expect(filteredPlayers.some(p => p.playerName === 'Chef Charlie')).toBe(true);
      expect(filteredPlayers.some(p => p.playerName === 'Chef Alex')).toBe(true);
      
      // Table should be updated with filtered players
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      expect(tableRows.length).toBe(2);
    });
    
    test('should show no results message when filter has no matches', () => {
      // Get the filter input
      const filterInput = document.getElementById('player-filter');
      
      // Simulate typing a filter with no matches
      filterInput.value = 'XYZ';
      filterInput.dispatchEvent(new Event('input'));
      
      // No players should match
      expect(global.displayData.length).toBe(0);
      
      // Table should show no results message
      const tableBody = document.getElementById('ranking-table-body');
      expect(tableBody.innerHTML).toContain('No players match');
    });
    
    test('should restore all players when clearing filter', () => {
      // First, set a filter
      const filterInput = document.getElementById('player-filter');
      filterInput.value = 'Chef Alex';
      filterInput.dispatchEvent(new Event('input'));
      
      // Only one player should be displayed
      expect(global.displayData.length).toBe(1);
      
      // Now clear the filter
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input'));
      
      // All players should be displayed again
      expect(global.displayData.length).toBe(samplePlayersData.length);
      
      // Table should show all players
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      expect(tableRows.length).toBe(samplePlayersData.length);
    });
  });

  describe('Table Sorting', () => {
    test('should sort by total score in descending order by default', () => {
      // Check that players are sorted by score desc by default
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const firstRowPlayerId = tableRows[0].getAttribute('data-player-id');
      const firstPlayer = samplePlayersData.find(p => p.playerId === firstRowPlayerId);
      
      // Chef Charlie has the highest score
      expect(firstPlayer.playerName).toBe('Chef Charlie');
      
      // The score header should have sort-desc class
      expect(document.getElementById('sort-score').classList.contains('sort-desc')).toBe(true);
    });
    
    test('should resort table when clicking on score header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // First click should already be sorting by score desc
      // Click again to sort asc
      document.getElementById('sort-score').click();
      
      // Should call sortData with totalScore and asc
      expect(sortSpy).toHaveBeenCalledWith(expect.any(Array), 'totalScore', 'asc');
      
      // The score header should now have sort-asc class
      expect(document.getElementById('sort-score').classList.contains('sort-asc')).toBe(true);
      
      // The first player should now be the one with lowest score
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const firstRowPlayerId = tableRows[0].getAttribute('data-player-id');
      const firstPlayer = samplePlayersData.find(p => p.playerId === firstRowPlayerId);
      
      // Chef Dakota has the lowest score
      expect(firstPlayer.playerName).toBe('Chef Dakota');
    });
    
    test('should sort by player name when clicking on player header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // Click on player header to sort by name
      document.getElementById('sort-player').click();
      
      // Should call sortData with playerName and asc
      expect(sortSpy).toHaveBeenCalledWith(expect.any(Array), 'playerName', 'asc');
      
      // The player header should have sort-asc class
      expect(document.getElementById('sort-player').classList.contains('sort-asc')).toBe(true);
      
      // Players should be sorted alphabetically
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const playerNames = Array.from(tableRows).map(row => {
        const playerId = row.getAttribute('data-player-id');
        return samplePlayersData.find(p => p.playerId === playerId).playerName;
      });
      
      // Names should be in alphabetical order
      expect(playerNames[0]).toBe('Chef Alex');
      expect(playerNames[1]).toBe('Chef Bailey');
      expect(playerNames[2]).toBe('Chef Charlie');
      expect(playerNames[3]).toBe('Chef Dakota');
    });
    
    test('should sort by chest count when clicking on chests header', () => {
      // Setup spy for sortData
      const sortSpy = jest.spyOn(global, 'sortData');
      
      // Click on chests header to sort by chestsOpened
      document.getElementById('sort-chests').click();
      
      // Should call sortData with chestsOpened and desc
      expect(sortSpy).toHaveBeenCalledWith(expect.any(Array), 'chestsOpened', 'desc');
      
      // The chests header should have sort-desc class
      expect(document.getElementById('sort-chests').classList.contains('sort-desc')).toBe(true);
      
      // Players should be sorted by chest count
      const tableRows = document.querySelectorAll('#ranking-table-body tr');
      const firstRowPlayerId = tableRows[0].getAttribute('data-player-id');
      const firstPlayer = samplePlayersData.find(p => p.playerId === firstRowPlayerId);
      
      // Chef Charlie has the most chests
      expect(firstPlayer.playerName).toBe('Chef Charlie');
    });
  });

  describe('Player Ranking Display', () => {
    test('should display correct rank numbers based on sort order', () => {
      // By default, sorting by score desc
      let tableRows = document.querySelectorAll('#ranking-table-body tr');
      let ranks = Array.from(tableRows).map(row => row.cells[0].textContent);
      
      // Ranks should be 1, 2, 3, 4
      expect(ranks).toEqual(['1', '2', '3', '4']);
      
      // Change sort to player name
      document.getElementById('sort-player').click();
      
      // Should still have ranks 1-4 but in different order
      tableRows = document.querySelectorAll('#ranking-table-body tr');
      ranks = Array.from(tableRows).map(row => row.cells[0].textContent);
      
      // Ranks should still be 1, 2, 3, 4
      expect(ranks).toEqual(['1', '2', '3', '4']);
      
      // The players should be in alphabetical order
      const playerNames = Array.from(tableRows).map(row => row.cells[1].textContent);
      expect(playerNames[0]).toBe('Chef Alex');
      expect(playerNames[1]).toBe('Chef Bailey');
      expect(playerNames[2]).toBe('Chef Charlie');
      expect(playerNames[3]).toBe('Chef Dakota');
    });
  });

  describe('Responsiveness', () => {
    test('should adjust UI for different screen sizes', () => {
      // Mock a mobile viewport
      global.innerWidth = 480;
      window.dispatchEvent(new Event('resize'));
      
      // Dashboard should have mobile-view class or similar
      expect(document.getElementById('dashboard').classList.contains('mobile-view') || 
             document.getElementById('app').classList.contains('mobile-view') ||
             document.querySelector('.mobile-optimized')).toBeTruthy();
      
      // Mock a desktop viewport
      global.innerWidth = 1280;
      window.dispatchEvent(new Event('resize'));
      
      // Dashboard should not have mobile-view class
      expect(document.getElementById('dashboard').classList.contains('mobile-view') ||
             document.getElementById('app').classList.contains('mobile-view')).toBeFalsy();
    });
  });
}); 