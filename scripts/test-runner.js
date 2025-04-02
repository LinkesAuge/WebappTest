/**
 * test-runner.js
 * 
 * A script to run ChefScore tests in a headless browser using Puppeteer.
 * This script finds and executes all test HTML files in the tests/ directory.
 */

// Import required modules
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

// Configuration
const config = {
    rootDir: path.resolve(__dirname, '..'),
    testDir: path.resolve(__dirname, '../tests'),
    serverPort: 3000,
    timeout: 30000,
    headless: true
};

// Test results tracking
const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    files: []
};

// Start a local web server
function startServer() {
    const serve = serveStatic(config.rootDir);
    
    const server = http.createServer((req, res) => {
        const done = finalhandler(req, res);
        serve(req, res, done);
    });
    
    return new Promise((resolve) => {
        server.listen(config.serverPort, () => {
            console.log(`Test server started on http://localhost:${config.serverPort}`);
            resolve(server);
        });
    });
}

// Find test files
function findTestFiles() {
    const testFiles = fs.readdirSync(config.testDir)
        .filter(file => file.endsWith('.html') && (file.includes('test') || file.includes('Test')))
        .map(file => path.join('/tests', file));
    
    console.log(`Found ${testFiles.length} test files`);
    return testFiles;
}

// Run a test file in the browser
async function runTestFile(browser, testFile) {
    const url = `http://localhost:${config.serverPort}${testFile}`;
    const fileName = path.basename(testFile);
    
    console.log(`\nRunning tests in ${fileName}...`);
    
    const page = await browser.newPage();
    
    // Set up console log capturing
    page.on('console', message => {
        const text = message.text();
        if (text.includes('PASS:')) {
            console.log(`  ${text}`);
        } else if (text.includes('FAIL:')) {
            console.error(`  ${text}`);
        }
    });
    
    try {
        // Navigate to the test page
        await page.goto(url, { timeout: config.timeout, waitUntil: 'networkidle0' });
        
        // Find the "Run All Tests" button and click it
        const runAllButtonSelector = '#run-all-tests';
        await page.waitForSelector(runAllButtonSelector, { timeout: 5000 });
        await page.click(runAllButtonSelector);
        
        // Wait for tests to complete (look for the summary)
        await page.waitForFunction(() => {
            const summary = document.getElementById('test-summary');
            return summary && summary.textContent.includes('Success Rate');
        }, { timeout: config.timeout });
        
        // Extract test results
        const result = await page.evaluate(() => {
            const summary = document.getElementById('test-summary');
            if (!summary) return null;
            
            const text = summary.textContent.trim();
            const total = parseInt(text.match(/Tests: (\d+)/)?.[1] || '0');
            const passed = parseInt(text.match(/Passed: (\d+)/)?.[1] || '0');
            const failed = parseInt(text.match(/Failed: (\d+)/)?.[1] || '0');
            const successRate = parseInt(text.match(/Success Rate: (\d+)/)?.[1] || '0');
            
            return { total, passed, failed, successRate };
        });
        
        if (!result) {
            throw new Error('Failed to extract test results');
        }
        
        // Update overall results
        testResults.total += result.total;
        testResults.passed += result.passed;
        testResults.failed += result.failed;
        testResults.files.push({
            file: fileName,
            ...result
        });
        
        console.log(`  Completed ${fileName}: ${result.passed}/${result.total} tests passed (${result.successRate}% success rate)`);
        
        return true;
    } catch (error) {
        console.error(`  Error running tests in ${fileName}:`, error.message);
        testResults.files.push({
            file: fileName,
            error: error.message,
            total: 0,
            passed: 0,
            failed: 0,
            successRate: 0
        });
        return false;
    } finally {
        await page.close();
    }
}

// Run all tests
async function runAllTests() {
    console.log('Starting ChefScore test runner...');
    
    // Start server
    const server = await startServer();
    
    // Launch browser
    const browser = await puppeteer.launch({ 
        headless: config.headless ? 'new' : false,
        args: ['--no-sandbox']
    });
    
    try {
        // Find test files
        const testFiles = findTestFiles();
        
        if (testFiles.length === 0) {
            console.log('No test files found. Exiting...');
            return;
        }
        
        // Run each test file
        for (const testFile of testFiles) {
            await runTestFile(browser, testFile);
        }
        
        // Print summary
        console.log('\n========== TEST SUMMARY ==========');
        console.log(`Total Tests: ${testResults.total}`);
        console.log(`Passed: ${testResults.passed}`);
        console.log(`Failed: ${testResults.failed}`);
        
        if (testResults.total > 0) {
            const overallSuccessRate = Math.round((testResults.passed / testResults.total) * 100);
            console.log(`Overall Success Rate: ${overallSuccessRate}%`);
        }
        
        console.log('\nTest Files:');
        testResults.files.forEach(file => {
            const status = file.error ? 'ERROR' : (file.failed > 0 ? 'FAIL' : 'PASS');
            console.log(`  [${status}] ${file.file}: ${file.passed}/${file.total} tests passed`);
        });
        
        console.log('\n==================================');
        
        // Exit with appropriate code
        process.exitCode = testResults.failed > 0 ? 1 : 0;
    } catch (error) {
        console.error('Error running tests:', error);
        process.exitCode = 1;
    } finally {
        // Close browser and server
        await browser.close();
        server.close();
        console.log('Test runner finished');
    }
}

// Run the tests
runAllTests(); 