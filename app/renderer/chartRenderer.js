/**
 * Chart Renderer Module
 * 
 * Responsible for rendering charts in the application
 */

import * as i18n from '../i18n.js';
import * as utils from '../utils.js';

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
        },
        export: {
          csv: {
            filename: 'chart-data-export',
            headerCategory: 'Category',
            headerValue: 'Value'
          },
          svg: {
            filename: 'chart-export'
          },
          png: {
            filename: 'chart-export'
          }
        },
        autoSelected: 'zoom',
        // Toolbar styling
        colors: {
          tools: {
            download: isDark ? '#94a3b8' : '#334155',
            selection: isDark ? '#94a3b8' : '#334155',
            zoom: isDark ? '#94a3b8' : '#334155',
            zoomin: isDark ? '#94a3b8' : '#334155',
            zoomout: isDark ? '#94a3b8' : '#334155',
            pan: isDark ? '#94a3b8' : '#334155',
            reset: isDark ? '#94a3b8' : '#334155'
          }
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
      },
      padding: {
        top: 20,
        right: 10,
        bottom: 10,
        left: 10
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
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
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
      strokeDashArray: 2,
      padding: {
        top: 20,
        right: 10,
        bottom: 10,
        left: 10
      }
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
 * @param {string} title - Chart title (not used internally, but kept for API consistency)
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
      height: 400,
      padding: {
        top: 30,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
          labels: {
            show: false,
            total: {
              show: false,
              showAlways: false,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: '#cbd5e1'
            },
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: 'Inter, sans-serif',
      itemMargin: {
        horizontal: 10
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350
          },
          legend: {
            position: 'bottom',
            fontSize: '12px',
            itemMargin: {
              horizontal: 8
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280
          },
          legend: {
            position: 'bottom',
            fontSize: '11px',
            offsetY: 0,
            itemMargin: {
              horizontal: 6,
              vertical: 3
            }
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%' // Larger hole for better appearance on small screens
              }
            }
          }
        }
      }
    ],
    title: {
      text: '',
      show: false
    },
    subtitle: {
      text: '',
      show: false
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
 * @param {string} title - Chart title (not used internally, but kept for API consistency)
 * @param {Array} customColors - Optional array of colors to use for the bars
 * @returns {Object} ApexCharts instance
 */
export function createBarChart(containerId, series, categories, title, customColors) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
    console.error(`Container element #${containerId} not found`);
    return null;
  }
  
  // Clear container
  chartContainer.innerHTML = '';
  
  // Default color palette that matches the app theme
  const defaultColors = [
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
    '#84cc16', // lime-500
    '#f43f5e'  // rose-500
  ];
  
  // Use custom colors if provided, otherwise use default palette
  const colors = customColors || defaultColors;
  
  // Single series bar chart with distributed colors
  const isSingleSeries = series.length === 1;
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: series,
    colors: colors,
    chart: {
      ...getBaseChartOptions().chart,
      type: 'bar',
      height: 400,
      stacked: series.length > 1,
      padding: {
        top: 30,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 2,
        dataLabels: {
          position: 'top'
        },
        distributed: isSingleSeries, // Use different colors for each bar when single series
      }
    },
    legend: {
      show: !isSingleSeries, // Hide legend for distributed single series
    },
    xaxis: {
      ...getBaseChartOptions().xaxis,
      categories: categories
    },
    title: {
      text: '',
      show: false
    },
    subtitle: {
      text: '',
      show: false
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350
          },
          plotOptions: {
            bar: {
              columnWidth: '80%' // Wider bars on medium screens
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              },
              // Rotate labels for better fit on smaller screens
              rotate: -45,
              rotateAlways: false,
              hideOverlappingLabels: true,
              trim: true
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280
          },
          plotOptions: {
            bar: {
              columnWidth: '90%' // Even wider on small screens
            }
          },
          dataLabels: {
            enabled: false // Hide data labels on small screens to reduce clutter
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '9px'
              },
              rotate: -45,
              rotateAlways: true,
              trim: true,
              maxHeight: 50
            }
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }
    ]
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
 * @param {Array} data - Data points as [x, y, playerName] arrays
 * @param {string} title - Chart title (not used internally, but kept for API consistency)
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

  // Find min and max score values to create a color gradient
  let minScore = Infinity;
  let maxScore = -Infinity;
  
  data.forEach(point => {
    const score = point[1];
    if (score < minScore) minScore = score;
    if (score > maxScore) maxScore = score;
  });
  
  // Define color ranges for different score brackets
  const colorPalette = [
    '#10b981', // emerald-500 (lowest 20%)
    '#0ea5e9', // sky-500 (20-40%)
    '#8b5cf6', // violet-500 (40-60%)
    '#f59e0b', // amber-500 (60-80%)
    '#ef4444'  // red-500 (highest 20%)
  ];
  
  // Create different series for each color range
  const seriesData = [];
  
  // Calculate range size
  const rangeSize = (maxScore - minScore) / colorPalette.length;
  
  // Create a series for each color range
  for (let i = 0; i < colorPalette.length; i++) {
    const rangeMin = minScore + (rangeSize * i);
    const rangeMax = i === colorPalette.length - 1 ? maxScore : minScore + (rangeSize * (i + 1));
    
    // Filter data points that fall within this range
    const rangeData = data.filter(point => {
      const score = point[1];
      return score >= rangeMin && (score < rangeMax || i === colorPalette.length - 1 && score <= rangeMax);
    }).map(point => {
      return {
        x: point[0], // chest count
        y: point[1], // score
        playerName: point[2] || 'Unknown' // player name
      };
    });
    
    // Only add non-empty series
    if (rangeData.length > 0) {
      seriesData.push({
        name: '', // Empty to hide from legend
        data: rangeData,
        color: colorPalette[i]
      });
    }
  }
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: seriesData,
    chart: {
      ...getBaseChartOptions().chart,
      type: 'scatter',
      height: 400,
      zoom: {
        enabled: true,
        type: 'xy'
      },
      padding: {
        top: 30,
        right: 10,
        bottom: 10,
        left: 10
      }
    },
    legend: {
      show: false // Hide the legend
    },
    markers: {
      size: 7,
      strokeWidth: 1,
      fillOpacity: 0.85,
      shape: 'circle',
      hover: {
        size: 9,
        sizeOffset: 2
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const dataPoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const seriesColor = w.globals.colors[seriesIndex];
        
        return `<div class="apexcharts-tooltip-box" style="background: #0f172a; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                  <div class="apexcharts-tooltip-title" 
                       style="font-family: Inter, sans-serif; font-weight: bold; padding: 5px 10px; background: #1e293b; color: #f8fafc; border-bottom: 1px solid #334155;">
                    ${dataPoint.playerName}
                  </div>
                  <div style="padding: 8px 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #94a3b8;">${xAxisTitle}:</span>
                      <span style="font-weight: bold; color: #f59e0b;">${utils.formatNumber(dataPoint.x)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #94a3b8;">${i18n.getCurrentLanguage() === 'de' ? 'Punkte' : 'Score'}:</span>
                      <span style="font-weight: bold; color: ${seriesColor};">${utils.formatNumber(dataPoint.y)}</span>
                    </div>
                  </div>
                </div>`;
      },
      marker: {
        show: false
      },
      fixed: {
        enabled: false
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
      tickAmount: 10,
      tooltip: {
        enabled: false
      }
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
      tickAmount: 7,
      tooltip: {
        enabled: false
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 350
          },
          markers: {
            size: 6,
            hover: {
              size: 8
            }
          },
          xaxis: {
            tickAmount: 6,
            title: {
              style: {
                fontSize: '11px'
              }
            }
          },
          yaxis: {
            tickAmount: 5,
            title: {
              style: {
                fontSize: '11px'
              }
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 260
          },
          markers: {
            size: 5,
            hover: {
              size: 7,
              sizeOffset: 1
            }
          },
          tooltip: {
            // Simplified tooltip for mobile
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              const dataPoint = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
              return `<div style="background:#0f172a;border:1px solid #334155;padding:6px 8px;font-size:11px;">
                <b>${dataPoint.playerName}</b><br>
                ${xAxisTitle}: ${utils.formatNumber(dataPoint.x)}<br>
                ${i18n.getCurrentLanguage() === 'de' ? 'Punkte' : 'Score'}: ${utils.formatNumber(dataPoint.y)}
              </div>`;
            }
          },
          xaxis: {
            tickAmount: 4,
            title: {
              text: xAxisTitle,
              style: {
                fontSize: '10px'
              }
            },
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          },
          yaxis: {
            tickAmount: 4,
            title: {
              text: yAxisTitle,
              style: {
                fontSize: '10px'
              }
            },
            labels: {
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }
    ],
    title: {
      text: '',
      show: false
    },
    subtitle: {
      text: '',
      show: false
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
 * Create radar chart
 * @param {string} containerId - ID of the container element
 * @param {Array} series - Data series
 * @param {Array} categories - Radar chart categories
 * @param {string} title - Chart title
 * @returns {Object} ApexCharts instance
 */
export function createRadarChart(containerId, series, categories, title) {
  const chartContainer = document.getElementById(containerId);
  if (!chartContainer) {
    console.error(`Container element #${containerId} not found`);
    return null;
  }
  
  // Clear container
  chartContainer.innerHTML = '';
  
  // Color palette for radar chart series
  const colors = ['#f59e0b', '#0ea5e9']; // Primary color (amber) and secondary (sky blue)
  
  // Create chart options
  const options = {
    ...getBaseChartOptions(),
    series: series,
    colors: colors,
    chart: {
      ...getBaseChartOptions().chart,
      type: 'radar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColors: '#334155',
          connectorColors: '#334155',
          fill: {
            colors: ['#1e293b', '#0f172a']
          }
        }
      }
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        style: {
          colors: Array(categories.length).fill('#cbd5e1'),
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif'
        },
        formatter: function(val) {
          // Wrap long text to avoid overlap, but allow more characters
          if (val.length > 20) {
            return val.substring(0, 18) + '...';
          }
          return val;
        }
      }
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function(val) {
          return utils.formatNumber(val);
        }
      }
    },
    fill: {
      opacity: 0.3
    },
    stroke: {
      width: 2
    },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#334155',
        padding: 2
      },
      style: {
        fontSize: '10px',
        fontWeight: 'bold'
      },
      formatter: function(val) {
        return utils.formatNumber(val);
      },
      offsetY: -5
    },
    legend: {
      show: false // Always hide the legend for radar charts
    },
    title: {
      text: title || '',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#f59e0b'
      }
    },
    tooltip: {
      custom: function({series, seriesIndex, dataPointIndex, w}) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const value = series[seriesIndex][dataPointIndex];
        const category = categories[dataPointIndex];
        
        return `<div class="apexcharts-tooltip-box" style="background: #0f172a; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                  <div class="apexcharts-tooltip-title" 
                       style="font-family: Inter, sans-serif; font-weight: bold; padding: 5px 10px; background: #1e293b; color: #f8fafc; border-bottom: 1px solid #334155;">
                    ${category}
                  </div>
                  <div style="padding: 8px 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <span style="color: #94a3b8; font-size: 12px;">${seriesName}:</span>
                      <span style="font-weight: bold; color: ${colors[seriesIndex]}; font-size: 13px;">${utils.formatNumber(value)}</span>
                    </div>
                  </div>
                </div>`;
      }
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            radar: {
              size: 120
            }
          },
          markers: {
            size: 3
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              },
              formatter: function(val) {
                if (val.length > 12) {
                  return val.substring(0, 10) + '...';
                }
                return val;
              }
            }
          },
          dataLabels: {
            style: {
              fontSize: '9px'
            }
          },
          title: {
            style: {
              fontSize: '14px'
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 260
          },
          plotOptions: {
            radar: {
              size: 90
            }
          },
          markers: {
            size: 2,
            hover: {
              size: 4
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '8px'
              },
              formatter: function(val) {
                if (val.length > 8) {
                  return val.substring(0, 6) + '...';
                }
                return val;
              }
            }
          },
          yaxis: {
            labels: {
              formatter: function(val) {
                return val.toFixed(0);
              },
              style: {
                fontSize: '8px'
              }
            }
          },
          dataLabels: {
            enabled: window.innerWidth > 360, // Disable data labels on very small screens
            style: {
              fontSize: '8px'
            },
            offsetY: -3
          },
          title: {
            style: {
              fontSize: '12px'
            }
          },
          tooltip: {
            // Simplified tooltip for mobile
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              const value = series[seriesIndex][dataPointIndex];
              const category = categories[dataPointIndex];
              return `<div style="background:#0f172a;border:1px solid #334155;padding:6px 8px;font-size:10px;">
                <b>${category}</b>: ${utils.formatNumber(value)}
              </div>`;
            }
          }
        }
      }
    ]
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
 * Initialize custom tooltips for ApexCharts toolbar
 * This function should be called after the DOM is loaded
 */
export function initializeChartTooltips() {
  // Create tooltip element if it doesn't exist
  let tooltip = document.querySelector('.apexcharts-toolbar-custom-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'apexcharts-toolbar-custom-tooltip';
    tooltip.style.opacity = '0';
    document.body.appendChild(tooltip);
  }
  
  // Find all chart containers and setup tooltips for each
  const chartContainers = document.querySelectorAll('[id$="-chart-container"]');
  chartContainers.forEach(container => {
    // Wait for ApexCharts to be initialized
    setTimeout(() => {
      setupToolbarTooltips(container, tooltip);
      setupMenuObserver(container);
    }, 500);
  });
  
  // Setup tooltips for modal chart container
  const modalChartContainer = document.getElementById('modal-chart-container');
  if (modalChartContainer) {
    // For modal charts, we need to setup tooltips each time the modal is shown
    const chartModal = document.getElementById('chart-modal');
    if (chartModal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class' && 
              !chartModal.classList.contains('hidden')) {
            setTimeout(() => {
              setupToolbarTooltips(modalChartContainer, tooltip);
              setupMenuObserver(modalChartContainer);
            }, 500);
          }
        });
      });
      
      observer.observe(chartModal, { attributes: true });
    }
  }
}

/**
 * Setup observer for menu open/close to manually style the menu
 * @param {HTMLElement} container - Chart container element
 */
function setupMenuObserver(container) {
  // Find menu icon button
  const menuButton = container.querySelector('.apexcharts-menu-icon');
  if (!menuButton) return;
  
  // Add click handler to style menu when it opens
  menuButton.addEventListener('click', () => {
    // Give time for menu to be added to DOM
    setTimeout(() => {
      styleApexMenu();
    }, 10);
  });
  
  // Also observe the body for menu additions
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.classList && node.classList.contains('apexcharts-menu')) {
            styleApexMenu();
            break;
          }
        }
      }
    });
  });
  
  bodyObserver.observe(document.body, { 
    childList: true,
    subtree: true
  });
}

/**
 * Apply styles to ApexCharts menu directly via JavaScript
 */
function styleApexMenu() {
  const menus = document.querySelectorAll('.apexcharts-menu');
  if (!menus.length) return;
  
  menus.forEach(menu => {
    // Force dark styles on menu
    Object.assign(menu.style, {
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      border: '1px solid #334155',
      borderRadius: '4px',
      padding: '4px 0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
    });
    
    // Style all menu items
    const menuItems = menu.querySelectorAll('.apexcharts-menu-item');
    menuItems.forEach(item => {
      Object.assign(item.style, {
        backgroundColor: 'transparent',
        color: '#e2e8f0',
        padding: '6px 12px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        transition: 'background-color 0.15s ease'
      });
      
      // Add hover effect
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#1e293b';
        item.style.color = '#f8fafc';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
        item.style.color = '#e2e8f0';
      });
    });
  });
}

/**
 * Setup toolbar tooltips for a specific chart container
 * @param {HTMLElement} container - Chart container element
 * @param {HTMLElement} tooltip - Tooltip element
 */
function setupToolbarTooltips(container, tooltip) {
  // Find all toolbar buttons in the container
  const toolbarButtons = container.querySelectorAll('.apexcharts-toolbar .apexcharts-toolbar-icon');
  
  toolbarButtons.forEach(button => {
    // Remove title attribute to prevent native tooltips
    const title = button.getAttribute('title');
    if (title) {
      button.dataset.title = title;
      button.removeAttribute('title');
    }
    
    // Add mouse event listeners
    button.addEventListener('mouseenter', (e) => {
      const title = button.dataset.title;
      if (!title) return;
      
      tooltip.textContent = title;
      tooltip.style.opacity = '1';
      
      // Position the tooltip
      const rect = button.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
    });
    
    button.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// Initialize tooltips when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeChartTooltips();
});

// Also call initialize immediately if the document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initializeChartTooltips, 100);
}
