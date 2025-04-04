/**
 * Chart Renderer Module
 * 
 * Responsible for rendering charts in the application
 */

import * as i18n from '../i18n.js';

/**
 * Chart Registry to keep track of all charts
 */
export const chartRegistry = {};

/**
 * Get common base options for all charts
 * @param {string} theme - Optional theme name (light or dark)
 * @returns {Object} Base chart options
 */
export function getBaseChartOptions(theme = 'dark') {
  const isDark = theme === 'dark';
  
  return {
    chart: {
      background: 'transparent',
      foreColor: isDark ? '#cbd5e1' : '#334155',
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
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      },
      theme: isDark ? 'dark' : 'light'
    },
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      itemMargin: {
        horizontal: 10
      }
    },
    dataLabels: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        colors: [isDark ? '#ffffff' : '#000000']
      },
      background: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    grid: {
      borderColor: isDark ? '#334155' : '#e2e8f0',
      strokeDashArray: 2
    },
    xaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      axisBorder: {
        show: true,
        color: isDark ? '#475569' : '#cbd5e1'
      },
      axisTicks: {
        show: true,
        color: isDark ? '#475569' : '#cbd5e1'
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    markers: {
      size: 4,
      strokeWidth: 0
    }
  };
}

/**
 * Create donut chart
 * @param {string} containerId - ID of the container element
 * @param {Array} series - Data series
 * @param {Array} labels - Chart labels
 * @param {string} title - Chart title
 * @returns {Object} ApexCharts instance
 */
export function createDonutChart(containerId, series, labels, title) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
    console.error(`Container element #${containerId} not found`);
    return null;
  }
  
  // Clear container
  chartContainer.innerHTML = '';
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: series,
    labels: labels,
    chart: {
      ...getBaseChartOptions().chart,
      type: 'donut',
      height: 400
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#cbd5e1'
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 320
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    subtitle: {
      text: '',
      show: false,
      floating: true,
      offsetY: 0,
      style: {
        fontSize: '0px'
      }
    }
  };
  
  // Create chart
  const chart = new ApexCharts(chartContainer, options);
  
  // Register chart
  chartRegistry[containerId] = chart;
  
  // Render chart
  chart.render();
  
  return chart;
}

/**
 * Create bar chart
 * @param {string} containerId - ID of the container element
 * @param {Array} series - Data series
 * @param {Array} categories - X-axis categories
 * @param {string} title - Chart title
 * @returns {Object} ApexCharts instance
 */
export function createBarChart(containerId, series, categories, title) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
    console.error(`Container element #${containerId} not found`);
    return null;
  }
  
  // Clear container
  chartContainer.innerHTML = '';
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: series,
    chart: {
      ...getBaseChartOptions().chart,
      type: 'bar',
      height: 400,
      stacked: series.length > 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      ...getBaseChartOptions().xaxis,
      categories: categories
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    subtitle: {
      text: '',
      show: false,
      floating: true,
      offsetY: 0,
      style: {
        fontSize: '0px'
      }
    }
  };
  
  // Create chart
  const chart = new ApexCharts(chartContainer, options);
  
  // Register chart
  chartRegistry[containerId] = chart;
  
  // Render chart
  chart.render();
  
  return chart;
}

/**
 * Create scatter chart
 * @param {string} containerId - ID of the container element
 * @param {Array} data - Data points as [x, y] pairs
 * @param {string} title - Chart title
 * @param {string} xAxisTitle - X-axis title
 * @param {string} yAxisTitle - Y-axis title
 * @returns {Object} ApexCharts instance
 */
export function createScatterChart(containerId, data, title, xAxisTitle, yAxisTitle) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
    console.error(`Container element #${containerId} not found`);
    return null;
  }
  
  // Clear container
  chartContainer.innerHTML = '';
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: [{
      name: i18n.getText('table.headerPlayers'),
      data: data
    }],
    chart: {
      ...getBaseChartOptions().chart,
      type: 'scatter',
      height: 400,
      zoom: {
        enabled: true,
        type: 'xy'
      }
    },
    xaxis: {
      ...getBaseChartOptions().xaxis,
      title: {
        text: xAxisTitle,
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      tickAmount: 10
    },
    yaxis: {
      ...getBaseChartOptions().yaxis,
      title: {
        text: yAxisTitle,
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      tickAmount: 7
    },
    title: {
      text: title,
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    subtitle: {
      text: '',
      show: false,
      floating: true,
      offsetY: 0,
      style: {
        fontSize: '0px'
      }
    }
  };
  
  // Create chart
  const chart = new ApexCharts(chartContainer, options);
  
  // Register chart
  chartRegistry[containerId] = chart;
  
  // Render chart
  chart.render();
  
  return chart;
}
