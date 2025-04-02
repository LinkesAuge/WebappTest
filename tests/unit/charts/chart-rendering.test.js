/**
 * Unit tests for chart rendering
 * Tests the core chart rendering functions and their state integration
 */

import { 
  renderTopSourcesChart, 
  renderScoreDistributionChart, 
  renderScoreVsChestsChart,
  renderPlayerChart
} from '../../../js/charts/charts.js';

import { getState, subscribe } from '../../../js/state.js';
import { createChart, destroyChart } from '../../../js/charts/chartUtils.js';

// Mock dependencies
jest.mock('../../../js/state.js');
jest.mock('../../../js/charts/chartUtils.js');
jest.mock('../../../js/charts/chartConfig.js', () => ({
  getChartBaseOptions: jest.fn(() => ({
    chart: {
      type: 'bar',
      foreColor: 'white',
      toolbar: { show: true },
      animations: { enabled: true }
    },
    theme: { mode: 'dark' },
    grid: { borderColor: 'rgba(255,255,255,0.2)' },
    tooltip: { theme: 'dark' },
    colors: ['#amber', '#rose', '#sky', '#emerald'],
    xaxis: { labels: { style: { colors: 'white' } } },
    yaxis: { labels: { style: { colors: 'white' } } }
  })),
  getCssVariableValue: jest.fn(() => '210 40% 96.1%')
}));

// Create a mock for ApexCharts
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
  
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    return this;
  }
  
  updateSeries(newSeries) {
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

describe('Chart Rendering', () => {
  let mockContainer;
  let mockSubscribe = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock state management functions
    getState.mockImplementation((key) => {
      if (key === 'playerData') return [
        { id: 1, name: 'Player 1', score: 100, rank: 1, team: 'Team A', chests: 20, source1: 30, source2: 40 },
        { id: 2, name: 'Player 2', score: 80, rank: 2, team: 'Team B', chests: 15, source1: 20, source2: 30 },
        { id: 3, name: 'Player 3', score: 60, rank: 3, team: 'Team A', chests: 10, source1: 15, source2: 20 }
      ];
      if (key === 'displayData') return [
        { id: 1, name: 'Player 1', score: 100, rank: 1, team: 'Team A', chests: 20, source1: 30, source2: 40 },
        { id: 2, name: 'Player 2', score: 80, rank: 2, team: 'Team B', chests: 15, source1: 20, source2: 30 }
      ];
      return null;
    });
    
    subscribe.mockImplementation((key, callback) => {
      mockSubscribe(key, callback);
      return `sub_${key}`;
    });
    
    // Mock chart creation
    createChart.mockImplementation((containerId, options, instanceKey) => {
      return new ApexChartsMock(document.getElementById(containerId), options);
    });
    
    // Create mock container
    document.body.innerHTML = `
      <div id="top-sources-chart-container"></div>
      <div id="score-distribution-chart-container"></div>
      <div id="score-vs-chests-chart-container"></div>
      <div id="player-chart-container"></div>
    `;
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
  });
  
  describe('renderTopSourcesChart', () => {
    test('should render top sources chart with correct options', () => {
      const chart = renderTopSourcesChart('top-sources-chart-container');
      
      expect(createChart).toHaveBeenCalledWith(
        'top-sources-chart-container', 
        expect.objectContaining({ 
          chart: expect.objectContaining({ type: 'donut' }) 
        }),
        'topSources'
      );
      
      // Check for data subscription
      expect(subscribe).toHaveBeenCalledWith(
        'playerData', 
        expect.any(Function)
      );
    });
    
    test('should handle empty data gracefully', () => {
      // Mock empty data
      getState.mockReturnValueOnce([]);
      
      renderTopSourcesChart('top-sources-chart-container');
      
      // Should still try to create chart but with empty data
      expect(createChart).toHaveBeenCalled();
      
      // Options should contain empty series
      const options = createChart.mock.calls[0][1];
      expect(options.series.length).toBe(0);
    });
  });
  
  describe('renderScoreDistributionChart', () => {
    test('should render score distribution chart with correct options', () => {
      const chart = renderScoreDistributionChart('score-distribution-chart-container');
      
      expect(createChart).toHaveBeenCalledWith(
        'score-distribution-chart-container', 
        expect.objectContaining({ 
          chart: expect.objectContaining({ type: 'bar' }) 
        }),
        'scoreDistribution'
      );
      
      // Check for data subscription
      expect(subscribe).toHaveBeenCalledWith(
        'displayData', 
        expect.any(Function)
      );
    });
  });
  
  describe('renderScoreVsChestsChart', () => {
    test('should render score vs chests scatter chart with correct options', () => {
      const chart = renderScoreVsChestsChart('score-vs-chests-chart-container');
      
      expect(createChart).toHaveBeenCalledWith(
        'score-vs-chests-chart-container', 
        expect.objectContaining({ 
          chart: expect.objectContaining({ type: 'scatter' }) 
        }),
        'scoreVsChests'
      );
      
      // Options should contain proper axes titles
      const options = createChart.mock.calls[0][1];
      expect(options.xaxis.title.text).toBeTruthy();
      expect(options.yaxis.title.text).toBeTruthy();
    });
  });
  
  describe('renderPlayerChart', () => {
    test('should render player radar chart with correct options', () => {
      const playerData = {
        id: 1, 
        name: 'Player 1', 
        score: 100,
        skillTechnique: 80,
        skillCreativity: 70,
        skillPresentation: 60,
        skillEfficiency: 90
      };
      
      const chart = renderPlayerChart(playerData, 'player-chart-container');
      
      expect(createChart).toHaveBeenCalledWith(
        'player-chart-container', 
        expect.objectContaining({ 
          chart: expect.objectContaining({ type: 'radar' }) 
        }),
        'playerChart'
      );
      
      // Verify player data is used
      const options = createChart.mock.calls[0][1];
      expect(options.series[0].name).toBe('Player 1');
    });
    
    test('should handle player with insufficient skill data', () => {
      const playerData = {
        id: 1, 
        name: 'Player 1', 
        score: 100
        // No skill data
      };
      
      renderPlayerChart(playerData, 'player-chart-container');
      
      // Should attempt to create a chart with default/zero values
      expect(createChart).toHaveBeenCalled();
      
      // Series should contain default skill values
      const options = createChart.mock.calls[0][1];
      options.series[0].data.forEach(value => {
        expect(value).toBe(0);
      });
    });
  });
}); 