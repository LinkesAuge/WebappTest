/**
 * Unit tests for chart instance creation and management
 */

import { 
  createChart,
  updateChart,
  destroyChart,
  destroyAllCharts,
  getChartInstance
} from '../../../js/charts/chartUtils.js';

// Create ApexCharts mock
class ApexChartsMock {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.rendered = false;
  }
  
  render() {
    this.rendered = true;
    return this;
  }
  
  updateOptions(newOptions, redrawPaths, animate, updateSyncedCharts) {
    this.options = { ...this.options, ...newOptions };
    return this;
  }
  
  updateSeries(newSeries, animate) {
    this.options.series = newSeries;
    return this;
  }
  
  destroy() {
    this.rendered = false;
    return this;
  }
}

// Set up global mocks
global.ApexCharts = ApexChartsMock;

describe('Chart Instance Management', () => {
  let mockContainer;
  
  beforeEach(() => {
    // Create mock container
    mockContainer = document.createElement('div');
    mockContainer.id = 'chart-container';
    document.body.appendChild(mockContainer);
    
    // Clear any instances from previous tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    console.log.mockRestore();
    console.error.mockRestore();
  });
  
  describe('createChart', () => {
    test('should create and return a chart instance', () => {
      const options = {
        chart: { type: 'bar' },
        series: [{ data: [10, 20, 30] }]
      };
      
      const chart = createChart('chart-container', options);
      
      expect(chart).toBeDefined();
      expect(chart instanceof ApexChartsMock).toBe(true);
      expect(chart.rendered).toBe(true);
      expect(chart.options).toEqual(options);
    });
    
    test('should handle container not found errors', () => {
      const options = { chart: { type: 'bar' } };
      
      const chart = createChart('non-existent-container', options);
      
      expect(chart).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
    
    test('should handle render errors', () => {
      const options = { chart: { type: 'bar' } };
      
      // Mock a render error
      ApexChartsMock.prototype.render = jest.fn(() => {
        throw new Error('Mock render error');
      });
      
      const chart = createChart('chart-container', options);
      
      expect(chart).toBeNull();
      expect(console.error).toHaveBeenCalled();
      
      // Restore original mock
      ApexChartsMock.prototype.render = jest.fn(function() {
        this.rendered = true;
        return this;
      });
    });
  });
  
  describe('getChartInstance', () => {
    test('should return the chart instance for a given key', () => {
      // Create a chart first
      const options = { chart: { type: 'bar' } };
      createChart('chart-container', options, 'testChart');
      
      // Get the instance
      const chart = getChartInstance('testChart');
      
      expect(chart).toBeDefined();
      expect(chart instanceof ApexChartsMock).toBe(true);
    });
    
    test('should return null for non-existent chart key', () => {
      const chart = getChartInstance('non-existent-chart');
      expect(chart).toBeNull();
    });
  });
  
  describe('updateChart', () => {
    test('should update chart options', () => {
      // Create a chart first
      const options = { 
        chart: { type: 'bar' },
        series: [{ data: [10, 20, 30] }]
      };
      createChart('chart-container', options, 'testChart');
      
      // Update the chart
      const newOptions = { 
        chart: { height: 300 },
        colors: ['#ff0000']
      };
      const updated = updateChart('testChart', newOptions);
      
      expect(updated).toBe(true);
      
      // Get the updated instance
      const chart = getChartInstance('testChart');
      expect(chart.options.chart.height).toBe(300);
      expect(chart.options.colors).toEqual(['#ff0000']);
      expect(chart.options.chart.type).toBe('bar'); // Original option still there
    });
    
    test('should update chart series', () => {
      // Create a chart first
      const options = { 
        chart: { type: 'bar' },
        series: [{ data: [10, 20, 30] }]
      };
      createChart('chart-container', options, 'testChart');
      
      // Update the series
      const newSeries = [{ data: [40, 50, 60] }];
      const updated = updateChart('testChart', null, newSeries);
      
      expect(updated).toBe(true);
      
      // Get the updated instance
      const chart = getChartInstance('testChart');
      expect(chart.options.series).toEqual(newSeries);
    });
    
    test('should handle errors when updating non-existent chart', () => {
      const updated = updateChart('non-existent-chart', { title: 'New Title' });
      expect(updated).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('destroyChart', () => {
    test('should destroy a chart instance', () => {
      // Create a chart first
      const options = { chart: { type: 'bar' } };
      createChart('chart-container', options, 'testChart');
      
      // Destroy the chart
      const destroyed = destroyChart('testChart');
      
      expect(destroyed).toBe(true);
      
      // Try to get the instance
      const chart = getChartInstance('testChart');
      expect(chart).toBeNull();
    });
    
    test('should handle errors when destroying non-existent chart', () => {
      const destroyed = destroyChart('non-existent-chart');
      expect(destroyed).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe('destroyAllCharts', () => {
    test('should destroy all chart instances', () => {
      // Create multiple charts
      const options1 = { chart: { type: 'bar' } };
      const options2 = { chart: { type: 'line' } };
      createChart('chart-container', options1, 'chart1');
      createChart('chart-container', options2, 'chart2');
      
      // Both charts should exist
      expect(getChartInstance('chart1')).not.toBeNull();
      expect(getChartInstance('chart2')).not.toBeNull();
      
      // Destroy all charts
      destroyAllCharts();
      
      // No charts should exist
      expect(getChartInstance('chart1')).toBeNull();
      expect(getChartInstance('chart2')).toBeNull();
    });
  });
}); 