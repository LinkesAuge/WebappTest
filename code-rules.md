# Rules and Guidelines

## 1. Documentation Templates

### File Header Template
```python
"""
{filename}

Description: Brief description of the file's purpose
Usage:
    Example usage of the module/class
"""
```

### Class Documentation Template
```python
class ClassName:
    """
    Brief description of the class.

    Attributes:
        attribute_name (type): Description of the attribute
        
    Implementation Notes:
        - Key implementation detail 1
        - Key implementation detail 2
    """
```

### Function Documentation Template
```python
def function_name(param1: type, param2: type) -> return_type:
    """
    Brief description of the function.

    Args:
        param1 (type): Description of param1
        param2 (type): Description of param2

    Returns:
        return_type: Description of return value

    Raises:
        ExceptionType: Description of when this exception occurs
    """
```

## 2. Code Generation Rules

### General rules to follow:
1. Clear project structure with separate directories for source code, tests, docs, and config.
2. Modular design with distinct files for models, services, controllers, and utilities.
3. Robust error handling and logging, including context capture.
4. Detailed documentation using docstrings and README files.
5. Code style consistency using Ruff.
6. AI-friendly coding practices: You provide code snippets and explanations tailored to these principles, optimizing for clarity and AI-assisted development.
7. Be sure to ALWAYS add typing annotations and return types when necessary to each function or class.
8. Add descriptive docstrings to all python functions and classes as well, lease use pep257 convention and update existing docstrings if need be.
9. Make sure you keep/update any comments that exist in a file. Add comments to any functionality and explain what and how it does it and write the comments in a way that even a layperson could understand.
10. Start private class variables with an underscore.
11. Use UPPERER_SNAKE_CASE for constants.

### When Generating New Files
1. Always start with the file header template
2. Include imports at the top, grouped by:
   - Standard library
   - Third-party packages
   - Local modules
3. Include type hints for all parameters and return values
4. Add docstrings for all public interfaces
5. Include example usage in docstrings

### When Implementing Features
1. Start with interface/abstract class definition
2. Follow with concrete implementation
3. Include error handling
4. Add logging statements at appropriate levels
5. Include performance considerations in comments

### When Creating UI Components
1. Start with component interface/props definition
2. Include accessibility attributes
3. Add error boundaries
4. Include loading states
5. Document component variants

## 3. Code Review Checklist
- [ ] Documentation follows templates
- [ ] Type hints are present and correct
- [ ] Error handling is implemented
- [ ] Logging is appropriate
- [ ] Tests are included
- [ ] Performance considerations documented
- [ ] Security measures implemented
- [ ] Follows project structure rules

## 4. Implementation Order Guidelines

### For New Features
1. Create data models
2. Implement service layer
3. Add API endpoints
4. Create UI components
5. Implement error handling
6. Add tests
7. Document the feature

### Use "phases" for larger reworks/refactors/tasks like this:
# Phase X: [Name]

## Prerequisites
- [ ] Phase Y completed
- [ ] Phase Z completed

## Implementation Steps
[Detailed steps...]

## Verification Checklist
- [ ] All features implemented
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Performance benchmarks met

## Status
- Started: [Date]
- Current Status: [In Progress/Complete]
- Blocking Issues: [None/List]
- Next Steps: [List]

### For Refactoring
1. Create new structure
2. Move existing code
3. Update imports
4. Add new patterns
5. Update tests
6. Verify functionality
7. Update documentation

## 5. Response Format Guidelines

### When Providing Code Solutions
1. Start with file path and purpose
2. List dependencies needed
3. Provide complete implementation
4. Include error handling
5. Add usage examples
6. Note any performance considerations

### When Answering Questions
1. Reference relevant documentation
2. Provide concrete examples
3. Include best practices
4. Note potential pitfalls
5. Suggest alternatives if applicable

## 6. Quality Assurance Steps

### Before Completing Implementation
1. Verify all required methods are implemented
2. Check error handling coverage
3. Ensure logging is adequate
4. Verify type hints are complete
5. Confirm documentation is thorough
6. Validate against security rules
7. Check performance requirements

### After Implementation
1. Verify against project rules
2. Check naming conventions
3. Validate file structure
4. Confirm test coverage
5. Review documentation completeness

## 7. Integration Guidelines

### When Adding New Dependencies
1. Document the dependency
2. Specify version requirements
3. Note any conflicts
4. Include installation instructions
5. Add to requirements file

### When Connecting Components
1. Define interface contracts
2. Document data flow
3. Handle edge cases
4. Include error states
5. Add integration tests

## 8. Performance Considerations

### Always Include
1. Time complexity analysis
2. Space complexity analysis
3. Caching strategies
4. Database query optimization
5. UI rendering optimization

## 9. GUI / UI / User Interface considerations

### For ALL GUI / UI elements:
1. Prioritize the use of PySide6 for python projects
2. always sure make sure to properly hook them up and use signals/emits for data transfers 
3. keep a clear separation between UI and "business" logic.
4. always use signals to change the state of UI elements and receive signals from other code components to have their state changed
5. state of all GUI / UI elements should always be properly saved and loaded in a config.ini, including setting them up in the configmanager

## 10. Database

### Database Schemas should include:
1. Tables and their columns (with appropriate data types)
2. Primary and foreign key relationships
3. Any necessary junction tables for many-to-many relationships
4. Suggested indexes for performance
5. Considerations for scalability

### Database schema should follow these rules/considerations:
1. Normalization: Is the schema properly normalized? If not, suggest improvements.
2. Denormalization: Are there any cases where denormalization might improve performance?
3. Indexing strategy: Suggest additional indexes that might improve query performance.
4. Scalability: How will this schema handle growth? Any potential bottlenecks?
5. Data integrity: Are there any constraints or triggers we should consider to ensure data consistency?

## 11. Debugging

### Follow these rules for debugging:
1. If you are not sure what the solution is, add debug prints to the code and run the tests.
2. Create / update / reference the bugfixing.mdc file at the start of a reply before you think about the problem or start to code.
3. When you fixed a bug, error, issue or other problem make notes of that in the bugfixing.mdc, this also includes keeping track of ongoing errors, bugs, problems etc.
4. Update the bugfixing.mdc with any changes/updates/additions/removals at the end of your response.

## 12. Planning

### General guideline for planning:
1. Always plan the code before writing it.
2. Think about how the new code will fit into the existing codebase.
3. Think about how the new code will interact with the other parts of the codebase.
4. Think about how the new code will handle errors and edge cases.
5. Think about how the new code will be used by the user and developer.

## 13. Testing

### Follow these rules for testing any code:
1. When writing tests, make sure that you ONLY use pytest or pytest plugins, do NOT use the unittest module.
2. All tests should have typing annotations as well. 
3. All tests should be in ./tests. 
4. Be sure to create all necessary files and folders. 
5. If you are creating files inside of ./tests make sure to create a init.py file if one does not exist.
6. Always run the tests to make sure the code works

## 13. Comments

### All section comments should answer the following questions:
1. What is the purpose of this section?
2. How does it work step-by-step?
3. Are there any potential issues or limitations with this approach?
4. Parameters and their types
5. Return value and type
6. Any exceptions that might be raised
7. Usage examples if the function/class usage is not immediately obvious

## 13 General Coding Rules
You are generating code that follows general software engineering best practices. Adhere to these guidelines:
### WRITE clean, maintainable code:
            1. Follow consistent formatting and naming conventions
            2. Document public APIs and complex logic
            3. Write automated tests for functionality
            4. Handle errors and edge cases appropriately

        IMPLEMENTATION guidelines:
            1. Use meaningful names for variables, functions, and classes
            2. Keep functions/methods short and focused
            3. Apply appropriate design patterns for common problems
            4. Follow language-specific idioms and conventions

        VALIDATION criteria:
            1. Code passes static analysis checks
            2. Documentation is clear and up-to-date
            3. Tests verify expected behavior
            4. Error handling is comprehensive

        EXAMPLE practices:
            1. Consistent error handling strategy
            2. Comprehensive logging for troubleshooting
            3. Clear separation between interface and implementation
            4. Secure coding practices for sensitive operations


###  KISS (Keep It Simple, Stupid)
You are generating code that follows the KISS principle. Adhere to these guidelines:

        IMPLEMENT the simplest solution that satisfies requirements:
            1. Choose straightforward approaches over complex ones
            2. Avoid premature optimization and over-engineering
            3. Use standard libraries and patterns where appropriate
            4. Prioritize readability and maintainability

        IMPLEMENTATION guidelines:
            1. Write clear, self-documenting code
            2. Limit method/function complexity
            3. Use descriptive naming over clever abbreviations
            4. Break complex operations into simple steps

        VALIDATION criteria:
            1. New developers can understand the code quickly
            2. Solutions directly address the problem at hand
            4. Implementation avoids unnecessary abstractions
            4. Code is concise without being cryptic

        EXAMPLE structure:
            1. Direct data validation instead of complex rule engines
            2. Simple conditional logic instead of pattern matching
            3. Straightforward data structures instead of specialized collections
            4. Clear procedural steps instead of complex chains


### DRY (Don’t Repeat Yourself)
You are generating code that follows the DRY principle. Adhere to these guidelines:

        ELIMINATE duplication by centralizing common functionality:
            1. Maintain a single source of truth for knowledge/logic
            2. Extract repeated code into reusable functions/modules
            3. Centralize configuration and constants
            4. Apply abstraction for similar operations

        IMPLEMENTATION guidelines:
            1. Create utility functions for common operations
            2. Use inheritance or mixins for shared behavior
            3. Implement templates/generics for similar data structures
            4. Follow the “Rule of Three” before abstracting (wait until code is duplicated 3+ times)

        VALIDATION criteria:
            1. No copy-pasted code across the codebase
            2. Changes can be made in a single location
            3. Common operations use shared implementations
            4. Configuration values are centralized

        EXAMPLE structure:
            1. Utility classes for common operations
            2. Shared validation functions across forms
            3. Centralized error handling
            4. Template methods for similar processes


### Composition over Inheritance
You are generating code that follows the Composition over Inheritance principle. Adhere to these guidelines:

        FAVOR object composition over class inheritance:
            1. Build complex objects by combining simpler components
            2. Use interfaces to define behavior contracts
            3. Prefer “has-a” relationships over “is-a” relationships
            4. Avoid deep inheritance hierarchies (>2-3 levels)

        IMPLEMENTATION guidelines:
            1. Inject dependencies rather than extending base classes
            2. Use interface implementation for behavior contracts
            3. Apply decorator pattern for extending functionality
            4. Implement mixins/traits for reusable behaviors

        VALIDATION criteria:
            1. Features are added through composition
            2. Components can be reused in different contexts
            3. Behavior can be modified without changing inheritance
            4. System is flexible to requirement changes

        EXAMPLE structure:
            1. Vehicle with Engine component instead of Car extends Vehicle
            2. Logger interface with multiple implementations
            3. Authentication service composed of multiple validators
            4. UI component composed of smaller, reusable elements

### Separation of Concerns (SoC)
You are generating code that follows the Separation of Concerns principle. Adhere to these guidelines:

        DIVIDE functionality into distinct, independent modules:
            1. Each module handles ONE specific aspect of the system
            2. Modules interact through well-defined interfaces
            3. Changes in one module should minimally impact others
            4. Domain boundaries should be clearly established

        IMPLEMENTATION guidelines:
            1. Group related functionality within logical boundaries
            2. Hide implementation details through encapsulation
            3. Use interfaces or events for cross-module communication
            4. Maintain independent testability for each component

        VALIDATION criteria:
            1. Components can be developed, tested, and maintained independently
            2. Interfaces between modules are clearly defined
            3. System functionality is logically partitioned
            4. Minimal dependencies exist between separate concerns

        EXAMPLE structure:
            1. Data layer: Handles data persistence only
            2. Business layer: Implements domain logic only
            3. Presentation layer: Manages user interaction only
            4. Service layer: Coordinates between layers only


### Single Responsibility Principle (SRP)
You are generating code that follows the Single Responsibility Principle. Adhere to these guidelines:

        ENSURE each component has exactly ONE reason to change:
            1. Classes/modules should focus on a single capability
            2. Functions should perform one logical operation
            3. Avoid “god” classes that handle multiple concerns
            4. Split components with “and” in their purpose description

        IMPLEMENTATION guidelines:
            1. Name classes/modules after their single responsibility
            2. Keep components small and focused (<200 lines recommended)
            3. Use dependency injection for required services
            4. Extract unrelated functionality into separate components

        VALIDATION criteria:
            1. Component name clearly describes its sole purpose
            2. All methods relate to the primary responsibility
            3. Changes to one feature don’t affect unrelated functionality
            4. Component has minimal external dependencies

        EXAMPLE structure:
            1. UserAuthenticator: ONLY handles authentication
            2. PaymentProcessor: ONLY handles payment operations
            3. DataValidator: ONLY validates input data
            4. NotificationSender: ONLY sends notifications
