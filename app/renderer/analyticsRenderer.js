/**
 * Analytics Renderer Module
 * 
 * Handles rendering of analytics visualizations including:
 * - Category analysis 
 * - Clan analysis
 */

import * as i18n from '../i18n.js';
import * as utils from '../utils.js';
import * as chartRenderer from './chartRenderer.js';

// Category Analysis functions
export function renderCategoryAnalysis(category, data) {
  console.log('Rendering enhanced category analysis for:', category);
  
  // Get players with points in this category
  const playersWithPoints = data.filter(player => player[category] > 0)
    .sort((a, b) => b[category] - a[category]);
  
  // Process data for advanced visualizations
  const categoryData = processCategoryData(data, category);
  
  // Render all category visualizations
  renderSourceDistributionRadar('source-distribution-container', categoryData);
  renderTopPlayersBySource('top-players-container', categoryData);
  renderSourceTreemap('source-treemap-container', categoryData);
  renderCategoryCorrelationMatrix('correlation-matrix-container', data);
  
  // Show the advanced analysis content
  document.getElementById('category-advanced-analysis').classList.remove('hidden');
}

export function renderSourceDistributionRadar(containerId, categoryData) {
  console.log('Rendering source distribution radar chart');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Extract the top 5 sources for the category
  const topSources = categoryData.sources
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);
  
  // Prepare data for radar chart
  const seriesData = [{
    name: i18n.getText('analytics.sourceDistribution'),
    data: topSources.map(source => source.totalScore)
  }];
  
  const categories = topSources.map(source => source.name);
  
  // Create radar chart
  chartRenderer.createRadarChart(
    containerId, 
    seriesData, 
    categories, 
    i18n.getText('analytics.sourceDistribution')
  );
}

export function renderTopPlayersBySource(containerId, categoryData) {
  console.log('Rendering top players by source chart');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Get top 5 players for the category
  const topPlayers = categoryData.playerData
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);
  
  // Prepare data for stacked bar chart
  const categories = topPlayers.map(player => player.name);
  
  // Get top 5 sources
  const topSources = categoryData.sources
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);
  
  // Create series data for each source
  const seriesData = topSources.map(source => {
    return {
      name: source.name,
      data: topPlayers.map(player => {
        // Find score for this player and source, or default to 0
        const playerSource = player.sources.find(s => s.name === source.name);
        return playerSource ? playerSource.score : 0;
      })
    };
  });
  
  // Create stacked bar chart
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false
      }
    }
  };
  
  chartRenderer.createBarChart(
    containerId,
    seriesData,
    categories,
    i18n.getText('analytics.topPlayersBySource'),
    null,
    options
  );
}

export function renderSourceTreemap(containerId, categoryData) {
  console.log('Rendering source treemap');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Create data for treemap
  const data = categoryData.sources.map(source => ({
    x: source.name,
    y: source.totalScore
  }));
  
  // Configure chart
  const options = {
    chart: {
      type: 'treemap',
      height: 350
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px'
      },
      formatter: function(text, op) {
        return [text, utils.formatNumber(op.value)];
      }
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: true
      }
    }
  };
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Use Object.assign instead of spread operator
  const chartOptions = Object.assign(
    {},
    chartRenderer.getBaseChartOptions(),
    options,
    {
      series: [{
        data: data
      }],
      title: {
        text: i18n.getText('analytics.sourceTreemap'),
        align: 'center',
        style: {
          fontSize: '16px',
          fontFamily: 'Inter, sans-serif',
          color: '#f59e0b'
        }
      }
    }
  );
  
  const chart = new ApexCharts(container, chartOptions);
  chart.render();
  container.__chartInstance = chart;
}

export function renderCategoryCorrelationMatrix(containerId, data) {
  console.log('Rendering category correlation matrix');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for correlation matrix');
    return;
  }
  
  // Get all columns - first try FROM_ columns
  let sourceColumns = Object.keys(data[0] || {})
    .filter(key => key.startsWith('FROM_'));
  
  // If no FROM_ columns, use non-core columns
  if (sourceColumns.length === 0) {
    console.warn('No FROM_ prefix columns found, using regular source columns');
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    sourceColumns = Object.keys(data[0] || {})
      .filter(key => !coreColumns.includes(key));
  }
  
  if (sourceColumns.length === 0) {
    console.warn('No source columns found for correlation matrix');
    return;
  }
  
  // For performance reasons, limit to top 10 source columns by score
  if (sourceColumns.length > 10) {
    // Calculate total score for each column
    const columnScores = {};
    sourceColumns.forEach(column => {
      columnScores[column] = data.reduce((sum, player) => sum + (player[column] || 0), 0);
    });
    
    // Sort and take top 10
    sourceColumns = Object.entries(columnScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }
  
  // Calculate correlation matrix
  const correlationMatrix = [];
  
  for (const column1 of sourceColumns) {
    const row = [];
    for (const column2 of sourceColumns) {
      const correlation = calculateCorrelation(data, column1, column2);
      row.push(correlation);
    }
    correlationMatrix.push(row);
  }
  
  // Prepare data for heatmap - get displayable names, removing FROM_ prefix if present
  const sourceNames = sourceColumns.map(col => 
    col.startsWith('FROM_') ? col.replace('FROM_', '') : col
  );
  
  // Configure chart
  const options = {
    chart: {
      type: 'heatmap',
      height: 350
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff']
      },
      formatter: function(val) {
        return val.toFixed(2);
      }
    },
    colors: ["#f59e0b"],
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            {
              from: -1,
              to: 0,
              name: 'negative',
              color: '#e11d48'
            },
            {
              from: 0,
              to: 1,
              name: 'positive',
              color: '#f59e0b'
            }
          ]
        }
      }
    }
  };
  
  // Create series data
  const seriesData = [];
  
  for (let i = 0; i < sourceNames.length; i++) {
    seriesData.push({
      name: sourceNames[i],
      data: correlationMatrix[i].map((value, index) => ({
        x: sourceNames[index],
        y: value
      }))
    });
  }
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Use Object.assign instead of spread operator
  const chartOptions = Object.assign(
    {},
    chartRenderer.getBaseChartOptions(),
    options,
    {
      series: seriesData,
      title: {
        text: i18n.getText('analytics.categoryCorrelation'),
        align: 'center',
        style: {
          fontSize: '16px',
          fontFamily: 'Inter, sans-serif',
          color: '#f59e0b'
        }
      },
      xaxis: {
        categories: sourceNames
      }
    }
  );
  
  const chart = new ApexCharts(container, chartOptions);
  chart.render();
  container.__chartInstance = chart;
}

// Clan Analysis functions
export function renderClanAnalysis(containerId, data) {
  console.log('Rendering clan analysis...');
  
  // Calculate clan metrics
  const clanMetrics = calculateClanMetrics(data);
  
  // First, update the summary metrics
  document.getElementById('clan-total-players').textContent = clanMetrics.totalPlayers;
  document.getElementById('clan-total-score').textContent = utils.formatNumber(clanMetrics.totalScore);
  document.getElementById('clan-average-score').textContent = utils.formatNumber(clanMetrics.averageScore);
  document.getElementById('clan-total-chests').textContent = utils.formatNumber(clanMetrics.totalChests);
  
  // Then render all visualizations
  renderClanComposition('clan-composition-container', data);
  renderContributionCurve('contribution-curve-container', data);
}

export function renderClanComposition(containerId, data) {
  console.log('Rendering clan composition chart');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Define score brackets
  const brackets = [
    { min: 0, max: 5000, name: '0-5k' },
    { min: 5000, max: 10000, name: '5k-10k' },
    { min: 10000, max: 20000, name: '10k-20k' },
    { min: 20000, max: 30000, name: '20k-30k' },
    { min: 30000, max: 50000, name: '30k-50k' },
    { min: 50000, max: Infinity, name: '50k+' }
  ];
  
  // Count players and sum scores in each bracket
  const bracketCounts = brackets.map(bracket => ({
    ...bracket,
    playerCount: 0,
    totalScore: 0
  }));
  
  data.forEach(player => {
    const score = player.TOTAL_SCORE || 0;
    const bracket = bracketCounts.find(b => score >= b.min && score < b.max);
    if (bracket) {
      bracket.playerCount++;
      bracket.totalScore += score;
    }
  });
  
  // Create data for stacked bar chart
  const playerCountsData = {
    name: i18n.getText('analytics.playerCount'),
    data: bracketCounts.map(b => b.playerCount)
  };
  
  const scoreContributionData = {
    name: i18n.getText('analytics.scoreContribution'),
    data: bracketCounts.map(b => b.totalScore)
  };
  
  // Create chart options
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    stroke: {
      width: [0, 1]
    },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1]
    },
    series: [playerCountsData, scoreContributionData],
    title: {
      text: '', // Remove redundant title
      align: 'center',
      style: {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    xaxis: {
      categories: bracketCounts.map(b => b.name),
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#cbd5e1' // Match dashboard text color
        }
      }
    },
    yaxis: [
      {
        title: {
          text: i18n.getText('analytics.playerCount'),
          style: {
            color: '#cbd5e1',
            fontFamily: 'Inter, sans-serif'
          }
        },
        labels: {
          style: {
            colors: '#cbd5e1',
            fontFamily: 'Inter, sans-serif'
          }
        }
      },
      {
        opposite: true,
        title: {
          text: i18n.getText('analytics.scoreContribution'),
          style: {
            color: '#cbd5e1',
            fontFamily: 'Inter, sans-serif'
          }
        },
        labels: {
          style: {
            colors: '#cbd5e1',
            fontFamily: 'Inter, sans-serif'
          }
        }
      }
    ],
    grid: {
      borderColor: '#334155', // Matching dashboard grid lines
      strokeDashArray: 2
    }
  };
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Get base chart options and merge them
  const baseOptions = chartRenderer.getBaseChartOptions();
  const mergedOptions = {};
  
  // Manually merge options to avoid spread operator issues
  Object.keys(baseOptions).forEach(key => {
    mergedOptions[key] = baseOptions[key];
  });
  
  Object.keys(chartOptions).forEach(key => {
    mergedOptions[key] = chartOptions[key];
  });
  
  const chart = new ApexCharts(container, mergedOptions);
  chart.render();
  container.__chartInstance = chart;
}

export function renderContributionCurve(containerId, data) {
  console.log('Rendering contribution curve');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Sort players by score
  // Use a regular for-loop to copy and sort data
  const sortedPlayers = [];
  for (let i = 0; i < data.length; i++) {
    sortedPlayers.push(data[i]);
  }
  sortedPlayers.sort((a, b) => b.TOTAL_SCORE - a.TOTAL_SCORE);
  
  // Calculate total clan score
  const totalClanScore = sortedPlayers.reduce(
    (sum, player) => sum + (player.TOTAL_SCORE || 0), 0
  );
  
  // Calculate cumulative contribution percentages
  const pointCount = 20; // Number of points in the curve
  const pointSize = Math.max(1, Math.floor(sortedPlayers.length / pointCount));
  
  const contributionCurve = [];
  let cumulativeScore = 0;
  
  for (let i = 0; i < sortedPlayers.length; i += pointSize) {
    const playerGroup = sortedPlayers.slice(i, i + pointSize);
    const groupScore = playerGroup.reduce(
      (sum, player) => sum + (player.TOTAL_SCORE || 0), 0
    );
    
    cumulativeScore += groupScore;
    
    contributionCurve.push({
      x: ((i + playerGroup.length) / sortedPlayers.length) * 100, // percentage of players
      y: (cumulativeScore / totalClanScore) * 100 // percentage of contribution
    });
  }
  
  // Ensure we reach 100% at the end
  if (contributionCurve.length > 0 && contributionCurve[contributionCurve.length - 1].y < 100) {
    contributionCurve.push({
      x: 100,
      y: 100
    });
  }
  
  // Create perfect equality reference line
  const equalityLine = [
    { x: 0, y: 0 },
    { x: 20, y: 20 },
    { x: 40, y: 40 },
    { x: 60, y: 60 },
    { x: 80, y: 80 },
    { x: 100, y: 100 }
  ];
  
  // Create chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    stroke: {
      curve: 'smooth',
      width: [4, 2]
    },
    markers: {
      size: [5, 0]
    },
    xaxis: {
      title: {
        text: i18n.getText('analytics.percentagePlayers'),
        style: {
          color: '#cbd5e1',
          fontFamily: 'Inter, sans-serif'
        }
      },
      labels: {
        formatter: function(val) {
          return val.toFixed(0) + '%';
        },
        style: {
          colors: '#cbd5e1',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: i18n.getText('analytics.percentageContribution'),
        style: {
          color: '#cbd5e1',
          fontFamily: 'Inter, sans-serif'
        }
      },
      labels: {
        formatter: function(val) {
          return val.toFixed(0) + '%';
        },
        style: {
          colors: '#cbd5e1',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    colors: ['#f59e0b', '#64748b'],
    annotations: {
      yaxis: [
        {
          y: 80,
          borderColor: '#e11d48',
          label: {
            borderColor: '#e11d48',
            style: {
              color: '#fff',
              background: '#e11d48'
            },
            text: '80% of score'
          }
        }
      ]
    },
    series: [
      {
        name: i18n.getText('analytics.actualContribution'),
        data: contributionCurve
      },
      {
        name: i18n.getText('analytics.perfectEquality'),
        data: equalityLine
      }
    ],
    title: {
      text: '', // Remove redundant title
      align: 'center',
      style: {
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    grid: {
      borderColor: '#334155', // Matching dashboard grid lines
      strokeDashArray: 2
    },
    legend: {
      labels: {
        colors: '#cbd5e1'
      }
    }
  };
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Get base chart options and merge them
  const baseOptions = chartRenderer.getBaseChartOptions();
  const mergedOptions = {};
  
  // Manually merge options to avoid spread operator issues
  Object.keys(baseOptions).forEach(key => {
    mergedOptions[key] = baseOptions[key];
  });
  
  Object.keys(chartOptions).forEach(key => {
    mergedOptions[key] = chartOptions[key];
  });
  
  // Finalize chart
  mergedOptions.title = {
    text: '', // Remove redundant title
    align: 'center',
    style: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      color: '#f8fafc' // Light color for dark background
    }
  };
  
  const chart = new ApexCharts(container, mergedOptions);
  chart.render();
  container.__chartInstance = chart;
}

// Helper functions
export function processCategoryData(data, category) {
  console.log('Processing data for category:', category);
  
  // Get players with points in this category
  const playersWithPoints = data.filter(player => player[category] > 0);
  
  // Get related source columns - first try FROM_ prefix 
  let sourceColumns = Object.keys(data[0] || {})
    .filter(key => key.startsWith('FROM_'));
  
  // If no FROM_ columns, use non-core columns
  if (sourceColumns.length === 0) {
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    sourceColumns = Object.keys(data[0] || {})
      .filter(key => !coreColumns.includes(key));
  }
  
  // Calculate total score for the category
  const totalCategoryScore = playersWithPoints.reduce(
    (sum, player) => sum + (player[category] || 0), 0
  );
  
  // Process source data
  const sources = sourceColumns.map(column => {
    const totalScore = playersWithPoints.reduce(
      (sum, player) => sum + (player[column] || 0), 0
    );
    
    return {
      name: column.startsWith('FROM_') ? column.replace('FROM_', '') : column,
      totalScore: totalScore,
      percentOfCategory: totalCategoryScore > 0 ? 
        (totalScore / totalCategoryScore) * 100 : 0
    };
  });
  
  // Process player data
  const playerData = playersWithPoints.map(player => {
    const playerSources = sourceColumns.map(column => ({
      name: column.startsWith('FROM_') ? column.replace('FROM_', '') : column,
      score: player[column] || 0
    })).filter(s => s.score > 0);
    
    return {
      name: player.PLAYER,
      totalScore: player[category] || 0,
      sources: playerSources
    };
  });
  
  return {
    categoryName: category.startsWith('FROM_') ? category.replace('FROM_', '') : category,
    totalScore: totalCategoryScore,
    sources: sources,
    playerData: playerData
  };
}

export function calculateClanMetrics(data) {
  console.log('Calculating clan metrics');
  
  // Calculate basic metrics
  const totalPlayers = data.length;
  const totalScore = data.reduce((sum, player) => sum + (player.TOTAL_SCORE || 0), 0);
  const averageScore = totalPlayers > 0 ? totalScore / totalPlayers : 0;
  const totalChests = data.reduce((sum, player) => sum + (player.CHEST_COUNT || 0), 0);
  
  // Calculate source breakdown - first try FROM_ columns
  let sourceColumns = Object.keys(data[0] || {})
    .filter(key => key.startsWith('FROM_'));
  
  // If no FROM_ columns, use non-core columns
  if (sourceColumns.length === 0) {
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    sourceColumns = Object.keys(data[0] || {})
      .filter(key => !coreColumns.includes(key));
  }
  
  // Safety check for sourceColumns
  if (!sourceColumns.length) {
    return {
      totalPlayers,
      totalScore,
      averageScore,
      totalChests,
      sourceBreakdown: []
    };
  }
  
  const sourceBreakdown = sourceColumns.map(column => {
    const totalSourceScore = data.reduce(
      (sum, player) => sum + (player[column] || 0), 0
    );
    
    return {
      name: column.startsWith('FROM_') ? column.replace('FROM_', '') : column,
      totalScore: totalSourceScore,
      percentOfTotal: totalScore > 0 ? 
        (totalSourceScore / totalScore) * 100 : 0
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
  
  return {
    totalPlayers,
    totalScore,
    averageScore,
    totalChests,
    sourceBreakdown
  };
}

// Utility function to calculate correlation between two columns
function calculateCorrelation(data, column1, column2) {
  // Extract values
  const values1 = data.map(item => item[column1] || 0);
  const values2 = data.map(item => item[column2] || 0);
  
  // If columns are the same, correlation is 1
  if (column1 === column2) return 1;
  
  // Calculate means
  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;
  
  // Calculate variances and covariance
  let variance1 = 0;
  let variance2 = 0;
  let covariance = 0;
  
  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
    covariance += diff1 * diff2;
  }
  
  // Finalize calculation
  const stdDev1 = Math.sqrt(variance1 / values1.length);
  const stdDev2 = Math.sqrt(variance2 / values2.length);
  
  // Avoid division by zero
  if (stdDev1 === 0 || stdDev2 === 0) return 0;
  
  return covariance / (values1.length * stdDev1 * stdDev2);
}

/**
 * Render source importance (Quellenimportanz) as a treemap
 */
export function renderSourceImportance(containerId, data) {
  console.log('Rendering source importance (Quellenimportanz) as treemap');
  
  // Get container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container #${containerId} not found for source importance chart`);
    return;
  }
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for source importance treemap');
    container.innerHTML = '<div class="p-4 text-center text-slate-500">No data available to create chart</div>';
    return;
  }
  
  try {
    // Get source columns
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    let sourceColumns = [];
    
    if (data[0] && typeof data[0] === 'object') {
      const allKeys = Object.keys(data[0]);
      for (let i = 0; i < allKeys.length; i++) {
        const key = allKeys[i];
        if (!coreColumns.includes(key)) {
          sourceColumns.push(key);
        }
      }
    }
    
    // Safety check for source columns
    if (!sourceColumns || sourceColumns.length === 0) {
      console.warn('No source columns found for treemap');
      container.innerHTML = '<div class="p-4 text-center text-slate-500">No source columns found for chart</div>';
      return;
    }
    
    // Calculate total scores for each source column
    const treemapData = [];
    
    for (let i = 0; i < sourceColumns.length; i++) {
      const column = sourceColumns[i];
      let totalScore = 0;
      
      // Sum up scores from all players
      for (let j = 0; j < data.length; j++) {
        const player = data[j];
        if (player && player[column] !== undefined) {
          const score = Number(player[column]);
          if (!isNaN(score)) {
            totalScore += score;
          }
        }
      }
      
      // Only include sources with positive scores
      if (totalScore > 0) {
        treemapData.push({
          x: column, // Column name (will be displayed on the treemap)
          y: totalScore // Score value
        });
      }
    }
    
    // Sort data by score (highest first)
    treemapData.sort(function(a, b) {
      return b.y - a.y;
    });
    
    // Take only top 20 sources for better visibility
    const topSourcesData = treemapData.slice(0, 20);
    
    // Safety check for data
    if (!topSourcesData || topSourcesData.length === 0) {
      console.warn('No source data available for treemap');
      container.innerHTML = '<div class="p-4 text-center text-slate-500">No source data available for chart</div>';
      return;
    }
    
    // Clean up any previous chart instance
    if (container.__chartInstance) {
      try {
        container.__chartInstance.destroy();
      } catch (error) {
        console.error('Error destroying previous chart:', error);
      }
    }
    
    // Log debug information
    console.log('Treemap data:', JSON.stringify(topSourcesData));
    
    // Define colors - consistent with other charts
    const chartColors = [
      '#f59e0b', // amber
      '#0ea5e9', // sky
      '#10b981', // emerald
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f97316', // orange
      '#06b6d4', // cyan
      '#14b8a6', // teal
      '#a855f7', // purple
      '#ef4444', // red
      '#3b82f6', // blue
      '#22c55e', // green
      '#eab308', // yellow
      '#d946ef', // fuchsia
      '#f43f5e'  // rose
    ];
    
    // Get base chart options
    const baseOptions = chartRenderer.getBaseChartOptions();
    
    // Create chart options with proper styling
    const options = {
      series: [{
        data: topSourcesData
      }],
      chart: {
        type: 'treemap',
        height: 400,
        fontFamily: 'Inter, sans-serif',
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      colors: chartColors,
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: true,
          shadeIntensity: 0.2,
          reverseNegativeShade: false
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          colors: ['#f8fafc'] // Light text for contrast
        },
        background: {
          enabled: true,
          foreColor: '#f8fafc',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#334155',
          opacity: 0.9
        },
        formatter: function(text, op) {
          if (!text || !op || typeof op.value === 'undefined') return '';
          return [text, utils.formatNumber(op.value)];
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        },
        fillSeriesColor: false,
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          try {
            // Safety checks
            if (!w || !w.globals || !w.globals.series || 
                !w.globals.series[0] || !w.globals.series[0].data || 
                !w.globals.series[0].data[dataPointIndex]) {
              return '';
            }
            
            const data = w.globals.series[0].data[dataPointIndex];
            if (!data || typeof data.x === 'undefined' || typeof data.y === 'undefined') {
              return '';
            }
            
            // Get proper values
            const sourceName = data.x;
            const value = data.y;
            
            // Determine color
            let color = '#f59e0b'; // Default color (amber)
            if (w.globals.colors && Array.isArray(w.globals.colors) && w.globals.colors.length > 0) {
              const colorIndex = dataPointIndex % w.globals.colors.length;
              color = w.globals.colors[colorIndex] || color;
            }
            
            // Create consistent tooltip HTML
            return `
              <div class="apexcharts-tooltip-box" style="background: #0f172a; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                <div class="apexcharts-tooltip-title" 
                     style="font-family: Inter, sans-serif; font-weight: bold; padding: 5px 10px; background: #1e293b; color: #f8fafc; border-bottom: 1px solid #334155;">
                  ${sourceName}
                </div>
                <div style="padding: 8px 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #94a3b8; font-size: 12px;">${i18n.getText('analytics.totalScore')}:</span>
                    <span style="font-weight: bold; color: ${color}; font-size: 13px;">${utils.formatNumber(value)}</span>
                  </div>
                </div>
              </div>
            `;
          } catch (error) {
            console.error('Error generating tooltip:', error);
            return '';
          }
        }
      },
      legend: {
        show: false
      },
      title: {
        text: '', // Empty title - we use HTML headings instead
        align: 'center',
        style: {
          fontSize: '16px',
          fontFamily: 'Inter, sans-serif',
          color: '#f59e0b'
        }
      }
    };
    
    // Apply base options
    Object.keys(baseOptions).forEach(key => {
      if (!options[key]) {
        options[key] = baseOptions[key];
      }
    });
    
    // Create chart instance
    const chart = new ApexCharts(container, options);
    
    // Render chart
    chart.render();
    
    // Store reference to chart instance
    container.__chartInstance = chart;
    
    return chart;
  } catch (error) {
    console.error('Error creating treemap chart:', error);
    container.innerHTML = '<div class="p-4 text-center text-slate-500">Failed to create chart: ' + error.message + '</div>';
    return null;
  }
}

/**
 * Render all sources with player score contributions as a stacked bar chart
 * Shows ALL sources with score > 0 and all player contributions
 */
export function renderTop10SourcesWithPlayers(containerId, data) {
  console.log('Rendering all sources with player score contributions');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for sources chart');
    return;
  }
  
  // Get source columns - first try columns with FROM_ prefix
  let sourceColumns = Object.keys(data[0] || {})
    .filter(key => key.startsWith('FROM_'));
  
  // If no FROM_ columns found, use non-core columns
  if (sourceColumns.length === 0) {
    console.warn('No FROM_ prefix columns found, using regular source columns');
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    sourceColumns = Object.keys(data[0] || {})
      .filter(key => !coreColumns.includes(key));
  }
  
  // Safety check if still no source columns
  if (sourceColumns.length === 0) {
    console.warn('No source columns found for chart');
    return;
  }
  
  // Calculate total score for each source
  const sourceTotals = {};
  sourceColumns.forEach(column => {
    sourceTotals[column] = data.reduce((sum, player) => sum + (player[column] || 0), 0);
  });
  
  // Get all sources with score > 0 and sort by total score
  const sourcesWithScore = Object.entries(sourceTotals)
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Format source names for display
  const sourceNames = sourcesWithScore.map(column => 
    column.startsWith('FROM_') ? column.replace('FROM_', '') : column
  );
  
  // Group player contributions by source
  const sourceContributions = {};
  
  sourcesWithScore.forEach(column => {
    // Get all players with points for this source
    const playersWithPoints = data
      .filter(player => player[column] > 0)
      .map(player => ({
        name: player.PLAYER,
        score: player[column]
      }))
      .sort((a, b) => b.score - a.score);
    
    sourceContributions[column] = playersWithPoints;
  });
  
  // Build data for stacked bar chart
  // First, collect all unique players across all sources
  const allPlayers = new Set();
  
  sourcesWithScore.forEach(column => {
    sourceContributions[column].forEach(player => {
      allPlayers.add(player.name);
    });
  });
  
  // Convert to array and limit to a reasonable number to prevent overcrowding
  // (Max 25 players for visualization clarity)
  const uniquePlayers = Array.from(allPlayers);
  
  // If we have too many players, we'll group the smallest contributors as "Others"
  const MAX_PLAYERS_TO_SHOW = 25;
  const showOthersCategory = uniquePlayers.length > MAX_PLAYERS_TO_SHOW;
  
  // For each player, create a series with their contribution to each source
  const seriesData = [];
  const playerColors = [
    '#f59e0b', // amber-500 
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
    '#06b6d4', // cyan-500
    '#14b8a6', // teal-500
    '#a855f7', // purple-500
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#eab308', // yellow-500
    '#d946ef', // fuchsia-500
    '#f43f5e', // rose-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#3b82f6', // blue-500
    '#f97316', // orange-500
    '#a855f7', // purple-500
    '#14b8a6'  // teal-500
  ];
  
  // Calculate total contribution for each player across all sources
  const playerTotals = {};
  uniquePlayers.forEach(playerName => {
    let total = 0;
    sourcesWithScore.forEach(column => {
      const player = sourceContributions[column].find(p => p.name === playerName);
      if (player) {
        total += player.score;
      }
    });
    playerTotals[playerName] = total;
  });
  
  // Sort players by their total contribution
  const sortedPlayers = uniquePlayers
    .sort((a, b) => playerTotals[b] - playerTotals[a]);
  
  // Take top players and create "Others" for the rest if needed
  const topPlayers = sortedPlayers.slice(0, MAX_PLAYERS_TO_SHOW);
  
  // For each top player, create a series
  topPlayers.forEach((playerName, index) => {
    const playerData = [];
    
    // For each source, get this player's contribution
    sourcesWithScore.forEach(column => {
      const player = sourceContributions[column].find(p => p.name === playerName);
      playerData.push(player ? player.score : 0);
    });
    
    seriesData.push({
      name: playerName,
      data: playerData
    });
  });
  
  // If we're showing "Others", calculate their contributions
  if (showOthersCategory) {
    const otherPlayers = sortedPlayers.slice(MAX_PLAYERS_TO_SHOW);
    const othersData = [];
    
    // For each source, sum up the contributions of other players
    sourcesWithScore.forEach(column => {
      let othersSum = 0;
      
      sourceContributions[column].forEach(player => {
        if (otherPlayers.includes(player.name)) {
          othersSum += player.score;
        }
      });
      
      othersData.push(othersSum);
    });
    
    // Add "Others" series if there are any contributions
    if (othersData.some(value => value > 0)) {
      seriesData.push({
        name: i18n.getText('analytics.others'),
        data: othersData
      });
    }
  }
  
  // Chart options
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      height: 550,
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      toolbar: {
        show: true
      }
    },
    colors: playerColors,
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '85%',
        borderRadius: 2,
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 0
    },
    xaxis: {
      categories: sourceNames,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#cbd5e1' // Matching dashboard text
        }
      },
      title: {
        text: i18n.getText('analytics.totalScore'),
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: '#cbd5e1'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#cbd5e1' // Matching dashboard text
        }
      }
    },
    tooltip: {
      theme: 'dark',
      shared: false,
      intersect: true,
      followCursor: true,
      x: {
        show: true
      },
      y: {
        formatter: function(val, opts) {
          if (val <= 0) return ''; // Don't show players with 0 score
          // Add safety check for opts.w.globals.seriesPercent
          if (!opts || !opts.w || !opts.w.globals || !opts.w.globals.seriesPercent || 
              !opts.w.globals.seriesPercent[opts.seriesIndex] || 
              typeof opts.w.globals.seriesPercent[opts.seriesIndex][opts.dataPointIndex] === 'undefined') {
            return utils.formatNumber(val);
          }
          const percent = opts.w.globals.seriesPercent[opts.seriesIndex][opts.dataPointIndex];
          return utils.formatNumber(val) + ' (' + percent.toFixed(1) + '%)';
        }
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        // Add safety checks
        if (!sourceNames || !sourceNames[dataPointIndex] || 
            !w || !w.globals || !w.globals.seriesNames || !w.globals.seriesNames[seriesIndex] ||
            !series || !series[seriesIndex] || typeof series[seriesIndex][dataPointIndex] === 'undefined') {
          return '';
        }
        
        const sourceName = sourceNames[dataPointIndex];
        const playerName = w.globals.seriesNames[seriesIndex];
        const value = series[seriesIndex][dataPointIndex];
        
        // Skip showing 0 values in tooltip
        if (value <= 0) return '';
        
        // Calculate percentage with safety checks
        let totalSourceValue = 0;
        let percent = 0;
        
        if (series && Array.isArray(series)) {
          // Safely calculate the total
          for (let i = 0; i < series.length; i++) {
            if (series[i] && typeof series[i][dataPointIndex] === 'number') {
              totalSourceValue += series[i][dataPointIndex];
            }
          }
          
          // Calculate percentage if we have a valid total
          if (totalSourceValue > 0) {
            percent = (value / totalSourceValue) * 100;
          }
        }
        
        // Get player color with safety check
        const playerColor = (w && w.globals && w.globals.colors && w.globals.colors[seriesIndex]) 
          ? w.globals.colors[seriesIndex] 
          : '#f59e0b'; // Default to amber if color not available
        
        // Create tooltip content with only the specific player being hovered
        const tooltipContent = `
          <div class="apexcharts-tooltip-title" style="font-family: Inter, sans-serif; font-size: 13px; padding: 6px 10px; background: #1e293b; border-bottom: 1px solid #334155;">${sourceName}</div>
          <div style="padding: 8px 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 2px;">
              <span style="display: inline-block; width: 10px; height: 10px; margin-right: 8px; background-color: ${playerColor}; border-radius: 50%;"></span>
              <span style="font-weight: 700; margin-right: 5px;">${playerName}:</span>
              <span>${utils.formatNumber(value)}</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; margin-left: 18px;">
              ${percent.toFixed(1)}% of source total
            </div>
          </div>
        `;
        
        return tooltipContent;
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
      borderRadius: 4,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
    },
    legend: {
      show: false
    },
    grid: {
      borderColor: '#334155', // Matching dashboard grid lines
      strokeDashArray: 2
    }
  };
  
  // Check if we have many sources and adjust height if needed
  if (sourceNames.length > 15) {
    options.chart.height = Math.min(800, 350 + (sourceNames.length * 20)); // Dynamic height based on source count
  }
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Get base chart options and merge them
  const baseOptions = chartRenderer.getBaseChartOptions();
  const mergedOptions = {};
  
  // Manually merge options to avoid spread operator issues
  Object.keys(baseOptions).forEach(key => {
    mergedOptions[key] = baseOptions[key];
  });
  
  Object.keys(options).forEach(key => {
    mergedOptions[key] = options[key];
  });
  
  // Finalize chart
  mergedOptions.series = seriesData;
  mergedOptions.title = {
    text: '', // Remove redundant title
    align: 'center',
    style: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      color: '#f8fafc' // Light color for dark background
    }
  };
  
  const chart = new ApexCharts(container, mergedOptions);
  chart.render();
  container.__chartInstance = chart;
}

/**
 * Render all sources by score (only sources with points) as a horizontal bar chart
 */
export function renderAllSourcesByScore(containerId, data) {
  console.log('Rendering all sources by score as horizontal bars');
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data available for sources by score chart');
    return;
  }
  
  // Get source columns - first try columns with FROM_ prefix
  let sourceColumns = Object.keys(data[0] || {})
    .filter(key => key.startsWith('FROM_'));
  
  // If no FROM_ columns found, use non-core columns
  if (sourceColumns.length === 0) {
    console.warn('No FROM_ prefix columns found, using regular source columns');
    const coreColumns = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    sourceColumns = Object.keys(data[0] || {})
      .filter(key => !coreColumns.includes(key));
  }
  
  // Safety check if still no source columns
  if (sourceColumns.length === 0) {
    console.warn('No source columns found for chart');
    return;
  }
  
  // Calculate total score for each source
  const sourceScores = sourceColumns.map(column => {
    const totalScore = data.reduce((sum, player) => sum + (player[column] || 0), 0);
    return {
      name: column.startsWith('FROM_') ? column.replace('FROM_', '') : column,
      score: totalScore
    };
  });
  
  // Filter sources with points and sort by score
  const filteredSources = sourceScores
    .filter(source => source.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Prepare data for chart
  const categories = filteredSources.map(source => source.name);
  const seriesData = [{
    name: i18n.getText('analytics.totalScore'),
    data: filteredSources.map(source => source.score)
  }];
  
  // Generate color palette with gradient effect
  const generateColorPalette = (count) => {
    // Vibrant colors array
    const colorGroups = [
      ['#f59e0b', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'], // amber
      ['#0ea5e9', '#38bdf8', '#7dd3fc', '#0ea5e9', '#0284c7'], // sky
      ['#10b981', '#34d399', '#6ee7b7', '#10b981', '#059669'], // emerald
      ['#8b5cf6', '#a78bfa', '#c4b5fd', '#8b5cf6', '#7c3aed'], // violet
      ['#f97316', '#fb923c', '#fdba74', '#f97316', '#ea580c'], // orange
      ['#ec4899', '#f472b6', '#f9a8d4', '#ec4899', '#db2777'], // pink
    ];
    
    const colors = [];
    let groupIndex = 0;
    
    for (let i = 0; i < count; i++) {
      const colorGroup = colorGroups[groupIndex % colorGroups.length];
      colors.push(colorGroup[i % colorGroup.length]);
      
      // Switch to next color group every few items
      if (i > 0 && i % 5 === 0) {
        groupIndex++;
      }
    }
    
    return colors;
  };
  
  // Create chart options
  const options = {
    chart: {
      type: 'bar',
      height: 400,
      background: 'transparent',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '80%',
        distributed: true, // Enable for color variation
        dataLabels: {
          position: 'center'
        },
        borderRadius: 2
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#cbd5e1' // Matching dashboard text
        }
      },
      title: {
        text: i18n.getText('analytics.totalScore'),
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: '#cbd5e1'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#cbd5e1' // Matching dashboard text
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(val) {
          return utils.formatNumber(val);
        }
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
      borderRadius: 4,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
    },
    grid: {
      borderColor: '#334155', // Matching dashboard grid lines
      strokeDashArray: 2
    },
    colors: generateColorPalette(filteredSources.length)
  };
  
  // Create chart
  if (container.__chartInstance) {
    container.__chartInstance.destroy();
  }
  
  // Get base chart options
  const baseOptions = chartRenderer.getBaseChartOptions();
  const mergedOptions = {};
  
  // Manually merge options to avoid spread operator issues
  Object.keys(baseOptions).forEach(key => {
    mergedOptions[key] = baseOptions[key];
  });
  
  Object.keys(options).forEach(key => {
    mergedOptions[key] = options[key];
  });
  
  // Finalize chart
  mergedOptions.series = seriesData;
  mergedOptions.title = {
    text: '', // Remove redundant title
    align: 'center',
    style: {
      fontSize: '16px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      color: '#f8fafc' // Light color for dark background
    }
  };
  
  const chart = new ApexCharts(container, mergedOptions);
  chart.render();
  container.__chartInstance = chart;
} 