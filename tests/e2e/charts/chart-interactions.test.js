/**
 * E2E Chart Interactions Tests
 * 
 * End-to-end tests for chart interactions and functionality.
 */

// Import the E2E test helper
const { setupE2ETests } = require('../../helpers/e2e-test-setup');

describe('Chart Interactions E2E Tests', () => {
  beforeEach(() => {
    // Set up DOM and mock functions for E2E tests
    setupE2ETests();
    
    // Clear mocks for each test
    jest.clearAllMocks();
  });
  
  describe('Chart Creation', () => {
    test('should create charts on initialization', () => {
      // Clear the createChart mock call history
      global.createChart.mockClear();
      
      // Create chart instances manually to test
      global.charts.scoreDistribution = global.createChart('score-distribution-container', {
        type: 'pie',
        data: global.mockChartData.scoreDistribution.week
      });
      
      global.charts.scoreVsChests = global.createChart('score-vs-chests-container', {
        type: 'scatter',
        data: global.mockChartData.scoreVsChests
      });
      
      // Verify charts were created
      expect(global.charts.scoreDistribution).toBeDefined();
      expect(global.charts.scoreVsChests).toBeDefined();
      
      // Verify createChart was called with correct container IDs
      expect(global.createChart).toHaveBeenCalledWith('score-distribution-container', expect.any(Object));
      expect(global.createChart).toHaveBeenCalledWith('score-vs-chests-container', expect.any(Object));
    });
  });
  
  describe('Chart Data Updates', () => {
    test('should update chart data when refreshing', () => {
      // Click refresh button
      document.getElementById('refresh-chart').click();
      
      // Verify updateChartData was called
      expect(global.updateChartData).toHaveBeenCalledWith(
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
      expect(global.updateChartData).toHaveBeenCalledWith(
        global.charts.scoreDistribution, 
        global.mockChartData.scoreDistribution.month
      );
      
      // Verify chart data was updated
      expect(global.charts.scoreDistribution.data).toBe(global.mockChartData.scoreDistribution.month);
    });
  });
  
  describe('Chart Interactivity', () => {
    test('should toggle dataset visibility', () => {
      // Setup spy on toggleChartDataVisibility
      const toggleSpy = jest.spyOn(global, 'toggleChartDataVisibility');
      
      // Click toggle premium button
      document.getElementById('toggle-premium').click();
      
      // Verify toggleChartDataVisibility was called
      expect(toggleSpy).toHaveBeenCalledWith(global.charts.scoreVsChests, 1);
      
      // Verify chart.update was called
      expect(global.charts.scoreVsChests.update).toHaveBeenCalled();
    });
  });
  
  describe('Error Handling', () => {
    test('should handle invalid chart container gracefully', () => {
      // Try to create chart with invalid container
      const result = global.createChart('non-existent-container', {});
      
      // Should return null for invalid container
      expect(result).toBeNull();
    });
    
    test('should handle chart update with invalid chart instance', () => {
      // Try to update null chart
      const result = global.updateChartData(null, {});
      
      // Should return false for failed update
      expect(result).toBe(false);
    });
    
    test('should handle toggle visibility with invalid chart instance', () => {
      // Try to toggle visibility on null chart
      const result = global.toggleChartDataVisibility(null, 0);
      
      // Should return false for failed toggle
      expect(result).toBe(false);
    });
  });
}); 