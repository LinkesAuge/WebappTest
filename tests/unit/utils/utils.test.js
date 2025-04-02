/**
 * utils.test.js
 * Unit tests for utils.js module
 */

// Mock document.createElement for triggerDownload
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

describe('Utils Module', () => {
  // Import the module before tests
  let utilsModule;

  beforeAll(async () => {
    // Dynamic import for ES modules
    utilsModule = await import('../../../js/utils.js');
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    document.body.innerHTML = ''; // Clear any DOM elements
  });

  describe('formatDateRange', () => {
    test('formats date range correctly for German locale', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const result = utilsModule.formatDateRange(startDate, endDate, 'de');
      expect(result).toMatch(/01\.01\.2023.*31\.01\.2023/);
    });

    test('formats date range correctly for English locale', () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const result = utilsModule.formatDateRange(startDate, endDate, 'en');
      expect(result).toMatch(/Jan(uary)? 1.*Jan(uary)? 31/);
    });

    test('handles invalid dates gracefully', () => {
      const result = utilsModule.formatDateRange('invalid', 'invalid', 'de');
      expect(result).toBe('Invalid Date Range');
    });
  });

  describe('triggerDownload', () => {
    beforeEach(() => {
      // Clear any existing links
      document.body.innerHTML = '';
      
      // Mock setTimeout to execute immediately
      jest.spyOn(global, 'setTimeout').mockImplementation((callback) => {
        callback();
        return 123; // Some timer ID
      });
    });
    
    afterEach(() => {
      // Restore setTimeout
      jest.restoreAllMocks();
    });
    
    test('creates and clicks a download link', () => {
      // Setup spies for DOM manipulation
      const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');
      
      // Call the function
      utilsModule.triggerDownload('test content', 'test.csv', 'text/csv');
      
      // Verify immediate behaviors
      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
      
      // We don't need to check the actual DOM element because we're mocking setTimeout
      // which immediately removes the link after clicking
    });

    test('uses default MIME type when not provided', () => {
      utilsModule.triggerDownload('test content', 'test.txt');
      // Default MIME type checking would happen in URL.createObjectURL
      expect(URL.createObjectURL).toHaveBeenCalled();
    });
  });

  describe('formatNumber', () => {
    test('formats numbers with German thousand separators by default', () => {
      expect(utilsModule.formatNumber(1000)).toBe('1.000');
      expect(utilsModule.formatNumber(1000.5)).toBe('1.000,5');
    });

    test('formats numbers with English thousand separators when specified', () => {
      expect(utilsModule.formatNumber(1000, 'en')).toBe('1,000');
      expect(utilsModule.formatNumber(1000.5, 'en')).toBe('1,000.5');
    });

    test('handles non-number inputs gracefully', () => {
      expect(utilsModule.formatNumber('not a number')).toBe('NaN');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = utilsModule.debounce(mockFn, 100);
      
      // Call the debounced function
      debouncedFn();
      
      // Function should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time
      jest.advanceTimersByTime(100);
      
      // Now the function should have been called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('only executes the last call', () => {
      const mockFn = jest.fn();
      const debouncedFn = utilsModule.debounce(mockFn, 100);
      
      debouncedFn(1);
      debouncedFn(2);
      debouncedFn(3);
      
      // Function should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();
      
      // Fast-forward time
      jest.advanceTimersByTime(100);
      
      // Should have been called with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(3);
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    test('limits function execution rate', () => {
      const mockFn = jest.fn();
      const throttledFn = utilsModule.throttle(mockFn, 100);
      
      // Call multiple times
      throttledFn(1);
      expect(mockFn).toHaveBeenCalledTimes(1); // First call executes immediately
      
      throttledFn(2);
      throttledFn(3);
      expect(mockFn).toHaveBeenCalledTimes(1); // Still just one call
      
      // Fast-forward time
      jest.advanceTimersByTime(100);
      
      // Should execute the most recent call after the limit
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith(3);
    });
  });

  describe('safeAddListener', () => {
    test('adds event listener to element', () => {
      // Setup a test element
      const element = document.createElement('button');
      document.body.appendChild(element);
      
      // Spy on addEventListener
      const addEventSpy = jest.spyOn(element, 'addEventListener');
      
      const handler = jest.fn();
      utilsModule.safeAddListener(element, 'click', handler);
      
      expect(addEventSpy).toHaveBeenCalledWith('click', handler, undefined);
    });

    test('handles null elements gracefully', () => {
      // Should not throw when element is null
      expect(() => {
        utilsModule.safeAddListener(null, 'click', jest.fn());
      }).not.toThrow();
    });

    test('passes options to addEventListener', () => {
      const element = document.createElement('button');
      document.body.appendChild(element);
      
      const addEventSpy = jest.spyOn(element, 'addEventListener');
      
      const options = { capture: true };
      utilsModule.safeAddListener(element, 'click', jest.fn(), options);
      
      expect(addEventSpy).toHaveBeenCalledWith('click', expect.any(Function), options);
    });
  });
}); 