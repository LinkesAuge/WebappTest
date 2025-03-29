# Testing

## Test Directory Structure
Since this is a client-side only application with no build process, there is no dedicated test directory structure. Testing is primarily done manually through the browser.

## Test Types

### Manual Testing
- **Functional Testing**: Verify all features work as expected
- **Cross-Browser Testing**: Test in different browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Design Testing**: Test on different screen sizes
- **Internationalization Testing**: Verify language switching works correctly
- **Data Processing Testing**: Verify CSV parsing and data transformations

### Automated Testing (Future Consideration)
- Consider implementing Jest or similar for JavaScript unit testing
- Consider implementing end-to-end testing with Cypress or Playwright

## Running Tests

### Manual Test Procedure
1. Start a local web server in the project directory
2. Open the application in a web browser
3. Test each feature according to the test scenarios below
4. Verify correct behavior for each scenario

### Browser Developer Tools
Use browser developer tools to:
- Check console for JavaScript errors
- Test responsive design using device emulation
- Monitor network requests for CSV file loading
- Inspect rendered HTML and CSS

## Key Testing Tools & Frameworks
Currently no testing frameworks are implemented. Manual testing is performed using:
- Browser developer tools
- Different devices and screen sizes
- Multiple browsers

## Special Test Features
- CSV validation can be done using external CSV validation tools
- Chart rendering can be verified visually

## Common Test Fixtures

### Sample CSV Data
For testing, create minimal versions of the required CSV files:

**Sample data.csv**:
```
PLAYER,TOTAL_SCORE,CHEST_COUNT,SOURCE1,SOURCE2
Player1,100,10,50,50
Player2,200,20,100,100
Player3,150,15,75,75
```

**Sample rules.csv**:
```
Typ,Level,Punkte
Type1,1,10
Type1,2,20
Type2,1,5
Type2,2,10
```

## Test Patterns

### Data Loading Tests
1. Verify application loads with valid CSV files
2. Verify application shows appropriate error message when CSV files are missing
3. Verify application handles malformed CSV data gracefully

### UI Feature Tests
1. Verify all navigation links work and show the correct views
2. Verify sorting functionality works on tables
3. Verify filtering works as expected
4. Verify charts render correctly with data
5. Verify modals open and close as expected

### Internationalization Tests
1. Verify language switching between German and English
2. Verify language preference is saved in localStorage
3. Verify all UI elements update correctly when language is changed

## Specialized Test Cases

### Chart Rendering
- Verify charts render correctly with different data sets
- Verify chart interactivity works (tooltips, zooming, etc.)
- Verify chart downloads (PNG/SVG) function correctly

### CSV Processing
- Verify large CSV files are processed correctly
- Verify application handles special characters in CSV data
- Verify numeric values are correctly parsed and formatted

## Common Test Scenarios

### Main Dashboard
1. Verify statistics cards show correct aggregate values
2. Verify player ranking table sorts correctly
3. Verify player search filter works
4. Verify top charts display correctly
5. Verify clicking on a player name shows the player detail view

### Data Table
1. Verify full data table shows all columns
2. Verify sorting works on all columns
3. Verify horizontal scrolling works for many columns

### Charts View
1. Verify all charts render in expanded format
2. Verify chart tooltips and interactions work

### Analytics
1. Verify category dropdown populates with all chest sources
2. Verify selecting a category shows correct analysis
3. Verify player selection dropdowns work
4. Verify player comparison generates correct comparison table
5. Verify clan analytics charts render correctly

### Player Detail
1. Verify correct player information is displayed
2. Verify score breakdown list shows correct values
3. Verify radar chart displays top categories
4. Verify player vs. average chart shows correct comparison
5. Verify JSON download includes correct player data

## Best Practices
1. Test with both small and large data sets
2. Test internationalization thoroughly
3. Test all interactive elements (clicks, hovers, etc.)
4. Verify proper error messages for all error conditions
5. Test on multiple browsers and device sizes

## QA Test Rubric
When testing the application, use the following checklist:

- [ ] Application loads without errors in console
- [ ] All views display and function correctly
- [ ] Data processing works with valid CSV files
- [ ] Error handling works with invalid or missing CSV files
- [ ] All charts render correctly and are interactive
- [ ] Language switching works and persists across sessions
- [ ] Responsive design adapts to different screen sizes
- [ ] All downloads (CSV, JSON, chart images) work correctly
- [ ] Performance is adequate with reasonably sized data sets
- [ ] Application UI follows the design theme consistently 