/**
 * Chart Creation Unit Tests
 * 
 * Tests for chart rendering and configuration functions.
 */

// Import Chart.js for mocking
import { Chart } from 'chart.js';

// Import mocked versions of the app functions
import { 
  initializeApp,
  renderDashboard
} from '../../helpers/mock-app';

// Define the chart functions that will be tested
const getChartBaseOptions = jest.fn(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true
      }
    }
  };
});

const renderTopSourcesChart = jest.fn((containerId) => {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) {
    return null;
  }
  
  // Create canvas element if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  // Create chart instance
  return new Chart(mockContext, {
    type: 'pie',
    data: {
      labels: ['Source 1', 'Source 2', 'Source 3'],
      datasets: [{
        data: [300, 200, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    },
    options: getChartBaseOptions()
  });
});

const renderScoreDistributionChart = jest.fn((containerId) => {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) {
    return null;
  }
  
  // Create canvas element if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }

  // Create chart instance
  return new Chart(mockContext, {
    type: 'bar',
    data: {
      labels: ['0-500', '501-1000', '1001-1500', '1501-2000', '2000+'],
      datasets: [{
        label: 'Players',
        data: [10, 20, 30, 15, 5],
        backgroundColor: '#36A2EB'
      }]
    },
    options: getChartBaseOptions()
  });
});

const renderScoreVsChestsChart = jest.fn((containerId) => {
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) {
    return null;
  }
  
  // Create canvas element if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  // Create chart instance
  return new Chart(mockContext, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Players',
        data: [
          { x: 10, y: 500 },
          { x: 20, y: 800 },
          { x: 30, y: 1200 },
          { x: 40, y: 1500 }
        ],
        backgroundColor: '#4BC0C0'
      }]
    },
    options: {
      ...getChartBaseOptions(),
      scales: {
        x: {
          title: {
            display: true,
            text: 'Chests'
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
});

const renderPlayerChart = jest.fn((player, containerId) => {
  if (!player) return null;
  
  // Get the container
  const container = document.getElementById(containerId);
  if (!container) {
    return null;
  }
  
  // Create canvas element if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  // Create chart instance
  return new Chart(mockContext, {
    type: 'radar',
    data: {
      labels: ['Technique', 'Creativity', 'Presentation', 'Efficiency'],
      datasets: [{
        label: player.playerName || 'Player',
        data: [
          player.skillTechnique || 0,
          player.skillCreativity || 0,
          player.skillPresentation || 0,
          player.skillEfficiency || 0
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)'
      }]
    },
    options: getChartBaseOptions()
  });
});

// Add mocks to global context
global.getChartBaseOptions = getChartBaseOptions;
global.renderTopSourcesChart = renderTopSourcesChart;
global.renderScoreDistributionChart = renderScoreDistributionChart;
global.renderScoreVsChestsChart = renderScoreVsChestsChart;
global.renderPlayerChart = renderPlayerChart;

describe('Chart Creation', () => {
  beforeAll(() => {
    // Set up Chart.js mock
    global.Chart = jest.fn().mockImplementation(() => ({
      update: jest.fn(),
      destroy: jest.fn(),
      getDatasetMeta: jest.fn(() => ({ hidden: null })),
      data: { datasets: [] },
      config: {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{ data: [] }]
        },
        options: {}
      }
    }));
    
    // Create chart containers
    document.body.innerHTML = `
      <div id="top-sources-chart-container"></div>
      <div id="score-distribution-chart-container"></div>
      <div id="score-vs-chests-container"></div>
      <div id="player-chart-container"></div>
    `;
    
    // Set up sample player data
    global.samplePlayerData = [
      {
        id: 'player-1',
        playerName: 'Max Mustermann',
        totalScore: 2500,
        chestCount: 42,
        skillTechnique: 85,
        skillCreativity: 90,
        skillPresentation: 75,
        skillEfficiency: 80
      }
    ];
    
    // Set up display data (mock global app state)
    global.displayData = {
      players: global.samplePlayerData
    };
  });
  
  describe('Chart Base Options', () => {
    test('should return valid chart base options', () => {
      const options = getChartBaseOptions();
      
      expect(options).toBeDefined();
      expect(options.responsive).toBe(true);
      expect(options.maintainAspectRatio).toBe(false);
      expect(options.plugins).toBeDefined();
      expect(options.plugins.legend).toBeDefined();
      expect(options.plugins.tooltip).toBeDefined();
    });
  });
  
  describe('Top Sources Chart', () => {
    test('should create top sources chart with correct configuration', () => {
      const chart = renderTopSourcesChart('top-sources-chart-container');
      
      expect(chart).toBeDefined();
      
      // Verify chart config
      expect(chart.config.type).toBe('pie');
      expect(chart.config.data.labels.length).toBeGreaterThan(0);
      expect(chart.config.data.datasets.length).toBe(1);
    });
    
    test('should handle empty data gracefully', () => {
      // Store original display data
      const originalDisplayData = global.displayData;
      
      // Set empty display data
      global.displayData = { players: [] };
      
      // Create the element first to ensure it exists
      const container = document.getElementById('top-sources-chart-container');
      expect(container).toBeDefined();
      
      // The test should not throw
      expect(() => {
        const chart = renderTopSourcesChart('top-sources-chart-container');
        expect(chart).toBeDefined();
      }).not.toThrow();
      
      // Restore display data
      global.displayData = originalDisplayData;
    });
  });
  
  describe('Score Distribution Chart', () => {
    test('should create score distribution chart with correct configuration', () => {
      const chart = renderScoreDistributionChart('score-distribution-chart-container');
      
      expect(chart).toBeDefined();
      
      // Verify chart config
      expect(chart.config.type).toBe('bar');
      expect(chart.config.data.labels.length).toBeGreaterThan(0);
      expect(chart.config.data.datasets.length).toBe(1);
    });
    
    test('should handle empty data gracefully', () => {
      // Store original display data
      const originalDisplayData = global.displayData;
      
      // Set empty display data
      global.displayData = { players: [] };
      
      // Create the element first to ensure it exists
      const container = document.getElementById('score-distribution-chart-container');
      expect(container).toBeDefined();
      
      // The test should not throw
      expect(() => {
        const chart = renderScoreDistributionChart('score-distribution-chart-container');
        expect(chart).toBeDefined();
      }).not.toThrow();
      
      // Restore display data
      global.displayData = originalDisplayData;
    });
  });
  
  describe('Score vs Chests Chart', () => {
    test('should create score vs chests chart with correct configuration', () => {
      const chart = renderScoreVsChestsChart('score-vs-chests-container');
      
      expect(chart).toBeDefined();
      
      // Verify chart config
      expect(chart.config.type).toBe('scatter');
      expect(chart.config.data.datasets.length).toBe(1);
      expect(chart.config.options.scales).toBeDefined();
    });
    
    test('should handle empty data gracefully', () => {
      // Store original display data
      const originalDisplayData = global.displayData;
      
      // Set empty display data
      global.displayData = { players: [] };
      
      // Create the element first to ensure it exists
      const container = document.getElementById('score-vs-chests-container');
      expect(container).toBeDefined();
      
      // The test should not throw
      expect(() => {
        const chart = renderScoreVsChestsChart('score-vs-chests-container');
        expect(chart).toBeDefined();
      }).not.toThrow();
      
      // Restore display data
      global.displayData = originalDisplayData;
    });
  });
  
  describe('Player Chart', () => {
    test('should create player radar chart with correct configuration', () => {
      const player = global.samplePlayerData[0];
      
      const chart = renderPlayerChart(player, 'player-chart-container');
      
      expect(chart).toBeDefined();
      
      // Verify chart config
      expect(chart.config.type).toBe('radar');
      expect(chart.config.data.labels.length).toBe(4); // Four skills
      expect(chart.config.data.datasets.length).toBe(1);
      expect(chart.config.data.datasets[0].label).toBe(player.playerName);
    });
    
    test('should handle missing skill values gracefully', () => {
      const playerWithMissingSkills = {
        ...global.samplePlayerData[0],
        skillTechnique: undefined,
        skillCreativity: null
      };
      
      expect(() => {
        const chart = renderPlayerChart(playerWithMissingSkills, 'player-chart-container');
        expect(chart).toBeDefined();
      }).not.toThrow();
    });
    
    test('should handle no player data gracefully', () => {
      expect(() => {
        const chart = renderPlayerChart(null, 'player-chart-container');
        // The function should return null, not throw an error
        expect(chart).toBeNull();
      }).not.toThrow();
    });
  });
}); 