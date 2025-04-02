/**
 * test-fix-state.js
 * 
 * Test script to verify the fix for the isInitialized property in state.js
 */

// Import the state module directly (for testing)
import * as state from '../js/state.js';

// Mock the console methods to make the output easier to read
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.log = function(message) {
    originalConsoleLog(`[LOG] ${message}`);
};

console.warn = function(message) {
    originalConsoleWarn(`[WARN] ${message}`);
};

console.error = function(message) {
    originalConsoleError(`[ERROR] ${message}`);
};

/**
 * Run tests to check if the isInitialized property can be modified
 */
function runTest() {
    console.log('Starting state.js isInitialized test...');

    try {
        // Test 1: Check initial value
        console.log(`Initial isInitialized value: ${state.isInitialized}`);
        if (state.isInitialized !== false) {
            console.error('Test failed: isInitialized should be initially false');
            return;
        }
        console.log('✅ Test 1 passed: isInitialized is initially false');

        // Test 2: Try to modify the property directly
        try {
            state.isInitialized = true;
            console.log(`After modification: ${state.isInitialized}`);
            
            if (state.isInitialized !== true) {
                console.error('Test failed: isInitialized could not be modified');
                return;
            }
            console.log('✅ Test 2 passed: isInitialized can be modified');
        } catch (error) {
            console.error(`Test failed: Error modifying isInitialized: ${error.message}`);
            return;
        }

        // Test 3: Reset state and verify isInitialized is reset
        state.resetState();
        console.log(`After state reset: ${state.isInitialized}`);
        
        if (state.isInitialized !== false) {
            console.error('Test failed: isInitialized should be false after resetState()');
            return;
        }
        console.log('✅ Test 3 passed: isInitialized is reset to false by resetState()');

        // Test 4: Check if isInitialized in default export matches the direct export
        try {
            const isInitializedInDefaultExport = state.default.isInitialized;
            console.log(`isInitialized in default export: ${isInitializedInDefaultExport}`);
            console.log(`isInitialized direct export: ${state.isInitialized}`);
            
            // We either expect them to be in sync (ideal) or for default export to not have the property (acceptable)
            const isOk = isInitializedInDefaultExport === state.isInitialized || 
                         isInitializedInDefaultExport === undefined;
            
            if (!isOk) {
                console.error('Test failed: isInitialized in default export does not match direct export');
                return;
            }
            console.log('✅ Test 4 passed: isInitialized property check in exports');
        } catch (error) {
            console.error(`Test failed: Error checking default export: ${error.message}`);
            return;
        }

        console.log('All tests passed! The isInitialized property is working correctly.');
    } catch (error) {
        console.error(`Unexpected error during testing: ${error.message}`);
    }
}

// Run the test
runTest(); 