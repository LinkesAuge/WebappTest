# Product Context

## Problem Statement

ChefScore Dashboard was developed to solve several key problems for Minecraft players in a chest-opening mini-game:

1. **Performance Tracking**: Players need a way to track their performance over time, including scores, chest counts, and other metrics.
2. **Comparative Analysis**: Players want to compare their performance against others to understand their relative standing.
3. **Historical Insights**: Understanding performance trends across multiple weeks helps players identify improvement areas.
4. **Standardized Scoring**: A consistent scoring system ensures fair comparison across different chest types and levels.

## User Experience Goals

The ChefScore Dashboard aims to provide users with:

1. **Intuitive Data Visibility**: Clear presentation of player performance data without requiring technical knowledge.
2. **Simple Navigation**: Easy movement between current week data and historical performance.
3. **Meaningful Comparisons**: Visual tools to compare performance metrics across players and time periods.
4. **Performance Context**: Understanding how scoring works and what constitutes good performance.
5. **Self-Improvement Insights**: Highlighting areas where players can focus to improve their standings.

## Core Features

The dashboard centers around these key features:

### 1. Current Week Overview
- Leaderboard of players ranked by score
- Detailed breakdown of player performance metrics
- Visualization of score distribution and top performers

### 2. Multi-Week Data System
- **Weekly Data Selection**: Allows users to select specific weeks from a dropdown menu
- **Week-based Data Organization**: Player data is organized by week numbers
- **Standardized Data Format**: Consistent CSV format for player data across all weeks
- **Dynamic Date Ranges**: Auto-calculated date ranges based on ISO week numbers
- **Fallback Mechanisms**: Ensures the application functions even if some data is missing

### 3. Historical Analysis
- Performance trends over multiple weeks
- Consistency metrics and improvement tracking
- Week-over-week comparisons

### 4. Data Visualization
- Graphical representation of player standings
- Distribution charts for various metrics
- Timeline charts for historical data

## Data Structure Overview

### Weekly Data Files
- **Purpose**: Store player performance data for each specific week
- **Format**: CSV files with consistent column structure
- **Naming Convention**: `data_week_XX.csv` (where XX is the week number)
- **Key Metrics**: Player name, total score, chest counts, and other performance metrics

### Week Configuration
- **Purpose**: Define available weeks and their data sources
- **File**: `data/weeks.json`
- **Structure**: JSON array mapping week numbers to CSV files
- **Benefits**: Centralized configuration for easy addition of new weeks

### Date Range System
- **Purpose**: Provide temporal context for each week's data
- **Implementation**: Dynamic calculation based on ISO week numbering
- **Benefit**: Eliminates manual date entry and ensures consistency

## Target Users

1. **Active Players**: Individuals participating in the weekly chest-opening challenges
2. **Team Leaders**: Players who manage teams and need to track group performance
3. **Game Administrators**: Individuals who organize events and need to validate scores
4. **Data Analysts**: Users who want to derive insights from the performance data

## Key User Journeys

### 1. Weekly Performance Check
A player visits the dashboard to:
- View the current week's leaderboard
- Find their position relative to others
- Understand their performance breakdown

### 2. Historical Performance Analysis
A player analyzes their history to:
- Select specific weeks from the dropdown
- Compare their performance across different weeks
- Identify trends and patterns in their scores

### 3. Data Administration
An administrator manages weekly data by:
- Creating new weekly CSV files with player data
- Adding new week entries to the weeks.json configuration
- Verifying correct data loading and visualization

## Success Criteria

The ChefScore Dashboard is considered successful when:

1. Players regularly use it to check standings and performance
2. The system handles multiple weeks of data smoothly
3. Users can easily navigate between different time periods
4. The application provides meaningful insights for improvement
5. New weeks can be added with minimal technical effort 