# Script to help diagnose and fix npm path issues
# Run this as Administrator if possible

# ANSI color codes
$ESC = [char]27
$RED = "$ESC[91m"
$GREEN = "$ESC[92m"
$YELLOW = "$ESC[93m"
$BLUE = "$ESC[94m"
$RESET = "$ESC[0m"

Write-Host "${BLUE}ChefScore Analytics Dashboard - npm Path Fixer${RESET}`n"

# Check if Node.js is installed
try {
    $nodeVersion = (node --version).Trim()
    Write-Host "${GREEN}✓ Node.js is installed: $nodeVersion${RESET}"
} catch {
    Write-Host "${RED}✗ Node.js is not installed or not in the PATH${RESET}"
    Write-Host "${YELLOW}Please install Node.js from https://nodejs.org/${RESET}"
    exit 1
}

# Get Node.js installation path
try {
    $nodePath = (Get-Command node).Path
    $nodeDir = Split-Path -Parent $nodePath
    Write-Host "${GREEN}✓ Node.js is installed at: $nodeDir${RESET}"
} catch {
    Write-Host "${RED}✗ Could not determine Node.js installation path${RESET}"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = (npm --version).Trim()
    Write-Host "${GREEN}✓ npm is installed: $npmVersion${RESET}"
    
    $npmPath = (Get-Command npm).Path
    $npmDir = Split-Path -Parent $npmPath
    Write-Host "${GREEN}✓ npm is installed at: $npmDir${RESET}"
    
    # Check if npm and node are in the same directory
    if ($npmDir -eq $nodeDir) {
        Write-Host "${GREEN}✓ npm and Node.js are in the same directory${RESET}"
    } else {
        Write-Host "${YELLOW}! npm and Node.js are in different directories:${RESET}"
        Write-Host "  Node.js: $nodeDir"
        Write-Host "  npm: $npmDir"
    }
    
    Write-Host "`n${GREEN}npm appears to be correctly installed.${RESET}"
    exit 0
} catch {
    Write-Host "${RED}✗ npm is not installed or not in the PATH${RESET}"
}

# Check for npm in the Node.js directory
$potentialNpmPaths = @(
    "$nodeDir\npm.cmd",
    "$nodeDir\npm",
    "$nodeDir\node_modules\npm\bin\npm-cli.js"
)

$npmFound = $false
foreach ($path in $potentialNpmPaths) {
    if (Test-Path $path) {
        Write-Host "${GREEN}✓ Found npm at: $path${RESET}"
        $npmFound = $true
        break
    }
}

if (-not $npmFound) {
    Write-Host "${YELLOW}! npm not found in Node.js directory${RESET}"
    
    # Try to find npm globally
    $globalNodeModules = "$env:APPDATA\npm"
    if (Test-Path "$globalNodeModules\npm.cmd") {
        Write-Host "${GREEN}✓ Found npm in global npm directory: $globalNodeModules\npm.cmd${RESET}"
        $npmFound = $true
    }
}

if ($npmFound) {
    Write-Host "`n${YELLOW}Possible solutions:${RESET}"
    Write-Host "1. Ensure the Node.js directory is in your PATH environment variable:"
    Write-Host "   $nodeDir"
    Write-Host "2. If using NVM, make sure to run 'nvm use' before running tests"
    Write-Host "3. Reinstall Node.js to fix npm installation issues"
    Write-Host "`nTo add the Node.js directory to your PATH for this session, run:"
    Write-Host "${BLUE}\$env:Path += \";$nodeDir\"${RESET}"
} else {
    Write-Host "`n${RED}npm not found in typical locations.${RESET}"
    Write-Host "${YELLOW}Recommended actions:${RESET}"
    Write-Host "1. Reinstall Node.js from https://nodejs.org/"
    Write-Host "2. Try installing npm separately: 'corepack enable'"
}

Write-Host "`n${BLUE}Would you like to add the Node.js directory to your PATH for this session? (y/n)${RESET}"
$response = Read-Host
if ($response -eq "y" -or $response -eq "Y") {
    $env:Path += ";$nodeDir"
    Write-Host "${GREEN}Added Node.js directory to PATH for this session${RESET}"
    Write-Host "${YELLOW}Note: This change is only temporary for this PowerShell session${RESET}"
    
    # Check npm again
    try {
        $npmVersion = (npm --version).Trim()
        Write-Host "${GREEN}✓ npm is now accessible: $npmVersion${RESET}"
    } catch {
        Write-Host "${RED}✗ npm is still not accessible${RESET}"
    }
}

Write-Host "`n${BLUE}After fixing the PATH, restart your terminal and try running the tests again.${RESET}" 