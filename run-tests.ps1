# Execute the Python test runner for the ChefScore Analytics Dashboard
# This PowerShell script makes it easy to run tests on Windows systems

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Python detected: $pythonVersion"
}
catch {
    Write-Host "Python is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

# Pass all arguments to the Python script
Write-Host "Running tests with arguments: $args" -ForegroundColor Cyan
python .\scripts\run_website_tests.py $args

# Return the exit code from the Python script
exit $LASTEXITCODE 