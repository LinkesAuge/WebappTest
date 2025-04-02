/**
 * Unit tests for chart configuration module
 */

import { getChartBaseOptions, getCssVariableValue } from '../../../js/charts/chartConfig.js';

// Mock document.documentElement and getComputedStyle to return CSS variables
jest.mock('../../../js/utils.js', () => ({
  isValidSelector: jest.fn(() => true),
}));

describe('Chart Configuration', () => {
  // Setup CSS variable mocks
  beforeEach(() => {
    // Mock getComputedStyle to return fake CSS variables
    window.getComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: jest.fn((prop) => {
        // Return mock HSL values for different CSS variables
        if (prop === '--primary') return '40.7 92.9% 56.1%';
        if (prop === '--foreground') return '210 40% 96.1%';
        if (prop === '--secondary') return '346.8 77.2% 49.8%';
        if (prop === '--border') return '35.1 70% 45%';
        if (prop === '--background') return '222.2 84% 4.9%';
        return '';
      }),
    });
  });

  describe('getCssVariableValue', () => {
    test('should return CSS variable value when variable exists', () => {
      const result = getCssVariableValue('--primary');
      expect(result).toBe('40.7 92.9% 56.1%');
    });

    test('should return default value when variable does not exist', () => {
      const result = getCssVariableValue('--non-existent');
      expect(result).toBe('0 0% 100%'); // Default fallback (white)
    });

    test('should handle getComputedStyle errors gracefully', () => {
      // Mock getComputedStyle to throw an error
      window.getComputedStyle.mockImplementationOnce(() => {
        throw new Error('Mock error');
      });

      const result = getCssVariableValue('--primary');
      expect(result).toBe('40.7 92.9% 56.1%'); // Should return fallback for --primary
    });
  });

  describe('getChartBaseOptions', () => {
    test('should return valid chart base options', () => {
      const options = getChartBaseOptions();
      
      // Test structure
      expect(options).toBeDefined();
      expect(typeof options).toBe('object');
      
      // Test main sections
      expect(options.chart).toBeDefined();
      expect(options.theme).toBeDefined();
      expect(options.grid).toBeDefined();
      expect(options.tooltip).toBeDefined();
      expect(options.colors).toBeDefined();
      expect(options.xaxis).toBeDefined();
      expect(options.yaxis).toBeDefined();
      
      // Test specific properties
      expect(options.chart.foreColor).toBe('hsl(210 40% 96.1%)');
      expect(options.chart.toolbar.show).toBe(true);
      expect(options.chart.animations.enabled).toBe(true);
      expect(options.theme.mode).toBe('dark');
      expect(options.colors[0]).toBe('hsl(40.7 92.9% 56.1%)'); // Primary color
      expect(options.colors[1]).toBe('hsl(346.8 77.2% 49.8%)'); // Secondary color
    });

    test('should handle errors gracefully', () => {
      // Mock getCssVariableValue to throw an error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Force an error in the function
      window.getComputedStyle.mockImplementationOnce(() => {
        throw new Error('Mock error');
      });

      // Function should still return a valid object with defaults
      const options = getChartBaseOptions();
      expect(options).toBeDefined();
      expect(typeof options).toBe('object');
      expect(options.chart).toBeDefined();
      expect(options.theme).toBeDefined();
      
      // Restore console.error
      console.error.mockRestore();
    });
  });
}); 