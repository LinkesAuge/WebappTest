#!/usr/bin/env python3
"""
run_pytest.py

Description: Python utility script to run pytest tests for the ChefScore Analytics Dashboard
Usage: python scripts/run_pytest.py [options]

This script runs Python tests using pytest, complementing the JavaScript tests.
It can be used to test Python modules or perform additional validation tests.
"""

import argparse
import subprocess
import sys
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


def run_command(command, cwd=None, shell=True, capture=True):
    """Run a shell command and return the result."""
    try:
        if capture:
            process = subprocess.run(
                command,
                cwd=cwd,
                shell=shell,
                check=False,
                text=True,
                capture_output=True,
            )
            return {
                "success": process.returncode == 0,
                "stdout": process.stdout,
                "stderr": process.stderr,
                "returncode": process.returncode,
            }
        else:
            # For streaming output directly to console
            subprocess.run(command, cwd=cwd, shell=shell, check=False)
            return {"success": True}
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "stdout": "",
            "stderr": str(e),
            "returncode": 1,
        }


def check_pytest():
    """Check if pytest is installed and install it if not."""
    print_header("Checking Prerequisites")

    # Check if pytest is installed
    result = run_command("pytest --version")
    if not result["success"]:
        log("pytest is not installed. Installing pytest...", Colors.YELLOW)
        install_result = run_command("pip install pytest pytest-cov pytest-html")
        if not install_result["success"]:
            log("Failed to install pytest:", Colors.RED)
            log(install_result["stderr"], Colors.RED)
            return False
        log("pytest installed successfully.", Colors.GREEN)
    else:
        pytest_version = result["stdout"].strip()
        log(f"pytest is installed: {pytest_version}", Colors.GREEN)

    return True


def ensure_test_directories(project_dir):
    """Ensure that python test directories exist."""
    print_header("Setting Up Test Structure")

    # Create python tests directory if it doesn't exist
    python_tests_dir = project_dir / "tests" / "python"
    if not python_tests_dir.exists():
        log(f"Creating Python tests directory at {python_tests_dir}", Colors.YELLOW)
        python_tests_dir.mkdir(parents=True, exist_ok=True)

        # Create __init__.py files
        init_file = python_tests_dir / "__init__.py"
        init_file.touch()

        # Create subdirectories for different test types
        subdirs = ["unit", "integration", "validation"]
        for subdir in subdirs:
            subdir_path = python_tests_dir / subdir
            subdir_path.mkdir(exist_ok=True)
            (subdir_path / "__init__.py").touch()

            # Create a sample test file if the directory is empty
            if not list(subdir_path.glob("*.py")) or list(subdir_path.glob("*.py")) == [
                "__init__.py"
            ]:
                sample_test_file = subdir_path / f"test_sample_{subdir}.py"
                with open(sample_test_file, "w") as f:
                    f.write(f'''"""
Sample {subdir} test for the ChefScore Analytics Dashboard.
"""

def test_sample_{subdir}():
    """A sample {subdir} test that always passes."""
    assert True, "This test should always pass"
''')

        log("Python test directories created with sample tests.", Colors.GREEN)
    else:
        log("Python test directories already exist.", Colors.GREEN)

    return True


def run_pytest(
    project_dir, test_type=None, coverage=False, verbose=False, html_report=False
):
    """Run pytest tests."""
    print_header(
        f"Running {'All' if not test_type else test_type.capitalize()} Python Tests"
    )

    # Base command
    command = ["pytest"]

    # Test paths based on test type
    if test_type:
        test_path = project_dir / "tests" / "python" / test_type
        command.append(str(test_path))
    else:
        command.append(str(project_dir / "tests" / "python"))

    # Add options
    if verbose:
        command.append("-v")

    if coverage:
        command.extend(
            ["--cov=scripts", "--cov-report=term", "--cov-report=xml:coverage.xml"]
        )

    if html_report:
        command.append("--html=test_report.html")

    # Print the command
    log(f"Running command: {' '.join(command)}", Colors.BLUE)

    # Run the command
    process = subprocess.Popen(
        " ".join(command),
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
        log("\nPython tests completed successfully! 🎉", Colors.GREEN + Colors.BOLD)
        return True
    else:
        log(
            "\nSome Python tests failed. Please check the output above for details.",
            Colors.RED,
        )
        return False


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Python utility script to run pytest tests for the ChefScore Analytics Dashboard",
        formatter_class=argparse.RawTextHelpFormatter,
    )

    test_group = parser.add_mutually_exclusive_group()
    test_group.add_argument("--unit", action="store_true", help="Run only unit tests")
    test_group.add_argument(
        "--integration", action="store_true", help="Run only integration tests"
    )
    test_group.add_argument(
        "--validation", action="store_true", help="Run only validation tests"
    )
    test_group.add_argument(
        "--all", action="store_true", help="Run all tests (default)"
    )

    parser.add_argument(
        "--coverage", action="store_true", help="Generate coverage report"
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Show detailed test output"
    )
    parser.add_argument("--html", action="store_true", help="Generate HTML test report")
    parser.add_argument(
        "--setup",
        action="store_true",
        help="Only set up test directories, don't run tests",
    )

    return parser.parse_args()


def main():
    """Main function to run the script."""
    # Parse arguments
    args = parse_arguments()

    # Get the project directory (the directory containing this script's parent)
    project_dir = Path(__file__).resolve().parent.parent

    # Print welcome message
    log("🚀 ChefScore Analytics Dashboard Python Test Runner", Colors.BOLD)
    log(f"Working directory: {project_dir}", Colors.BLUE)

    # Check if pytest is installed
    if not check_pytest():
        return 1

    # Ensure test directories exist
    if not ensure_test_directories(project_dir):
        return 1

    # If --setup flag is provided, exit after setting up directories
    if args.setup:
        log("Test setup completed successfully.", Colors.GREEN)
        return 0

    # Determine test type
    test_type = None
    if args.unit:
        test_type = "unit"
    elif args.integration:
        test_type = "integration"
    elif args.validation:
        test_type = "validation"

    # Run tests
    success = run_pytest(
        project_dir,
        test_type=test_type,
        coverage=args.coverage,
        verbose=args.verbose,
        html_report=args.html,
    )

    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
