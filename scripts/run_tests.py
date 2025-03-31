#!/usr/bin/env python3
"""
run_tests.py

Description: Python utility script to run tests for the ChefScore Analytics Dashboard
Usage: python scripts/run_tests.py [options]

This script is a Python wrapper around the Node.js test infrastructure,
providing a convenient way to run tests from Python environments.
"""

import argparse
import os
import platform
import subprocess
import sys
from pathlib import Path


# ANSI color codes for prettier output
class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"


def log(message, color=""):
    """Print a formatted message to the console."""
    print(f"{color}{message}{Colors.RESET}")


def print_header(text):
    """Print a header with the test type being run."""
    line = "=" * (len(text) + 8)
    print("\n")
    log(line, Colors.CYAN)
    log(f"    {text}    ", Colors.CYAN + Colors.BOLD)
    log(line, Colors.CYAN)
    print("\n")


def run_command(command, cwd=None, shell=True):
    """Run a shell command and return the result."""
    try:
        process = subprocess.run(
            command, cwd=cwd, shell=shell, check=False, text=True, capture_output=True
        )
        return {
            "success": process.returncode == 0,
            "stdout": process.stdout,
            "stderr": process.stderr,
            "returncode": process.returncode,
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "stdout": "",
            "stderr": str(e),
            "returncode": 1,
        }


def check_prerequisites():
    """Check if Node.js and npm are installed."""
    print_header("Checking Prerequisites")

    # Check if Node.js is installed
    node_result = run_command("node --version")
    if not node_result["success"]:
        log("Node.js is not installed or not in the PATH.", Colors.RED)
        log("Please install Node.js from https://nodejs.org/", Colors.YELLOW)
        return False

    node_version = node_result["stdout"].strip()
    log(f"Node.js version: {node_version}", Colors.GREEN)

    # Check if npm is installed
    npm_result = run_command("npm --version")
    if not npm_result["success"]:
        log("npm is not installed or not in the PATH.", Colors.RED)
        log("npm should be included with Node.js installation.", Colors.YELLOW)
        return False

    npm_version = npm_result["stdout"].strip()
    log(f"npm version: {npm_version}", Colors.GREEN)

    return True


def check_dependencies(project_dir):
    """Check if the required dependencies are installed."""
    print_header("Checking Dependencies")

    # Check if package.json exists
    package_json_path = project_dir / "package.json"
    if not package_json_path.exists():
        log(f"package.json not found at {package_json_path}", Colors.RED)
        return False

    # Check if node_modules exists
    node_modules_path = project_dir / "node_modules"
    if not node_modules_path.exists():
        log(
            "node_modules directory not found. Installing dependencies...",
            Colors.YELLOW,
        )
        install_result = run_command("npm install", cwd=project_dir)
        if not install_result["success"]:
            log("Failed to install dependencies:", Colors.RED)
            log(install_result["stderr"], Colors.RED)
            return False
        log("Dependencies installed successfully.", Colors.GREEN)
    else:
        log("node_modules directory found.", Colors.GREEN)

    # Check if Jest is installed
    jest_path = (
        project_dir
        / "node_modules"
        / ".bin"
        / ("jest.cmd" if platform.system() == "Windows" else "jest")
    )
    if not jest_path.exists():
        log("Jest not found in node_modules. Installing Jest...", Colors.YELLOW)
        install_result = run_command(
            "npm install --save-dev jest jest-environment-jsdom @testing-library/jest-dom",
            cwd=project_dir,
        )
        if not install_result["success"]:
            log("Failed to install Jest:", Colors.RED)
            log(install_result["stderr"], Colors.RED)
            return False
        log("Jest installed successfully.", Colors.GREEN)
    else:
        log("Jest found in node_modules.", Colors.GREEN)

    return True


def run_tests(project_dir, test_type=None, coverage=False, watch=False, verbose=False):
    """Run the specified tests."""
    # Determine the command based on options
    if test_type:
        print_header(f"Running {test_type.capitalize()} Tests")
        command = f"npm run test:{test_type}"
    elif coverage:
        print_header("Running Tests with Coverage")
        command = "npm run test:coverage"
    else:
        print_header("Running All Tests")
        command = "npm test"

    # Add watch flag if needed
    if watch:
        command += " -- --watch"

    # Add verbose flag if needed
    if verbose:
        command += " -- --verbose"

    log(f"Executing: {command}", Colors.BOLD)
    print("\n")

    # Run the command
    process = subprocess.Popen(
        command,
        cwd=project_dir,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )

    # Stream the output
    for line in iter(process.stdout.readline, ""):
        sys.stdout.write(line)

    # Wait for the process to complete
    exit_code = process.wait()

    if exit_code == 0:
        log("\nTests completed successfully! 🎉", Colors.GREEN + Colors.BOLD)
        return True
    else:
        log(
            "\nSome tests failed. Please check the output above for details.",
            Colors.RED,
        )
        return False


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Python utility script to run tests for the ChefScore Analytics Dashboard",
        formatter_class=argparse.RawTextHelpFormatter,
    )

    test_group = parser.add_mutually_exclusive_group()
    test_group.add_argument("--unit", action="store_true", help="Run only unit tests")
    test_group.add_argument(
        "--integration", action="store_true", help="Run only integration tests"
    )
    test_group.add_argument(
        "--e2e", action="store_true", help="Run only end-to-end tests"
    )
    test_group.add_argument(
        "--all", action="store_true", help="Run all tests (default)"
    )
    test_group.add_argument(
        "--coverage", action="store_true", help="Generate coverage report"
    )

    parser.add_argument("--watch", action="store_true", help="Run tests in watch mode")
    parser.add_argument(
        "--verbose", action="store_true", help="Show detailed test output"
    )
    parser.add_argument(
        "--check", action="store_true", help="Only check dependencies, don't run tests"
    )

    return parser.parse_args()


def main():
    """Main function to run the script."""
    # Parse arguments
    args = parse_arguments()

    # Get the project directory (the directory containing this script's parent)
    project_dir = Path(__file__).resolve().parent.parent

    # Print welcome message
    log("🚀 ChefScore Analytics Dashboard Test Runner (Python Edition)", Colors.BOLD)
    log(f"Working directory: {project_dir}", Colors.BLUE)

    # Check prerequisites
    if not check_prerequisites():
        return 1

    # Check dependencies
    if not check_dependencies(project_dir):
        return 1

    # If --check flag is provided, exit after checking dependencies
    if args.check:
        log("Dependency check completed successfully.", Colors.GREEN)
        return 0

    # Determine test type
    test_type = None
    if args.unit:
        test_type = "unit"
    elif args.integration:
        test_type = "integration"
    elif args.e2e:
        test_type = "e2e"

    # Run tests
    success = run_tests(
        project_dir,
        test_type=test_type,
        coverage=args.coverage,
        watch=args.watch,
        verbose=args.verbose,
    )

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
