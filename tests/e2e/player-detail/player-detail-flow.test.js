/**
 * player-detail-flow.test.js
 * 
 * End-to-end tests for player detail view functionality in the ChefScore Analytics Dashboard
 */

// Mock Chart.js
jest.mock('chart.js', () => {
  return {
    Chart: jest.fn().mockImplementation(() => {
      return {
        update: jest.fn(),
        destroy: jest.fn(),
        data: { datasets: [] }
      };
    }),
    registerables: [],
    register: jest.fn()
  };
});

// Import functionality from main script
const { 
  initializeApp,
  switchView,
  renderPlayerDetail,
  renderDashboard
} = require('../../../script.js');

describe('Player Detail Flow', () => {
  // Sample processed player data for testing
  const samplePlayersData = [
    {
      playerId: '1001',
      playerName: 'Chef Alex',
      totalScore: 980,
      chestsOpened: 45,
      level: 10,
      skillTechnique: 92,
      skillCreativity: 85,
      skillPresentation: 90,
      skillEfficiency: 88,
      isPremium: true,
      recipesMastered: 12,
      restaurantsOwned: 3
    },
    {
      playerId: '1002',
      playerName: 'Chef Bailey',
      totalScore: 820,
      chestsOpened: 32,
      level: 8,
      skillTechnique: 78,
      skillCreativity: 90,
      skillPresentation: 82,
      skillEfficiency: 75,
      isPremium: false,
      recipesMastered: 9,
      restaurantsOwned: 2
    }
  ];

  beforeEach(() => {
    // Setup complex DOM for end-to-end testing
    document.body.innerHTML = `
      <div id="app">
        <header>
          <div id="app-title">ChefScore</div>
          <nav id="main-nav">
            <button id="nav-dashboard" class="nav-button active">Dashboard</button>
            <button id="nav-data" class="nav-button">Data</button>
            <button id="nav-charts" class="nav-button">Charts</button>
            <button id="nav-analytics" class="nav-button">Analytics</button>
          </nav>
        </header>
        
        <main>
          <div id="loading-view" class="view">Loading...</div>
          
          <div id="dashboard" class="view active-view">
            <div id="ranking-table-container">
              <table id="ranking-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Total Score</th>
                    <th>Chests</th>
                  </tr>
                </thead>
                <tbody id="ranking-table-body">
                  <!-- Player rows will be added here -->
                </tbody>
              </table>
            </div>
          </div>
          
          <div id="player-detail" class="view">
            <div id="player-detail-header">
              <h2 id="player-name"></h2>
              <div id="player-rank"></div>
            </div>
            <div id="player-stats">
              <div class="stat-box" id="total-score"></div>
              <div class="stat-box" id="total-chests"></div>
            </div>
            <div id="player-chart-container"></div>
            <div id="player-breakdown">
              <h3 id="breakdown-title"></h3>
              <div id="breakdown-content"></div>
            </div>
            <button id="back-to-dashboard">Back</button>
          </div>
          
          <div id="data-table" class="view"></div>
          <div id="charts" class="view"></div>
          <div id="analytics" class="view"></div>
        </main>
      </div>
    `;
    
    // Reset mocks and state
    jest.clearAllMocks();
    
    // Set up global state
    global.allPlayersData = samplePlayersData;
    global.displayData = samplePlayersData;
    global.allColumnHeaders = ['playerId', 'playerName', 'totalScore', 'chestsOpened', 'level', 
                              'skillTechnique', 'skillCreativity', 'skillPresentation', 
                              'skillEfficiency', 'isPremium', 'recipesMastered', 'restaurantsOwned'];
    global.currentView = 'dashboard';
    
    // Initialize app and render dashboard
    initializeApp();
    renderDashboard();
  });

  describe('Dashboard to Player Detail Navigation', () => {
    test('should navigate to player detail when clicking on a player in the ranking table', () => {
      // Setup the ranking table with player data
      const tableBody = document.getElementById('ranking-table-body');
      tableBody.innerHTML = `
        <tr data-player-id="1001">
          <td>1</td>
          <td>Chef Alex</td>
          <td>980</td>
          <td>45</td>
        </tr>
        <tr data-player-id="1002">
          <td>2</td>
          <td>Chef Bailey</td>
          <td>820</td>
          <td>32</td>
        </tr>
      `;
      
      // Set up spy for switchView
      const switchViewSpy = jest.spyOn(global, 'switchView');
      
      // Click on the first player row
      tableBody.querySelector('tr[data-player-id="1001"]').click();
      
      // Should call switchView with player-detail view and player data
      expect(switchViewSpy).toHaveBeenCalledWith('player-detail', {
        player: expect.objectContaining({
          playerId: '1001',
          playerName: 'Chef Alex'
        }),
        rank: 1
      });
    });
  });

  describe('Player Detail Rendering', () => {
    test('should render player detail view with correct player information', () => {
      // Get the first player
      const player = samplePlayersData[0];
      
      // Render player detail
      renderPlayerDetail(player, 1);
      
      // Check that player information is displayed correctly
      expect(document.getElementById('player-name').textContent).toBe('Chef Alex');
      expect(document.getElementById('player-rank').textContent).toContain('1');
      expect(document.getElementById('total-score').textContent).toContain('980');
      expect(document.getElementById('total-chests').textContent).toContain('45');
      
      // Check that player chart was created
      expect(global.Chart).toHaveBeenCalled();
    });
    
    test('should display player skill breakdown in the detail view', () => {
      // Get the first player
      const player = samplePlayersData[0];
      
      // Render player detail
      renderPlayerDetail(player, 1);
      
      // Check that skill breakdown is shown
      const breakdownContent = document.getElementById('breakdown-content');
      expect(breakdownContent.innerHTML).toContain('Technique');
      expect(breakdownContent.innerHTML).toContain('92');
      expect(breakdownContent.innerHTML).toContain('Creativity');
      expect(breakdownContent.innerHTML).toContain('85');
      expect(breakdownContent.innerHTML).toContain('Presentation');
      expect(breakdownContent.innerHTML).toContain('90');
      expect(breakdownContent.innerHTML).toContain('Efficiency');
      expect(breakdownContent.innerHTML).toContain('88');
    });
  });

  describe('Navigation Back to Dashboard', () => {
    test('should navigate back to dashboard when clicking the back button', () => {
      // First, switch to player detail view
      switchView('player-detail', { player: samplePlayersData[0], rank: 1 });
      
      // Verify we're on the player detail view
      expect(document.getElementById('player-detail').classList.contains('active-view')).toBe(true);
      
      // Set up spy for switchView
      const switchViewSpy = jest.spyOn(global, 'switchView');
      
      // Click the back button
      document.getElementById('back-to-dashboard').click();
      
      // Should call switchView with dashboard view
      expect(switchViewSpy).toHaveBeenCalledWith('dashboard');
    });
  });

  describe('Premium Status Indication', () => {
    test('should indicate premium status for premium players', () => {
      // Get the premium player
      const premiumPlayer = samplePlayersData[0]; // Chef Alex is premium
      
      // Render player detail
      renderPlayerDetail(premiumPlayer, 1);
      
      // Check that premium status is indicated
      expect(document.getElementById('player-detail-header').innerHTML).toContain('premium');
    });
    
    test('should not indicate premium status for non-premium players', () => {
      // Get the non-premium player
      const nonPremiumPlayer = samplePlayersData[1]; // Chef Bailey is not premium
      
      // Render player detail
      renderPlayerDetail(nonPremiumPlayer, 2);
      
      // Check that premium status is not indicated
      expect(document.getElementById('player-detail-header').innerHTML).not.toContain('premium');
    });
  });

  describe('Download Functionality', () => {
    test('should include a download button for player data', () => {
      // Get the first player
      const player = samplePlayersData[0];
      
      // Render player detail
      renderPlayerDetail(player, 1);
      
      // Check for download button
      const downloadButton = Array.from(document.querySelectorAll('button')).find(
        button => button.textContent.includes('Download') || button.id.includes('download')
      );
      
      expect(downloadButton).toBeDefined();
    });
  });
}); 