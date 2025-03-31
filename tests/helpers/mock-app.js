/**
 * Mock Application Functions
 * 
 * This file contains mock implementations of app functions
 * that are needed for testing.
 */

// Mock app state
const mockAppState = {
  currentView: 'dashboard',
  currentLanguage: 'en',
  selectedPlayer: null,
  isFiltering: false,
  filterValue: '',
  sortField: 'score',
  sortDirection: 'desc'
};

// Mock player data for tests
const mockPlayers = [
  {
    id: 1,
    name: 'Gordon Ramsay',
    totalScore: 2450,
    chestCount: 15,
    isPremium: true,
    skillScores: {
      technique: 95,
      creativity: 88,
      presentation: 92,
      efficiency: 85
    },
    sources: [
      { name: 'Daily Challenges', count: 25 },
      { name: 'Special Events', count: 12 },
      { name: 'Competitions', count: 8 }
    ]
  },
  {
    id: 2,
    name: 'Jamie Oliver',
    totalScore: 1850,
    chestCount: 10,
    isPremium: false,
    skillScores: {
      technique: 82,
      creativity: 90,
      presentation: 86,
      efficiency: 78
    },
    sources: [
      { name: 'Daily Challenges', count: 18 },
      { name: 'Special Events', count: 5 },
      { name: 'Competitions', count: 3 }
    ]
  },
  {
    id: 3,
    name: 'Nigella Lawson',
    totalScore: 2100,
    chestCount: 12,
    isPremium: true,
    skillScores: {
      technique: 88,
      creativity: 94,
      presentation: 95,
      efficiency: 80
    },
    sources: [
      { name: 'Daily Challenges', count: 20 },
      { name: 'Special Events', count: 8 },
      { name: 'Competitions', count: 6 }
    ]
  }
];

// Initialize the app
export function initializeApp() {
  // Reset app state
  Object.assign(mockAppState, {
    currentView: 'dashboard',
    currentLanguage: 'en',
    selectedPlayer: null,
    isFiltering: false,
    filterValue: '',
    sortField: 'score',
    sortDirection: 'desc'
  });
  
  // Set up global data
  global.displayData = {
    players: [...mockPlayers],
    statistics: {
      totalPlayers: mockPlayers.length,
      averageScore: mockPlayers.reduce((sum, p) => sum + p.totalScore, 0) / mockPlayers.length,
      totalChests: mockPlayers.reduce((sum, p) => sum + p.chestCount, 0),
      premiumCount: mockPlayers.filter(p => p.isPremium).length
    }
  };

  // Initialize DOM
  document.body.innerHTML = `
    <div id="app">
      <header>
        <h1 data-i18n="app.title">Chef Score Analytics</h1>
        <div id="language-selector">
          <button class="lang-btn active" data-lang="en">EN</button>
          <button class="lang-btn" data-lang="de">DE</button>
          <button class="lang-btn" data-lang="fr">FR</button>
          <button class="lang-btn" data-lang="es">ES</button>
        </div>
      </header>
      <div id="dashboard" class="view active-view">
        <div class="statistics-container">
          <div class="stat-box" id="total-players">
            <h3 data-i18n="dashboard.totalPlayers">Total Players</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-box" id="average-score">
            <h3 data-i18n="dashboard.averageScore">Average Score</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-box" id="total-chests">
            <h3 data-i18n="dashboard.totalChests">Total Chests</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-box" id="premium-count">
            <h3 data-i18n="dashboard.premiumPlayers">Premium Players</h3>
            <p class="stat-value">0</p>
          </div>
        </div>
        <div class="filter-container">
          <input type="text" id="player-filter" placeholder="Filter players..." data-i18n-placeholder="dashboard.filterPlaceholder">
          <button id="clear-filter" data-i18n="dashboard.clearFilter">Clear</button>
        </div>
        <table id="player-table">
          <thead>
            <tr>
              <th data-i18n="dashboard.rank">Rank</th>
              <th data-i18n="dashboard.player" data-sort="name">Player</th>
              <th data-i18n="dashboard.score" data-sort="score">Score</th>
              <th data-i18n="dashboard.chests" data-sort="chests">Chests</th>
              <th data-i18n="dashboard.premium">Premium</th>
              <th data-i18n="dashboard.actions">Actions</th>
            </tr>
          </thead>
          <tbody id="player-table-body"></tbody>
        </table>
        <div id="no-results" class="hidden" data-i18n="dashboard.noResults">No players found matching your filter.</div>
      </div>
      <div id="player-detail" class="view">
        <button id="back-to-dashboard" data-i18n="playerDetail.back">← Back to Dashboard</button>
        <div id="player-info">
          <h2 id="player-name"></h2>
          <div class="player-stats">
            <div class="stat">
              <span data-i18n="playerDetail.totalScore">Total Score:</span>
              <span id="player-score"></span>
            </div>
            <div class="stat">
              <span data-i18n="playerDetail.chests">Chests:</span>
              <span id="player-chests"></span>
            </div>
            <div class="stat">
              <span data-i18n="playerDetail.premium">Premium:</span>
              <span id="player-premium"></span>
            </div>
          </div>
          <div id="player-premium-badge" class="premium-badge hidden">
            <span data-i18n="playerDetail.premiumBadge">PREMIUM</span>
          </div>
          <div id="player-chart-container"></div>
          <button id="download-player-data" data-i18n="playerDetail.download">Download Player Data</button>
        </div>
      </div>
      <div id="charts" class="view">
        <div class="chart-container">
          <h2 data-i18n="charts.topSources">Top Score Sources</h2>
          <div id="top-sources-chart-container"></div>
        </div>
        <div class="chart-container">
          <h2 data-i18n="charts.scoreDistribution">Score Distribution</h2>
          <div id="score-distribution-chart-container"></div>
        </div>
        <div class="chart-container">
          <h2 data-i18n="charts.scoreVsChests">Score vs Chests</h2>
          <div id="score-vs-chests-container"></div>
        </div>
      </div>
    </div>
  `;
}

// Render the dashboard
export function renderDashboard() {
  // Show dashboard view
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
  document.getElementById('dashboard').classList.add('active-view');
  
  // Update statistics
  document.querySelector('#total-players .stat-value').textContent = global.displayData.statistics.totalPlayers;
  document.querySelector('#average-score .stat-value').textContent = Math.round(global.displayData.statistics.averageScore);
  document.querySelector('#total-chests .stat-value').textContent = global.displayData.statistics.totalChests;
  document.querySelector('#premium-count .stat-value').textContent = global.displayData.statistics.premiumCount;
  
  // Render players table
  renderPlayersTable();

  // Attach event listeners
  attachDashboardEventListeners();
}

// Render players table based on current filters and sort
export function renderPlayersTable() {
  const tableBody = document.getElementById('player-table-body');
  tableBody.innerHTML = '';
  
  const { players } = global.displayData;
  const filteredPlayers = filterPlayers(players, mockAppState.filterValue);
  
  // Show/hide no results message
  const noResultsElement = document.getElementById('no-results');
  if (filteredPlayers.length === 0 && mockAppState.isFiltering) {
    noResultsElement.classList.remove('hidden');
    return;
  } else {
    noResultsElement.classList.add('hidden');
  }
  
  // Sort players
  const sortedPlayers = sortPlayers(filteredPlayers, mockAppState.sortField, mockAppState.sortDirection);
  
  // Render rows
  sortedPlayers.forEach((player, index) => {
    const row = document.createElement('tr');
    row.dataset.playerId = player.id;
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.totalScore}</td>
      <td>${player.chestCount}</td>
      <td>${player.isPremium ? '★' : '–'}</td>
      <td>
        <button class="view-player-btn" data-i18n="dashboard.viewDetails">View</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Reattach view buttons event listeners
  document.querySelectorAll('.view-player-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const playerId = parseInt(e.target.closest('tr').dataset.playerId);
      const player = global.displayData.players.find(p => p.id === playerId);
      showPlayerDetail(player);
    });
  });
}

// Show player detail
export function showPlayerDetail(player) {
  // Set selected player in app state
  mockAppState.selectedPlayer = player;
  
  // Switch to player detail view
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
  document.getElementById('player-detail').classList.add('active-view');
  
  // Populate player info
  document.getElementById('player-name').textContent = player.name;
  document.getElementById('player-score').textContent = player.totalScore;
  document.getElementById('player-chests').textContent = player.chestCount;
  document.getElementById('player-premium').textContent = player.isPremium ? 'Yes' : 'No';
  
  // Show/hide premium badge
  const premiumBadge = document.getElementById('player-premium-badge');
  if (player.isPremium) {
    premiumBadge.classList.remove('hidden');
  } else {
    premiumBadge.classList.add('hidden');
  }
  
  // Render player chart (mock implementation)
  renderPlayerChart(player, 'player-chart-container');
}

// Filter players based on search string
export function filterPlayers(players, filterValue) {
  if (!filterValue) return players;
  
  const lowerFilter = filterValue.toLowerCase();
  return players.filter(player => 
    player.name.toLowerCase().includes(lowerFilter)
  );
}

// Sort players based on field and direction
export function sortPlayers(players, field, direction) {
  return [...players].sort((a, b) => {
    let comparison = 0;
    
    if (field === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (field === 'score') {
      comparison = a.totalScore - b.totalScore;
    } else if (field === 'chests') {
      comparison = a.chestCount - b.chestCount;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
}

// Attach dashboard event listeners
export function attachDashboardEventListeners() {
  // Filter input
  const filterInput = document.getElementById('player-filter');
  filterInput.addEventListener('input', (e) => {
    mockAppState.filterValue = e.target.value;
    mockAppState.isFiltering = e.target.value !== '';
    renderPlayersTable();
  });
  
  // Clear filter button
  const clearFilterBtn = document.getElementById('clear-filter');
  clearFilterBtn.addEventListener('click', () => {
    document.getElementById('player-filter').value = '';
    mockAppState.filterValue = '';
    mockAppState.isFiltering = false;
    renderPlayersTable();
  });
  
  // Table header sort
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const sortField = th.dataset.sort;
      
      if (mockAppState.sortField === sortField) {
        // Toggle direction if same field
        mockAppState.sortDirection = mockAppState.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Set new field and default to descending
        mockAppState.sortField = sortField;
        mockAppState.sortDirection = 'desc';
      }
      
      renderPlayersTable();
    });
  });
  
  // Back button in player detail
  document.getElementById('back-to-dashboard').addEventListener('click', () => {
    mockAppState.selectedPlayer = null;
    renderDashboard();
  });
  
  // Download button in player detail
  document.getElementById('download-player-data').addEventListener('click', () => {
    if (mockAppState.selectedPlayer) {
      // Mock download functionality
      console.log(`Downloading data for player: ${mockAppState.selectedPlayer.name}`);
    }
  });
}

// Mock render chart function
export function renderPlayerChart(player, containerId) {
  // Just a mock - the actual chart rendering is tested separately
  return { 
    type: 'radar',
    data: {
      labels: ['Technique', 'Creativity', 'Presentation', 'Efficiency'],
      datasets: [{
        label: player.name,
        data: [
          player.skillScores?.technique || 0,
          player.skillScores?.creativity || 0,
          player.skillScores?.presentation || 0,
          player.skillScores?.efficiency || 0
        ]
      }]
    }
  };
}

// Mock internationalization functions
const translations = {
  en: {
    'app.title': 'Chef Score Analytics',
    'dashboard.totalPlayers': 'Total Players',
    'dashboard.averageScore': 'Average Score',
    'dashboard.totalChests': 'Total Chests',
    'dashboard.premiumPlayers': 'Premium Players',
    'dashboard.filterPlaceholder': 'Filter players...',
    'dashboard.clearFilter': 'Clear',
    'dashboard.rank': 'Rank',
    'dashboard.player': 'Player',
    'dashboard.score': 'Score',
    'dashboard.chests': 'Chests',
    'dashboard.premium': 'Premium',
    'dashboard.actions': 'Actions',
    'dashboard.viewDetails': 'View',
    'dashboard.noResults': 'No players found matching your filter.',
    'playerDetail.back': '← Back to Dashboard',
    'playerDetail.totalScore': 'Total Score:',
    'playerDetail.chests': 'Chests:',
    'playerDetail.premium': 'Premium:',
    'playerDetail.premiumBadge': 'PREMIUM',
    'playerDetail.download': 'Download Player Data',
    'charts.topSources': 'Top Score Sources',
    'charts.scoreDistribution': 'Score Distribution',
    'charts.scoreVsChests': 'Score vs Chests'
  },
  de: {
    'app.title': 'Analyse des Scores de Chef',
    'dashboard.totalPlayers': 'Gesamtzahl der Spieler',
    'dashboard.averageScore': 'Durchschnittliche Punktzahl',
    'dashboard.totalChests': 'Gesamtzahl der Truhen',
    'dashboard.premiumPlayers': 'Premium-Spieler',
    'dashboard.filterPlaceholder': 'Spieler filtern...',
    'dashboard.clearFilter': 'Löschen',
    'dashboard.rank': 'Rang',
    'dashboard.player': 'Spieler',
    'dashboard.score': 'Punktzahl',
    'dashboard.chests': 'Truhen',
    'dashboard.premium': 'Premium',
    'dashboard.actions': 'Aktionen',
    'dashboard.viewDetails': 'Ansehen',
    'dashboard.noResults': 'Keine Spieler entsprechen Ihrem Filter.',
    'playerDetail.back': '← Zurück zur Übersicht',
    'playerDetail.totalScore': 'Gesamtpunktzahl:',
    'playerDetail.chests': 'Truhen:',
    'playerDetail.premium': 'Premium:',
    'playerDetail.premiumBadge': 'PREMIUM',
    'playerDetail.download': 'Spielerdaten herunterladen',
    'charts.topSources': 'Top-Punktequellen',
    'charts.scoreDistribution': 'Punkteverteilung',
    'charts.scoreVsChests': 'Punkte vs. Truhen'
  },
  fr: {
    'app.title': 'Analyse des Scores de Chef',
    // Add more translations as needed
  },
  es: {
    'app.title': 'Análisis de Puntuación del Chef',
    // Add more translations as needed
  }
};

// Initialize language
export function initializeLanguage() {
  // Check localStorage for saved preference
  const savedLanguage = localStorage.getItem('tbAnalyzerLanguage');
  if (savedLanguage && translations[savedLanguage]) {
    changeLanguage(savedLanguage);
  } else {
    changeLanguage('en'); // Default to English
  }
}

// Change language
export function changeLanguage(langCode) {
  if (!translations[langCode]) {
    console.error(`Language not supported: ${langCode}`);
    langCode = 'en'; // Fallback to English
  }
  
  // Update app state
  mockAppState.currentLanguage = langCode;
  
  // Save preference to localStorage
  localStorage.setItem('tbAnalyzerLanguage', langCode);
  
  // Update UI text
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[langCode][key]) {
      element.textContent = translations[langCode][key];
    } else if (translations['en'][key]) {
      // Fallback to English if translation is missing
      element.textContent = translations['en'][key];
    }
  });
  
  // Update placeholder texts
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (translations[langCode][key]) {
      element.placeholder = translations[langCode][key];
    } else if (translations['en'][key]) {
      // Fallback to English if translation is missing
      element.placeholder = translations['en'][key];
    }
  });
  
  // Update document title
  if (translations[langCode]['app.title']) {
    document.title = translations[langCode]['app.title'];
  }
  
  // Update active state of language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === langCode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Export the app state and other helpers for testing
export {
  mockAppState,
  mockPlayers,
  translations
}; 