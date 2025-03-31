# PowerShell script to run Jest directly without npm for ChefScore Analytics Dashboard
# This script is useful when npm is not in your PATH but Node.js is available

# ANSI color codes
$ESC = [char]27
$RED = "$ESC[91m"
$GREEN = "$ESC[92m"
$YELLOW = "$ESC[93m"
$BLUE = "$ESC[94m"
$RESET = "$ESC[0m"

Write-Host "${BLUE}ChefScore Analytics Dashboard - Direct Jest Runner${RESET}`n"

# Get the project directory (script parent directory)
$ProjectDir = (Get-Item $PSScriptRoot).Parent.FullName
Write-Host "Project directory: $ProjectDir"

# Verify Node.js is installed
try {
    $nodeVersion = (node --version).Trim()
    Write-Host "${GREEN}✓ Node.js is installed: $nodeVersion${RESET}"
} catch {
    Write-Host "${RED}✗ Node.js is not installed or not in the PATH${RESET}"
    Write-Host "${YELLOW}Please install Node.js from https://nodejs.org/${RESET}"
    exit 1
}

# Check if node_modules exists
$nodeModulesPath = Join-Path -Path $ProjectDir -ChildPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "${RED}✗ node_modules directory not found at:${RESET}"
    Write-Host "  $nodeModulesPath"
    Write-Host "${YELLOW}Please run 'npm install' first to install dependencies${RESET}"
    exit 1
}

# Check if Jest binary exists
$jestPath = Join-Path -Path $nodeModulesPath -ChildPath ".bin\jest.cmd"
if (-not (Test-Path $jestPath)) {
    Write-Host "${RED}✗ Jest not found at:${RESET}"
    Write-Host "  $jestPath"
    Write-Host "${YELLOW}Please run 'npm install --save-dev jest @testing-library/jest-dom jest-environment-jsdom' first${RESET}"
    exit 1
}

# Parse command line arguments
$testType = $null
$extraArgs = @()
$coverageMode = $false

foreach ($arg in $args) {
    switch ($arg) {
        "--unit" { $testType = "unit" }
        "--integration" { $testType = "integration" }
        "--e2e" { $testType = "e2e" }
        "--coverage" { $coverageMode = $true }
        "--verbose" { $extraArgs += "--verbose" }
        "--watch" { $extraArgs += "--watch" }
        default { 
            # Other arguments are passed through to Jest
            if ($arg -like "--*") {
                $extraArgs += $arg
            }
        }
    }
}

# Build the Jest command arguments (not including the program name)
$jestArgs = @()

# Add test pattern based on test type
if ($testType -eq "unit") {
    $jestArgs += "--testMatch=`"**/tests/unit/**/*.test.js`""
}
elseif ($testType -eq "integration") {
    $jestArgs += "--testMatch=`"**/tests/integration/**/*.test.js`""
}
elseif ($testType -eq "e2e") {
    $jestArgs += "--testMatch=`"**/tests/e2e/**/*.test.js`""
}

# Add coverage if needed
if ($coverageMode) {
    $jestArgs += "--coverage"
}

# Add extra args
foreach ($arg in $extraArgs) {
    $jestArgs += $arg
}

# Display test header
$testHeader = if ($testType) { "Running $testType Tests" } elseif ($coverageMode) { "Running Tests with Coverage" } else { "Running All Tests" }
$line = "=" * ($testHeader.Length + 8)

Write-Host "`n$BLUE$line$RESET"
Write-Host "$BLUE    $testHeader    $RESET"
Write-Host "$BLUE$line$RESET`n"

# Create the command string for display purposes
$commandDisplay = "& `"$jestPath`" " + ($jestArgs -join " ")
Write-Host "Executing: $commandDisplay`n"

# Run the command and capture output
$currentDir = Get-Location
Set-Location -Path $ProjectDir

try {
    # Execute the jest.cmd batch file directly
    & $jestPath $jestArgs
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "`n${GREEN}✅ Tests completed successfully!${RESET}"
        exit 0
    } else {
        Write-Host "`n${RED}❌ Some tests failed. See output above for details.${RESET}"
        exit $exitCode
    }
} catch {
    Write-Host "`n${RED}❌ Error running tests: $_${RESET}"
    exit 1
} finally {
    # Restore original directory
    Set-Location -Path $currentDir
} 