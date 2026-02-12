import { Chart as ChartJS, defaults } from 'chart.js';

// Global Defaults
defaults.font.family = "'Inter', sans-serif";
defaults.color = '#9ca3af'; // gray-400

// Set scale defaults correctly for v4
defaults.set('scale', {
    grid: {
        color: 'rgba(75, 85, 99, 0.2)'
    },
    ticks: {
        color: '#9ca3af'
    }
});

// Tooltip Defaults
// Ensure tooltip configuration object exists
if (!defaults.plugins.tooltip) {
    defaults.plugins.tooltip = {};
}

Object.assign(defaults.plugins.tooltip, {
    titleFont: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
    bodyFont: { family: "'JetBrains Mono', monospace", size: 13 },
    backgroundColor: 'rgba(17, 24, 39, 0.9)', // gray-900
    borderColor: 'rgba(75, 85, 99, 0.5)',
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    displayColors: true,
});

// Animation Defaults
defaults.animation = false;

// Line Chart specific
if (!defaults.elements.line) defaults.elements.line = {};
if (!defaults.elements.point) defaults.elements.point = {};

defaults.elements.line.tension = 0.4;
defaults.elements.point.radius = 3;
defaults.elements.point.hoverRadius = 6;

export const getTealPinkGradient = (value, max) => {
    const ratio = Math.min(value / (max || 1), 1);
    // Teal (45, 212, 191) to Neon Pink (236, 72, 153)
    const r = Math.floor(45 + (236 - 45) * ratio);
    const g = Math.floor(212 + (72 - 212) * ratio);
    const b = Math.floor(191 + (153 - 191) * ratio);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
};

export default ChartJS;
