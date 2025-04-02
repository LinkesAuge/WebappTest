/**
 * config.js
 *
 * Description: Configuration values and constants for the application
 * Usage:
 *     Import directly: import { CSV_PATH } from './config.js';
 */

/**
 * Path to the CSV data file
 * @constant {string}
 */
export const CSV_PATH = './data.csv';

/**
 * Path to the rules CSV file
 * @constant {string}
 */
export const RULES_PATH = './rules.csv';

/**
 * Default language for the application
 * @constant {string}
 */
export const DEFAULT_LANGUAGE = 'de';

/**
 * LocalStorage key for storing application data
 * @constant {string}
 */
export const LOCALSTORAGE_DATA_KEY = 'tbAnalyzerStoredData_Client_v2_Static';

/**
 * LocalStorage key for storing language preference
 * @constant {string}
 */
export const LANG_STORAGE_KEY = 'tbAnalyzerLanguage';

/**
 * Chart color themes
 * @constant {Object}
 */
export const CHART_COLORS = {
  primary: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  secondary: ['#FF9E80', '#80D8FF', '#CCFF90', '#B388FF', '#EA80FC']
};

/**
 * Gets ApexCharts base configuration
 * @param {string} chartType - The type of chart ('pie', 'bar', 'line', etc.)
 * @returns {Object} ApexCharts configuration object
 */
export function getChartBaseOptions(chartType) {
  const isDarkMode = true; // Hardcoded for now, could be dynamic based on system preference

  // Base chart options that apply to all chart types
  const baseOptions = {
    chart: {
      type: chartType,
      fontFamily: 'Inter, sans-serif',
      background: 'transparent',
      foreColor: '#f8fafc', // slate-100 - for text elements
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
    colors: CHART_COLORS.primary,
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
      palette: 'palette1',
      monochrome: {
        enabled: false
      }
    },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? 'dark' : 'light',
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 350
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Chart-specific options
  switch (chartType) {
    case 'pie':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'pie'
        },
        labels: [], // Will be filled with data
        dataLabels: {
          enabled: true,
          formatter: function(val) {
            return val.toFixed(1) + '%';
          },
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%'
            }
          }
        }
      };
    
    case 'bar':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'bar'
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
            endingShape: 'rounded',
            borderRadius: 4
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: [], // Will be filled with data
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        yaxis: {
          title: {
            text: '' // Will be set with data
          },
          labels: {
            formatter: function(val) {
              return val.toFixed(0);
            }
          }
        }
      };
    
    case 'line':
      return {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'line',
          zoom: {
            enabled: true
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        xaxis: {
          categories: [], // Will be filled with data
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        yaxis: {
          title: {
            text: '' // Will be set with data
          }
        }
      };
    
    default:
      return baseOptions;
  }
}

/**
 * Gets CSS variable value from the document
 * @param {string} varName - The CSS variable name (without --)
 * @returns {string|null} CSS variable value or null if not found
 */
export function getCssVariableValue(varName) {
  if (!varName) return null;
  
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(`--${varName}`).trim();
    
    return value || null;
  } catch (error) {
    console.error(`Error getting CSS variable --${varName}:`, error);
    return null;
  }
} 