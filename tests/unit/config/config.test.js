/**
 * config.test.js
 * Unit tests for config.js module
 */

// Mock document for getCssVariableValue testing
document.documentElement.style.setProperty('--primary', '#FF6384');

describe('Config Module', () => {
  // Import the module before tests
  let configModule;

  beforeAll(async () => {
    // Dynamic import for ES modules
    configModule = await import('../../../js/config.js');
  });

  test('exports CSV_PATH constant', () => {
    expect(configModule.CSV_PATH).toBeDefined();
    expect(typeof configModule.CSV_PATH).toBe('string');
  });

  test('exports RULES_PATH constant', () => {
    expect(configModule.RULES_PATH).toBeDefined();
    expect(typeof configModule.RULES_PATH).toBe('string');
  });

  test('exports DEFAULT_LANGUAGE constant', () => {
    expect(configModule.DEFAULT_LANGUAGE).toBeDefined();
    expect(typeof configModule.DEFAULT_LANGUAGE).toBe('string');
  });

  test('exports CHART_COLORS object with color arrays', () => {
    expect(configModule.CHART_COLORS).toBeDefined();
    expect(typeof configModule.CHART_COLORS).toBe('object');
    expect(Array.isArray(configModule.CHART_COLORS.primary)).toBe(true);
    expect(Array.isArray(configModule.CHART_COLORS.secondary)).toBe(true);
  });

  test('getChartBaseOptions returns valid chart configuration', () => {
    const pieOptions = configModule.getChartBaseOptions('pie');
    expect(pieOptions).toHaveProperty('chart');
    expect(pieOptions.chart.type).toBe('pie');
    expect(pieOptions).toHaveProperty('colors');
    expect(pieOptions).toHaveProperty('theme');

    const barOptions = configModule.getChartBaseOptions('bar');
    expect(barOptions).toHaveProperty('chart');
    expect(barOptions.chart.type).toBe('bar');
  });

  test('getCssVariableValue retrieves CSS variable value', () => {
    const primaryColor = configModule.getCssVariableValue('primary');
    expect(primaryColor).toBe('#FF6384');
  });

  test('getCssVariableValue returns null for non-existent variable', () => {
    const nonExistentVar = configModule.getCssVariableValue('non-existent');
    expect(nonExistentVar).toBeNull();
  });
}); 