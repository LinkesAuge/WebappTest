#!/usr/bin/env python3
"""
run_website_tests.py

Description: Executable Python script to run JavaScript tests for the ChefScore Analytics Dashboard
Usage: python scripts/run_website_tests.py [options]

This script focuses on running the JavaScript tests for the website and is designed
to be easily executable from the command line.
"""

import argparse
import os
import platform
import subprocess
import sys
import json
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


def ensure_node_installed():
    """Verify that Node.js and npm are installed.

    Returns:
        tuple: (node_installed, npm_installed) - Boolean flags indicating if each is installed
    """
    print_header("Checking Node.js Installation")

    node_installed = False
    npm_installed = False

    # Check Node.js
    try:
        node_version = subprocess.check_output(
            ["node", "--version"], stderr=subprocess.STDOUT, text=True
        ).strip()
        log(f"✓ Node.js is installed: {node_version}", Colors.GREEN)
        node_installed = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        log("✗ Node.js is not installed or not in the PATH", Colors.RED)
        log("Please install Node.js from https://nodejs.org/", Colors.YELLOW)

    # Check npm separately
    try:
        npm_version = subprocess.check_output(
            ["npm", "--version"], stderr=subprocess.STDOUT, text=True
        ).strip()
        log(f"✓ npm is installed: {npm_version}", Colors.GREEN)
        npm_installed = True
    except (subprocess.CalledProcessError, FileNotFoundError):
        log("✗ npm is not installed or not in the PATH", Colors.RED)
        log("npm should be included with Node.js installation", Colors.YELLOW)
        log("Try reinstalling Node.js or adding npm to your PATH", Colors.YELLOW)

    return node_installed, npm_installed


def ensure_dependencies(project_dir, npm_available=True):
    """Ensure all necessary dependencies are installed.

    Args:
        project_dir: Path to the project directory
        npm_available: Whether npm is available

    Returns:
        bool: True if dependencies are available, False otherwise
    """
    print_header("Checking Dependencies")

    # Check if package.json exists
    package_json = project_dir / "package.json"
    if not package_json.exists():
        log(f"✗ package.json not found at {package_json}", Colors.RED)
        return False

    # Check for node_modules directory
    node_modules = project_dir / "node_modules"
    if not node_modules.exists():
        if not npm_available:
            log(
                "✗ Node modules not found and npm is not available to install them",
                Colors.RED,
            )
            log(
                "Please install npm or run the script with --force-node-only after installing dependencies",
                Colors.YELLOW,
            )
            return False

        log("Node modules not found. Installing dependencies...", Colors.YELLOW)
        try:
            subprocess.run(
                ["npm", "install"],
                cwd=project_dir,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            log("✓ Dependencies installed successfully", Colors.GREEN)
        except subprocess.CalledProcessError as e:
            log(f"✗ Failed to install dependencies: {e.stderr}", Colors.RED)
            return False
    else:
        log("✓ Node modules found", Colors.GREEN)

    # Check for jest
    jest_path = (
        node_modules
        / ".bin"
        / ("jest.cmd" if platform.system() == "Windows" else "jest")
    )

    if not jest_path.exists():
        if not npm_available:
            log("✗ Jest not found and npm is not available to install it", Colors.RED)
            log(
                "Please install npm or run the script with --force-node-only after installing dependencies",
                Colors.YELLOW,
            )
            return False

        log("Jest not found. Installing testing dependencies...", Colors.YELLOW)
        try:
            subprocess.run(
                [
                    "npm",
                    "install",
                    "--save-dev",
                    "jest",
                    "@testing-library/jest-dom",
                    "jest-environment-jsdom",
                ],
                cwd=project_dir,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
            )
            log("✓ Testing dependencies installed successfully", Colors.GREEN)
        except subprocess.CalledProcessError as e:
            log(f"✗ Failed to install testing dependencies: {e.stderr}", Colors.RED)
            return False
    else:
        log("✓ Jest found", Colors.GREEN)

    return True


def get_jest_config_from_package(package_json_path):
    """Extract Jest configuration from package.json.

    Args:
        package_json_path: Path to package.json

    Returns:
        dict: Jest configuration or empty dict if not found
    """
    try:
        with open(package_json_path, "r") as f:
            package_data = json.load(f)

        # Check for Jest config
        if "jest" in package_data:
            return package_data["jest"]
    except Exception as e:
        log(
            f"Warning: Could not read jest config from package.json: {str(e)}",
            Colors.YELLOW,
        )

    return {}


def run_tests(project_dir, args, npm_available=True):
    """Run the specified JavaScript tests.

    Args:
        project_dir: Path to the project directory
        args: Command line arguments
        npm_available: Whether npm is available
    """
    # Determine test type
    test_type = None
    if args.unit:
        test_type = "unit"
        print_header(f"Running Unit Tests")
    elif args.integration:
        test_type = "integration"
        print_header(f"Running Integration Tests")
    elif args.e2e:
        test_type = "e2e"
        print_header(f"Running End-to-End Tests")
    elif args.coverage:
        print_header(f"Running Tests with Coverage")
    else:
        print_header(f"Running All Tests")

    # Get the Jest binary path
    jest_bin = (
        project_dir
        / "node_modules"
        / ".bin"
        / ("jest.cmd" if platform.system() == "Windows" else "jest")
    )

    # Build the command based on npm availability
    command = []

    if npm_available:
        # Use npm when available
        if test_type:
            command = ["npm", "run", f"test:{test_type}"]
        elif args.coverage:
            command = ["npm", "run", "test:coverage"]
        else:
            command = ["npm", "test"]
    else:
        # Direct Jest execution when npm is not available
        log("npm not available, using Jest directly", Colors.YELLOW)

        # Base command
        command = ["node", str(jest_bin)]

        # Add test pattern based on test type
        if test_type == "unit":
            command.extend(["--testMatch", "**/tests/unit/**/*.test.js"])
        elif test_type == "integration":
            command.extend(["--testMatch", "**/tests/integration/**/*.test.js"])
        elif test_type == "e2e":
            command.extend(["--testMatch", "**/tests/e2e/**/*.test.js"])

        # Add coverage if needed
        if args.coverage:
            command.append("--coverage")

    # Add extra arguments if needed
    extra_args = []
    if args.verbose:
        extra_args.append("--verbose")
    if args.watch:
        extra_args.append("--watch")

    if extra_args and npm_available:
        command.extend(["--", *extra_args])
    elif extra_args:
        # When using Jest directly, don't use the -- separator
        command.extend(extra_args)

    log(f"Executing: {' '.join(command)}", Colors.BOLD)
    print()

    # Run the command
    try:
        process = subprocess.Popen(
            command,
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True,
        )

        # Stream output in real-time
        for line in iter(process.stdout.readline, ""):
            sys.stdout.write(line)
            sys.stdout.flush()

        # Wait for completion
        exit_code = process.wait()

        if exit_code == 0:
            log("\n✅ Tests completed successfully!", Colors.GREEN + Colors.BOLD)
            return True
        else:
            log(
                "\n❌ Some tests failed. See output above for details.",
                Colors.RED + Colors.BOLD,
            )
            return False

    except Exception as e:
        log(f"\n❌ Error running tests: {str(e)}", Colors.RED + Colors.BOLD)
        return False


def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Run JavaScript tests for the ChefScore Analytics Dashboard website",
        formatter_class=argparse.RawDescriptionHelpFormatter,
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
        "--coverage", action="store_true", help="Run tests with coverage reporting"
    )

    parser.add_argument("--watch", action="store_true", help="Run tests in watch mode")
    parser.add_argument(
        "--verbose", action="store_true", help="Show detailed test output"
    )
    parser.add_argument(
        "--setup",
        action="store_true",
        help="Only check and set up dependencies without running tests",
    )
    parser.add_argument(
        "--force-node-only",
        action="store_true",
        help="Continue with only Node.js even if npm is not detected",
    )

    return parser.parse_args()


def main():
    """Main entry point for the script."""
    # Parse arguments
    args = parse_arguments()

    # Get project directory (parent of the scripts directory)
    project_dir = Path(__file__).resolve().parent.parent

    # Welcome message
    log("\n🚀 ChefScore Analytics Dashboard Website Test Runner", Colors.BOLD)
    log(f"Working directory: {project_dir}", Colors.BLUE)

    # Check prerequisites
    node_installed, npm_installed = ensure_node_installed()

    if not node_installed:
        log("Node.js is required to run the tests.", Colors.RED)
        return 1

    if not npm_installed and not args.force_node_only:
        log(
            "\nTo continue with only Node.js (without npm), run with --force-node-only flag",
            Colors.YELLOW,
        )
        return 1

    # Check and install dependencies
    if not ensure_dependencies(project_dir, npm_installed):
        return 1

    # If --setup flag is provided, exit after setting up dependencies
    if args.setup:
        log("\n✅ Test environment set up successfully.", Colors.GREEN + Colors.BOLD)
        return 0

    # Run the tests
    success = run_tests(project_dir, args, npm_installed)

    return 0 if success else 1


if __name__ == "__main__":
    # Make the script executable on Windows by adding .py file association if needed
    if platform.system() == "Windows":
        import os
        import sys

        # Check if .py files are associated with Python
        try:
            python_path = sys.executable
            file_ext = os.path.splitext(__file__)[1].lower()
            if file_ext == ".py":
                # We're already running as Python, so no need to do anything
                pass
        except Exception:
            # If there's any error, we'll just continue with normal execution
            pass

    # Run the main function
    sys.exit(main())
