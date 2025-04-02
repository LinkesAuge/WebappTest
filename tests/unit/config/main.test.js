/**
 * main.test.js
 * Unit tests for main.js module
 */

// Mock console methods
global.console = {
  log: jest.fn(),
  error: jest.fn()
};

describe('Main Module', () => {
  // Import the module before tests
  let mainModule;

  beforeAll(async () => {
    // Dynamic import for ES modules
    mainModule = await import('../../../js/main.js');
  });

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('exports init function', () => {
    expect(typeof mainModule.init).toBe('function');
  });

  test('exports isInitialized flag', () => {
    expect(typeof mainModule.isInitialized).toBe('boolean');
  });

  test('init function logs initialization messages', () => {
    // Call the init function
    mainModule.init();
    
    // Verify console.log was called with initialization messages
    expect(console.log).toHaveBeenCalledWith('Initializing modular application...');
    expect(console.log).toHaveBeenCalledWith('Loaded modules:');
    expect(console.log).toHaveBeenCalledWith('Application initialization completed successfully.');
  });

  test('init function handles errors gracefully', () => {
    // Make init throw an error
    console.log.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // This should not throw despite the error
    expect(() => mainModule.init()).not.toThrow();
    
    // Error should be logged
    expect(console.error).toHaveBeenCalledWith(
      'Error initializing application:',
      expect.any(Error)
    );
  });
}); 