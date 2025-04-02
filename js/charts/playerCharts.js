/**
 * playerCharts.js
 *
 * Description: Chart rendering for player-related visualizations
 * Usage:
 *     Import directly: import { renderPlayerChart } from './charts/playerCharts.js';
 */

import { getChartBaseOptions } from './chartConfig.js';
import { createChart, destroyChart } from './chartUtils.js';
import { getText } from '../i18n.js';

/**
 * Render a radar chart showing player skills
 * @param {Object} playerData - The player data object
 * @param {string} containerId - The ID of the container element
 * @param {string} [instanceKey] - Optional key for the chart instance
 * @returns {Object|null} The chart instance or null on error
 */
export function renderPlayerChart(playerData, containerId, instanceKey = null) {
  try {
    console.log(`Rendering player chart for ${playerData?.name || 'unknown player'} in #${containerId}`);
    
    // Use unique key for chart instance
    const chartKey = instanceKey || 'playerChart';
    
    if (!playerData) {
      console.error("No player data provided for player chart");
      return null;
    }
    
    // Define skill categories to display
    const skillCategories = [
      { key: 'skillTechnique', label: getText('charts.skillTechnique') || 'Technique' },
      { key: 'skillCreativity', label: getText('charts.skillCreativity') || 'Creativity' },
      { key: 'skillPresentation', label: getText('charts.skillPresentation') || 'Presentation' },
      { key: 'skillEfficiency', label: getText('charts.skillEfficiency') || 'Efficiency' },
      { key: 'skillInnovation', label: getText('charts.skillInnovation') || 'Innovation' },
      { key: 'skillConsistency', label: getText('charts.skillConsistency') || 'Consistency' }
    ];
    
    // Get skill values, defaulting to 0 for missing skills
    const skillValues = skillCategories.map(category => 
      playerData[category.key] !== undefined ? playerData[category.key] : 0
    );
    
    // Get skill labels
    const skillLabels = skillCategories.map(category => category.label);
    
    // Format data for ApexCharts
    const chartSeries = [{
      name: playerData.name || getText('charts.player') || 'Player',
      data: skillValues
    }];
    
    // Get base options and customize for radar chart
    const baseOptions = getChartBaseOptions();
    const options = {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'radar',
        height: containerId.includes('modal') ? 450 : 300,
        toolbar: {
          ...baseOptions.chart.toolbar,
          tools: {
            ...baseOptions.chart.toolbar.tools,
            download: true,
            selection: false,
            zoom: false
          }
        }
      },
      series: chartSeries,
      labels: skillLabels,
      xaxis: {
        labels: {
          show: true,
          style: {
            colors: Array(skillLabels.length).fill(
              `hsl(${baseOptions.chart.foreColor || '210 40% 96.1%'})`
            ),
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        show: false,
        min: 0,
        max: 100
      },
      plotOptions: {
        radar: {
          size: undefined,
          offsetX: 0,
          offsetY: 0,
          polygons: {
            strokeColors: `hsla(${baseOptions.grid.borderColor || 'var(--border)'}, 0.3)`,
            strokeWidth: 1,
            connectorColors: `hsla(${baseOptions.grid.borderColor || 'var(--border)'}, 0.3)`,
            fill: {
              colors: undefined
            }
          }
        }
      },
      fill: {
        opacity: 0.2
      },
      stroke: {
        width: 2,
        show: true
      },
      markers: {
        size: 4,
        hover: {
          size: 6
        }
      },
      tooltip: {
        ...baseOptions.tooltip,
        y: {
          formatter: (value) => value ? `${value}/100` : '0/100'
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      }
    };
    
    // Create and render the chart
    const chart = createChart(containerId, options, chartKey);
    
    return chart;
  } catch (error) {
    console.error(`Error rendering player chart:`, error);
    return null;
  }
} 