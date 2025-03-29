# UI/UX

## UI Application Structure

### Layout Organization
The application follows a hierarchical layout structure:
1. **Header**: Contains navigation, language switcher, and download button
2. **Main Content Area**: Displays the active view
3. **Footer**: Contains basic application information

### View Structure
- **Dashboard View**: Overview with statistics, ranking table, and summary charts
- **Data Table View**: Full data table with all columns and rows
- **Charts View**: Expanded versions of the main charts
- **Analytics View**: Tools for analyzing categories and comparing players
- **Score System View**: Display of scoring rules
- **Player Detail View**: Detailed information about a specific player

### Navigation Patterns
- **Primary Navigation**: Top navigation bar with text links
- **Breadcrumb Navigation**: Used for subviews and details
- **Back Buttons**: Allow returning to the dashboard from detailed views
- **Modal Pattern**: Used for expanded chart views

## Design System

### Color Palette
The application uses a dark fantasy theme inspired by "Total Battle":
- **Background**: Dark slate (slate-950)
- **Foreground/Text**: Light slate (slate-200)
- **Primary**: Amber (amber-500)
- **Secondary**: Rose (rose-600)
- **Border**: Amber (amber-600)
- **Card Background**: Dark slate (slate-900)

### Typography
- **Heading Font**: Cinzel Decorative (serif, decorative)
- **Body Font**: Inter (sans-serif)
- **Secondary Text**: Merriweather (serif)
- **Text Hierarchy**:
  - Main Headings: 2xl, amber-300
  - Section Headings: xl, amber-300
  - Card Headings: base, amber-300
  - Body Text: text-foreground (slate-200)
  - Secondary Text: slate-400

### Component System
- **Cards**: Rounded containers with dark backgrounds and borders
- **Tables**: Clean rows with alternating background tints
- **Buttons**: Border buttons with hover effects
- **Charts**: Styled consistently with the application theme
- **Inputs**: Dark backgrounds with lighter borders
- **Modals**: Centered with backdrop blur

### Iconography
- Uses Font Awesome 6.2.0 for all icons
- Icons are used consistently to represent specific concepts:
  - Users: fa-users
  - Score: fa-star
  - Chests: fa-treasure-chest
  - Charts: Various chart-specific icons

## View Specifications

### Dashboard View
- **Statistics Cards**: Row of 5 cards with key metrics
- **Player Ranking**: Sortable table with visual highlighting for top 3
- **Charts**: 4 compact charts with expand functionality
- **Top Chests List**: Small table showing top 5 players by chest count

### Data Table View
- Full-width table with all data columns
- Horizontal scrolling for many columns
- Sticky header for usability
- Sortable columns with clear indicators

### Charts View
- Larger versions of dashboard charts
- Full-width layout optimized for data visualization
- Consistent chart styles and interactions

### Analytics View
- **Category Analysis**: Dropdown, table, and chart in a card
- **Player Comparison**: Two dropdowns, comparison button, and results area
- **Clan Analysis**: Two charts showing aggregate clan data

### Score System View
- Simple table showing scoring rules
- Sortable columns for different views of the data

### Player Detail View
- **Player Info Card**: Basic player stats and ranking
- **Score Breakdown**: List of all chest sources with scores
- **Performance Charts**: Radar chart and comparison chart

## Interaction Patterns

### Navigation Interaction
- Links have hover states with color change and subtle underline
- Active link is highlighted with primary color and border
- Breadcrumb navigation shows clear path and current location

### Data Interaction
- Tables are sortable by clicking headers
- Tables include visual indicators for sort direction
- Search filtering updates results in real-time
- Category and player selection uses standard dropdown controls

### Chart Interaction
- Charts include tooltips on hover
- Charts can be expanded to modal view
- Charts include ApexCharts toolbar for zoom, download, etc.
- Modal can be closed by clicking backdrop or close button

### Language Switching
- Language buttons in header with active state
- Language preference persists across sessions
- All UI updates immediately on language change

## Key UX Principles

### Consistency
- Consistent color scheme and styling across all views
- Consistent navigation patterns and positioning
- Consistent iconography for similar concepts

### Feedback
- Loading spinners during data operations
- Status messages for operations and errors
- Visual feedback for interactive elements (hover, active states)

### Efficiency
- Direct access to key views from main navigation
- Back buttons for returning to dashboard
- Sortable and filterable tables for quick data access
- Download buttons for exporting data

### Accessibility
- Clear visual hierarchy and contrast
- Semantic HTML structure
- ARIA attributes for dynamic content
- Keyboard navigation support

### Responsiveness
- Layout adapts to different screen sizes
- Mobile-friendly navigation options
- Scrollable sections for small screens

## UX Rubric

### Grade A (Excellent)
- All views are fully functional and intuitive
- Data visualization is clear and insightful
- Navigation is seamless between all sections
- Language switching works flawlessly
- All interactive elements provide appropriate feedback
- Responsive design works on all screen sizes
- Chart interactions are smooth and useful
- Tables provide effective sorting and filtering
- Downloads work correctly for all data types
- Error states are handled gracefully with clear messages

### Grade B (Good)
- Core functionality works well with minor issues
- Most data visualizations are clear and useful
- Navigation works with occasional awkwardness
- Language switching works with minor text issues
- Most interactive elements provide feedback
- Responsive design works on most screen sizes
- Chart interactions work with minor issues
- Tables provide basic sorting and filtering
- Downloads work for most data types
- Error states are handled with basic messages

### Grade C (Acceptable)
- Basic functionality works with several issues
- Data visualizations are functional but not optimal
- Navigation has notable inconsistencies
- Language switching has multiple text issues
- Interactive feedback is inconsistent
- Responsive design has issues on some devices
- Chart interactions have significant limitations
- Table functionality is limited or buggy
- Downloads have reliability issues
- Error handling is basic or unclear

### Grade D (Needs Improvement)
- Multiple features are broken or confusing
- Data visualizations are difficult to understand
- Navigation is confusing or inconsistent
- Language switching doesn't work properly
- Little or no interactive feedback
- Poor responsive design implementation
- Charts lack proper interaction
- Tables lack proper sorting/filtering
- Downloads don't work reliably
- Error states are poorly handled

### Grade F (Unacceptable)
- Core functionality doesn't work
- Data visualizations are broken or misleading
- Navigation is broken or prevents use
- Language switching is broken
- No interactive feedback for user actions
- No responsive design implementation
- Charts don't render properly
- Tables don't display data correctly
- Downloads don't work
- No error handling implemented 