@echo off
REM Execute the Python test runner for the ChefScore Analytics Dashboard
REM This batch file makes it easy to run tests on Windows systems

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python is not installed or not in the PATH.
    echo Please install Python from https://www.python.org/
    exit /b 1
)

REM Pass all arguments to the Python script
python scripts\run_website_tests.py %*

REM Return the exit code from the Python script
exit /b %ERRORLEVEL% 