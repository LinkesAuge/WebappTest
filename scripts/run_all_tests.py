#!/usr/bin/env python3
"""
run_all_tests.py

Description: Python utility script to run all tests for the ChefScore Analytics Dashboard
Usage: python scripts/run_all_tests.py [options]

This script runs both JavaScript tests (via Node.js/Jest) and Python tests (via pytest),
providing a unified interface for running all tests.
"""

import argparse
import importlib.util
import os
import subprocess
import sys
import time
from pathlib import Path


# ANSI color codes
class Colors:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"


def log(message, color=""):
    """Print a formatted message to the console."""
    print(f"{color}{message}{Colors.RESET}")


def print_header(text, color=Colors.CYAN):
    """Print a header with the test type being run."""
    line = "=" * (len(text) + 8)
    print("\n")
    log(line, color)
    log(f"    {text}    ", color + Colors.BOLD)
    log(line, color)
    print("\n")


def print_section(text, color=Colors.BLUE):
    """Print a section header."""
    print("\n")
    log(f"--- {text} ---", color + Colors.BOLD)
    print("\n")


def load_test_runner(script_path):
    """Dynamically load a test runner script as a module."""
    spec = importlib.util.spec_from_file_location("test_runner", script_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def run_combined_tests(project_dir, args):
    """Run all tests in sequence - JavaScript and Python."""
    print_header("ChefScore Analytics Dashboard - Combined Test Runner", Colors.MAGENTA)

    start_time = time.time()
    results = {}

    # JavaScript Tests
    if not args.python_only:
        print_section("Running JavaScript Tests", Colors.BLUE)

        # Load the JavaScript test runner
        js_runner_path = project_dir / "scripts" / "run_tests.py"
        if not js_runner_path.exists():
            log(f"JavaScript test runner not found at {js_runner_path}", Colors.RED)
            results["javascript"] = False
        else:
            js_runner = load_test_runner(js_runner_path)

            # Run JavaScript tests
            js_success = js_runner.main()
            results["javascript"] = js_success == 0

    # Python Tests
    if not args.js_only:
        print_section("Running Python Tests", Colors.BLUE)

        # Load the Python test runner
        py_runner_path = project_dir / "scripts" / "run_pytest.py"
        if not py_runner_path.exists():
            log(f"Python test runner not found at {py_runner_path}", Colors.RED)
            results["python"] = False
        else:
            py_runner = load_test_runner(py_runner_path)

            # Run Python tests
            py_success = py_runner.main()
            results["python"] = py_success == 0

    # Print summary
    elapsed_time = time.time() - start_time
    print_header("Test Summary", Colors.MAGENTA)

    log(f"Time elapsed: {elapsed_time:.2f} seconds", Colors.BOLD)
    print("\n")

    all_passed = True
    for test_type, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        color = Colors.GREEN if passed else Colors.RED
        log(f"{test_type.capitalize()} Tests: {status}", color + Colors.BOLD)
        all_passed = all_passed and passed

    print("\n")
    if all_passed:
        log("🎉 All tests passed successfully! 🎉", Colors.GREEN + Colors.BOLD)
    else:
        log(
            "❌ Some tests failed. Please check the output above for details.",
            Colors.RED + Colors.BOLD,
        )

    return 0 if all_passed else 1


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Combined test runner for the ChefScore Analytics Dashboard",
        formatter_class=argparse.RawTextHelpFormatter,
    )

    # Test type options
    test_type_group = parser.add_mutually_exclusive_group()
    test_type_group.add_argument(
        "--js-only", action="store_true", help="Run only JavaScript tests"
    )
    test_type_group.add_argument(
        "--python-only", action="store_true", help="Run only Python tests"
    )

    # Coverage options
    parser.add_argument(
        "--coverage", action="store_true", help="Generate coverage reports"
    )
    parser.add_argument(
        "--html-report", action="store_true", help="Generate HTML test reports"
    )

    # Misc options
    parser.add_argument(
        "--verbose", action="store_true", help="Show detailed test output"
    )

    return parser.parse_args()


def main():
    """Main function to run the script."""
    # Parse arguments
    args = parse_arguments()

    # Get the project directory (the directory containing this script's parent)
    project_dir = Path(__file__).resolve().parent.parent

    # Run all tests
    return run_combined_tests(project_dir, args)


if __name__ == "__main__":
    sys.exit(main())
