/**
 * chartConfig.js
 *
 * Description: Configuration utilities for ApexCharts
 * Usage:
 *     Import directly: import { getChartBaseOptions } from './charts/chartConfig.js';
 */

/**
 * Gets the computed value of a CSS variable.
 * @param {string} variableName - The CSS variable name (e.g., '--primary').
 * @returns {string} The computed HSL value string or a fallback.
 */
export function getCssVariableValue(variableName) {
  try {
    // Get the raw HSL value string (e.g., "40.7 92.9% 56.1%")
    const hslValue = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    // Return it directly if it contains spaces (likely the HSL components)
    if (hslValue.includes(" ")) {
      return hslValue;
    }
    // Otherwise, try parsing it as a color name or hex (less likely needed here)
    // This part might need a more robust color parsing library if complex fallbacks are needed
    console.warn(
      `CSS variable ${variableName} returned non-HSL value: ${hslValue}. Returning default.`
    );
    // Fallbacks based on the expected HSL structure
    if (variableName === "--primary") return "40.7 92.9% 56.1%";
    if (variableName === "--foreground") return "210 40% 96.1%";
    if (variableName === "--secondary") return "346.8 77.2% 49.8%";
    if (variableName === "--border") return "35.1 70% 45%";
    return "0 0% 100%"; // Default to white
  } catch (e) {
    console.error(`Error getting CSS variable ${variableName}:`, e);
    // Provide fallbacks matching the theme if lookup fails
    if (variableName === "--primary") return "40.7 92.9% 56.1%";
    if (variableName === "--foreground") return "210 40% 96.1%";
    if (variableName === "--secondary") return "346.8 77.2% 49.8%";
    if (variableName === "--border") return "35.1 70% 45%";
    return "0 0% 100%"; // Default fallback
  }
}

/**
 * Generates base configuration options for ApexCharts, using CSS variables.
 * @returns {object} Base ApexCharts options object.
 */
export function getChartBaseOptions() {
  try {
    // Fetch HSL values from CSS variables
    const foregroundHsl = getCssVariableValue("--foreground");
    const primaryHsl = getCssVariableValue("--primary");
    const secondaryHsl = getCssVariableValue("--secondary");
    const borderHsl = getCssVariableValue("--border");
    const backgroundHsl = getCssVariableValue("--background"); // Although background is transparent

    // Construct full HSL color strings
    const foregroundColor = `hsl(${foregroundHsl})`;
    const primaryColor = `hsl(${primaryHsl})`;
    const secondaryColor = `hsl(${secondaryHsl})`;
    const borderColor = `hsl(${borderHsl})`;
    const backgroundColor = "transparent"; // Use transparent for chart background

    // Create semi-transparent border color for grid lines
    const gridBorderColor = `hsla(${borderHsl}, 0.3)`;

    return {
      chart: {
        foreColor: foregroundColor,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        background: backgroundColor,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        padding: { top: 5, right: 10, bottom: 5, left: 10 },
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 400,
          animateGradually: { enabled: true, delay: 100 },
          dynamicAnimation: { enabled: true, speed: 250 },
        },
        dropShadow: { enabled: false }, // Keep it clean
      },
      theme: {
        mode: "dark",
        palette: "palette1", // Apex predefined palette, overridden by colors array
      },
      grid: {
        borderColor: gridBorderColor, // Use semi-transparent border color
        xaxis: { lines: { show: false } }, // Cleaner look
        yaxis: { lines: { show: true } }, // Show horizontal lines
        padding: { left: 5, right: 5 },
      },
      tooltip: {
        theme: "dark", // Use Apex dark theme tooltip
        style: { fontSize: "12px", fontFamily: "Inter, sans-serif" },
        x: { formatter: (val) => val }, // Default X formatter
        y: {
          // Default Y formatter (can be overridden per chart)
          formatter: (val) =>
            val !== undefined && val !== null
              ? new Intl.NumberFormat().format(val)
              : "",
        },
      },
      // Define a consistent color palette using HSL theme colors
      colors: [
        primaryColor, // Amber 500
        secondaryColor, // Rose 600
        "hsl(199, 89%, 57%)", // Sky 500
        "hsl(145, 63%, 49%)", // Emerald 500
        "hsl(26, 83%, 56%)", // Orange 600
        "hsl(48, 96%, 53%)", // Yellow 500
        "hsl(262, 52%, 58%)", // Violet 500
        "hsl(340, 82%, 52%)", // Pink 600
      ],
      xaxis: {
        labels: {
          style: { colors: foregroundColor, fontSize: "10px" },
          trim: true,
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          maxHeight: 80, // Allow more space for rotated labels
        },
        tooltip: { enabled: false }, // Usually redundant with main tooltip
        axisBorder: { show: true, color: borderColor },
        axisTicks: { show: true, color: borderColor },
        // Add title placeholder (can be overridden)
        title: {
          text: undefined,
          style: {
            fontSize: "10px",
            color: foregroundColor,
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: { colors: foregroundColor, fontSize: "10px" },
          // Default Y-axis label formatter (abbreviate large numbers)
          formatter: function (val) {
            if (val === null || val === undefined) return "";
            if (Math.abs(val) >= 1000000)
              return (val / 1000000).toFixed(1) + "M";
            if (Math.abs(val) >= 1000) return (val / 1000).toFixed(0) + "K";
            return new Intl.NumberFormat().format(Math.round(val)); // Round integers for cleaner display
          },
        },
        axisBorder: { show: false }, // Hide Y axis line for cleaner look
        axisTicks: { show: false }, // Hide Y axis ticks
        // Add title placeholder (can be overridden)
        title: {
          text: undefined,
          style: {
            fontSize: "10px",
            color: foregroundColor,
            fontWeight: 400,
          },
        },
      },
      dataLabels: { enabled: false }, // Keep charts clean by default
      legend: {
        position: "bottom",
        fontSize: "11px",
        fontFamily: "Inter, sans-serif",
        labels: { colors: foregroundColor },
        markers: { radius: 3, width: 8, height: 8 },
        itemMargin: { horizontal: 8, vertical: 3 },
        offsetY: 5,
      },
      stroke: {
        // Default stroke settings (can be overridden)
        show: true,
        curve: "smooth",
        lineCap: "butt",
        width: 2,
        dashArray: 0,
      },
      markers: {
        // Default marker settings (for line/scatter/radar)
        size: 0, // Hide markers by default on line charts
        hover: { sizeOffset: 4 },
      },
    };
  } catch (e) {
    console.error("Error in getChartBaseOptions:", e);
    // Return minimal defaults if CSS variable lookup fails
    return {
      chart: { toolbar: { show: true, tools: { download: true } } },
      theme: { mode: "dark" },
      grid: { borderColor: "rgba(255,255,255,0.2)" },
      tooltip: { theme: "dark" },
      colors: ["#ffb300", "#f44336", "#2196f3", "#4caf50", "#ff9800"],
    };
  }
} 