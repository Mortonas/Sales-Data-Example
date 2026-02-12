import { Chart, defaults } from 'chart.js';

console.log('Chart version:', Chart.version);
console.log('defaults.set type:', typeof defaults.set);
console.log('defaults keys:', Object.keys(defaults));

try {
    defaults.font.family = 'Inter';
    console.log('defaults.font.family set successfully');
} catch (e) {
    console.error('Error setting defaults.font.family:', e.message);
}

try {
    defaults.set('scale', { grid: { color: 'red' } });
    console.log('defaults.set called successfully');
} catch (e) {
    console.error('Error calling defaults.set:', e.message);
}
