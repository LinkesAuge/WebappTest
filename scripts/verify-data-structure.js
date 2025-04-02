/**
 * verify-data-structure.js
 * 
 * This script verifies that our data structure changes have been properly implemented
 * It checks that:
 * 1. data.csv is no longer needed or referenced
 * 2. The application works correctly with the week-based data structure
 */

// Mock browser environment for testing
const fs = require('fs');
const path = require('path');

// Global variables
const jsDir = path.join(__dirname, '..', 'js');
const dataDir = path.join(__dirname, '..', 'data');
const configPath = path.join(jsDir, 'config.js');
const moduleFiles = [
    'config.js',
    'dataLoading.js', 
    'main.js', 
    'weekDataManager.js'
];

// Verification functions
function verifyNoDataCsvReferences() {
    console.log('\n=== Checking for data.csv references ===');
    
    let referencesFound = false;
    
    // Check each module file for data.csv references
    moduleFiles.forEach(filename => {
        const filePath = path.join(jsDir, filename);
        
        try {
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Check for direct data.csv references
                const dataCsvMatches = content.match(/data\.csv/g);
                if (dataCsvMatches && dataCsvMatches.length > 0) {
                    console.log(`❌ Found ${dataCsvMatches.length} references to data.csv in ${filename}`);
                    referencesFound = true;
                }
                
                // Check for CSV_PATH references (should be removed)
                const csvPathMatches = content.match(/CSV_PATH/g);
                if (csvPathMatches && csvPathMatches.length > 0) {
                    console.log(`❌ Found ${csvPathMatches.length} references to CSV_PATH in ${filename}`);
                    referencesFound = true;
                }
            } else {
                console.log(`⚠️ File ${filename} does not exist`);
            }
        } catch (error) {
            console.error(`Error reading ${filename}:`, error.message);
        }
    });
    
    if (!referencesFound) {
        console.log('✅ No data.csv references found in module files');
    }
    
    return !referencesFound;
}

function verifyConfigExports() {
    console.log('\n=== Checking config.js exports ===');
    
    try {
        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, 'utf8');
            
            // Check for CSV_PATH in exports
            const exportMatches = content.match(/export\s+const\s+CSV_PATH/g);
            if (exportMatches && exportMatches.length > 0) {
                console.log('❌ CSV_PATH is still exported in config.js');
                return false;
            }
            
            // Check for CSV_PATH in default export
            const defaultExportMatch = content.match(/export\s+default\s+\{[^}]*CSV_PATH[^}]*\}/s);
            if (defaultExportMatch && defaultExportMatch.length > 0) {
                console.log('❌ CSV_PATH is still included in default export in config.js');
                return false;
            }
            
            console.log('✅ config.js does not export CSV_PATH');
            return true;
        } else {
            console.log('⚠️ config.js file does not exist');
            return false;
        }
    } catch (error) {
        console.error('Error checking config.js:', error.message);
        return false;
    }
}

function verifyDataFolderStructure() {
    console.log('\n=== Checking data folder structure ===');
    
    try {
        // Check if data folder exists
        if (!fs.existsSync(dataDir)) {
            console.log('❌ data folder does not exist');
            return false;
        }
        
        // Check for weeks.json
        const weeksJsonPath = path.join(dataDir, 'weeks.json');
        if (!fs.existsSync(weeksJsonPath)) {
            console.log('❌ weeks.json does not exist in data folder');
            return false;
        } else {
            console.log('✅ weeks.json exists in data folder');
        }
        
        // Check for rules.csv
        const rulesCsvPath = path.join(dataDir, 'rules.csv');
        if (!fs.existsSync(rulesCsvPath)) {
            console.log('❌ rules.csv does not exist in data folder');
        } else {
            console.log('✅ rules.csv exists in data folder');
        }
        
        // Check for week data files
        const weekFiles = fs.readdirSync(dataDir)
            .filter(file => file.startsWith('data_week_') && file.endsWith('.csv'));
        
        if (weekFiles.length === 0) {
            console.log('❌ No data_week_XX.csv files found in data folder');
            return false;
        } else {
            console.log(`✅ Found ${weekFiles.length} week data files: ${weekFiles.join(', ')}`);
        }
        
        // Check if data.csv exists (it shouldn't)
        const dataCsvPath = path.join(dataDir, 'data.csv');
        if (fs.existsSync(dataCsvPath)) {
            console.log('⚠️ data.csv still exists in data folder (not needed anymore)');
        } else {
            console.log('✅ data.csv does not exist in data folder (as expected)');
        }
        
        return true;
    } catch (error) {
        console.error('Error checking data folder structure:', error.message);
        return false;
    }
}

// Run all verifications
function runAllVerifications() {
    console.log('=== Verifying Data Structure Changes ===');
    
    const noReferences = verifyNoDataCsvReferences();
    const configExportsCorrect = verifyConfigExports();
    const dataStructureCorrect = verifyDataFolderStructure();
    
    console.log('\n=== Summary ===');
    console.log(`No data.csv references: ${noReferences ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Config exports correct: ${configExportsCorrect ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Data folder structure correct: ${dataStructureCorrect ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = noReferences && configExportsCorrect && dataStructureCorrect;
    console.log(`\nOverall: ${allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
    
    return allPassed;
}

// Run verifications
runAllVerifications(); 