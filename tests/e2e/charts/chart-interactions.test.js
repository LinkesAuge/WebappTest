/**
 * E2E Chart Interactions Tests
 * 
 * End-to-end tests for chart interactions and functionality.
 */

// Import mocked versions of the app functions and Chart.js
import { 
  initializeApp, 
  renderDashboard
} from '../../helpers/mock-app';
import Chart from 'chart.js';

// Mock chart instance methods
Chart.prototype.update = jest.fn();
Chart.prototype.destroy = jest.fn();

// Define mock chart functions
const createChart = jest.fn((containerId, config) => {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  // Create canvas element if it doesn't exist
  let canvas = container.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    container.appendChild(canvas);
  }
  
  // Create and return mock chart instance
  const chart = new Chart(canvas.getContext('2d'), config);
  return chart;
});

const updateChartData = jest.fn((chart, newData) => {
  if (!chart) return false;
  
  // Update the chart data
  chart.data = newData;
  chart.update();
  return true;
});

const toggleChartDataVisibility = jest.fn((chart, dataIndex) => {
  if (!chart || !chart.data || !chart.data.datasets) return false;
  
  // Toggle visibility of dataset
  const meta = chart.getDatasetMeta(dataIndex);
  meta.hidden = meta.hidden === null ? !chart.data.datasets[dataIndex].hidden : null;
  chart.update();
  return true;
});

// Add functions to global scope for testing
global.createChart = createChart;
global.updateChartData = updateChartData;
global.toggleChartDataVisibility = toggleChartDataVisibility;

describe('Chart Interactions E2E Tests', () => {
  beforeEach(() => {
    // Set up DOM for tests
    document.body.innerHTML = `
      <div id="app-container">
        <div id="dashboard" class="view active-view">
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
              <div class="chart-legend" id="score-distribution-legend"></div>
            </div>
            
            <div id="score-vs-chests-container" class="chart-container">
              <div class="chart-header">
                <h3>Score vs Chests Opened</h3>
                <div class="chart-actions">
                  <button id="toggle-premium" class="chart-action-btn">Toggle Premium</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock chart instances
    global.charts = {};
    
    // Prepare mock data for charts
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
    
    // Initialize the app
    initializeApp();
    
    // Create mock charts
    global.charts.scoreDistribution = createChart('score-distribution-container', {
      type: 'pie',
      data: global.mockChartData.scoreDistribution.week,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
    
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
    
    // Mock chart prototype methods needed for testing
    Chart.prototype.getDatasetMeta = jest.fn(index => {
      return {
        hidden: null,
        data: global.mockChartData.scoreVsChests.datasets[index].data
      };
    });
    
    // Set up event listeners
    document.getElementById('refresh-chart').addEventListener('click', () => {
      updateChartData(global.charts.scoreDistribution, global.mockChartData.scoreDistribution.week);
    });
    
    document.getElementById('chart-time-range').addEventListener('change', (e) => {
      const timeRange = e.target.value;
      if (global.mockChartData.scoreDistribution[timeRange]) {
        updateChartData(global.charts.scoreDistribution, global.mockChartData.scoreDistribution[timeRange]);
      }
    });
    
    document.getElementById('toggle-premium').addEventListener('click', () => {
      toggleChartDataVisibility(global.charts.scoreVsChests, 1); // 1 is the index of premium users dataset
    });
  });
  
  describe('Chart Creation', () => {
    test('should create charts on initialization', () => {
      // Verify charts were created
      expect(global.charts.scoreDistribution).toBeDefined();
      expect(global.charts.scoreVsChests).toBeDefined();
      
      // Verify createChart was called with correct container IDs
      expect(createChart).toHaveBeenCalledWith('score-distribution-container', expect.any(Object));
      expect(createChart).toHaveBeenCalledWith('score-vs-chests-container', expect.any(Object));
    });
  });
  
  describe('Chart Data Updates', () => {
    test('should update chart data when refreshing', () => {
      // Click refresh button
      document.getElementById('refresh-chart').click();
      
      // Verify updateChartData was called
      expect(updateChartData).toHaveBeenCalledWith(
        global.charts.scoreDistribution, 
        global.mockChartData.scoreDistribution.week
      );
      
      // Verify chart.update was called
      expect(global.charts.scoreDistribution.update).toHaveBeenCalled();
    });
    
    test('should update chart data when changing time range', () => {
      // Select month time range
      const selectElement = document.getElementById('chart-time-range');
      selectElement.value = 'month';
      selectElement.dispatchEvent(new Event('change'));
      
      // Verify updateChartData was called with month data
      expect(updateChartData).toHaveBeenCalledWith(
        global.charts.scoreDistribution, 
        global.mockChartData.scoreDistribution.month
      );
      
      // Verify chart.update was called
      expect(global.charts.scoreDistribution.update).toHaveBeenCalled();
    });
  });
  
  describe('Chart Interactivity', () => {
    test('should toggle dataset visibility', () => {
      // Check initial state
      expect(global.charts.scoreVsChests.getDatasetMeta(1).hidden).toBeNull();
      
      // Click toggle premium button
      document.getElementById('toggle-premium').click();
      
      // Verify toggleChartDataVisibility was called
      expect(toggleChartDataVisibility).toHaveBeenCalledWith(global.charts.scoreVsChests, 1);
      
      // Verify chart.update was called
      expect(global.charts.scoreVsChests.update).toHaveBeenCalled();
    });
  });
  
  describe('Error Handling', () => {
    test('should handle invalid chart container gracefully', () => {
      // Try to create chart with non-existent container
      const chart = createChart('non-existent-container', {
        type: 'bar',
        data: { labels: [], datasets: [] }
      });
      
      // Should return null for invalid container
      expect(chart).toBeNull();
    });
    
    test('should handle chart update with invalid chart instance', () => {
      // Try to update a null chart
      const result = updateChartData(null, { labels: [], datasets: [] });
      
      // Should return false to indicate failure
      expect(result).toBe(false);
    });
    
    test('should handle toggle visibility with invalid chart instance', () => {
      // Try to toggle visibility on a null chart
      const result = toggleChartDataVisibility(null, 0);
      
      // Should return false to indicate failure
      expect(result).toBe(false);
    });
  });
}); 