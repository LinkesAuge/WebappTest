/**
 * E2E Test Setup Helper
 * 
 * This file provides standardized setup for E2E tests, including DOM structure, mocks
 * for global functions, and utility functions for testing.
 */

// Import required modules
// Mock Chart.js instead of importing it
class MockChart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.data = config.data;
    this.options = config.options;
    this.update = jest.fn();
    this.destroy = jest.fn();
    this.getDatasetMeta = jest.fn();
    return this;
  }
}

// Expose the Chart mock globally
global.Chart = MockChart;

/**
 * Sets up the standard DOM structure for E2E tests
 */
function setupStandardDOM() {
  // Create the main DOM structure that all tests will need
  document.body.innerHTML = `
    <div id="app">
      <!-- Navigation -->
      <nav id="main-nav">
        <button id="dashboard-nav" class="nav-button active">Dashboard</button>
        <button id="player-detail-nav" class="nav-button">Player Detail</button>
        <button id="settings-nav" class="nav-button">Settings</button>
      </nav>
      
      <!-- Views container -->
      <div id="views-container">
        <!-- Dashboard View -->
        <div id="dashboard" class="view active-view">
          <h1>Chef Score Analytics</h1>
          
          <!-- Overall stats section -->
          <div class="stats-container">
            <div class="stat-card">
              <h3>Players</h3>
              <div id="player-count">0</div>
            </div>
            <div class="stat-card">
              <h3>Total Score</h3>
              <div id="total-score">0</div>
            </div>
            <div class="stat-card">
              <h3>Total Chests</h3>
              <div id="total-chests">0</div>
            </div>
            <div class="stat-card">
              <h3>Avg Score</h3>
              <div id="avg-score">0</div>
            </div>
          </div>
          
          <!-- Player filtering -->
          <div class="filter-container">
            <input type="text" id="player-filter" placeholder="Filter players...">
            <span id="filter-result-count"></span>
          </div>
          
          <!-- Player ranking table -->
          <div class="ranking-container">
            <table id="ranking-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th id="sort-player">Player</th>
                  <th id="sort-score">Score</th>
                  <th id="sort-chests">Chests</th>
                </tr>
              </thead>
              <tbody id="ranking-table-body">
                <!-- Will be populated by tests -->
              </tbody>
            </table>
            <div id="no-results-message" style="display: none;">No players found</div>
          </div>
          
          <!-- Chart section -->
          <div class="chart-section">
            <div id="score-distribution-container" class="chart-container">
              <div class="chart-header">
                <h3>Score Distribution</h3>
                <div class="chart-actions">
                  <button id="refresh-chart" class="chart-action-btn">Refresh</button>
                  <select id="chart-time-range">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>
              <canvas id="score-distribution-chart"></canvas>
              <div class="chart-legend" id="score-distribution-legend"></div>
            </div>
            
            <div id="score-vs-chests-container" class="chart-container">
              <div class="chart-header">
                <h3>Score vs Chests Opened</h3>
                <div class="chart-actions">
                  <button id="toggle-premium" class="chart-action-btn">Toggle Premium</button>
                </div>
              </div>
              <canvas id="score-vs-chests-chart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Player Detail View -->
        <div id="player-detail" class="view">
          <div class="detail-header">
            <button id="back-to-dashboard" class="back-button">← Back</button>
            <h2 id="player-name"></h2>
            <span id="player-rank"></span>
            <span id="premium-badge" class="badge">Premium</span>
          </div>
          
          <div class="player-stats">
            <div class="stat-card">
              <h3>Total Score</h3>
              <div id="total-score-detail"></div>
            </div>
            <div class="stat-card">
              <h3>Chests Opened</h3>
              <div id="chests-opened-detail"></div>
            </div>
            <div class="stat-card">
              <h3>Last Active</h3>
              <div id="last-active-detail"></div>
            </div>
          </div>
          
          <div class="skill-breakdown">
            <h3>Skill Breakdown</h3>
            <div id="skills-container"></div>
          </div>
          
          <div class="actions">
            <button id="download-data" class="action-button">Download Player Data</button>
          </div>
        </div>
        
        <!-- Settings View -->
        <div id="settings" class="view">
          <h2>Settings</h2>
          <div class="settings-container">
            <div class="setting-group">
              <h3>Language</h3>
              <select id="language-selector">
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Sets up mock sample data for tests
 */
function setupMockData() {
  // Sample player data for tests
  global.samplePlayersData = [
    {
      playerId: "1001",
      playerName: "Chef Charlie",
      totalScore: 450,
      chestsOpened: 25,
      isPremium: true,
      lastActive: "2023-04-15T14:30:00Z",
      skills: {
        cooking: 90,
        presentation: 85,
        speed: 70,
        creativity: 95
      }
    },
    {
      playerId: "1002",
      playerName: "Baker Bob",
      totalScore: 380,
      chestsOpened: 20,
      isPremium: false,
      lastActive: "2023-04-14T09:15:00Z",
      skills: {
        cooking: 75,
        presentation: 90,
        speed: 65,
        creativity: 80
      }
    },
    {
      playerId: "1003",
      playerName: "Pastry Paula",
      totalScore: 410,
      chestsOpened: 22,
      isPremium: true,
      lastActive: "2023-04-16T11:45:00Z",
      skills: {
        cooking: 85,
        presentation: 95,
        speed: 60,
        creativity: 90
      }
    },
    {
      playerId: "1004",
      playerName: "Grill Gary",
      totalScore: 320,
      chestsOpened: 18,
      isPremium: false,
      lastActive: "2023-04-13T16:20:00Z",
      skills: {
        cooking: 80,
        presentation: 70,
        speed: 85,
        creativity: 65
      }
    }
  ];

  // Initialize displayData with all players
  global.displayData = [...global.samplePlayersData];
  
  // Mock chart data
  global.mockChartData = {
    scoreDistribution: {
      week: {
        labels: ['0-100', '101-200', '201-300', '301-400', '401+'],
        datasets: [{
          data: [10, 25, 35, 20, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      month: {
        labels: ['0-100', '101-200', '201-300', '301-400', '401+'],
        datasets: [{
          data: [5, 20, 40, 25, 10],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      }
    },
    scoreVsChests: {
      datasets: [
        {
          label: 'Standard Users',
          data: [
            { x: 10, y: 150 },
            { x: 15, y: 220 },
            { x: 20, y: 300 },
            { x: 25, y: 350 },
            { x: 30, y: 450 }
          ],
          backgroundColor: '#36A2EB'
        },
        {
          label: 'Premium Users',
          data: [
            { x: 10, y: 200 },
            { x: 15, y: 280 },
            { x: 20, y: 380 },
            { x: 25, y: 450 },
            { x: 30, y: 550 }
          ],
          backgroundColor: '#FF6384'
        }
      ]
    }
  };
}

/**
 * Sets up mock global functions for app functionality
 */
function setupMockFunctions() {
  // Chart-related functions
  global.createChart = jest.fn((containerId, config) => {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Create canvas element if it doesn't exist
    let canvas = container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
    }
    
    // Create and return mock chart instance
    const chart = new MockChart(canvas.getContext('2d'), config);
    chart.update = jest.fn();
    chart.getDatasetMeta = jest.fn(index => {
      return {
        hidden: null,
        data: global.mockChartData.scoreVsChests.datasets[index]?.data || []
      };
    });
    return chart;
  });
  
  global.updateChartData = jest.fn((chart, newData) => {
    if (!chart) return false;
    
    // Update the chart data
    chart.data = newData;
    chart.update();
    return true;
  });
  
  global.toggleChartDataVisibility = jest.fn((chart, dataIndex) => {
    if (!chart || !chart.data || !chart.data.datasets) return false;
    
    // Toggle visibility of dataset
    const meta = chart.getDatasetMeta(dataIndex);
    meta.hidden = meta.hidden === null ? !chart.data.datasets[dataIndex].hidden : null;
    chart.update();
    return true;
  });
  
  // Dashboard-related functions
  global.filterPlayersByName = jest.fn((nameFilter) => {
    if (!nameFilter) {
      global.displayData = [...global.samplePlayersData];
    } else {
      const lowerFilter = nameFilter.toLowerCase();
      global.displayData = global.samplePlayersData.filter(
        player => player.playerName.toLowerCase().includes(lowerFilter)
      );
    }
    
    // Update the table with filtered data
    renderRankingTable();
    
    return global.displayData.length;
  });
  
  global.sortData = jest.fn((field, direction = 'desc') => {
    if (!global.displayData) return;
    
    global.displayData.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (field === 'playerName') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Update the table with sorted data
    renderRankingTable();
  });
  
  global.renderRankingTable = jest.fn(() => {
    const tableBody = document.getElementById('ranking-table-body');
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (!tableBody) return;
    
    if (!global.displayData || global.displayData.length === 0) {
      tableBody.innerHTML = '';
      noResultsMessage.style.display = 'block';
      return;
    }
    
    noResultsMessage.style.display = 'none';
    
    let html = '';
    global.displayData.forEach((player, index) => {
      html += `
        <tr data-player-id="${player.playerId}">
          <td>${index + 1}</td>
          <td>${player.playerName}</td>
          <td>${player.totalScore}</td>
          <td>${player.chestsOpened}</td>
        </tr>
      `;
    });
    
    tableBody.innerHTML = html;
    
    // Add click event listeners to rows
    tableBody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        const playerId = row.getAttribute('data-player-id');
        showPlayerDetail(playerId);
      });
    });
  });
  
  // App navigation functions
  global.showView = jest.fn((viewId) => {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active-view');
    });
    
    // Show requested view
    const targetView = document.getElementById(viewId);
    if (!targetView) {
      console.error(`View with ID ${viewId} not found`);
      return false;
    }
    
    targetView.classList.add('active-view');
    
    // Update navigation state
    updateNavState(viewId);
    
    return true;
  });
  
  global.updateNavState = jest.fn((activeViewId) => {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-button').forEach(button => {
      button.classList.remove('active');
    });
    
    // Add active class to current view's nav button
    let activeNavId;
    switch (activeViewId) {
      case 'dashboard':
        activeNavId = 'dashboard-nav';
        break;
      case 'player-detail':
        activeNavId = 'player-detail-nav';
        break;
      case 'settings':
        activeNavId = 'settings-nav';
        break;
    }
    
    if (activeNavId) {
      const activeNavButton = document.getElementById(activeNavId);
      if (activeNavButton) {
        activeNavButton.classList.add('active');
      }
    }
  });
  
  global.showPlayerDetail = jest.fn((playerId) => {
    const player = global.samplePlayersData.find(p => p.playerId === playerId);
    if (!player) {
      console.error(`Player with ID ${playerId} not found`);
      return false;
    }
    
    renderPlayerDetail(player);
    showView('player-detail');
    return true;
  });
  
  global.renderPlayerDetail = jest.fn((player) => {
    // Find player rank
    const rank = global.samplePlayersData.findIndex(p => p.playerId === player.playerId) + 1;
    
    // Set player name and rank
    document.getElementById('player-name').textContent = player.playerName;
    document.getElementById('player-rank').textContent = `Rank: ${rank}`;
    
    // Set player stats
    document.getElementById('total-score-detail').textContent = player.totalScore;
    document.getElementById('chests-opened-detail').textContent = player.chestsOpened;
    document.getElementById('last-active-detail').textContent = new Date(player.lastActive).toLocaleDateString();
    
    // Show/hide premium badge
    const premiumBadge = document.getElementById('premium-badge');
    if (player.isPremium) {
      premiumBadge.style.display = 'inline-block';
    } else {
      premiumBadge.style.display = 'none';
    }
    
    // Render skills
    const skillsContainer = document.getElementById('skills-container');
    let skillsHtml = '';
    
    for (const [skill, value] of Object.entries(player.skills)) {
      skillsHtml += `
        <div class="skill-item">
          <div class="skill-name">${skill}</div>
          <div class="skill-bar">
            <div class="skill-progress" style="width: ${value}%"></div>
          </div>
          <div class="skill-value">${value}%</div>
        </div>
      `;
    }
    
    skillsContainer.innerHTML = skillsHtml;
  });
  
  // Initialize app function
  global.initializeApp = jest.fn(() => {
    // Set up event listeners
    
    // Navigation listeners
    document.querySelectorAll('.nav-button').forEach(button => {
      button.addEventListener('click', () => {
        const viewId = button.id.replace('-nav', '');
        showView(viewId);
      });
    });
    
    // Back button listener
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
      backButton.addEventListener('click', () => {
        showView('dashboard');
      });
    }
    
    // Filter input listener
    const filterInput = document.getElementById('player-filter');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => {
        filterPlayersByName(e.target.value);
      });
    }
    
    // Sort headers listeners
    document.getElementById('sort-player')?.addEventListener('click', () => {
      sortData('playerName');
    });
    
    document.getElementById('sort-score')?.addEventListener('click', () => {
      sortData('totalScore');
    });
    
    document.getElementById('sort-chests')?.addEventListener('click', () => {
      sortData('chestsOpened');
    });
    
    // Chart refresh listener
    document.getElementById('refresh-chart')?.addEventListener('click', () => {
      if (global.charts && global.charts.scoreDistribution) {
        updateChartData(global.charts.scoreDistribution, global.mockChartData.scoreDistribution.week);
      }
    });
    
    // Chart time range listener
    document.getElementById('chart-time-range')?.addEventListener('change', (e) => {
      if (global.charts && global.charts.scoreDistribution) {
        const timeRange = e.target.value;
        if (global.mockChartData.scoreDistribution[timeRange]) {
          updateChartData(global.charts.scoreDistribution, global.mockChartData.scoreDistribution[timeRange]);
        }
      }
    });
    
    // Toggle premium listener
    document.getElementById('toggle-premium')?.addEventListener('click', () => {
      if (global.charts && global.charts.scoreVsChests) {
        toggleChartDataVisibility(global.charts.scoreVsChests, 1);
      }
    });
    
    // Download button listener
    document.getElementById('download-data')?.addEventListener('click', () => {
      // Mock download functionality
      console.log('Downloading player data...');
    });
    
    // Initialize charts
    global.charts = {};
    
    const scoreDistributionContainer = document.getElementById('score-distribution-container');
    if (scoreDistributionContainer) {
      global.charts.scoreDistribution = createChart('score-distribution-container', {
        type: 'pie',
        data: global.mockChartData.scoreDistribution.week,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    const scoreVsChestsContainer = document.getElementById('score-vs-chests-container');
    if (scoreVsChestsContainer) {
      global.charts.scoreVsChests = createChart('score-vs-chests-container', {
        type: 'scatter',
        data: global.mockChartData.scoreVsChests,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Chests Opened'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Score'
              }
            }
          }
        }
      });
    }
    
    // Initialize with sample data
    global.displayData = [...global.samplePlayersData];
    renderRankingTable();
    
    // Calculate and display stats
    const playerCount = global.samplePlayersData.length;
    const totalScore = global.samplePlayersData.reduce((sum, player) => sum + player.totalScore, 0);
    const totalChests = global.samplePlayersData.reduce((sum, player) => sum + player.chestsOpened, 0);
    const avgScore = totalScore / playerCount;
    
    document.getElementById('player-count').textContent = playerCount;
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('total-chests').textContent = totalChests;
    document.getElementById('avg-score').textContent = Math.round(avgScore);
  });
}

/**
 * Set up everything for E2E tests
 */
function setupE2ETests() {
  setupStandardDOM();
  setupMockData();
  setupMockFunctions();
  
  // Initialize the app
  global.initializeApp();
}

module.exports = {
  setupE2ETests,
  setupStandardDOM,
  setupMockData,
  setupMockFunctions
}; 